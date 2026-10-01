import {test,expect} from "@playwright/test";
test.beforeEach(async({page})=>{await page.goto("/");await expect(page.locator("#home")).toBeVisible();});
test("home has three heroes and gameplay draws real 2D art",async({page})=>{
await expect(page.locator(".hero")).toHaveCount(3);await page.getByRole("button",{name:"별빛 궁수",exact:true}).click();await expect(page.locator("#hero-description")).toContainText("화살");await page.screenshot({path:"test-results/home.png"});
await page.locator("#start").click();await expect(page.locator("#hud")).toBeVisible();expect(await page.evaluate(()=>window.__riftTest.game.hero.id)).toBe("ranger");
const colors=await page.evaluate(()=>{const c=document.querySelector("#world"),d=c.getContext("2d").getImageData(0,0,c.width,c.height).data,s=new Set();for(let i=0;i<d.length;i+=400)s.add(d[i]+","+d[i+1]+","+d[i+2]);return s.size;});expect(colors).toBeGreaterThan(10);await page.screenshot({path:"test-results/gameplay.png"});});
test("drag moves the hero and release stops movement",async({page})=>{
await page.locator("#start").click();const before=await page.evaluate(()=>window.__riftTest.game.player.x);await page.mouse.move(160,430);await page.mouse.down();await page.mouse.move(240,430,{steps:5});await page.waitForTimeout(300);await page.mouse.up();
const after=await page.evaluate(()=>window.__riftTest.game.player.x);expect(after).toBeGreaterThan(before+20);await page.waitForTimeout(150);expect(await page.evaluate(()=>window.__riftTest.game.player.x)).toBeCloseTo(after,0);});
test("level choices freeze combat and apply one upgrade",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>window.__riftTest.giveXP(8));await expect(page.locator(".upgrade")).toHaveCount(3);const t=await page.evaluate(()=>window.__riftTest.game.time);await page.waitForTimeout(150);expect(await page.evaluate(()=>window.__riftTest.game.time)).toBe(t);await page.screenshot({path:"test-results/skills.png"});
await page.locator(".upgrade").first().click();await expect(page.locator("#overlay")).toBeHidden();expect(await page.evaluate(()=>window.__riftTest.game.phase)).toBe("playing");expect(await page.evaluate(()=>window.__riftTest.game.pending)).toBe(0);});
test("pause and background stop gameplay until explicit resume",async({page})=>{
await page.locator("#start").click();await page.locator("#pause").click();await expect(page.locator("#resume")).toBeVisible();const t=await page.evaluate(()=>window.__riftTest.game.time);await page.waitForTimeout(150);expect(await page.evaluate(()=>window.__riftTest.game.time)).toBe(t);await page.locator("#resume").click();
await page.evaluate(()=>window.dispatchEvent(new Event("blur")));await expect(page.locator("#resume")).toBeVisible();await page.locator("#resume").click();expect(await page.evaluate(()=>window.__riftTest.game.phase)).toBe("playing");});
test("victory rewards once and records survive reload",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>{window.__riftTest.game.kills=24;window.__riftTest.finish(true);});await expect(page.locator("#dialog-title")).toContainText("균열을 닫았어요");await page.evaluate(()=>window.__riftTest.flush());expect(await page.evaluate(()=>window.__riftTest.save.coins)).toBe(74);await page.screenshot({path:"test-results/victory.png"});await page.reload();await expect(page.locator("#home")).toBeVisible();await expect(page.locator("#coins")).toHaveText("74");await expect(page.locator("#wins")).toHaveText("1");});
test("affordable upgrades and sound settings persist",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>window.__riftTest.finish(true));await expect(page.locator("#result-home")).toBeVisible();await page.locator("#result-home").click();await page.locator("#forge").click();await page.locator('[data-forge="power"]').click();expect(await page.evaluate(()=>window.__riftTest.save.meta.power)).toBe(1);await page.locator("#forge-close").click();await page.locator("#settings").click();await page.locator("#sound").click();await expect(page.locator("#sound")).toHaveText("꺼짐");await page.evaluate(()=>window.__riftTest.flush());await page.reload();await expect(page.locator("#home")).toBeVisible();expect(await page.evaluate(()=>window.__riftTest.save.meta.power)).toBe(1);expect(await page.evaluate(()=>window.__riftTest.save.settings.sound)).toBe(false);});
test("exit is confirmed, cancellation preserves run, exit saves rewards",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>window.__riftTest.requestExit());await expect(page.locator("#exit-confirm")).toBeVisible();await page.locator("#exit-cancel").click();await expect(page.locator("#resume")).toBeVisible();await page.locator("#resume").click();await page.evaluate(()=>window.__riftTest.requestExit());await page.locator("#exit-confirm").click();await expect(page.locator("#home")).toBeVisible();expect(await page.evaluate(()=>window.__riftTest.save.runs)).toBe(1);});
test("small phones retain a reachable start button",async({page})=>{
await page.setViewportSize({width:360,height:640});await expect(page.locator("#start")).toBeVisible();const b=await page.locator("#start").boundingBox();expect(b.y+b.height).toBeLessThan(640);await page.screenshot({path:"test-results/small-phone.png"});});
test("all dialogs and a short fight have no uncaught errors",async({page})=>{
const errors=[];page.on("pageerror",e=>errors.push(e.message));for(const [open,close]of [["help","help-close"],["privacy","privacy-close"],["forge","forge-close"],["settings","settings-close"]]){await page.locator("#"+open).click();await page.locator("#"+close).click();}
await page.locator("#start").click();await page.locator("#ultimate").click();await page.waitForTimeout(800);await page.locator("#dash").click();await page.locator("#pause").click();await page.locator("#retire").click();await expect(page.locator("#again")).toBeVisible();expect(errors).toEqual([]);});
test("three rerolls retain the earned level and disable when exhausted",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>window.__riftTest.giveXP(8));await expect(page.locator("#reroll")).toContainText("3회");for(let i=0;i<3;i++)await page.locator("#reroll").click();await expect(page.locator("#reroll")).toBeDisabled();expect(await page.evaluate(()=>window.__riftTest.game.pending)).toBe(1);await page.locator(".upgrade").first().click();await expect(page.locator("#overlay")).toBeHidden();
});
test("performance choices persist and battery mode lowers resolution and target frame rate",async({page})=>{
await page.locator("#settings").click();await expect(page.locator("#performance")).toHaveText("자동");await page.locator("#performance").click();await page.locator("#performance").click();await expect(page.locator("#performance")).toHaveText("배터리 절약");await page.evaluate(()=>window.__riftTest.flush());await page.reload();await expect(page.locator("#home")).toBeVisible();await page.locator("#start").click();expect(await page.evaluate(()=>window.__riftTest.budget.targetFPS)).toBe(30);expect(await page.evaluate(()=>window.__riftTest.renderer.quality)).toBeCloseTo(.65);
});
test("evolution changes the visible skill name and combat weapon",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>{const g=window.__riftTest.game;g.weapons.blade=5;g.passives.power=2;g.checkEvolution();});await expect(page.locator("#skills .skill")).toHaveAttribute("aria-label","태양의 대검 5레벨");await expect(page.locator("#banner")).toContainText("진화");
});
test("a restored page keeps its run paused and can resume with working controls",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>window.dispatchEvent(new Event("pagehide")));await expect(page.locator("#resume")).toBeVisible();const t=await page.evaluate(()=>window.__riftTest.game.time);await page.evaluate(()=>window.dispatchEvent(new Event("pageshow")));await page.waitForTimeout(100);expect(await page.evaluate(()=>window.__riftTest.game.time)).toBe(t);await page.locator("#resume").click();const x=await page.evaluate(()=>window.__riftTest.game.player.x);await page.keyboard.down("d");await expect.poll(()=>page.evaluate(()=>window.__riftTest.game.time),{timeout:5000}).toBeGreaterThan(t);await expect.poll(()=>page.evaluate(()=>window.__riftTest.game.player.x),{timeout:5000}).toBeGreaterThan(x);await page.keyboard.up("d");
});
test("portrait short screens can show all upgrade actions without losing the choice",async({page})=>{
await page.setViewportSize({width:360,height:640});await page.locator("#start").click();await page.evaluate(()=>window.__riftTest.giveXP(8));await expect(page.locator(".upgrade")).toHaveCount(3);await page.locator("#reroll").click();await page.locator(".upgrade").last().click();await expect(page.locator("#overlay")).toBeHidden();
});
test("backgrounding silences audio voices and cancels delayed sound effects",async({page})=>{
await page.locator("#start").click();await page.locator("#ultimate").click();await page.evaluate(()=>window.dispatchEvent(new Event("blur")));await expect(page.locator("#resume")).toBeVisible();await page.waitForTimeout(200);expect(await page.evaluate(()=>window.__riftTest.audio.timer)).toBeNull();expect(await page.evaluate(()=>window.__riftTest.audio.delayed.size)).toBe(0);expect(await page.evaluate(()=>window.__riftTest.audio.context?.state)).toBe("suspended");
});
test("stress scene remains responsive with capped entities and reports frame costs",async({page},testInfo)=>{
await page.locator("#start").click();await page.evaluate(()=>{const g=window.__riftTest.game;g.player.inv=999;g.spawnCd=999;g.nextElite=999;g.weapons={blade:5,arrow:5,bolt:5,orbit:5};g.passives={power:2,haste:3,heart:2,magnet:2};g.checkEvolution();for(let i=0;i<170;i++){const e=g.spawn(i%3?"shade":"brute");e.hp=e.maxHp=10000;const a=i*Math.PI*2/170,r=100+(i%7)*55;e.x=900+Math.cos(a)*r;e.y=900+Math.sin(a)*r;}});
const values=await page.evaluate(async()=>{const samples=[];for(let i=0;i<90;i++){await new Promise(requestAnimationFrame);const m=window.__riftTest.metrics;samples.push({updateMs:m.updateMs,renderMs:m.renderMs,frameMs:m.frameMs});}const g=window.__riftTest.game;return {engine:navigator.userAgent,samples,counts:{enemies:g.enemies.length,bullets:g.bullets.length,shots:g.shots.length,fx:g.fx.length},canvas:{width:window.__riftTest.renderer.canvas.width,height:window.__riftTest.renderer.canvas.height}};});
expect(values.counts.enemies).toBeLessThanOrEqual(180);expect(values.counts.bullets).toBeLessThanOrEqual(180);expect(values.counts.fx).toBeLessThanOrEqual(160);expect(values.samples.every(x=>Number.isFinite(x.updateMs)&&Number.isFinite(x.renderMs))).toBe(true);await testInfo.attach("stress-frame-samples",{body:JSON.stringify(values,null,2),contentType:"application/json"});await page.locator("#pause").click();await expect(page.locator("#resume")).toBeVisible();
});
test("a second touch can dash while the movement pointer remains held",async({page})=>{
await page.locator("#start").click();await page.mouse.move(120,450);await page.mouse.down();await page.mouse.move(180,450);await page.locator("#dash").dispatchEvent("pointerdown",{pointerId:2,pointerType:"touch",clientX:265,clientY:740,bubbles:true});expect(await page.evaluate(()=>window.__riftTest.game.player.dashCd)).toBeGreaterThan(0);const x=await page.evaluate(()=>window.__riftTest.game.player.x);await page.waitForTimeout(150);expect(await page.evaluate(()=>window.__riftTest.game.player.x)).toBeGreaterThan(x);await page.mouse.up();
});

test("painted assets load before play and hero portraits contain detailed artwork",async({page})=>{
expect(await page.evaluate(()=>window.__riftTest.renderer.artReady)).toBe(true);
const detail=await page.locator(".hero canvas").first().evaluate(canvas=>{const bytes=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data,colors=new Set();let opaque=0;for(let i=0;i<bytes.length;i+=4){if(bytes[i+3]>100){opaque++;colors.add(bytes[i]+","+bytes[i+1]+","+bytes[i+2]);}}return {opaque,colors:colors.size};});
expect(detail.opaque).toBeGreaterThan(1800);expect(detail.colors).toBeGreaterThan(500);
await page.locator("#start").click();await expect(page.locator("#skills .rune-icon")).toHaveCount(1);
await page.screenshot({path:"test-results/painterly-knight.png"});
});
test("missing art leaves a visible retry and a successful retry restores the game",async({page})=>{
await page.route("**/art/forest.webp",route=>route.abort());await page.reload();await expect(page.locator("#retry")).toBeVisible();await expect(page.locator("#boot-message")).toContainText("불러오지 못했어요");
await page.unroute("**/art/forest.webp");await page.locator("#retry").click();await expect(page.locator("#home")).toBeVisible();expect(await page.evaluate(()=>window.__riftTest.renderer.artReady)).toBe(true);
});
test("golden strike creates hit feedback and reduced motion remains selectable",async({page})=>{
await page.locator("#start").click();await page.evaluate(()=>{const g=window.__riftTest.game;const e=g.spawn("brute");e.x=g.player.x+80;e.y=g.player.y;e.hp=e.maxHp=500;g.attack("blade",1);});
await expect.poll(()=>page.evaluate(()=>window.__riftTest.renderer.feedback.swingUntil)).toBeGreaterThan(0);
await page.locator("#pause").click();await page.locator("#pause-settings").click();await page.locator("#motion").click();expect(await page.evaluate(()=>window.__riftTest.renderer.reduced)).toBe(true);await page.locator("#settings-close").click();await page.locator("#resume").click();await expect(page.locator("#hud")).toBeVisible();
});

test("recorded Foley and spell buffers decode into real audio on mobile browsers",async({page},testInfo)=>{
const result=await page.evaluate(()=>{const a=window.__riftTest.audio;return [...a.buffers].map(([name,b])=>{const x=b.getChannelData(0);let energy=0,peak=0;for(let i=0;i<x.length;i++){energy+=x[i]*x[i];peak=Math.max(peak,Math.abs(x[i]));}return {name,duration:b.duration,rms:Math.sqrt(energy/x.length),peak};});});
expect(result).toHaveLength(15);await testInfo.attach("decoded-audio-metrics",{body:JSON.stringify(result,null,2),contentType:"application/json"});for(const x of result){expect(x.duration,x.name+" decoded duration").toBeGreaterThan(.05);expect(Number.isFinite(x.rms),x.name+" finite PCM").toBe(true);expect(x.rms,x.name+" non-silent PCM").toBeGreaterThan(.001);expect(x.peak,x.name+" waveform peak").toBeGreaterThan(.03);}
await page.locator("#start").click();await expect.poll(()=>page.evaluate(()=>window.__riftTest.audio.context.state)).toBe("running");
});
test("one sword sweep hitting ten enemies plays one whoosh and one impact",async({page})=>{
await page.locator("#start").click();await expect.poll(()=>page.evaluate(()=>window.__riftTest.audio.context.state)).toBe("running");
await page.evaluate(()=>{const {game:g,audio:a}=window.__riftTest;g.enemies=[];g.events=[];g.spawnCd=999;g.cool.blade=999;g.player.inv=999;for(let i=0;i<10;i++){const e=g.spawn("brute");e.x=g.player.x+65;e.y=g.player.y+(i-5)*3;e.hp=e.maxHp=500;}g.events=[];window.__audioBefore=a.stats.played;g.attack("blade",1);});
await expect.poll(()=>page.evaluate(()=>window.__riftTest.audio.stats.played-window.__audioBefore)).toBe(2);
expect(await page.evaluate(()=>window.__riftTest.audio.stats.maxVoices)).toBeLessThanOrEqual(18);
await page.locator("#pause").click();await expect.poll(()=>page.evaluate(()=>window.__riftTest.audio.voices.size)).toBe(0);
});
test("missing recorded audio offers a working retry without a broken start screen",async({page})=>{
await page.route("**/audio/swish-a.mp3",route=>route.abort());await page.reload();await expect(page.locator("#retry")).toBeVisible();await expect(page.locator("#home")).toBeHidden();
await page.unroute("**/audio/swish-a.mp3");await page.locator("#retry").click();await expect(page.locator("#home")).toBeVisible();expect(await page.evaluate(()=>window.__riftTest.audio.buffers.size)).toBe(15);
});
test("painted sword texture, scenery, badges and bundled title font are loaded",async({page})=>{
const assets=await page.evaluate(()=>{const art=window.__riftTest.renderer;return {ready:art.artReady,font:[...document.fonts].some(f=>f.family==="RiftTitle"&&f.status==="loaded")};});expect(assets.ready).toBe(true);expect(assets.font).toBe(true);
await page.locator("#start").click();await expect(page.locator("#skills .painted-icon")).toHaveCount(1);expect(await page.locator("#skills .painted-icon").evaluate(img=>img.complete&&img.naturalWidth===128)).toBe(true);
});

test("sword anticipates, connects once and a missed attack stays silent",async({page})=>{
await page.locator("#start").click();await expect.poll(()=>page.evaluate(()=>window.__riftTest.audio.context.state)).toBe("running");
const setup=await page.evaluate(()=>{const t=window.__riftTest,g=t.game;g.enemies=[];g.events=[];g.spawnCd=999;g.cool.blade=999;const e=g.spawn("brute");Object.assign(e,{x:g.player.x+75,y:g.player.y,hp:500,maxHp:500,speed:0});g.events=[];g.attack("blade",1);g.phase="paused";return {hp:e.hp,elapsed:g.bladeSwing.elapsed};});expect(setup.hp).toBe(500);expect(setup.elapsed).toBe(0);
await page.evaluate(()=>{const g=window.__riftTest.game;g.phase="playing";for(let i=0;i<8;i++)g.step(1/60);g.phase="paused";});expect(await page.evaluate(()=>window.__riftTest.game.enemies[0].hp)).toBe(500);
await page.evaluate(()=>{const g=window.__riftTest.game;g.phase="playing";g.step(1/60);g.phase="paused";});expect(await page.evaluate(()=>window.__riftTest.game.enemies[0].hp)).toBe(481);await expect.poll(()=>page.evaluate(()=>window.__riftTest.audio.stats.lastSample)).toMatch(/^blade-hit-/);
});
test("fifteen-second sword practice keeps permanent records unchanged",async({page})=>{
await page.goto("/?practice=blade");await expect(page.locator("#home")).toBeVisible();const before=await page.evaluate(()=>JSON.stringify(window.__riftTest.save));await page.locator("#start").click();await expect(page.locator("#objective")).toHaveText("15초 검술 연습");
await page.evaluate(()=>{const g=window.__riftTest.game;for(let i=0;i<1100&&!g.result;i++)g.step(1/60);});await expect(page.locator("#dialog-title")).toHaveText("검술 연습 완료");await page.evaluate(()=>window.__riftTest.flush());expect(await page.evaluate(()=>JSON.stringify(window.__riftTest.save))).toBe(before);expect(await page.evaluate(()=>window.__riftTest.game.level)).toBe(1);
});
