import {Storage,User,Screen,SafeArea,graniteEvent} from "@apps-in-toss/web-framework";
import {cleanSave} from "./core.js";
const LOCAL=import.meta.env.DEV;
async function timeout(p,ms=5000){let timer;try{return await Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("토스 연결 시간이 초과됐어요")),ms);})]);}finally{clearTimeout(timer);}}
export class Platform{
constructor(){this.key=null;this.queue=Promise.resolve();this.unsub=[];this.onSaveError=()=>{};}
async init(onExit){
this.dispose();
if(LOCAL){this.key="riftkeepers:dev:v1";return cleanSave(localStorage.getItem(this.key));}
const identity=await timeout(User.getAnonymousKey());
if(identity?.type!=="HASH"||typeof identity.hash!=="string"||!identity.hash)throw new Error("사용자 정보 오류");
this.key="riftkeepers:v1:"+identity.hash;
const raw=await timeout(Storage.getItem(this.key));
const insets=()=>{try{const s=SafeArea.get();for(const edge of ["top","bottom","left","right"])document.documentElement.style.setProperty("--safe-"+edge,Math.max(0,Number(s[edge])||0)+"px");}catch{}};
insets();try{this.unsub.push(SafeArea.subscribe({onEvent:insets,onError:()=>{}}));}catch{}
for(const event of ["backEvent","homeEvent"]){try{this.unsub.push(graniteEvent.addEventListener(event,{onEvent:onExit,onError:()=>{}}));}catch{}}
Screen.setOrientation({type:"portrait"}).catch(()=>{});
return cleanSave(raw);}
save(value){if(!this.key)return Promise.reject(new Error("저장소 준비 전"));const data=JSON.stringify(cleanSave(value)),key=this.key;
const task=this.queue.catch(()=>{}).then(()=>LOCAL?localStorage.setItem(key,data):Storage.setItem(key,data));
this.queue=task;const result=timeout(task);result.catch(()=>this.onSaveError());return result;}
awake(enabled){if(!LOCAL)Screen.setAwakeMode({enabled}).catch(()=>{});}
async close(){await this.queue.catch(()=>{});if(!LOCAL){await Screen.setAwakeMode({enabled:false}).catch(()=>{});await Screen.close();return true;}return false;}
dispose(){for(const fn of this.unsub)if(typeof fn==="function")try{fn();}catch{}this.unsub=[];this.awake(false);}
}
