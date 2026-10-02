import test from "node:test";
import assert from "node:assert/strict";
import {Game,HEROES,CLASS_SKILLS,UPGRADES,weaponSlots,runCoins,reward,cleanSave} from "../src/core.js";
import {Audio} from "../src/audio.js";

test("knight starts with 130 HP and retains its meta-health bonus and melee reduction",()=>{
 const g=new Game("knight",{heart:2});assert.equal(HEROES[0].hp,130);assert.equal(g.player.hp,150);assert.equal(g.player.maxHp,150);g.hurt(10);assert.equal(g.player.hp,142);assert.equal(new Game("ranger").player.hp,95);assert.equal(new Game("mage").player.hp,110);
});
test("new attacks rotate fairly and discoveries accompany an owned attack and varied growth runes",()=>{
 for(const hero of HEROES){const g=new Game(hero.id,{},42),seen=new Set();for(let i=0;i<5;i++){const choices=g.offer();assert.equal(choices.length,4);assert.equal(new Set(choices).size,4);assert.ok(choices.includes(hero.weapon));for(const key of choices.slice(0,1)){assert.equal(UPGRADES[key].kind,"weapon");assert.equal(g.weapons[key],undefined);seen.add(key);}}assert.equal(seen.size,5);}
});
test("legal level progression opens a fifth and sixth attack without exceeding class slots",()=>{
 assert.equal(weaponSlots(5),4);assert.equal(weaponSlots(6),5);assert.equal(weaponSlots(9),5);assert.equal(weaponSlots(10),6);
 for(const hero of HEROES){const g=new Game(hero.id,{},11);while(g.level<14){g.addXP(g.need);const newAttack=g.choices.find(k=>UPGRADES[k]?.kind==="weapon"&&!g.weapons[k]);assert.ok(g.choose(newAttack||g.choices[0]));assert.ok(Object.keys(g.weapons).length<=weaponSlots(g.level));}assert.deepEqual(Object.keys(g.weapons).sort(),[...CLASS_SKILLS[hero.id]].sort());}
});
test("filled slots reject stale discoveries until their real level threshold",()=>{
 const g=new Game();g.weapons={blade:1,whirlwind:1,cleave:1,slam:1};g.phase="upgrade";g.pending=1;g.choices=["rend"];g.level=5;assert.equal(g.choose("rend"),false);g.level=6;assert.equal(g.choose("rend"),true);
 g.phase="upgrade";g.pending=1;g.choices=["orbit"];g.level=9;assert.equal(g.choose("orbit"),false);g.level=10;assert.equal(g.choose("orbit"),true);
});
test("flight is louder than bow and contact, fires on release and does not sound for a miss",()=>{
 const audio=new Audio(),calls=[];audio.play=(name,options)=>calls.push({name,...options});audio.event("projectile-windup","arrow");assert.equal(calls.length,0);
 audio.event("projectile-release","arrow",{id:1});assert.deepEqual(calls.map(c=>c.name),["arrow-release","arrow-flight"]);assert.ok(calls[1].gain>calls[0].gain*3);assert.ok(calls[1].delay>0);const flight=calls[1].gain;calls.length=0;
 audio.event("projectile-contact","arrow",{});assert.equal(calls[0].name,"arrow-hit");assert.ok(calls[0].gain<flight*.5);calls.length=0;
 for(const key of ["multishot","piercing","poison","volley"]){audio.event("skill-release",key);assert.equal(calls.at(-1).name,"arrow-flight");}
 calls.length=0;audio.event("ultimate-impact","arrow");assert.equal(calls.at(-1).name,"arrow-flight");calls.length=0;audio.event("skill-release","trap");assert.equal(calls.some(c=>c.name==="arrow-flight"),false);
});
test("retiring and victory use the same displayed gem formula and practice stays unrewarded",()=>{
 const g=new Game();g.kills=36;g.level=8;assert.equal(runCoins(g),17);g.finish(false);assert.equal(g.result.coins,17);g.finish(true);assert.equal(g.result.coins,17);const save=reward(cleanSave(),g.result);assert.equal(save.coins,17);
 const practice=new Game().enablePractice();assert.equal(runCoins(practice),0);practice.finish(false);assert.equal(practice.result.coins,0);
});
