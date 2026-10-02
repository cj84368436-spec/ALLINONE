import test from "node:test";
import assert from "node:assert/strict";
import {Game,runCoins,reward,cleanSave,upgradeDetail,ABILITY_COOLDOWNS} from "../src/core.js";

function quiet(){const g=new Game("knight",{},17);g.spawnCd=g.nextElite=g.nextMagnet=999;g.weapons={};g.hitStopEnabled=false;return g;}
test("starting and immediately retiring cannot farm permanent gems",()=>{
 let save=cleanSave();for(let i=0;i<20;i++){const g=new Game();assert.equal(runCoins(g),0);g.finish(false);save=reward(save,g.result);}assert.equal(save.coins,0);
 const earned=new Game();earned.kills=24;earned.level=4;assert.equal(runCoins(earned),8);assert.equal(runCoins(earned,true),78);
});
test("fatal hazard ends the frame before collecting healing or a chest",()=>{
 for(const pickup of ["heal","chest"]){const g=quiet();g.player.hp=1;g.hazards=[{x:900,y:900,r:55,delay:0,life:1,damage:25}];
 if(pickup==="heal")g.gems=[{x:900,y:900,heal:true,healValue:30}];else g.pickups=[{kind:"chest",x:900,y:900,value:100}];
 g.step(1/60);assert.equal(g.phase,"result");assert.equal(g.player.hp,0);assert.equal(g.level,1);assert.equal(g.result.level,1);assert.equal(pickup==="heal"?g.gems.length:g.pickups.length,1);}
});
test("a boss killing sweep does not keep adding kills after the result is settled",()=>{
 const g=quiet(),boss=g.spawnBoss();Object.assign(boss,{x:980,y:900,hp:1});const extra=g.spawn("brute");Object.assign(extra,{x:990,y:900,hp:1});
 g.attack("blade",1);g.advanceBlade(.15);assert.equal(g.result.win,true);assert.equal(g.result.kills,1);assert.equal(g.kills,1);assert.equal(extra.hp,1);
});
test("expired hostile bullets and hazards cannot hit the player",()=>{
 const g=quiet();g.shots=[{x:900,y:900,vx:0,vy:0,r:6,ttl:0,damage:9}];g.hazards=[{x:900,y:900,r:55,delay:0,life:0,damage:25}];g.step(1/60);assert.equal(g.player.hp,130);assert.equal(g.shots.length,0);assert.equal(g.hazards.length,0);
});
test("wide evolved projectiles collide across bucket boundaries in dense fights",()=>{
 const g=quiet();g.player.inv=999;
 for(let i=0;i<130;i++){const e=g.spawn("brute");Object.assign(e,{x:1500,y:1500,hp:1000,maxHp:1000,speed:0,shoot:999});}
 const target=g.enemies[0];Object.assign(target,{x:900,y:289,r:40});
 g.bullets=Array.from({length:32},(_,i)=>({x:i?100:900,y:i?100:200,vx:0,vy:0,r:i?4:56,key:"cleave",ttl:1,damage:20,pierce:0,hit:[]}));
 g.step(1/60);assert.equal(target.hp,980);
});
test("a rune that completes a maxed attack is labelled as an evolution",()=>{
 const g=quiet();g.weapons.blade=5;g.passives.power=1;assert.equal(upgradeDetail(g,"power").evolves,true);
 g.weapons.blade=4;assert.equal(upgradeDetail(g,"power").evolves,false);
});
test("ability cooldowns use one shared duration for the simulation and UI",()=>{
 const g=quiet();assert.ok(g.dash(1,0));assert.equal(g.player.dashCd,ABILITY_COOLDOWNS.dash);assert.ok(g.ultimate());assert.equal(g.player.ultCd,ABILITY_COOLDOWNS.ultimate);assert.equal(ABILITY_COOLDOWNS.ultimate,38);
});

test("stunned enemies stop contact, shots and new boss attacks until the stun expires",()=>{
 const g=quiet(),seer=g.spawn("seer");Object.assign(seer,{x:900,y:900,shoot:0,stagger:1,speed:0});g.step(1/60);assert.equal(g.player.hp,130);assert.equal(g.shots.length,0);seer.x=1100;
 for(let i=0;i<62;i++)g.step(1/60);assert.ok(g.shots.length>0);
 const b=quiet();b.time=300;const boss=b.spawnBoss();Object.assign(boss,{shoot:0,storm:0,chargeCd:0,stagger:1});b.step(1/60);assert.equal(b.shots.length,0);assert.equal(b.hazards.length,0);assert.equal(boss.charge,undefined);
 for(let i=0;i<62;i++)b.step(1/60);assert.ok(b.shots.length>0);assert.ok(b.hazards.length>0);assert.ok(boss.charge);
});
