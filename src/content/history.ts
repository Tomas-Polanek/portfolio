type Commit = {
  hash: string;
  subject: string;
  /** 0 = main, 1 = the style-previews branch (fast-forwarded into main at its last commit). */
  lane: 0 | 1;
};

/**
 * Selected commits of this site's repository, oldest first (hashes and subjects verbatim from
 * `git log`). Drawn as a git graph in the left page margin on wide screens.
 */
export const history: readonly Commit[] = [
  { hash: "2c473c7", subject: "Initial commit from Create Next App", lane: 0 },
  { hash: "23fe566", subject: "Set up CZ/EN routing, galaxy theme and page shell", lane: 0 },
  { hash: "db1b8ce", subject: "Add projects section fed by the GitHub API (cached daily)", lane: 0 },
  { hash: "1e74f07", subject: "Add Linux & Homelab section (Raspberry Pi 5 setup)", lane: 0 },
  { hash: "5ee8cc1", subject: "Show project screenshots on cards (Fridge Notebook first)", lane: 0 },
  { hash: "42936b9", subject: "Add Bento + sticky panel style preview", lane: 1 },
  {
    hash: "462aa5a",
    subject: "Bento + panel: interactive wireframe 3D model of the Pi 5 build with exploded view",
    lane: 1,
  },
  {
    hash: "c335f29",
    subject: "Logo: TP ligature on gradient tile as favicon, apple icon and panel monogram",
    lane: 1,
  },
  {
    hash: "2e59a33",
    subject:
      "Bento + panel: liquid glass tiles and panel over a colour-field backdrop (liquid-glass-react, frosted fallback)",
    lane: 1,
  },
  {
    hash: "ec37a02",
    subject: "Move the chosen Bento + panel building blocks out of the previews, delete all previews",
    lane: 0,
  },
  {
    hash: "1d8b0d4",
    subject:
      "Remove the galaxy theme: design tokens on :root, glass tiles by default, 404 in the new style, README",
    lane: 0,
  },
  {
    hash: "2c02c83",
    subject: "Content from LinkedIn: about text, Software Development naming, high school and work experience",
    lane: 0,
  },
  {
    hash: "c8ddd48",
    subject: "Drop liquid-glass-react: CSS frosted glass everywhere, including the side panel and 404",
    lane: 0,
  },
  {
    hash: "4833be7",
    subject:
      "Project cards without screenshot covers: project icon, language chip and a Preview button for the screenshot; equal 3-column grid; drop the second sidebar line",
    lane: 0,
  },
  {
    hash: "f0ce8c1",
    subject:
      "Scroll-linked backdrop: colour blobs travel across the screen with the page scroll (CSS scroll-driven animation), slow drift kept underneath",
    lane: 0,
  },
  {
    hash: "59ba095",
    subject:
      "Animations: cursor spotlight on tiles, section reading progress in the side nav, staggered name intro",
    lane: 0,
  },
  {
    hash: "8eabb4c",
    subject: "E-mail and 404 buttons in the icon-well style instead of solid black/white",
    lane: 0,
  },
];
