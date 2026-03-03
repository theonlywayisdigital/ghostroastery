import type { SvgElement } from "../types";

// ─── Coffee (6 elements) ───

const coffeeBeanSide: SvgElement = {
  _id: "svg-coffee-bean-side",
  name: "Coffee Bean (Side)",
  category: "coffee",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#1A1A1A"><ellipse cx="32" cy="32" rx="18" ry="28" /><path d="M32 6C28 18 28 46 32 58" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 1,
};

const coffeeBeanTop: SvgElement = {
  _id: "svg-coffee-bean-top",
  name: "Coffee Bean (Top)",
  category: "coffee",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#1A1A1A"><ellipse cx="32" cy="32" rx="22" ry="20" /><path d="M14 26C22 34 42 34 50 26" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M14 38C22 30 42 30 50 38" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 2,
};

const espressoCup: SvgElement = {
  _id: "svg-espresso-cup",
  name: "Espresso Cup",
  category: "coffee",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24h36v18a8 8 0 01-8 8H16a8 8 0 01-8-8V24z" fill="#1A1A1A"/><path d="M44 28h4a6 6 0 010 12h-4" stroke="#1A1A1A"/><line x1="12" y1="54" x2="40" y2="54" stroke="#1A1A1A"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 3,
};

const coffeeCupSteam: SvgElement = {
  _id: "svg-coffee-cup-steam",
  name: "Coffee Cup with Steam",
  category: "coffee",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 28h32v16a8 8 0 01-8 8H20a8 8 0 01-8-8V28z" fill="#1A1A1A"/><path d="M44 32h4a5 5 0 010 10h-4"/><line x1="14" y1="56" x2="42" y2="56"/><path d="M22 8c0 4 4 6 4 10" stroke="#1A1A1A" fill="none"/><path d="M28 6c0 4 4 6 4 10" stroke="#1A1A1A" fill="none"/><path d="M34 8c0 4 4 6 4 10" stroke="#1A1A1A" fill="none"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 4,
};

const pourOver: SvgElement = {
  _id: "svg-pour-over",
  name: "Pour Over Dripper",
  category: "coffee",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8h32l-8 28H24L16 8z" fill="#1A1A1A"/><line x1="32" y1="36" x2="32" y2="44"/><rect x="20" y="44" width="24" height="14" rx="2" fill="none"/><line x1="14" y1="8" x2="50" y2="8"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 5,
};

const portafilter: SvgElement = {
  _id: "svg-portafilter",
  name: "Portafilter",
  category: "coffee",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 28h36a2 2 0 012 2v4a18 18 0 01-36 0v-4a2 2 0 012-2z" fill="#1A1A1A"/><line x1="8" y1="28" x2="56" y2="28"/><line x1="8" y1="24" x2="8" y2="32"/><line x1="56" y1="24" x2="56" y2="32"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 6,
};

// ─── Nature (5 elements) ───

const coffeeLeaf: SvgElement = {
  _id: "svg-coffee-leaf",
  name: "Coffee Leaf",
  category: "nature",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#1A1A1A"><path d="M32 4C16 16 8 32 16 48c2 4 6 8 12 10 0 0-4-8-2-20C28 26 36 14 52 8c0 0-8-4-20-4z"/><path d="M26 48C24 36 28 24 40 14" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 7,
};

const coffeePlant: SvgElement = {
  _id: "svg-coffee-plant",
  name: "Coffee Branch with Cherries",
  category: "nature",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"><path d="M32 56V20"/><path d="M32 20c-8-4-16 0-18 6s2 10 8 8" fill="#1A1A1A"/><path d="M32 30c8-4 16 0 18 6s-2 10-8 8" fill="#1A1A1A"/><path d="M32 40c-6-2-12 2-12 7s4 7 8 5" fill="#1A1A1A"/><circle cx="18" cy="14" r="3.5" fill="#1A1A1A"/><circle cx="24" cy="10" r="3" fill="#1A1A1A"/><circle cx="46" cy="24" r="3.5" fill="#1A1A1A"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 8,
};

const mountainSimple: SvgElement = {
  _id: "svg-mountain-simple",
  name: "Mountain Silhouette",
  category: "nature",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="#1A1A1A"><polygon points="50,4 90,46 10,46"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 9,
};

const mountainRange: SvgElement = {
  _id: "svg-mountain-range",
  name: "Mountain Range",
  category: "nature",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" fill="#1A1A1A"><polygon points="20,46 45,10 60,28 80,6 100,46"/><polygon points="0,46 25,20 50,46" opacity="0.5"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 10,
};

const waveCurl: SvgElement = {
  _id: "svg-wave-curl",
  name: "Steam Curl",
  category: "nature",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 64" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"><path d="M20 58c0-8 12-12 12-20s-12-12-12-20c0-4 0-8 0-12"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 11,
};

// ─── Navigation (3 elements) ───

const compassRose: SvgElement = {
  _id: "svg-compass-rose",
  name: "Compass Rose",
  category: "navigation",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#1A1A1A"><circle cx="32" cy="32" r="30" fill="none" stroke="#1A1A1A" stroke-width="2"/><polygon points="32,6 36,28 32,24 28,28"/><polygon points="32,58 28,36 32,40 36,36"/><polygon points="6,32 28,28 24,32 28,36"/><polygon points="58,32 36,36 40,32 36,28"/><circle cx="32" cy="32" r="3"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 12,
};

const globe: SvgElement = {
  _id: "svg-globe",
  name: "Globe",
  category: "navigation",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2"><circle cx="32" cy="32" r="26"/><ellipse cx="32" cy="32" rx="12" ry="26"/><line x1="6" y1="32" x2="58" y2="32"/><path d="M10 18h44"/><path d="M10 46h44"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 13,
};

const mapPin: SvgElement = {
  _id: "svg-map-pin",
  name: "Map Pin",
  category: "navigation",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 64" fill="#1A1A1A"><path d="M20 2A16 16 0 004 18c0 12 16 40 16 40s16-28 16-40A16 16 0 0020 2z"/><circle cx="20" cy="18" r="7" fill="#fff"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 14,
};

// ─── Geometric (6 elements) ───

const circleOutline: SvgElement = {
  _id: "svg-circle-outline",
  name: "Circle (Outline)",
  category: "geometric",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2.5"><circle cx="32" cy="32" r="28"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 15,
};

const circleFilled: SvgElement = {
  _id: "svg-circle-filled",
  name: "Circle (Filled)",
  category: "geometric",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#1A1A1A"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 16,
};

const triangleOutline: SvgElement = {
  _id: "svg-triangle-outline",
  name: "Triangle (Outline)",
  category: "geometric",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linejoin="round"><polygon points="32,6 58,56 6,56"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 17,
};

const diamond: SvgElement = {
  _id: "svg-diamond",
  name: "Diamond",
  category: "geometric",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linejoin="round"><polygon points="32,4 60,32 32,60 4,32"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 18,
};

const hexagon: SvgElement = {
  _id: "svg-hexagon",
  name: "Hexagon",
  category: "geometric",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linejoin="round"><polygon points="32,4 58,18 58,46 32,60 6,46 6,18"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 19,
};

const star6: SvgElement = {
  _id: "svg-star-6",
  name: "Star (6 Point)",
  category: "geometric",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#1A1A1A"><polygon points="32,2 38,22 58,22 42,34 48,54 32,42 16,54 22,34 6,22 26,22"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 20,
};

// ─── Borders & Frames (5 elements) ───

const simpleFrame: SvgElement = {
  _id: "svg-simple-frame",
  name: "Simple Rectangle Frame",
  category: "borders",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" fill="none" stroke="#1A1A1A" stroke-width="2"><rect x="4" y="4" width="72" height="112" rx="1"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 21,
};

const doubleFrame: SvgElement = {
  _id: "svg-double-frame",
  name: "Double Rectangle Frame",
  category: "borders",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" fill="none" stroke="#1A1A1A" stroke-width="1.5"><rect x="3" y="3" width="74" height="114" rx="1"/><rect x="8" y="8" width="64" height="104" rx="1"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 22,
};

const roundedFrame: SvgElement = {
  _id: "svg-rounded-frame",
  name: "Rounded Rectangle Frame",
  category: "borders",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" fill="none" stroke="#1A1A1A" stroke-width="2"><rect x="4" y="4" width="72" height="112" rx="10"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 23,
};

const cornerBrackets: SvgElement = {
  _id: "svg-corner-brackets",
  name: "Corner Brackets",
  category: "borders",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"><polyline points="4,20 4,4 20,4"/><polyline points="60,4 76,4 76,20"/><polyline points="76,100 76,116 60,116"/><polyline points="20,116 4,116 4,100"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 24,
};

const ovalFrame: SvgElement = {
  _id: "svg-oval-frame",
  name: "Oval Frame",
  category: "borders",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" fill="none" stroke="#1A1A1A" stroke-width="2"><ellipse cx="40" cy="50" rx="36" ry="46"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 25,
};

// ─── Badges & Stamps (5 elements) ───

const circleStamp: SvgElement = {
  _id: "svg-circle-stamp",
  name: "Circle Stamp",
  category: "badges",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none" stroke="#1A1A1A" stroke-width="2"><circle cx="40" cy="40" r="36"/><circle cx="40" cy="40" r="30"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 26,
};

const sunburstBadge: SvgElement = {
  _id: "svg-sunburst-badge",
  name: "Sunburst Badge",
  category: "badges",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="#1A1A1A"><path d="M40 4l4 12 10-8-2 12 12-2-8 10 12 4-12 4 8 10-12-2 2 12-10-8-4 12-4-12-10 8 2-12-12 2 8-10-12-4 12-4-8-10 12 2-2-12 10 8z"/><circle cx="40" cy="40" r="18" fill="#fff"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 27,
};

const ribbonBanner: SvgElement = {
  _id: "svg-ribbon-banner",
  name: "Ribbon Banner",
  category: "badges",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" fill="#1A1A1A"><path d="M10 8h100v24H10z"/><path d="M0 8l10 12L0 32V8z" opacity="0.6"/><path d="M120 8l-10 12 10 12V8z" opacity="0.6"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 28,
};

const shield: SvgElement = {
  _id: "svg-shield",
  name: "Shield",
  category: "badges",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80" fill="none" stroke="#1A1A1A" stroke-width="2.5" stroke-linejoin="round"><path d="M30 4L4 16v20c0 18 26 36 26 36s26-18 26-36V16L30 4z"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 29,
};

const rosette: SvgElement = {
  _id: "svg-rosette",
  name: "Rosette Seal",
  category: "badges",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="#1A1A1A"><circle cx="40" cy="40" r="20"/>${Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    const rad = (angle * Math.PI) / 180;
    const cx = 40 + 30 * Math.cos(rad);
    const cy = 40 + 30 * Math.sin(rad);
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="6"/>`;
  }).join("")}</svg>`,
  thumbnailUrl: null,
  sortOrder: 30,
};

// ─── Dividers (6 elements) ───

const simpleLine: SvgElement = {
  _id: "svg-simple-line",
  name: "Simple Line",
  category: "dividers",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 8" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="116" y2="4"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 31,
};

const doubleLine: SvgElement = {
  _id: "svg-double-line",
  name: "Double Line",
  category: "dividers",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 12" fill="none" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="3" x2="116" y2="3"/><line x1="4" y1="9" x2="116" y2="9"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 32,
};

const lineWithDiamond: SvgElement = {
  _id: "svg-line-diamond",
  name: "Line with Diamond",
  category: "dividers",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 12" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="6" x2="52" y2="6"/><polygon points="60,1 66,6 60,11 54,6" stroke="none"/><line x1="68" y1="6" x2="116" y2="6"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 33,
};

const flourish: SvgElement = {
  _id: "svg-flourish",
  name: "Flourish Swash",
  category: "dividers",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 20" fill="none" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"><path d="M4 10C20 10 24 2 36 2S48 10 60 10S72 18 84 18S96 10 116 10"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 34,
};

const dottedLine: SvgElement = {
  _id: "svg-dotted-line",
  name: "Dotted Line",
  category: "dividers",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 8" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 6"><line x1="4" y1="4" x2="116" y2="4"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 35,
};

const wavyLine: SvgElement = {
  _id: "svg-wavy-line",
  name: "Wavy Line",
  category: "dividers",
  svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 16" fill="none" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"><path d="M4 8c8-8 16 0 24-0s16-8 24 0 16 0 24 0 16-8 24 0"/></svg>`,
  thumbnailUrl: null,
  sortOrder: 36,
};

// ─── Export all elements ───

export const SVG_ELEMENTS: SvgElement[] = [
  // Coffee
  coffeeBeanSide,
  coffeeBeanTop,
  espressoCup,
  coffeeCupSteam,
  pourOver,
  portafilter,
  // Nature
  coffeeLeaf,
  coffeePlant,
  mountainSimple,
  mountainRange,
  waveCurl,
  // Navigation
  compassRose,
  globe,
  mapPin,
  // Geometric
  circleOutline,
  circleFilled,
  triangleOutline,
  diamond,
  hexagon,
  star6,
  // Borders & Frames
  simpleFrame,
  doubleFrame,
  roundedFrame,
  cornerBrackets,
  ovalFrame,
  // Badges & Stamps
  circleStamp,
  sunburstBadge,
  ribbonBanner,
  shield,
  rosette,
  // Dividers
  simpleLine,
  doubleLine,
  lineWithDiamond,
  flourish,
  dottedLine,
  wavyLine,
];

/** Category definitions for the elements panel filter */
export const ELEMENT_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "nature", label: "Nature" },
  { value: "navigation", label: "Navigation" },
  { value: "geometric", label: "Geometric" },
  { value: "borders", label: "Borders" },
  { value: "badges", label: "Badges" },
  { value: "dividers", label: "Dividers" },
] as const;
