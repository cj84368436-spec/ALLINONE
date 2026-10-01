import fs from "node:fs";
import {spawn} from "node:child_process";
import {chromium} from "@playwright/test";
fs.mkdirSync("release",{recursive:true});
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5180"],{stdio:"ignore"});let browser;
try{
  let healthy=false;for(let i=0;i<100;i++){try{if((await fetch("http://127.0.0.1:5180")).ok){healthy=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!healthy)throw new Error("Screenshot server did not start");
  browser=await chromium.launch();const page=await browser.newPage({viewport:{width:600,height:600},deviceScaleFactor:1});
  await page.goto("http://127.0.0.1:5180/icon.svg");await page.locator("svg").screenshot({path:"release/icon.png"});
  // Console portrait assets are 636 x 1048; retain genuine generated game content.
  await page.setViewportSize({width:636,height:1048});await page.goto("http://127.0.0.1:5180");await page.locator("#home").waitFor();await page.addStyleTag({content:"#app{max-width:none}"});await page.screenshot({path:"release/home.png"});
  await page.locator("#start").click();await page.evaluate(()=>{const g=window.__riftTest.game;g.player.inv=999;g.time=125;g.weapons={blade:5,orbit:5,lightning:4,frost:3};g.passives={power:2,heart:2};g.checkEvolution();g.level=12;for(let i=0;i<36;i++){const e=g.spawn(["shade","bat","brute","seer"][i%4]),a=i*Math.PI*2/36;e.x=g.player.x+Math.cos(a)*(145+i*6);e.y=g.player.y+Math.sin(a)*(145+i*6);}});
  await page.waitForTimeout(350);await page.screenshot({path:"release/gameplay.png"});await page.evaluate(()=>window.__riftTest.giveXP(1000));await page.locator(".upgrade").first().waitFor();await page.screenshot({path:"release/skills.png"});
  // Wide original game scene for the 1932 x 828 console thumbnail.
  await page.setViewportSize({width:1932,height:828});await page.evaluate(()=>{document.querySelector("#home").classList.add("hidden");document.querySelector("#overlay").classList.add("hidden");document.querySelector("#hud").classList.add("hidden");const t=window.__riftTest,g=t.game;g.phase="paused";t.renderer.resize();g.enemies=[];g.fx=[];g.gems=[];for(let i=0;i<90;i++){const e=g.spawn(["shade","bat","brute","seer"][i%4]);e.x=100+(i%18)*94;e.y=600+Math.floor(i/18)*125;e.hp=e.maxHp;}t.renderer.draw(20,g,g.hero,{active:false});});
  await page.addStyleTag({content:".thumbnail-title{position:absolute;left:110px;top:75px;color:#f3e9c6;font:bold 72px Georgia,serif;text-shadow:0 4px 18px #08231b}.thumbnail-title small{display:block;font:24px -apple-system,sans-serif;color:#b7e5c1;margin-top:14px}"});
  await page.evaluate(()=>{const el=document.createElement("div");el.className="thumbnail-title";el.innerHTML='균열의 수호자<small>별빛으로 숲의 균열을 닫으세요</small>';document.querySelector("#app").append(el);});await page.screenshot({path:"release/thumbnail.png"});
  const expected={"icon.png":[600,600],"home.png":[636,1048],"gameplay.png":[636,1048],"skills.png":[636,1048],"thumbnail.png":[1932,828]};for(const [name,[w,h]] of Object.entries(expected)){const b=fs.readFileSync("release/"+name);if(b.readUInt32BE(16)!==w||b.readUInt32BE(20)!==h)throw new Error("Wrong asset dimensions: "+name);}
  console.log("600px icon, three 636x1048 portraits and 1932x828 thumbnail generated");
}finally{await browser?.close();server.kill();}
