import fs from "node:fs";
import assert from "node:assert/strict";
import {performance} from "node:perf_hooks";
import {Game as Previous} from "../benchmarks/core-v1.js";
import {Game as Current} from "../src/core.js";
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
function sample(C,projectiles,frames=2000){
  const g=new C("ranger",{},42);g.enemies=[];g.weapons={};g.spawnCd=99999;g.nextElite=99999;g.nextMagnet=99999;g.player.inv=99999;g.hit=()=>{};
  for(let i=0;i<130;i++){const e=g.spawn("shade");Object.assign(e,{x:120+(i%13)*120,y:140+Math.floor(i/13)*140,hp:1e6,maxHp:1e6,speed:0,shoot:99999});}
  const costs=[];let checks=0;
  for(let f=0;f<frames+300;f++){g.bullets=Array.from({length:projectiles},(_,i)=>({x:300+(i*97+f*3)%1200,y:250+(i*71+f*2)%1250,vx:420,vy:80,r:4,key:"arrow",ttl:9,damage:1,pierce:999,hit:[]}));
    const t=performance.now();g.step(1/60);const dt=performance.now()-t;
    if(f>=300){costs.push(dt);checks+=g.metrics?.collisionChecks??projectiles*g.enemies.length;}
  }
  const sorted=[...costs].sort((a,b)=>a-b);return {medianStepMs:median(costs),p95StepMs:sorted[Math.floor(sorted.length*.95)],meanStepMs:costs.reduce((a,b)=>a+b,0)/frames,checksPerStep:checks/frames};
}
const scenarios=[];
for(const projectiles of [2,18,64]){
  const previousRuns=[],currentRuns=[];
  for(let repeat=0;repeat<3;repeat++){previousRuns.push(sample(Previous,projectiles));currentRuns.push(sample(Current,projectiles));}
  const summarize=r=>Object.fromEntries(Object.keys(r[0]).map(k=>[k,median(r.map(x=>x[k]))]));
  const previous=summarize(previousRuns),current=summarize(currentRuns);
  if(projectiles===64)assert.ok(current.checksPerStep<previous.checksPerStep*.35,"Broad-phase collision reduction regressed");
  scenarios.push({enemies:130,projectiles,previous,current,meanSpeedup:previous.meanStepMs/current.meanStepMs,collisionCheckReduction:1-current.checksPerStep/previous.checksPerStep});
}
const report={node:process.version,platform:process.platform,previousSourceCommit:"8dda8309f187fd6dff87ba7e395ec1b36cb73e19",method:"Same seeded 130 stationary enemies; 2/18/64 refreshed projectiles. Identical no-op hits isolate collision work. 300 warm-up + 2000 measured steps, median of three trials. CI CPU, not iPhone FPS.",scenarios};
fs.mkdirSync("release",{recursive:true});fs.writeFileSync("release/performance.json",JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
