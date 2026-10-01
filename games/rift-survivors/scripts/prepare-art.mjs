import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const directory="public/art";fs.mkdirSync(directory,{recursive:true});
const sheet="art-source/characters.png",meta=await sharp(sheet).metadata();
const rects=[
["knight-idle",[0,0,313,418],256],["knight-walk-a",[313,0,314,418],256],["knight-walk-b",[627,0,313,418],256],["knight-attack",[940,0,314,418],256],
["ranger",[0,418,327,409],256],["mage",[327,414,309,414],256],["shade",[636,531,253,270],168],["bat",[884,454,370,326],160],
["brute",[0,827,346,427],240],["seer",[348,830,277,424],184],["boss",[627,791,423,463],320],["ruin",[1049,834,205,420],256]
];const manifest={version:"1.2.0",kind:"original AI-assisted painted 2D production assets",source:{width:meta.width,height:meta.height},files:[]};
for(const [name,rect,height] of rects){if(["bat","boss"].includes(name)&&fs.existsSync("art-source/enemies.png"))continue;const [x,y,w,h]=rect.map((v,i)=>Math.round(v/1254*(i%2?meta.height:meta.width)));
const file=path.join(directory,name+".webp");await sharp(sheet).extract({left:x,top:y,width:Math.min(w,meta.width-x),height:Math.min(h,meta.height-y)}).resize({height,withoutEnlargement:true}).webp({quality:86,alphaQuality:100,effort:6}).toFile(file);manifest.files.push({name:name+".webp",bytes:fs.statSync(file).size});}
if(fs.existsSync("art-source/enemies.png")){const file="art-source/enemies.png",m=await sharp(file).metadata();for(const [name,left,width,height]of [["bat",0,.57,160],["boss",.575,.425,320]]){const x=Math.round(m.width*left),w=Math.min(m.width-x,Math.round(m.width*width)),target=path.join(directory,name+".webp");await sharp(file).extract({left:x,top:0,width:w,height:m.height}).trim({threshold:10}).resize({height}).webp({quality:86,alphaQuality:100,effort:6}).toFile(target);manifest.files.push({name:name+".webp",bytes:fs.statSync(target).size});}}
const ground=path.join(directory,"forest.webp");await sharp("art-source/forest.png").resize(768,768,{fit:"fill"}).webp({quality:85,effort:6}).toFile(ground);manifest.files.push({name:"forest.webp",bytes:fs.statSync(ground).size});manifest.totalBytes=manifest.files.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync(path.join(directory,"manifest.json"),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
