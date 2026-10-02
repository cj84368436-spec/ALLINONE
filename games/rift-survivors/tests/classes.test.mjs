import test from "node:test";
import assert from "node:assert/strict";
import {Game,HEROES,UPGRADES,CLASS_SKILLS,EVOLUTIONS,skillStats,LIMITS} from "../src/core.js";
function quiet(hero="knight"){const g=new Game(hero,{},17);g.weapons={};g.spawnCd=999;g.nextElite=999;g.nextMagnet=999;g.player.inv=999;g.hitStopEnabled=false;return g;}
function enemy(g,x=980,y=900){const e=g.spawn("brute");Object.assign(e,{x,y,speed:0,hp:5000,maxHp:5000,shoot:999});return e;}
function frames(g,n,input){for(let i=0;i<n;i++)g.step(1/60,input);}
test("each class discovers six exclusive attacks and four useful growth choices",()=>{
 const attacks=Object.values(CLASS_SKILLS).flat();assert.equal(new Set(attacks).size,18);assert.equal(Object.values(UPGRADES).filter(x=>x.kind==="passive").length,8);
 for(const h of HEROES){const g=new Game(h.id,{},22),seen=new Set();for(let i=0;i<250;i++){const offer=g.offer();assert.equal(offer.length,4);assert.equal(new Set(offer).size,4);assert.ok(offer.includes(h.weapon));assert.ok(offer.some(k=>UPGRADES[k].kind==="weapon"&&!g.weapons[k]));
 for(const k of offer)if(UPGRADES[k].kind==="weapon"){assert.ok(CLASS_SKILLS[h.id].includes(k));seen.add(k);}}
 assert.deepEqual([...seen].sort(),[...CLASS_SKILLS[h.id]].sort());}
});
test("forged or stale choices cannot give another class an attack or exceed slots",()=>{
 const g=new Game();g.phase="upgrade";g.pending=1;g.choices=["fireball"];assert.equal(g.choose("fireball"),false);assert.equal(g.weapons.fireball,undefined);
 g.weapons={blade:2,whirlwind:2,cleave:2,slam:2};g.choices=["rend"];assert.equal(g.choose("rend"),false);for(let i=0;i<50;i++)for(const key of g.offer())assert.ok(UPGRADES[key].kind!=="weapon"||key in g.weapons);
});
test("whirlwind follows movement and repeatedly damages nearby enemies without moving the player",()=>{
 const g=quiet(),e=enemy(g,950);g.attack("whirlwind",1);assert.equal(e.hp,5000);frames(g,12);const f=g.skillFields[0];assert.ok(f);const hp=e.hp;frames(g,20,{x:0,y:1});assert.equal(f.y,g.player.y);assert.ok(e.hp<hp);assert.equal(g.player.x,900);assert.ok(g.player.y>900);
});
test("sword wave sweeps through a row and ground slam waits then staggers once",()=>{
 const g=quiet(),a=enemy(g,980),b=enemy(g,1060);g.attack("cleave",1);frames(g,35);assert.ok(a.hp<5000);assert.ok(b.hp<5000);
 const m=quiet(),e=enemy(m,990);m.attack("slam",1);frames(m,18);assert.equal(e.hp,5000);frames(m,7);assert.ok(e.hp<5000);assert.ok(e.stagger>0);const hp=e.hp;frames(m,25);assert.equal(e.hp,hp);assert.deepEqual([m.player.x,m.player.y],[900,900]);
});
test("rend and poison apply persistent damage that expires and stops during pause",()=>{
 for(const [h,k,status]of [["knight","rend","bleed"],["ranger","poison","poison-dot"]]){const g=quiet(h),e=enemy(g);g.attack(k,1);frames(g,24);assert.ok(e.statuses?.[status]);const hp=e.hp,ttl=e.statuses[status].ttl;g.pause();frames(g,90);assert.equal(e.hp,hp);assert.equal(e.statuses[status].ttl,ttl);g.resume();e.x=1400;frames(g,65);assert.ok(e.hp<hp);frames(g,350);assert.equal(e.statuses[status],undefined);const end=e.hp;frames(g,60);assert.equal(e.hp,end);}
});
test("multishot spreads aimed arrows and piercing arrows damage several targets once each",()=>{
 const g=quiet("ranger");enemy(g);g.attack("multishot",3);frames(g,8);assert.equal(g.bullets.length,5);assert.equal(new Set(g.bullets.map(b=>b.vy)).size,5);
 const p=quiet("ranger"),a=enemy(p,1000),b=enemy(p,1100);p.attack("piercing",1);frames(p,30);assert.ok(a.hp<5000&&b.hp<5000);const hp=a.hp;frames(p,40);assert.equal(a.hp,hp);
});
test("traps arm before contact, root enemies once and stay within six placements",()=>{
 const g=quiet("ranger"),e=enemy(g,925);g.attack("trap",1);frames(g,12);assert.equal(e.hp,5000);assert.equal(g.skillFields[0].key,"trap");frames(g,30);assert.ok(e.root>0);assert.ok(e.hp<5000);const hp=e.hp;frames(g,30);assert.equal(e.hp,hp);
 e.x=1300;for(let i=0;i<12;i++){g.attack("trap",1);frames(g,9);}assert.ok(g.skillFields.filter(f=>f.key==="trap").length<=6);
});
test("arrow rain and blizzard telegraph then cause repeated area damage",()=>{
 for(const [h,key]of [["ranger","volley"],["mage","frost"]]){const g=quiet(h),e=enemy(g,1020);g.attack(key,1);frames(g,15);assert.equal(e.hp,5000);frames(g,25);assert.ok(e.hp<5000);const hp=e.hp;frames(g,55);assert.ok(e.hp<hp);if(key==="frost")assert.ok(e.slow>0);frames(g,250);assert.equal(g.skillFields.length,0);}
});
test("fireballs explode once and hit nearby enemies outside the projectile path",()=>{
 const g=quiet("mage"),a=enemy(g,1010),b=enemy(g,1020,946),far=enemy(g,1300,1080);g.attack("fireball",1);frames(g,35);assert.ok(a.hp<5000);assert.ok(b.hp<5000);assert.equal(far.hp,5000);assert.equal(g.events.filter(e=>e.type==="skill-impact"&&e.key==="fireball").length,1);
});
test("chain lightning jumps only between nearby targets and never revisits a target",()=>{
 const g=quiet("mage"),a=enemy(g,980),b=enemy(g,1120),c=enemy(g,1260),isolated=enemy(g,900,1150);g.attack("lightning",1);frames(g,14);assert.ok(a.hp<5000&&b.hp<5000&&c.hp<5000);assert.equal(isolated.hp,5000);assert.equal(g.fx.filter(f=>f.kind==="line").length,3);
});
test("meteor has a target warning and a single delayed impact; nova freezes with radial shards",()=>{
 const g=quiet("mage"),e=enemy(g,1020);g.attack("meteor",1);frames(g,30);assert.equal(e.hp,5000);assert.ok(g.skillFields[0].delay>0);const delay=g.skillFields[0].delay;g.pause();frames(g,40);assert.equal(g.skillFields[0].delay,delay);g.resume();frames(g,28);assert.ok(e.hp<5000);assert.equal(g.events.filter(e=>e.type==="skill-impact").length,1);
 const n=quiet("mage"),f=enemy(n,990);n.attack("nova",1);frames(n,14);assert.equal(n.bullets.length,9);frames(n,20);assert.ok(f.root>0&&f.hp<5000);
});
test("critical strikes, kill healing, area scaling and all eighteen evolutions have real effects",()=>{
 const g=quiet(),e=enemy(g);g.passives={crit:5,leech:2,focus:3};g.rand=()=>0;g.player.hp=50;g.damageKey="blade";g.hit(e,20,g.player);assert.equal(e.hp,4965);assert.ok(g.fx.some(f=>f.critical));g.hit(e,99999,g.player);assert.equal(g.player.hp,52.2);g.hit(e,99999,g.player);assert.equal(g.player.hp,52.2);
 const wide=skillStats(g,"whirlwind",1);const basic=skillStats(quiet(),"whirlwind",1);assert.ok(wide.r>basic.r&&wide.duration>basic.duration);
 assert.equal(Object.keys(EVOLUTIONS).length,18);for(const [key,ev]of Object.entries(EVOLUTIONS)){const q=quiet();q.weapons[key]=5;q.passives[ev.passive]=2;q.checkEvolution();assert.equal(q.evolved[key],true);}
});
test("delayed skills and fields freeze on upgrade and entity caps survive heavy casts",()=>{
 const g=quiet("mage");enemy(g);g.attack("meteor",1);const delay=g.skillTasks[0].delay;g.addXP(8);frames(g,90);assert.equal(g.skillTasks[0].delay,delay);g.choose(g.choices[0]);g.weapons={};frames(g,14);assert.ok(g.skillFields.length);
 for(let i=0;i<50;i++){g.attack("frost",5);g.attack("nova",5);g.advanceSkills(.25);}assert.ok(g.skillFields.length<=LIMITS.fields);assert.ok(g.skillTasks.length<=LIMITS.tasks);assert.ok(g.bullets.length<=LIMITS.bullets);
});
