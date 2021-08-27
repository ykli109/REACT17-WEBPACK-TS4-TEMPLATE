#!/usr/bin/env bash
# 编译构建脚本，需要根据自己的编译机器环境调整

# 保证agile编译日志不出现乱码
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

# 准备
export PATH=$NODEJS_12_16_1_BIN:$YARN_1_22_4:$PATH
declare -r VERSION=$(git rev-parse --short=7 HEAD)

# 获取环境node和npm版本
node -v && npm -v

# 准备node_modules
yarn install

# AGILE_MODULE_NAME 对应icode代码库完整名称 baidu/xxx/yyy，保证唯一性
if [ -n "$CDN_TARGET" ]; then
    export CDN_PREFIX="$CDN_TARGET/$AGILE_MODULE_NAME/$VERSION/"
    echo CDN_PREFIX:$CDN_PREFIX;
fi

# 构建压缩
yarn build || { echo 'build fail'; exit 1; }
echo $VERSION > build/version.txt

# 产出
rm -rf output && mv build output
