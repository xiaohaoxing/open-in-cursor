const STORAGE_KEY = "preferredEditors";
const DEFAULT_EDITORS: string[] = ["cursor"];

export async function getPreferredEditors(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const list = (result?.[STORAGE_KEY] ?? DEFAULT_EDITORS) as string[];
      resolve(list);
    });
  });
}

export async function setPreferredEditors(editors: string[]): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: editors }, () => resolve());
  });
}


