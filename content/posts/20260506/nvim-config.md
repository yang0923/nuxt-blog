---
title: "nvim 安装配置"
date: "2026-05-01"
description: "nvim 安装配置过程"
tags: ["neovim", "lazyvim"]
image: "/images/20260506/layzvim-config/core.png"
---

<!--toc:start-->
- [安装](#安装)
- [配置 LazyVim](#配置-lazyvim)
  - [1. 请备份您当前的 Neovim 文件夹，以免出现意外情况](#1-请备份您当前的-neovim-文件夹以免出现意外情况)
  - [2. 克隆 LazyVim 仓库](#2-克隆-lazyvim-仓库)
  - [3. 启动 Neovim, 自动化安装插件](#3-启动-neovim-自动化安装插件)
  - [4. 安装插件](#4-安装插件)
  - [5. 安装的插件和语言服务](#5-安装的插件和语言服务)
<!--toc:end-->

## 安装

直接下载官方 AppImage (最简单、版本最稳)

```bash
# 1. 下载最新稳定版 (也可以把 stable 换成 nightly 体验最新版)
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.appimage

# 2. 赋予执行权限
chmod u+x nvim-linux-x86_64.appimage

# 3. 移动到系统路径并更名
sudo mv nvim-linux-x86_64.appimage /usr/local/bin/nvim

# 4. 验证版本
nvim --version
```

## 配置 LazyVim

lazyvim 安装配置过程

### 1.请备份您当前的 Neovim 文件夹，以免出现意外情况

```bash
# required
mv ~/.config/nvim{,.bak}

# optional but recommended
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
```

### 2. 克隆 LazyVim 仓库

```bash
git clone https://github.com/yang0923/lazyvim-config.git ~/.config/nvim
# 移除 .git 文件夹
rm -rf ~/.config/nvim/.git
```

### 3. 启动 Neovim, 自动化安装插件

```bash
nvim
```

### 4. 安装插件

```bash
:Lazy install
```

  ![安装示例图](/images/20260506/layzvim-config/install.png)

### 5. 安装的插件和语言服务

```base
Enabled Plugins: (8)
  ● coding.blink  blink.cmp  friendly-snippets  blink.compat  catppuccin
  ● coding.yanky    yanky.nvim
  Better Yank/Paste
  ● editor.inc-rename    inc-rename.nvim  nvim-lspconfig  noice.nvim
  Incremental LSP renaming based on Neovim's command-preview feature
  ● editor.snacks_explorer    snacks.nvim
  Snacks File Explorer
  ● editor.snacks_picker    nvim-lspconfig  snacks.nvim  alpha-nvim  dashboard-nvim  flash.nvim  mini.starter  todo-comments.nvim
  Fast and modern file picker
  ● util.dot    mason.nvim  nvim-lspconfig  nvim-treesitter
  Language support for dotfiles
  ● util.mini-hipatterns    mini.hipatterns
  Highlight colors in your code. Also includes Tailwind CSS support.
  ● util.project  project.nvim  alpha-nvim  dashboard-nvim  fzf-lua  mini.starter  snacks.nvim  telescope.nvim

Enabled Languages: (9)
  ● lang.json    SchemaStore.nvim  nvim-lspconfig  nvim-treesitter
  ● lang.markdown    markdown-preview.nvim  mason.nvim  nvim-lspconfig  render-markdown.nvim  conform.nvim  none-ls.nvim  nvim-lint
  ● lang.python  neotest-python  nvim-dap-python  nvim-lspconfig  nvim-treesitter  venv-selector.nvim  mason-nvim-dap.nvim  neotest  nvim-cmp  nvim-dap
  ● lang.rust  crates.nvim  nvim-lspconfig  nvim-treesitter  rustaceanvim  mason.nvim  neotest
  ● lang.toml    nvim-lspconfig
  ● lang.typescript  lang.typescript.vtsls  mason.nvim  mini.icons  nvim-lspconfig  mason-nvim-dap.nvim  nvim-dap
  ● lang.typescript.vtsls  nvim-lspconfig
  ● lang.vue  lang.typescript  lang.typescript.vtsls  nvim-lspconfig  nvim-treesitter
  ● lang.yaml  SchemaStore.nvim  nvim-lspconfig
```
