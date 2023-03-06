let isAudioPlaying;

//Actions
function playSound() {
    chrome.runtime.sendMessage({
        message: "play-sound",
    }, () => {
        isAudioPlaying = true;
    })
}

function pauseSound() {
    chrome.runtime.sendMessage({
        message: "pause-sound",
    }, () => {
        isAudioPlaying = false;
    });
}

//Start Playing Sound
chrome.runtime.sendMessage({
    message: "initiate-sound",
}, () => {
    isAudioPlaying = true;
})

//Button
const playPauseButton = document.createElement('img');
const buttonImgUrl = chrome.runtime.getURL('images/playPause.png');
playPauseButton.classList.add('ce_play_pause_button');
playPauseButton.setAttribute('src', buttonImgUrl);
playPauseButton.addEventListener('click', () => {
    if (isAudioPlaying) {
        pauseSound();
    } else {
        playSound();
    }
});


// Container
const container = document.createElement('div');
container.classList.add('ce_container');
container.appendChild(playPauseButton);
document.querySelector('body').appendChild(container);


// Mutation Observer
const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const removedId = mutation.removedNodes[0]?.id;
        if (removedId === 'video-preloader' || removedId === 'preloader') {
            container.remove()
            chrome.runtime.sendMessage({
                message: "terminate-offscreen",
            });
            mutationObserver.disconnect();
        }

    })
})
mutationObserver.observe(document.querySelector('body'), { childList: true });
