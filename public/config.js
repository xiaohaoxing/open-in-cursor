// 集中维护下拉菜单项（枚举值）
// key: 存储与 schema 转换所用的编辑器标识
// label: 菜单展示文本中的名称
// 如需新增支持，按格式追加即可
window.OPEN_IN_CURSOR_MENU = [
  {
    key: 'cursor',
    label: 'Cursor',
    // 用于将 VS Code 的 vscode:extension/<publisher.ext> 转换为目标 schema
    // {ext} 占位表示从 vscode 链接中解析出的 "publisher.ext"
    schemaTemplate: 'cursor:extension/{ext}',
    // 菜单项文案模板（可选），{label} 占位为上方 label 值
    itemText: 'Install to {label}',
  },
  {
    key: 'qoder',
    label: 'Qoder',
    schemaTemplate: 'qoder:extension/{ext}',
    itemText: 'Install to {label}',
  },
];


