+++
title = "从 jekyll 迁移到 Zola"
date = 2026-07-01
updated = 2026-07-01
[taxonomies]
tags = ["SSG", "折腾"]
[extra]
features = []
reaction = true
lang = "zh"
toc = true
math = false
mermaid = false
comment = true
pangu = true
charch = true
pseudo = false
cjk_latin_space = true
bracket_replace = true
link_space = true
line_height = true
guwen = true
heti = true
+++

我之前一直使用 ruby 实现的 jekyll 作为博客生成器，但是它的性能太差了，每次生成都需要很长时间，索性换掉了它。[原博客](https://other.blog.rainsin.cn/)。

那 SSG 那么多，选哪一个呢？

作为“R门”的一员，当然选择 Rust 实现的 zola 啦。笑死，根本不会比较优缺点，根本不会纠结。虽然它有模板能力弱、没有插件系统、主题和工具生态小等等问题，对我来说都不是事，性能好就行了。

## 如何在 Cloudflare page 部署

Cloudflare 官方没有Zola的部署模板，所以需要自己配置。

在根目录创建一个 `wrangler.toml`:

```toml,linenos,name=./wrangler.toml
# wrangler.toml
name = 'zola-blog'
compatibility_date = "2026-01-22"

[build]
command = "./build.sh"

[assets]
directory = "./public"

```

和一个脚本 `build.sh`:

```bash,linenos,name=./build.sh
#!/usr/bin/env bash

set -euo pipefail

main() {
    ZOLA_VERSION=0.22.1 

    curl -sLJO "https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"
    tar -xf "zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"

    git submodule update --init --recursive

    ./zola build
}

main "$@"
```

在Cloudflare的部署配置页面中把 `部署命令` 设为 `npx wrangler deploy`,`路径` 设为 `/`，其他的不管。

这样用 Cloudflare Page 连接你的 Github 仓库之后就可以了，每次 push 都会自动构建。
