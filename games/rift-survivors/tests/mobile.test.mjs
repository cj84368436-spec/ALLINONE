import test from "node:test";
import assert from "node:assert/strict";
import {Game,EVOLUTIONS,LIMITS,cleanSave} from "../src/core.js";
import {FixedClock,RenderBudget,joystick} from "../src/runtime.js";
import {EnemyGrid} from "../src/spatial.js";
test("30, 60 and 120 Hz frames simulate the same combat time and movement",()=>{
  const runs=[30,60,120].map(hz=>{const game=new Game();game.spawnCd=999;const clock=new FixedClock();for(let i=0;i<hz*2;i++)clock.advance(1/hz,dt=>game.step(dt,{x:1,y:0}),()=>game.phase==="playing");return game;});
  for(const game of runs){assert.ok(Math.abs(game.time-2)<1e-8);assert.ok(Math.abs(game.player.x-runs[0].player.x)<1e-8);}
});
test("long stalls have bounded catch-up and pauses discard accumulated time",()=>{
  const clock=new FixedClock();let n=0;assert.equal(clock.advance(10,()=>n++),9);assert.ok(clock.dropped>=9.8);clock.advance(1/120,()=>n++);clock.advance(10,()=>n++,()=>false);assert.equal(clock.accumulator,0);assert.equal(n,9);
  let phase="playing";clock.advance(.15,()=>{n++;phase="upgrade";},()=>phase==="playing");assert.equal(n,10);assert.equal(clock.accumulator,0);
});
test("floating joystick has a dead zone and responds immediately to reversing a long drag",()=>{
  assert.equal(joystick(2,0,0,0).x,0);const far=joystick(200,0,0,0);assert.equal(far.originX,157);assert.equal(far.x,1);const reverse=joystick(145,0,far.originX,far.originY);assert.ok(reverse.x<0);assert.equal(reverse.y,0);
});
test("automatic quality scales down under sustained slow frames and recovers with headroom",()=>{
  const b=new RenderBudget();for(let i=0;i<90;i++)b.observe(33);assert.ok(b.scale<=.65);assert.equal(b.targetFPS,30);for(let i=0;i<480;i++)b.observe(16);assert.equal(b.scale,1);assert.equal(b.targetFPS,60);b.set("battery");assert.equal(b.targetFPS,30);b.observe(16);assert.equal(b.scale,.65);assert.equal(cleanSave({settings:{performance:"other"}}).settings.performance,"auto");
});
test("spatial buckets are reusable and never return stale or duplicate enemies",()=>{
  const grid=new EnemyGrid(),enemies=[{id:1,x:95,y:95,hp:10},{id:2,x:96,y:96,hp:10},{id:3,x:500,y:500,hp:0}],out=[];grid.rebuild(enemies);assert.deepEqual(grid.query(50,50,150,150,out).map(e=>e.id),[1,2]);enemies[0].x=600;enemies[1].hp=0;grid.rebuild(enemies);assert.equal(grid.query(50,50,150,150,out).length,0);assert.deepEqual(grid.query(550,0,650,150,out).map(e=>e.id),[1]);
});
test("all six evolutions require a max weapon and its paired passive and emit once",()=>{
  for(const [key,evo] of Object.entries(EVOLUTIONS)){const g=new Game();g.weapons={[key]:5};g.passives[evo.passive]=1;g.checkEvolution();assert.equal(g.evolved[key],undefined);g.passives[evo.passive]=2;g.checkEvolution();g.checkEvolution();assert.equal(g.evolved[key],true);assert.equal(g.events.filter(e=>e.type==="evolve").length,1);}
});
test("evolved arrows add five penetrating projectiles without exceeding the projectile budget",()=>{
  const g=new Game("ranger"),e=g.spawn("shade");Object.assign(e,{x:1000,y:900,hp:10000});g.weapons.arrow=5;g.passives.haste=2;g.checkEvolution();g.attack("arrow",5);assert.equal(g.bullets.length,0);g.advanceRanged(.3);assert.equal(g.bullets.length,5);assert.ok(g.bullets.every(b=>b.pierce===3));for(let i=0;i<100;i++){g.attack("arrow",5);g.advanceRanged(.3);}assert.equal(g.bullets.length,LIMITS.bullets);
});
test("skill rerolls are free, limited to three per run and do not consume an earned level",()=>{
  const g=new Game();assert.equal(g.reroll(),false);g.addXP(8);for(let i=0;i<3;i++){assert.equal(g.reroll(),true);assert.equal(g.pending,1);assert.equal(g.phase,"upgrade");assert.equal(g.choices.length,3);}assert.equal(g.reroll(),false);g.choose(g.choices[0]);assert.equal(g.phase,"playing");
});
test("level choices always include an available owned weapon",()=>{
  const g=new Game("mage");for(let i=0;i<100;i++)assert.ok(g.offer().includes("bolt"));
});
test("elite chests grant experience and healing; magnets attract every drop",()=>{
  const g=new Game(),elite=g.spawn("brute",true);Object.assign(elite,{x:1000,y:900});g.hit(elite,9999,g.player);assert.equal(g.pickups[0].kind,"chest");g.pickups[0].x=g.player.x;g.player.hp=50;g.step(1/60);assert.ok(g.level>=2);assert.equal(g.player.hp,70);
  const m=new Game();m.gems=[{x:200,y:200,value:5,heal:false,attract:false}];m.pickups=[{kind:"magnet",x:900,y:900}];m.step(1/60);assert.equal(m.gems[0].attract,true);assert.equal(m.pickups.length,0);
});
test("drop consolidation preserves both experience and healing within a fixed budget",()=>{
  const g=new Game();g.gems=Array.from({length:500},(_,i)=>({x:100,y:100,value:i<100?0:2,heal:i<100,attract:false}));g.step(1/60);assert.ok(g.gems.length<=LIMITS.gems);assert.equal(g.gems.filter(x=>!x.heal).reduce((n,x)=>n+x.value,0),800);assert.equal(g.gems.filter(x=>x.heal).reduce((n,x)=>n+(x.healValue||14),0),1400);
});
test("enemy projectiles also use swept collisions; nonfinite deltas do not poison state",()=>{
  const g=new Game();g.shots=[{x:850,y:900,vx:2500,vy:0,r:6,ttl:1,damage:9}];g.step(.05);assert.equal(g.player.hp,111);const t=g.time;g.step(NaN);assert.equal(g.time,t);assert.ok(Number.isFinite(g.player.x));
});
test("knockback across a spatial cell boundary updates projectile candidates",()=>{
  const grid=new EnemyGrid(),enemy={id:1,x:95,y:100,hp:10};grid.rebuild([enemy]);enemy.x=105;grid.move(enemy,95,100);assert.equal(grid.query(96,96,110,110).length,1);assert.equal(grid.query(0,96,95,110).length,0);grid.rebuild([enemy]);assert.equal(grid.query(96,96,110,110).length,1);
});
