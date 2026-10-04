import fs from "node:fs";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {chromium} from "@playwright/test";
const sharp=createRequire("/tmp/rift-review/package.json")("sharp");
const dir="../../.evidence/rift-5.2";fs.mkdirSync(dir,{recursive:true});const shots=[];
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5190"],{stdio:"ignore"});let browser;
async function capture(page,name){const bytes=await page.screenshot();await sharp(bytes).resize({width:390}).webp({quality:88}).toFile(dir+"/"+name+".webp");shots.push(name);}
try{
 let healthy=false;for(let i=0;i<100;i++){try{if((await fetch("http://127.0.0.1:5190")).ok){healthy=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!healthy)throw Error("review server");
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:5190");await page.locator("#home").waitFor();
 for(const hero of ["knight","ranger","mage"]){
  await page.locator('[data-hero="'+hero+'"]').click();await page.waitForTimeout(120);await capture(page,hero+"-home");await page.locator("#start").click();
  await page.evaluate(()=>{const g=window.__riftTest.game;g.player.inv=999;g.spawnCd=999;g.nextElite=999;g.time=42;g.nextRift=110;g.level=6;g.weapons=Object.fromEntries((g.hero.id==="knight"?["blade","whirlwind","cleave","slam"]:g.hero.id==="ranger"?["arrow","multishot","poison","trap"]:["bolt","fireball","lightning","frost"]).map(k=>[k,3]));g.passives={power:1};g.enemies=[];for(let i=0;i<16;i++){const e=g.spawn(["shade","brute","bat","seer"][i%4]),a=i*Math.PI*2/16,r=85+(i%3)*28;Object.assign(e,{x:g.player.x+Math.cos(a)*r,y:g.player.y+Math.sin(a)*r,speed:0,hp:500,maxHp:500,shoot:999});}g.rift={x:g.player.x+96,y:g.player.y+115,r:64,progress:1.2,life:14};});
  await page.waitForTimeout(260);await page.evaluate(()=>window.__riftTest.game.phase="paused");await page.waitForTimeout(120);await capture(page,hero+"-combat");
  await page.evaluate(()=>window.__riftTest.game.phase="playing");await page.locator("#ultimate").click();await page.waitForTimeout(430);await page.evaluate(()=>window.__riftTest.game.phase="paused");await page.waitForTimeout(120);await capture(page,hero+"-ultimate");
  await page.evaluate(()=>{const g=window.__riftTest.game;g.phase="playing";g.addXP(g.need);});await page.locator(".upgrade").first().waitFor();await capture(page,hero+"-growth");await page.setViewportSize({width:360,height:640});await page.waitForTimeout(80);await capture(page,hero+"-growth-small");await page.setViewportSize({width:390,height:844});
  await page.locator(".upgrade").first().click();
  const keys=hero==="knight"?["blade","whirlwind","cleave","slam","rend","orbit","hammer","fissure"]:hero==="ranger"?["arrow","multishot","piercing","poison","trap","volley","ricochet","glaive"]:["bolt","fireball","lightning","frost","meteor","nova","beam","pyre"];
  for(const key of keys){await page.evaluate(({key,hero})=>{const g=window.__riftTest.game;g.phase="playing";g.hitStopEnabled=false;g.player.inv=999;g.enemies=[];g.bullets=[];g.events=[];g.fx=[];g.skillFields=[];g.skillTasks=[];g.skillPose=null;g.spellFields=[];g.rift=null;g.bladeSwing=null;g.rangedAttacks={};g.weapons={};g.cool={};g.passives={};g.time=42;
   for(let i=0;i<9;i++){const e=g.spawn(i%2?"shade":"brute"),a=-.8+i*.2,r=key==="trap"?30+i*4:key==="whirlwind"||key==="rend"||key==="slam"||key==="orbit"?80+i*5:100+i%3*16;Object.assign(e,{x:g.player.x+Math.cos(a)*r,y:g.player.y+Math.sin(a)*r,speed:0,hp:5000,maxHp:5000,shoot:999});}
   if(key==="orbit")g.weapons={orbit:3};else g.attack(key,3);
   const count=key==="meteor"?59:key==="fireball"?30:key==="volley"?44:key==="frost"?37:key==="trap"?42:key==="slam"?25:key==="fissure"?28:key==="pyre"?33:key==="beam"?38:key==="glaive"||key==="hammer"?28:key==="ricochet"?25:key==="lightning"?14:key==="arrow"||key==="bolt"?17:20;
   for(let i=0;i<count;i++)g.step(1/60);g.phase="paused";
  },{key,hero});await page.waitForTimeout(80);await capture(page,hero+"-"+key);}
  for(const lv of [2,4]){await page.evaluate(lv=>{const g=window.__riftTest.game;g.phase="playing";g.level=8;g.weapons={[g.hero.weapon]:lv};g.passives={};g.addXP(g.need);g.choices=[g.hero.weapon,...(g.hero.id==="knight"?["hammer","fissure"]:g.hero.id==="ranger"?["ricochet","glaive"]:["beam","pyre"]),"power"];},lv);await page.locator(".upgrade").first().waitFor();await capture(page,hero+"-awakening-"+(lv+1));await page.locator(".upgrade").first().click();}
 await page.evaluate(()=>window.__riftTest.finish(false));await page.locator("#result-home").click();
 }
 // Review the real animation at multiple times, with reduced effects too.
 await page.setViewportSize({width:390,height:844});
 for(const [hero,key]of [["knight","orbit"],["knight","whirlwind"],["mage","ultimate"]]){
  await page.locator('[data-hero="'+hero+'"]').click();await page.locator("#start").click();
  for(const seconds of key==="orbit"?[0,.18,.36,.54]:[.16,.34,.58,.90]){
   await page.evaluate(({key,seconds})=>{const {game:g,renderer:r}=window.__riftTest;g.phase="playing";g.hitStopEnabled=false;g.player.inv=0;g.player.ultCd=0;g.spawnCd=g.nextElite=g.nextRift=999;g.enemies=[];g.weapons={};g.cool={};g.bullets=[];g.events=[];g.fx=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.ultimateState=null;g.skillPose=null;g.rangedAttacks={};g.bladeSwing=null;g.rift=null;g.passives={};g.time=42;r.reduced=false;r.setQuality(1);
    for(let i=0;i<10;i++){const e=g.spawn(i%2?"shade":"brute"),a=i*Math.PI*2/10,rad=110+i%3*20;Object.assign(e,{x:g.player.x+Math.cos(a)*rad,y:g.player.y+Math.sin(a)*rad,speed:0,hp:5000,maxHp:5000,shoot:999});}
    if(key==="orbit")g.weapons={orbit:5};else if(key==="ultimate")g.ultimate();else g.attack("whirlwind",5);
    for(let i=0;i<Math.round(seconds*60);i++)g.step(1/60);g.phase="paused";
   },{key,seconds});
   await page.waitForTimeout(70);await capture(page,"review-"+key+"-"+Math.round(seconds*100));
  }
  await page.evaluate(()=>window.__riftTest.renderer.reduced=true);await page.waitForTimeout(80);await capture(page,"review-"+key+"-reduced");
  await page.evaluate(()=>{window.__riftTest.renderer.reduced=false;window.__riftTest.game.finish(false);});await page.locator("#result-home").click();
 }
 for(const key of ["orbit","whirlwind","ultimate"]){
  const frames=key==="orbit"?[0,18,36,54]:[16,34,58,90];
  await sharp({create:{width:390*4,height:844,channels:4,background:"#0a182d"}}).composite(frames.map((at,i)=>({input:dir+"/review-"+key+"-"+at+".webp",left:i*390,top:0}))).webp({quality:90}).toFile(dir+"/timeline-"+key+".webp");
  await sharp(dir+"/review-"+key+"-"+frames[2]+".webp").extract({left:22,top:250,width:346,height:350}).resize(692,700).webp({quality:90}).toFile(dir+"/detail-"+key+".webp");
 }


 // Temporal sheets expose animation, alignment and late-build visual density.
 // Fixtures use invulnerability only for review; this is not a human balance test.
 const temporalSheets=[],tierSheets=[],liveSheets=[];
 for(const hero of ["knight","ranger","mage"]){
  await page.locator('[data-hero="'+hero+'"]').click();await page.locator("#start").click();
  const all=hero==="knight"?["blade","whirlwind","cleave","slam","rend","orbit","hammer","fissure","crosscut","phantom","judgment","thousand"]:hero==="ranger"?["arrow","multishot","piercing","poison","trap","volley","ricochet","glaive","explosive","falcon","stormbow","ballista"]:["bolt","fireball","lightning","frost","meteor","nova","beam","pyre","spirit","blackflame","gravity","dragon"];
  for(const key of [...all,"ultimate"]){
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
 // Staged captures of all new skill shapes, each new enemy, each boss and region transition.
 await page.setViewportSize({width:390,height:844});
 for(const hero of ["knight","ranger","mage"]){
  await page.locator('[data-hero="'+hero+'"]').click();await page.locator("#start").click();
  const keys=hero==="knight"?["crosscut","phantom","judgment","thousand"]:hero==="ranger"?["explosive","falcon","stormbow","ballista"]:["spirit","blackflame","gravity","dragon"];
  for(const key of keys){await page.evaluate(({hero,key})=>{const g=window.__riftTest.game;g.phase="playing";g.stage=5;g.stageStarted=0;g.time=42;g.hitStopEnabled=false;g.player.inv=999;g.spawnCd=g.nextElite=g.nextMagnet=9999;g.enemies=[];g.bullets=[];g.shots=[];g.hazards=[];g.fx=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.weapons={};g.passives={};g.ultimateState=null;g.bladeSwing=null;g.rangedAttacks={};g.rift=null;g.player.x=g.player.y=900;
   for(let i=0;i<7;i++){const e=g.spawn(["guard","hound","brute","wisp","healer","sniper","frostling"][i]);Object.assign(e,{x:1000+i%3*35,y:850+Math.floor(i/3)*40,speed:0,hp:99999,maxHp:99999,shoot:999});}
   g.attack(key,5);const steps={crosscut:24,explosive:20,spirit:24,phantom:27,falcon:28,blackflame:40,judgment:41,stormbow:22,gravity:52,thousand:33,ballista:35,dragon:50}[key];for(let i=0;i<steps;i++)g.step(1/60);g.phase="paused";
  },{hero,key});await page.waitForTimeout(80);await capture(page,hero+"-campaign-"+key);}
  await page.evaluate(()=>{const g=window.__riftTest.game;g.phase="playing";g.finish(false);});await page.locator("#result-home").click();
 }
 await page.locator('[data-hero="knight"]').click();await page.locator("#start").click();
 for(let stage=1;stage<=5;stage++){await page.evaluate(stage=>{const g=window.__riftTest.game;g.stage=stage;g.clearedStages=stage-1;g.stageStarted=0;g.time=42;g.phase="playing";g.player.x=g.player.y=900;g.player.inv=999;g.spawnCd=g.nextElite=g.nextMagnet=9999;g.bossSpawned=false;g.weapons={};g.pending=0;const b=g.spawnBoss();b.x=1000;b.y=915;b.speed=0;b.shoot=b.storm=b.special=999;g.phase="paused";},stage);await page.waitForTimeout(90);await capture(page,"region-"+stage+"-boss");
 if(stage<5){await page.evaluate(()=>{const g=window.__riftTest.game;g.phase="playing";g.hit(g.enemies.find(e=>e.boss),999999,g.player);});await page.locator("#next-stage").waitFor();await page.setViewportSize({width:360,height:640});await page.waitForTimeout(50);await capture(page,"region-"+stage+"-continue");await page.locator("#next-stage").click();await page.setViewportSize({width:390,height:844});}}
 await page.evaluate(()=>window.__riftTest.finish(false));await page.locator("#result-home").click();
 await page.setViewportSize({width:360,height:640});await page.waitForTimeout(150);await capture(page,"small-home");

 // A 330px dragon aimed down the portrait viewport checks the long UV path too.
 await page.locator('[data-hero="mage"]').click();await page.locator("#start").click();
 for(const evolved of [false,true]){const names=[];
 for(const [frame,at]of [.35,.85,1.40].entries()){const name="dragon-long-"+(evolved?"evolved":"lv3")+"-"+frame;names.push(name);
 await page.evaluate(({evolved,at})=>{const {game:g,renderer:r}=window.__riftTest;g.phase="playing";g.stage=5;g.stageStarted=0;g.time=42;g.hitStopEnabled=false;g.spawnCd=g.nextElite=g.nextMagnet=g.nextRift=9999;g.enemies=[];g.bullets=[];g.shots=[];g.hazards=[];g.events=[];g.fx=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.weapons={};g.passives={};g.evolved=evolved?{dragon:true}:{};g.cool={};g.ultimateState=null;g.bladeSwing=null;g.rangedAttacks={};g.skillPose=null;g.rift=null;g.player.x=g.player.y=900;g.player.inv=999;r.reduced=false;r.setQuality(1);
 for(let i=0;i<4;i++){const e=g.spawn(i%2?"guard":"hound");Object.assign(e,{x:900+(i-1.5)*10,y:1210+i%2*5,hp:99999,maxHp:99999,speed:0,shoot:9999,special:9999});}g.attack("dragon",evolved?5:3);for(let i=0;i<Math.round(at*60);i++)g.step(1/60,{x:0,y:0});g.events=[];g.phase="paused";
 },{evolved,at});await page.waitForTimeout(50);await capture(page,name);}
 const sheet="motion-dragon-long-"+(evolved?"evolved":"lv3")+".webp";temporalSheets.push(sheet);await sharp({create:{width:1170,height:844,channels:4,background:"#091321"}}).composite(names.map((name,i)=>({input:dir+"/"+name+".webp",left:i*390,top:0}))).webp({quality:90}).toFile(dir+"/"+sheet);}
 await page.evaluate(()=>window.__riftTest.finish(false));await page.locator("#result-home").click();
 if(errors.length)throw Error(JSON.stringify(errors));fs.writeFileSync(dir+"/manifest.json",JSON.stringify({version:"5.2.0",viewport:"390×844; 360×640 small home",method:"Screenshots of the real Canvas/DOM renderer. Combat fixtures seed enemies, time and upgrades for visual review; they are staged scenes, not evidence of human play quality.",shots,temporalSheets,tierSheets,liveSheets,timelines:["timeline-orbit.webp","timeline-whirlwind.webp","timeline-ultimate.webp"],details:["detail-orbit.webp","detail-whirlwind.webp","detail-ultimate.webp"],errors},null,2));console.log("Art review scenes captured: "+shots.length);
}finally{await browser?.close();server.kill();}
