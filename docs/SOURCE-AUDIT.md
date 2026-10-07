# 来源与发行审计

证据采集：2026-10-07T07:21:36.613Z。范围：九仓完整固定树。

结构校验 PASS；生产复用批准：无。逐文件索引见 [sources.json](baseline/sources.json)，固定来源见 [upstream-lock.json](../references/upstream-lock.json)。

| 仓库 | 固定 SHA | blob 文件 | gitlinks | 工作树 |
|---|---|---|---|---|
| apollo | adc5c5a0bd80831ce495434bb16aee2cd4175fb8 | 469 | 17 | clean |
| moonlight-android | b48494cb96bff23d8886c4775cc4f39a1075495d | 500 | 1 | clean |
| moonlight-common-c | f900dd4767759c7b9d0e93bcea666b55c69ea62f | 43 | 2 | clean |
| moonlight-ios | 02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a | 556 | 2 | clean |
| moonlight-qt | de2467e433821664cdd2224aad8c89a625be1ad9 | 311 | 3 | clean |
| sunshine | 7c23c32925d26c3ee7c33b25b2b0db75e35d561b | 567 | 16 | clean |
| virtual-audio-driver | bb34fba15faf569a6ae9bdea360bc1cf4821354e | 53 | 0 | clean |
| virtual-display-driver | d7244969b2aa8bb38e76d79505eda217996cefea | 100 | 1 | clean |
| windows-camera | 626f8b19c5f367602f2e89c6b314573d3776c9df | 365 | 0 | clean |

所有文件为 research-only；根许可仅候选证据，未知范围及缺失子模块内部源码保持阻断。FFI/C ABI 边界不自动免除组合义务。

本次实际核验 9 个仓库、2964 个文件；所列来源链均重核。完整数据含 2964 个 blob 文件、1332 个外部来源/定位符、751 条许可/通知候选；1261 个未决记录。下表展示子模块、库/驱动二进制及重点下载；图片/字体等嵌入内容与全部动态声明仍在 JSON 中，不省略其阻碍。只有固定对象身份、枚举与锚点经机器校验；扫描不是法律批准或动态构建穷尽证明。

## 重点审查发现

- **scope-no-implicit-gpl**：common-c 要求指定 ENet fork；两个 gitlink 已锁，内部源码未审计；GPL根文本不是逐文件/or-later授权证据。固定证据 `manual:scope-no-implicit-gpl`；阻碍 `review:scope-no-implicit-gpl`，责任阶段 2。
- **qt-lgpl-directory**：h264bitstream 有独立LGPL2.1文本；目录范围、源/包与链接义务单独审查。固定证据 `manual:qt-lgpl-directory`；阻碍 `review:qt-lgpl-directory`，责任阶段 2/10。
- **qt-wix-reciprocal**：WiX RtfTheme 明示Microsoft Reciprocal License与复制来源；引用的LICENSE.TXT未随该路径提供；主题不纳入拟生产复用。固定证据 `manual:qt-wix-reciprocal`；阻碍 `review:qt-wix-reciprocal`，责任阶段 39。
- **android-openssl**：OpenSSL头部为Apache2.0候选；四架构libcrypto.a已锁blob/SHA256，头部版本不证明预编译库完整对应源码。固定证据 `manual:android-openssl`；阻碍 `review:android-openssl`，责任阶段 2/28。
- **ios-ffmpeg-static**：FFmpeg头部声明N-112686-g3f890fbfd9；iOS/tvOS静态库摘要已锁，实际配置/对应源码及LGPL/GPL状态仍待查。固定证据 `manual:ios-ffmpeg-static`；阻碍 `review:ios-ffmpeg-static`，责任阶段 2/32。
- **ios-opus-script**：Opus脚本变量下载不等于包已锁；脚本Apache通知不替代库自身许可。固定证据 `manual:ios-opus-script`；阻碍 `review:ios-opus-script`，责任阶段 2/32。
- **apollo-sudovda-package**：INF引用SudoVDA.dll；固定树含接口、INF/CAT/CER和安装脚本，缺驱动DLL及完整源码/独立授权；签名未验证。固定证据 `manual:apollo-sudovda-package`；阻碍 `review:apollo-sudovda-package`，责任阶段 3/17/39。
- **apollo-third-party-assets**：NOTICE含Valve商标提示；图标/生成资源不因根GPL自动获准；Aether拟独立制作品牌资源。固定证据 `manual:apollo-third-party-assets`；阻碍 `review:apollo-third-party-assets`，责任阶段 2/39。
- **apollo-vigembus-download**：ViGEmBus下载入口声明SHA256；未下载/认证原包，不是已验证签名或再分发许可。固定证据 `manual:apollo-vigembus-download`；阻碍 `review:apollo-vigembus-download`，责任阶段 16/39。
- **virtual-audio-beta**：音频驱动README明示beta/test signing；默认安全配置生产路线阻断，PCM注入仍需Phase4原型。固定证据 `manual:virtual-audio-beta`；阻碍 `review:virtual-audio-beta`，责任阶段 4/21/39。
- **virtual-display-arm64**：VDD称Win11 24H2+ ARM64可能需要test signing；Signed/HDR表为上游声明，实际包/默认配置安装未验证。固定证据 `manual:virtual-display-arm64`；阻碍 `review:virtual-display-arm64`，责任阶段 3/17/39。
- **virtual-display-microsoft-origin**：VDD源码有Microsoft版权头部；样例来源范围独立追溯，根MIT不等于整个provider包已批准。固定证据 `manual:virtual-display-microsoft-origin`；阻碍 `review:virtual-display-microsoft-origin`，责任阶段 3/39。
- **camera-independent-mit**：NetworkMediaStreamer独立MIT文本已单列；VirtualCamera样例、运行系统组件和Win10方案/发布包分别审查。固定证据 `manual:camera-independent-mit`；阻碍 `review:camera-independent-mit`，责任阶段 5/22/39。
- **gnu-combination-source**：GPLv3的5/6/10条按锁定许可对象核对；C ABI/FFI不自动免除组合与对应源码义务。官网抓取超时，官方FAQ检索可查。固定证据 `manual:gnu-combination-source`；阻碍 `review:gnu-combination-source`，责任阶段 2。

## 固定锚点

- apollo:root-license：`apollo@adc5c5a0bd80831ce495434bb16aee2cd4175fb8:LICENSE:1`，blob `f288702d2fa16d3cdf0035b15a9fcbc552cd88e7`；许可表达式未决，unresolved。
- manual:android-openssl：`moonlight-android@b48494cb96bff23d8886c4775cc4f39a1075495d:app/src/main/jni/moonlight-core/openssl/include/openssl/opensslv.h:7`，blob `43daf6c9b1f91ddaf2dbe7a900b3d87b95ae0495`；许可表达式未决，unresolved。
- manual:apollo-sudovda-package：`apollo@adc5c5a0bd80831ce495434bb16aee2cd4175fb8:src_assets/windows/drivers/sudovda/SudoVDA.inf:23`，blob `f1958d58ecae8868d2bafc45b36144df057dbb54`；许可表达式未决，unresolved。
- manual:apollo-third-party-assets：`apollo@adc5c5a0bd80831ce495434bb16aee2cd4175fb8:NOTICE:1`，blob `7ad027d71155b3f063164d9b6bd718af02d704cf`；许可表达式未决，unresolved。
- manual:apollo-vigembus-download：`apollo@adc5c5a0bd80831ce495434bb16aee2cd4175fb8:cmake/packaging/windows.cmake:13`，blob `5170111da93770ff542e46af7a8db0f4ed11ff4b`；许可表达式未决，unresolved。
- manual:camera-independent-mit：`windows-camera@626f8b19c5f367602f2e89c6b314573d3776c9df:Samples/NetworkMediaStreamer/LICENSE:1`，blob `f86433d6dc96b44c2dc449c6f694b1f46b6c21e6`；许可表达式未决，unresolved。
- manual:gnu-combination-source：`moonlight-common-c@f900dd4767759c7b9d0e93bcea666b55c69ea62f:LICENSE.txt:208`，blob `03dfa3ef8f18c254968ccccd2df010f74d6344eb`；许可表达式未决，unresolved。
- manual:ios-ffmpeg-static：`moonlight-ios@02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a:libs/FFmpeg/include/libavutil/ffversion.h:4`，blob `0ce0c688b9460e364fdf21628c26d246c21a7c0d`；许可表达式未决，unresolved。
- manual:ios-opus-script：`moonlight-ios@02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a:BuildScripts/build-libopus.sh:82`，blob `aa4e568584e0e6f89a8c15c48de6c35bd662f2cc`；许可表达式未决，unresolved。
- manual:qt-lgpl-directory：`moonlight-qt@de2467e433821664cdd2224aad8c89a625be1ad9:h264bitstream/LICENSE:2`，blob `28f18896982452a636c971c9ff67c287164ab5d1`；许可表达式未决，unresolved。
- manual:qt-wix-reciprocal：`moonlight-qt@de2467e433821664cdd2224aad8c89a625be1ad9:wix/MoonlightSetup/RtfTheme.xml:2`，blob `ab2bd15766551c6a32a6a9011ff21fd48071c152`；许可表达式未决，unresolved。
- manual:scope-no-implicit-gpl：`moonlight-common-c@f900dd4767759c7b9d0e93bcea666b55c69ea62f:README.md:9`，blob `63d5788bdcd0f599a268b7b31f4004830b83e8ea`；许可表达式未决，unresolved。
- manual:virtual-audio-beta：`virtual-audio-driver@bb34fba15faf569a6ae9bdea360bc1cf4821354e:README.md:2`，blob `454d86a70c835c49d4c0ebe63975204f3c456767`；许可表达式未决，unresolved。
- manual:virtual-display-arm64：`virtual-display-driver@d7244969b2aa8bb38e76d79505eda217996cefea:README.md:100`，blob `83106c24a4fb98188d4bc7d9f2c37aa60ba64199`；许可表达式未决，unresolved。
- manual:virtual-display-microsoft-origin：`virtual-display-driver@d7244969b2aa8bb38e76d79505eda217996cefea:Virtual Display Driver (HDR)/MttVDD/Driver.cpp:3`，blob `3145b04a0b7dd14400c9f370f11d3f4ffdab5656`；许可表达式未决，unresolved。
- moonlight-android:root-license：`moonlight-android@b48494cb96bff23d8886c4775cc4f39a1075495d:LICENSE.txt:1`，blob `94a9ed024d3859793618152ea559a168bbcbb5e2`；许可表达式未决，unresolved。
- moonlight-common-c:root-license：`moonlight-common-c@f900dd4767759c7b9d0e93bcea666b55c69ea62f:LICENSE.txt:1`，blob `03dfa3ef8f18c254968ccccd2df010f74d6344eb`；许可表达式未决，unresolved。
- moonlight-ios:root-license：`moonlight-ios@02dc9780496eeeac6d01c8bbdccb8b6fe71ef28a:LICENSE.txt:1`，blob `10c41a51f0bcea8ff3d6ee884079808f62364294`；许可表达式未决，unresolved。
- moonlight-qt:h264bitstream/LICENSE:directory-license：`moonlight-qt@de2467e433821664cdd2224aad8c89a625be1ad9:h264bitstream/LICENSE:1`，blob `28f18896982452a636c971c9ff67c287164ab5d1`；许可表达式未决，unresolved。
- moonlight-qt:root-license：`moonlight-qt@de2467e433821664cdd2224aad8c89a625be1ad9:LICENSE:1`，blob `9cecc1d4669ee8af2ca727a5d8cde10cd8b2d7cc`；许可表达式未决，unresolved。
- moonlight-qt:wix/MoonlightSetup/license.rtf:directory-license：`moonlight-qt@de2467e433821664cdd2224aad8c89a625be1ad9:wix/MoonlightSetup/license.rtf:1`，blob `02874def308135be8293d4207474b4fee12de452`；许可表达式未决，unresolved。
- sunshine:root-license：`sunshine@7c23c32925d26c3ee7c33b25b2b0db75e35d561b:LICENSE:1`，blob `f288702d2fa16d3cdf0035b15a9fcbc552cd88e7`；许可表达式未决，unresolved。
- virtual-audio-driver:root-license：`virtual-audio-driver@bb34fba15faf569a6ae9bdea360bc1cf4821354e:LICENSE:1`，blob `adf74e903f4c9adb2d61a04f52506941fcb518ea`；MIT，unresolved。
- virtual-display-driver:Virtual-Audio-Driver (Latest Stable)/LICENSE:directory-license：`virtual-display-driver@d7244969b2aa8bb38e76d79505eda217996cefea:Virtual-Audio-Driver (Latest Stable)/LICENSE:1`，blob `adf74e903f4c9adb2d61a04f52506941fcb518ea`；MIT，unresolved。
- virtual-display-driver:root-license：`virtual-display-driver@d7244969b2aa8bb38e76d79505eda217996cefea:LICENSE:1`，blob `1c09fa8f74f33c46046b942c913f6c69709d2ba9`；MIT，unresolved。
- windows-camera:Samples/NetworkMediaStreamer/LICENSE:directory-license：`windows-camera@626f8b19c5f367602f2e89c6b314573d3776c9df:Samples/NetworkMediaStreamer/LICENSE:1`，blob `f86433d6dc96b44c2dc449c6f694b1f46b6c21e6`；MIT，unresolved。
- windows-camera:root-license：`windows-camera@626f8b19c5f367602f2e89c6b314573d3776c9df:LICENSE:1`，blob `21071075c24599ee98254f702bcfc504cdc275a6`；MIT，unresolved。

## 外部来源

| ID | 类型 | 路径 | URL / 固定值 | 状态 |
|---|---|---|---|---|
| apollo:binary:src_assets/windows/drivers/sudovda/sudovda.cat | binary | src_assets/windows/drivers/sudovda/sudovda.cat |  / sha256:2f9189de5604bec9d86f51640cc540639e394d9ad0f8e689129375e95f2d22f8 | present |
| apollo:binary:src_assets/windows/drivers/sudovda/sudovda.cer | binary | src_assets/windows/drivers/sudovda/sudovda.cer |  / sha256:6accdcd519f6179d967db4eaa20ecf25a732ba30e87f4cffebc768b2c13c9007 | present |
| apollo:driver-candidate | driver | src_assets/windows/drivers/sudovda/SudoVDA.dll |  / adc5c5a0bd80831ce495434bb16aee2cd4175fb8 | absent |
| apollo:gitlink:packaging/linux/flatpak/deps/flatpak-builder-tools | gitlink | packaging/linux/flatpak/deps/flatpak-builder-tools | https://github.com/flatpak/flatpak-builder-tools.git / ea92dc22ab7e4ab44133407b883c9a6792e54302 | absent |
| apollo:gitlink:packaging/linux/flatpak/deps/shared-modules | gitlink | packaging/linux/flatpak/deps/shared-modules | https://github.com/flathub/shared-modules.git / 231e052557e37e120c94d584881f43daac3391fd | absent |
| apollo:gitlink:third-party/Simple-Web-Server | gitlink | third-party/Simple-Web-Server | https://github.com/ClassicOldSong/Simple-Web-Server / 5b29c7004cc53252a8eff06d62899c8847ada971 | absent |
| apollo:gitlink:third-party/TPCircularBuffer | gitlink | third-party/TPCircularBuffer | https://github.com/michaeltyson/TPCircularBuffer.git / cc520397504bb72bc6df79ff03eb72988a6dc50d | absent |
| apollo:gitlink:third-party/ViGEmClient | gitlink | third-party/ViGEmClient | https://github.com/LizardByte/Virtual-Gamepad-Emulation-Client.git / 8d71f6740ffff4671cdadbca255ce528e3cd3fef | absent |
| apollo:gitlink:third-party/build-deps | gitlink | third-party/build-deps | https://github.com/LizardByte/build-deps.git / a9a7f86328963837e30e21c8901faba00fe81542 | absent |
| apollo:gitlink:third-party/doxyconfig | gitlink | third-party/doxyconfig | https://github.com/LizardByte/doxyconfig.git / 1188ef2b96efb3e003a591ee01714339c2d9161c | absent |
| apollo:gitlink:third-party/googletest | gitlink | third-party/googletest | https://github.com/google/googletest.git / 52eb8108c5bdec04579160ae17225d66034bd723 | absent |
| apollo:gitlink:third-party/inputtino | gitlink | third-party/inputtino | https://github.com/games-on-whales/inputtino.git / 504f0abc7da8ebc351f8300fb2ed98db5438ee48 | absent |
| apollo:gitlink:third-party/libdisplaydevice | gitlink | third-party/libdisplaydevice | https://github.com/LizardByte/libdisplaydevice.git / f31e46d8736fa6932d34c1417111e60ca507b29f | absent |
| apollo:gitlink:third-party/moonlight-common-c | gitlink | third-party/moonlight-common-c | https://github.com/ClassicOldSong/moonlight-common-c / c999436858471dfefa7617af3b7dc03ec1644ce4 | absent |
| apollo:gitlink:third-party/nanors | gitlink | third-party/nanors | https://github.com/sleepybishop/nanors.git / 19f07b513e924e471cadd141943c1ec4adc8d0e0 | absent |
| apollo:gitlink:third-party/nv-codec-headers | gitlink | third-party/nv-codec-headers | https://github.com/FFmpeg/nv-codec-headers.git / 22441b505d9d9afc1e3002290820909846c24bdc | absent |
| apollo:gitlink:third-party/nvapi-open-source-sdk | gitlink | third-party/nvapi-open-source-sdk | https://github.com/LizardByte/nvapi-open-source-sdk.git / cce4e90b629f712ae6eebafac97739bd1196cdef | absent |
| apollo:gitlink:third-party/tray | gitlink | third-party/tray | https://github.com/LizardByte/tray.git / 0309a7cb84aad25079b60c40d1eae0bacd05b26d | absent |
| apollo:gitlink:third-party/wayland-protocols | gitlink | third-party/wayland-protocols | https://gitlab.freedesktop.org/wayland/wayland-protocols.git / 0091197f5c1b1f2c131f1410e99f9c95d50646be | absent |
| apollo:gitlink:third-party/wlr-protocols | gitlink | third-party/wlr-protocols | https://gitlab.freedesktop.org/wlroots/wlr-protocols.git / a741f0ac5d655338a5100fc34bc8cec87d237346 | absent |
| apollo:locator:.gitmodules:11:0 | download | .gitmodules | https://github.com/LizardByte/build-deps.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:15:0 | download | .gitmodules | https://github.com/LizardByte/doxyconfig.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:19:0 | download | .gitmodules | https://github.com/google/googletest.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:23:0 | download | .gitmodules | https://github.com/games-on-whales/inputtino.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:27:0 | download | .gitmodules | https://github.com/LizardByte/libdisplaydevice.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:31:0 | download | .gitmodules | https://github.com/sleepybishop/nanors.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:35:0 | download | .gitmodules | https://github.com/FFmpeg/nv-codec-headers.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:39:0 | download | .gitmodules | https://github.com/LizardByte/nvapi-open-source-sdk.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/flatpak/flatpak-builder-tools.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:47:0 | download | .gitmodules | https://github.com/michaeltyson/TPCircularBuffer.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:51:0 | download | .gitmodules | https://github.com/LizardByte/tray.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:55:0 | download | .gitmodules | https://github.com/LizardByte/Virtual-Gamepad-Emulation-Client.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:59:0 | download | .gitmodules | https://gitlab.freedesktop.org/wayland/wayland-protocols.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:63:0 | download | .gitmodules | https://gitlab.freedesktop.org/wlroots/wlr-protocols.git / 未锁包摘要 | absent |
| apollo:locator:.gitmodules:7:0 | download | .gitmodules | https://github.com/flathub/shared-modules.git / 未锁包摘要 | absent |
| apollo:locator:cmake/dependencies/Boost_Sunshine.cmake:57:0 | download | cmake/dependencies/Boost_Sunshine.cmake | https://github.com/boostorg/boost/releases/download/boost-${BOOST_VERSION}/boost-${BOOST_VERSION}-cmake.tar.xz / 未锁包摘要 | absent |
| apollo:locator:cmake/dependencies/nlohmann_json.cmake:20:0 | download | cmake/dependencies/nlohmann_json.cmake | https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz / 未锁包摘要 | absent |
| apollo:locator:cmake/packaging/windows.cmake:10:0 | download | cmake/packaging/windows.cmake | https://github.com/nefarius/ViGEmBus/releases/download/v1.21.442.0/ViGEmBus_1.21.442_x64_x86_arm64.exe / 未锁包摘要 | absent |
| apollo:locator:scripts/linux_build.sh:338:0 | download | scripts/linux_build.sh | https://developer.download.nvidia.com/compute/cuda/ / 未锁包摘要 | absent |
| apollo:locator:scripts/linux_build.sh:471:0 | download | scripts/linux_build.sh | https://github.com/Kitware/CMake/releases/download/v / 未锁包摘要 | absent |
| apollo:locator:scripts/linux_build.sh:489:0 | download | scripts/linux_build.sh | https://github.com/doxygen/doxygen/releases/download/Release_${_doxygen_min}/doxygen-${doxygen_min}.src.tar.gz / 未锁包摘要 | absent |
| moonlight-android:binary:app/src/main/jni/moonlight-core/openssl/arm64-v8a/libcrypto.a | binary | app/src/main/jni/moonlight-core/openssl/arm64-v8a/libcrypto.a |  / sha256:d593ba8f576db9ff20d058bee7f0f154b4e000b447548533bc8f16eb95290b54 | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/openssl/armeabi-v7a/libcrypto.a | binary | app/src/main/jni/moonlight-core/openssl/armeabi-v7a/libcrypto.a |  / sha256:76abf9210207bb74d19c758e898090f5b4c45fdf1c9a9e8613431c7d9455d904 | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/openssl/x86/libcrypto.a | binary | app/src/main/jni/moonlight-core/openssl/x86/libcrypto.a |  / sha256:88699686084a5cf6068be378b86b7e90f9ea646f6aca09b17303d8cdbe933aff | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/openssl/x86_64/libcrypto.a | binary | app/src/main/jni/moonlight-core/openssl/x86_64/libcrypto.a |  / sha256:8502529fe9992e4f67962a5c5d98139ec37cd9ccacac341622500bf399ad52ca | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/opus/arm64-v8a/libopus.a | binary | app/src/main/jni/moonlight-core/opus/arm64-v8a/libopus.a |  / sha256:d6c39b9135017ab76a42e364569f18622e6e3df691ac2d1d9d36ee4a02eb2e13 | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/opus/armeabi-v7a/libopus.a | binary | app/src/main/jni/moonlight-core/opus/armeabi-v7a/libopus.a |  / sha256:3925fecb62e4a75095d658bcc1c4e309712a330699825b7790880cf21497719e | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/opus/x86/libopus.a | binary | app/src/main/jni/moonlight-core/opus/x86/libopus.a |  / sha256:ed39b86eee0868d911516c4034e8395af31aaa7bfb8ac7e4415846b59ee28d1f | present |
| moonlight-android:binary:app/src/main/jni/moonlight-core/opus/x86_64/libopus.a | binary | app/src/main/jni/moonlight-core/opus/x86_64/libopus.a |  / sha256:7d8214860fdab5a8bf0d15125a2ae7baf80169dc4e6ee1ffa2633bb2e7de7a8b | present |
| moonlight-android:binary:gradle/wrapper/gradle-wrapper.jar | binary | gradle/wrapper/gradle-wrapper.jar |  / sha256:575098db54a998ff1c6770b352c3b16766c09848bee7555dab09afc34e8cf590 | present |
| moonlight-android:gitlink:app/src/main/jni/moonlight-core/moonlight-common-c | gitlink | app/src/main/jni/moonlight-core/moonlight-common-c | https://github.com/moonlight-stream/moonlight-common-c.git / 874ac9548f1bd6f095ef2b435c42cdde460e7821 | absent |
| moonlight-android:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/moonlight-stream/moonlight-common-c.git / 未锁包摘要 | absent |
| moonlight-android:locator:build.gradle:16:0 | download | build.gradle | https://jitpack.io / 未锁包摘要 | absent |
| moonlight-common-c:gitlink:enet | gitlink | enet | https://github.com/cgutman/enet.git / aca87840b57f045a1f7f9299e4b1b9b8e2a5e2f1 | absent |
| moonlight-common-c:gitlink:nanors | gitlink | nanors | https://github.com/sleepybishop/nanors.git / b1e3c22ca0cdc0bb83e3cd6ed1a2fc77869ed99a | absent |
| moonlight-common-c:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/cgutman/enet.git / 未锁包摘要 | absent |
| moonlight-common-c:locator:.gitmodules:6:0 | download | .gitmodules | https://github.com/sleepybishop/nanors.git / 未锁包摘要 | absent |
| moonlight-ios:binary:libs/FFmpeg/lib/iOS-Sim/libavcodec.a | binary | libs/FFmpeg/lib/iOS-Sim/libavcodec.a |  / sha256:318fd5ca480e69d95d98dd26d53f38c7a020de0958bed505a801a12bdd9550cc | present |
| moonlight-ios:binary:libs/FFmpeg/lib/iOS-Sim/libavformat.a | binary | libs/FFmpeg/lib/iOS-Sim/libavformat.a |  / sha256:0aa7ff175f943d7f1722bf51c5ca72f8d69208338e950f15c9a0321b495bd84c | present |
| moonlight-ios:binary:libs/FFmpeg/lib/iOS-Sim/libavutil.a | binary | libs/FFmpeg/lib/iOS-Sim/libavutil.a |  / sha256:3caab4eea739d5a2f8e0de6a9144e27feb7b840606e9cdead7836feece4e12d6 | present |
| moonlight-ios:binary:libs/FFmpeg/lib/iOS/libavcodec.a | binary | libs/FFmpeg/lib/iOS/libavcodec.a |  / sha256:6e9c99a06a9d4bd64634f487a3265eca15d956d59804f28ec64e3899312d86e4 | present |
| moonlight-ios:binary:libs/FFmpeg/lib/iOS/libavformat.a | binary | libs/FFmpeg/lib/iOS/libavformat.a |  / sha256:7a881ad35ae365806a446f194267ac761f3a6e52c65e00edc9f840b6a6388051 | present |
| moonlight-ios:binary:libs/FFmpeg/lib/iOS/libavutil.a | binary | libs/FFmpeg/lib/iOS/libavutil.a |  / sha256:c6d210e33c59f0cffadcc3825504a6a2bc4855934fec6aee3591f2be3398065a | present |
| moonlight-ios:binary:libs/FFmpeg/lib/tvOS-Sim/libavcodec.a | binary | libs/FFmpeg/lib/tvOS-Sim/libavcodec.a |  / sha256:2cff2bc2c6bb3538d0e480c1bae1ea81eaee8421becd18c9e031d6b863ae5f14 | present |
| moonlight-ios:binary:libs/FFmpeg/lib/tvOS-Sim/libavformat.a | binary | libs/FFmpeg/lib/tvOS-Sim/libavformat.a |  / sha256:9d0dbb6080cd4dcdcb68a9dbf6fdbbdace3ffe6d6a3e8c729db68832005ca9ef | present |
| moonlight-ios:binary:libs/FFmpeg/lib/tvOS-Sim/libavutil.a | binary | libs/FFmpeg/lib/tvOS-Sim/libavutil.a |  / sha256:7226f796025e7b00a43a8286490a5ed4d08162ba26585d38774e5222a8b41b42 | present |
| moonlight-ios:binary:libs/FFmpeg/lib/tvOS/libavcodec.a | binary | libs/FFmpeg/lib/tvOS/libavcodec.a |  / sha256:e2d076305df91637c65137ae58278f4e19c6e6764f8f6611c7e40f538c0e954a | present |
| moonlight-ios:binary:libs/FFmpeg/lib/tvOS/libavformat.a | binary | libs/FFmpeg/lib/tvOS/libavformat.a |  / sha256:1f1a6230d78194b4103b18b85397182adb1a3ce25e337b5937038bbcea476484 | present |
| moonlight-ios:binary:libs/FFmpeg/lib/tvOS/libavutil.a | binary | libs/FFmpeg/lib/tvOS/libavutil.a |  / sha256:8dfc839e59d302abc617d3c80b45ccf4d4e52103b325bf4fd36fab0d9391a0cf | present |
| moonlight-ios:binary:libs/SDL2/lib/iOS-Sim/libSDL2.a | binary | libs/SDL2/lib/iOS-Sim/libSDL2.a |  / sha256:a68b763366f4d603180232227d086acc05575467e5012040dea776bd45cee91f | present |
| moonlight-ios:binary:libs/SDL2/lib/iOS/libSDL2.a | binary | libs/SDL2/lib/iOS/libSDL2.a |  / sha256:8794ed9b30bfa9cf7992ca971a7ca86365cf4a575f44e83516d4969619b1c345 | present |
| moonlight-ios:binary:libs/SDL2/lib/tvOS-Sim/libSDL2.a | binary | libs/SDL2/lib/tvOS-Sim/libSDL2.a |  / sha256:dffae42d16159c3eedf43aa8931ef35bd074d24d0efafcdb8604d7a7079e1c91 | present |
| moonlight-ios:binary:libs/SDL2/lib/tvOS/libSDL2.a | binary | libs/SDL2/lib/tvOS/libSDL2.a |  / sha256:03a7ad43107de430d3cee27b450eefa45ea68f7854989c6505942bc119359395 | present |
| moonlight-ios:binary:libs/opus/lib/iOS-Sim/libopus.a | binary | libs/opus/lib/iOS-Sim/libopus.a |  / sha256:3296f7c993aba55396ba0e9efcd9cd12dc3c092c906d4af3de60a6fa74c2b32d | present |
| moonlight-ios:binary:libs/opus/lib/iOS/libopus.a | binary | libs/opus/lib/iOS/libopus.a |  / sha256:a2fbb2ac4e2c11177c6a8ec696c5e3a097527811c58f49afde70edd60dacb213 | present |
| moonlight-ios:binary:libs/opus/lib/tvOS-Sim/libopus.a | binary | libs/opus/lib/tvOS-Sim/libopus.a |  / sha256:f935480c8a0d91a6365a6731493a3ff91c3d451d3339a2dfe6a89e120a6f7e1e | present |
| moonlight-ios:binary:libs/opus/lib/tvOS/libopus.a | binary | libs/opus/lib/tvOS/libopus.a |  / sha256:ac1dd3d9a80987283f3baeff2a4a3b249611c155a46ed8fb739e45822034b777 | present |
| moonlight-ios:gitlink:X1Kit | gitlink | X1Kit | https://github.com/cgutman/X1Kit.git / 6e842ae9d5a21916d7c9693c7385d1ac672bc4fa | absent |
| moonlight-ios:gitlink:moonlight-common/moonlight-common-c | gitlink | moonlight-common/moonlight-common-c | https://github.com/moonlight-stream/moonlight-common-c.git / f900dd4767759c7b9d0e93bcea666b55c69ea62f | absent |
| moonlight-ios:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/moonlight-stream/moonlight-common-c.git / 未锁包摘要 | absent |
| moonlight-ios:locator:.gitmodules:6:0 | download | .gitmodules | https://github.com/cgutman/X1Kit.git / 未锁包摘要 | absent |
| moonlight-ios:locator:BuildScripts/build-libopus.sh:82:0 | download | BuildScripts/build-libopus.sh | http://downloads.xiph.org/releases/opus/opus-${VERSION}.tar.gz / 未锁包摘要 | absent |
| moonlight-ios:locator:Moonlight.xcodeproj/project.pbxproj:1338:0 | download | Moonlight.xcodeproj/project.pbxproj | https://github.com/krzyzanowskim/OpenSSL-Package.git / 未锁包摘要 | absent |
| moonlight-ios:locator:Moonlight.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved:7:0 | download | Moonlight.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved | https://github.com/krzyzanowskim/OpenSSL-Package.git / 未锁包摘要 | absent |
| moonlight-ios:locator:moonlight-common/moonlight-common.xcodeproj/project.pbxproj:761:0 | download | moonlight-common/moonlight-common.xcodeproj/project.pbxproj | https://github.com/krzyzanowskim/OpenSSL-Package.git / 未锁包摘要 | absent |
| moonlight-qt:gitlink:app/SDL_GameControllerDB | gitlink | app/SDL_GameControllerDB | https://github.com/gabomdq/SDL_GameControllerDB.git / 8d9fefd7b810f2541f78cc7a8ccbd185bc84c7a5 | absent |
| moonlight-qt:gitlink:moonlight-common-c/moonlight-common-c | gitlink | moonlight-common-c/moonlight-common-c | https://github.com/moonlight-stream/moonlight-common-c.git / f900dd4767759c7b9d0e93bcea666b55c69ea62f | absent |
| moonlight-qt:gitlink:qmdnsengine/qmdnsengine | gitlink | qmdnsengine/qmdnsengine | https://github.com/cgutman/qmdnsengine.git / 920c097ffa742e2968290f15d4dde6693aec02e5 | absent |
| moonlight-qt:locator:.github/workflows/build-appimage.yml:121:0 | download | .github/workflows/build-appimage.yml | https://code.videolan.org/videolan/dav1d.git / 未锁包摘要 | absent |
| moonlight-qt:locator:.github/workflows/build-appimage.yml:151:0 | download | .github/workflows/build-appimage.yml | https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage / 未锁包摘要 | absent |
| moonlight-qt:locator:.github/workflows/build-appimage.yml:152:0 | download | .github/workflows/build-appimage.yml | https://github.com/linuxdeploy/linuxdeploy-plugin-qt/releases/download/continuous/linuxdeploy-plugin-qt-x86_64.AppImage / 未锁包摘要 | absent |
| moonlight-qt:locator:.github/workflows/build-win-mac.yml:55:0 | download | .github/workflows/build-win-mac.yml | https://github.com/miurahr/aqtinstall.git@073e34d7c2ab4ae6961ed7cca690b3abd5ba5a7e / 未锁包摘要 | absent |
| moonlight-qt:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/moonlight-stream/moonlight-common-c.git / 未锁包摘要 | absent |
| moonlight-qt:locator:.gitmodules:6:0 | download | .gitmodules | https://github.com/cgutman/qmdnsengine.git / 未锁包摘要 | absent |
| moonlight-qt:locator:.gitmodules:9:0 | download | .gitmodules | https://github.com/gabomdq/SDL_GameControllerDB.git / 未锁包摘要 | absent |
| moonlight-qt:locator:setup-deps.ps1:17:0 | download | setup-deps.ps1 | https://github.com/$Organization/$PrebuiltRepo/releases/download/$Tag/$AssetName / 未锁包摘要 | absent |
| sunshine:gitlink:packaging/linux/flatpak/deps/flatpak-builder-tools | gitlink | packaging/linux/flatpak/deps/flatpak-builder-tools | https://github.com/flatpak/flatpak-builder-tools.git / 74697c75b630d7330e77250fc13cb5ea688d9479 | absent |
| sunshine:gitlink:third-party/Simple-Web-Server | gitlink | third-party/Simple-Web-Server | https://github.com/LizardByte-infrastructure/Simple-Web-Server.git / 546895a93a29062bb178367b46c7afb72da9881e | absent |
| sunshine:gitlink:third-party/TPCircularBuffer | gitlink | third-party/TPCircularBuffer | https://github.com/michaeltyson/TPCircularBuffer.git / cc520397504bb72bc6df79ff03eb72988a6dc50d | absent |
| sunshine:gitlink:third-party/ViGEmClient | gitlink | third-party/ViGEmClient | https://github.com/LizardByte/Virtual-Gamepad-Emulation-Client.git / 8d71f6740ffff4671cdadbca255ce528e3cd3fef | absent |
| sunshine:gitlink:third-party/build-deps | gitlink | third-party/build-deps | https://github.com/LizardByte/build-deps.git / bd28fbdd5511da8fc2ef303c381627a390045a78 | absent |
| sunshine:gitlink:third-party/dockle | gitlink | third-party/dockle | https://github.com/LizardByte/dockle.git / c1304a7ccabf41c9ab53579289174d7bf820b895 | absent |
| sunshine:gitlink:third-party/glad | gitlink | third-party/glad | https://github.com/Dav1dde/glad.git / 73db193f853e2ee079bf3ca8a64aa2eaf6459043 | absent |
| sunshine:gitlink:third-party/libdisplaydevice | gitlink | third-party/libdisplaydevice | https://github.com/LizardByte/libdisplaydevice.git / 6e9722f89103320c948dc1199066c9e17a69e88a | absent |
| sunshine:gitlink:third-party/libvirtualhid | gitlink | third-party/libvirtualhid | https://github.com/LizardByte/libvirtualhid.git / dc57a03569025304df8d85615febd508ad29b7de | absent |
| sunshine:gitlink:third-party/lizardbyte-common | gitlink | third-party/lizardbyte-common | https://github.com/LizardByte/lizardbyte-common.git / f9d91e1d29b7473f58e43acde4579da4e56c4abe | absent |
| sunshine:gitlink:third-party/moonlight-common-c | gitlink | third-party/moonlight-common-c | https://github.com/moonlight-stream/moonlight-common-c.git / f900dd4767759c7b9d0e93bcea666b55c69ea62f | absent |
| sunshine:gitlink:third-party/nvapi | gitlink | third-party/nvapi | https://github.com/NVIDIA/nvapi.git / 87dca625e83fd89a983e19b904e5f3a580da90d2 | absent |
| sunshine:gitlink:third-party/plasma-wayland-protocols | gitlink | third-party/plasma-wayland-protocols | https://github.com/KDE/plasma-wayland-protocols.git / c5ac4db818f4a575a6ccfe0065b73ecfaba6e93e | absent |
| sunshine:gitlink:third-party/tray | gitlink | third-party/tray | https://github.com/LizardByte/tray.git / c1f2a8ab56dd399b881fb7aeab4fe4fc9c58188d | absent |
| sunshine:gitlink:third-party/wayland-protocols | gitlink | third-party/wayland-protocols | https://github.com/LizardByte-infrastructure/wayland-protocols.git / ee78491a237eaff9389a0ccf8680521d074407d3 | absent |
| sunshine:gitlink:third-party/wlr-protocols | gitlink | third-party/wlr-protocols | https://github.com/LizardByte-infrastructure/wlr-protocols.git / bf4fc79abc359eea5a0edec0ac6d4a2b2955f82a | absent |
| sunshine:locator:.github/workflows/ci-linux.yml:175:0 | download | .github/workflows/ci-linux.yml | https://github.com/ReenigneArcher/appimagelint.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:11:0 | download | .gitmodules | https://github.com/LizardByte/dockle.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:15:0 | download | .gitmodules | https://github.com/Dav1dde/glad.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:18:0 | download | .gitmodules | https://github.com/LizardByte/libdisplaydevice.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:22:0 | download | .gitmodules | https://github.com/LizardByte/libvirtualhid.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:26:0 | download | .gitmodules | https://github.com/LizardByte/lizardbyte-common.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:30:0 | download | .gitmodules | https://github.com/moonlight-stream/moonlight-common-c.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:34:0 | download | .gitmodules | https://github.com/NVIDIA/nvapi.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:38:0 | download | .gitmodules | https://github.com/KDE/plasma-wayland-protocols.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/flatpak/flatpak-builder-tools.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:42:0 | download | .gitmodules | https://github.com/LizardByte-infrastructure/Simple-Web-Server.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:46:0 | download | .gitmodules | https://github.com/michaeltyson/TPCircularBuffer.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:50:0 | download | .gitmodules | https://github.com/LizardByte/tray.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:54:0 | download | .gitmodules | https://github.com/LizardByte/Virtual-Gamepad-Emulation-Client.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:58:0 | download | .gitmodules | https://github.com/LizardByte-infrastructure/wayland-protocols.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:62:0 | download | .gitmodules | https://github.com/LizardByte-infrastructure/wlr-protocols.git / 未锁包摘要 | absent |
| sunshine:locator:.gitmodules:7:0 | download | .gitmodules | https://github.com/LizardByte/build-deps.git / 未锁包摘要 | absent |
| sunshine:locator:cmake/cpm/CPM.cmake:708:0 | download | cmake/cpm/CPM.cmake | https://github.com/${CPM_ARGS_GITHUB_REPOSITORY}.git / 未锁包摘要 | absent |
| sunshine:locator:cmake/cpm/CPM.cmake:710:0 | download | cmake/cpm/CPM.cmake | https://gitlab.com/${CPM_ARGS_GITLAB_REPOSITORY}.git / 未锁包摘要 | absent |
| sunshine:locator:cmake/cpm/CPM.cmake:712:0 | download | cmake/cpm/CPM.cmake | https://bitbucket.org/${CPM_ARGS_BITBUCKET_REPOSITORY}.git / 未锁包摘要 | absent |
| sunshine:locator:cmake/dependencies/ffmpeg.cmake:57:0 | download | cmake/dependencies/ffmpeg.cmake | https://github.com/${FFMPEG_GITHUB_REPO}/releases/download/${FFMPEG_RELEASE_TAG} / 未锁包摘要 | absent |
| sunshine:locator:cmake/dependencies/ffmpeg.cmake:61:0 | download | cmake/dependencies/ffmpeg.cmake | https://github.com/${FFMPEG_GITHUB_REPO}/releases/latest/download / 未锁包摘要 | absent |
| sunshine:locator:cmake/dependencies/libevdev_Sunshine.cmake:18:0 | download | cmake/dependencies/libevdev_Sunshine.cmake | https://github.com/LizardByte-infrastructure/libevdev/archive/refs/tags/${LIBEVDEV_VERSION}.tar.gz / 未锁包摘要 | absent |
| sunshine:locator:cmake/dependencies/nlohmann_json.cmake:20:0 | download | cmake/dependencies/nlohmann_json.cmake | https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz / 未锁包摘要 | absent |
| sunshine:locator:cmake/dependencies/windows.cmake:19:0 | download | cmake/dependencies/windows.cmake | https://github.com/m417z/minhook-detours/releases/download/v1.0.6/minhook-detours-1.0.6.zip / 未锁包摘要 | absent |
| sunshine:locator:package-lock.cmake:45:0 | download | package-lock.cmake | https://github.com/boostorg/boost/releases/download/${BOOST_TAG}/${BOOST_TAG}-cmake.tar.xz / 未锁包摘要 | absent |
| sunshine:locator:package.json:10:0 | download | package.json | https://github.com/LizardByte/Sunshine.git / 未锁包摘要 | absent |
| sunshine:locator:scripts/linux_build.sh:547:0 | download | scripts/linux_build.sh | https://developer.download.nvidia.com/compute/cuda/ / 未锁包摘要 | absent |
| sunshine:locator:scripts/linux_build.sh:649:0 | download | scripts/linux_build.sh | https://github.com/Kitware/CMake/releases/download/v / 未锁包摘要 | absent |
| sunshine:locator:scripts/linux_build.sh:667:0 | download | scripts/linux_build.sh | https://github.com/doxygen/doxygen/releases/download/Release_${_doxygen_min}/${DOXYGEN}-${doxygen_min}.src.tar.gz / 未锁包摘要 | absent |
| virtual-audio-driver:driver-candidate | driver | Source |  / bb34fba15faf569a6ae9bdea360bc1cf4821354e | absent |
| virtual-display-driver:binary:Virtual Display Driver (HDR)/EDID/EDIDPardseDL.exe | binary | Virtual Display Driver (HDR)/EDID/EDIDPardseDL.exe |  / sha256:29776fcc9d0aa4c3502995103e347fca7eb6d555801708a4cf4f90bc7b4db01e | present |
| virtual-display-driver:binary:Virtual Display Driver (HDR)/GetIddCx/IddCxVersionQuery.exe | binary | Virtual Display Driver (HDR)/GetIddCx/IddCxVersionQuery.exe |  / sha256:69696f20fa565ae043051e886899b5c45374ad1cbd45a6ce3a7b227a9996aec7 | present |
| virtual-display-driver:driver-candidate | driver | Virtual Display Driver (HDR)/MttVDD |  / d7244969b2aa8bb38e76d79505eda217996cefea | absent |
| virtual-display-driver:gitlink:ThirdParty/Windows-Driver-Frameworks | gitlink | ThirdParty/Windows-Driver-Frameworks | https://github.com/microsoft/Windows-Driver-Frameworks.git / 3b9780e847cf68d6199dafe0f87650cf1f9c227f | absent |
| virtual-display-driver:locator:.gitmodules:3:0 | download | .gitmodules | https://github.com/microsoft/Windows-Driver-Frameworks.git / 未锁包摘要 | absent |
| virtual-display-driver:locator:Community Scripts/silent-install.ps1:10:0 | download | Community Scripts/silent-install.ps1 | https://github.com/VirtualDrivers/Virtual-Display-Driver/releases/download/25.7.23/VirtualDisplayDriver-x86.Driver.Only.zip / 未锁包摘要 | absent |
| virtual-display-driver:locator:Community Scripts/silent-install.ps1:6:0 | download | Community Scripts/silent-install.ps1 | https://github.com/nefarius/nefcon/releases/download/v1.14.0/nefcon_v1.14.0.zip / 未锁包摘要 | absent |
| virtual-display-driver:locator:Community Scripts/virtual-driver-manager.ps1:263:0 | download | Community Scripts/virtual-driver-manager.ps1 | https://github.com/Drawbackz/DevCon-Installer/releases/download/1.4-rc/Devcon.Installer.exe / 未锁包摘要 | absent |
| virtual-display-driver:locator:Community Scripts/virtual-driver-manager.ps1:283:0 | download | Community Scripts/virtual-driver-manager.ps1 | https://api.github.com/repos/VirtualDrivers/Virtual-Display-Driver/releases/latest / 未锁包摘要 | absent |
| virtual-display-driver:locator:Community Scripts/virtual-driver-manager.ps1:299:0 | download | Community Scripts/virtual-driver-manager.ps1 | https://github.com/VirtualDrivers/Virtual-Display-Driver/releases/download/$DriverVersion/Signed-Driver-v$DriverVersion-x64.zip / 未锁包摘要 | absent |
| windows-camera:driver-candidate | driver | Samples/VirtualCamera |  / 626f8b19c5f367602f2e89c6b314573d3776c9df | absent |

## 发行候选

### android-apk

平台 android；Selene mobile；direct APK；blocked。

- 随实际发行清单保留 notices、版权、对应许可；GPL 组合及对应源码义务单独核对。
- 签名身份和更新密钥必须持续保管。

- [Android app signing](https://developer.android.com/studio/publish/app-signing)；updated 2026-03-06；核查 2026-10-07；章节 App signing, Play App Signing。

阻碍：project-license, distribution-accounts, external-build-scope。

### android-play

平台 android；Selene mobile；Google Play / AAB candidate；blocked。

- Play开发者账户、签名和实际接受的发布协议待确认。

- [Android app signing](https://developer.android.com/studio/publish/app-signing)；updated 2026-03-06；核查 2026-10-07；章节 App signing, Play App Signing。
- [Google Play Developer Distribution Agreement](https://play.google/developer-distribution-agreement.html)；public web text retrieved 2026-10-07; accepted account revision unknown；核查 2026-10-07；章节 2 Accepting Agreement, 4 Product requirements, 5 License grants。

阻碍：project-license, distribution-accounts, external-build-scope。

### ios-store

平台 ios-ipados；Selene mobile；App Store candidate；blocked。

- 实际账户英文协议、FOSS依赖/对应源码提供方式和签名条件须逐项核对。

- [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/)；public English web text as retrieved 2026-10-07; account-accepted revision unknown；核查 2026-10-07；章节 Purpose, 3.3.4(A)(v), 5.1, 5.3。

阻碍：project-license, distribution-accounts, external-build-scope, apple-foss-channel。

### ios-testflight

平台 ios-ipados；Selene mobile；TestFlight beta；blocked。

- TestFlight用于测试；账户、依赖授权和签名组合仍需闭合。

- [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/)；public English web text as retrieved 2026-10-07; account-accepted revision unknown；核查 2026-10-07；章节 Purpose, 3.3.4(A)(v), 5.1, 5.3。

阻碍：project-license, distribution-accounts, external-build-scope, apple-foss-channel。

### linux-direct

平台 linux；Selene desktop；tarball / AppImage candidate；blocked。

- 随实际发行清单保留 notices、版权、对应许可；GPL 组合及对应源码义务单独核对。
- 锁定内嵌动态库及实际目标发行版的依赖。

- [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)；Version 3, 2007-06-29; online fetch timeout, sections checked against locked license blobs；核查 2026-10-07；章节 5, 6, 10。

阻碍：project-license, distribution-accounts, external-build-scope。

### linux-distro

平台 linux；Selene distro package；deb / distribution package candidate；blocked。

- 按发行包记录上游来源、版权和许可；尚未申请进入发行版。

- [Debian Policy](https://www.debian.org/doc/debian-policy/ch-docs.html#copyright-information)；v4.7.4.1；核查 2026-10-07；章节 12.5 Copyright information。

阻碍：project-license, distribution-accounts, external-build-scope。

### macos-direct

平台 macos；Selene desktop；Developer ID / notarized DMG；blocked。

- 随实际发行清单保留 notices、版权、对应许可；GPL 组合及对应源码义务单独核对。
- Developer ID、公证、权限和全部内嵌原生库须验证。

- [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/)；public English web text as retrieved 2026-10-07; account-accepted revision unknown；核查 2026-10-07；章节 Purpose, 3.3.4(A)(v), 5.1, 5.3。
- [Signing Mac Software with Developer ID](https://developer.apple.com/developer-id/)；web revision retrieved 2026-10-07；核查 2026-10-07；章节 Developer ID, Notarization。

阻碍：project-license, distribution-accounts, external-build-scope, apple-foss-channel。

### macos-store

平台 macos；Selene desktop；Mac App Store candidate；blocked。

- 账户与实际包审查条件待闭合，不能从技术可构建推导上架许可。

- [Apple Developer Program License Agreement](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/)；public English web text as retrieved 2026-10-07; account-accepted revision unknown；核查 2026-10-07；章节 Purpose, 3.3.4(A)(v), 5.1, 5.3。

阻碍：project-license, distribution-accounts, external-build-scope, apple-foss-channel。

### windows-client-direct

平台 windows-client；Selene desktop；ZIP/EXE direct；blocked。

- 随实际发行清单保留 notices、版权、对应许可；GPL 组合及对应源码义务单独核对。
- 代码签名与升级来源身份需固定。

- [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)；Version 3, 2007-06-29; online fetch timeout, sections checked against locked license blobs；核查 2026-10-07；章节 5, 6, 10。

阻碍：project-license, distribution-accounts, external-build-scope。

### windows-client-msix

平台 windows-client；Selene packaged desktop；MSIX / Microsoft Store candidate；blocked。

- 生产可信签名；Store或直接包路线需核对各自发布者与依赖规则。

- [Sign an MSIX package](https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview)；web revision retrieved 2026-10-07；核查 2026-10-07；章节 Signing options, Production distribution。

阻碍：project-license, distribution-accounts, external-build-scope。

### windows-devices-attestation

平台 windows-devices；device evaluation packages；attestation candidate / test signing development only；blocked。

- Attestation的适用目标及发行能力须另核验；不把测试签名包作为默认安全配置生产依赖。

- [Driver Signing Policy](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/kernel-mode-code-signing-policy--windows-vista-and-later-)；updated 2024-08-19；核查 2026-10-07；章节 Windows 10 version 1607, Signing drivers for client versions, PnP。
- [Driver code signing requirements](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs)；updated 2026-04-14；核查 2026-10-07；章节 EV certificate signed drivers, SHA-2 submissions。

阻碍：project-license, distribution-accounts, external-build-scope, driver-production-signing。

### windows-devices-whcp

平台 windows-devices；display / capture audio / camera；Hardware Dev Center / WHCP + HLK；blocked。

- 核对驱动类型、目录、目标OS及HLK日志；账户需有效EV关联，提交须符合SHA-2要求。

- [Driver Signing Policy](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/kernel-mode-code-signing-policy--windows-vista-and-later-)；updated 2024-08-19；核查 2026-10-07；章节 Windows 10 version 1607, Signing drivers for client versions, PnP。
- [Driver code signing requirements](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-reqs)；updated 2026-04-14；核查 2026-10-07；章节 EV certificate signed drivers, SHA-2 submissions。

阻碍：project-license, distribution-accounts, external-build-scope, driver-production-signing。

### windows-host-direct

平台 windows-host；Helios + device packages；EXE/MSI direct；blocked。

- 随实际发行清单保留 notices、版权、对应许可；GPL 组合及对应源码义务单独核对。
- 主机安装器与驱动包分开核验，普通程序签名不能代替驱动签名。

- [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)；Version 3, 2007-06-29; online fetch timeout, sections checked against locked license blobs；核查 2026-10-07；章节 5, 6, 10。
- [Driver Signing Policy](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/kernel-mode-code-signing-policy--windows-vista-and-later-)；updated 2024-08-19；核查 2026-10-07；章节 Windows 10 version 1607, Signing drivers for client versions, PnP。

阻碍：project-license, distribution-accounts, external-build-scope, driver-production-signing。

### windows-host-msix

平台 windows-host；Helios packaged service candidate；MSIX candidate；blocked。

- 检查签名/发布者身份，以及服务和外部设备安装的实际包限制；尚未证明本产物适合MSIX。

- [Sign an MSIX package](https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview)；web revision retrieved 2026-10-07；核查 2026-10-07；章节 Signing options, Production distribution。

阻碍：project-license, distribution-accounts, external-build-scope, driver-production-signing。

## 人类决定

### distribution-intent

确认候选渠道组合或明确全部暂缓；本阶段不发布、不购买证书。

- **direct-plus-apple-beta**：Windows主机/客户端直接包；macOS Developer ID+公证；Linux直接包；Android APK；iOS TestFlight→App Store候选；Windows设备WHCP/HLK生产评估。。收益：优先直接发行路线，保留五端与正式设备交付。代价：Apple组合/账户、公证、驱动认证与所有源码义务待核验；商店候选均未获批准。阻碍：apple-foss-channel, driver-production-signing, distribution-accounts。
- **retain-candidates**：保留14条比较，所有渠道暂不选定；在交付阶段决定。。收益：不提前锁尚无实际产物的发行路径。代价：交付阶段必须重新核对条款与账号，不改变五端v1义务。阻碍：distribution-accounts。

推荐：retain-candidates；状态：selected；选择：retain-candidates；确认：user / 2026-10-07T07:59:36.360Z。

### project-reuse-policy

决定 Aether 项目许可意图与生产复用路线。全部上游文件当前 research-only；选择意图不会批准未知文件。

- **compatible-open-source**：以 GPL-3.0-or-later 为项目候选；common-c 等实现文件仅作为未来复制/链接候选，逐项审查后才纳入生产。。收益：允许后续核实后复用协议核心，避免重新实现全部协议细节。代价：对应源码、版权/通知、修改说明和组合发行义务；Apple渠道组合兼容未闭合；独立第三方条款不被GPL根文本覆盖。阻碍：project-license, external-build-scope, apple-foss-channel。
- **independent-implementation**：独立实现 Aether，自写代码以 Apache-2.0 为候选；只研究现有行为，媒体/驱动依赖另审。。收益：明确自写实现范围与依赖边界。代价：协议行为仍基于GameStream；需要更多实现与核验工作；独立意图不是已取得法律结论，不能搬代码后改许可。阻碍：project-license, external-build-scope。
- **research-only**：本阶段只确认来源证据；暂不锁项目LICENSE，禁止生产复制/链接/再分发，继续原能力和环境审计。。收益：可立即推进01-02/03证据工作，未知授权保持阻断。代价：Phase2或首个生产依赖前必须闭合具体许可/复用问题。阻碍：project-license, external-build-scope。

推荐：research-only（当前证据完成但所有生产清单/渠道尚未闭合）；若已确定开源意图，可选前两条并保留阻碍。；状态：selected；选择：compatible-open-source；确认：user / 2026-10-07T07:59:36.360Z。

## 未决阻碍

- **apollo:gitlink:packaging/linux/flatpak/deps/flatpak-builder-tools:unverified**：packaging/linux/flatpak/deps/flatpak-builder-tools gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:packaging/linux/flatpak/deps/shared-modules:unverified**：packaging/linux/flatpak/deps/shared-modules gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/Simple-Web-Server:unverified**：third-party/Simple-Web-Server gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/TPCircularBuffer:unverified**：third-party/TPCircularBuffer gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/ViGEmClient:unverified**：third-party/ViGEmClient gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/build-deps:unverified**：third-party/build-deps gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/doxyconfig:unverified**：third-party/doxyconfig gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/googletest:unverified**：third-party/googletest gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/inputtino:unverified**：third-party/inputtino gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/libdisplaydevice:unverified**：third-party/libdisplaydevice gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/moonlight-common-c:unverified**：third-party/moonlight-common-c gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/nanors:unverified**：third-party/nanors gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/nv-codec-headers:unverified**：third-party/nv-codec-headers gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/nvapi-open-source-sdk:unverified**：third-party/nvapi-open-source-sdk gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/tray:unverified**：third-party/tray gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/wayland-protocols:unverified**：third-party/wayland-protocols gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:gitlink:third-party/wlr-protocols:unverified**：third-party/wlr-protocols gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **apollo:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **apple-foss-channel**：Apple 账户实际协议、FOSS组合与签名条款尚未核对；Moonlight 上架不证明 Aether 可上架。 阶段 30/32/40/41；处理：在真实 Apple 构建/依赖图确定后逐项核验；不因硬件TODO省略构建或渠道审查。。
- **distribution-accounts**：最终账户、证书、更新身份及接受的商店协议未确认；未购买、登录或发布。 阶段 39/40/41；处理：在交付阶段由用户选定账户与签名保管，核对实际协议和费用。。
- **driver-production-signing**：驱动源码/二进制对应关系、发布签名和默认安全配置安装未验证；测试签名不能代替生产签名。 阶段 3/4/5/39；处理：确认 provider 与精确包摘要/目录签名，验证 Win10/11 与 Secure Boot/HVCI 默认配置；确定开发者账户/证书及认证路径。。
- **external-build-scope**：动态下载/包管理器/构建工具的传递依赖与资产并不由顶层 SHA 完整锁定。 阶段 2；处理：生产选用前按实际构建图锁定与审计；本次只扫描固定文本，不执行上游安装脚本。。
- **moonlight-android:gitlink:app/src/main/jni/moonlight-core/moonlight-common-c:unverified**：app/src/main/jni/moonlight-core/moonlight-common-c gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-android:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **moonlight-common-c:gitlink:enet:unverified**：enet gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-common-c:gitlink:nanors:unverified**：nanors gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-common-c:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **moonlight-ios:gitlink:X1Kit:unverified**：X1Kit gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-ios:gitlink:moonlight-common/moonlight-common-c:unverified**：moonlight-common/moonlight-common-c gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-ios:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **moonlight-qt:gitlink:app/SDL_GameControllerDB:unverified**：app/SDL_GameControllerDB gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-qt:gitlink:moonlight-common-c/moonlight-common-c:unverified**：moonlight-common-c/moonlight-common-c gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-qt:gitlink:qmdnsengine/qmdnsengine:unverified**：qmdnsengine/qmdnsengine gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **moonlight-qt:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **project-license**：项目许可证/拟复制链接清单及组合义务尚未决定；所有上游文件仍 research-only。 阶段 2；处理：取得用户路线决定；实际生产依赖逐项闭合许可，GPL-only/or-later 不能由根文本推断。。
- **review:android-openssl**：OpenSSL头部为Apache2.0候选；四架构libcrypto.a已锁blob/SHA256，头部版本不证明预编译库完整对应源码 阶段 2/28；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:apollo-sudovda-package**：INF引用SudoVDA.dll；固定树含接口、INF/CAT/CER和安装脚本，缺驱动DLL及完整源码/独立授权；签名未验证 阶段 3/17/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:apollo-third-party-assets**：NOTICE含Valve商标提示；图标/生成资源不因根GPL自动获准；Aether拟独立制作品牌资源 阶段 2/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:apollo-vigembus-download**：ViGEmBus下载入口声明SHA256；未下载/认证原包，不是已验证签名或再分发许可 阶段 16/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:camera-independent-mit**：NetworkMediaStreamer独立MIT文本已单列；VirtualCamera样例、运行系统组件和Win10方案/发布包分别审查 阶段 5/22/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:gnu-combination-source**：GPLv3的5/6/10条按锁定许可对象核对；C ABI/FFI不自动免除组合与对应源码义务。官网抓取超时，官方FAQ检索可查 阶段 2；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:ios-ffmpeg-static**：FFmpeg头部声明N-112686-g3f890fbfd9；iOS/tvOS静态库摘要已锁，实际配置/对应源码及LGPL/GPL状态仍待查 阶段 2/32；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:ios-opus-script**：Opus脚本变量下载不等于包已锁；脚本Apache通知不替代库自身许可 阶段 2/32；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:qt-lgpl-directory**：h264bitstream 有独立LGPL2.1文本；目录范围、源/包与链接义务单独审查 阶段 2/10；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:qt-wix-reciprocal**：WiX RtfTheme 明示Microsoft Reciprocal License与复制来源；引用的LICENSE.TXT未随该路径提供；主题不纳入拟生产复用 阶段 39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:scope-no-implicit-gpl**：common-c 要求指定 ENet fork；两个 gitlink 已锁，内部源码未审计；GPL根文本不是逐文件/or-later授权证据 阶段 2；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:virtual-audio-beta**：音频驱动README明示beta/test signing；默认安全配置生产路线阻断，PCM注入仍需Phase4原型 阶段 4/21/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:virtual-display-arm64**：VDD称Win11 24H2+ ARM64可能需要test signing；Signed/HDR表为上游声明，实际包/默认配置安装未验证 阶段 3/17/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **review:virtual-display-microsoft-origin**：VDD源码有Microsoft版权头部；样例来源范围独立追溯，根MIT不等于整个provider包已批准 阶段 3/39；处理：在相应实施/交付阶段关闭具体来源/包/许可/实测缺口；当前不得生产复用该范围。
- **sunshine:gitlink:packaging/linux/flatpak/deps/flatpak-builder-tools:unverified**：packaging/linux/flatpak/deps/flatpak-builder-tools gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/Simple-Web-Server:unverified**：third-party/Simple-Web-Server gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/TPCircularBuffer:unverified**：third-party/TPCircularBuffer gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/ViGEmClient:unverified**：third-party/ViGEmClient gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/build-deps:unverified**：third-party/build-deps gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/dockle:unverified**：third-party/dockle gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/glad:unverified**：third-party/glad gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/libdisplaydevice:unverified**：third-party/libdisplaydevice gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/libvirtualhid:unverified**：third-party/libvirtualhid gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/lizardbyte-common:unverified**：third-party/lizardbyte-common gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/moonlight-common-c:unverified**：third-party/moonlight-common-c gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/nvapi:unverified**：third-party/nvapi gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/plasma-wayland-protocols:unverified**：third-party/plasma-wayland-protocols gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/tray:unverified**：third-party/tray gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/wayland-protocols:unverified**：third-party/wayland-protocols gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:gitlink:third-party/wlr-protocols:unverified**：third-party/wlr-protocols gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **sunshine:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **virtual-audio-driver:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **virtual-display-driver:gitlink:ThirdParty/Windows-Driver-Frameworks:unverified**：ThirdParty/Windows-Driver-Frameworks gitlink 已识别；内部文件/许可尚未审计，未默认初始化或下载。 阶段 2；处理：显式获取固定提交并另审源码、许可与资产。。
- **virtual-display-driver:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。
- **windows-camera:license-scope**：根许可是候选依据；文件继承范围、例外、组合发行及人类复用决定尚未批准。 阶段 2；处理：按实际复制/链接清单核对逐文件许可及渠道兼容；保留 research-only。。

## 复现

从 Aether 根运行 `pwsh -NoProfile -File scripts/sync-upstream.ps1 -VerifyOnly` 和 `node scripts/validate-baseline.cjs --sources --report docs/SOURCE-AUDIT.md`。缺 checkout 时显式恢复；不初始化子模块、不 reset 用户改动。

BASE-02 边缘穷尽性仍 unclassified/unresolved；两条 descriptor-less prohibitions 仍 flagged-unverified。结构 PASS 不等于法律、组合发行或平台支持判断。
