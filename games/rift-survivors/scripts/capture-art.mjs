import fs from "node:fs";
import {spawn} from "node:child_process";
import {chromium} from "@playwright/test";
const out=process.env.RIFT_EVIDENCE_DIR||"../../.evidence/rift-1.2";fs.mkdirSync(out,{recursive:true});
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","4173"],{stdio:"inherit"});
let browser;try{
for(let i=0;i<60;i++){try{if((await fetch("http://127.0.0.1:4173")).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const errors=[];page.on("pageerror",e=>errors.push(e.message));await page.goto("http://127.0.0.1:4173");await page.locator("#home").waitFor({state:"visible"});await page.waitForTimeout(300);await page.screenshot({path:out+"/home.png",scale:"css"});
await page.locator("#start").click();await page.evaluate(()=>{const g=window.__riftTest.game;g.player.inv=10;g.spawnCd=999;g.nextElite=999;g.time=46;g.level=5;g.weapons={blade:3,bolt:2,orbit:3};for(let i=0;i<10;i++){const e=g.spawn(["shade","bat","brute","seer"][i%4]),a=i*Math.PI*2/10,r=92+(i%3)*33;e.x=g.player.x+Math.cos(a)*r;e.y=g.player.y+Math.sin(a)*r;e.hp=e.maxHp=700;}g.attack("blade",3);g.step(.035,{x:0,y:0});g.phase="paused";document.querySelector("#banner").style.opacity=0;});
await page.waitForTimeout(250);await page.screenshot({path:out+"/combat.png",scale:"css"});
await page.reload();await page.locator("#home").waitFor({state:"visible"});await page.setViewportSize({width:360,height:640});await page.waitForTimeout(200);await page.screenshot({path:out+"/small-phone.png",scale:"css"});
if(errors.length)throw new Error(errors.join("\n"));const start=await page.locator("#start").boundingBox();if(start.y+start.height>640)throw new Error("Start button outside small phone");fs.writeFileSync(out+"/manifest.json",JSON.stringify({version:"1.2.0",engine:"Chromium",nativePhoneTest:false,screenshots:["home.png","combat.png","small-phone.png"],combatScene:"Design verification fixture captured from the actual running renderer",errors},null,2));
}finally{await browser?.close();server.kill("SIGTERM");}
