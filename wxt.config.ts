import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Open in Cursor",
    version: "0.1.0",
    description:
      "Install VS Code extensions for Cursor/Qoder...",
    permissions: ["storage", "scripting", "activeTab"],
    host_permissions: ["https://marketplace.visualstudio.com/*"],
    icons: {
      128: "assets/logo_128x128.png",
    },
    background: {
      service_worker: "background.js",
      type: "module",
    },
    action: {
      default_title: "Open in Cursor",
      default_popup: "popup.html"
    }
  }
});


