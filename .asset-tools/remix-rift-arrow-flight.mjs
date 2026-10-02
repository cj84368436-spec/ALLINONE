import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {execFileSync as exec} from "node:child_process";
const out="games/rift-survivors/public/audio",root="/tmp/rift-arrow-flight";fs.mkdirSync(root,{recursive:true});
const source={url:"https://opengameart.org/sites/default/files/swishes.zip",author:"artisticdude",license:"CC0-1.0",page:"https://opengameart.org/content/swishes-sound-pack"};
const response=await fetch(source.url,{signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error("Swish source "+response.status);
const bytes=Buffer.from(await response.arrayBuffer());source.sha256=crypto.createHash("sha256").update(bytes).digest("hex");
fs.writeFileSync(root+"/swishes.zip",bytes);exec("unzip",["-q","-o",root+"/swishes.zip","-d",root]);
const find=(name)=>root+"/swishes/"+name;
const file=out+"/arrow-flight.mp3";
exec("ffmpeg",["-v","error","-y","-i",find("swish-2.wav"),"-i",find("swish-12.wav"),"-filter_complex",
"[0:a]aresample=44100,asetrate=35280,aresample=44100,highpass=f=750,lowpass=f=10000,volume=0.85[a];[1:a]aresample=44100,asetrate=48510,aresample=44100,highpass=f=1900,lowpass=f=11500,volume=0.22,adelay=45[b];[a][b]amix=inputs=2:duration=longest:normalize=0,apad,loudnorm=I=-18:TP=-3:LRA=5,alimiter=limit=.88:level=false,afade=t=in:d=.018,afade=t=out:st=.29:d=.16[mix]","-map","[mix]","-t",".45","-ar","44100","-ac","1","-c:a","libmp3lame","-b:a","160k",file]);
const decoded=exec("ffmpeg",["-v","error","-i",file,"-f","s16le","-ac","1","-ar","22050","pipe:1"]);let peak=0,energy=0;for(let i=0;i<decoded.length;i+=2){const v=decoded.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(v));energy+=v*v;}
const buffer=fs.readFileSync(file),item={name:"arrow-flight.mp3",bytes:buffer.length,duration:Number(exec("ffprobe",["-v","error","-show_entries","format=duration","-of","csv=p=0",file]).toString()),sha256:crypto.createHash("sha256").update(buffer).digest("hex")};
const metrics={peak,rms:Math.sqrt(energy/(decoded.length/2))};if(peak>=.99||metrics.rms<.008||item.duration<.35)throw Error("Invalid flight waveform "+JSON.stringify(metrics));
const manifest=JSON.parse(fs.readFileSync(out+"/manifest.json"));manifest.version="3.1.0";manifest.files=manifest.files.filter(x=>x.name!==item.name).concat(item);manifest.totalBytes=manifest.files.reduce((s,x)=>s+x.bytes,0);manifest.rangedMix="Separate quiet bow release, recorded aerodynamic flight whoosh and quieter target contact. Flight uses uncut CC0 swish-2/sw ish-12 Foley with airy EQ, pitch layers and 160 ms tail; no oscillator or synthesized noise.".replace("sw ish","swish");fs.writeFileSync(out+"/manifest.json",JSON.stringify(manifest,null,2)+"\n");
const index=JSON.parse(fs.readFileSync(out+"/source-index.json"));index.arrowFlight={version:"3.1.0",source,inputs:["swish-2.wav","swish-12.wav"],edits:"Air-only recorded Foley: high pass 750/1900 Hz, pitch layers, 45 ms offset, normalization, 18 ms attack and 160 ms tail."};fs.writeFileSync(out+"/source-index.json",JSON.stringify(index,null,2)+"\n");
fs.appendFileSync(out+"/CREDITS.txt","\nRift Keepers 3.1 arrow flight: swish-2.wav / swish-12.wav by artisticdude, CC0 1.0. https://opengameart.org/content/swishes-sound-pack\nEdits: layered recorded air swishes, high-pass EQ, pitch, delay, normalization and fades. Flight has a separate sample from bow release and target contact.\n");
fs.mkdirSync(".evidence/rift-3.1/audio",{recursive:true});fs.writeFileSync(".evidence/rift-3.1/audio/report.json",JSON.stringify({source,item,metrics},null,2)+"\n");console.log(JSON.stringify({item,metrics},null,2));
