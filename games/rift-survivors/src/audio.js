import {STAGE_SKILLS} from "./campaign.js";
export const SAMPLES=["swish-a","swish-b","swish-c","blade-hit-a","blade-hit-b","arrow","magic","frost","thunder","ultimate","hurt","reward","select","boss","ambience","arrow-release","arrow-hit","bolt-release","bolt-hit","arrow-flight","fire-cast","fire-impact","ice-impact","stone-impact","poison-impact","whirlwind","void-cast","void-impact","steel-return"];
export class Audio{
constructor(){this.context=null;this.enabled=true;this.timer=null;this.voices=new Set();this.delayed=new Set();this.buffers=new Map();this.promise=null;this.ambientVoice=null;this.epoch=0;this.wantsPlayback=false;this.lastImpact=-1;this.lastRangedImpact={};this.lastSkillPulse={};this.stats={played:0,maxVoices:0,lastSample:null};}
createContext(){if(this.context)return this.context;const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;const c=this.context=new Context(),compressor=c.createDynamicsCompressor();compressor.threshold.value=-13;compressor.knee.value=18;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.16;this.master=c.createGain();this.master.gain.value=.72;this.output=compressor;this.master.connect(compressor);compressor.connect(c.destination);return c;}
prepare(){if(this.promise)return this.promise;const c=this.createContext();if(!c)return Promise.resolve();this.promise=Promise.all(SAMPLES.map(async name=>{if(this.buffers.has(name))return;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);try{const response=await fetch(new URL("audio/"+name+".mp3?v=4.0.0",document.baseURI),{signal:controller.signal});if(!response.ok)throw new Error("Audio unavailable: "+name);const bytes=await response.arrayBuffer(),buffer=await c.decodeAudioData(bytes);this.buffers.set(name,buffer);}finally{clearTimeout(timer);}})).catch(error=>{this.promise=null;throw error;});return this.promise;}
unlock(){if(!this.enabled||document.hidden)return;this.wantsPlayback=true;const epoch=this.epoch,c=this.createContext();if(!c)return;const resume=c.resume();Promise.all([resume,this.prepare()]).then(()=>{if(this.enabled&&this.wantsPlayback&&!document.hidden&&epoch===this.epoch)this.music();}).catch(()=>{});}
play(name,{gain=.4,rate=1,delay=0,group="effects",loop=false}={}){
const c=this.context,buffer=this.buffers.get(name);if(!this.enabled||!this.wantsPlayback||!c||c.state!=="running"||document.hidden||!buffer)return null;
const peers=[...this.voices].filter(s=>s.category===group),limit=group==="thunder"?2:group==="magic"?3:group==="impact"?2:group==="swing"?2:group==="flight"?3:group==="bow"?2:group==="ambient"?1:4;
if(peers.length>=limit){const oldest=peers[0];oldest.volume.gain.cancelScheduledValues(c.currentTime);oldest.volume.gain.setTargetAtTime(0,c.currentTime,.009);try{oldest.stop(c.currentTime+.04);}catch{}}
if(this.voices.size>=18)return null;
const source=c.createBufferSource(),volume=c.createGain(),when=c.currentTime+delay,duration=buffer.duration/rate;
source.buffer=buffer;source.playbackRate.value=rate;source.loop=loop;source.category=group;source.volume=volume;
volume.gain.setValueAtTime(0,c.currentTime);volume.gain.setValueAtTime(0,when);volume.gain.linearRampToValueAtTime(gain,when+(loop?.8:group==="swing"||group==="impact"?.003:.008));
if(!loop){const fade=Math.min(.08,duration*.2);volume.gain.setValueAtTime(gain,when+Math.max(.015,duration-fade));volume.gain.linearRampToValueAtTime(0,when+duration);}
source.connect(volume);volume.connect(this.master);this.voices.add(source);source.onended=()=>{source.disconnect();volume.disconnect();this.voices.delete(source);if(this.ambientVoice===source)this.ambientVoice=null;};
source.start(when);if(!loop)source.stop(when+duration+.01);this.stats.played++;this.stats.maxVoices=Math.max(this.stats.maxVoices,this.voices.size);this.stats.lastSample=name;return source;
}
music(){if(this.ambientVoice||!this.enabled||!this.wantsPlayback)return;this.ambientVoice=this.play("ambience",{gain:.09,group:"ambient",loop:true});}
stop(){this.wantsPlayback=false;this.epoch++;clearInterval(this.timer);this.timer=null;for(const id of this.delayed)clearTimeout(id);this.delayed.clear();const c=this.context;for(const source of this.voices){try{source.stop();}catch{}source.disconnect();source.volume?.disconnect();}this.voices.clear();this.ambientVoice=null;c?.suspend().catch(()=>{});}
set(enabled){this.enabled=enabled;if(enabled)this.unlock();else this.stop();}
duck(){const c=this.context,voice=this.ambientVoice;if(!c||!voice)return;const gain=voice.volume.gain,t=c.currentTime;gain.cancelScheduledValues(t);gain.setTargetAtTime(.024,t,.012);gain.setTargetAtTime(.09,t+.20,.14);}
arrowFlight({rate=1,gain=.58}={}){this.play("arrow-release",{gain:.12,rate,group:"bow"});this.play("arrow-flight",{gain,rate,delay:.012,group:"flight"});}
event(type,key,data={}){
if(STAGE_SKILLS[key]&&["skill-release","skill-impact","skill-pulse","projectile-contact","impact"].includes(type)){const u=STAGE_SKILLS[key],now=this.context?.currentTime||0,gate=type==="skill-release"?"release:"+key:"stage-impact";if(type!=="skill-release"&&now-(this.lastSkillPulse[gate]??-1)<.14)return;this.lastSkillPulse[gate]=now;const release=type==="skill-release",gain=release?.34:type==="skill-pulse"?.18:.30;if(u.hero==="knight"){this.play(release?"swish-c":"blade-hit-a",{gain,rate:key==="thousand"?1.15:key==="judgment"?.88:1.04,group:release?"swing":"impact"});if(key==="judgment"&&!release)this.play("stone-impact",{gain:.28,rate:.9,group:"magic"});}
else if(u.hero==="ranger"){if(release||type==="skill-pulse")this.arrowFlight({gain:key==="ballista"?.63:.45,rate:key==="ballista"?.86:1.08});else this.play(key==="explosive"?"fire-impact":"arrow-hit",{gain,group:"impact"});if(key==="stormbow"&&!release)this.play("thunder",{gain:.32,group:"thunder"});if(key==="falcon"&&release)this.play("swish-b",{gain:.24,rate:1.2,group:"swing"});}
else{this.play(["gravity","blackflame"].includes(key)?release?"void-cast":"void-impact":release?"frost":"ice-impact",{gain,rate:key==="dragon"?.82:1,group:"magic"});if(key==="dragon"&&release)this.play("thunder",{gain:.25,rate:.8,group:"thunder"});}if(!release)this.duck();return;}
if(type==="stage-clear"){this.play("reward",{gain:.34,group:"reward"});return;}
if(type==="stage-start"){this.play("boss",{gain:.20,rate:.9,group:"magic"});this.play("reward",{gain:.22,delay:.12,group:"reward"});return;}
if(type==="enemy-burst"){const now=this.context?.currentTime||0;if(now-(this.lastSkillPulse.burst??-1)>.2){this.lastSkillPulse.burst=now;this.play("fire-impact",{gain:.25,group:"impact"});}return;}

const pitch=()=>.95+Math.random()*.10;
if(type==="skill-release"){
if(key==="whirlwind"){this.play("whirlwind",{gain:.36,group:"swing"});this.play("swish-a",{gain:.25,group:"swing"});}
else if(["cleave","rend","hammer","glaive"].includes(key))this.play(key==="hammer"||key==="glaive"?"steel-return":key==="rend"?"swish-c":"swish-a",{gain:.44,group:"swing"});
else if(key==="fissure")this.play("swish-b",{gain:.27,rate:.86,group:"swing"});
else if(["multishot","piercing","poison","volley","ricochet"].includes(key))this.arrowFlight({gain:key==="multishot"?.61:.55,rate:key==="piercing"?1.14:.98});
else if(key==="trap")this.play("arrow-release",{gain:.12,rate:.9,group:"bow"});
else if(key==="lightning"){this.duck();this.play("ice-impact",{gain:.15,rate:1.12,group:"magic"});this.play("thunder",{gain:data.evolved?.62:.53,group:"thunder"});}
else if(["frost","nova"].includes(key))this.play("frost",{gain:key==="nova"?.36:.28,group:"magic"});
else if(key==="fireball"||key==="pyre")this.play("fire-cast",{gain:.39,group:"magic"});
else if(key==="beam")this.play("void-cast",{gain:.31,group:"magic"});
else if(key==="meteor")this.play("fire-cast",{gain:.24,rate:.83,group:"magic"});
}
else if(type==="skill-impact"){this.duck();
const now=this.context?.currentTime||0;if(now-(this.lastSkillPulse["impact:"+key]??-1)<.16)return;this.lastSkillPulse["impact:"+key]=now;
if(["fireball","pyre"].includes(key))this.play("fire-impact",{gain:key==="pyre"?.36:.44,group:"magic"});
else if(key==="meteor"){this.play("stone-impact",{gain:.43,group:"impact"});this.play("fire-impact",{gain:.32,rate:.88,group:"magic"});}
else if(["slam","fissure"].includes(key))this.play("stone-impact",{gain:key==="slam"?.44:.35,group:"impact"});
else if(key==="lightning")this.play("thunder",{gain:.26,rate:1.12,group:"thunder"});
else if(key==="rend")this.play("blade-hit-b",{gain:.30,rate:.84,group:"impact"});
else if(key==="trap")this.play("arrow-hit",{gain:.45,rate:.9,group:"impact"});
}
else if(type==="skill-pulse"){const now=this.context?.currentTime||0;if(now-(this.lastSkillPulse[key]??-1)<.30)return;this.lastSkillPulse[key]=now;if(key==="beam")this.play("void-impact",{gain:.13,rate:.9,group:"magic"});}
else if(type==="attack"){
if(["blade","arrow","bolt"].includes(key))return;
else if(key==="lightning")this.play("thunder",{gain:.53,group:"thunder"});
else if(key==="frost")this.play("frost",{gain:.27,group:"magic"});
}
else if(type==="projectile-release"){const rate=.98+((data.id||0)%3)*.02;if(key==="arrow")this.arrowFlight({rate});else this.play("bolt-release",{gain:.36,rate,group:"magic"});}
else if(type==="projectile-contact"){const arrow=["arrow","multishot","piercing","poison","ricochet"].includes(key);if(!arrow&&!["bolt","nova","cleave","hammer","glaive","slam"].includes(key))return;const now=this.context?.currentTime||0;if(now-(this.lastRangedImpact[key]??-1)<.11)return;this.lastRangedImpact[key]=now;this.duck();this.play(["cleave","hammer","glaive"].includes(key)?"blade-hit-a":key==="slam"?"stone-impact":key==="poison"?"poison-impact":arrow?"arrow-hit":"bolt-hit",{gain:(arrow?.20:.40)+(data.strong?.05:0),rate:1.02,group:"impact"});}
else if(type==="blade-swing"){this.play(["swish-a","swish-b","swish-c"][(data.id||0)%3],{gain:.46,rate:.97+((data.id||0)%3)*.025,group:"swing"});}
else if(type==="blade-contact"){if(!data.hits)return;this.duck();this.play((data.id||0)%2?"blade-hit-a":"blade-hit-b",{gain:data.strong?.68:.57,rate:1.02+((data.id||0)%3)*.018,group:"impact"});}
else if(type==="impact"){if(["blade","arrow","bolt","ultimate","orbit","bleed","poison-dot","lightning","whirlwind","frost","volley","trap","meteor","fireball","slam"].includes(key))return;const now=this.context?.currentTime||0;if(now-this.lastImpact<.20)return;this.lastImpact=now;if(key==="rend")this.play("blade-hit-b",{gain:.38,rate:1.04,group:"impact"});}
else if(["level","choose","evolve","awaken","chest","magnet"].includes(type))this.play("reward",{gain:type==="evolve"||type==="awaken"?.23:.16,group:"reward"});
else if(type==="select"||type==="reroll")this.play("select",{gain:.18,group:"ui"});
else if(type==="hurt")this.play("hurt",{gain:.35,rate:.9,group:"impact"});
else if(type==="ultimate"){this.duck();this.play(key==="blade"?"swish-c":key==="arrow"?"arrow-release":"magic",{gain:key==="blade"?.42:.28,rate:key==="bolt"?.82:1,group:"magic"});}
else if(type==="ultimate-impact"){this.duck();if(key==="blade"){this.play("stone-impact",{gain:.45,group:"magic"});this.play("blade-hit-a",{gain:.54,rate:1.04,group:"impact"});}else if(key==="arrow")this.arrowFlight({gain:.64,rate:1.05});else{this.play("frost",{gain:.5,group:"magic"});this.play("thunder",{gain:.20,rate:1.12,group:"thunder"});}}
else if(type==="rift-open")this.play("magic",{gain:.14,rate:.75,group:"magic"});
else if(type==="rift-sealed")this.play("reward",{gain:.25,group:"reward"});
else if(type==="dash")this.play("swish-b",{gain:.28,rate:1.32,group:"swing"});
else if(type==="boss")this.play("boss",{gain:.30,group:"magic"});
}
}
