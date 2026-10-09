#pragma once
// Bounded integer-only JSON for the private phase03 registry. No external parser.
#include <charconv>
#include <map>
#include <stdexcept>
#include <string>
#include <type_traits>
#include <variant>
#include <vector>
namespace aether::vdisplay {
struct Json {
 using Array=std::vector<Json>;using Object=std::map<std::string,Json>;
 std::variant<std::nullptr_t,bool,int64_t,std::string,Array,Object> value=nullptr;
 Json()=default;Json(std::nullptr_t){}Json(bool v):value(v){}template<class T> requires(std::is_integral_v<T>&&!std::is_same_v<T,bool>) Json(T v):value(static_cast<int64_t>(v)){}Json(const char* v):value(std::string(v)){}Json(std::string v):value(std::move(v)){}Json(Array v):value(std::move(v)){}Json(Object v):value(std::move(v)){}
 bool null()const{return std::holds_alternative<std::nullptr_t>(value);}
 const Json& at(const std::string& k)const{return std::get<Object>(value).at(k);}Json& operator[](const std::string& k){return std::get<Object>(value)[k];}
 const Array& array()const{return std::get<Array>(value);}Array& array(){return std::get<Array>(value);}
 std::string str()const{return std::get<std::string>(value);}int64_t number()const{return std::get<int64_t>(value);}bool boolean()const{return std::get<bool>(value);}
 static std::string Quote(const std::string& s){std::string o="\"";const char* h="0123456789abcdef";for(unsigned char c:s){if(c=='"'||c=='\\'){o+='\\';o+=c;}else if(c<32){o+="\\u00";o+=h[c>>4];o+=h[c&15];}else o+=c;}return o+'"';}
 std::string dump()const{if(null())return "null";if(auto v=std::get_if<bool>(&value))return *v?"true":"false";if(auto v=std::get_if<int64_t>(&value))return std::to_string(*v);if(auto v=std::get_if<std::string>(&value))return Quote(*v);std::string o;bool first=true;if(auto a=std::get_if<Array>(&value)){o="[";for(const auto& v:*a){if(!first)o+=',';first=false;o+=v.dump();}return o+']';}o="{";for(const auto& [k,v]:std::get<Object>(value)){if(!first)o+=',';first=false;o+=Quote(k)+':'+v.dump();}return o+'}';}
 static Json parse(const std::string& text){
  if(text.size()>2*1024*1024)throw std::runtime_error("registry exceeds 2MiB");
  struct Parser{const std::string& s;size_t p=0,count=0;void ws(){while(p<s.size()&&(s[p]==' '||s[p]=='\r'||s[p]=='\n'||s[p]=='\t'))++p;}[[noreturn]]void bad(){throw std::runtime_error("invalid registry JSON");}char take(){if(p>=s.size())bad();return s[p++];}
   std::string string(){if(take()!='"')bad();std::string o;while(true){char c=take();if(c=='"')return o;if(static_cast<unsigned char>(c)<32)bad();if(c=='\\'){c=take();switch(c){case '"':case '\\':case '/':break;case 'n':c='\n';break;case 'r':c='\r';break;case 't':c='\t';break;case 'b':c='\b';break;case 'f':c='\f';break;case 'u':{unsigned n=0;for(int i=0;i<4;++i){char h=take();n=n*16+(h>='0'&&h<='9'?h-'0':h>='a'&&h<='f'?h-'a'+10:h>='A'&&h<='F'?h-'A'+10:256);if(n>0xffff)bad();}if(n>=0xd800&&n<=0xdfff)bad();if(n<128)o+=static_cast<char>(n);else if(n<2048){o+=static_cast<char>(192|(n>>6));o+=static_cast<char>(128|(n&63));}else{o+=static_cast<char>(224|(n>>12));o+=static_cast<char>(128|((n>>6)&63));o+=static_cast<char>(128|(n&63));}continue;}default:bad();}}o+=c;if(o.size()>65536)bad();}}
   Json read(int depth=0){ws();if(++count>100000||depth>24||p>=s.size())bad();char c=s[p];if(c=='"')return string();if(c=='['){++p;Array a;ws();if(p<s.size()&&s[p]==']'){++p;return a;}while(true){a.push_back(read(depth+1));ws();c=take();if(c==']')return a;if(c!=',')bad();}}if(c=='{'){++p;Object o;ws();if(p<s.size()&&s[p]=='}'){++p;return o;}while(true){ws();auto k=string();ws();if(take()!=':')bad();auto v=read(depth+1);if(!o.emplace(k,std::move(v)).second)bad();ws();c=take();if(c=='}')return o;if(c!=',')bad();}}for(const auto& [word,v]:std::vector<std::pair<std::string,Json>>{{"true",true},{"false",false},{"null",nullptr}}){if(s.compare(p,word.size(),word)==0){p+=word.size();return v;}}size_t start=p;if(c=='-')++p;if(p>=s.size()||s[p]<'0'||s[p]>'9')bad();if(s[p]=='0')++p;else while(p<s.size()&&s[p]>='0'&&s[p]<='9')++p;int64_t n=0;const auto r=std::from_chars(s.data()+start,s.data()+p,n);if(r.ec!=std::errc{}||r.ptr!=s.data()+p)bad();return n;}
  } parser{text};auto result=parser.read();parser.ws();if(parser.p!=text.size())parser.bad();return result;
 }
};
}
