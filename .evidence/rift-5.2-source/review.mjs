import fs from "node:fs";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {chromium} from "@playwright/test";
const sharp=createRequire("/tmp/rift-review/package.json")("sharp");
const dir="../../.evidence/rift-5.2-review";fs.mkdirSync(dir,{recursive:true});const shots=[];
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5190"],{stdio:"ignore"});let browser;
async function capture(page,name){const bytes=await page.screenshot();await sharp(bytes).resize({width:390}).webp({quality:88}).toFile(dir+"/"+name+".webp");shots.push(name);}
try{
 let healthy=false;for(let i=0;i<100;i++){try{if((await fetch("http://127.0.0.1:5190")).ok){healthy=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!healthy)throw Error("review server");
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:5190");await page.locator("#home").waitFor();
 // Temporal sheets expose animation, alignment and late-build visual density.
 // Fixtures use invulnerability only for review; this is not a human balance test.
 const temporalSheets=[],tierSheets=[],liveSheets=[];
 for(const hero of ["knight","ranger","mage"]){
  await page.locator('[data-hero="'+hero+'"]').click();await page.locator("#start").click();
  const all=hero==="knight"?["blade","whirlwind","cleave","slam","rend","orbit","hammer","fissure","crosscut","phantom","judgment","thousand"]:hero==="ranger"?["arrow","multishot","piercing","poison","trap","volley","ricochet","glaive","explosive","falcon","stormbow","ballista"]:["bolt","fireball","lightning","frost","meteor","nova","beam","pyre","spirit","blackflame","gravity","dragon"];
  for(const key of (hero==="knight"?["orbit","whirlwind","thousand"]:hero==="ranger"?["ballista"]:["frost","fireball","dragon"])){
   const points=key==="thousand"?[.22,.65,1.05,1.88]:key==="dragon"?[.22,.65,1.15,2.15]:key==="ballista"?[.22,.65,.95,1.25]:["meteor","judgment","gravity","ballista","dragon","pyre"].includes(key)?[.22,.55,.95,1.65]:["whirlwind","frost","beam","blackflame","falcon","trap","volley"].includes(key)?[.20,.50,.88,1.3]:[.06,.16,.30,.48];
   const names=[];
   for(let frame=0;frame<points.length;frame++){
    const name=hero+"-"+key+"-phase-"+frame;names.push(name);
    await page.evaluate(({key,hero,at})=>{
     const {game:g,renderer:r}=window.__riftTest;g.phase="playing";g.stage=5;g.stageStarted=0;g.time=42;g.hitStopEnabled=false;g.spawnCd=g.nextElite=g.nextMagnet=g.nextRift=9999;
     g.enemies=[];g.bullets=[];g.shots=[];g.hazards=[];g.events=[];g.fx=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.weapons={};g.passives={};g.evolved={};g.cool={};g.ultimateState=null;g.bladeSwing=null;g.rangedAttacks={};g.skillPose=null;g.rift=null;g.player.x=g.player.y=900;g.player.inv=999;g.player.ultCd=0;r.reduced=false;r.setQuality(1);
     // Targets in the visible portrait area move into the actual attack, not far off-screen.
     for(let i=0;i<8;i++){const e=g.spawn(["guard","hound","brute","wisp","healer","sniper","frostling","brute"][i]);Object.assign(e,{x:970+i%2*30,y:840+Math.floor(i/2)*38,hp:99999,maxHp:99999,speed:14,shoot:999,special:999});}
     if(key==="ultimate")g.ultimate();else if(key==="orbit")g.weapons={orbit:5};else g.attack(key,5);
     for(let i=0;i<Math.round(at*60);i++)g.step(1/60,{x:0,y:0});g.events=[];g.phase="paused";
    },{key,hero,at:points[frame]});await page.waitForTimeout(45);await capture(page,name);
   }
   const sheet="motion-"+hero+"-"+key+".webp";temporalSheets.push(sheet);await sharp({create:{width:1560,height:844,channels:4,background:"#091321"}}).composite(names.map((name,i)=>({input:dir+"/"+name+".webp",left:i*390,top:0}))).webp({quality:90}).toFile(dir+"/"+sheet);
  }
  const key=all[all.length-1],names=[];
  for(const [label,lv,evolved]of [["lv1",1,false],["lv3",3,false],["lv5",5,false],["evolved",5,true]]){
   const name="tier-"+hero+"-"+label;names.push(name);
   await page.evaluate(({key,lv,evolved})=>{const {game:g,renderer:r}=window.__riftTest;g.phase="playing";g.time=42;g.hitStopEnabled=false;g.enemies=[];g.bullets=[];g.fx=[];g.events=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.weapons={};g.passives={};g.evolved=evolved?{[key]:true}:{};g.cool={};g.ultimateState=null;g.bladeSwing=null;g.rangedAttacks={};g.skillPose=null;g.player.x=g.player.y=900;r.reduced=false;
    for(let i=0;i<8;i++){const e=g.spawn("guard");Object.assign(e,{x:970+i%2*26,y:842+Math.floor(i/2)*38,hp:99999,maxHp:99999,speed:0,shoot:999,special:999});}g.attack(key,lv);for(let i=0;i<56;i++)g.step(1/60);g.events=[];g.phase="paused";
   },{key,lv,evolved});await page.waitForTimeout(45);await capture(page,name);
  }
  const tier="tiers-"+hero+".webp";tierSheets.push(tier);await sharp({create:{width:1560,height:844,channels:4,background:"#091321"}}).composite(names.map((name,i)=>({input:dir+"/"+name+".webp",left:i*390,top:0}))).webp({quality:90}).toFile(dir+"/"+tier);
  // Real moving enemies, a legal late-stage build and hazards reveal visual spam.
  const live=[];
  await page.evaluate(({hero,all})=>{const {game:g,renderer:r}=window.__riftTest;g.phase="playing";g.stage=5;g.stageStarted=0;g.time=42;g.hitStopEnabled=false;g.enemies=[];g.bullets=[];g.shots=[];g.fx=[];g.events=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.weapons=Object.fromEntries(all.slice(-10).map(k=>[k,5]));g.passives={power:2,focus:2,haste:2};g.evolved={};g.cool={};g.ultimateState=null;g.bladeSwing=null;g.rangedAttacks={};g.skillPose=null;g.rift=null;g.player.x=g.player.y=900;g.player.inv=999;r.reduced=false;
   for(let i=0;i<25;i++){const q=i*Math.PI*2/25,rad=100+i%4*25,e=g.spawn(["guard","hound","bomber","wisp","healer","sniper","frostling"][i%7]);Object.assign(e,{x:900+Math.cos(q)*rad,y:900+Math.sin(q)*rad,hp:1500,maxHp:1500,shoot:999,special:999});}g.hazards=[{x:980,y:930,r:44,delay:1.1,life:3.4,damage:10}];g.phase="paused";
  },{hero,all});
  for(let i=0;i<6;i++){await page.evaluate(i=>{const {game:g,renderer:r}=window.__riftTest;g.phase="playing";for(let n=0;n<20;n++){if(i===3&&n===0)g.hazards.push({x:980,y:920,r:44,delay:.6,life:1.3,damage:10});g.step(1/60,{x:Math.cos(i*.8)*.45,y:Math.sin(i*.8)*.45});for(const e of g.events.splice(0))r.react(e,g);}g.phase="paused";},i);const name="live-"+hero+"-"+i;live.push(name);await page.waitForTimeout(45);await capture(page,name);}
  const liveSheet="moving-"+hero+".webp";liveSheets.push(liveSheet);await sharp({create:{width:2340,height:844,channels:4,background:"#091321"}}).composite(live.map((name,i)=>({input:dir+"/"+name+".webp",left:i*390,top:0}))).webp({quality:90}).toFile(dir+"/"+liveSheet);
  await page.evaluate(()=>window.__riftTest.finish(false));await page.locator("#result-home").click();
 }
 if(errors.length)throw Error(JSON.stringify(errors));fs.writeFileSync(dir+"/manifest.json",JSON.stringify({version:"5.2.0",method:"Real Canvas screenshots, staged time/enemies; not human play or listening approval",shots,temporalSheets,tierSheets,liveSheets,errors},null,2));console.log("Painted review: "+shots.length+" screenshots");
}finally{await browser?.close();server.kill();}
