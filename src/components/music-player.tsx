"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { PLAYLIST, type Track } from "@/lib/playlist";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "av-player";

type Saved = { index?: number; volume?: number; time?: number };

function readSaved(): Saved {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Saved;
  } catch {
    return {};
  }
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Vinyl({
  track,
  spinning,
  className,
}: {
  track: Track;
  spinning: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block shrink-0 rounded-full bg-[#0d0c0b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        className
      )}
      style={{
        backgroundImage:
          "repeating-radial-gradient(circle at center, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)",
        animation: spinning ? "spin-slow 3.2s linear infinite" : undefined,
      }}
    >
      <span
        className="absolute inset-[30%] rounded-full"
        style={{
          background: `conic-gradient(from 200deg, ${track.label[0]}, ${track.label[1]}, ${track.label[0]})`,
        }}
      />
      <span className="absolute inset-[46%] rounded-full bg-[#0d0c0b]" />
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)]" />
    </span>
  );
}

function EqBars({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[0, 0.25, 0.5].map((delay) => (
        <span
          key={delay}
          className="w-[3px] origin-bottom rounded-full bg-ember"
          style={{
            height: "100%",
            transform: active ? undefined : "scaleY(0.3)",
            animation: active ? `eq 0.9s ease-in-out ${delay}s infinite` : undefined,
          }}
        />
      ))}
    </span>
  );
}

const noopSubscribe = () => () => {};

/** Renders the player only after hydration, since its state lives in localStorage. */
export function MusicPlayer() {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return isClient ? <Player /> : null;
}

function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Last track, volume, and position from this browser. Safe to read during
  // render because MusicPlayer only mounts this component on the client.
  const [saved] = useState(readSaved);
  const resumeAt = useRef(typeof saved.time === "number" ? saved.time : 0);

  const [index, setIndex] = useState(() =>
    typeof saved.index === "number" && PLAYLIST[saved.index] ? saved.index : 0
  );
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() =>
    typeof saved.volume === "number" ? saved.volume : 0.6
  );
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);

  const track = PLAYLIST[index];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ index, volume, time: audioRef.current?.currentTime ?? 0 })
        );
      } catch {}
    };
    save();
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, [index, volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setError(false);
      await audio.play();
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError(true);
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else audio.pause();
  }, [play]);

  const go = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (audio && delta < 0 && audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }
      const wasPlaying = audio ? !audio.paused : false;
      resumeAt.current = 0;
      setIndex((i) => (i + delta + PLAYLIST.length) % PLAYLIST.length);
      setTime(0);
      if (wasPlaying) requestAnimationFrame(() => void play());
    },
    [play]
  );

  // OS-level media controls (lock screen, keyboard media keys).
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: "alejandrovaladez.me",
    });
    navigator.mediaSession.setActionHandler("play", () => void play());
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => go(-1));
    navigator.mediaSession.setActionHandler("nexttrack", () => go(1));
  }, [track, play, go]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
    >
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        loop={PLAYLIST.length === 1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => go(1)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (resumeAt.current > 0 && resumeAt.current < e.currentTarget.duration - 2) {
            e.currentTarget.currentTime = resumeAt.current;
          }
          resumeAt.current = 0;
        }}
        onError={() => {
          setPlaying(false);
          setError(true);
        }}
      />

      {open ? (
        <div
          role="dialog"
          aria-label="Music player"
          className="mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
        >
          <div className="flex items-start justify-between">
            <p className="text-label text-muted-foreground">Now playing</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close player"
              className="-mt-1 -mr-1 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <Vinyl track={track} spinning={playing} className="size-20 motion-reduce:animate-none" />
            <div className="min-w-0">
              <p className="truncate font-display text-2xl leading-tight">{track.title}</p>
              <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              disabled={!duration}
              aria-label="Seek"
              aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = t;
                setTime(t);
              }}
              className="player-range w-full"
              style={{ "--progress": `${progress}%` } as React.CSSProperties}
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
              <span>{formatTime(time)}</span>
              <span>{duration ? formatTime(duration) : "–:––"}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous track"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <SkipBack className="size-4" />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {playing ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5" />}
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next track"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <SkipForward className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <VolumeIcon className="size-4" />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setMuted(false);
              }}
              className="player-range w-full"
              style={{ "--progress": `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
            />
          </div>

          {PLAYLIST.length > 1 ? (
            <ol className="mt-4 space-y-1 border-t border-border pt-3">
              {PLAYLIST.map((t, i) => (
                <li key={t.src}>
                  <button
                    type="button"
                    onClick={() => {
                      resumeAt.current = 0;
                      setIndex(i);
                      requestAnimationFrame(() => void play());
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted",
                      i === index && "text-ember"
                    )}
                  >
                    <span className="w-4 font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                    <span className="truncate">{t.title}</span>
                    <span className="ml-auto truncate text-xs text-muted-foreground">{t.artist}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}

          {error ? (
            <p role="alert" className="mt-3 text-xs text-destructive">
              Couldn&apos;t load this track.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2 rounded-full border border-border bg-popover/90 py-1.5 pr-1.5 pl-1.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Hide music player" : "Show music player"}
          className="group flex min-w-0 items-center gap-2.5 rounded-full pr-1 text-left"
        >
          <Vinyl track={track} spinning={playing} className="size-9 motion-reduce:animate-none" />
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-36 truncate text-[13px] leading-tight font-medium">
              {track.title}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] leading-tight text-muted-foreground">
              <EqBars active={playing} />
              {track.artist}
            </span>
          </span>
          <ChevronUp
            aria-hidden
            className={cn(
              "hidden size-3.5 text-muted-foreground transition-transform sm:block",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title} by ${track.artist}`}
          className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="ml-0.5 size-3.5" />}
        </button>
      </div>
    </div>
  );
}
