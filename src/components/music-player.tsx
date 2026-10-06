"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ChevronUp,
  ExternalLink,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { PLAYLIST, coverUrl, watchUrl, type Track } from "@/lib/playlist";
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

/* ---------- Minimal YouTube IFrame API typings and loader ---------- */

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  destroy(): void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      host?: string;
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 } as const;

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

/* ---------- Visual bits ---------- */

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
        "relative block shrink-0 overflow-hidden rounded-full bg-[#05070d] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_6px_18px_-6px_rgba(0,0,0,0.8)]",
        className
      )}
      style={{
        backgroundImage:
          "repeating-radial-gradient(circle at center, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)",
        animation: spinning ? "spin-slow 3.2s linear infinite" : undefined,
      }}
    >
      <span className="absolute inset-[24%] overflow-hidden rounded-full">
        {/* The thumbnail is 4:3 with the square album art centered. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl(track)}
          alt=""
          className="size-full scale-[1.34] object-cover"
          decoding="async"
          loading="lazy"
        />
      </span>
      <span className="absolute inset-[46%] rounded-full bg-[#05070d]" />
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_45%)]" />
    </span>
  );
}

function EqBars({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[0, 0.25, 0.5].map((delay) => (
        <span
          key={delay}
          className="w-[3px] origin-bottom rounded-full bg-brand"
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

/* ---------- The player ---------- */

function Player() {
  const panelRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const creatingRef = useRef(false);
  const wantPlayRef = useRef(false);
  const tapTimerRef = useRef<number>(0);

  // Last track, volume, and position from this browser. Safe to read during
  // render because MusicPlayer only mounts this component on the client.
  const [saved] = useState(readSaved);
  const [index, setIndex] = useState(() =>
    typeof saved.index === "number" && PLAYLIST[saved.index] ? saved.index : 0
  );
  const [volume, setVolume] = useState(() =>
    typeof saved.volume === "number" ? saved.volume : 0.6
  );
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  const [time, setTime] = useState(() => (typeof saved.time === "number" ? saved.time : 0));
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [needsTap, setNeedsTap] = useState(false);

  const track = PLAYLIST[index];

  // Mirrors of state for the YouTube callbacks, which are created once.
  const indexRef = useRef(index);
  const volumeRef = useRef(volume);
  const mutedRef = useRef(muted);
  const timeRef = useRef(time);
  useEffect(() => {
    indexRef.current = index;
    volumeRef.current = volume;
    mutedRef.current = muted;
    timeRef.current = time;
  });

  const clearTapTimer = () => window.clearTimeout(tapTimerRef.current);

  const go = useCallback((delta: number) => {
    const player = playerRef.current;
    if (player && delta < 0 && player.getCurrentTime() > 3) {
      player.seekTo(0, true);
      return;
    }
    const next = (indexRef.current + delta + PLAYLIST.length) % PLAYLIST.length;
    setIndex(next);
    setTime(0);
    if (!player) return;
    if (next === indexRef.current) {
      // One-track playlist: loop it.
      player.seekTo(0, true);
      player.playVideo();
    } else {
      player.loadVideoById({ videoId: PLAYLIST[next].youtubeId });
    }
  }, []);

  /** Builds the YouTube player once. */
  const ensurePlayer = useCallback(async () => {
    if (playerRef.current || creatingRef.current || !hostRef.current) return;
    creatingRef.current = true;
    setLoading(true);
    try {
      const YT = await loadYouTubeApi();
      const mount = document.createElement("div");
      hostRef.current.replaceChildren(mount);
      const start = timeRef.current > 2 ? Math.floor(timeRef.current) : 0;
      const player = new YT.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId: PLAYLIST[indexRef.current].youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          rel: 0,
          start,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            playerRef.current = player;
            player.setVolume(mutedRef.current ? 0 : Math.round(volumeRef.current * 100));
            setDuration(player.getDuration() || 0);
            setReady(true);
            setLoading(false);
            if (wantPlayRef.current) player.playVideo();
          },
          onStateChange: ({ data }) => {
            if (data === STATE.PLAYING) {
              clearTapTimer();
              setNeedsTap(false);
              setError(null);
              setLoading(false);
              setPlaying(true);
              setDuration(player.getDuration() || 0);
            } else if (data === STATE.BUFFERING) {
              setLoading(true);
            } else {
              setLoading(false);
              setPlaying(false);
            }
            if (data === STATE.ENDED) go(1);
          },
          onError: ({ data }) => {
            clearTapTimer();
            setLoading(false);
            setPlaying(false);
            setError(
              data === 101 || data === 150
                ? "YouTube won't play this track outside its site."
                : "Couldn't load this track."
            );
          },
        },
      });
    } catch {
      setLoading(false);
      setError("Couldn't reach YouTube. Check your connection or ad blocker.");
    } finally {
      creatingRef.current = false;
    }
  }, [go]);

  const play = useCallback(() => {
    wantPlayRef.current = true;
    setWantPlay(true);
    setError(null);
    const player = playerRef.current;
    if (player) player.playVideo();
    else void ensurePlayer();
    // Some browsers (mostly iOS Safari) only start embedded media from a tap
    // inside the embed itself. If nothing plays soon, show the embed and ask.
    clearTapTimer();
    tapTimerRef.current = window.setTimeout(() => {
      const p = playerRef.current;
      if (p && p.getPlayerState() !== STATE.PLAYING) {
        setNeedsTap(true);
        setOpen(true);
      }
    }, 4000);
  }, [ensurePlayer]);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    setWantPlay(false);
    clearTapTimer();
    playerRef.current?.pauseVideo();
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  // Warm up the embed on the first sign of interest anywhere on the page, so
  // pressing play usually starts the music right away.
  useEffect(() => {
    const warm = () => void ensurePlayer();
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", warm, opts);
    window.addEventListener("keydown", warm, opts);
    window.addEventListener("scroll", warm, opts);
    return () => {
      window.removeEventListener("pointerdown", warm);
      window.removeEventListener("keydown", warm);
      window.removeEventListener("scroll", warm);
    };
  }, [ensurePlayer]);

  useEffect(() => {
    playerRef.current?.setVolume(muted ? 0 : Math.round(volume * 100));
  }, [volume, muted]);

  // Track the playhead while playing.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (player) setTime(player.getCurrentTime());
    }, 500);
    return () => window.clearInterval(id);
  }, [playing]);

  // Remember track, volume, and position for the next visit.
  useEffect(() => {
    const save = () => {
      try {
        const t = playerRef.current?.getCurrentTime() ?? timeRef.current;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, volume, time: t }));
      } catch {}
    };
    save();
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, [index, volume]);

  useEffect(
    () => () => {
      clearTapTimer();
      playerRef.current?.destroy();
    },
    []
  );

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
  const progress = duration ? Math.min(100, (time / duration) * 100) : 0;
  const busy = loading && wantPlay && !playing;

  return (
    <div
      ref={panelRef}
      onPointerEnter={() => void ensurePlayer()}
      onFocus={() => void ensurePlayer()}
      className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
    >
      {/* The panel stays mounted while closed so the embed keeps playing. */}
      <div
        role="dialog"
        aria-label="Music player"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "glass glass-thick absolute bottom-full left-0 mb-3 w-[min(20rem,calc(100vw-2rem))] origin-bottom-left rounded-[1.75rem] p-4 transition-[opacity,transform,visibility] duration-300 ease-out",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible translate-y-2 scale-[0.98] opacity-0"
        )}
      >
        <div className="flex items-start justify-between">
          <p className="text-label text-muted-foreground">Now playing</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close player"
            className="-mt-1 -mr-1 rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* YouTube embed of the official upload; it shows the album art. */}
        <div className="relative mt-3 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl(track)} alt="" className="absolute inset-0 size-full object-cover" />
          <div ref={hostRef} className="absolute inset-0 [&>iframe]:size-full" />
          {needsTap ? (
            <p className="pointer-events-none absolute inset-x-2 bottom-2 rounded-full bg-black/70 px-3 py-1 text-center text-xs text-white">
              Tap the video once to start the music.
            </p>
          ) : null}
        </div>

        <div className="mt-3 min-w-0">
          <p className="truncate font-display text-2xl leading-tight">{track.title}</p>
          <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
        </div>

        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={Math.min(time, duration || 0)}
            disabled={!ready || !duration}
            aria-label="Seek"
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            onChange={(e) => {
              const t = Number(e.target.value);
              playerRef.current?.seekTo(t, true);
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

        <div className="mt-1 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!ready}
            aria-label="Previous track"
            className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-40"
          >
            <SkipBack className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_rgb(111_168_255/0.7)] transition-transform hover:scale-105 active:scale-95"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : playing ? (
              <Pause className="size-5" />
            ) : (
              <Play className="ml-0.5 size-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={!ready}
            aria-label="Next track"
            className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-40"
          >
            <SkipForward className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            className="rounded-full p-1 text-muted-foreground hover:text-foreground"
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
          <ol className="mt-4 space-y-1 border-t border-white/10 pt-3">
            {PLAYLIST.map((t, i) => (
              <li key={t.youtubeId}>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setTime(0);
                    wantPlayRef.current = true;
                    setWantPlay(true);
                    playerRef.current?.loadVideoById({ videoId: t.youtubeId });
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/10",
                    i === index && "text-brand"
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
            {error}{" "}
            <a
              href={watchUrl(track)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-0.5 underline underline-offset-2"
            >
              Open on YouTube <ExternalLink className="size-3" />
            </a>
          </p>
        ) : (
          <p className="mt-3 text-[11px] leading-snug text-muted-foreground/80">
            Streams the official upload from{" "}
            <a
              href={watchUrl(track)}
              target="_blank"
              rel="noopener"
              className="underline underline-offset-2 hover:text-foreground"
            >
              YouTube
            </a>
            .
          </p>
        )}
      </div>

      {/* Collapsed pill. */}
      <div className="glass glass-thick glass-interactive flex w-fit items-center gap-2 rounded-full py-1.5 pr-1.5 pl-1.5">
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
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : playing ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="ml-0.5 size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
