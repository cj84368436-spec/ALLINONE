import fs from "node:fs";
import {spawn} from "node:child_process";
import {chromium} from "@playwright/test";
fs.mkdirSync("release",{recursive:true});
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5180"],{stdio:"ignore"});let browser;
try{let healthy=false;for(let i=0;i<100;i++){try{if((await fetch("http://127.0.0.1:5180")).ok){healthy=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
if(!healthy)throw new Error("Screenshot server did not start");
browser=await chromium.launch();const page=await browser.newPage({viewport:{width:600,height:600},deviceScaleFactor:1});
await page.goto("http://127.0.0.1:5180/icon.svg");await page.locator("svg").screenshot({path:"release/icon.png",omitBackground:true});
await page.setViewportSize({width:390,height:844});await page.goto("http://127.0.0.1:5180");await page.locator("#home").waitFor();await page.screenshot({path:"release/home.png"});
await page.locator("#start").click();await page.evaluate(()=>{const g=window.__riftTest.game;g.time=125;g.weapons={blade:4,orbit:3,lightning:3,frost:2};g.level=12;for(let i=0;i<26;i++){const e=g.spawn(["shade","bat","brute","seer"][i%4]),a=i*Math.PI*2/26;e.x=g.player.x+Math.cos(a)*(110+i*8);e.y=g.player.y+Math.sin(a)*(110+i*8);}});
await page.waitForTimeout(350);await page.screenshot({path:"release/gameplay.png"});await page.evaluate(()=>window.__riftTest.giveXP(1000));await page.locator(".upgrade").first().waitFor();await page.screenshot({path:"release/skills.png"});
console.log("600px icon and game screenshots generated");
}finally{await browser?.close();server.kill();}
