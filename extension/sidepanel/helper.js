const getCurrentURL = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        resolve(currentTab.url || "No active tab found!");
      } else {
        reject("No active tab!");
      }
    });
  });
};
