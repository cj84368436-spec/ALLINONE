const names=["spell-falcon","spell-dragon","skill-campaign","guard","hound","bomber","wisp","healer","sniper","frostling","boss-1","boss-2","boss-3","boss-4","boss-5","skill-extra","combat-v4","skill-atlas","combat-atlas","courtyard","knight-idle","knight-walk-a","knight-walk-b","knight-attack","ranger","mage","shade","bat","brute","seer","boss","ruin","forest","gold-slash","grove","icon-blade","icon-arrow","icon-bolt","icon-orbit","icon-lightning","icon-frost",...Array.from({length:8},(_,i)=>"knight-strike-"+i),...["ranger","mage"].flatMap(h=>[...Array.from({length:8},(_,i)=>h+"-attack-"+i),...Array.from({length:4},(_,i)=>h+"-walk-"+i)])];
function url(name){return new URL("art/"+name+".webp",document.baseURI).href;}
function texture(image){
const pad=4,w=image.naturalWidth+pad*2,h=image.naturalHeight+pad*2;
const mask=document.createElement("canvas");mask.width=w;mask.height=h;const m=mask.getContext("2d");m.drawImage(image,pad,pad);m.globalCompositeOperation="source-in";m.fillStyle="#fff6d4";m.fillRect(0,0,w,h);
const edge=document.createElement("canvas");edge.width=w;edge.height=h;const e=edge.getContext("2d");for(const [x,y]of [[-2,0],[2,0],[0,-2],[0,2]])e.drawImage(mask,x,y);e.globalCompositeOperation="source-in";e.fillStyle="#031512";e.fillRect(0,0,w,h);e.globalCompositeOperation="source-over";e.drawImage(image,pad,pad);
return {image:edge,flash:mask,width:w,height:h};
}
function combatFrames(image){const out=new Map(),size=image.naturalWidth/6-10;for(let row=0;row<6;row++)for(let col=0;col<6;col++){const canvas=document.createElement("canvas");canvas.width=canvas.height=size;const c=canvas.getContext("2d");c.drawImage(image,col*(size+10)+5,row*(size+10)+5,size,size,0,0,size,size);c.globalCompositeOperation="destination-in";for(const vertical of [false,true]){const gradient=c.createLinearGradient(0,0,vertical?0:size,vertical?size:0);gradient.addColorStop(0,"#fff0");gradient.addColorStop(.13,"#fff");gradient.addColorStop(.87,"#fff");gradient.addColorStop(1,"#fff0");c.fillStyle=gradient;c.fillRect(0,0,size,size);}out.set(col+","+row,canvas);}return out;}
export const Art={
version:"5.0.0",ready:false,promise:null,images:new Map(),sprites:new Map(),frames:new Map(),materialFrames:new Map(),urls:Object.fromEntries(names.map(n=>[n,url(n)])),
load(){
if(this.ready)return Promise.resolve();if(this.promise)return this.promise;
this.promise=Promise.all(names.map(name=>{if(this.images.has(name))return Promise.resolve();return new Promise((resolve,reject)=>{
const img=new Image(),timer=setTimeout(()=>fail(),20000);
function fail(){clearTimeout(timer);img.onload=img.onerror=null;reject(new Error("Artwork unavailable: "+name));}
img.onload=()=>{clearTimeout(timer);this.images.set(name,img);if(name==="combat-atlas")this.frames=combatFrames(img);if(name==="combat-v4")this.materialFrames=materialFrames(img);if(!["skill-campaign","forest","courtyard","skill-atlas","combat-atlas","skill-extra","combat-v4"].includes(name))this.sprites.set(name,texture(img));resolve();};img.onerror=fail;img.src=this.urls[name];
});})).then(async()=>{if("FontFace"in window){try{const font=new FontFace("RiftTitle",'url("'+new URL("art/title.woff2",document.baseURI).href+'")',{weight:"700"});await font.load();document.fonts.add(font);}catch{}}this.ready=true;}).catch(error=>{this.promise=null;throw error;});return this.promise;
},
sprite(name){return this.sprites.get(name);}
};
export function drawSprite(c,name,x,y,height,face=1,flash=0,tilt=0){
const sprite=Art.sprite(name);if(!sprite)return false;const width=height*sprite.width/sprite.height;
c.save();c.translate(x,y);c.scale(face,1);c.rotate(tilt);const foot=height*.26;c.drawImage(sprite.image,-width/2,foot-height,width,height);
if(flash>0){c.globalAlpha*=Math.min(.42,flash);c.drawImage(sprite.flash,-width/2,foot-height,width,height);}c.restore();return true;
}

export const SKILL_ART_ROWS=[[5,210],[226,202],[442,207],[662,205],[884,254]];
export const SKILL_ART_KEYS=["blade","whirlwind","cleave","slam","rend","orbit","arrow","multishot","piercing","poison","trap","volley","bolt","fireball","lightning","frost","meteor","nova","power","haste","boots","heart","magnet","crit","leech","focus","ultimate-knight","ultimate-ranger","ultimate-mage","heal"];
export function drawAtlas(c,name,col,row,x,y,width,height=width,rotation=0,alpha=1){const img=Art.images.get(name);if(!img)return false;const cols=6,rows=name==="skill-atlas"?5:6,sw=img.naturalWidth/cols,sh=img.naturalHeight/rows;c.save();c.translate(x,y);c.rotate(rotation);c.globalAlpha*=alpha;const frame=name==="combat-atlas"?Art.frames.get(col+","+row):null;if(frame)c.drawImage(frame,-width/2,-height/2,width,height);else{const pad=name==="combat-atlas"?5:0;c.drawImage(img,col*sw+pad,row*sh+pad,sw-pad*2,sh-pad*2,-width/2,-height/2,width,height);}c.restore();return true;}

function materialFrames(image){const out=new Map(),sw=image.naturalWidth/6,sh=image.naturalHeight/6;for(let row=0;row<6;row++)for(let col=0;col<6;col++){const canvas=document.createElement("canvas");canvas.width=canvas.height=256;const c=canvas.getContext("2d");c.drawImage(image,col*sw,row*sh,sw,sh,0,0,256,256);c.globalCompositeOperation="destination-in";for(const vertical of [false,true]){const gradient=c.createLinearGradient(0,0,vertical?0:256,vertical?256:0);gradient.addColorStop(0,"#fff0");gradient.addColorStop(.10,"#fff");gradient.addColorStop(.90,"#fff");gradient.addColorStop(1,"#fff0");c.fillStyle=gradient;c.fillRect(0,0,256,256);}out.set(col+","+row,canvas);}return out;}
export const EXTRA_SKILL_KEYS=["hammer","fissure","ricochet","glaive","beam","pyre"];
export function drawMaterial(c,row,col,x,y,width,height=width,rotation=0,alpha=1){const frame=Art.materialFrames.get(Math.max(0,Math.min(5,col))+","+row);if(!frame)return false;c.save();c.translate(x,y);c.rotate(rotation);c.globalAlpha*=alpha;c.drawImage(frame,-width/2,-height/2,width,height);c.restore();return true;}
