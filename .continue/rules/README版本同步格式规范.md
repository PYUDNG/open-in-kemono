---
globs: ["README.md", "readme/README.*.md"]
description: 当需要同步修改README文件时，确保不同版本（一般版和Greasyfork版，以及不同语言版本）之间的格式一致性
alwaysApply: false
---

README文件必须遵循以下版本格式规范：

1. 一般版本（非Greasyfork版）必须包含：
   - 标题（对应语言翻译）
   - 语言导航栏（[English](#) [简体中文](./readme/README.zh-Hans.md) [繁體中文](./readme/README.zh-Hant.md)格式）
   - 项目介绍段落
   - 项目链接（Github和Greasyfork）
   - 完整的安装章节（包含安装提示框和两个安装链接）
   - 完整的使用方法章节
   - 支持的服务表格
   - 功能请求提示框

2. Greasyfork版本必须：
   - 标题（对应语言翻译）
   - 项目介绍段落（直接接在标题后，无导航栏）
   - 项目链接（Github和Greasyfork）
   - 完整的使用方法章节
   - 支持的服务表格（与一般版本完全相同）
   - 功能请求提示框
   - 必须省略：语言导航栏和整个安装章节

3. 语言版本一致性：
   - 英文版安装说明只包含链接，无额外说明
   - 中文版安装说明可包含额外说明文字（如代码压缩信息）
   - 支持的服务表格在所有版本中必须完全一致