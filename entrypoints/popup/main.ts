import { getPreferredEditors, setPreferredEditors } from "../../shared/storage";

type MenuItem = { key: string; label: string };

function loadConfig(): Promise<MenuItem[]> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    // 加载 public/config.js
    // @ts-ignore
    script.src = chrome.runtime.getURL("config.js");
    script.onload = () => {
      // @ts-ignore
      const list = (window.OPEN_IN_CURSOR_MENU ?? []) as MenuItem[];
      resolve(list);
    };
    document.head.appendChild(script);
  });
}

function renderOptions(container: HTMLElement, items: MenuItem[], selected: string[]) {
  container.innerHTML = "";
  for (const item of items) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `opt-${item.key}`;
    input.checked = selected.includes(item.key);
    // 勾选即保存
    input.addEventListener("change", async () => {
      const editors: string[] = [];
      for (const it of items) {
        const el = document.getElementById(`opt-${it.key}`) as HTMLInputElement | null;
        if (el?.checked) editors.push(it.key);
      }
      await setPreferredEditors(editors.length ? editors : ["cursor"]);
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + item.label));
    container.appendChild(label);
  }
}

async function init() {
  const container = document.getElementById("opts") as HTMLDivElement;
  const [menu, selected] = await Promise.all([loadConfig(), getPreferredEditors()]);
  renderOptions(container, menu as MenuItem[], selected as string[]);
}

init();


