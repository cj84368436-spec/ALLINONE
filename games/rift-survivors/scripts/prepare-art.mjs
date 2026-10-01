import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const directory="public/art";fs.mkdirSync(directory,{recursive:true});
const sheet="art-source/characters.png",meta=await sharp(sheet).metadata();
const rects=[
["knight-idle",[0,0,313,418],256],["knight-walk-a",[313,0,314,418],256],["knight-walk-b",[627,0,313,418],256],["knight-attack",[940,0,314,418],256],
["ranger",[0,418,327,409],256],["mage",[327,414,309,414],256],["shade",[636,531,253,270],168],["bat",[884,454,370,326],160],
["brute",[0,827,346,427],240],["seer",[348,830,277,424],184],["boss",[627,791,423,463],320],["ruin",[1049,834,205,420],256]
];const manifest={version:"1.3.0",kind:"original AI-assisted painted 2D production assets",source:{width:meta.width,height:meta.height},files:[]};
for(const [name,rect,height] of rects){if(["bat","boss"].includes(name)&&fs.existsSync("art-source/enemies.png"))continue;const [x,y,w,h]=rect.map((v,i)=>Math.round(v/1254*(i%2?meta.height:meta.width)));
const file=path.join(directory,name+".webp");await sharp(sheet).extract({left:x,top:y,width:Math.min(w,meta.width-x),height:Math.min(h,meta.height-y)}).resize({height,withoutEnlargement:true}).webp({quality:86,alphaQuality:100,effort:6}).toFile(file);manifest.files.push({name:name+".webp",bytes:fs.statSync(file).size});}
if(fs.existsSync("art-source/enemies.png")){const file="art-source/enemies.png",m=await sharp(file).metadata();for(const [name,left,width,height]of [["bat",0,.57,160],["boss",.575,.425,320]]){const x=Math.round(m.width*left),w=Math.min(m.width-x,Math.round(m.width*width)),target=path.join(directory,name+".webp");const cropped=await sharp(file).extract({left:x,top:0,width:w,height:m.height}).png().toBuffer();await sharp(cropped).trim({threshold:10}).resize({height}).webp({quality:86,alphaQuality:100,effort:6}).toFile(target);manifest.files.push({name:name+".webp",bytes:fs.statSync(target).size});}}
const ground=path.join(directory,"forest.webp");await sharp("art-source/forest.png").resize(768,768,{fit:"fill"}).webp({quality:85,effort:6}).toFile(ground);manifest.files.push({name:"forest.webp",bytes:fs.statSync(ground).size});
for(const [name,height]of [["gold-slash",512],["grove",640]]){const target=path.join(directory,name+".webp");await sharp("art-source/"+name+".png").resize({height,withoutEnlargement:true}).webp({quality:90,alphaQuality:100,effort:6}).toFile(target);manifest.files.push({name:name+".webp",bytes:fs.statSync(target).size});}
const iconSheet="art-source/skill-icons.png",iconMeta=await sharp(iconSheet).metadata(),iconNames=["blade","arrow","bolt","orbit","lightning","frost"];
for(let i=0;i<iconNames.length;i++){const left=Math.round((i%3)*iconMeta.width/3+.04*iconMeta.width/3),top=Math.round(Math.floor(i/3)*iconMeta.height/2+.04*iconMeta.height/2),width=Math.floor(iconMeta.width/3*.92),height=Math.floor(iconMeta.height/2*.92),target=path.join(directory,"icon-"+iconNames[i]+".webp");await sharp(iconSheet).extract({left,top,width:Math.min(width,iconMeta.width-left),height:Math.min(height,iconMeta.height-top)}).resize(128,128,{fit:"fill"}).webp({quality:91,effort:6}).toFile(target);manifest.files.push({name:"icon-"+iconNames[i]+".webp",bytes:fs.statSync(target).size});}
const cssResponse=await fetch("https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&text="+encodeURIComponent("균열의수호자"),{headers:{"User-Agent":"Mozilla/5.0"},signal:AbortSignal.timeout(20000)});if(!cssResponse.ok)throw new Error("Title font CSS unavailable");const css=await cssResponse.text(),fontUrl=css.match(/url\(([^)]+)\)/)?.[1];if(!fontUrl?.startsWith("https://fonts.gstatic.com/"))throw new Error("Invalid title font URL");
const fontResponse=await fetch(fontUrl,{signal:AbortSignal.timeout(20000)});if(!fontResponse.ok)throw new Error("Title font unavailable");fs.writeFileSync(path.join(directory,"title.woff2"),Buffer.from(await fontResponse.arrayBuffer()));
const license=await fetch("https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifkr/OFL.txt");if(!license.ok)throw new Error("Title font license unavailable");fs.writeFileSync(path.join(directory,"title-OFL.txt"),await license.text());
for(const name of ["title.woff2","title-OFL.txt"])manifest.files.push({name,bytes:fs.statSync(path.join(directory,name)).size});

manifest.totalBytes=manifest.files.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync(path.join(directory,"manifest.json"),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
