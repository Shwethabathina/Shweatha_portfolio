
import React, { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";
import "./MusicPlayer.css";

const TRACK_URL = "/music/loser-instrumental.mp3";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15;

    const handlePlay = () => {
      setPlaying(true);
      setError(false);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    const handleError = () => {
      setPlaying(false);
      setError(true);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      setError(false);
      await audio.play();
    } catch (err) {
      console.error("Music playback error:", err);
      setPlaying(false);
      setError(true);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_URL}
        preload="none"
        loop
      />

      <button
        type="button"
        className={`vinylMusicButton ${playing ? "isPlaying" : ""}`}
        onClick={toggleMusic}
        aria-label={
          playing ? "Pause background music" : "Play background music"
        }
        aria-pressed={playing}
        title={
          error
            ? "Unable to play music. Check the audio file."
            : playing
              ? "Pause music"
              : "Play music"
        }
      >
        <Disc3
          size={46}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </button>
    </>
  );
}
