(() => {
  // Clean content script: no logs/messages

  function getPreferredEditors() {
    return new Promise((resolve) => {
      try {
        chrome.storage?.local?.get(["preferredEditors"], (res) => {
          const list =
            Array.isArray(res?.preferredEditors) && res.preferredEditors.length
              ? res.preferredEditors
              : ["cursor"];
          resolve(list);
        });
      } catch {
        resolve(["cursor"]);
      }
    });
  }

  function parseExtPath(vscodeUrl) {
    try {
      const m = String(vscodeUrl).match(/vscode:(?:\/\/)?extension\/(.+)$/i);
      return m && m[1] ? m[1] : null;
    } catch {
      return null;
    }
  }

  function findInstallAnchor(root) {
    let a = root.querySelector(
      'a[href^="vscode:extension/"], a[href^="vscode://extension/"]'
    );
    if (a) return a;
    const containers = Array.from(
      root.querySelectorAll(
        ".ux-oneclick-install-button-container, .installButtonContainer, .ms-Fabric, .ux-item-action"
      )
    );
    for (const c of containers) {
      const cand = c.querySelector(
        'a[href^="vscode:"], a.ms-Button.install, a.ux-button.install'
      );
      if (cand) return cand;
    }
    const textButtons = Array.from(root.querySelectorAll("a, button"));
    for (const el of textButtons) {
      const text = (el.textContent || "").trim().toLowerCase();
      if (text === "install" || text.includes("install")) {
        const parentA = el.closest("a");
        if (parentA) return parentA;
      }
    }
    return null;
  }

  function addCaretDropdown(anchor, container, editors) {
    const MENU = (globalThis.OPEN_IN_CURSOR_MENU || []).filter((m) =>
      editors.includes(m.key)
    );
    container.style.position = container.style.position || "relative";

    const caret = document.createElement("button");
    caret.type = "button";
    caret.setAttribute("aria-haspopup", "menu");
    caret.setAttribute("aria-expanded", "false");
    caret.textContent = "▾";
    const as = globalThis.getComputedStyle(anchor);
    const rect = anchor.getBoundingClientRect();
    const height = Math.max(
      30,
      Math.round(rect.height || Number.parseFloat(as.height) || 32)
    );
    const bg = as.backgroundColor || "#107c10";
    const fg = as.color || "#ffffff";
    const borderColor = as.borderColor || "#106ebe";
    Object.assign(caret.style, {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: `${height}px`,
      lineHeight: `${height}px`,
      padding: "0 10px",
      marginLeft: "0",
      borderRadius: "0 4px 4px 0",
      border: `1px solid ${borderColor}`,
      background: bg,
      color: fg,
      cursor: "pointer",
      fontFamily:
        as.fontFamily || "Segoe UI, -apple-system, system-ui, Roboto, Arial",
      fontSize: as.fontSize || "14px",
    });
    // 与主按钮无缝拼接：去掉接缝边框与圆角
    caret.style.borderLeftWidth = "0";
    caret.style.verticalAlign = "top";
    // 调整主按钮右侧圆角和右边框
    anchor.style.borderTopRightRadius = "0";
    anchor.style.borderBottomRightRadius = "0";
    anchor.style.borderRightWidth = "0";
    caret.addEventListener("mouseenter", () => {
      caret.style.filter = "brightness(0.95)";
    });
    caret.addEventListener("mouseleave", () => {
      caret.style.filter = "none";
    });

    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    menu.style.position = "absolute";
    menu.style.top = "0";
    menu.style.left = "0";
    menu.style.minWidth = "200px";
    menu.style.background = "#ffffff";
    menu.style.border = "1px solid #edebe9";
    menu.style.borderRadius = "4px";
    menu.style.boxShadow =
      "0 8px 16px rgba(0,0,0,.14), 0 2px 4px rgba(0,0,0,.08)";
    menu.style.padding = "4px";
    menu.style.display = "none";
    menu.style.zIndex = "9999";
    menu.style.fontFamily =
      as.fontFamily || "Segoe UI, -apple-system, system-ui, Roboto, Arial";
    menu.style.fontSize = as.fontSize || "14px";

    for (const mi of MENU) {
      const item = document.createElement("button");
      item.type = "button";
      item.setAttribute("role", "menuitem");
      const textTpl = mi.itemText || "在 {label} 中打开";
      item.textContent = textTpl.replace("{label}", mi.label);
      Object.assign(item.style, {
        display: "flex",
        width: "100%",
        textAlign: "left",
        padding: "0 12px",
        borderRadius: "2px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        alignItems: "center",
        height: "32px",
        color: "#201f1e",
      });
      item.addEventListener(
        "mouseenter",
        () => (item.style.background = "#f3f2f1")
      );
      item.addEventListener(
        "mouseleave",
        () => (item.style.background = "transparent")
      );
      item.addEventListener("click", () => {
        const ext = parseExtPath(anchor.href);
        const tmpl = mi.schemaTemplate || `${mi.key}:extension/{ext}`;
        const converted = ext ? tmpl.replace("{ext}", ext) : null;
        if (converted) window.open(converted, "_self");
        menu.style.display = "none";
        caret.setAttribute("aria-expanded", "false");
        // no-op
      });
      menu.appendChild(item);
    }

    const toggleMenu = () => {
      if (menu.style.display === "none") {
        const cRect = container.getBoundingClientRect();
        const kRect = caret.getBoundingClientRect();
        menu.style.left = `${Math.max(
          0,
          Math.round(kRect.left - cRect.left)
        )}px`;
        menu.style.top = `${Math.round(kRect.bottom - cRect.top + 4)}px`;
      }
      const next = menu.style.display === "none" ? "block" : "none";
      menu.style.display = next;
      caret.setAttribute("aria-expanded", next === "block" ? "true" : "false");
    };

    caret.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    document.addEventListener("click", () => {
      menu.style.display = "none";
      caret.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        menu.style.display = "none";
        caret.setAttribute("aria-expanded", "false");
      }
    });

    anchor.after(caret);
    container.appendChild(menu);
  }

  async function enhance() {
    const a = findInstallAnchor(document);
    if (!a) return false;
    if (a.dataset.openInCursorEnhanced === "1") return true;
    const editors = await getPreferredEditors();
    a.dataset.openInCursorEnhanced = "1";
    const container = a.closest(
      ".ux-oneclick-install-button-container, .installButtonContainer, .ux-item-action, .ms-Fabric"
    );
    if (container) {
      // keep original style; do not highlight
      addCaretDropdown(a, container, editors);
      // no-op
      return true;
    }
    return false;
  }

  (async () => {
    let ok = false;
    for (let i = 0; i < 50; i++) {
      // eslint-disable-next-line no-await-in-loop
      ok = await enhance();
      if (ok) break;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 120));
    }
    const mo = new MutationObserver(() => {
      enhance();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  })();
})();
