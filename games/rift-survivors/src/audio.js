const SAMPLES=["swish-a","swish-b","swish-c","blade-hit-a","blade-hit-b","arrow","magic","frost","thunder","ultimate","hurt","reward","select","boss","ambience"];
export class Audio{
constructor(){this.context=null;this.enabled=true;this.timer=null;this.voices=new Set();this.delayed=new Set();this.buffers=new Map();this.promise=null;this.ambientVoice=null;this.epoch=0;this.wantsPlayback=false;this.lastImpact=-1;this.stats={played:0,maxVoices:0,lastSample:null};}
createContext(){if(this.context)return this.context;const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;const c=this.context=new Context(),compressor=c.createDynamicsCompressor();compressor.threshold.value=-13;compressor.knee.value=18;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.16;this.master=c.createGain();this.master.gain.value=.72;this.master.connect(compressor);compressor.connect(c.destination);return c;}
prepare(){if(this.promise)return this.promise;const c=this.createContext();if(!c)return Promise.resolve();this.promise=Promise.all(SAMPLES.map(async name=>{if(this.buffers.has(name))return;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);try{const response=await fetch(new URL("audio/"+name+".mp3",document.baseURI),{signal:controller.signal});if(!response.ok)throw new Error("Audio unavailable: "+name);const bytes=await response.arrayBuffer(),buffer=await c.decodeAudioData(bytes);this.buffers.set(name,buffer);}finally{clearTimeout(timer);}})).catch(error=>{this.promise=null;throw error;});return this.promise;}
unlock(){if(!this.enabled||document.hidden)return;this.wantsPlayback=true;const epoch=this.epoch,c=this.createContext();if(!c)return;const resume=c.resume();Promise.all([resume,this.prepare()]).then(()=>{if(this.enabled&&this.wantsPlayback&&!document.hidden&&epoch===this.epoch)this.music();}).catch(()=>{});}
play(name,{gain=.4,rate=1,delay=0,group="effects",loop=false}={}){
const c=this.context,buffer=this.buffers.get(name);if(!this.enabled||!this.wantsPlayback||!c||c.state!=="running"||document.hidden||!buffer)return null;
const peers=[...this.voices].filter(s=>s.category===group),limit=group==="magic"?3:group==="impact"?2:group==="swing"?2:group==="ambient"?1:4;
if(peers.length>=limit){const oldest=peers[0];oldest.volume.gain.cancelScheduledValues(c.currentTime);oldest.volume.gain.setTargetAtTime(0,c.currentTime,.009);try{oldest.stop(c.currentTime+.04);}catch{}}
if(this.voices.size>=18)return null;
const source=c.createBufferSource(),volume=c.createGain(),when=c.currentTime+delay,duration=buffer.duration/rate;
source.buffer=buffer;source.playbackRate.value=rate;source.loop=loop;source.category=group;source.volume=volume;
volume.gain.setValueAtTime(0,c.currentTime);volume.gain.setValueAtTime(0,when);volume.gain.linearRampToValueAtTime(gain,when+(loop?.8:.014));
if(!loop){const fade=Math.min(.08,duration*.2);volume.gain.setValueAtTime(gain,when+Math.max(.015,duration-fade));volume.gain.linearRampToValueAtTime(0,when+duration);}
source.connect(volume);volume.connect(this.master);this.voices.add(source);source.onended=()=>{source.disconnect();volume.disconnect();this.voices.delete(source);if(this.ambientVoice===source)this.ambientVoice=null;};
source.start(when);if(!loop)source.stop(when+duration+.01);this.stats.played++;this.stats.maxVoices=Math.max(this.stats.maxVoices,this.voices.size);this.stats.lastSample=name;return source;
}
music(){if(this.ambientVoice||!this.enabled||!this.wantsPlayback)return;this.ambientVoice=this.play("ambience",{gain:.09,group:"ambient",loop:true});}
stop(){this.wantsPlayback=false;this.epoch++;clearInterval(this.timer);this.timer=null;for(const id of this.delayed)clearTimeout(id);this.delayed.clear();const c=this.context;for(const source of this.voices){try{source.stop();}catch{}source.disconnect();source.volume?.disconnect();}this.voices.clear();this.ambientVoice=null;c?.suspend().catch(()=>{});}
set(enabled){this.enabled=enabled;if(enabled)this.unlock();else this.stop();}
event(type,key){
const pitch=()=>.95+Math.random()*.10;
if(type==="attack"){
if(key==="blade"){this.play(["swish-a","swish-b","swish-c"][Math.floor(Math.random()*3)],{gain:.48,rate:pitch(),group:"swing"});this.play(Math.random()<.5?"blade-hit-a":"blade-hit-b",{gain:.40,rate:.95+Math.random()*.06,delay:.065,group:"impact"});}
else if(key==="arrow")this.play("arrow",{gain:.28,rate:1.12+Math.random()*.08,group:"swing"});
else if(key==="bolt")this.play("magic",{gain:.20,rate:pitch(),group:"magic"});
else if(key==="lightning")this.play("thunder",{gain:.30,group:"magic"});
else if(key==="frost")this.play("frost",{gain:.27,group:"magic"});
}
else if(type==="impact"){if(["blade","ultimate","orbit"].includes(key))return;const now=this.context?.currentTime||0;if(now-this.lastImpact<.20)return;this.lastImpact=now;this.play("blade-hit-b",{gain:.18,rate:1.1,group:"impact"});}
else if(["level","choose","evolve","chest","magnet"].includes(type))this.play("reward",{gain:type==="evolve"?.23:.16,group:"reward"});
else if(type==="select"||type==="reroll")this.play("select",{gain:.18,group:"ui"});
else if(type==="hurt")this.play("hurt",{gain:.35,rate:.9,group:"impact"});
else if(type==="ultimate")this.play("ultimate",{gain:.43,group:"magic"});
else if(type==="dash")this.play("swish-b",{gain:.28,rate:1.32,group:"swing"});
else if(type==="boss")this.play("boss",{gain:.30,group:"magic"});
}
}
