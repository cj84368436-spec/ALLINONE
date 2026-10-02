import fs from "node:fs";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {chromium} from "@playwright/test";
const sharp=createRequire("/tmp/rift-review/package.json")("sharp");
const dir="../../.evidence/rift-2.0";fs.mkdirSync(dir,{recursive:true});const shots=[];
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5190"],{stdio:"ignore"});let browser;
async function capture(page,name){const bytes=await page.screenshot();await sharp(bytes).resize({width:390}).webp({quality:88}).toFile(dir+"/"+name+".webp");shots.push(name);}
try{
 let healthy=false;for(let i=0;i<100;i++){try{if((await fetch("http://127.0.0.1:5190")).ok){healthy=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!healthy)throw Error("review server");
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:5190");await page.locator("#home").waitFor();
 for(const hero of ["knight","ranger","mage"]){
  await page.locator('[data-hero="'+hero+'"]').click();await page.waitForTimeout(120);await capture(page,hero+"-home");await page.locator("#start").click();
  await page.evaluate(()=>{const g=window.__riftTest.game;g.player.inv=999;g.spawnCd=999;g.nextElite=999;g.time=42;g.nextRift=110;g.level=6;g.weapons={[g.hero.weapon]:3,orbit:2};g.passives={power:1};g.enemies=[];for(let i=0;i<16;i++){const e=g.spawn(["shade","brute","bat","seer"][i%4]),a=i*Math.PI*2/16,r=125+(i%3)*38;Object.assign(e,{x:g.player.x+Math.cos(a)*r,y:g.player.y+Math.sin(a)*r,speed:0,hp:500,maxHp:500,shoot:999});}g.rift={x:g.player.x+96,y:g.player.y+115,r:64,progress:1.2,life:14};});
  await page.waitForTimeout(260);await page.evaluate(()=>window.__riftTest.game.phase="paused");await page.waitForTimeout(120);await capture(page,hero+"-combat");
  await page.evaluate(()=>window.__riftTest.game.phase="playing");await page.locator("#ultimate").click();await page.waitForTimeout(hero==="mage"?280:130);await page.evaluate(()=>window.__riftTest.game.phase="paused");await page.waitForTimeout(120);await capture(page,hero+"-ultimate");
  await page.evaluate(()=>{const g=window.__riftTest.game;g.phase="playing";g.addXP(g.need);});await page.locator(".upgrade").first().waitFor();await capture(page,hero+"-growth");
  await page.evaluate(()=>window.__riftTest.finish(false));await page.locator("#result-home").click();
 }
 await page.setViewportSize({width:360,height:640});await page.waitForTimeout(150);await capture(page,"small-home");
 if(errors.length)throw Error(JSON.stringify(errors));fs.writeFileSync(dir+"/manifest.json",JSON.stringify({version:"2.0.0",viewport:"390×844; 360×640 small home",method:"Screenshots of the real Canvas/DOM renderer. Combat fixtures seed enemies, time and upgrades for visual review; they are staged scenes, not evidence of human play quality.",shots,errors},null,2));console.log("Art review scenes captured: "+shots.length);
}finally{await browser?.close();server.kill();}
