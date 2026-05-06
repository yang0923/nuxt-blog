---
title: "Neovim 配置指南（基于 LazyVim）"
date: "2026-05-01"
description: "nvim 安装配置过程"
tags: ["neovim", "lazyvim"]
image: "/images/20260506/layzvim-config/core.png"
---

## 一、安装 Neovim

- Linux (AppImage 方式)

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

- Windows 系统

```powershell
# 使用 winget 
winget install Neovim.Neovim

# 使用 scoop
scoop install neovim
```

- 配置文件位置：`C:\Users\用户名\AppData\Local\nvim`

## 二、配置 LazyVim

lazyvim 安装配置过程

### 1.备份现有配置（可选）

```bash
# required
mv ~/.config/nvim{,.bak}

# optional but recommended
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
```

```powershell
# Windows PowerShell
Move-Item ~\AppData\Local\nvim ~\AppData\Local\nvim.bak 
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
:Lazy sync
```

### 5. 启用语言支持

通过 `:LazyExtras` 启用需要的语言扩展。

#### 当前已启用的语言

------------------------

| 语言 | 扩展 | 说明 |
| ----- | ----- | ----- |
| JSON | lang.json | SchemaStore, treesitter |
| Markdown | lang.markdown | 预览与渲染增强 |
| Python | lang.python | pyright, ruff, venv-selector |
| Rust | lang.rust | rust-analyzer, crates.nvim|
| Tailwind CSS | lang.tailwind | LSP + 颜色高亮 |
| TOML | lang.toml | LSP 支持|
| TypeScript | lang.typescript | vtsls, 调试支持|
| Vue | lang.vue | typescript 依赖, treesitter|
| YAML | lang.yaml | SchemaStore, LSP|

> 启用方法：光标移到扩展上按 `x`，然后运行 `:Lazy sync`。

#### 已安装的核心插件（10个）

------------------------

| 插件 | 功能 |
| ----- | ----- |
| coding.blink |代码补全引擎|
| coding.yanky | 增强复制粘贴 |
| editor.inc-rename | LSP 增量重命名 |
| editor.mini-move | 快速移动代码行 |
| editor.snacks_explorer | 文件树浏览器 |
| editor.snacks_picker | 文件查找器 |
| ui.smear-cursor | 平滑光标动画 |
| util.dot | 点文件支持 |
| util.mini-hipatterns | 颜色值高亮 |
| util.project | 项目管理 |

### Mason Python 工具失败问题

- 问题现象：Mason 安装 ruff、pyright 等 Python 工具时失败。
- 解决方案：为系统安装全局 Python，确保 python 或 python3 命令可用。

#### 安装全局 Python

##### Linux Ubuntu/Debian

```base
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

##### Windows

从 python.org 下载安装包，安装时勾选  `"Add Python to PATH"`

##### 验证安装

```base
python --version
```

### 常用快捷键

| 分类 | 快捷键 | 功能 |
| ----- | ----- | ----- |
| 文件操作 | `<leader>e` | 打开/关闭文件树 |
| 文件操作 | `<leader>ff` | 查找文件 |
| 文件操作 | `<leader>fg` | 全局内容搜索 |
| 文件操作 | `<C-s>` | 保存文件 |
| 代码编辑 | `gcc` | 注释当前行 |
| 代码编辑 | `<leader>cf` | 格式化文件 |
| 代码编辑 | `=`（可视模式） | 格式化选中代码 |
| LSP 功能 | `gd` | 跳转到定义 |
| LSP 功能 | `gr` | 查找引用 |
| LSP 功能 | `K` | 查看文档 |
| LSP 功能 | `<leader>ca` | 代码操作/快速修复 |
| LSP 功能 | `]d / [d` | 跳转到下/上一个诊断 |
| Git 操作 | `<leader>gg` | 打开 lazygit |
| Git 操作 |  `]c / [c` | 跳转到 Git 修改 |
| 终端 | `<C-/>` | 打开/关闭内置终端 |
| 插件管理 | `<leader>l` | 打开 Lazy 插件管理 |

> `<leader>` 键默认为空格键

### 更新配置

```base
cd ~/.config/nvim
git pull
nvim --headless -c 'Lazy sync' -c 'qa'
```
