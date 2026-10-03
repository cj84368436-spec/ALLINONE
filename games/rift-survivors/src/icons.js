import {STAGE_SKILL_ROWS} from "./campaign.js";
import {Art,SKILL_ART_KEYS,SKILL_ART_ROWS,EXTRA_SKILL_KEYS} from "./art.js";
const paths={
whirlwind:'<path d="M26 8C18-2 0 7 6 20c4 9 20 6 18-3-1-6-11-7-13-2-2 5 5 8 8 4M24 3l2 5-6 2"/>',
cleave:'<path d="m6 26 20-20M19 4l9 0 0 9M4 17c4-8 10-12 19-13M15 28c8-4 12-10 13-19"/>',
slam:'<path d="m10 3 15 7-5 10-15-7zM15 17l-6 11M3 25l6-4m14 0 6 4M15 26v4"/>',
rend:'<path d="M9 24 24 4l4 1-1 4L13 27zM7 18l12 10M22 20c-5 7-3 10 0 10s5-3 0-10z"/>',
multishot:'<path d="M16 28V4m-4 4 4-4 4 4M16 28 3 8m0 6V8h6M16 28 29 8m-6 0h6v6"/>',
piercing:'<path d="M3 16h26m-7-6 7 6-7 6M8 6v8m0 4v8M16 6v8m0 4v8"/>',
poison:'<path d="M5 26 25 6m-7 0h7v7M11 4c-5 7-4 11 0 11s5-4 0-11M23 19c-5 7-4 11 0 11s5-4 0-11"/>',
trap:'<path d="M4 21c4 10 20 10 24 0M4 21l3-8 3 8 3-8 3 8 3-8 3 8 3-8 3 8M10 25l-4 4m16-4 4 4M16 3v5M8 6l3 3m13-3-3 3"/>',
volley:'<path d="M7 2v18m-3-4 3 4 3-4M16 6v18m-3-4 3 4 3-4M25 2v18m-3-4 3 4 3-4M4 27h24"/>',
fireball:'<path d="M16 2c2 8 11 12 10 20-1 12-21 12-21 0 0-5 3-9 6-12-1 6 1 8 4 7 3-1 3-5 1-15zM17 18c-8 6-5 11 0 11s7-5 0-11"/>',
meteor:'<circle cx="10" cy="22" r="7"/><path d="M13 17 28 2 24 15M6 15 18 3m0 18 12-12M5 26l-3 4"/>',
nova:'<path d="M16 3v8m0 10v8M3 16h8m10 0h8M7 7l6 6m6 6 6 6M7 25l6-6m6-6 6-6"/><circle cx="16" cy="16" r="4"/>',
crit:'<path d="M2 16c7-12 21-12 28 0-7 12-21 12-28 0z"/><circle cx="16" cy="16" r="5"/><path d="M16 2v5m0 18v5"/>',
leech:'<path d="M16 2C5 16 5 21 7 25c4 8 18 6 19-2 1-5-3-12-10-21zM11 22h10m-5-5v10"/>',
focus:'<path d="M11 3H3v8m18-8h8v8M3 21v8h8m18-8v8h-8M16 9v14M9 16h14"/><circle cx="16" cy="16" r="5"/>',

blade:'<path d="M9 24 24 4l4 1-1 4L13 27z"/><path d="m7 18 12 10M5 28l5-6"/>',
arrow:'<path d="M7 26 26 7m-8 0h8v8M8 7q14 7 17 18M8 7l17 18M6 22l4 4"/>',
bolt:'<path d="m19 3-4 11H7l10 15 2-11h7z"/>',
orbit:'<path d="M9 24 24 4l4 1-1 4L13 27zM7 18l12 10"/><ellipse cx="16" cy="16" rx="14" ry="8" transform="rotate(-35 16 16)"/>',
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
export function iconMarkup(key){const campaign=STAGE_SKILL_ROWS.findIndex(r=>r[0]===key);if(campaign>=0){const col=campaign%3,row=Math.floor(campaign/3);return '<span class="rune-icon painted-skill campaign-icon" aria-hidden="true" data-skill="'+key+'"><img src="'+Art.urls["skill-campaign"]+'" alt="" draggable="false" style="--atlas-w:300%;--atlas-h:400%;left:-'+(col*100)+'%;top:-'+(row*100)+'%"></span>';}const extra=EXTRA_SKILL_KEYS.indexOf(key);if(extra>=0){const col=extra%3,row=Math.floor(extra/3);return '<span class="rune-icon painted-skill" aria-hidden="true"><img src="'+Art.urls["skill-extra"]+'" alt="" draggable="false" style="--atlas-w:300%;--atlas-h:200%;left:-'+(col*100)+'%;top:-'+(row*100)+'%"></span>';}const tile=SKILL_ART_KEYS.indexOf(key);if(tile>=0){const col=tile%6,row=Math.floor(tile/6),[y,height]=SKILL_ART_ROWS[row],x=col*229+5,width=219;return '<span class="rune-icon painted-skill" aria-hidden="true"><img src="'+Art.urls["skill-atlas"]+'" alt="" draggable="false" style="--atlas-w:'+(1374/width*100)+'%;--atlas-h:'+(1145/height*100)+'%;left:-'+(x/width*100)+'%;top:-'+(y/height*100)+'%"></span>';}return '<svg class="rune-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[key]||paths.heart)+'</svg>';}
