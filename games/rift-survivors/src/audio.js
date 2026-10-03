export const SAMPLES=["swish-a","swish-b","swish-c","blade-hit-a","blade-hit-b","arrow","magic","frost","thunder","ultimate","hurt","reward","select","boss","ambience","arrow-release","arrow-hit","bolt-release","bolt-hit","arrow-flight","fire-cast","fire-impact","ice-impact","stone-impact","poison-impact","whirlwind","void-cast","void-impact","steel-return"];
// Attack, continuous motion, contact and scenery have separate mix roles.
// Every combat sound is recorded Foley: no oscillator, UI note or random pitch.
export const AUDIO_DESIGN={version:"5.1.0",maxVoices:18,contactSpacing:.065,sustainSpacing:.30,materials:{
blade:"steel",whirlwind:"steel",cleave:"steel",slam:"stone",rend:"steel",orbit:"steel",hammer:"steel",fissure:"stone",
arrow:"arrow",multishot:"arrow",piercing:"arrow",poison:"poison",trap:"thorn",volley:"arrow",ricochet:"arrow",glaive:"steel",
bolt:"ice",fireball:"fire",lightning:"thunder",frost:"ice",meteor:"fire-stone",nova:"ice",beam:"void",pyre:"fire",
crosscut:"steel",explosive:"fire-arrow",spirit:"ice-spirit",phantom:"steel",falcon:"talon",blackflame:"void-fire",
judgment:"greatsteel",stormbow:"thunder-arrow",gravity:"void-stone",thousand:"greatsteel",ballista:"heavy-arrow",dragon:"ice-breath"}};
const AUDIO_GROUPS={ambient:1,ui:2,reward:2,swing:3,bow:2,flight:4,magic:4,impact:4,thunder:2,sustain:3,effects:4};
const AUDIO_PRIORITY={ambient:0,sustain:2,flight:3,swing:4,bow:4,magic:4,effects:4,ui:5,reward:5,impact:6,thunder:6};
const AUDIO_DOTS=new Set(["bleed","poison-dot","burn","thorns"]);
const AUDIO_CONTINUOUS=new Set(["orbit","whirlwind","frost","volley","beam","blackflame","gravity","dragon"]);
const CONTACT_PROFILES={
blade:["blade-hit-a",.48,.12],whirlwind:["blade-hit-a",.17,.30],cleave:["blade-hit-a",.31,.16],slam:["stone-impact",.17,.22],
rend:["blade-hit-b",.36,.20],orbit:["blade-hit-a",.20,.30],hammer:["blade-hit-b",.34,.20],fissure:["stone-impact",.16,.20],
arrow:["arrow-hit",.20,.13],multishot:["arrow-hit",.19,.15],piercing:["arrow-hit",.27,.16],poison:["poison-impact",.24,.22],
trap:["arrow-hit",.28,.22],volley:["arrow-hit",.16,.26],ricochet:["arrow-hit",.20,.16],glaive:["blade-hit-a",.26,.18],
bolt:["bolt-hit",.35,.15],fireball:["fire-impact",.15,.23],lightning:["ice-impact",.16,.22],frost:["ice-impact",.14,.38],
meteor:["stone-impact",.16,.25],nova:["ice-impact",.29,.18],beam:["void-impact",.12,.32],pyre:["fire-impact",.14,.28],
crosscut:["blade-hit-a",.32,.15],explosive:["arrow-hit",.22,.20],spirit:["ice-impact",.25,.19],phantom:["blade-hit-b",.29,.16],
falcon:["blade-hit-a",.24,.20],blackflame:["void-impact",.14,.35],judgment:["blade-hit-b",.37,.21],
stormbow:["arrow-hit",.23,.20],gravity:["void-impact",.13,.38],thousand:["blade-hit-a",.30,.15],
ballista:["arrow-hit",.40,.22],dragon:["ice-impact",.23,.34]};
const audioClamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// Resampling and filters run once after decoding; the gameplay loop reuses buffers.
function recordedMix(context,raw,layers,duration){
const rate=context.sampleRate||44100,length=Math.ceil(duration*rate),buffer=context.createBuffer(1,length,rate),out=buffer.getChannelData(0);
for(const layer of layers){const source=raw.get(layer.name);if(!source)continue;const data=source.getChannelData(0),speed=layer.rate||1,offset=layer.offset||0,start=Math.round((layer.delay||0)*rate),span=Math.min(layer.duration||duration,(source.duration-offset)/speed),count=Math.min(length-start,Math.floor(span*rate));let lastX=0,lastY=0,low=0;const high=layer.high||0,highA=high?1/(1+2*Math.PI*high/rate):0,lowA=layer.low?1-Math.exp(-2*Math.PI*layer.low/rate):1;
for(let i=0;i<count;i++){const pos=(offset+i/rate*speed)*source.sampleRate,j=Math.floor(pos),fraction=pos-j;let x=(data[j]||0)*(1-fraction)+(data[j+1]||0)*fraction;if(high){const y=highA*(lastY+x-lastX);lastX=x;lastY=y;x=y;}low+=lowA*(x-low);const attack=Math.min(1,i/(rate*.008)),release=Math.min(1,(count-i)/(rate*.055));out[start+i]+=low*(layer.gain??1)*attack*release;}
}
let peak=0;for(const x of out)peak=Math.max(peak,Math.abs(x));const scale=peak>.90?.90/peak:1;for(let i=0;i<out.length;i++)out[i]*=scale;return buffer;
}
export class Audio{
constructor(){this.context=null;this.enabled=true;this.timer=null;this.voices=new Set();this.retiring=new Set();this.delayed=new Set();this.buffers=new Map();this.palette=new Map();this.promise=null;this.ambientVoice=null;this.epoch=0;this.wantsPlayback=false;this.lastImpact=-1;this.lastContact=-1;this.lastRangedImpact={};this.lastSkillPulse={};this.stats={played:0,maxVoices:0,lastSample:null,dropped:0,stolen:0};}
createContext(){if(this.context)return this.context;const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;const c=this.context=new Context(),compressor=c.createDynamicsCompressor();compressor.threshold.value=-15;compressor.knee.value=15;compressor.ratio.value=4;compressor.attack.value=.005;compressor.release.value=.18;this.master=c.createGain();this.master.gain.value=.70;this.output=compressor;this.master.connect(compressor);compressor.connect(c.destination);return c;}
prepare(){if(this.promise)return this.promise;const c=this.createContext();if(!c)return Promise.resolve();this.promise=Promise.all(SAMPLES.map(async name=>{if(this.buffers.has(name))return;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);try{const response=await fetch(new URL("audio/"+name+".mp3?v=4.0.0",document.baseURI),{signal:controller.signal});if(!response.ok)throw new Error("Audio unavailable: "+name);const bytes=await response.arrayBuffer(),buffer=await c.decodeAudioData(bytes);this.buffers.set(name,buffer);}finally{clearTimeout(timer);}})).then(()=>{this.buildPalette(c);}).catch(error=>{this.promise=null;throw error;});return this.promise;}
buildPalette(c){if(this.palette.size)return;const raw=new Map(this.buffers),mix=(name,layers,duration)=>this.palette.set(name,recordedMix(c,raw,layers,duration));
mix("bolt-release",[{name:"arrow-flight",gain:.70,rate:1.13,high:300},{name:"frost",gain:.18,offset:.12,rate:1.32,high:650},{name:"swish-b",gain:.22,rate:1.10,high:350}],.46);
mix("bolt-hit",[{name:"ice-impact",gain:.80,rate:1.12,high:150},{name:"void-impact",gain:.16,offset:.20,rate:1.08,low:2600},{name:"arrow-hit",gain:.13,rate:1.07}],.49);
mix("greatblade-air",[{name:"swish-c",gain:.75,rate:.76,high:160},{name:"steel-return",gain:.20,rate:.92,high:400}],.53);
mix("ballista-launch",[{name:"arrow-flight",gain:.88,rate:.76,high:120},{name:"steel-return",gain:.27,rate:.82,high:140},{name:"arrow-release",gain:.22,rate:.75,low:3600}],.70);
mix("spirit-flight",[{name:"arrow-flight",gain:.65,rate:.91,high:420},{name:"frost",gain:.16,rate:1.28,high:750},{name:"void-cast",gain:.12,rate:1.14,low:1800}],.53);
mix("dragon-breath",[{name:"whirlwind",gain:.48,rate:.87,offset:.07,high:90,low:6200},{name:"fire-cast",gain:.20,rate:.85,high:90,low:2600},{name:"frost",gain:.26,rate:.92,high:400}],1.28);
mix("gravity-collapse",[{name:"stone-impact",gain:.58,rate:.79,low:4300},{name:"void-impact",gain:.43,rate:.81,low:2800}],1.15);
// The legacy bolt API names stay stable, but the old tonal spell recordings
// are replaced by cached mixes of air movement and ice fracture.
this.buffers.set("bolt-release",this.palette.get("bolt-release"));this.buffers.set("bolt-hit",this.palette.get("bolt-hit"));
}
unlock(){if(!this.enabled||document.hidden)return;this.wantsPlayback=true;const epoch=this.epoch,c=this.createContext();if(!c)return;const resume=c.resume();Promise.all([resume,this.prepare()]).then(()=>{if(this.enabled&&this.wantsPlayback&&!document.hidden&&epoch===this.epoch)this.music();}).catch(()=>{});}
retire(source,when){if(!source)return;this.voices.delete(source);this.retiring.add(source);source.volume.gain.cancelScheduledValues(when);source.volume.gain.setTargetAtTime(0,when,.002);try{source.stop(when+.009);}catch{}this.stats.stolen++;}
play(name,{gain=.4,rate=1,delay=0,group="effects",loop=false,priority=AUDIO_PRIORITY[group]??4,offset=0,duration=null,high=0,low=0}={}){
const c=this.context,buffer=this.palette.get(name)||this.buffers.get(name);if(!this.enabled||!this.wantsPlayback||!c||c.state!=="running"||document.hidden||!buffer)return null;
rate=audioClamp(rate,.60,1.65);gain=audioClamp(gain,0,.85);offset=audioClamp(offset,0,Math.max(0,buffer.duration-.02));let when=c.currentTime+Math.max(0,delay);
const peers=[...this.voices].filter(s=>s.category===group),limit=AUDIO_GROUPS[group]||4,byImportance=(a,b)=>a.priority-b.priority||a.born-b.born;
let victim=peers.length>=limit?peers.sort(byImportance)[0]:null;
if(!victim&&this.voices.size>=AUDIO_DESIGN.maxVoices)victim=[...this.voices].sort(byImportance)[0];
if(victim){if(victim.priority>priority){this.stats.dropped++;return null;}this.retire(victim,c.currentTime);when=Math.max(when,c.currentTime+.010);}
if(this.voices.size>=AUDIO_DESIGN.maxVoices){this.stats.dropped++;return null;}
const source=c.createBufferSource(),volume=c.createGain(),span=Math.min(duration??(buffer.duration-offset)/rate,(buffer.duration-offset)/rate),attack=loop?.8:group==="impact"?.003:group==="sustain"?.024:.008;
source.buffer=buffer;source.playbackRate.value=rate;source.loop=loop;source.category=group;source.volume=volume;source.priority=priority;source.born=c.currentTime;source.extraNodes=[];
volume.gain.setValueAtTime(0,c.currentTime);volume.gain.setValueAtTime(0,when);volume.gain.linearRampToValueAtTime(gain,when+Math.min(attack,span*.25));
if(!loop){const fade=Math.min(group==="sustain"?.12:.065,span*.28);volume.gain.setValueAtTime(gain,when+Math.max(attack,span-fade));volume.gain.linearRampToValueAtTime(0,when+span);}
let node=source;for(const [type,frequency]of [["highpass",high],["lowpass",low]])if(frequency&&c.createBiquadFilter){const filter=c.createBiquadFilter();filter.type=type;filter.frequency.value=frequency;filter.Q.value=.55;node.connect(filter);node=filter;source.extraNodes.push(filter);}node.connect(volume);volume.connect(this.master);this.voices.add(source);
source.onended=()=>{source.disconnect();for(const node of source.extraNodes)node.disconnect();volume.disconnect();this.voices.delete(source);this.retiring.delete(source);if(this.ambientVoice===source)this.ambientVoice=null;};
source.start(when,offset);if(!loop)source.stop(when+span+.002);this.stats.played++;this.stats.maxVoices=Math.max(this.stats.maxVoices,this.voices.size);this.stats.lastSample=name;return source;
}
music(){if(this.ambientVoice||!this.enabled||!this.wantsPlayback)return;this.ambientVoice=this.play("ambience",{gain:.075,group:"ambient",loop:true});}
stop(){this.wantsPlayback=false;this.epoch++;clearInterval(this.timer);this.timer=null;for(const id of this.delayed)clearTimeout(id);this.delayed.clear();const c=this.context;for(const source of new Set([...this.voices,...this.retiring])){try{source.stop();}catch{}source.disconnect();for(const node of source.extraNodes||[])node.disconnect();source.volume?.disconnect();}this.voices.clear();this.retiring.clear();this.ambientVoice=null;this.lastImpact=-1;this.lastContact=-1;this.lastRangedImpact={};this.lastSkillPulse={};c?.suspend().catch(()=>{});}
set(enabled){this.enabled=enabled;if(enabled)this.unlock();else this.stop();}
duck(strong=false){const c=this.context,voice=this.ambientVoice;if(!c||!voice)return;const gain=voice.volume.gain,t=c.currentTime;gain.cancelScheduledValues(t);gain.setTargetAtTime(strong?.015:.029,t,.012);gain.setTargetAtTime(.075,t+(strong?.35:.18),.16);}
gate(key,spacing){const now=this.context?.currentTime||0;if(now-(this.lastSkillPulse[key]??-100)<spacing)return false;this.lastSkillPulse[key]=now;return true;}
arrowFlight({rate=1,gain=.43,heavy=false}={}){if(heavy){this.play("ballista-launch",{gain,rate,group:"flight",priority:6});return;}this.play("arrow-release",{gain:.10,rate,group:"bow"});this.play("arrow-flight",{gain,rate,delay:.012,group:"flight",high:250});}
contact(key,data={},projectile=false){
if(AUDIO_DOTS.has(key)||key==="ultimate"||!CONTACT_PROFILES[key]||!(data.hits>0))return;
if(data.phase==="finish"){this.finish(key,data);return;}const [name,base,spacing]=CONTACT_PROFILES[key],now=this.context?.currentTime||0;
if(now-this.lastContact<AUDIO_DESIGN.contactSpacing||!this.gate("contact:"+key,spacing))return;this.lastContact=now;
const sustained=data.phase==="sustain"||AUDIO_CONTINUOUS.has(key),strong=!!data.strong,extra=strong&&!sustained?.055:0,id=data.id||0;
let sample=name,rate=.98+(id%3)*.018;if(["blade","rend","phantom","thousand"].includes(key))sample=id%2?"blade-hit-a":name;
this.play(sample,{gain:base+extra,rate,group:"impact",priority:strong?7:6,duration:sustained?.20:["thousand","phantom","orbit"].includes(key)?.19:null,high:sample.startsWith("blade")?150:0});
if(key==="stormbow"&&this.gate("thunder:stormbow",.60))this.play("thunder",{gain:.33,rate:.98,delay:.025,group:"thunder",priority:6});
if(key==="ballista"&&strong&&this.gate("weight:ballista",.28))this.play("stone-impact",{gain:.13,rate:.88,duration:.30,low:1600,group:"magic",priority:6});
this.duck(strong);
}
finish(key,data={}){
if(!(data.hits>0)||!this.gate("finish:"+key,.25))return;this.duck(true);
if(["thousand","phantom","crosscut","judgment"].includes(key)){this.play("blade-hit-b",{gain:.55,rate:.95,group:"impact",priority:8});this.play("steel-return",{gain:.24,rate:.92,delay:.025,duration:.37,high:300,group:"magic",priority:7});if(key==="thousand")this.play("stone-impact",{gain:.14,rate:.87,delay:.035,duration:.35,low:1700,group:"magic",priority:7});}
else if(key==="dragon"){this.play("ice-impact",{gain:.48,rate:.84,group:"impact",priority:8});this.play("frost",{gain:.25,rate:.90,delay:.04,group:"magic",priority:7});this.play("thunder",{gain:.18,rate:.89,delay:.04,group:"thunder",priority:7});}
else if(key==="ballista"){this.play("arrow-hit",{gain:.47,rate:.86,group:"impact",priority:8});this.play("stone-impact",{gain:.20,rate:.89,delay:.02,duration:.50,low:1900,group:"magic",priority:7});}
else if(key==="gravity")this.play("gravity-collapse",{gain:.47,group:"magic",priority:8});
}
release(key,data={}){
if(!this.gate("release:"+key,.055))return;const id=data.id||0;
if(key==="whirlwind"){this.play("whirlwind",{gain:.30,group:"swing"});this.play("swish-a",{gain:.23,group:"swing"});}
else if(["cleave","rend","glaive","crosscut","phantom"].includes(key))this.play(key==="glaive"?"steel-return":key==="rend"?"swish-c":key==="phantom"?"swish-b":"swish-a",{gain:key==="rend"?.41:.33,rate:1+(id%3)*.016,group:"swing"});
else if(["hammer","judgment","thousand"].includes(key))this.play(key==="hammer"?"steel-return":"greatblade-air",{gain:key==="thousand"?.34:.29,rate:key==="judgment"?.87:1,group:"swing",priority:key==="thousand"?6:4});
else if(["slam","fissure"].includes(key))this.play("swish-b",{gain:.25,rate:.87,group:"swing"});
else if(["multishot","piercing","poison","volley","ricochet","explosive","stormbow"].includes(key))this.arrowFlight({gain:key==="multishot"?.46:key==="volley"?.34:.42,rate:key==="piercing"?1.10:key==="stormbow"?1.12:1});
else if(key==="trap")this.play("arrow-release",{gain:.11,rate:.88,group:"bow"});
else if(key==="ballista"){this.play("steel-return",{gain:.23,rate:.76,group:"bow",priority:5});this.play("void-cast",{gain:.08,rate:.95,duration:.28,low:2200,group:"magic"});}
else if(key==="falcon")this.play("swish-b",{gain:.32,rate:.94,group:"flight",high:280});
else if(key==="spirit"){this.play("void-cast",{gain:.21,rate:1.06,group:"magic",high:250});this.play("frost",{gain:.13,rate:1.20,duration:.45,group:"magic"});}
else if(key==="lightning"){this.duck(true);this.play("ice-impact",{gain:.14,rate:1.16,duration:.20,group:"magic"});this.play("thunder",{gain:data.evolved?.61:.54,delay:.025,group:"thunder",priority:7});}
else if(["frost","nova"].includes(key))this.play("frost",{gain:key==="nova"?.34:.26,rate:key==="nova"?1.07:.92,group:"magic"});
else if(["fireball","pyre"].includes(key))this.play("fire-cast",{gain:.36,rate:key==="pyre"?.94:1,group:"magic"});
else if(key==="blackflame"){this.play("fire-cast",{gain:.23,rate:.86,group:"magic",low:2900});this.play("void-cast",{gain:.23,rate:.89,group:"magic"});}
else if(key==="beam"||key==="gravity")this.play("void-cast",{gain:key==="gravity"?.36:.31,rate:key==="gravity"?.88:1,group:"magic"});
else if(key==="meteor")this.play("fire-cast",{gain:.24,rate:.82,group:"magic"});
else if(key==="dragon"){this.play("frost",{gain:.19,rate:.89,duration:.46,group:"magic"});this.play("dragon-breath",{gain:.37,delay:.12,group:"sustain",priority:6});this.play("thunder",{gain:.16,rate:.82,delay:.18,group:"thunder",priority:5});}
}
pulse(key,data={}){
const spacing=key==="thousand"?.14:key==="phantom"||key==="crosscut"?.16:key==="spirit"?.16:key==="ballista"?.22:.30;
if(!this.gate("pulse:"+key,spacing))return;
if(key==="beam")this.play("void-impact",{gain:.11,rate:.92,offset:.16,duration:.23,high:240,group:"sustain"});
else if(key==="ballista")this.arrowFlight({gain:.56,rate:.91,heavy:true});
else if(key==="spirit")this.play("spirit-flight",{gain:.28,group:"flight",priority:4});
else if(["thousand","phantom","crosscut"].includes(key))this.play((data.id||0)%2?"swish-b":"swish-a",{gain:key==="thousand"?.23:.26,rate:key==="thousand"?1.12:1.05,duration:.19,high:380,group:"swing",priority:5});
else if(key==="dragon"&&this.gate("breath:dragon",.64))this.play("dragon-breath",{gain:.17,offset:.49,duration:.40,group:"sustain",priority:3});
else if(key==="blackflame"&&this.gate("burn:blackflame",.60))this.play("fire-cast",{gain:.12,rate:.91,offset:.22,duration:.33,low:2600,group:"sustain"});
else if(key==="gravity"&&this.gate("pull:gravity",.60))this.play("void-cast",{gain:.10,rate:.89,offset:.24,duration:.31,low:2100,group:"sustain"});
}
ground(key,data={}){
if(!this.gate("ground:"+key,key==="lightning"?.5:.16))return;
if(["fireball","pyre","explosive","blackflame"].includes(key))this.play("fire-impact",{gain:key==="explosive"?.49:key==="pyre"?.31:.42,rate:key==="blackflame"?.89:1,group:"magic",priority:7});
else if(key==="meteor"){this.play("stone-impact",{gain:.42,rate:.91,group:"impact",priority:7});this.play("fire-impact",{gain:.30,rate:.90,group:"magic",priority:6});}
else if(["slam","fissure"].includes(key))this.play("stone-impact",{gain:key==="slam"?.43:.32,rate:key==="fissure"?1.03:.91,group:"impact",priority:7});
else if(key==="judgment"){this.play("stone-impact",{gain:.29,rate:.90,group:"magic",priority:7});this.play("steel-return",{gain:.24,rate:.95,duration:.35,group:"swing",priority:6});}
else if(key==="gravity")this.play("gravity-collapse",{gain:.42,group:"magic",priority:7});
else if(key==="lightning"||key==="stormbow")this.play("thunder",{gain:key==="stormbow"?.34:.25,rate:1.06,group:"thunder",priority:6});
else if(key==="trap")this.play("steel-return",{gain:.23,rate:1.1,duration:.33,group:"swing"});
else if(key==="dragon"&&data.hits>0)this.finish(key,data);
else return;
this.duck(!!data.strong);
}
event(type,key,data={}){
if(type==="skill-release"){this.release(key,data);return;}
if(type==="skill-pulse"){this.pulse(key,data);return;}
if(type==="skill-contact"){this.contact(key,data);return;}
if(type==="skill-finish"){this.finish(key,data);return;}
if(type==="skill-impact"){this.ground(key,data);return;}
if(type==="projectile-contact"){this.contact(key,{hits:1,...data},true);return;}
if(type==="impact")return; // Compatibility event is visual only; contact is authoritative.
if(type==="stage-clear"){this.play("reward",{gain:.29,group:"reward"});return;}
if(type==="stage-start"){this.play("boss",{gain:.18,rate:.93,group:"magic"});this.play("reward",{gain:.19,delay:.12,group:"reward"});return;}
if(type==="enemy-burst"){if(this.gate("enemy-burst",.22))this.play("fire-impact",{gain:.27,group:"impact",priority:7});return;}
if(type==="projectile-release"){const rate=.98+((data.id||0)%3)*.018;if(key==="arrow")this.arrowFlight({rate});else if(key==="bolt")this.play("bolt-release",{gain:.36,rate,group:"flight"});return;}
if(type==="blade-swing"){this.play(["swish-a","swish-b","swish-c"][(data.id||0)%3],{gain:.43,rate:.97+((data.id||0)%3)*.025,group:"swing",priority:5});return;}
if(type==="blade-contact"){if(!data.hits)return;this.duck(!!data.strong);this.play((data.id||0)%2?"blade-hit-a":"blade-hit-b",{gain:data.strong?.60:.50,rate:1.02+((data.id||0)%3)*.018,group:"impact",priority:data.strong?8:7,high:120});return;}
if(["level","choose","evolve","awaken","chest","magnet"].includes(type)){if(this.gate("reward",.12))this.play("reward",{gain:type==="evolve"||type==="awaken"?.22:.14,duration:type==="evolve"?null:1.25,group:"reward"});return;}
if(type==="select"||type==="reroll"){this.play("select",{gain:.16,group:"ui"});return;}
if(type==="hurt"){this.duck(true);this.play("hurt",{gain:.38,rate:.93,group:"impact",priority:10});return;}
if(type==="ultimate"){this.duck(true);this.play(key==="blade"?"greatblade-air":key==="arrow"?"steel-return":"frost",{gain:key==="blade"?.39:.27,rate:key==="bolt"?.83:.94,group:"magic",priority:8});return;}
if(type==="ultimate-impact"){this.duck(true);if(key==="blade"){this.play("stone-impact",{gain:.42,rate:.90,group:"magic",priority:9});if(data.hits>0)this.play("blade-hit-a",{gain:.54,rate:1.04,group:"impact",priority:9});}else if(key==="arrow")this.arrowFlight({gain:.57,rate:1.04});else{this.play("ice-impact",{gain:.45,rate:.85,group:"impact",priority:9});this.play("frost",{gain:.32,group:"magic",priority:8});this.play("thunder",{gain:.23,rate:.91,group:"thunder",priority:8});}return;}
if(type==="rift-open"){this.play("void-cast",{gain:.13,rate:.83,group:"magic"});return;}
if(type==="rift-sealed"){this.play("reward",{gain:.25,group:"reward"});return;}
if(type==="dash"){this.play("swish-b",{gain:.25,rate:1.25,group:"swing"});return;}
if(type==="boss"){this.play("boss",{gain:.28,group:"magic",priority:7});return;}
}
}
