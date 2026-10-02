import fs from "node:fs";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {chromium} from "@playwright/test";
const sharp=createRequire("/tmp/rift-review/package.json")("sharp");
const dir="../../.evidence/rift-3.0";fs.mkdirSync(dir,{recursive:true});const shots=[];
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
  const keys=hero==="knight"?["blade","whirlwind","cleave","slam","rend","orbit"]:hero==="ranger"?["arrow","multishot","piercing","poison","trap","volley"]:["bolt","fireball","lightning","frost","meteor","nova"];
  for(const key of keys){await page.evaluate(({key,hero})=>{const g=window.__riftTest.game;g.phase="playing";g.hitStopEnabled=false;g.player.inv=999;g.enemies=[];g.bullets=[];g.events=[];g.fx=[];g.skillFields=[];g.skillTasks=[];g.skillPose=null;g.spellFields=[];g.rift=null;g.bladeSwing=null;g.rangedAttacks={};g.weapons={};g.cool={};g.passives={};g.time=42;
   for(let i=0;i<9;i++){const e=g.spawn(i%2?"shade":"brute"),a=-.8+i*.2,r=key==="trap"?30+i*4:key==="whirlwind"||key==="rend"||key==="slam"||key==="orbit"?80+i*5:100+i%3*16;Object.assign(e,{x:g.player.x+Math.cos(a)*r,y:g.player.y+Math.sin(a)*r,speed:0,hp:5000,maxHp:5000,shoot:999});}
   if(key==="orbit")g.weapons={orbit:3};else g.attack(key,3);
   const count=key==="meteor"?59:key==="fireball"?30:key==="volley"?44:key==="frost"?37:key==="trap"?42:key==="slam"?25:key==="lightning"?14:key==="arrow"||key==="bolt"?17:20;
   for(let i=0;i<count;i++)g.step(1/60);g.phase="paused";
  },{key,hero});await page.waitForTimeout(80);await capture(page,hero+"-"+key);}
  await page.evaluate(()=>window.__riftTest.finish(false));await page.locator("#result-home").click();
 }
 await page.setViewportSize({width:360,height:640});await page.waitForTimeout(150);await capture(page,"small-home");
 if(errors.length)throw Error(JSON.stringify(errors));fs.writeFileSync(dir+"/manifest.json",JSON.stringify({version:"3.0.0",viewport:"390×844; 360×640 small home",method:"Screenshots of the real Canvas/DOM renderer. Combat fixtures seed enemies, time and upgrades for visual review; they are staged scenes, not evidence of human play quality.",shots,errors},null,2));console.log("Art review scenes captured: "+shots.length);
}finally{await browser?.close();server.kill();}
