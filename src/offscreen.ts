import { EVENTS } from "./types";

let audio: HTMLAudioElement | null = null;
let trackInterval: NodeJS.Timeout | null = null;

const STREAM_URL = "https://stream.radio357.pl";

function startPlayback() {
  if (!audio) {
    audio = new Audio(STREAM_URL);
  }
  audio.pause();
  audio.src = STREAM_URL;
  audio.load();
  audio.play();

  fetchTrackInfo();
  if (trackInterval) {
    clearInterval(trackInterval);
    trackInterval = null;
  }
  trackInterval = setInterval(fetchTrackInfo, 20_000);
}

function stopPlayback() {
  if (audio) {
    audio.pause();
  }
  if (trackInterval) {
    clearInterval(trackInterval);
    trackInterval = null;
  }
}

function fetchTrackInfo() {
  chrome.runtime.sendMessage({ action: EVENTS.FETCH_TRACK_INFO });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === EVENTS.OFFSCREEN_PLAY) {
    startPlayback();
  } else if (message.action === EVENTS.OFFSCREEN_STOP) {
    stopPlayback();
  } else if (message.action === EVENTS.OFFSCREEN_FETCH_IS_PLAYING) {
    chrome.runtime.sendMessage({
      action: EVENTS.OFFSCREEN_UPDATE_IS_PLAYING,
      data: audio ? !audio.paused : false,
    });
  }
});
