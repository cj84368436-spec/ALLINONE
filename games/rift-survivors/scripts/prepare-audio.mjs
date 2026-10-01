import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {execFileSync} from "node:child_process";
const sources=[
{name:"swishes",url:"https://opengameart.org/sites/default/files/swishes.zip",author:"artisticdude",license:"CC0-1.0",page:"https://opengameart.org/content/swishes-sound-pack"},
{name:"rpg",url:"https://kenney.nl/media/pages/assets/rpg-audio/8e99002d76-1677590336/kenney_rpg-audio.zip",author:"Kenney",license:"CC0-1.0",page:"https://kenney.nl/assets/rpg-audio"},
{name:"fantasy",url:"https://opengameart.org/sites/default/files/Fantasy%20Sound%20Library.zip",author:"Little Robot Sound Factory",license:"CC-BY-3.0",page:"https://opengameart.org/content/fantasy-sound-effects-library"}
];const root="/tmp/rift-sound-source";fs.mkdirSync(root,{recursive:true});const index={version:"1.3.0",sources:[]};
function list(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const source of sources){const response=await fetch(source.url,{signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error(source.name+" "+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes[0]!==80||bytes[1]!==75)throw new Error("Invalid ZIP "+source.name);const archive=path.join(root,source.name+".zip"),folder=path.join(root,source.name);fs.writeFileSync(archive,bytes);fs.mkdirSync(folder,{recursive:true});execFileSync("unzip",["-q","-o",archive,"-d",folder]);const files=list(folder).filter(f=>/\.(wav|ogg|mp3)$/i.test(f)).map(f=>({path:path.relative(folder,f),bytes:fs.statSync(f).size}));index.sources.push({...source,sha256:crypto.createHash("sha256").update(bytes).digest("hex"),files});}
fs.mkdirSync("public/audio",{recursive:true});fs.writeFileSync("public/audio/source-index.json",JSON.stringify(index,null,2));console.log("Licensed source packs indexed");

const output="public/audio",manifest={version:"1.3.0",files:[],sources:sources.map(({name,author,license,page})=>({name,author,license,page}))};
function source(group,filename){const s=index.sources.find(x=>x.name===group),item=s.files.find(f=>!f.path.startsWith("__MACOSX")&&path.basename(f.path)===filename);if(!item)throw new Error("Missing audio "+filename);return path.join(root,group,item.path);}
function convert(name,inputs,maxDuration,filters=""){
const args=["-hide_banner","-loglevel","error","-y"];for(const input of inputs)args.push("-i",input);
const cleanup="highpass=f=65,lowpass=f=8500,alimiter=limit=0.85:level=false,afade=t=in:d=0.012,afade=t=out:st="+Math.max(.02,maxDuration-.065)+":d=0.065";
let chain;if(inputs.length>1){chain="[0:a]volume=0.82[a];[1:a]volume=0.30[b];[a][b]amix=inputs=2:duration=longest:normalize=0,"+cleanup+(filters?","+filters:"")+"[out]";args.push("-filter_complex",chain,"-map","[out]");}else args.push("-af",cleanup+(filters?","+filters:""));
const file=path.join(output,name+".mp3");args.push("-t",String(maxDuration),"-ac","1","-ar","44100","-c:a","libmp3lame","-b:a","128k",file);execFileSync("ffmpeg",args);
const metadata=JSON.parse(execFileSync("ffprobe",["-v","quiet","-show_format","-of","json",file],{encoding:"utf8"}));manifest.files.push({name:name+".mp3",bytes:fs.statSync(file).size,duration:Number(metadata.format.duration),sha256:crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")});
}
for(const [name,n]of [["swish-a",7],["swish-b",8],["swish-c",9]])convert(name,[source("swishes","swish-"+n+".wav")],.56,"loudnorm=I=-20:TP=-6:LRA=5");
convert("blade-hit-a",[source("rpg","chop.ogg"),source("rpg","knifeSlice.ogg")],.42,"lowpass=f=4400,loudnorm=I=-22:TP=-6:LRA=5");
convert("blade-hit-b",[source("rpg","chop.ogg"),source("rpg","cloth2.ogg")],.46,"lowpass=f=3800,loudnorm=I=-22:TP=-6:LRA=5");
convert("arrow",[source("swishes","swish-2.wav")],.40,"loudnorm=I=-23:TP=-7:LRA=5");
for(const [name,input,duration]of [["magic","Spell_00.wav",1.25],["frost","Spell_01.wav",1.25],["thunder","Spell_02.wav",1.55],["ultimate","Spell_03.wav",2.3],["reward","Jingle_Achievement_00.wav",3.8],["select","Menu_Select_00.wav",.26],["boss","Dragon_Growl_01.wav",2.5]])convert(name,[source("fantasy",input)],duration,"loudnorm=I=-23:TP=-7:LRA=5");
convert("hurt",[source("rpg","chop.ogg"),source("rpg","cloth1.ogg")],.50,"lowpass=f=2200,loudnorm=I=-23:TP=-7:LRA=5");
convert("ambience",[source("fantasy","Ambience_Cave_00.wav")],30,"lowpass=f=1900,afade=t=in:d=1.2,afade=t=out:st=28.8:d=1.2,volume=0.55");
manifest.totalBytes=manifest.files.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync(path.join(output,"manifest.json"),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(output,"CREDITS.txt"),"Recorded sword swishes by artisticdude, CC0 1.0: https://opengameart.org/content/swishes-sound-pack\nRPG Audio by Kenney, CC0 1.0: https://kenney.nl/assets/rpg-audio\nFantasy Sound Effects Library by Little Robot Sound Factory, CC BY 3.0: https://opengameart.org/content/fantasy-sound-effects-library ; https://littlerobotsoundfactory.com ; https://creativecommons.org/licenses/by/3.0/\nModified: selected, mixed, equalized, normalized, faded and encoded for Rift Keepers.\n");
fs.mkdirSync("../../.evidence/rift-1.3",{recursive:true});
execFileSync("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",path.join(output,"swish-a.mp3"),"-i",path.join(output,"blade-hit-a.mp3"),"-filter_complex","[0:a]apad=pad_dur=1.1,volume=0.7[a];[1:a]adelay=65,volume=0.65[b];[a][b]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.8:level=false[out]","-map","[out]","-t","1.4","-ar","22050","-ac","1","../../.evidence/rift-1.3/sword-demo.wav"]);
console.log("Prepared recorded audio",JSON.stringify(manifest,null,2));
