const checkValidURL = url => {
    if (!/^http/.test(url)) {
        return false;
    }

    url = new URL(url);

    if ((url.hostname === "www.facebook.com" && url.pathname.includes("/watch")) || url.hostname === "www.youtube.com") {
        return true;
    }

    return false;
};

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.sendMessage(activeInfo.tabId, { text: "u there content.js?" }, msg => {
        msg = msg || {};

        if (msg.status !== "yes") {
            chrome.tabs.get(activeInfo.tabId, tab => {
                if (checkValidURL(tab.url)) {
                    chrome.scripting.executeScript({
                        target: { tabId: activeInfo.tabId },
                        files: ["content.js"]
                    }).then(() => {
                        console.log("INJECTED THE FOREGROUND SCRIPT.");
                    })
                }
            });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.tabs.sendMessage(tabId, { text: "u there content.js?" }, msg => {
        msg = msg || {};

        if (msg.status !== "yes" && changeInfo.status === "complete" && checkValidURL(tab.url)) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["content.js"]
            }).then(() => {
                console.log("INJECTED THE FOREGROUND SCRIPT.");
            })
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request.videos_content);
});
