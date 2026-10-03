import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {execFileSync as exec} from "node:child_process";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),sharp=require("/tmp/rift-v4-assets/node_modules/sharp");
const out="games/rift-survivors/public",root="/tmp/rift-v4-materials";fs.mkdirSync(root,{recursive:true});
for(const [input,name,width]of [["icons","skill-extra",1536],["vfx","combat-v4",1536]]){
 const file=".asset-tools/v4/"+input+".png",image=sharp(file),metadata=await image.metadata();
 await image.resize({width}).webp({quality:87,alphaQuality:100,effort:6}).toFile(out+"/art/"+name+".webp");
 console.log(JSON.stringify({asset:name,input:metadata,bytes:fs.statSync(out+"/art/"+name+".webp").size}));
}
const sources=[
{id:"ice",url:"https://opengameart.org/sites/default/files/IceShatters_0.zip",author:"IgnasD",license:"CC0-1.0",page:"https://opengameart.org/content/ice-breakingshattering"},
{id:"bang",url:"https://opengameart.org/sites/default/files/25-CC0-bang-sfx.zip",author:"rubberduck",license:"CC0-1.0",page:"https://opengameart.org/content/25-cc0-bang-firework-sfx"},
{id:"fire",url:"https://opengameart.org/sites/default/files/qubodupFireLoop.flac",author:"qubodup",license:"CC-BY-3.0",page:"https://opengameart.org/content/fire-loop"},
{id:"rock",url:"https://opengameart.org/sites/default/files/rock_breaking.flac",author:"Blender Foundation",license:"CC-BY-3.0",page:"https://opengameart.org/content/rockbreaking"},
{id:"acid",url:"https://opengameart.org/sites/default/files/Acid%20Bubble.wav",author:"spookymodem",license:"CC-BY-3.0",page:"https://opengameart.org/content/bubbling-acid"},
{id:"wind",url:"https://opengameart.org/sites/default/files/strong%20wind%20blowing_0.mp3",author:"Flixberry Entertainment",license:"CC-BY-3.0",page:"https://opengameart.org/content/strong-wind-blowing"}
];
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const s of sources){let b;for(let attempt=0;attempt<3;attempt++){try{const r=await fetch(s.url,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(s.id+" HTTP "+r.status);b=Buffer.from(await r.arrayBuffer());break;}catch(e){if(attempt===2)throw e;}}
 s.sha256=crypto.createHash("sha256").update(b).digest("hex");
 const ext=new URL(s.url).pathname.split(".").pop(),file=root+"/"+s.id+"."+ext;fs.writeFileSync(file,b);
 if(ext==="zip"){const folder=root+"/"+s.id;fs.mkdirSync(folder,{recursive:true});exec("unzip",["-q","-o",file,"-d",folder]);s.files=walk(folder).filter(f=>!f.includes("__MACOSX")&&/\.(wav|ogg|mp3|flac)$/i.test(f)).sort();console.log(s.id+" source files "+JSON.stringify(s.files.map(f=>path.basename(f))));const candidates=s.files.filter(f=>!/sci|laser|space|loop/i.test(path.basename(f)));s.file=(candidates.length?candidates:s.files).sort((a,b)=>fs.statSync(b).size-fs.statSync(a).size)[0];}else s.file=file;
 if(!s.file)throw Error("No recording "+s.id);
}
function extract(file,name,seconds){const pcm=exec("ffmpeg",["-v","error","-i",file,"-ar","22050","-ac","1","-f","s16le","pipe:1"],{maxBuffer:64*1024*1024});const window=2205;let energy=0,best=-1,at=0;for(let i=0;i<pcm.length/2;i++){const x=pcm.readInt16LE(i*2);energy+=x*x;if(i>=window){const old=pcm.readInt16LE((i-window)*2);energy-=old*old;}if(energy>best){best=energy;at=Math.max(0,i-window);}}const start=Math.max(0,Math.min(at/22050-.025,pcm.length/44100-seconds));const dest=root+"/"+name+".wav";exec("ffmpeg",["-v","error","-y","-ss",String(start),"-i",file,"-t",String(seconds),"-ac","1","-ar","44100",dest]);return dest;}
const raw=Object.fromEntries(sources.map(s=>[s.id,extract(s.file,s.id+"-cut",s.id==="wind"?2.2:s.id==="fire"?1.7:s.id==="rock"?1.2:1)]));
const legacy=name=>out+"/audio/"+name+".mp3";
const original=root+"/original";fs.mkdirSync(original,{recursive:true});for(const n of ["swish-a","swish-b","swish-c","blade-hit-a","blade-hit-b","arrow-flight","thunder"])fs.copyFileSync(legacy(n),original+"/"+n+".mp3");
const old=n=>original+"/"+n+".mp3";
const recipes=[
["fire-cast",[raw.fire,old("arrow-flight")],["highpass=f=180,lowpass=f=8200,volume=0.8","highpass=f=650,volume=0.48"],.68],
["fire-impact",[raw.bang,raw.fire,raw.rock],["highpass=f=55,lowpass=f=7300,volume=0.48","highpass=f=160,volume=0.55","lowpass=f=3200,volume=0.18"],.95],
["ice-impact",[raw.ice,raw.wind],["highpass=f=240,equalizer=f=2600:t=q:w=1:g=2,volume=0.95","highpass=f=450,lowpass=f=5200,volume=0.22"],.65],
["stone-impact",[raw.rock,raw.bang],["highpass=f=45,lowpass=f=6500,volume=0.8","lowpass=f=2800,volume=0.16"],1.05],
["poison-impact",[raw.acid,raw.ice],["highpass=f=190,lowpass=f=4800,volume=0.9","highpass=f=600,lowpass=f=2400,volume=0.08"],.65],
["whirlwind",[raw.wind,old("swish-a"),old("swish-c")],["highpass=f=180,lowpass=f=6500,volume=0.55","apad,volume=0.46","adelay=170,apad,volume=0.35"],1.1],
["void-cast",[raw.ice,old("swish-b")],["areverse,asetrate=33075,aresample=44100,highpass=f=160,lowpass=f=7200,volume=0.5","highpass=f=350,volume=0.35"],.62],
["void-impact",[raw.rock,raw.ice,old("thunder")],["asetrate=35280,aresample=44100,highpass=f=80,lowpass=f=6800,volume=0.36","highpass=f=550,volume=0.55","lowpass=f=1600,volume=0.12"],.83],
["steel-return",[old("swish-c"),old("blade-hit-a")],["apad,volume=0.8","adelay=90,highpass=f=900,volume=0.2"],.55],
["bolt-release",[raw.wind,raw.ice],["highpass=f=600,lowpass=f=8000,volume=0.48","areverse,highpass=f=1300,volume=0.34"],.48],
["bolt-hit",[raw.ice],["highpass=f=370,lowpass=f=9000,volume=1"],.38],
["frost",[raw.wind,raw.ice],["highpass=f=230,lowpass=f=6500,volume=0.72","adelay=90,highpass=f=700,volume=0.28"],1.22],
["magic",[raw.rock,raw.ice],["areverse,highpass=f=150,lowpass=f=6700,volume=0.33","areverse,highpass=f=900,volume=0.44"],.7],
["ultimate",[raw.rock,old("swish-c"),raw.bang],["highpass=f=65,lowpass=f=7500,volume=0.64","highpass=f=550,volume=0.37","adelay=40,lowpass=f=2600,volume=0.18"],1.18]
];
for(const [name,files,filters,duration]of recipes){const labels=files.map((_,i)=>"["+i+"a]");let graph=files.map((_,i)=>"["+i+":a]"+filters[i]+",apad"+labels[i]).join(";")+";"+labels.join("")+"amix=inputs="+files.length+":duration=longest:normalize=0,atrim=duration="+duration+",acompressor=threshold=0.25:ratio=3:attack=3:release=95,loudnorm=I=-20:TP=-4:LRA=5,alimiter=limit=.82:level=false,afade=t=in:d=.004,afade=t=out:st="+Math.max(.04,duration-.13)+":d=.13[mix]";exec("ffmpeg",["-v","error","-y",...files.flatMap(f=>["-i",f]),"-filter_complex",graph,"-map","[mix]","-t",String(duration),"-ac","1","-ar","44100","-c:a","libmp3lame","-b:a","128k",legacy(name)]);}
const manifest=JSON.parse(fs.readFileSync(out+"/audio/manifest.json","utf8"));manifest.version="4.0.0";manifest.files=fs.readdirSync(out+"/audio").filter(f=>f.endsWith(".mp3")).sort().map(name=>{const file=out+"/audio/"+name,b=fs.readFileSync(file);return{name,bytes:b.length,sha256:crypto.createHash("sha256").update(b).digest("hex"),duration:Number(exec("ffprobe",["-v","error","-show_entries","format=duration","-of","csv=p=0",file]).toString().trim())};});manifest.totalBytes=manifest.files.reduce((s,f)=>s+f.bytes,0);manifest.materialMix="Recorded fire crackle, fireworks, breaking rock, ice shatter, acid bubbles, wind and existing steel/arrow Foley. Layered, trimmed, equalized and peak-limited; no oscillator or arcade spell samples in combat routes.";fs.writeFileSync(out+"/audio/manifest.json",JSON.stringify(manifest,null,2)+"\n");
const metadata=sources.map(({files,file,...s})=>s),sourceIndex=JSON.parse(fs.readFileSync(out+"/audio/source-index.json","utf8"));sourceIndex.materialRemix={version:"4.0.0",sources:metadata,recipes:recipes.map(([name,,filters,duration])=>({name,filters,duration}))};fs.writeFileSync(out+"/audio/source-index.json",JSON.stringify(sourceIndex,null,2)+"\n");
fs.appendFileSync(out+"/audio/CREDITS.txt","\nRift Keepers 4.0 material combat recordings:\n"+sources.map(s=>s.author+" — "+s.license+" — "+s.page).join("\n")+"\nCC BY 3.0: https://creativecommons.org/licenses/by/3.0/\nEdits: energetic recording excerpts, reversal, pitch, EQ, layers, compression, loudness, short fades and MP3 encoding. No Diablo audio or artwork used.\n");
const metrics=[];for(const [name]of recipes){const pcm=exec("ffmpeg",["-v","error","-i",legacy(name),"-ac","1","-ar","22050","-f","s16le","pipe:1"]);let peak=0,energy=0;for(let i=0;i<pcm.length;i+=2){const v=pcm.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(v));energy+=v*v;}const rms=Math.sqrt(energy/(pcm.length/2));if(peak>=.98||rms<.003)throw Error(name+" invalid level "+peak+" "+rms);metrics.push({name,peak,rms});}
fs.mkdirSync(".evidence/rift-4.0/audio",{recursive:true});fs.writeFileSync(".evidence/rift-4.0/audio/report.json",JSON.stringify({version:"4.0.0",sources:metadata,metrics},null,2)+"\n");console.log(JSON.stringify({samples:manifest.files.length,totalBytes:manifest.totalBytes,metrics},null,2));
