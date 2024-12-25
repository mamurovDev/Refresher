// Define the URL to monitor and refresh
const targetUrl = "https://dash.tteld.com/";

// Function to check if the user is active on the tab
function isUserActive(tabId) {
    return new Promise((resolve) => {
        chrome.windows.getCurrent({ populate: true }, (window) => {
            const activeTab = window.tabs.find(tab => tab.id === tabId && tab.active);
            resolve(Boolean(activeTab));
        });
    });
}

// Function to refresh the tab
function refreshTab(tabId) {
    chrome.tabs.reload(tabId, { bypassCache: true }, () => {
        console.log("Tab refreshed:", tabId);
    });
}

// Monitor tabs and implement the refresh logic
function monitorTabs() {
    setInterval(async () => {
        chrome.tabs.query({ url: targetUrl }, async (tabs) => {
            if (tabs.length === 0) return; // No tabs with the target URL

            const tab = tabs[0]; // Assume monitoring the first tab with the URL
            const isActive = await isUserActive(tab.id);

            if (!isActive) {
                refreshTab(tab.id);
            } else {
                console.log("User is active on the tab. Skipping refresh.");
            }
        });
    }, 5 * 60 * 1000); // 5 minutes interval
}

// Start monitoring when the extension is loaded
chrome.runtime.onInstalled.addListener(() => {
    monitorTabs();
});
