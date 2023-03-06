let audio;

function initiateAudio({ source, volume }) {
  audio = new Audio(source);
  audio.volume = volume;
  audio.play();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.message) {
    case "initiate-offscreen-sound":
      initiateAudio(request.payload);
      break;
    case 'play-sound':
      if (audio) {
        audio.play();
        sendResponse({ message: 'SUCCESS' });
      } else {
        sendResponse({ message: 'FAILED TO PLAY: OFSSCREEN AUDIO NOT INITIATED' });
      }
      break;
    case 'pause-sound':
      if (audio) {
        audio.pause();
        sendResponse({ message: 'SUCCESS' });
      } else {
        sendResponse({ message: 'FAILED TO PAUSE: OFSSCREEN AUDIO NOT INITIATED' });
      }
      break;
  }
});



