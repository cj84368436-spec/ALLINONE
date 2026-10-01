import fs from "node:fs";import path from "node:path";import sharp from "sharp";import crypto from "node:crypto";import {execFileSync} from "node:child_process";
const directory="public/art",manifest=JSON.parse(fs.readFileSync(directory+"/manifest.json","utf8"));manifest.version="1.5.0";
manifest.files=manifest.files.filter(f=>!/^(ranger|mage)-(attack|walk)-/.test(f.name));
async function extract(sheet,count,rows,type){
const {data,info}=await sharp(sheet).ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height,labels=new Int32Array(w*h),queue=new Int32Array(w*h),parts=[];let id=0;
for(let start=0;start<w*h;start++){if(labels[start]||data[start*4+3]<24)continue;id++;let head=0,tail=0,minX=w,minY=h,maxX=0,maxY=0,sumX=0,sumY=0;queue[tail++]=start;labels[start]=id;
while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);sumX+=x;sumY+=y;
for(const q of [x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1])if(q>=0&&!labels[q]&&data[q*4+3]>=24){labels[q]=id;queue[tail++]=q;}}
if(tail>2000)parts.push({id,count:tail,minX,minY,maxX,maxY,cx:sumX/tail,cy:sumY/tail});}
const largest=parts.sort((a,b)=>b.count-a.count).slice(0,count).sort((a,b)=>a.cy-b.cy),poses=[];if(largest.length!==count)throw new Error("Expected "+count+" isolated "+type+" frames; got "+largest.length);
for(let row=0;row<rows;row++)poses.push(...largest.slice(row*4,row*4+4).sort((a,b)=>a.cx-b.cx));
const scale=Math.min(1,...poses.map(p=>Math.min(336/(p.maxX-p.minX+1),238/(p.maxY-p.minY+1))));
for(let i=0;i<count;i++){const p=poses[i],bw=p.maxX-p.minX+1,bh=p.maxY-p.minY+1,pixels=Buffer.alloc(bw*bh*4);let footMin=w,footMax=0;
for(let y=p.minY;y<=p.maxY;y++)for(let x=p.minX;x<=p.maxX;x++){const source=y*w+x;if(labels[source]!==p.id)continue;data.copy(pixels,((y-p.minY)*bw+x-p.minX)*4,source*4,source*4+4);if(y>p.maxY-Math.max(12,bh*.07)){footMin=Math.min(footMin,x);footMax=Math.max(footMax,x);}}
const sw=Math.max(1,Math.round(bw*scale)),sh=Math.max(1,Math.round(bh*scale)),foot=(footMin+footMax)/2-p.minX,frame=await sharp(pixels,{raw:{width:bw,height:bh,channels:4}}).resize(sw,sh).png().toBuffer();
const hero=i<count/2?"ranger":"mage",index=i%(count/2),name=hero+"-"+type+"-"+index+".webp",target=path.join(directory,name);
await sharp({create:{width:352,height:288,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:frame,left:Math.max(0,Math.min(352-sw,Math.round(176-foot*scale))),top:252-sh}]).webp({quality:92,alphaQuality:100,effort:6}).toFile(target);
manifest.files.push({name,bytes:fs.statSync(target).size});}
console.log(type+" extraction",JSON.stringify({scale,poses}));return scale;
}
const attackScale=await extract("art-source/ranged-attacks.png",16,4,"attack"),walkScale=await extract("art-source/ranged-walk.png",8,2,"walk");
manifest.rangedAnimation={heroes:["ranger","mage"],attackFrames:8,walkFrames:4,width:352,height:288,root:{x:176,y:252},attackScale,walkScale};
manifest.totalBytes=manifest.files.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync(directory+"/manifest.json",JSON.stringify(manifest,null,2));

const root="/tmp/rift-ranged-source";fs.mkdirSync(root,{recursive:true});const response=await fetch("https://kenney.nl/media/pages/assets/rpg-audio/8e99002d76-1677590336/kenney_rpg-audio.zip",{signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error("Recorded Foley unavailable");const archive=path.join(root,"source.zip");fs.writeFileSync(archive,Buffer.from(await response.arrayBuffer()));execFileSync("unzip",["-q","-o",archive,"-d",root]);
function find(dir,name){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){const found=find(p,name);if(found)return found;}else if(e.name===name)return p;}throw new Error("Missing Foley "+name);}
function mix(name,inputs,chain,duration){const args=["-hide_banner","-loglevel","error","-y"];for(const input of inputs)args.push("-i",input);args.push("-filter_complex",chain,"-map","[out]","-t",String(duration),"-ac","1","-ar","44100","-c:a","libmp3lame","-b:a","128k","public/audio/"+name+".mp3");execFileSync("ffmpeg",args);}
mix("arrow-release",["public/audio/swish-c.mp3",find(root,"creak2.ogg")],"[0:a]highpass=f=200,lowpass=f=6200,volume=0.7[a];[1:a]atrim=duration=0.13,asetrate=52920,aresample=44100,highpass=f=320,lowpass=f=3400,volume=0.18[b];[a][b]amix=inputs=2:duration=longest:normalize=0,afade=t=in:d=0.012,afade=t=out:st=0.16:d=0.10,loudnorm=I=-22:TP=-7:LRA=5[out]",.26);
mix("arrow-hit",[find(root,"cloth2.ogg"),find(root,"knifeSlice2.ogg")],"[0:a]asetrate=37485,aresample=44100,lowpass=f=1700,volume=0.85[a];[1:a]highpass=f=850,lowpass=f=5000,volume=0.14[b];[a][b]amix=inputs=2:duration=longest:normalize=0,highpass=f=70,afade=t=in:d=0.009,afade=t=out:st=0.15:d=0.12,loudnorm=I=-23:TP=-7:LRA=5[out]",.27);
mix("bolt-release",["public/audio/magic.mp3"],"[0:a]atrim=start=0.02:duration=0.57,asetpts=PTS-STARTPTS,asetrate=39690,aresample=44100,highpass=f=90,lowpass=f=6800,afade=t=in:d=0.020,afade=t=out:st=0.38:d=0.18,loudnorm=I=-22:TP=-7:LRA=5[out]",.58);
mix("bolt-hit",["public/audio/frost.mp3",find(root,"knifeSlice.ogg")],"[0:a]atrim=start=0.09:duration=0.38,asetpts=PTS-STARTPTS,asetrate=52920,aresample=44100,highpass=f=450,lowpass=f=7500,volume=0.68[a];[1:a]highpass=f=1600,lowpass=f=6400,volume=0.10[b];[a][b]amix=inputs=2:duration=longest:normalize=0,afade=t=in:d=0.009,afade=t=out:st=0.20:d=0.12,loudnorm=I=-22:TP=-7:LRA=5[out]",.34);
const audio=JSON.parse(fs.readFileSync("public/audio/manifest.json","utf8"));audio.version="1.5.0";for(const name of ["arrow-release","arrow-hit","bolt-release","bolt-hit"]){const file="public/audio/"+name+".mp3",bytes=fs.readFileSync(file),item={name:name+".mp3",bytes:bytes.length,duration:Number(JSON.parse(execFileSync("ffprobe",["-v","quiet","-show_format","-of","json",file],{encoding:"utf8"})).format.duration),sha256:crypto.createHash("sha256").update(bytes).digest("hex")};audio.files=audio.files.filter(f=>f.name!==item.name);audio.files.push(item);}
audio.rangedMix="Separate release and contact mixes: recorded swish/creak for bow, cloth/knife edge for arrow contact, Fantasy Spell_00/Spell_01 for frost release and shatter. No synthesized tones or noise.";
audio.totalBytes=audio.files.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync("public/audio/manifest.json",JSON.stringify(audio,null,2));
const credits="public/audio/CREDITS.txt",note="\n1.5 ranged mixes: artisticdude swish-c derived from swish-9 (CC0); Kenney creak2, cloth2, knifeSlice/knifeSlice2 (CC0); Little Robot Sound Factory Spell_00/Spell_01 (CC BY 3.0). Edited, pitched, filtered, mixed, faded and normalized into separate arrow/bolt release and contact samples.\n";if(!fs.readFileSync(credits,"utf8").includes("1.5 ranged mixes:"))fs.appendFileSync(credits,note);
console.log("Prepared 24 hero frames and 4 ranged audio mixes",JSON.stringify({artBytes:manifest.totalBytes,audioBytes:audio.totalBytes,audioFiles:audio.files.length}));
