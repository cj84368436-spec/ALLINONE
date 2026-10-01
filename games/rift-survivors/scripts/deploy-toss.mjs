// Optional TEST upload only. Never requests review or publishes the miniapp.
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const key=process.env.TOSS_API_KEY,appName=process.env.TOSS_APP_NAME;
if(!key||!appName)throw new Error("Set TOSS_API_KEY secret and the registered TOSS_APP_NAME first.");
const manifest=JSON.parse(fs.readFileSync("release/build-manifest.json","utf8"));
if(manifest.appName!==appName)throw new Error("Built appName does not match requested console appName.");
const run=spawnSync("npx",["ait","deploy","--api-key",key,"-m","균열의 수호자 "+manifest.version+" 모바일 테스트"],{encoding:"utf8",timeout:360000,env:process.env});
const output=((run.stdout||"")+"\n"+(run.stderr||"")).split(key).join("[redacted]");
console.log(output);
if(run.status!==0)throw new Error("Toss test upload failed; inspect the redacted output.");
const schemes=[...new Set(output.match(/intoss-private:\/\/[^\s<>"'\x60]+/g)||[])];
fs.writeFileSync("release/toss-test-upload.json",JSON.stringify({appName,testSchemes:schemes,consoleUploadCompleted:true,nativePhoneTestCompleted:false,published:false},null,2));
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,"\n토스 테스트 번들 업로드 완료. 실제 공개는 하지 않았습니다.\n\n"+(schemes.length?schemes.map(s=>"- "+s).join("\n"):"콘솔에서 테스트 QR을 확인하세요.")+"\n");
