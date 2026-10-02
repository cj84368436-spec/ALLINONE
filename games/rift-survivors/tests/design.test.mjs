import test from "node:test";
import assert from "node:assert/strict";
import {Game,upgradeDetail} from "../src/core.js";
function quiet(hero="knight"){const g=new Game(hero,{},22);g.spawnCd=999;g.nextElite=999;g.weapons={};g.player.inv=999;return g;}
function advance(g,n){for(let i=0;i<n;i++)g.step(1/60);}
test("rift objectives open in reach, decay outside, freeze on pause and seal once",()=>{
 const g=quiet();g.time=34.99;g.step(1/60);const r=g.rift;assert.ok(r);assert.ok(Math.hypot(r.x-g.player.x,r.y-g.player.y)<=161);
 g.player.x=r.x;g.player.y=r.y;g.player.hp=60;g.player.ultCd=20;advance(g,90);const progress=r.progress,life=r.life;assert.ok(progress>1.4);g.pause();advance(g,90);assert.equal(r.progress,progress);assert.equal(r.life,life);g.resume();
 g.player.x+=100;advance(g,30);assert.ok(r.progress<progress);g.player.x=r.x;advance(g,150);assert.equal(g.seals,1);assert.equal(g.rift,null);assert.equal(g.player.hp,78);assert.equal(g.player.ultCd,0);assert.equal(g.phase,"upgrade");assert.equal(g.events.filter(e=>e.type==="rift-sealed").length,1);
});
test("ignored rifts expire safely and do not block survival or future rifts",()=>{const g=quiet();g.time=35;advance(g,1200);assert.equal(g.rift,null);assert.equal(g.seals,0);assert.equal(g.phase,"playing");g.time=110;g.step(1/60);assert.ok(g.rift);g.spawnBoss();assert.equal(g.rift,null);});
test("practice does not start encounters or gain seal rewards",()=>{const g=quiet().enablePractice();g.time=14.99;g.step(1/60);assert.equal(g.rift,null);assert.equal(g.seals,0);assert.equal(g.result.coins,0);});
test("each ultimate has a distinct legal combat outcome and the shared cooldown",()=>{
 for(const hero of ["knight","ranger","mage"]){const g=quiet(hero),e=g.spawn("brute");Object.assign(e,{x:1000,y:900,speed:0,hp:1000,maxHp:1000});g.shots=[{x:1}];assert.ok(g.ultimate());assert.equal(g.ultimate(),false);assert.equal(g.shots.length,0);
 if(hero==="knight"){assert.ok(e.hp<1000);assert.equal(e.stagger,1.2);}
 if(hero==="ranger"){assert.equal(e.hp,1000);assert.equal(g.bullets.length,9);advance(g,20);assert.ok(e.hp<1000);}
 if(hero==="mage"){assert.equal(g.spellFields.length,1);const hp=e.hp;advance(g,35);assert.ok(e.hp<hp);assert.ok(e.slow>0);}
 }
});
test("frost area timing freezes during pause and disappears after four seconds",()=>{const g=quiet("mage");g.ultimate();g.step(.05);const ttl=g.spellFields[0].ttl;g.pause();advance(g,60);assert.equal(g.spellFields[0].ttl,ttl);g.resume();advance(g,250);assert.equal(g.spellFields.length,0);});
test("elite charge locks its direction and has a readable anticipation before movement",()=>{const g=quiet(),e=g.spawn("brute",true);Object.assign(e,{x:1040,y:900,speed:0,shoot:0,hp:1000});g.step(1/60);assert.ok(e.charge);const angle=e.charge.angle,x=e.x;g.player.y+=80;advance(g,30);assert.equal(e.x,x);assert.equal(e.charge.angle,angle);advance(g,20);assert.ok(e.x<x);});
test("growth offers the evolution partner and shows accurate next-level combat values",()=>{const g=new Game();for(let i=0;i<20;i++)assert.ok(g.offer().includes("power"));g.weapons.blade=4;g.passives.power=2;const d=upgradeDetail(g,"blade");assert.equal(d.evolves,true);assert.equal(d.stat,"피해 79 · 사거리 232");assert.ok(d.progress.includes("2/2"));});
