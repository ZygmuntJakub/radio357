import { useState, useEffect } from "react";
import Footer from "./Footer";
import { EVENTS, TrackInfo } from "../types";

export default function () {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);

  const handlePlay = () => {
    chrome.runtime.sendMessage({ action: EVENTS.PLAY });
    setIsPlaying(true);
  };

  const handleStop = () => {
    chrome.runtime.sendMessage({ action: EVENTS.STOP });
    setIsPlaying(false);
  };

  const listener = (message: { action: EVENTS; data: any }) => {
    if (message.action === EVENTS.UPDATE_TRACK_INFO) {
      setTrackInfo(message.data);
    }
    if (message.action === EVENTS.UPDATE_IS_PLAYING) {
      setIsPlaying(message.data);
    }
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ action: EVENTS.FETCH_IS_PLAYING });

    chrome.storage.local.get("trackInfo", (result) => {
      if (result.trackInfo) {
        setTrackInfo(JSON.parse(result.trackInfo));
      } else {
        chrome.runtime.sendMessage({ action: EVENTS.FETCH_TRACK_INFO });
      }
    });

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      chrome.runtime.sendMessage({ action: EVENTS.FETCH_IS_PLAYING });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!trackInfo) {
    return (
      <div>
        <span className="header">WCZYTYWANIE</span>
        <div className="main-container">
          <div className="image-placeholder"></div>
          <div className="text-placeholder-1"></div>
          <div className="text-placeholder-2"></div>
          <button className="audio-control play-button" onClick={handlePlay} />
          <div className="text-placeholder-3"></div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ ["--progress-bar-width" as any]: "0%" }}
            ></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <span className="header">TERAZ</span>
      <div className="main-container">
        <img src={trackInfo?.p?.t} alt="track" className="profile-image" />
        <span className="title">{trackInfo?.p?.a}</span>
        <span className="subtitle">{trackInfo?.p?.n}</span>

        {isPlaying ? (
          <button className="audio-control stop-button" onClick={handleStop} />
        ) : (
          <button className="audio-control play-button" onClick={handlePlay} />
        )}
        <span className="song-info">{trackInfo?.s}</span>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              ["--progress-bar-width" as any]:
                ((trackInfo?.p?.p || 0) / (trackInfo?.p?.d || 1)) * 100 + "%",
            }}
          ></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
