async function initiateSound(source = 'Elevator-music.mp3', volume = 1) {
    await createOffscreen();
    await chrome.runtime.sendMessage(
        {
            message: "initiate-offscreen-sound",
            payload: { source, volume }
        }
    );
}

async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'to play audio'
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && /^http/.test(tab.url)) {
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./foreground_styles.css"]
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND STYLES.");

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./foreground.js"]
                })
                    .then(() => {
                        console.log("INJECTED THE FOREGROUND SCRIPT.");
                    });
            })
            .catch(err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("MESSAGE RECEIVED - ", request.message)
    switch (request.message) {
        case 'initiate-sound':
            initiateSound(request?.payload?.source, request?.payload?.volume);
            break;
        case 'terminate-offscreen':
            chrome.offscreen.closeDocument();
            break;
    }
});
