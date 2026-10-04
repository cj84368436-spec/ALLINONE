import fs from "node:fs";
import {spawn,spawnSync,execFileSync} from "node:child_process";
import {chromium} from "@playwright/test";
const dir="../../.evidence/rift-5.2/showcase";fs.mkdirSync(dir,{recursive:true});
const server=spawn(process.execPath,["node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","5191"],{stdio:"ignore"});let browser;
try{
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch("http://127.0.0.1:5191")).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error("showcase server");
 browser=await chromium.launch({args:["--autoplay-policy=no-user-gesture-required"]});const clips=[];
 for(const [hero,key]of [["knight","thousand"],["ranger","ballista"],["mage","dragon"]]){
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));await page.goto("http://127.0.0.1:5191/?practice="+key);await page.locator("#start").click();
  await page.evaluate(async({hero,key})=>{
   const {game:g,renderer:r,audio:a}=window.__riftTest;g.practice=false;g.stage=5;g.stageStarted=0;g.time=42;g.spawnCd=g.nextElite=g.nextMagnet=g.nextRift=9999;g.weapons={[key]:5};g.evolved={[key]:true};g.passives={power:2};g.cool={[key]:.35};g.enemies=[];g.bullets=[];g.shots=[];g.fx=[];g.events=[];g.skillFields=[];g.skillTasks=[];g.spellFields=[];g.rift=null;g.player.inv=0;g.player.hp=g.player.maxHp=9999;g.player.x=g.player.y=900;r.reduced=false;r.setQuality(1);
   for(let i=0;i<9;i++){const e=g.spawn(["guard","hound","wisp","frostling"][i%4]);Object.assign(e,{x:975+i%3*27,y:840+Math.floor(i/3)*43,hp:99999,maxHp:99999,speed:3,shoot:9999,special:9999});}
   await a.prepare();await a.context.resume();a.enabled=true;a.wantsPlayback=true;
   const destination=a.context.createMediaStreamDestination();a.output.connect(destination);
   const stream=r.canvas.captureStream(30);for(const track of destination.stream.getAudioTracks())stream.addTrack(track);
   const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?"video/webm;codecs=vp9,opus":"video/webm";
   const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1800000,audioBitsPerSecond:128000});window.__showcase={recorder,chunks:[],destination,stream};recorder.ondataavailable=e=>{if(e.data.size)window.__showcase.chunks.push(e.data);};recorder.start(250);
  },{hero,key});
  await page.waitForTimeout(12500);
  const b64=await page.evaluate(async()=>{const s=window.__showcase;await new Promise(resolve=>{s.recorder.onstop=resolve;s.recorder.stop();});const blob=new Blob(s.chunks,{type:s.recorder.mimeType});const bytes=new Uint8Array(await blob.arrayBuffer());let raw="";for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));for(const track of s.stream.getTracks())track.stop();window.__riftTest.audio.output.disconnect(s.destination);return btoa(raw);});
  const webm=dir+"/"+hero+".webm",mp4=dir+"/"+hero+".mp4";fs.writeFileSync(webm,Buffer.from(b64,"base64"));execFileSync("ffmpeg",["-y","-i",webm,"-vf","scale=390:844","-c:v","libx264","-preset","veryfast","-crf","24","-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-movflags","+faststart",mp4],{stdio:"ignore"});
  const probe=JSON.parse(execFileSync("ffprobe",["-v","quiet","-show_streams","-show_format","-of","json",mp4],{encoding:"utf8"}));if(!probe.streams.some(s=>s.codec_type==="audio"&&s.codec_name==="aac"))throw Error("Missing AAC game mix");
  const decoded=spawnSync("ffmpeg",["-hide_banner","-i",mp4,"-vn","-af","volumedetect","-f","null","-"],{encoding:"utf8"});if(decoded.status!==0)throw Error("Cannot inspect captured game mix");const meanDb=Number(decoded.stderr.match(/mean_volume: ([\d.-]+) dB/)?.[1]),peakDb=Number(decoded.stderr.match(/max_volume: ([\d.-]+) dB/)?.[1]);if(!Number.isFinite(meanDb)||!Number.isFinite(peakDb)||meanDb<=-65||peakDb<=-45)throw Error("Captured game mix is silent or unusably quiet: "+JSON.stringify({hero,meanDb,peakDb}));
  const excerpt=execFileSync("ffmpeg",["-hide_banner","-loglevel","error","-i",mp4,"-ss","1","-t","5","-vn","-c:a","libmp3lame","-b:a","96k","-f","mp3","pipe:1"],{maxBuffer:2*1024*1024});fs.writeFileSync(dir+"/"+hero+".audio.b64.txt",excerpt.toString("base64"));
  if(errors.length)throw Error(JSON.stringify(errors));clips.push({hero,key,seconds:probe.format.duration,bytes:fs.statSync(mp4).size,hasAudio:true,meanDb,peakDb});fs.unlinkSync(webm);await page.close();
 }
 fs.writeFileSync(dir+"/manifest.json",JSON.stringify({version:"5.2.0",method:"Staged late-stage evolving skill, actual Canvas animation and Web Audio output recorded together. High-health fixtures are for VFX/audio review; not human play or native-device evidence.",clips},null,2));console.log(JSON.stringify(clips));
}finally{await browser?.close();server.kill();}
