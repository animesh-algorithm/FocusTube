const TAG = "[FOCUS_TUBE]:";

chrome.runtime.onInstalled.addListener(() => {
  console.log(TAG, "Background script running");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: toggleElements,
    });
  }
});
