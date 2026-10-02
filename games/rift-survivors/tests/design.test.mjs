import test from "node:test";
import assert from "node:assert/strict";
import {Game,upgradeDetail} from "../src/core.js";
function quiet(hero="knight"){const g=new Game(hero,{},22);g.spawnCd=999;g.nextElite=999;g.weapons={};g.player.inv=999;return g;}
function advance(g,n){for(let i=0;i<n;i++)g.step(1/60);}
test("rift objectives open in reach, decay outside, freeze on pause and seal once",()=>{
 const g=quiet();g.time=34.99;g.step(1/60);const r=g.rift;assert.ok(r);assert.ok(Math.hypot(r.x-g.player.x,r.y-g.player.y)<=161);
 g.player.x=r.x;g.player.y=r.y;g.player.hp=60;g.player.ultCd=20;advance(g,90);const progress=r.progress,life=r.life;assert.ok(progress>1.4);g.pause();advance(g,90);assert.equal(r.progress,progress);assert.equal(r.life,life);g.resume();
 g.player.x+=100;advance(g,30);assert.ok(r.progress<progress);g.player.x=r.x;advance(g,150);assert.equal(g.seals,1);assert.equal(g.rift,null);assert.equal(g.player.hp,72);assert.equal(g.player.ultCd,0);assert.equal(g.phase,"upgrade");assert.equal(g.events.filter(e=>e.type==="rift-sealed").length,1);
});
test("ignored rifts expire safely and do not block survival or future rifts",()=>{const g=quiet();g.time=35;advance(g,1200);assert.equal(g.rift,null);assert.equal(g.seals,0);assert.equal(g.phase,"playing");g.time=110;g.step(1/60);assert.ok(g.rift);g.spawnBoss();assert.equal(g.rift,null);});
test("practice does not start encounters or gain seal rewards",()=>{const g=quiet().enablePractice();g.time=14.99;g.step(1/60);assert.equal(g.rift,null);assert.equal(g.seals,0);assert.equal(g.result.coins,0);});
test("each ultimate has a distinct legal combat outcome and the shared cooldown",()=>{
 for(const hero of ["knight","ranger","mage"]){const g=quiet(hero),e=g.spawn("brute");Object.assign(e,{x:1000,y:900,speed:0,hp:1000,maxHp:1000});g.shots=[{x:1}];assert.ok(g.ultimate());assert.equal(g.ultimate(),false);assert.equal(g.shots.length,0);
 assert.equal(e.hp,1000);assert.equal(g.bullets.length,0);assert.equal(g.spellFields.length,0);g.advanceUltimate(.31);
 if(hero==="knight"){assert.ok(e.hp<1000);assert.equal(e.stagger,1.2);}
 if(hero==="ranger"){assert.equal(e.hp,1000);assert.equal(g.bullets.length,7);advance(g,20);assert.ok(e.hp<1000);}
 if(hero==="mage"){assert.equal(g.spellFields.length,1);const hp=e.hp;advance(g,35);assert.ok(e.hp<hp);assert.ok(e.slow>0);}
 }
});
test("frost area timing freezes during pause and disappears after four seconds",()=>{const g=quiet("mage");g.ultimate();g.advanceUltimate(.31);g.step(.05);const ttl=g.spellFields[0].ttl;g.pause();advance(g,60);assert.equal(g.spellFields[0].ttl,ttl);g.resume();advance(g,250);assert.equal(g.spellFields.length,0);});
test("elite charge locks its direction and has a readable anticipation before movement",()=>{const g=quiet(),e=g.spawn("brute",true);Object.assign(e,{x:1040,y:900,speed:0,shoot:0,hp:1000});g.step(1/60);assert.ok(e.charge);const angle=e.charge.angle,x=e.x;g.player.y+=80;advance(g,30);assert.equal(e.x,x);assert.equal(e.charge.angle,angle);advance(g,20);assert.ok(e.x<x);});
test("growth offers the evolution partner and shows accurate next-level combat values",()=>{const g=new Game();for(let i=0;i<20;i++)assert.ok(g.offer().includes("power"));g.weapons.blade=4;g.passives.power=2;const d=upgradeDetail(g,"blade");assert.equal(d.evolves,true);assert.equal(d.stat,"피해 95 · 사거리 163");assert.ok(d.progress.includes("2/2"));});

test("ranger ultimate releases three timed waves and does not lose its telegraph",()=>{const g=quiet("ranger");const e=g.spawn("brute");Object.assign(e,{x:1300,y:900,hp:10000});g.ultimate();g.advanceUltimate(.17);assert.equal(g.bullets.length,0);g.advanceUltimate(.02);assert.equal(g.bullets.length,7);g.advanceUltimate(.20);assert.equal(g.bullets.length,14);g.advanceUltimate(.20);assert.equal(g.bullets.length,21);assert.equal(g.events.filter(x=>x.type==="ultimate-impact").length,3);});
test("primary combat effects survive decorative overflow and reduced visual budgets",()=>{const g=quiet();for(let i=0;i<200;i++)g.effect({kind:"text",ttl:.5});g.ultimate();assert.ok(g.fx.some(f=>f.kind==="sun-cleave"));for(let i=0;i<200;i++)g.effect({kind:"corpse",ttl:.5});assert.ok(g.fx.some(f=>f.kind==="sun-cleave"));});
test("same persistent skill refreshes its field instead of multiplying damage",()=>{const g=quiet();g.spawn("brute");for(let i=0;i<10;i++){g.attack("whirlwind",5);g.advanceSkills(.3);}assert.equal(g.skillFields.filter(f=>f.key==="whirlwind").length,1);});
test("late waves accelerate, flank and add readable boss reinforcements",()=>{const g=quiet();g.time=300;g.spawnBoss();const boss=g.enemies[0];assert.equal(boss.maxHp,5600);g.time=313;g.step(.02);assert.ok(g.enemies.length>1);assert.ok(g.events.some(x=>x.type==="reinforcements"));assert.equal(g.hero.id,"knight");});
