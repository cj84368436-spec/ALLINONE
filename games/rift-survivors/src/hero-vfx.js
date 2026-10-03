// Bespoke geometric effects. Opaque weapon/crystal faces carry the shape;
// light, trails and fog are separate layers and never blur the silhouette.
const HV_TAU=Math.PI*2;
const hvClamp=x=>Math.max(0,Math.min(1,x));
const hvRand=(i,s)=>{const n=Math.sin(i*127.1+s*31.7)*43758.5453;return n-Math.floor(n);};
const hvEase=x=>1-(1-hvClamp(x))**3;
function hvPath(c,points){c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.closePath();}
function hvFill(c,points,color){c.fillStyle=color;hvPath(c,points);c.fill();}
function hvLine(c,points,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.stroke();}
function hvGradient(c,x1,y1,x2,y2,stops){const g=c.createLinearGradient(x1,y1,x2,y2);for(const [at,color]of stops)g.addColorStop(at,color);return g;}
function hvGlint(c,x,y,size,alpha=1,cold=false){c.save();c.globalAlpha*=alpha;hvFill(c,[[x-size,y],[x-size*.15,y-size*.17],[x,y-size*.78],[x+size*.15,y-size*.17],[x+size,y],[x+size*.15,y+size*.17],[x,y+size*.78],[x-size*.15,y+size*.17]],cold?"#efffff":"#fff6d6");c.restore();}
function hvBlade(c,length,time,seed,outer=false,details=true){
 const tip=length*.59,heel=-length*.25,w=outer?8:6.4,edge=outer?"#a4cbe0":"#e6e5ca";
 c.save();c.translate(1.4,2.3);hvFill(c,[[tip,0],[tip-10,-w*.75],[heel,-w],[heel-2,w],[tip-10,w*.8]],"#05121dcc");c.restore();
 // Two steel planes, a raised central ridge, a dark fuller and a gold guard.
 hvFill(c,[[tip,0],[tip-9,-w*.88],[heel+5,-w],[heel,-w*.65],[heel,0]],hvGradient(c,heel,-w,tip,w,[[0,"#315069"],[.4,"#819aa4"],[.75,"#f4f1d3"],[1,"#a3bcc6"]]));
 hvFill(c,[[tip,0],[heel,0],[heel,w*.7],[heel+5,w],[tip-9,w*.85]],hvGradient(c,0,0,0,w,[[0,"#cbd8d5"],[.25,"#728e9a"],[1,"#28425c"]]));
 hvLine(c,[[heel+4,-w],[tip-9,-w*.88],[tip,0],[tip-9,w*.85],[heel+5,w]],edge,.85);
 hvLine(c,[[heel+4,0],[tip-2,0]],"#f1f7e9",1.05);
 hvLine(c,[[heel+7,1.5],[tip-15,1.5]],"#314e6699",.7);
 const guard=heel-2;hvFill(c,[[guard-2,-w-4],[guard+3,-w-3],[guard+5,-2],[guard+5,2],[guard+3,w+3],[guard-2,w+4],[guard,w*.4],[guard,-w*.4]],hvGradient(c,guard,-w-4,guard,w+4,[[0,"#f7d793"],[.45,"#b58d4d"],[.7,"#5a482a"],[1,"#c8a564"]]));
 hvFill(c,[[heel-13,-2.4],[heel-3,-2.4],[heel-3,2.4],[heel-13,2.4]],"#29333b");
 hvLine(c,[[heel-12,-2.4],[heel-3,-2.4]],"#bba978",.8);
 for(let i=0;i<3;i++)hvLine(c,[[heel-11+i*3,-2],[heel-12+i*3,2]],"#a5a08a",.75);
 hvFill(c,[[heel-17,0],[heel-13,-4],[heel-10,0],[heel-13,4]],"#dabd78");
 hvFill(c,[[guard+2,0],[guard-1,-2.4],[guard-4,0],[guard-1,2.4]],outer?"#b3deee":"#f3e9b1");
 if(details){for(let i=0;i<3;i++){const x=heel+10+i*8;hvLine(c,[[x,-2.4],[x+2,-1],[x,-.1]],"#d9dcc399",.65);}const phase=(time*.65+seed*.23)%1;if(phase<.30)hvGlint(c,heel+8+(tip-heel-16)*phase/.30,-w*.3,3.5,Math.sin(phase/.30*Math.PI));}
}
export function bladeBarrierLayout(g){
 const lv=g.weapons.orbit;if(!lv)return [];
 const evolved=!!g.evolved?.orbit,r=(64+lv*6+(evolved?20:0))*(1+(g.passives.focus||0)*.08),n=evolved?6:2+Math.floor(lv/2),blades=[];
 for(let i=0;i<n;i++){const angle=g.time*2.6+i*HV_TAU/n;blades.push({x:g.player.x+Math.cos(angle)*r,y:g.player.y+Math.sin(angle)*r,angle,radius:r,index:i,outer:false,speed:2.6});}
 if(lv>=5)for(let i=0;i<2;i++){const angle=-g.time*2+i*Math.PI;blades.push({x:g.player.x+Math.cos(angle)*(r+30),y:g.player.y+Math.sin(angle)*(r+30),angle,radius:r+30,index:i+n,outer:true,speed:-2});}
 return blades;
}
function hvOrbitTrail(c,p,b,time,reduced){
 const length=reduced?.23:.51,points=[],inner=[];
 for(let i=0;i<=14;i++){const q=i/14,a=b.angle-Math.sign(b.speed)*length*(1-q),width=(1.1+q*2.8)*Math.sin(q*Math.PI*.5),rad=b.radius;points.push([p.x+Math.cos(a)*(rad+width),p.y+Math.sin(a)*(rad+width)]);inner.push([p.x+Math.cos(a)*(rad-width),p.y+Math.sin(a)*(rad-width)]);}
 hvFill(c,[...points,...inner.reverse()],b.outer?"#6eadd343":"#d1b47c43");
 const end=b.angle-Math.sign(b.speed)*length*.62;hvLine(c,Array.from({length:11},(_,i)=>{const a=end+(b.angle-end)*i/10;return [p.x+Math.cos(a)*b.radius,p.y+Math.sin(a)*b.radius];}),b.outer?"#b4d7e49c":"#fff0c19c",.8);
}
export function drawBladeBarrier(r,g,layer="all"){
 if(!g.weapons.orbit)return;const c=r.ctx,p=g.player,blades=bladeBarrierLayout(g),reduced=r.reduced||r.quality<.8;
 c.save();c.globalAlpha=1;
 if(layer!=="front"){for(const b of blades){c.save();c.globalAlpha=.25;c.fillStyle="#020b16";c.beginPath();c.ellipse(b.x,b.y+6,12,4,b.angle,0,HV_TAU);c.fill();c.restore();}}
 for(const b of blades){const back=b.y<p.y-8;if(layer==="back"&&!back||layer==="front"&&back)continue;hvOrbitTrail(c,p,b,g.time,reduced);c.save();c.translate(b.x,b.y-8);c.rotate(b.angle+Math.sign(b.speed)*Math.PI/2);c.scale(1,.85+.15*Math.abs(Math.sin(b.angle)));hvBlade(c,b.outer?48:44+g.weapons.orbit,g.time,b.index,b.outer,!reduced);c.restore();}
 c.restore();
}
function hvRibbon(c,x,y,rx,ry,start,sweep,width,color,alpha,back,raise=0){
 const outer=[],inner=[];let points=[];c.save();c.globalAlpha*=alpha;
 // Split at the horizon, rather than covering the hero with a whole ring.
 function paint(){if(outer.length<2)return;hvFill(c,[...outer,...inner.reverse()],color);outer.length=inner.length=0;}
 for(let i=0;i<=44;i++){const q=i/44,a=start+sweep*q,yy=Math.sin(a)*ry-raise,allowed=back===null||back===(yy<0),w=width*Math.sin(Math.PI*q)**.75;
 if(!allowed){paint();continue;}outer.push([x+Math.cos(a)*(rx+w*.5),y+Math.sin(a)*(ry+w*.24)-raise]);inner.push([x+Math.cos(a)*(rx-w*.5),y+Math.sin(a)*(ry-w*.24)-raise]);}
 paint();c.restore();
}
export function drawWhirlwind(r,f,t,g,layer="all"){
 const c=r.ctx,p=g.player,x=f.follow?p.x:f.x,y=(f.follow?p.y:f.y)-8,age=f.max-f.ttl,radius=f.r,fade=hvClamp(f.ttl/.17)*hvEase(age/.08),detail=!r.reduced&&r.quality>=.8,back=layer==="all"?null:layer==="back";
 if(fade<=0)return;c.save();c.globalAlpha=fade;c.lineCap="round";
 const turn=age*11.6,parts=3;
 for(let i=0;i<parts;i++){const phase=turn+i*HV_TAU/parts,rr=radius*(.72+i*.105),ry=rr*.82,raise=i*7;
 const color=hvGradient(c,x-rr,y-ry,x+rr,y+ry,[[0,"#533e24aa"],[.26,"#b68c4877"],[.55,"#ffe6a5cb"],[.83,"#fff6d5ef"],[1,"#c4a16f9c"]]);
 hvRibbon(c,x,y,rr,ry,phase-2.75,2.58,16+i*4,color,.72,back,raise);
 hvRibbon(c,x,y,rr+2,ry+1,phase-1.5,1.25,2.2,"#fff7d8",.95,back,raise);
 if(detail)hvRibbon(c,x,y,rr-11,ry-9,phase-3.2,2.55,.95,"#bfa16d",.42,back,raise);
 const bx=x+Math.cos(phase)*rr,by=y+Math.sin(phase)*ry-raise,isBack=by<y;
 if(back===null||back===isBack){c.save();c.translate(bx,by);c.rotate(Math.atan2(Math.cos(phase)*ry,-Math.sin(phase)*rr));hvBlade(c,43,age,i,false,detail);c.restore();}
 }
 if(detail){for(let i=0;i<12;i++){const q=turn*.72+i*2.399,rr=radius*(.67+hvRand(i,1)*.37),xx=x+Math.cos(q)*rr,yy=y+Math.sin(q)*rr*.82-8-hvRand(i,3)*24;
 if(back!==null&&back!==(yy<y))continue;const bright=.3+.7*Math.abs(Math.sin(age*9+i));hvLine(c,[[xx-Math.cos(q+.8)*5,yy-Math.sin(q+.8)*3],[xx,yy]],i%3?"#d4ac68":"#fff1c6",bright);}}
 if(layer!=="front"){c.globalAlpha=fade*.22;c.fillStyle="#06101b";c.beginPath();c.ellipse(x,y+14,radius*.56,radius*.22,0,0,HV_TAU);c.fill();}
 c.restore();
}
export function frostCrownLayout(x,y,radius){
 return Array.from({length:9},(_,i)=>{const seed=hvRand(i,x*.13+y*.21),angle=i*2.399+.15+seed*.45,dist=radius*(.32+hvRand(i,9)*.49);
 return {x:x+Math.cos(angle)*dist,y:y+Math.sin(angle)*dist*.73,index:i,seed,height:58+hvRand(i,2)*61,width:12+hvRand(i,5)*12,lean:(hvRand(i,3)-.5)*.74,delay:.27+hvRand(i,11)*.10};}).sort((a,b)=>a.y-b.y);
}
function hvIceShard(c,x,y,width,height,lean,seed,age,detail=true,alpha=1){
 if(height<1)return;c.save();c.translate(x,y);c.rotate(lean);c.globalAlpha*=alpha;
 const h=height,w=width,tipX=(hvRand(seed,6)-.5)*w*.4,tip=[tipX,-h],ridge=[w*.08,-h*.28],base=[0,5],left=[-w*.62,-h*.25],right=[w*.56,-h*.38];
 hvFill(c,[tip,[tipX+w*.34,-h*.74],right,[w*.48,2],base,ridge],hvGradient(c,-w*.3,-h*.5,w*.7,0,[[0,"#add6df"],[.28,"#76b6c8"],[.6,"#468198"],[1,"#1c3b58"]]));
 hvFill(c,[tip,[-w*.26,-h*.65],left,[-w*.48,4],base,ridge],hvGradient(c,-w*.6,0,w*.1,-h,[[0,"#11273f"],[.45,"#315b78"],[.77,"#619eb5"],[1,"#ecf8ee"]]));
 hvFill(c,[tip,ridge,base,[w*.28,-h*.1],[w*.25,-h*.42]],hvGradient(c,0,0,0,-h,[[0,"#35668077"],[.55,"#c5eae1ae"],[1,"#f7fff6"]]));
 // Stepped fracture planes interrupt a smooth, flat polygon.
 const split=-h*(.30+hvRand(seed,7)*.18);hvFill(c,[[w*.05,split],[w*.53,split-h*.06],[w*.34,split+h*.11],[w*.05,split+h*.07]],"#80bfd288");
 hvLine(c,[tip,[-w*.26,-h*.65],left,[-w*.48,4]],"#a6d8dfb3",.9);
 hvLine(c,[tip,ridge,base],"#e0fff0c9",1.15);
 hvLine(c,[[tipX+w*.34,-h*.74],right,[w*.48,2]],"#35627ca0",.9);
 if(detail){for(let i=0;i<3;i++){const yy=-h*(.22+i*.19),bend=hvRand(seed+i,8);hvLine(c,[[w*.08,yy],[w*(.12+bend*.2),yy-h*.055],[w*.41,yy-h*.02]],"#d2f1ef70",.65);hvLine(c,[[w*.08,yy],[-w*.2,yy+h*.065],[-w*.36,yy+h*.09]],"#78b6cc9c",.6);}
 const gleam=Math.sin(age*3+seed*1.7)*.5+.5;if(gleam>.65)hvGlint(c,tipX,-h+3,3.6,(gleam-.65)*2,true);}
 c.restore();
}
function hvIceCluster(c,s,rise,age,detail=true,alpha=1){
 const scale=hvEase(rise),h=s.height*scale,w=s.width;const count=detail?4:2;
 c.save();c.globalAlpha*=alpha;for(let i=0;i<count;i++){const side=i%2?1:-1,ii=i+1,off=w*side*(.48+ii*.14),smallH=h*(.31+hvRand(s.index+ii,10)*.35);hvIceShard(c,s.x+off,s.y+ii*.5,w*(.49+ii*.055),smallH,s.lean+side*(.15+ii*.07),s.index*7+ii,age,detail);}
 hvIceShard(c,s.x,s.y,w,h,s.lean,s.index,age,detail);c.restore();
}
function hvFrozenGround(c,x,y,radius,age,alpha,detail=true){
 c.save();c.translate(x,y);c.globalAlpha*=alpha;
 const field=c.createRadialGradient(0,0,radius*.13,0,0,radius);field.addColorStop(0,"#18395338");field.addColorStop(.5,"#47778b40");field.addColorStop(.82,"#699baf29");field.addColorStop(1,"#47778b00");
 c.fillStyle=field;c.beginPath();c.ellipse(0,0,radius,radius*.78,0,0,HV_TAU);c.fill();
 const spread=hvEase(age/.30),count=detail?13:8;
 for(let i=0;i<count;i++){const a=i*2.399,dist=radius*(.45+hvRand(i,9)*.45)*spread,dx=Math.cos(a),dy=Math.sin(a)*.78,points=[[dx*15,dy*15],[dx*dist*.4+Math.sin(a)*8,dy*dist*.4],[dx*dist*.7-Math.sin(a)*9,dy*dist*.7],[dx*dist,dy*dist]];
 hvLine(c,points,"#091b2ecc",3.8);hvLine(c,points,"#83c3d47d",1.15);
 if(detail){const start=points[2],fork=a+(i%2?.37:-.42);hvLine(c,[start,[start[0]+Math.cos(fork)*dist*.25,start[1]+Math.sin(fork)*dist*.16]],"#6fa6bb80",.8);}}
 if(detail){for(let i=0;i<16;i++){const a=i*2.399,d=radius*.82*Math.sqrt(hvRand(i,16)),xx=Math.cos(a)*d,yy=Math.sin(a)*d*.75;
 hvFill(c,[[xx-5,yy],[xx-1,yy-3],[xx+6,yy-1],[xx+2,yy+4]],i%2?"#94c5cf25":"#bedbe321");}}
 c.restore();
}
export function drawFrostCrown(r,f,t,g,layer="all"){
 const c=r.ctx,x=f.x,y=f.y+12,age=f.max-f.ttl,detail=!r.reduced&&r.quality>=.8,fade=hvClamp(f.ttl/.25);
 c.save();c.globalAlpha=fade;const clusters=frostCrownLayout(x,y,f.r);
 if(layer!=="front")hvFrozenGround(c,x,y,f.r,age,.95,detail);
 for(const s of clusters){const back=s.y<g.player.y-8;if(layer==="back"&&!back||layer==="front"&&back)continue;const rise=(age-s.delay)/.23;if(rise<=0)continue;hvIceCluster(c,s,rise,age,detail);}
 // A broken advancing front and thrown shards follow the damage moment at .30s.
 const blast=hvClamp((age-.30)/.60);
 if(age>.30&&age<1.05){const n=detail?26:10;for(let i=0;i<n;i++){const a=i*2.399,dist=(.2+blast*.91)*f.r*(.6+hvRand(i,12)*.4),xx=x+Math.cos(a)*dist,yy=y+Math.sin(a)*dist*.78-Math.sin(blast*Math.PI)*35*(.4+hvRand(i,13)),back=yy<g.player.y-8;
 if(layer==="back"&&!back||layer==="front"&&back)continue;const size=(3+hvRand(i,14)*5)*(1-blast*.5);c.save();c.globalAlpha*=(1-blast)*.8;c.translate(xx,yy);c.rotate(a+blast*4);hvFill(c,[[size,0],[0,-size*.62],[-size*.76,0],[-size*.15,size*.43]],i%3?"#acd5dd":"#e3fcf0");hvLine(c,[[size,0],[0,-size*.62]],"#edfff4",.7);c.restore();}}
 c.restore();
}
export function drawFrostResidue(r,field,t){
 const c=r.ctx,age=4-field.ttl,detail=!r.reduced&&r.quality>=.8,fade=hvClamp(field.ttl/.7);
 c.save();c.globalAlpha=fade;hvFrozenGround(c,field.x,field.y,field.r,age+.3,.75,detail);
 // Fractured low remnants replace copies of a cloudy rectangular texture.
 if(age>.75){for(const s of frostCrownLayout(field.x,field.y,field.r)){const remnant={...s,height:s.height*.3,width:s.width*.72};hvIceCluster(c,remnant,1,age,detail,.64*hvClamp((age-.75)/.3));}}
 if(detail){for(let i=0;i<14;i++){const a=i*2.399+age*.12,d=field.r*(.18+hvRand(i,17)*.72),xx=field.x+Math.cos(a)*d,yy=field.y+Math.sin(a)*d*.72-8-(age*9+i*7)%22;hvGlint(c,xx,yy,1.3,.25+hvRand(i,18)*.25,true);}}
 c.restore();
}
export function drawFrostPulse(r,f,t){
 const c=r.ctx,age=f.max-f.ttl,progress=hvClamp(age/f.max),fade=1-progress;
 c.save();c.globalAlpha=.32*fade;for(let i=0;i<(r.reduced?2:4);i++){const start=i*1.6+t*.6,rr=f.r*(.37+progress*.48+i*.08);hvRibbon(c,f.x,f.y-10,rr,rr*.75,start,1.2,1.2,"#c7e8eb",1,null);}
 c.restore();
}
export function drawMetalContact(r,f){
 const c=r.ctx,age=f.max-f.ttl,u=hvClamp(age/f.max),fade=(1-u)**2,angle=f.angle||0;c.save();c.translate(f.x,f.y);c.rotate(angle);c.globalAlpha=fade;
 hvLine(c,[[-13-16*u,7+12*u],[10+18*u,-8-10*u]],"#f4efd0",2.2);
 hvLine(c,[[-7-10*u,-9-7*u],[8+9*u,8+10*u]],"#bca574",1.15);
 for(let i=0;i<(r.reduced?3:6);i++){const q=i*2.399,dist=5+u*32;hvLine(c,[[Math.cos(q)*dist*.67,Math.sin(q)*dist*.67],[Math.cos(q)*dist,Math.sin(q)*dist]],i%2?"#d9b46e":"#f7f0d1",1.1);}
 c.restore();
}
