import { NewsCategory } from "@/types/cosmos";

// Ordered rules: first match wins. Everything is derived from the text
// that the source itself published (title + summary), per the brief's
// requirement that categorization come from the original article.
const RULES: Array<{ category: NewsCategory; keywords: RegExp }> = [
  { category: "Launch", keywords: /\b(launch|liftoff|rocket|h3|h-iia|h-iib|epsilon|falcon|sls)\b/i },
  { category: "ISS", keywords: /\b(international space station|\biss\b|kibo|spacewalk|htv-x|expedition)\b/i },
  { category: "Space Telescope", keywords: /\b(webb|jwst|hubble|chandra|spherex|roman telescope|x-ray observatory)\b/i },
  { category: "Moon", keywords: /\b(moon|lunar|artemis|selene|slim)\b/i },
  { category: "Mars", keywords: /\b(mars|perseverance|curiosity rover|martian)\b/i },
  { category: "Earth", keywords: /\b(earth observatory|climate|earthcare|alos|daichi|weather|wildfire|hurricane)\b/i },
  { category: "Astronomy", keywords: /\b(galaxy|nebula|black hole|exoplanet|asteroid|comet|supernova|solar system)\b/i },
  { category: "Aeronautics", keywords: /\b(aeronautics|aircraft|supersonic|aviation|drone)\b/i },
  { category: "Mission", keywords: /\b(mission|hayabusa|probe|spacecraft|satellite|orbiter)\b/i }
];

export function categorize(title: string, summary: string): NewsCategory {
  const text = `${title} ${summary}`;
  for (const rule of RULES) {
    if (rule.keywords.test(text)) return rule.category;
  }
  return "General";
}
