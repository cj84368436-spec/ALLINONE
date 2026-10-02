const names=["courtyard","knight-idle","knight-walk-a","knight-walk-b","knight-attack","ranger","mage","shade","bat","brute","seer","boss","ruin","forest","gold-slash","grove","icon-blade","icon-arrow","icon-bolt","icon-orbit","icon-lightning","icon-frost",...Array.from({length:8},(_,i)=>"knight-strike-"+i),...["ranger","mage"].flatMap(h=>[...Array.from({length:8},(_,i)=>h+"-attack-"+i),...Array.from({length:4},(_,i)=>h+"-walk-"+i)])];
function url(name){return new URL("art/"+name+".webp",document.baseURI).href;}
function texture(image){
const pad=4,w=image.naturalWidth+pad*2,h=image.naturalHeight+pad*2;
const mask=document.createElement("canvas");mask.width=w;mask.height=h;const m=mask.getContext("2d");m.drawImage(image,pad,pad);m.globalCompositeOperation="source-in";m.fillStyle="#fff6d4";m.fillRect(0,0,w,h);
const edge=document.createElement("canvas");edge.width=w;edge.height=h;const e=edge.getContext("2d");for(const [x,y]of [[-2,0],[2,0],[0,-2],[0,2]])e.drawImage(mask,x,y);e.globalCompositeOperation="source-in";e.fillStyle="#031512";e.fillRect(0,0,w,h);e.globalCompositeOperation="source-over";e.drawImage(image,pad,pad);
return {image:edge,flash:mask,width:w,height:h};
}
export const Art={
version:"2.0.0",ready:false,promise:null,images:new Map(),sprites:new Map(),urls:Object.fromEntries(names.map(n=>[n,url(n)])),
load(){
if(this.ready)return Promise.resolve();if(this.promise)return this.promise;
this.promise=Promise.all(names.map(name=>{if(this.images.has(name))return Promise.resolve();return new Promise((resolve,reject)=>{
const img=new Image(),timer=setTimeout(()=>fail(),20000);
function fail(){clearTimeout(timer);img.onload=img.onerror=null;reject(new Error("Artwork unavailable: "+name));}
img.onload=()=>{clearTimeout(timer);this.images.set(name,img);if(name!=="forest"&&name!=="courtyard")this.sprites.set(name,texture(img));resolve();};img.onerror=fail;img.src=this.urls[name];
});})).then(async()=>{if("FontFace"in window){try{const font=new FontFace("RiftTitle",'url("'+new URL("art/title.woff2",document.baseURI).href+'")',{weight:"700"});await font.load();document.fonts.add(font);}catch{}}this.ready=true;}).catch(error=>{this.promise=null;throw error;});return this.promise;
},
sprite(name){return this.sprites.get(name);}
};
export function drawSprite(c,name,x,y,height,face=1,flash=0,tilt=0){
const sprite=Art.sprite(name);if(!sprite)return false;const width=height*sprite.width/sprite.height;
c.save();c.translate(x,y);c.scale(face,1);c.rotate(tilt);const foot=height*.26;c.drawImage(sprite.image,-width/2,foot-height,width,height);
if(flash>0){c.globalAlpha*=Math.min(.42,flash);c.drawImage(sprite.flash,-width/2,foot-height,width,height);}c.restore();return true;
}
