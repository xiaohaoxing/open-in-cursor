// Background service worker loaded via manifest.background.service_worker

// Clean background: no logs, only register content scripts

self.addEventListener('install', () => {});

self.addEventListener('activate', () => {});

try {
  if (chrome?.runtime?.onInstalled) {
    chrome.runtime.onInstalled.addListener((details) => {
      try {
        chrome.scripting?.registerContentScripts?.([
          {
            id: 'open-in-cursor-details',
            matches: ['https://marketplace.visualstudio.com/*'],
            js: ['config.js', 'cs-inject.js'],
            allFrames: true,
            runAt: 'document_idle',
            persistAcrossSessions: true,
          },
        ]);
      } catch (e) {
        // ignore
      }
    });
  }

  if (chrome?.runtime?.onStartup) {
    chrome.runtime.onStartup.addListener(() => {
      try {
        chrome.scripting?.registerContentScripts?.([
          {
            id: 'open-in-cursor-details',
            matches: ['https://marketplace.visualstudio.com/*'],
            js: ['config.js', 'cs-inject.js'],
            allFrames: true,
            runAt: 'document_idle',
            persistAcrossSessions: true,
          },
        ]);
      } catch (e) {
        // ignore
      }
    });
  }
} catch (e) {
  // ignore
}


