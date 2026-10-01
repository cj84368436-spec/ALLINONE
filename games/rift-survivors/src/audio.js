export class Audio {
  constructor() { this.context=null; this.enabled=true; this.timer=null; this.note=0; this.voices=new Set(); this.delayed=new Set(); }
  unlock() { if(!this.enabled||document.hidden)return; try { if(!this.context)this.context=new(window.AudioContext||window.webkitAudioContext)(); this.context.resume().catch(()=>{}); this.music(); } catch{} }
  tone(freq,duration=.12,gain=.035,type="sine") {
    if(!this.enabled||!this.context||this.context.state!=="running"||document.hidden||this.voices.size>=24)return;
    const c=this.context,o=c.createOscillator(),v=c.createGain(); this.voices.add(o);o.type=type;o.frequency.value=freq;
    v.gain.setValueAtTime(0,c.currentTime);v.gain.linearRampToValueAtTime(gain,c.currentTime+.01);v.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);
    o.connect(v);v.connect(c.destination);o.onended=()=>{o.disconnect();v.disconnect();this.voices.delete(o);};o.start();o.stop(c.currentTime+duration+.02);
  }
  later(fn,ms) { const id=setTimeout(()=>{this.delayed.delete(id);fn();},ms);this.delayed.add(id); }
  music() { if(this.timer||!this.enabled||!this.context)return;const notes=[220,261.63,329.63,293.66,220,196,261.63,329.63];this.timer=setInterval(()=>this.tone(notes[this.note++%notes.length],.48,.013),560); }
  stop() { clearInterval(this.timer);this.timer=null;for(const id of this.delayed)clearTimeout(id);this.delayed.clear();for(const o of this.voices)try{o.stop();}catch{}this.context?.suspend().catch(()=>{}); }
  set(enabled) { this.enabled=enabled;if(enabled)this.unlock();else this.stop(); }
  event(type,key) {
    if(type==="attack"){if(key==="arrow"||key==="bolt")this.tone(key==="arrow"?710:410,.045,.009,"triangle");if(key==="blade")this.tone(140,.07,.022,"triangle");if(key==="lightning")this.tone(210,.17,.025,"sawtooth");}
    else if(["level","choose","evolve","chest","magnet"].includes(type)){this.tone(523,.16,.045);this.later(()=>this.tone(784,.22,.03),100);}
    else if(type==="hurt")this.tone(80,.12,.05,"triangle");
    else if(type==="ultimate"){this.tone(98,.5,.055,"triangle");this.later(()=>this.tone(392,.6,.035),130);}
    else if(type==="dash")this.tone(460,.09,.018,"triangle");
    else if(type==="boss")this.tone(65,.8,.07,"triangle");
  }
}
