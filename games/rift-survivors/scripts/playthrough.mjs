import fs from "node:fs";
import assert from "node:assert/strict";
import {Game,HEROES} from "../src/core.js";
const reports=[];
for(const hero of HEROES)for(const seed of [11,22,33]){
  const g=new Game(hero.id,{},seed);
  // Only legal inputs/actions/choices. No invulnerability, teleport or forced upgrades.
  for(let step=0;step<24000&&!g.result;step++){
    if(g.phase==="upgrade"){
      const preferences={"knight":["blade","power","whirlwind","rend","leech","haste","heart","orbit","slam","focus","crit","magnet"],"ranger":["arrow","haste","multishot","poison","power","leech","heart","crit","piercing","trap","magnet"],"mage":["bolt","magnet","fireball","frost","power","haste","heart","lightning","meteor","focus","crit"]}[hero.id];
      const choice=preferences.find(key=>g.choices.includes(key))||g.choices[0];g.choose(choice);continue;
    }
    const p=g.player,nearest=g.nearest(),near=g.enemies.filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<135);
    if((near.length>=5||p.hp<p.maxHp*.55)&&p.ultCd===0)g.ultimate();
    let target=null,best=Infinity;
    for(const item of [...g.pickups,...g.gems]){const distance=(item.x-p.x)**2+(item.y-p.y)**2;if(distance<best){best=distance;target=item;}}
    let x=0,y=0;const distance=nearest?Math.hypot(nearest.x-p.x,nearest.y-p.y):Infinity;
    if(distance<75){x=p.x-nearest.x;y=p.y-nearest.y;if(p.dashCd===0)g.dash(x,y);}
    else if(target){x=target.x-p.x;y=target.y-p.y;}
    else if(nearest){if(distance>105){x=nearest.x-p.x;y=nearest.y-p.y;}else{x=p.y-nearest.y;y=nearest.x-p.x;}}
    const length=Math.hypot(x,y)||1;g.step(1/60,{x:x/length,y:y/length});g.events.length=0;
  }
  assert.equal(g.result?.win,true,hero.id+" seed "+seed+" bot did not complete a full run");
  assert.ok(g.level>=15);assert.equal(g.evolved[hero.weapon],true);
  reports.push({hero:hero.id,seed,timeSeconds:Math.round(g.time),level:g.level,kills:g.kills,win:g.result.win,remainingHp:g.player.hp,skills:Object.keys(g.weapons),evolutions:Object.keys(g.evolved)});
}
const report={method:"Nine seeded full runs, three base heroes, no permanent upgrades. Rule-based bot uses only normal movement, dash, ultimate and offered skill choices. This checks playable completion paths; it is not a human usability or native device test.",runs:reports};
fs.mkdirSync("release",{recursive:true});fs.writeFileSync("release/playthrough.json",JSON.stringify(report,null,2));console.log("9 full-length bot runs completed without cheats");console.log(JSON.stringify(reports,null,2));
