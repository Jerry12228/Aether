#include <botan/zfec.h>
#include <algorithm>
#include <atomic>
#include <charconv>
#include <cstdint>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>
#if defined(_WIN32)
#include <fcntl.h>
#include <io.h>
#endif

using Bytes = std::vector<uint8_t>;
using Shares = std::vector<Bytes>;
constexpr size_t maximum_share_bytes = 1024;
constexpr size_t maximum_input_bytes = 255 * (maximum_share_bytes + 4);

void require(bool condition) { if(!condition) throw std::invalid_argument("bounds"); }
size_t number(const char* text) {
  size_t value = 0;
  const std::string input(text);
  const auto parsed = std::from_chars(input.data(), input.data() + input.size(), value);
  require(parsed.ec == std::errc{} && parsed.ptr == input.data() + input.size());
  return value;
}
void bounds(size_t k, size_t n) { require(k >= 1 && k <= n && n <= 255); }
Bytes input() {
  Bytes bytes;
  for(char c; std::cin.get(c);) {
    require(bytes.size() < maximum_input_bytes);
    bytes.push_back(static_cast<uint8_t>(static_cast<unsigned char>(c)));
  }
  return bytes;
}
std::string hex(const Bytes& bytes) {
  constexpr char digits[] = "0123456789abcdef";
  std::string result;
  for(const auto b : bytes) { result += digits[b >> 4]; result += digits[b & 15]; }
  return result;
}
Shares encode(const Botan::ZFEC& codec, const Bytes& bytes) {
  const auto k = codec.recovery_threshold();
  require(!bytes.empty() && bytes.size() % k == 0 && bytes.size() / k <= maximum_share_bytes);
  Shares result(codec.generated_shares());
  codec.encode(bytes.data(), bytes.size(), [&](size_t id, const uint8_t* data, size_t length) {
    require(id < result.size() && length == bytes.size() / k && result[id].empty());
    result[id].assign(data, data + length);
  });
  require(std::all_of(result.begin(), result.end(), [](const auto& share) { return !share.empty(); }));
  return result;
}
Shares decode(const Botan::ZFEC& codec, const std::map<size_t, Bytes>& owned) {
  require(owned.size() >= codec.recovery_threshold() && owned.size() <= codec.generated_shares());
  const auto length = owned.begin()->second.size();
  require(length >= 1 && length <= maximum_share_bytes);
  std::map<size_t, const uint8_t*> pointers;
  for(const auto& [id, bytes] : owned) {
    require(id < codec.generated_shares() && bytes.size() == length);
    pointers.emplace(id, bytes.data());
  }
  Shares result(codec.recovery_threshold());
  codec.decode_shares(pointers, length, [&](size_t id, const uint8_t* data, size_t size) {
    require(id < result.size() && size == length && result[id].empty());
    result[id].assign(data, data + size);
  });
  require(std::all_of(result.begin(), result.end(), [](const auto& share) { return !share.empty(); }));
  return result;
}
void print(const Shares& shares) {
  std::cout << "{\"ok\":true,\"shares\":[";
  for(size_t i = 0; i < shares.size(); ++i) {
    if(i != 0) std::cout << ',';
    std::cout << '"' << hex(shares[i]) << '"';
  }
  std::cout << "]}\n";
}
void concurrent() {
  const Bytes fixture{0, 1, 2, 3, 4, 5, 6, 7};
  // Zfec points are 0,2,4: p(4) = 3*p(0) + 2*p(2) over GF(256).
  const Bytes expected{8, 9, 10, 11};
  std::atomic<size_t> errors{0};
  const auto check = [&](const Botan::ZFEC& codec) {
    const auto shares = encode(codec, fixture);
    require(shares[2] == expected);
    require(decode(codec, {{1, shares[1]}, {2, shares[2]}}) == Shares({Bytes{0, 1, 2, 3}, Bytes{4, 5, 6, 7}}));
  };
  const auto run = [&](const Botan::ZFEC* shared) {
    std::vector<std::thread> threads;
    try {
      for(size_t i = 0; i < 8; ++i) threads.emplace_back([&] {
        try { for(size_t j = 0; j < 100; ++j) {
          if(shared) check(*shared); else { const Botan::ZFEC local(2, 3); check(local); }
        } } catch(...) { ++errors; }
      });
    } catch(...) { for(auto& thread : threads) thread.join(); throw; }
    for(auto& thread : threads) thread.join();
  };
  run(nullptr); // First static-table initialization occurs inside concurrent constructors.
  const Botan::ZFEC shared(2, 3);
  run(&shared);
  require(errors == 0);
  std::cout << "{\"ok\":true,\"checks\":1600,\"threadsJoined\":16}\n";
}
int main(int argc, char** argv) {
  try {
#if defined(_WIN32)
    require(_setmode(_fileno(stdin), _O_BINARY) != -1);
#endif
    require(argc >= 2);
    const std::string mode(argv[1]);
    if(mode == "asan-probe") {
      require(argc == 2);
      // Deliberate test-only failure proves the linked sanitizer is active.
      volatile uint8_t* bytes = new uint8_t[8]{};
      delete[] bytes;
      std::cout << static_cast<unsigned>(bytes[3]);
      return 0;
    }
    if(mode == "concurrent") { require(argc == 2); concurrent(); return 0; }
    require(argc == 4);
    const auto k = number(argv[2]), n = number(argv[3]);
    bounds(k, n); // Validate before the upstream constructor allocates N*K bytes.
    const auto bytes = input();
    const Botan::ZFEC codec(k, n);
    require(codec.provider() == "base");
    if(mode == "encode") { print(encode(codec, bytes)); return 0; }
    require(mode == "decode");
    std::map<size_t, Bytes> owned;
    for(size_t cursor = 0; cursor < bytes.size();) {
      require(bytes.size() - cursor >= 4);
      const auto id = (static_cast<size_t>(bytes[cursor]) << 8) | bytes[cursor + 1];
      const auto length = (static_cast<size_t>(bytes[cursor + 2]) << 8) | bytes[cursor + 3];
      cursor += 4;
      require(id < n && length >= 1 && length <= maximum_share_bytes && length <= bytes.size() - cursor && !owned.contains(id));
      owned.emplace(id, Bytes(bytes.begin() + static_cast<ptrdiff_t>(cursor), bytes.begin() + static_cast<ptrdiff_t>(cursor + length)));
      cursor += length;
    }
    print(decode(codec, owned));
    return 0;
  } catch(const std::exception&) {
    std::cout << "{\"ok\":false,\"reason\":\"bounds-or-native-rejection\"}\n";
    return 2;
  }
}
