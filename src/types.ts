export enum EVENTS {
  PLAY = "event.radio357.play",
  STOP = "event.radio357.stop",
  OFFSCREEN_PLAY = "event.radio357.offscreen-play",
  OFFSCREEN_STOP = "event.radio357.offscreen-stop",
  OFFSCREEN_FETCH_IS_PLAYING = "event.radio357.offscreen-fetch-is-playing",
  OFFSCREEN_UPDATE_IS_PLAYING = "event.radio357.offscreen-update-is-playing",
  FETCH_TRACK_INFO = "event.radio357.fetch-track-info",
  UPDATE_TRACK_INFO = "event.radio357.update-track-info",
  FETCH_IS_PLAYING = "event.radio357.get-is-playing",
  UPDATE_IS_PLAYING = "event.radio357.update-is-playing",
}

/**
 * Pause
{ "s": "Soap&Skin - Mystery Of Love", "t": "2024-12-01 11:25:01", "p": { "i": "417692", "n": "Stonowanie", "a": "Ola Budka", "t": "https://radio357.pl/cdn-cgi/image/w=660,h=660,fit=cover,g=0.5x0/wp-content/uploads/zespol/OLA_BUDKA.jpg", "c": { "d": "https://media.radio357.pl/zespol/OLA_BUDKA.jpg?auto=format%2Ccompress&fit=crop&crop=faces%2Ctop" }, "d": 7200, "p": 1501, "u": "53" }, "n": { "t": "13:00", "n": "Patronautyka" } }
 */

export type TrackInfo = {
  s: string; // song title
  t: string; // timestamp in ISO 8601 format
  p: {
    // program info
    i: string; // program id
    n: string; // program name
    a: string; // program artist
    t: string; // program thumbnail url
    c: {
      // program cover url
      d: string; // program cover url
    };
    d: number; // program duration in seconds
    p: number; // program progress in seconds
    u: string; // ?
  };
  n: {
    // next program info
    t: string; // program time in HH:MM format
    n: string; // program name
  };
};
