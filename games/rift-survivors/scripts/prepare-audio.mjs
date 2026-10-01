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
fs.mkdirSync("public/audio",{recursive:true});fs.writeFileSync("public/audio/source-index.json",JSON.stringify(index,null,2));console.log(JSON.stringify(index,null,2));
