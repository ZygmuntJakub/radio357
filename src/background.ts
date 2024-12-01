import { EVENTS } from "./types";

const TRACK_INFO_URL = "https://stream.radio357.pl/now/playing.json";

const HANDLERS = {
  [EVENTS.PLAY]: play,
  [EVENTS.STOP]: stop,
  [EVENTS.FETCH_TRACK_INFO]: fetchTrackInfo,
  [EVENTS.FETCH_IS_PLAYING]: fetchIsPlaying,
  [EVENTS.OFFSCREEN_UPDATE_IS_PLAYING]: updateIsPlaying,
};

async function ensureOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) return;

  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: "Playing radio streams and fetching track information.",
  });
}

async function play() {
  await ensureOffscreenDocument();
  chrome.runtime.sendMessage({ action: EVENTS.OFFSCREEN_PLAY });
}

function stop() {
  chrome.runtime.sendMessage({ action: EVENTS.OFFSCREEN_STOP });
}

async function fetchTrackInfo() {
  const response = await fetch(`${TRACK_INFO_URL}?t=${Date.now()}`);
  const data = await response.json();

  chrome.storage.local.set({
    trackInfo: JSON.stringify(data),
  });

  chrome.runtime.sendMessage({
    action: EVENTS.UPDATE_TRACK_INFO,
    data,
  });
}

async function fetchIsPlaying() {
  chrome.runtime.sendMessage({
    action: EVENTS.OFFSCREEN_FETCH_IS_PLAYING,
  });
}

function updateIsPlaying(message: { data: boolean }) {
  chrome.runtime.sendMessage({
    action: EVENTS.UPDATE_IS_PLAYING,
    data: message.data,
  });
}

chrome.runtime.onMessage.addListener((message) => {
  HANDLERS[
    message.action as
      | EVENTS.PLAY
      | EVENTS.STOP
      | EVENTS.FETCH_TRACK_INFO
      | EVENTS.FETCH_IS_PLAYING
      | EVENTS.OFFSCREEN_UPDATE_IS_PLAYING
  ]?.(message);
});
