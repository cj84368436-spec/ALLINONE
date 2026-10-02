import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {cleanSave} from "../src/core.js";
const source=fs.readFileSync(new URL("../src/platform.js",import.meta.url),"utf8").replace(/^import .*;\n/gm,"").replace(/\bexport /g,"").replace("import.meta.env.DEV","false");
const flush=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
function fixture(){
 const timers=new Set(),writes=[],storage={value:null,setItem(key,data){return new Promise((resolve,reject)=>writes.push({key,data,resolve:()=>{storage.value=data;resolve();},reject}));}};
 const P=new Function("Storage","cleanSave","setTimeout","clearTimeout",source+";return Platform;")(storage,cleanSave,fn=>{timers.add(fn);return fn;},fn=>timers.delete(fn));
 const p=new P();p.key="test";const errors=[];p.onSaveError=()=>errors.push("failed");return {p,storage,writes,timers,errors};
}
test("a timed-out native write cannot complete after and overwrite a newer save",async()=>{
 const {p,storage,writes,timers,errors}=fixture();const first=p.save({coins:10}).catch(e=>e);await flush();assert.equal(writes.length,1);
 [...timers][0]();const error=await first;assert.match(error.message,/초과/);assert.equal(errors.length,1);
 const second=p.save({coins:20});await flush();assert.equal(writes.length,1,"The newer write must wait for the old bridge write, even after its UI timeout");
 writes[0].resolve();await flush();assert.equal(writes.length,2);writes[1].resolve();await second;assert.equal(JSON.parse(storage.value).coins,20);await p.queue;
});
test("a rejected bridge write reports failure and does not block a subsequent successful save",async()=>{
 const {p,storage,writes,errors}=fixture();const first=p.save({coins:10}).catch(e=>e);await flush();writes[0].reject(new Error("bridge offline"));assert.match((await first).message,/offline/);assert.equal(errors.length,1);
 const second=p.save({coins:30});await flush();assert.equal(writes.length,2);writes[1].resolve();await second;assert.equal(JSON.parse(storage.value).coins,30);
});
