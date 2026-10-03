import fs from "node:fs";import path from "node:path";import sharp from "/tmp/rift-v5-assets/node_modules/sharp/lib/index.js";
const root="games/rift-survivors",source=root+"/.asset-tools/v5/enemies.png",meta=await sharp(source).metadata();
const names=["guard","hound","bomber","wisp","healer","sniper","frostling","boss-2","boss-3","boss-4","boss-5","boss-1"];
fs.mkdirSync(root+"/public/art",{recursive:true});
const records=[];for(let i=0;i<12;i++){const left=Math.round(i%3*meta.width/3),top=Math.round(Math.floor(i/3)*meta.height/4),right=Math.round((i%3+1)*meta.width/3),bottom=Math.round((Math.floor(i/3)+1)*meta.height/4);
const cell=await sharp(source).extract({left,top,width:right-left,height:bottom-top}).trim({threshold:8}).resize({width:264,height:220,fit:"inside"}).png().toBuffer();const size=await sharp(cell).metadata();
const out=await sharp({create:{width:288,height:300,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:cell,left:Math.round((288-size.width)/2),top:226-size.height}]).webp({quality:91,alphaQuality:100,effort:6}).toBuffer();fs.writeFileSync(root+"/public/art/"+names[i]+".webp",out);records.push({name:names[i],bytes:out.length});}
fs.writeFileSync(root+"/public/art/campaign-manifest.json",JSON.stringify({version:"5.0.0",source:"Original sprites generated for Rift Keepers; no third-party franchise assets",sprites:records},null,2));console.log(JSON.stringify({dimensions:[meta.width,meta.height],sprites:records},null,2));
const icons=await sharp(root+"/.asset-tools/v5/icons.png").resize({width:960,height:1280,fit:"fill"}).webp({quality:91,effort:6}).toBuffer();fs.writeFileSync(root+"/public/art/skill-campaign.webp",icons);console.log("Campaign icons: "+icons.length+" bytes");
