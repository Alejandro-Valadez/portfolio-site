export type Track = {
  title: string;
  artist: string;
  /**
   * ID of an official YouTube upload. The player streams through YouTube's
   * embed, so no audio file is hosted here.
   */
  youtubeId: string;
};

// First track plays first. Add more by appending entries.
export const PLAYLIST: readonly Track[] = [
  {
    title: "Aruarian Dance",
    artist: "Nujabes",
    // "Nujabes - Topic", YouTube's official, label-provided channel.
    youtubeId: "qYcoJpqCha4",
  },
];

export const coverUrl = (track: Track) => `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`;
export const watchUrl = (track: Track) => `https://www.youtube.com/watch?v=${track.youtubeId}`;
