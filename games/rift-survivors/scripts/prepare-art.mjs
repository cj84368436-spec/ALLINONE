import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const directory="public/art";fs.mkdirSync(directory,{recursive:true});
const sheet="art-source/characters.png",meta=await sharp(sheet).metadata();
const rects=[
["knight-idle",[0,0,313,418],256],["knight-walk-a",[313,0,314,418],256],["knight-walk-b",[627,0,313,418],256],["knight-attack",[940,0,314,418],256],
["ranger",[0,418,327,409],256],["mage",[327,414,309,414],256],["shade",[636,531,253,270],168],["bat",[884,454,370,326],160],
["brute",[0,827,346,427],240],["seer",[348,830,277,424],184],["boss",[627,791,423,463],320],["ruin",[1049,834,205,420],256]
];const manifest={version:"1.5.0",kind:"original AI-assisted painted 2D production assets",source:{width:meta.width,height:meta.height},files:[]};
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


if(fs.existsSync("art-source/knight-strike.png")){
const {data,info}=await sharp("art-source/knight-strike.png").ensureAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height,labels=new Int32Array(w*h),queue=new Int32Array(w*h),parts=[];let id=0;
for(let start=0;start<w*h;start++){if(labels[start]||data[start*4+3]<24)continue;id++;let head=0,tail=0,minX=w,minY=h,maxX=0,maxY=0,sumX=0,sumY=0;queue[tail++]=start;labels[start]=id;
while(head<tail){const p=queue[head++],x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);sumX+=x;sumY+=y;
for(const q of [x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1])if(q>=0&&!labels[q]&&data[q*4+3]>=24){labels[q]=id;queue[tail++]=q;}}
if(tail>2500)parts.push({id,count:tail,minX,minY,maxX,maxY,cx:sumX/tail,cy:sumY/tail});}
const poses=parts.sort((a,b)=>b.count-a.count).slice(0,8).sort((a,b)=>(a.cy<h/2?0:1)-(b.cy<h/2?0:1)||a.cx-b.cx);if(poses.length!==8)throw new Error("Expected 8 isolated knight frames; got "+poses.length);
const scale=Math.min(.5,...poses.map(p=>Math.min(336/(p.maxX-p.minX+1),238/(p.maxY-p.minY+1))));
for(let i=0;i<8;i++){const p=poses[i],bw=p.maxX-p.minX+1,bh=p.maxY-p.minY+1,pixels=Buffer.alloc(bw*bh*4);let footMin=w,footMax=0;
for(let y=p.minY;y<=p.maxY;y++)for(let x=p.minX;x<=p.maxX;x++){const source=y*w+x;if(labels[source]!==p.id)continue;data.copy(pixels,((y-p.minY)*bw+x-p.minX)*4,source*4,source*4+4);if(y>p.maxY-30){footMin=Math.min(footMin,x);footMax=Math.max(footMax,x);}}
const sw=Math.max(1,Math.round(bw*scale)),sh=Math.max(1,Math.round(bh*scale)),foot=(footMin+footMax)/2-p.minX,frame=await sharp(pixels,{raw:{width:bw,height:bh,channels:4}}).resize(sw,sh).png().toBuffer();
const target=path.join(directory,"knight-strike-"+i+".webp");await sharp({create:{width:352,height:288,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:frame,left:Math.max(0,Math.min(352-sw,Math.round(176-foot*scale))),top:252-sh}]).webp({quality:92,alphaQuality:100,effort:6}).toFile(target);manifest.files.push({name:"knight-strike-"+i+".webp",bytes:fs.statSync(target).size});}
manifest.knightAnimation={frames:8,width:352,height:288,root:{x:176,y:252},sourceScale:scale};console.log("Knight extraction",JSON.stringify(poses));
}

if(fs.existsSync(directory+"/manifest.json")){const previous=JSON.parse(fs.readFileSync(directory+"/manifest.json","utf8"));for(const item of previous.files)if(/^(ranger|mage)-(attack|walk)-/.test(item.name)&&fs.existsSync(path.join(directory,item.name)))manifest.files.push({name:item.name,bytes:fs.statSync(path.join(directory,item.name)).size});if(previous.rangedAnimation)manifest.rangedAnimation=previous.rangedAnimation;}
manifest.totalBytes=manifest.files.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync(path.join(directory,"manifest.json"),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
