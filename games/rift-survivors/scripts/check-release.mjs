import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
const files=fs.readdirSync(".").filter(x=>x.endsWith(".ait"));assert.ok(files.length,"No Apps in Toss .ait bundle was generated");assert.ok(fs.existsSync("dist/index.html"));
for(const file of fs.readdirSync("dist/assets").filter(x=>x.endsWith(".js"))){const code=fs.readFileSync(path.join("dist/assets",file),"utf8");assert.ok(!code.includes("__riftTest"),"Dev hooks leaked into release");}
const source=fs.readFileSync("src/core.js","utf8")+fs.readFileSync("src/main.js","utf8");assert.ok(!/\beval\s*\(|new Function\s*\(/.test(source));assert.ok(!/<iframe\b/i.test(fs.readFileSync("index.html","utf8")));
const artifacts=files.map(name=>{const b=fs.readFileSync(name);assert.ok(b.length>500&&b.length<30*1024*1024);return {name,bytes:b.length,sha256:crypto.createHash("sha256").update(b).digest("hex")};});
fs.mkdirSync("release",{recursive:true});fs.writeFileSync("release/build-manifest.json",JSON.stringify({version:"1.0.0",target:"Apps in Toss WebView 3.x",appName:process.env.TOSS_APP_NAME||"rift-keepers",consoleRegistrationVerified:false,nativePhoneTestCompleted:false,artifacts},null,2));console.log(JSON.stringify(artifacts,null,2));
