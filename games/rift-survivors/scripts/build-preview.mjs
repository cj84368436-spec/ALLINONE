import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

export function buildPreview(files,{baseHref=""}={}){
const order=["spatial","runtime","art","icons","core","render","audio","main"];
const strip=source=>source.replace(/^import .*;\n/gm,"").replace(/^if\(import\.meta\.env\.DEV\)window\.__riftTest=.*;\n/gm,"").replace(/\bexport /g,"").replaceAll("import.meta.env.DEV","false");
const modules=order.map(name=>(name==="main"?"class Platform {\nconstructor(){this.key=\"riftkeepers:play-preview:v1\";this.queue=Promise.resolve();this.onSaveError=()=>{};}\nasync init(){try{return cleanSave(localStorage.getItem(this.key));}catch{return cleanSave();}}\nsave(value){const data=JSON.stringify(cleanSave(value));const task=this.queue.catch(()=>{}).then(()=>localStorage.setItem(this.key,data));this.queue=task;task.catch(()=>this.onSaveError());return task;}\nawake(){}\nasync close(){await this.queue;return false;}\ndispose(){}\n}"+"\n":"")+strip(files["src/"+name+".js"])).join("\n\n");
const html=files["index.html"].replace("<head>","<head>"+(baseHref?'<base href="'+baseHref+'">':"")).replace("</head>","<style>"+files["src/style.css"]+"</style></head>").replace(/<body ([^>]*)>/,'<body $1 data-preview-revision="audit-r1">').replace('<script type="module" src="/src/main.js"></script>',()=>"<script>\n"+modules+"\n</script>");
if(html.includes('src="/src/main.js"')||html.includes("__riftTest")||html.includes("@apps-in-toss"))throw Error("Preview contains development or native-only code");
return html;
}
const root=fileURLToPath(new URL("../",import.meta.url));
const paths=["index.html","src/style.css",...["spatial","runtime","art","icons","core","render","audio","main"].map(name=>"src/"+name+".js")];
export function readPreviewSources(){return Object.fromEntries(paths.map(p=>[p,fs.readFileSync(path.join(root,p),"utf8")]));}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
const html=buildPreview(readPreviewSources(),{baseHref:"../"}),destination=path.join(root,"preview/index.html");
if(process.argv.includes("--check")){if(fs.readFileSync(destination,"utf8")!==html)throw Error("Preview is stale. Run npm run preview:build and commit preview/index.html.");console.log("Preview matches native game sources.");}
else{fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,html);console.log("Generated preview/index.html from current game sources.");}
}
