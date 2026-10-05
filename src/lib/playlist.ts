export type Track = {
  title: string;
  artist: string;
  /** Path under /public, e.g. /music/aruarian-dance.mp3 */
  src: string;
  /** Two colors for the generated vinyl label (no album art is hosted). */
  label: readonly [string, string];
};

// First track plays first. Add more by dropping an .mp3 into public/music/
// and appending an entry here.
export const PLAYLIST: readonly Track[] = [
  {
    title: "Aruarian Dance",
    artist: "Nujabes",
    src: "/music/aruarian-dance.mp3",
    label: ["#2E6F8E", "#E4B363"],
  },
];
