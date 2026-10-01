const paths={
blade:'<path d="M9 24 24 4l4 1-1 4L13 27z"/><path d="m7 18 12 10M5 28l5-6"/>',
arrow:'<path d="M7 26 26 7m-8 0h8v8M8 7q14 7 17 18M8 7l17 18M6 22l4 4"/>',
bolt:'<path d="m19 3-4 11H7l10 15 2-11h7z"/>',
orbit:'<path d="m16 8 3 6 7 2-7 3-3 6-3-6-6-3 6-2z"/><ellipse cx="16" cy="16" rx="14" ry="8" transform="rotate(-35 16 16)"/>',
lightning:'<path d="M19 3 8 18h8l-3 11 12-16h-9z"/>',
frost:'<path d="M16 3v26M5 9l22 14M5 23 27 9M12 5l4 4 4-4M12 27l4-4 4 4M6 13l4-1-1-4M23 24l-1-4 4-1M6 19l4 1-1 4M23 8l-1 4 4 1"/>',
power:'<path d="m16 3 11 8-4 14-7 5-7-5-4-14z"/><path d="m16 9-5 7 5 7 5-7z"/>',
haste:'<circle cx="16" cy="16" r="12"/><path d="M16 7v10l6 3M11 2h10"/>',
boots:'<path d="M14 4h9l-2 13 7 5v5H9v-7l5-3zM4 10h7M2 15h7"/>',
heart:'<path d="M16 27 5 17C-3 5 11 1 16 10 21 1 35 5 27 17z"/><path d="M8 16h5l2-4 3 9 2-5h4"/>',
magnet:'<path d="M6 8v9a10 10 0 0 0 20 0V8h-6v9a4 4 0 0 1-8 0V8zM6 12h6m8 0h6"/>',
dash:'<path d="m10 5 9 11-9 11m8-22 9 11-9 11M3 11h5M1 16h6M3 21h5"/>',
ultimate:'<path d="m16 2 4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="m25 3 1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
settings:'<path d="m13 3 6 0 1 4 4 2 4-1 3 5-3 3v4l2 3-4 4-4-2-3 1-2 4h-6l-1-4-4-2-4 1-2-5 3-3v-4l-2-3 4-4 4 2 3-1z"/><circle cx="16" cy="16" r="5"/>',
pause:'<path d="M10 7v18M22 7v18"/>'
};
export function iconMarkup(key){return '<svg class="rune-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[key]||paths.heart)+'</svg>';}
