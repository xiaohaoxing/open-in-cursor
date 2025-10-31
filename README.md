# Open in Cursor

在 VS Code 插件市场详情页增加“Install”右侧下拉，按用户偏好用 `cursor:` 或 `qoder:` schema 打开扩展。

## 功能
- 识别详情页中的 `vscode:extension/<publisher.name>` 链接
- 通过下拉菜单选择目标编辑器：`cursor`、`qoder`
- 弹出层（Popup）勾选偏好，持久化到 `chrome.storage`

## 开发
1. 安装依赖
   ```bash
   npm i
   ```
2. 开发/构建
   ```bash
   # 开发（建议另开终端运行，Chrome 加载 .output 的开发目录）
   npm run dev

   # 构建（用于打包或加载 unpacked）
   npm run build
   ```
3. 浏览器加载
   - Chrome: 访问 `chrome://extensions`
   - 打开“开发者模式”
   - 选择“加载已解压的扩展程序”，指向 `.output/chrome-mv3`（或构建产物目录）

## 使用
1. 在扩展图标的 Popup 中勾选目标编辑器（默认勾选 `cursor`）
2. 打开 VS Code 插件市场详情页，例如：
   - `https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode`
3. 在页面的 Install 区域：
   - 左侧主按钮保留原 “Install”（VS Code）
   - 右侧箭头展开菜单：选择在 `cursor` 或 `qoder` 中打开

## 备注
- 如需增加更多编辑器 schema，扩展 `shared/schema.ts` 映射即可。
- 如果页面结构变动，内容脚本使用了 `MutationObserver` 做基本兜底。



