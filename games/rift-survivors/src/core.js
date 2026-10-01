import {EnemyGrid} from "./spatial.js";
export const HEROES=[
{id:"knight",name:"룬 기사",tag:"주변의 적을 넓게 베어요",weapon:"blade",color:"#ffd18b",hp:120,speed:155},
{id:"ranger",name:"별빛 궁수",tag:"빠른 화살로 멀리서 공격해요",weapon:"arrow",color:"#86e7b5",hp:95,speed:180},
{id:"mage",name:"서리 마법사",tag:"적을 관통하는 마력탄을 쏴요",weapon:"bolt",color:"#9ec4ff",hp:100,speed:160}];
export const UPGRADES={
blade:{name:"룬의 검",icon:"⚔",kind:"weapon",color:"#ffd18b",desc:"주변의 적을 넓게 베어요"},
arrow:{name:"별빛 화살",icon:"➶",kind:"weapon",color:"#86e7b5",desc:"빠른 화살로 가까운 적을 공격해요"},
bolt:{name:"마력 창",icon:"✦",kind:"weapon",color:"#9ec4ff",desc:"적을 관통하는 마력탄을 쏴요"},
orbit:{name:"수호의 별",icon:"◈",kind:"weapon",color:"#e1b3ff",desc:"주위를 도는 별이 적을 공격해요"},
lightning:{name:"번개 사슬",icon:"ϟ",kind:"weapon",color:"#ffe286",desc:"여러 적에게 번개가 내려쳐요"},
frost:{name:"서리 파동",icon:"❄",kind:"weapon",color:"#8be4f5",desc:"주변 적을 얼리고 느리게 만들어요"},
power:{name:"전투 본능",icon:"◆",kind:"passive",color:"#ffac94",desc:"모든 공격의 피해가 15% 증가해요"},
haste:{name:"시간의 룬",icon:"◷",kind:"passive",color:"#b9d4ff",desc:"모든 무기의 공격 간격이 줄어들어요"},
boots:{name:"바람 걸음",icon:"»",kind:"passive",color:"#b7e7ba",desc:"이동 속도가 8% 증가해요"},
heart:{name:"생명의 룬",icon:"♥",kind:"passive",color:"#ffacbc",desc:"최대 체력 +20, 체력을 회복해요"},
magnet:{name:"별의 인력",icon:"◎",kind:"passive",color:"#d7b9ff",desc:"경험치를 더 넓게 끌어당겨요"}};
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const EVOLUTIONS = {
blade:{passive:"power",name:"태양의 대검",desc:"검의 범위와 피해가 크게 증가해요"},
arrow:{passive:"haste",name:"유성 화살",desc:"다섯 갈래 화살이 적을 관통해요"},
bolt:{passive:"magnet",name:"성운의 창",desc:"거대한 마력 창이 여러 적을 꿰뚫어요"},
orbit:{passive:"heart",name:"천상의 수호",desc:"여섯 별이 넓은 궤도로 회전해요"},
lightning:{passive:"power",name:"폭풍의 심장",desc:"번개가 여섯 적에게 퍼져요"},
frost:{passive:"boots",name:"영원의 겨울",desc:"넓은 서리가 적을 오래 붙잡아요"}
};
export const LIMITS={enemies:180,bullets:180,shots:160,gems:400,fx:160,pickups:12};
const norm=(x,y)=>{const d=Math.hypot(x,y);return d?[x/d,y/d]:[1,0];};
const d2=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
const safeInt=(n,max=999999999)=>Number.isFinite(n)?clamp(Math.floor(n),0,max):0;
export function cleanSave(raw){let s={};try{s=typeof raw==="string"?JSON.parse(raw):raw||{};}catch{}
if(!s||typeof s!=="object")s={};const m=s.meta||{},v=s.settings||{};
return {version:1,coins:safeInt(s.coins),best:safeInt(s.best),kills:safeInt(s.kills),wins:safeInt(s.wins),runs:safeInt(s.runs),meta:{power:safeInt(m.power,5),heart:safeInt(m.heart,5),fortune:safeInt(m.fortune,5)},settings:{sound:v.sound!==false,reduced:v.reduced===true,performance:["auto","smooth","battery"].includes(v.performance)?v.performance:"auto"}};}
export const metaCost=level=>40+level*45;
export function purchase(save,key){const s=cleanSave(save),lv=s.meta[key];if(lv===undefined||lv>=5||s.coins<metaCost(lv))return {ok:false,save:s};s.coins-=metaCost(lv);s.meta[key]++;return {ok:true,save:s};}
export function reward(save,r){const s=cleanSave(save);s.coins+=r.coins;s.runs++;s.kills+=r.kills;if(r.win)s.wins++;s.best=Math.max(s.best,r.score);return cleanSave(s);}
export class Game{
constructor(id="knight",meta={},seed=Date.now()){
this.seed=seed>>>0;this.hero=HEROES.find(h=>h.id===id)||HEROES[0];this.meta=cleanSave({meta}).meta;const hp=this.hero.hp+this.meta.heart*10;
this.player={x:900,y:900,r:13,hp,maxHp:hp,speed:this.hero.speed,inv:0,dash:0,dashCd:0,ultCd:0,dirX:1,dirY:0};
this.phase="playing";this.time=0;this.level=1;this.xp=0;this.need=8;this.pending=0;this.kills=0;this.score=0;this.weapons={[this.hero.weapon]:1};this.passives={};this.cool={};this.enemies=[];this.bullets=[];this.shots=[];this.gems=[];this.hazards=[];this.fx=[];this.events=[];this.spawnCd=.3;this.bossSpawned=false;this.nextElite=60;this.counter=0;this.choices=[];this.result=null;this.spawnDistance=500;this.evolved={};this.rerolls=3;this.pickups=[];this.nextMagnet=90;this.grid=new EnemyGrid();this.candidates=[];this.metrics={collisionChecks:0};}
effect(f){if(this.fx.length>=LIMITS.fx){if(f.kind==="text"||f.kind==="burst")return;this.fx.shift();}this.fx.push(f);}
checkEvolution(){for(const [key,u]of Object.entries(EVOLUTIONS))if(this.weapons[key]>=5&&(this.passives[u.passive]||0)>=2&&!this.evolved[key]){this.evolved[key]=true;this.cool[key]=0;this.emit("evolve",{key,name:u.name});}}
reroll(){if(this.phase!=="upgrade"||this.rerolls<=0)return false;const before=this.choices;this.rerolls--;this.choices=this.offer();for(let i=0;i<4&&this.choices.join()===before.join();i++)this.choices=this.offer();this.emit("reroll");return true;}
rand(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
emit(type,data={}){this.events.push({type,...data});}
damageScale(){return 1+(this.passives.power||0)*.15+this.meta.power*.06;}
xpNeeded(lv){return 8+(lv-1)*4;}
addXP(n){if(this.phase==="result")return;this.xp+=n;while(this.xp>=this.need){this.xp-=this.need;this.level++;this.pending++;this.need=this.xpNeeded(this.level);}if(this.pending&&this.phase==="playing"){this.phase="upgrade";this.choices=this.offer();this.emit("level",{level:this.level});}}
offer(){const slots=Object.keys(this.weapons).length,pool=Object.keys(UPGRADES).filter(k=>{const u=UPGRADES[k],lv=this.weapons[k]||this.passives[k]||0;return lv<5&&(u.kind!=="weapon"||lv>0||slots<4);});
if(!pool.length)return ["heal"];for(let i=pool.length-1;i>0;i--){const j=Math.floor(this.rand()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}const owned=pool.find(k=>UPGRADES[k].kind==="weapon"&&this.weapons[k]);if(owned){pool.splice(pool.indexOf(owned),1);pool.unshift(owned);}return pool.slice(0,3);}
choose(key){if(this.phase!=="upgrade"||!this.choices.includes(key))return false;const u=UPGRADES[key];if(!u)this.player.hp=Math.min(this.player.maxHp,this.player.hp+35);else if(u.kind==="weapon"){this.weapons[key]=(this.weapons[key]||0)+1;this.cool[key]=0;}else{this.passives[key]=(this.passives[key]||0)+1;if(key==="heart"){this.player.maxHp+=20;this.player.hp=Math.min(this.player.maxHp,this.player.hp+50);}}
this.checkEvolution();this.pending--;this.emit("choose",{key});this.phase=this.pending>0?"upgrade":"playing";this.choices=this.pending>0?this.offer():[];return true;}
pause(){if(this.phase==="playing"){this.phase="paused";return true;}return false;}
resume(){if(this.phase==="paused"){this.phase="playing";return true;}return false;}
dash(dx=0,dy=0){const p=this.player;if(this.phase!=="playing"||p.dashCd>0)return false;const [x,y]=Math.hypot(dx,dy)>.05?norm(dx,dy):[p.dirX,p.dirY];p.dirX=x;p.dirY=y;p.dash=.18;p.inv=Math.max(p.inv,.45);p.dashCd=5;this.emit("dash");return true;}
ultimate(){if(this.phase!=="playing"||this.player.ultCd>0)return false;const p=this.player;p.ultCd=32;p.inv=Math.max(p.inv,1);p.hp=Math.min(p.maxHp,p.hp+12);this.damageKey="ultimate";this.effect({kind:"ring",x:p.x,y:p.y,r:520,color:"#aeeaff",ttl:.9,max:.9});for(const e of this.enemies)if(d2(e,p)<520**2)this.hit(e,(45+this.level*5)*this.damageScale(),p);this.shots=[];this.emit("ultimate");return true;}
hurt(n){const p=this.player;if(p.inv>0||this.phase!=="playing")return false;p.hp=Math.max(0,p.hp-n);p.inv=.7;this.emit("hurt",{n});if(p.hp<=0)this.finish(false);return true;}
hit(e,n,origin){if(e.hp<=0)return;e.hp-=n;e.flash=.12;if(origin&&!e.boss){const oldX=e.x,oldY=e.y,[x,y]=norm(e.x-origin.x,e.y-origin.y);e.x+=x*8;e.y+=y*8;if(this.projectilePass)this.grid.move(e,oldX,oldY);}this.effect({kind:"text",x:e.x,y:e.y-29,n:Math.round(n),color:"#fff1c8",ttl:.5,max:.5});if((this.impactCount||0)<6){this.impactCount=(this.impactCount||0)+1;this.effect({kind:"impact",x:e.x,y:e.y-8,angle:Math.atan2(e.y-(origin?.y||0),e.x-(origin?.x||0)),color:"#ffe1a0",ttl:.23,max:.23});}if(this.time-(this.impactSoundAt??-1)>.085){this.impactSoundAt=this.time;this.emit("impact",{strong:n>=45,key:this.damageKey||this.hero.weapon});}
if(e.hp<=0){this.kills++;this.score+=e.boss?1000:e.elite?60:e.kind==="brute"?15:10;if(!e.boss){this.gems.push({x:e.x,y:e.y,value:e.elite?8:e.kind==="brute"?3:1,heal:!e.elite&&this.rand()<.035,attract:false});if(e.elite&&this.pickups.length<LIMITS.pickups)this.pickups.push({kind:"chest",x:e.x,y:e.y,value:18});}this.effect({kind:"burst",x:e.x,y:e.y,color:e.color,ttl:.32,max:.32});if(e.boss)this.finish(true);}}
finish(win){if(this.result)return;this.phase="result";this.result={win,kills:this.kills,level:this.level,time:Math.floor(this.time),score:this.score+Math.floor(this.time)*2+(win?3000:0),coins:Math.floor(this.kills/12)+this.level*2+(win?70:0)};this.emit("result",{result:this.result});}
spawn(kind,elite=false){const p=this.player,a=this.rand()*Math.PI*2,r=this.spawnDistance+this.rand()*70;let x=clamp(p.x+Math.cos(a)*r,24,1776),y=clamp(p.y+Math.sin(a)*r,24,1776);if(Math.hypot(x-p.x,y-p.y)<260){x=p.x<900?1750:50;y=p.y<900?1750:50;}
const defs={shade:[16,74,11,"#c7a6e8"],bat:[10,105,8,"#a8b6e8"],brute:[38,48,18,"#e7ab8c"],seer:[20,60,12,"#98d2b0"]},d=defs[kind]||defs.shade,hp=(d[0]+this.time*.045)*(elite?4:1);
const e={id:++this.counter,x,y,kind,r:d[2]*(elite?1.4:1),hp,maxHp:hp,speed:d[1]*(elite?1.1:1),color:d[3],elite,slow:0,flash:0,shoot:1.5+this.rand()};this.enemies.push(e);return e;}
spawnBoss(){if(this.bossSpawned)return;this.bossSpawned=true;this.enemies=[];this.shots=[];this.hazards=[];const p=this.player,e={id:++this.counter,x:clamp(p.x,80,1720),y:clamp(p.y-320,80,1720),kind:"boss",r:40,hp:1800,maxHp:1800,speed:42,color:"#c998ed",boss:true,slow:0,flash:0,shoot:2,storm:4};this.enemies.push(e);p.inv=2;this.emit("boss");return e;}
nearest(range=650){let nearest=null,best=range**2;for(const e of this.enemies)if(e.hp>0){const ds=d2(e,this.player);if(ds<best){best=ds;nearest=e;}}return nearest;}
attack(key,lv){this.damageKey=key;const p=this.player,scale=this.damageScale(),target=this.nearest(),evo=!!this.evolved[key],base=(1+.32*(lv-1))*(evo?1.4:1);if(!target&&key!=="frost")return;
if(key==="blade"){const r=112+lv*13+(evo?55:0),list=this.enemies.filter(e=>e.hp>0&&d2(e,p)<(r+e.r)**2);if(list.length){for(const e of list)this.hit(e,19*base*scale,p);this.effect({kind:"slash",x:p.x,y:p.y,r,color:"#ffd18b",ttl:.23,max:.23,angle:Math.atan2(target.y-p.y,target.x-p.x)});this.emit("attack",{key});}}
else if(key==="arrow"||key==="bolt"){const angle=Math.atan2(target.y-p.y,target.x-p.x),count=evo&&key==="arrow"?5:1+(lv>=3?1:0)+(lv>=5?1:0);for(let i=0;i<count&&this.bullets.length<LIMITS.bullets;i++){const a=angle+(i-(count-1)/2)*.13,v=key==="arrow"?480:370;this.bullets.push({x:p.x,y:p.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:key==="arrow"?4:evo?10:6,key,ttl:1.8,damage:(key==="arrow"?12:16)*base*scale,pierce:key==="bolt"?(evo?8:1+Math.floor(lv/2)):(evo?3:Math.floor(lv/3)),hit:[]});}this.emit("attack",{key});}
else if(key==="lightning"){const list=this.enemies.filter(e=>e.hp>0&&d2(e,p)<520**2).sort((a,b)=>d2(a,p)-d2(b,p)).slice(0,evo?6:2+Math.floor(lv/2));let o=p;for(const e of list){this.effect({kind:"line",x:o.x,y:o.y,x2:e.x,y2:e.y,color:"#ffe286",ttl:.2,max:.2});this.hit(e,22*base*scale,p);o=e;}if(list.length)this.emit("attack",{key});}
else if(key==="frost"){const r=135+lv*14+(evo?75:0);this.effect({kind:"ring",x:p.x,y:p.y,r,color:"#8be4f5",ttl:.55,max:.55});for(const e of this.enemies)if(e.hp>0&&d2(e,p)<(r+e.r)**2){e.slow=evo?3.5:2;this.hit(e,10*base*scale,p);}this.emit("attack",{key});}
else if(key==="orbit"){const r=64+lv*6+(evo?20:0),n=evo?6:2+Math.floor(lv/2);for(let i=0;i<n;i++){const a=this.time*2.6+i*Math.PI*2/n,o={x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r};for(const e of this.enemies)if(e.hp>0&&d2(e,o)<(e.r+16)**2)this.hit(e,10*base*scale,p);}}}
step(delta,input={x:0,y:0}){if(this.phase!=="playing")return;const dt=Number.isFinite(delta)?clamp(delta,0,.05):0,p=this.player;this.time+=dt;this.impactCount=0;p.inv=Math.max(0,p.inv-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.ultCd=Math.max(0,p.ultCd-dt);
let ix=Number.isFinite(input.x)?input.x:0,iy=Number.isFinite(input.y)?input.y:0,mag=Math.hypot(ix,iy);if(mag>1){ix/=mag;iy/=mag;}if(mag>.05&&p.dash<=0)[p.dirX,p.dirY]=norm(ix,iy);if(p.dash>0){ix=p.dirX;iy=p.dirY;p.dash=Math.max(0,p.dash-dt);}
if(p.dash>0&&this.time-(this.ghostAt??-1)>.04){this.ghostAt=this.time;this.effect({kind:"ghost",x:p.x,y:p.y,face:p.dirX>=0?1:-1,color:"#b4f5d3",ttl:.22,max:.22});}const v=p.speed*(1+(this.passives.boots||0)*.08)*(p.dash>0?4.2:1);p.x=clamp(p.x+ix*v*dt,25,1775);p.y=clamp(p.y+iy*v*dt,25,1775);
if(this.time>=300&&!this.bossSpawned)this.spawnBoss();if(!this.bossSpawned){this.spawnCd-=dt;if(this.spawnCd<=0){this.spawnCd=Math.max(.22,.85-this.time*.0022);if(this.enemies.length<LIMITS.enemies){const r=this.rand();this.spawn(this.time<30?"shade":r<.25?"bat":r<.45?"brute":r<.58?"seer":"shade");}}if(this.time>=this.nextElite){this.nextElite+=60;if(this.enemies.length<LIMITS.enemies)this.spawn("brute",true);this.emit("elite");}}
if(!this.bossSpawned&&this.time>=this.nextMagnet){this.nextMagnet+=90;if(this.pickups.length<LIMITS.pickups)this.pickups.push({kind:"magnet",x:clamp(p.x+140,25,1775),y:p.y,value:0});this.emit("supply");}
for(const [key,lv]of Object.entries(this.weapons)){this.cool[key]=(this.cool[key]||0)-dt;if(this.cool[key]<=0){this.attack(key,lv);const times={blade:.85,arrow:.58,bolt:.88,orbit:.32,lightning:2.2,frost:2.8};this.cool[key]=times[key]*(1-(this.passives.haste||0)*.09)*(lv===5?.8:1);}if(this.phase==="result")return;}
for(const e of this.enemies){if(e.hp<=0)continue;e.slow=Math.max(0,e.slow-dt);e.flash=Math.max(0,e.flash-dt);e.shoot-=dt;const [dx,dy]=norm(p.x-e.x,p.y-e.y),dist=Math.hypot(p.x-e.x,p.y-e.y),phase2=e.boss&&e.hp<e.maxHp*.5,speed=e.speed*(e.slow>0?.45:1)*(phase2?1.4:1);if(e.kind!=="seer"||dist>240){e.x+=dx*speed*dt;e.y+=dy*speed*dt;}
if(dist<e.r+p.r)this.hurt(e.boss?24:e.elite?18:e.kind==="brute"?14:9);if(this.phase==="result")return;
if((e.kind==="seer"||e.boss)&&e.shoot<=0){e.shoot=e.boss?(phase2?1.9:2.8):3.3;const count=e.boss?(phase2?12:8):1,angle=e.boss?this.time*.5:Math.atan2(p.y-e.y,p.x-e.x);for(let i=0;i<count&&this.shots.length<LIMITS.shots;i++){const a=angle+(e.boss?i*Math.PI*2/count:0);this.shots.push({x:e.x,y:e.y,vx:Math.cos(a)*145,vy:Math.sin(a)*145,r:6,ttl:5,damage:e.boss?13:8});}}
if(e.boss){e.storm-=dt;if(e.storm<=0){e.storm=phase2?3:4;this.hazards.push({x:p.x,y:p.y,r:55,delay:1.1,life:.35,damage:25});}}}
const useGrid=this.bullets.length*this.enemies.length>=4096;if(useGrid)this.grid.rebuild(this.enemies);this.projectilePass=useGrid;this.metrics.collisionChecks=0;
for(const b of this.bullets){b.ttl-=dt;const ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;const nearby=useGrid?this.grid.query(Math.min(ox,b.x)-64,Math.min(oy,b.y)-64,Math.max(ox,b.x)+64,Math.max(oy,b.y)+64,this.candidates):this.enemies;for(const e of nearby){if(e.hp<=0||b.ttl<=0||b.hit.includes(e.id))continue;this.metrics.collisionChecks++;const vx=b.x-ox,vy=b.y-oy,len=vx*vx+vy*vy,u=len?clamp(((e.x-ox)*vx+(e.y-oy)*vy)/len,0,1):0;if((ox+u*vx-e.x)**2+(oy+u*vy-e.y)**2<(e.r+b.r)**2){b.hit.push(e.id);this.damageKey=b.key;this.hit(e,b.damage,p);if(b.pierce--<=0)b.ttl=0;if(this.phase==="result")return;}}}
this.projectilePass=false;
for(const b of this.shots){b.ttl-=dt;const ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;const vx=b.x-ox,vy=b.y-oy,len=vx*vx+vy*vy,u=len?clamp(((p.x-ox)*vx+(p.y-oy)*vy)/len,0,1):0;if((ox+u*vx-p.x)**2+(oy+u*vy-p.y)**2<(b.r+p.r)**2&&this.hurt(b.damage))b.ttl=0;if(this.phase==="result")return;}
for(const h of this.hazards){h.delay-=dt;if(h.delay<=0){h.life-=dt;if(d2(h,p)<(h.r+p.r)**2)this.hurt(h.damage);}}
for(const item of this.pickups){if(d2(item,p)<32**2){item.dead=true;if(item.kind==="magnet"){for(const gem of this.gems)gem.attract=true;this.emit("magnet");}else{this.addXP(item.value);p.hp=Math.min(p.maxHp,p.hp+20);this.emit("chest");}}}this.pickups=this.pickups.filter(item=>!item.dead);
const collect=85+(this.passives.magnet||0)*25+this.meta.fortune*8;
for(const gem of this.gems){const ds=d2(gem,p);if(ds<collect**2)gem.attract=true;if(gem.attract){const [x,y]=norm(p.x-gem.x,p.y-gem.y);gem.x+=x*390*dt;gem.y+=y*390*dt;}if(ds<20**2||d2(gem,p)<20**2){gem.dead=true;if(gem.heal){p.hp=Math.min(p.maxHp,p.hp+(gem.healValue||14));this.emit("heal");}else this.addXP(gem.value);}}
this.gems=this.gems.filter(g=>!g.dead);if(this.gems.length>LIMITS.gems){const xp=this.gems.filter(g=>!g.heal),heals=this.gems.filter(g=>g.heal);if(heals.length>40){const merged=heals.splice(0,heals.length-39);heals.push({x:merged[0].x,y:merged[0].y,value:0,heal:true,healValue:merged.reduce((n,g)=>n+(g.healValue||14),0),attract:false});}const excess=xp.splice(0,Math.max(0,xp.length-(LIMITS.gems-1-heals.length)));if(excess.length)xp.push({x:clamp(p.x+100,25,1775),y:p.y,value:excess.reduce((s,g)=>s+g.value,0),heal:false,attract:false});this.gems=[...heals,...xp];}
this.enemies=this.enemies.filter(e=>e.hp>0);this.bullets=this.bullets.filter(b=>b.ttl>0);this.shots=this.shots.filter(b=>b.ttl>0);this.hazards=this.hazards.filter(h=>h.life>0);for(const f of this.fx)f.ttl-=dt;this.fx=this.fx.filter(f=>f.ttl>0).slice(-LIMITS.fx);
}}
