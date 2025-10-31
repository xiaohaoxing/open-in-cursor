export type TargetEditor = "cursor" | "qoder";

const schemaPrefixByEditor: Record<TargetEditor, string> = {
  cursor: "cursor",
  qoder: "qoder"
};

function extractExtensionPath(vscodeUrl: string): string | null {
  // Support: "vscode:extension/publisher.name" or "vscode://extension/publisher.name"
  const normalized = vscodeUrl.trim();
  const patterns = [
    /^vscode:\/\/extension\/(.+)$/i,
    /^vscode:extension\/(.+)$/i
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function toEditorSchema(
  vscodeUrl: string,
  targetEditor: TargetEditor
): string | null {
  const extensionPath = extractExtensionPath(vscodeUrl);
  if (!extensionPath) return null;
  const prefix = schemaPrefixByEditor[targetEditor];
  return `${prefix}:extension/${extensionPath}`;
}


