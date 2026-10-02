import {EnemyGrid} from "./spatial.js";
export const HEROES=[
{id:"knight",name:"룬 기사",tag:"회오리·출혈·검기로 근접 난전을 지배해요",weapon:"blade",role:"근접 · 받는 피해 20% 감소",ultimateName:"태양의 심판",ultimateDesc:"주변 적을 강하게 베고 1.2초 기절시켜요",color:"#ffd18b",hp:130,speed:155},
{id:"ranger",name:"별빛 궁수",tag:"다중 화살·독·덫으로 적의 접근을 막아요",weapon:"arrow",role:"원거리 · 관통",ultimateName:"유성 일제사격",ultimateDesc:"적을 향해 관통 화살 21발을 세 번 나눠 쏴요",color:"#86e7b5",hp:95,speed:180},
{id:"mage",name:"서리 마법사",tag:"화염·번개·얼음으로 넓은 지역을 제어해요",weapon:"bolt",role:"마법 · 지역 제어",ultimateName:"영원의 서리",ultimateDesc:"4초 동안 서리 지대로 적을 붙잡아요",color:"#9ec4ff",hp:110,speed:175}];
export const weaponSlots=level=>level>=10?6:level>=6?5:4;
export const runCoins=(g,win=false)=>g.practice?0:Math.floor(g.kills/12)+g.level*2+(win?70:0);
export const CLASS_SKILLS={knight:["blade","whirlwind","cleave","slam","rend","orbit"],ranger:["arrow","multishot","piercing","poison","trap","volley"],mage:["bolt","fireball","lightning","frost","meteor","nova"]};
const weaponRows=[
["blade","룬의 검","#ffd18b","전방의 적을 넓게 베어요",23,.85],
["whirlwind","칼날 회오리","#ffdaa1","이동하며 주변을 연속으로 베어요",9,3],
["cleave","황금 검기","#ffe5b2","넓은 검기가 전방의 적을 꿰뚫어요",27,2.1],
["slam","대지 강타","#f5ac74","발밑에 충격파를 일으켜 적을 기절시켜요",35,3.6],
["rend","핏빛 가르기","#f49b9b","전방을 베고 3초 동안 출혈을 일으켜요",20,2.6],
["orbit","칼날 방벽","#f0cf92","회전하는 검들이 접근하는 적을 베어요",10,.32],
["arrow","별빛 화살","#86e7b5","가까운 적에게 빠르게 화살을 쏴요",12,.70],
["multishot","다중 사격","#b4f0cf","넓은 부채꼴로 여러 발의 화살을 쏴요",9,1.75],
["piercing","관통 사격","#dbf6ba","빠르고 강한 화살로 일렬의 적을 꿰뚫어요",32,1.8],
["poison","맹독 화살","#b6e978","화살에 맞은 적에게 4초 동안 독 피해를 줘요",9,1.3],
["trap","가시 덫","#b9c793","발밑에 덫을 설치해 접근하는 적을 묶어요",35,3.3],
["volley","화살 폭우","#9ff3c5","표시된 지역에 2초 동안 화살이 쏟아져요",13,4],
["bolt","마력 창","#9ec4ff","적을 관통하고 잠시 얼리는 마력탄을 쏴요",20,.88],
["fireball","폭발 화염구","#ffb483","적에게 닿으면 폭발해 주변에도 피해를 줘요",36,1.8],
["lightning","번개 사슬","#e0ebff","가까운 적들 사이로 번개가 이어져요",22,2.2],
["frost","눈보라","#8be4f5","적이 있는 지역에 3초 동안 눈보라를 만들어요",11,4.1],
["meteor","운석 낙하","#ffc18d","표시된 지역에 운석을 떨어뜨려 큰 피해를 줘요",72,5],
["nova","서리 폭발","#c1efff","사방으로 얼음 파편을 발사해 적을 얼려요",17,3.2]];
const passiveRows=[
["power","전투 본능","#ffac94","모든 공격의 피해가 15% 증가해요"],
["haste","시간의 룬","#b9d4ff","모든 무기의 공격 간격이 줄어들어요"],
["boots","바람 걸음","#b7e7ba","이동 속도가 8% 증가해요"],
["heart","생명의 룬","#ffacbc","최대 체력 +15, 체력을 회복해요"],
["magnet","별의 인력","#d7b9ff","경험치를 더 넓게 끌어당겨요"],
["crit","매의 눈","#ffe493","치명타 확률 +8% · 치명타는 피해 175%"],
["leech","흡혈의 룬","#e794a7","적 처치 시 체력을 회복해요"],
["focus","확장의 룬","#a8dfe8","영역 범위와 지속 시간이 8% 증가해요"]];
export const UPGRADES=Object.fromEntries([...weaponRows.map(([key,name,color,desc])=>[key,{name,color,desc,kind:"weapon"}]),...passiveRows.map(([key,name,color,desc])=>[key,{name,color,desc,kind:"passive"}])]);
export const SKILL_BASE=Object.fromEntries(weaponRows.map(([key,,,,damage,cooldown])=>[key,{damage,cooldown}]));
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const evolutionRows=[
["blade","power","태양의 대검","검의 범위와 피해가 크게 증가해요"],
["whirlwind","haste","무한의 소용돌이","더 넓고 오래 지속되는 칼날 회오리"],
["cleave","focus","여명의 검기","더 넓은 검기가 많은 적을 꿰뚫어요"],
["slam","heart","거인의 강타","거대한 충격파가 적을 오래 기절시켜요"],
["rend","leech","진홍의 맹세","넓은 참격과 5초 동안의 출혈"],
["orbit","heart","천상의 칼날","여섯 검이 넓은 궤도로 회전해요"],
["arrow","haste","유성 화살","다섯 갈래 화살이 적을 관통해요"],
["multishot","crit","별의 일제사격","아홉 갈래 관통 화살"],
["piercing","power","혜성 관통탄","열 명을 관통하는 강력한 화살"],
["poison","leech","맹독의 추적자","두 발의 관통 화살과 6초 동안의 독"],
["trap","boots","사냥꾼의 성역","넓은 덫이 적을 3초 동안 묶어요"],
["volley","focus","천공의 폭우","더 넓은 지역에 3초 동안 화살이 쏟아져요"],
["bolt","magnet","성운의 창","거대한 마력 창이 여러 적을 꿰뚫어요"],
["fireball","power","태양의 화염구","화염구의 폭발 범위와 피해가 증가해요"],
["lightning","power","폭풍의 심장","번개가 최대 여덟 적에게 퍼져요"],
["frost","boots","영원의 겨울","넓은 눈보라가 적을 오래 붙잡아요"],
["meteor","focus","종말의 운석","더 넓고 강력한 운석 낙하"],
["nova","crit","빙결의 왕관","열여섯 얼음 파편이 적을 오래 얼려요"]];
export const EVOLUTIONS=Object.fromEntries(evolutionRows.map(([key,passive,name,desc])=>[key,{passive,name,desc}]));
export function skillStats(g,key,lv=g.weapons[key]||1,evolved=!!g.evolved[key]){
const area=1+(g.passives.focus||0)*.08,base=(1+.32*(lv-1))*(evolved?1.4:1),damage=SKILL_BASE[key].damage*base*g.damageScale();
const radius={blade:90+lv*9+(evolved?28:0),whirlwind:90+lv*7+(evolved?30:0),slam:135+lv*10+(evolved?40:0),rend:120+lv*8+(evolved?40:0),trap:80+lv*8+(evolved?40:0),volley:95+lv*10+(evolved?40:0),fireball:65+lv*6+(evolved?30:0),frost:105+lv*10+(evolved?55:0),meteor:105+lv*8+(evolved?45:0)};
return {damage,base,r:(radius[key]||0)*area,area,cooldown:SKILL_BASE[key].cooldown*(1-(g.passives.haste||0)*.07)*(lv===5?.8:1),
count:key==="multishot"?(evolved?9:3+Math.floor(lv/2)*2):key==="lightning"?(evolved?8:3+Math.floor(lv/2)):key==="nova"?(evolved?16:8+lv):1,
duration:(key==="whirlwind"?(evolved?1.7:1.05):key==="frost"?(evolved?4.5:3):key==="volley"?(evolved?3:2):0)*area};
}
export function upgradeDetail(g,key){
const lv=g.weapons[key]||g.passives[key]||0,next=lv+1,ev=EVOLUTIONS[key],rune=ev?g.passives[ev.passive]||0:0,evo=!!(g.evolved[key]||ev&&next>=5&&rune>=2);
let stat;const n=x=>Math.round(x),u=UPGRADES[key];
if(u?.kind==="weapon"){const s=skillStats(g,key,next,evo),d=n(s.damage);
stat={
blade:"피해 "+d+" · 사거리 "+n(s.r),arrow:"피해 "+d+" · 화살 "+(evo?5:1+(next>=3?1:0)+(next>=5?1:0))+"발",
bolt:"피해 "+d+" · 관통 "+(evo?9:2+Math.floor(next/2))+"명",
whirlwind:"타격당 "+d+" · 범위 "+n(s.r)+" · "+s.duration.toFixed(1)+"초",
cleave:"피해 "+d+" · 관통 "+(evo?13:5+next)+"명",
slam:"피해 "+d+" · 범위 "+n(s.r)+" · 기절 "+(evo?1.2:.65)+"초",
rend:"직격 "+d+" · 출혈 초당 "+n(6*s.base*g.damageScale())+" · "+(evo?5:3)+"초",
orbit:"칼날 "+(evo?6:2+Math.floor(next/2))+"개 · 피해 "+d,
multishot:"화살 "+s.count+"발 · 발당 "+d,piercing:"피해 "+d+" · 관통 "+(evo?10:3+next)+"명",
poison:"직격 "+d+" · 독 초당 "+n(6*s.base*g.damageScale())+" · "+(evo?6:4)+"초",
trap:"피해 "+d+" · 범위 "+n(s.r)+" · 속박 "+(evo?3:1.5)+"초",
volley:"회당 "+d+" · 범위 "+n(s.r)+" · "+s.duration.toFixed(1)+"초",
fireball:"폭발 "+d+" · 범위 "+n(s.r),lightning:"연쇄 "+s.count+"명 · 피해 "+d,
frost:"회당 "+d+" · 범위 "+n(s.r)+" · "+s.duration.toFixed(1)+"초",
meteor:"피해 "+d+" · 범위 "+n(s.r),nova:"파편 "+s.count+"개 · 피해 "+d}[key];
}else stat={power:"전체 피해 +"+(next*15)+"%",haste:"공격 간격 −"+(next*7)+"%",boots:"이동 속도 +"+(next*8)+"%",
heart:"최대 체력 +15 · 즉시 회복 30",magnet:"수집 범위 "+(85+next*25+g.meta.fortune*8),
crit:"치명타 확률 "+(next*8)+"% · 피해 175%",leech:"처치 시 체력 +"+(.8+next*.4).toFixed(1)+" · 1초 간격",
focus:"영역 범위·지속 +"+(next*8)+"%",heal:"체력 35 회복"}[key];
const pairs=Object.keys(g.weapons).filter(k=>EVOLUTIONS[k]?.passive===key&&!g.evolved[k]);
return {lv,next,stat,pair:ev?ev.name:pairs.map(k=>EVOLUTIONS[k].name).join(" · "),
progress:ev?"무기 "+Math.min(next,5)+"/5 · "+UPGRADES[ev.passive].name+" "+rune+"/2":pairs.length?"진화 룬 "+Math.min(next,2)+"/2":"",
recommended:!!pairs.length||!!(ev&&rune>=2),evolves:!!(ev&&next===5&&rune>=2)};
}
export const BLADE_TIMING={windup:.09,contact:.14,duration:.34};
export const RANGED_TIMING={arrow:{release:.13,duration:.40},bolt:{release:.20,duration:.54}};
export const LIMITS={enemies:180,bullets:180,shots:160,gems:400,fx:160,pickups:12,fields:14,tasks:12};
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
this.player={x:900,y:900,r:13,hp,maxHp:hp,speed:this.hero.speed,inv:0,dash:0,dashCd:0,ultCd:0,dirX:1,dirY:0,facing:1,moving:false,walkDistance:0};
this.ultimateState=null;this.bossReinforcement=0;this.rift=null;this.nextRift=35;this.seals=0;this.chapter=0;this.spellFields=[];this.skillFields=[];this.skillTasks=[];this.skillPose=null;this.practice=false;this.bladeSwing=null;this.rangedAttacks={};this.swingId=0;this.rangedId=0;this.lastRangedContact={};this.hitPause=0;this.hitStopEnabled=true;this.phase="playing";this.time=0;this.level=1;this.xp=0;this.need=8;this.pending=0;this.kills=0;this.score=0;this.weapons={[this.hero.weapon]:1};this.passives={};this.cool={};this.enemies=[];this.bullets=[];this.shots=[];this.gems=[];this.hazards=[];this.fx=[];this.events=[];this.spawnCd=.3;this.bossSpawned=false;this.nextElite=40;this.counter=0;this.choices=[];this.offerCounts={};this.result=null;this.spawnDistance=500;this.evolved={};this.rerolls=3;this.pickups=[];this.nextMagnet=90;this.grid=new EnemyGrid();this.candidates=[];this.metrics={collisionChecks:0};}
effect(f){const decorative=["text","burst","corpse","impact","cut-hit","arrow-hit","bolt-hit"];if(this.fx.length>=LIMITS.fx){if(decorative.includes(f.kind))return;const index=this.fx.findIndex(x=>decorative.includes(x.kind));if(index>=0)this.fx.splice(index,1);else{const safe=this.fx.findIndex(x=>!["sun-cleave","meteor-fan","frost-crown"].includes(x.kind));if(safe<0)return;this.fx.splice(safe,1);}}this.fx.push(f);}
checkEvolution(){for(const [key,u]of Object.entries(EVOLUTIONS))if(this.weapons[key]>=5&&(this.passives[u.passive]||0)>=2&&!this.evolved[key]){this.evolved[key]=true;this.cool[key]=0;this.emit("evolve",{key,name:u.name});}}
reroll(){if(this.phase!=="upgrade"||this.rerolls<=0)return false;const before=this.choices;this.rerolls--;this.choices=this.offer();for(let i=0;i<4&&this.choices.join()===before.join();i++)this.choices=this.offer();this.emit("reroll");return true;}
rand(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
emit(type,data={}){this.events.push({type,...data});}
damageScale(){return 1+(this.passives.power||0)*.15+this.meta.power*.06;}
xpNeeded(lv){return 8+(lv-1)*4+Math.max(0,lv-7)*3;}
addXP(n){if(this.practice||this.phase==="result")return;this.xp+=n;while(this.xp>=this.need){this.xp-=this.need;this.level++;this.pending++;this.need=this.xpNeeded(this.level);}if(this.pending&&this.phase==="playing"){this.phase="upgrade";this.choices=this.offer();this.emit("level",{level:this.level});}}
offer(){const slots=Object.keys(this.weapons).length,capacity=weaponSlots(this.level),allowed=CLASS_SKILLS[this.hero.id];
const pool=Object.keys(UPGRADES).filter(k=>{const u=UPGRADES[k],lv=this.weapons[k]||this.passives[k]||0;return lv<5&&(u.kind!=="weapon"||allowed.includes(k)&&(lv>0||slots<capacity));});
if(!pool.length)return ["heal"];
for(let i=pool.length-1;i>0;i--){const j=Math.floor(this.rand()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
pool.sort((a,b)=>(this.offerCounts[a]||0)-(this.offerCounts[b]||0));
const chosen=[],add=k=>{if(k&&!chosen.includes(k)&&chosen.length<4)chosen.push(k);};
const discoveries=pool.filter(k=>UPGRADES[k].kind==="weapon"&&!this.weapons[k]);
add(discoveries[0]);
add(pool.find(k=>UPGRADES[k].kind==="weapon"&&this.weapons[k]));
add(pool.find(k=>Object.keys(this.weapons).some(w=>EVOLUTIONS[w]?.passive===k&&(this.passives[k]||0)<2&&!this.evolved[w])));
add(pool.find(k=>UPGRADES[k].kind==="passive"&&!chosen.includes(k)));
add(discoveries[1]);for(const key of pool)add(key);
for(const key of chosen)this.offerCounts[key]=(this.offerCounts[key]||0)+1;
return chosen;}
choose(key){if(this.phase!=="upgrade"||!this.choices.includes(key))return false;const u=UPGRADES[key];if(u?.kind==="weapon"&&(!CLASS_SKILLS[this.hero.id].includes(key)||(this.weapons[key]||0)>=5||!this.weapons[key]&&Object.keys(this.weapons).length>=weaponSlots(this.level)))return false;if(!u)this.player.hp=Math.min(this.player.maxHp,this.player.hp+35);else if(u.kind==="weapon"){this.weapons[key]=(this.weapons[key]||0)+1;this.cool[key]=0;}else{this.passives[key]=(this.passives[key]||0)+1;if(key==="heart"){this.player.maxHp+=15;this.player.hp=Math.min(this.player.maxHp,this.player.hp+30);}}
this.checkEvolution();this.pending--;this.emit("choose",{key});this.phase=this.pending>0?"upgrade":"playing";this.choices=this.pending>0?this.offer():[];return true;}
pause(){if(this.phase==="playing"){this.phase="paused";return true;}return false;}
resume(){if(this.phase==="paused"){this.phase="playing";return true;}return false;}
dash(dx=0,dy=0){const p=this.player;if(this.phase!=="playing"||p.dashCd>0)return false;const [x,y]=Math.hypot(dx,dy)>.05?norm(dx,dy):[p.dirX,p.dirY];p.dirX=x;p.dirY=y;p.dash=.18;p.inv=Math.max(p.inv,.45);p.dashCd=5;this.emit("dash");return true;}
ultimate(){if(this.phase!=="playing"||this.player.ultCd>0||this.ultimateState)return false;const p=this.player,key=this.hero.weapon,aim=this.nearest(),angle=aim?Math.atan2(aim.y-p.y,aim.x-p.x):Math.atan2(p.dirY,p.dirX);
p.ultCd=38;p.inv=Math.max(p.inv,1.1);this.shots=[];this.ultimateState={key,age:0,angle,x:p.x,y:p.y,waves:0,released:false};this.skillPose={elapsed:0,tempo:1,angle,duration:.9};
this.effect({kind:key==="blade"?"sun-cleave":key==="arrow"?"meteor-fan":"frost-crown",x:p.x,y:p.y-12,r:key==="blade"?260:key==="arrow"?420:205,angle,ttl:1.2,max:1.2,color:key==="blade"?"#ffdb90":key==="arrow"?"#aaffc7":"#ccefff"});
this.emit("ultimate",{key,hero:this.hero.id,name:this.hero.ultimateName});return true;}
advanceUltimate(dt){const s=this.ultimateState;if(!s)return;s.age+=dt;const p=this.player;
if(s.key==="arrow"){const due=s.age>=.18?Math.min(3,1+Math.floor((s.age-.18)/.20)):0;while(s.waves<due){const wave=s.waves++;this.skillPose={elapsed:.13,tempo:1,angle:s.angle,duration:.34};this.damageKey="ultimate";for(let i=0;i<7&&this.bullets.length<LIMITS.bullets;i++){const a=s.angle+(i-3)*.12+(wave-1)*.035;this.bullets.push({x:p.x+Math.cos(a)*22,y:p.y+Math.sin(a)*22,vx:Math.cos(a)*690,vy:Math.sin(a)*690,r:6,key:"arrow",ttl:1.3,damage:(22+this.level*2)*this.damageScale(),pierce:4,evolved:true,ultimate:true,hit:[]});}this.emit("ultimate-impact",{key:s.key,wave});}}
else if(!s.released&&s.age>=.30){s.released=true;this.damageKey="ultimate";const field={key:"ultimate",x:s.x,y:s.y,r:s.key==="blade"?260:205};
for(const e of this.enemies)if(e.hp>0&&d2(e,field)<(field.r+e.r)**2){if(s.key==="blade")e.stagger=Math.max(e.stagger||0,1.2);else{e.slow=Math.max(e.slow,3);e.root=Math.max(e.root||0,1);}this.hit(e,(s.key==="blade"?80+this.level*4:40+this.level*3)*this.damageScale(),field);}
if(s.key==="bolt")this.spellFields=[{x:s.x,y:s.y,r:205,ttl:4,tick:.5}];
if(this.hitStopEnabled)this.hitPause=.04;this.emit("ultimate-impact",{key:s.key});}
if(s.age>=1.1)this.ultimateState=null;}
openRift(){const p=this.player,a=this.rand()*Math.PI*2;this.rift={x:clamp(p.x+Math.cos(a)*160,90,1710),y:clamp(p.y+Math.sin(a)*160,90,1710),r:64,progress:0,life:18};this.emit("rift-open");}
advanceEncounters(dt){const p=this.player;if(!this.practice){
const chapter=Math.min(4,Math.floor(this.time/60));if(chapter>this.chapter){this.chapter=chapter;this.emit("chapter",{chapter});const a=this.rand()*Math.PI*2;for(let i=0;i<5+chapter&&this.enemies.length<LIMITS.enemies;i++){const e=this.spawn(chapter<3?"bat":i%2?"shade":"seer"),q=a+(i-(4+chapter)/2)*.16;e.x=clamp(p.x+Math.cos(q)*340,24,1776);e.y=clamp(p.y+Math.sin(q)*340,24,1776);}}
if(!this.bossSpawned&&!this.rift&&this.time>=this.nextRift){this.nextRift+=75;this.openRift();}
if(this.rift){const r=this.rift;r.life-=dt;if(d2(r,p)<r.r**2)r.progress=Math.min(3,r.progress+dt);else r.progress=Math.max(0,r.progress-dt*.35);
if(r.progress>=3){const x=r.x,y=r.y;this.rift=null;this.seals++;p.hp=Math.min(p.maxHp,p.hp+12);p.ultCd=0;for(const gem of this.gems)gem.attract=true;this.score+=150;this.effect({kind:"rift-seal",x,y,r:110,color:"#f6d88b",ttl:1,max:1});this.addXP(12+this.seals*3);this.emit("rift-sealed",{seals:this.seals});}
else if(r.life<=0){this.rift=null;this.emit("rift-expired");}}}
for(const field of this.spellFields){field.ttl-=dt;field.tick-=dt;if(field.tick<=0){field.tick+=.5;this.damageKey="ultimate";for(const e of this.enemies)if(e.hp>0&&d2(e,field)<(field.r+e.r)**2){e.slow=Math.max(e.slow,1);this.hit(e,(12+this.level*2)*this.damageScale(),field);}this.effect({kind:"frost-storm",x:field.x,y:field.y,r:field.r,ultimate:true,color:"#bdefff",ttl:.55,max:.55});}}
this.spellFields=this.spellFields.filter(f=>f.ttl>0);}
hurt(n){if(this.practice)return false;if(this.hero.id==="knight")n*=.8;const p=this.player;if(p.inv>0||this.phase!=="playing")return false;p.hp=Math.max(0,p.hp-n);p.inv=.7;this.emit("hurt",{n});if(p.hp<=0)this.finish(false);return true;}
hit(e,n,origin){if(e.hp<=0)return;const critical=!["bleed","poison-dot"].includes(this.damageKey)&&(this.passives.crit||0)>0&&this.rand()<(this.passives.crit||0)*.08;if(critical)n*=1.75;e.hp-=n;e.flash=.12;const blade=this.resolvingBlade===true,projectile=this.contactProjectile;e.hitKind=blade?"blade":this.damageKey;if(blade&&!e.boss)e.stagger=Math.max(e.stagger||0,.085);if(origin&&!e.boss){const oldX=e.x,oldY=e.y,[x,y]=norm(e.x-origin.x,e.y-origin.y);e.x+=x*(blade?17:8);e.y+=y*(blade?17:8);if(this.projectilePass)this.grid.move(e,oldX,oldY);}this.effect({kind:"text",x:e.x,y:e.y-29,n:Math.round(n),critical,color:"#fff1c8",ttl:.5,max:.5});if((this.impactCount||0)<6){this.impactCount=(this.impactCount||0)+1;this.effect({kind:blade?"cut-hit":projectile?(["arrow","multishot","piercing","poison"].includes(projectile.key)?"arrow-hit":projectile.key==="cleave"?"cut-hit":"bolt-hit"):["frost","nova"].includes(this.damageKey)?"bolt-hit":"impact",x:e.x,y:e.y-18,angle:projectile?Math.atan2(projectile.vy,projectile.vx):Math.atan2(e.y-(origin?.y||0),e.x-(origin?.x||0)),evolved:!!projectile?.evolved,key:this.damageKey,color:UPGRADES[this.damageKey]?.color||"#ffe1a0",ttl:blade?.32:projectile?.32:.23,max:blade?.32:projectile?.32:.23});}if(projectile&&this.time-(this.lastRangedContact[projectile.key]??-1)>.085){this.lastRangedContact[projectile.key]=this.time;this.emit("projectile-contact",{key:projectile.key,strong:n>=45,evolved:!!projectile.evolved,angle:Math.atan2(projectile.vy,projectile.vx)});}if(!blade&&!projectile&&this.time-(this.impactSoundAt??-1)>.085){this.impactSoundAt=this.time;this.emit("impact",{strong:n>=45,key:this.damageKey||this.hero.weapon});}
if(e.hp<=0){if(this.passives.leech&&this.time-(this.lastLeech??-1)>=1){this.lastLeech=this.time;this.player.hp=Math.min(this.player.maxHp,this.player.hp+.8+this.passives.leech*.4);}this.kills++;this.score+=e.boss?1000:e.elite?60:e.kind==="brute"?15:10;if(!e.boss&&!this.practice){this.gems.push({x:e.x,y:e.y,value:e.elite?8:e.kind==="brute"?3:1,heal:!e.elite&&this.rand()<.02,attract:false});if(e.elite&&this.pickups.length<LIMITS.pickups)this.pickups.push({kind:"chest",x:e.x,y:e.y,value:18});}this.effect({kind:"corpse",x:e.x,y:e.y,sprite:e.kind,boss:!!e.boss,elite:!!e.elite,r:e.r,color:e.color,ttl:.42,max:.42});this.effect({kind:"burst",x:e.x,y:e.y,key:this.damageKey,color:e.color,ttl:.32,max:.32});if(e.boss)this.finish(true);}}
finish(win){if(this.result)return;this.phase="result";this.result={win,seals:this.seals,kills:this.kills,level:this.level,time:Math.floor(this.time),score:this.score+Math.floor(this.time)*2+(win?3000:0),coins:runCoins(this,win)};this.emit("result",{result:this.result});}
spawn(kind,elite=false){const p=this.player,a=this.rand()*Math.PI*2,r=this.spawnDistance+this.rand()*70;let x=clamp(p.x+Math.cos(a)*r,24,1776),y=clamp(p.y+Math.sin(a)*r,24,1776);if(!this.practice&&Math.hypot(x-p.x,y-p.y)<260){x=p.x<900?1750:50;y=p.y<900?1750:50;}
const defs={shade:[25,100,13,"#c7a6e8"],bat:[17,155,10,"#a8b6e8"],brute:[62,70,20,"#e7ab8c"],seer:[36,85,14,"#98d2b0"]},d=defs[kind]||defs.shade,hp=this.practice?(kind==="brute"?90:50):(d[0]+this.time*.085)*(elite?4:1);
const e={id:++this.counter,x,y,kind,r:d[2]*(elite?1.4:1),hp,maxHp:hp,speed:d[1]*(elite?1.1:1),color:d[3],elite,slow:0,flash:0,shoot:1.5+this.rand()};this.enemies.push(e);return e;}
spawnBoss(){if(this.bossSpawned)return;this.bossSpawned=true;this.bossReinforcement=this.time+12;this.rift=null;this.enemies=[];this.shots=[];this.hazards=[];const p=this.player,e={id:++this.counter,x:clamp(p.x,80,1720),y:clamp(p.y-320,80,1720),kind:"boss",r:40,hp:5600,maxHp:5600,speed:52,color:"#c998ed",boss:true,slow:0,flash:0,shoot:2,storm:4};this.enemies.push(e);p.inv=2;this.emit("boss");return e;}
nearest(range=650){let nearest=null,best=range**2;for(const e of this.enemies)if(e.hp>0){const ds=d2(e,this.player);if(ds<best){best=ds;nearest=e;}}return nearest;}
attack(key,lv){this.damageKey=key;const p=this.player,scale=this.damageScale(),target=this.nearest(),evo=!!this.evolved[key],base=(1+.32*(lv-1))*(evo?1.4:1);if(!target&&key!=="frost")return;
if(key==="blade"){if(this.bladeSwing)return;const r=skillStats(this,key,lv,evo).r;if(this.enemies.some(e=>e.hp>0&&d2(e,p)<(r+e.r+12)**2)){const angle=Math.atan2(target.y-p.y,target.x-p.x);this.bladeSwing={id:++this.swingId,elapsed:0,r,angle,damage:23*base*scale,evolved:evo,started:false,contact:false};this.emit("blade-windup",{key,angle,id:this.swingId});}}
else if(key==="arrow"||key==="bolt"){if(this.rangedAttacks[key])return;const angle=Math.atan2(target.y-p.y,target.x-p.x),tempo=(1-(this.passives.haste||0)*.07)*(lv===5?.8:1),timing=RANGED_TIMING[key];this.rangedAttacks[key]={id:++this.rangedId,key,lv,elapsed:0,angle,targetId:target.id,tempo,releaseAt:timing.release*tempo,duration:timing.duration*tempo,evolved:evo,damage:(key==="arrow"?12:20)*base*scale,released:false};this.emit("projectile-windup",{key,angle,id:this.rangedId});}
else if(key==="orbit"){const r=(64+lv*6+(evo?20:0))*(1+(this.passives.focus||0)*.08),n=evo?6:2+Math.floor(lv/2);for(let i=0;i<n;i++){const a=this.time*2.6+i*Math.PI*2/n,o={x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r};for(const e of this.enemies)if(e.hp>0&&d2(e,o)<(e.r+16)**2)this.hit(e,10*base*scale,p);}}
else if(SKILL_BASE[key]&&this.skillTasks.length<LIMITS.tasks){const angle=target?Math.atan2(target.y-p.y,target.x-p.x):Math.atan2(p.dirY,p.dirX),stats=skillStats(this,key,lv,evo);
this.skillPose={elapsed:0,tempo:1,angle,duration:this.hero.id==="mage"?.54:.4};
this.skillTasks.push({key,lv,evolved:evo,angle,targetId:target?.id,x:target?.x??p.x,y:target?.y??p.y,delay:this.hero.id==="knight"?.14:this.hero.id==="ranger"?.13:.20,stats});
this.emit("skill-windup",{key,angle});}}
applyStatus(e,key,damage,duration,origin){if(e.hp<=0)return;e.statuses||={};const old=e.statuses[key];e.statuses[key]={key,damage:Math.max(old?.damage||0,damage),ttl:Math.max(old?.ttl||0,duration),tick:old?.tick??.5,x:origin.x,y:origin.y};}
addField(f){if(f.key!=="trap")this.skillFields=this.skillFields.filter(x=>x.key!==f.key);if(this.skillFields.length>=LIMITS.fields)this.skillFields.shift();this.skillFields.push(f);}
areaHit(field,damage,{slow=0,stagger=0,root=0}={}){this.damageKey=field.key;for(const e of this.enemies)if(e.hp>0&&d2(e,field)<(field.r+e.r)**2){e.slow=Math.max(e.slow||0,slow);e.stagger=Math.max(e.stagger||0,stagger);e.root=Math.max(e.root||0,root);this.hit(e,damage,field);if(this.phase==="result")return;}}
launchSkill(t){const p=this.player,{key,lv,evolved:evo,stats:s}=t;this.damageKey=key;
const target=this.enemies.find(e=>e.id===t.targetId&&e.hp>0)||this.nearest(),angle=target?Math.atan2(target.y-p.y,target.x-p.x):t.angle;
const shot=(a,options={})=>{if(this.bullets.length>=LIMITS.bullets)return;const speed=options.speed||480;this.bullets.push({x:p.x+Math.cos(a)*24,y:p.y+Math.sin(a)*24,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:5,key,ttl:1.8,damage:s.damage,pierce:0,evolved:evo,hit:[],...options});};
const field=(extra={})=>({key,x:target?.x??t.x,y:target?.y??t.y,r:s.r,damage:s.damage,evolved:evo,ttl:s.duration||1,age:0,tick:0,...extra});
if(key==="whirlwind"){this.addField(field({x:p.x,y:p.y,follow:true,ttl:s.duration,tick:0}));this.effect({kind:"whirlwind",x:p.x,y:p.y,r:s.r,follow:true,ttl:s.duration,max:s.duration,color:"#ffe0a5"});}
else if(key==="cleave")shot(angle,{speed:420,r:(evo?40:26)*s.area,ttl:.75,pierce:evo?12:4+lv});
else if(key==="slam")this.addField(field({x:p.x,y:p.y,delay:.22,ttl:.8}));
else if(key==="rend"){this.effect({kind:"blood-cut",x:p.x,y:p.y-18,r:s.r,angle,ttl:.4,max:.4,color:"#ef8f87"});this.resolvingBlade=true;
for(const e of this.enemies){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(e.hp>0&&d<s.r+e.r&&(d<24||(dx*Math.cos(angle)+dy*Math.sin(angle))/d>-.2)){this.hit(e,s.damage,p);this.applyStatus(e,"bleed",3*s.base*this.damageScale(),evo?5:3,p);}}this.resolvingBlade=false;}
else if(key==="multishot"){for(let i=0;i<s.count;i++)shot(angle+(i-(s.count-1)/2)*.19,{pierce:evo?2:0});}
else if(key==="piercing")shot(angle,{speed:720,r:7,ttl:1.35,pierce:evo?9:2+lv});
else if(key==="poison"){for(let i=0;i<(evo?2:1);i++)shot(angle+(i-.5)*(evo?.12:0),{speed:440,pierce:evo?2:0,dot:{key:"poison-dot",damage:3*s.base*this.damageScale(),duration:evo?6:4}});}
else if(key==="trap"){const traps=this.skillFields.filter(f=>f.key==="trap");if(traps.length>=6)this.skillFields=this.skillFields.filter(f=>f!==traps[0]);this.addField(field({x:p.x,y:p.y,ttl:12,arm:.45,trigger:46*s.area}));}
else if(key==="volley")this.addField(field({delay:.45,ttl:s.duration+.45}));
else if(key==="fireball")shot(angle,{speed:310,r:12,ttl:2.3,explosion:s.r});
else if(key==="lightning"){let o=p;const used=new Set();for(let i=0;i<s.count;i++){let next=null,best=(i?190*s.area:520)**2;for(const e of this.enemies)if(e.hp>0&&!used.has(e.id)){const ds=d2(e,o);if(ds<best){best=ds;next=e;}}if(!next)break;used.add(next.id);this.effect({kind:"line",x:o.x,y:o.y-18,x2:next.x,y2:next.y-18,color:"#dfeaff",ttl:.36,max:.36});this.hit(next,s.damage*(1-i*.045),o);o=next;}}
else if(key==="frost")this.addField(field({delay:.25,ttl:s.duration+.25}));
else if(key==="meteor")this.addField(field({delay:.7,ttl:1.3}));
else if(key==="nova"){for(let i=0;i<s.count;i++)shot(angle+i*Math.PI*2/s.count,{speed:340,r:6,ttl:.85*s.area,freeze:evo?1.4:.7,pierce:evo?2:0});this.effect({kind:"frost-crown",x:p.x,y:p.y,r:140*s.area,color:"#bdefff",ttl:.5,max:.5});}
this.emit("skill-release",{key,angle,evolved:evo});}
advanceSkills(dt){const p=this.player;
if(this.skillPose){this.skillPose.elapsed+=dt;if(this.skillPose.elapsed>=this.skillPose.duration)this.skillPose=null;}
for(const t of this.skillTasks)t.delay-=dt;const ready=this.skillTasks.filter(t=>t.delay<=0);this.skillTasks=this.skillTasks.filter(t=>t.delay>0);for(const t of ready){this.launchSkill(t);if(this.phase==="result")return;}
for(const f of this.skillFields){f.ttl-=dt;f.age+=dt;if(f.ttl<=0)continue;if(f.follow){f.x=p.x;f.y=p.y;}if(f.delay>0){f.delay-=dt;if(f.delay>0)continue;}
if(f.key==="trap"){f.arm-=dt;if(f.arm>0)continue;if(!this.enemies.some(e=>e.hp>0&&d2(e,f)<(f.trigger+e.r)**2))continue;f.ttl=0;this.areaHit(f,f.damage,{root:f.evolved?3:1.5});this.effect({kind:"trap-burst",x:f.x,y:f.y,r:f.r,color:"#ced9a3",ttl:.55,max:.55});this.emit("skill-impact",{key:f.key});}
else if(f.key==="meteor"||f.key==="slam"){if(f.done)continue;f.done=true;this.areaHit(f,f.damage,{stagger:f.key==="slam"?(f.evolved?1.2:.65):.35});this.effect({kind:f.key==="meteor"?"meteor-impact":"quake",x:f.x,y:f.y,r:f.r,color:f.key==="meteor"?"#ffac70":"#dfac7e",ttl:.75,max:.75});this.emit("skill-impact",{key:f.key});}
else{f.tick-=dt;if(f.tick>0)continue;f.tick+=f.key==="whirlwind"?.18:.4;this.areaHit(f,f.damage,{slow:f.key==="frost"?1:0});
if(f.key!=="whirlwind")this.effect({kind:f.key==="volley"?"arrow-rain":"frost-storm",x:f.x,y:f.y-(f.key==="whirlwind"?18:0),r:f.r,angle:this.time*10,color:UPGRADES[f.key].color,ttl:.4,max:.4});
if(f.key==="whirlwind"&&this.hero.id==="knight")this.skillPose={elapsed:.1,tempo:1,angle:this.time*5,duration:.34};}
if(this.phase==="result")return;}
this.skillFields=this.skillFields.filter(f=>f.ttl>0);
for(const e of this.enemies){for(const [key,dot]of Object.entries(e.statuses||{})){const alive=dot.ttl>0;dot.ttl-=dt;dot.tick-=dt;if(alive&&dot.tick<=0){dot.tick+=.5;this.damageKey=key;this.hit(e,dot.damage,dot);}if(dot.ttl<=0||e.hp<=0)delete e.statuses[key];}if(this.phase==="result")return;}}
enablePractice(key=this.hero.weapon){this.practice=true;if(!CLASS_SKILLS[this.hero.id].includes(key))key=this.hero.weapon;this.weapons={[key]:2};this.spawnDistance=key==="blade"?160:230;this.spawnCd=.7;this.nextElite=999;this.nextMagnet=999;this.cool[key]=.25;for(let i=0;i<5;i++){const e=this.spawn(i%3?"shade":"brute"),a=-1.3+i*.65,r=key==="blade"?105+i*7:185+i*9;e.x=this.player.x+Math.cos(a)*r;e.y=this.player.y+Math.sin(a)*r;}return this;}
advanceRanged(dt){const p=this.player;for(const [key,s]of Object.entries(this.rangedAttacks)){s.elapsed+=dt;
if(!s.released&&s.elapsed+1e-9>=s.releaseAt){s.released=true;const target=this.enemies.find(e=>e.id===s.targetId&&e.hp>0)||this.nearest();if(target)s.angle=Math.atan2(target.y-p.y,target.x-p.x);
const count=s.evolved&&key==="arrow"?5:1+(s.lv>=3?1:0)+(s.lv>=5?1:0),v=key==="arrow"?480:370;let launched=0;
for(let i=0;i<count&&this.bullets.length<LIMITS.bullets;i++){const angle=s.angle+(i-(count-1)/2)*.13;this.bullets.push({x:p.x+Math.cos(angle)*20,y:p.y+Math.sin(angle)*20,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,r:key==="arrow"?4:s.evolved?10:6,key,ttl:1.8,damage:s.damage,freeze:key==="bolt"?.3:0,pierce:key==="bolt"?(s.evolved?8:1+Math.floor(s.lv/2)):(s.evolved?3:Math.floor(s.lv/3)),evolved:s.evolved,hit:[]});launched++;}
if(launched){this.effect({kind:key+"-release",x:p.x+Math.cos(s.angle)*24,y:p.y+Math.sin(s.angle)*24-24,angle:s.angle,evolved:s.evolved,color:key==="arrow"?"#baf4bf":"#ade8ff",ttl:key==="arrow"?.24:.36,max:key==="arrow"?.24:.36});this.emit("projectile-release",{key,angle:s.angle,id:s.id,evolved:s.evolved,count:launched});}}
if(s.elapsed+1e-9>=s.duration)delete this.rangedAttacks[key];}}

advanceBlade(dt){const s=this.bladeSwing;if(!s)return;s.elapsed+=dt;const p=this.player;
if(!s.started&&s.elapsed+1e-9>=BLADE_TIMING.windup){s.started=true;this.effect({kind:"slash",x:p.x,y:p.y-18,r:s.r,angle:s.angle,id:s.id,evolved:s.evolved,color:"#f6cf86",ttl:.27,max:.27});this.emit("blade-swing",{key:"blade",angle:s.angle,id:s.id});}
if(!s.contact&&s.elapsed+1e-9>=BLADE_TIMING.contact){s.contact=true;this.damageKey="blade";this.resolvingBlade=true;const list=this.enemies.filter(e=>{if(e.hp<=0||d2(e,p)>=(s.r+e.r)**2)return false;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);return d<24||(dx*Math.cos(s.angle)+dy*Math.sin(s.angle))/d>Math.cos(s.evolved?2.25:1.65)-e.r/d;});for(const e of list)this.hit(e,s.damage,p);this.resolvingBlade=false;
if(list.length){if(this.hitStopEnabled)this.hitPause=s.evolved?.038:.024;this.emit("blade-contact",{key:"blade",hits:list.length,angle:s.angle,id:s.id,strong:s.evolved||s.damage>=45,evolved:s.evolved});}}
if(s.elapsed+1e-9>=BLADE_TIMING.duration)this.bladeSwing=null;
}
step(delta,input={x:0,y:0}){if(this.phase!=="playing")return;const dt=Number.isFinite(delta)?clamp(delta,0,.05):0,p=this.player;if(this.hitPause>0){this.hitPause=Math.max(0,this.hitPause-dt);return;}this.time+=dt;if(this.practice&&this.time>=15){this.finish(false);return;}this.impactCount=0;p.inv=Math.max(0,p.inv-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.ultCd=Math.max(0,p.ultCd-dt);
let ix=Number.isFinite(input.x)?input.x:0,iy=Number.isFinite(input.y)?input.y:0,mag=Math.hypot(ix,iy);if(mag>1){ix/=mag;iy/=mag;}if(mag>.05&&p.dash<=0)[p.dirX,p.dirY]=norm(ix,iy);if(p.dash>0){ix=p.dirX;iy=p.dirY;p.dash=Math.max(0,p.dash-dt);}
if(p.dash>0&&this.time-(this.ghostAt??-1)>.04){this.ghostAt=this.time;this.effect({kind:"ghost",x:p.x,y:p.y,face:p.dirX>=0?1:-1,color:"#b4f5d3",ttl:.22,max:.22});}const v=p.speed*(1+(this.passives.boots||0)*.08)*(p.dash>0?4.2:1);const beforeX=p.x,beforeY=p.y;p.x=clamp(p.x+ix*v*dt,25,1775);p.y=clamp(p.y+iy*v*dt,25,1775);const travelled=Math.hypot(p.x-beforeX,p.y-beforeY);p.moving=travelled>.001;p.walkDistance+=travelled;if(p.moving&&Math.abs(ix)>.05)p.facing=ix>0?1:-1;
this.advanceEncounters(dt);if(this.phase!=="playing")return;this.advanceUltimate(dt);if(this.phase==="result")return;this.advanceBlade(dt);if(this.phase==="result")return;this.advanceRanged(dt);if(this.phase==="result")return;this.advanceSkills(dt);if(this.phase==="result")return;
if(this.time>=300&&!this.bossSpawned)this.spawnBoss();if(!this.bossSpawned){this.spawnCd-=dt;if(this.spawnCd<=0){this.spawnCd=Math.max(.24,.8-this.time*.0018);for(let batch=0;batch<(this.practice?1:this.time>=210?3:this.time>=90?2:1);batch++)if(this.enemies.length<LIMITS.enemies){const r=this.rand();this.spawn(this.practice?(r<.3?"brute":"shade"):this.time<30?"shade":r<.25?"bat":r<.45?"brute":r<.58?"seer":"shade");}}if(this.time>=this.nextElite){this.nextElite+=60;if(this.enemies.length<LIMITS.enemies)this.spawn("brute",true);this.emit("elite");}}
if(this.bossSpawned&&this.time>=this.bossReinforcement){this.bossReinforcement+=12;for(let i=0;i<7&&this.enemies.length<LIMITS.enemies;i++)this.spawn(i<2?"bat":"shade");this.emit("reinforcements");}
if(!this.bossSpawned&&this.time>=this.nextMagnet){this.nextMagnet+=90;if(this.pickups.length<LIMITS.pickups)this.pickups.push({kind:"magnet",x:clamp(p.x+140,25,1775),y:p.y,value:0});this.emit("supply");}
for(const [key,lv]of Object.entries(this.weapons)){this.cool[key]=(this.cool[key]||0)-dt;if(this.cool[key]<=0){this.attack(key,lv);this.cool[key]=skillStats(this,key,lv).cooldown;}if(this.phase==="result")return;}
for(const e of this.enemies){if(e.hp<=0)continue;e.slow=Math.max(0,e.slow-dt);e.flash=Math.max(0,e.flash-dt);e.shoot-=dt;e.stagger=Math.max(0,(e.stagger||0)-dt);e.root=Math.max(0,(e.root||0)-dt);const [dx,dy]=norm(p.x-e.x,p.y-e.y),dist=Math.hypot(p.x-e.x,p.y-e.y),phase2=e.boss&&e.hp<e.maxHp*.5,speed=e.speed*(this.practice?1:1+Math.min(300,this.time)*.00055)*(e.stagger>0||e.root>0?0:1)*(e.slow>0?.45:1)*(phase2?1.4:1);if(e.elite&&!e.boss){
if(e.charge){const charge=e.charge;charge.age+=dt;if(charge.age>=.7&&charge.age<1.02&&e.root<=0&&e.stagger<=0){e.x=clamp(e.x+Math.cos(charge.angle)*350*dt,24,1776);e.y=clamp(e.y+Math.sin(charge.angle)*350*dt,24,1776);}if(charge.age>=1.02)e.charge=null;}
else if(e.shoot<=0&&dist<330&&e.stagger<=0){e.shoot=3.8;e.charge={age:0,angle:Math.atan2(p.y-e.y,p.x-e.x)};}
}
if(e.boss){e.chargeCd=(e.chargeCd??7)-dt;if(e.chargeCd<=0&&!e.charge&&dist<420){e.chargeCd=phase2?6:9;e.charge={age:0,angle:Math.atan2(p.y-e.y,p.x-e.x)};}if(e.charge){const charge=e.charge;charge.age+=dt;if(charge.age>=.9&&charge.age<1.28&&e.stagger<=0&&e.root<=0){e.x=clamp(e.x+Math.cos(charge.angle)*400*dt,24,1776);e.y=clamp(e.y+Math.sin(charge.angle)*400*dt,24,1776);}if(charge.age>=1.28)e.charge=null;}}
if(!e.charge){const flank=!e.boss&&(e.kind==="bat"||e.kind==="shade")&&dist>120?(e.id%2?1:-1)*(e.kind==="bat"?.38:.18):0;
const moveX=dx-dy*flank,moveY=dy+dx*flank;if(e.kind==="seer"&&dist<160){e.x-=dx*speed*dt;e.y-=dy*speed*dt;}else if(e.kind!=="seer"||dist>250){e.x+=moveX*speed*dt;e.y+=moveY*speed*dt;}}
if(dist<e.r+p.r)this.hurt(e.boss?24:e.elite?18:e.kind==="brute"?14:9);if(this.phase==="result")return;
if((e.kind==="seer"||e.boss)&&e.shoot<=0){e.shoot=e.boss?(phase2?1.9:2.8):3.3;const count=e.boss?(phase2?12:8):this.time>=60?3:1,angle=e.boss?this.time*.5:Math.atan2(p.y-e.y,p.x-e.x);for(let i=0;i<count&&this.shots.length<LIMITS.shots;i++){const a=angle+(e.boss?i*Math.PI*2/count:(i-(count-1)/2)*.18);this.shots.push({x:e.x,y:e.y,vx:Math.cos(a)*165,vy:Math.sin(a)*165,r:6,ttl:5,damage:e.boss?13:8});}}
if(e.boss){e.storm-=dt;if(e.storm<=0){e.storm=phase2?3:4;this.hazards.push({x:p.x,y:p.y,r:55,delay:1.1,life:.65,damage:25});}}}
const useGrid=this.bullets.length*this.enemies.length>=4096;if(useGrid)this.grid.rebuild(this.enemies);this.projectilePass=useGrid;this.metrics.collisionChecks=0;
for(const b of this.bullets){b.ttl-=dt;const ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;const nearby=useGrid?this.grid.query(Math.min(ox,b.x)-64,Math.min(oy,b.y)-64,Math.max(ox,b.x)+64,Math.max(oy,b.y)+64,this.candidates):this.enemies;for(const e of nearby){if(e.hp<=0||b.ttl<=0||b.hit.includes(e.id))continue;this.metrics.collisionChecks++;const vx=b.x-ox,vy=b.y-oy,len=vx*vx+vy*vy,u=len?clamp(((e.x-ox)*vx+(e.y-oy)*vy)/len,0,1):0;if((ox+u*vx-e.x)**2+(oy+u*vy-e.y)**2<(e.r+b.r)**2){b.hit.push(e.id);this.damageKey=b.key;this.contactProjectile=b;if(b.explosion){this.contactProjectile=null;const field={key:b.key,x:ox+u*vx,y:oy+u*vy,r:b.explosion};this.areaHit(field,b.damage);this.effect({kind:"fire-burst",x:field.x,y:field.y,r:field.r,color:"#ffac70",ttl:.55,max:.55});this.emit("skill-impact",{key:b.key});b.ttl=0;}else{this.hit(e,b.damage,p);if(b.dot)this.applyStatus(e,b.dot.key,b.dot.damage,b.dot.duration,p);if(b.freeze&&e.hp>0)e.root=Math.max(e.root||0,b.freeze);}this.contactProjectile=null;if(b.pierce--<=0)b.ttl=0;if(this.phase==="result")return;}}}
this.projectilePass=false;
for(const b of this.shots){b.ttl-=dt;const ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;const vx=b.x-ox,vy=b.y-oy,len=vx*vx+vy*vy,u=len?clamp(((p.x-ox)*vx+(p.y-oy)*vy)/len,0,1):0;if((ox+u*vx-p.x)**2+(oy+u*vy-p.y)**2<(b.r+p.r)**2&&this.hurt(b.damage))b.ttl=0;if(this.phase==="result")return;}
for(const h of this.hazards){h.delay-=dt;if(h.delay<=0){h.life-=dt;if(d2(h,p)<(h.r+p.r)**2)this.hurt(h.damage);}}
for(const item of this.pickups){if(d2(item,p)<32**2){item.dead=true;if(item.kind==="magnet"){for(const gem of this.gems)gem.attract=true;this.emit("magnet");}else{this.addXP(item.value);p.hp=Math.min(p.maxHp,p.hp+20);this.emit("chest");}}}this.pickups=this.pickups.filter(item=>!item.dead);
const collect=85+(this.passives.magnet||0)*25+this.meta.fortune*8;
for(const gem of this.gems){const ds=d2(gem,p);if(ds<collect**2)gem.attract=true;if(gem.attract){const [x,y]=norm(p.x-gem.x,p.y-gem.y);gem.x+=x*390*dt;gem.y+=y*390*dt;}if(ds<20**2||d2(gem,p)<20**2){gem.dead=true;if(gem.heal){p.hp=Math.min(p.maxHp,p.hp+(gem.healValue||10));this.emit("heal");}else this.addXP(gem.value);}}
this.gems=this.gems.filter(g=>!g.dead);if(this.gems.length>LIMITS.gems){const xp=this.gems.filter(g=>!g.heal),heals=this.gems.filter(g=>g.heal);if(heals.length>40){const merged=heals.splice(0,heals.length-39);heals.push({x:merged[0].x,y:merged[0].y,value:0,heal:true,healValue:merged.reduce((n,g)=>n+(g.healValue||10),0),attract:false});}const excess=xp.splice(0,Math.max(0,xp.length-(LIMITS.gems-1-heals.length)));if(excess.length)xp.push({x:clamp(p.x+100,25,1775),y:p.y,value:excess.reduce((s,g)=>s+g.value,0),heal:false,attract:false});this.gems=[...heals,...xp];}
this.enemies=this.enemies.filter(e=>e.hp>0);this.bullets=this.bullets.filter(b=>b.ttl>0);this.shots=this.shots.filter(b=>b.ttl>0);this.hazards=this.hazards.filter(h=>h.life>0);for(const f of this.fx)f.ttl-=dt;this.fx=this.fx.filter(f=>f.ttl>0).slice(-LIMITS.fx);
}}
