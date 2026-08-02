"use strict";
const $=id=>document.getElementById(id);
const cv=$("game"),ctx=cv.getContext("2d");
let W=0,H=0,DPR=1,last=performance.now(),state="intro",held=false;
let score=0,combo=0,mult=1,runCoins=0,distance=0,spawnT=0,starT=0,powerT=0,bossT=0,shake=0,flash=0,groundOffset=0,worldSpeed=255,lives=3,maxLives=10,coinRain=0,guardian=0,bonusFrenzy=0,lastComboReward=0,lastStarMilestone=0,bossRewarded=false,lastLifeConversion=0,fireTimer=0,freezeWorld=0,rewardWave=0;
let player, hazards=[], stars=[], powers=[], particles=[], bullets=[], missiles=[], clouds=[];
let save={best:0,bank:0,sound:true,skin:0,unlocked:[0],mission:{type:"stars",target:20,progress:0}};
try{save={...save,...JSON.parse(localStorage.getItem("skyRunnerFlightSave")||"{}")}}catch{}
const characters=[{name:"Max",type:"explorer"},{name:"Buddy",type:"dog"},{name:"Bolt",type:"robot"},{name:"Rex",type:"dino"}];
if(!Number.isInteger(save.skin)||save.skin<0||save.skin>=characters.length)save.skin=0;
const biomes=[
 {name:"Emerald Forest",sky:["#17395b","#77c9c4"],ground:"#285b35",accent:"#82e66f"},
 {name:"Golden Desert",sky:["#482c4f","#f4a95d"],ground:"#a75f2a",accent:"#ffd36b"},
 {name:"Neon City",sky:["#09051e","#39126e"],ground:"#15132e",accent:"#3df4ff"}
];
let biomeIndex=0, tutorialStep=0, missionStart=0;

function persist(){localStorage.setItem("skyRunnerFlightSave",JSON.stringify(save))}
function resize(){
 DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
 cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cv.style.width=W+"px";cv.style.height=H+"px";
 ctx.setTransform(DPR,0,0,DPR,0,0);
 if(player&&!["running","tutorial","paused"].includes(state))player.y=H-66;
 clouds=Array.from({length:7},(_,i)=>({x:i*W/5,y:70+(i%3)*88,s:20+(i%2)*14}));
}
function groundY(){return H-48}
function resetRun(tutorial=false){
 score=combo=runCoins=distance=0;mult=1;spawnT=55;starT=30;powerT=250;bossT=0;biomeIndex=0;shake=flash=0;groundOffset=0;worldSpeed=255;lives=3;maxLives=10;coinRain=0;guardian=0;bonusFrenzy=0;lastComboReward=0;lastStarMilestone=0;bossRewarded=false;lastLifeConversion=0;fireTimer=0;freezeWorld=0;rewardWave=0;
 hazards=[];stars=[];powers=[];particles=[];bullets=[];missiles=[];
 player={x:Math.max(78,W*.18),y:groundY()-18,vy:0,r:17,jumps:0,maxJumps:2,shield:0,magnet:0,bonusMagnet:0,blaster:0,dash:0,jumpBoost:0,slow:0,frenzy:0,inv:0,angle:0};
 missionStart=missionValue(); tutorialStep=tutorial?0:99;
 updateHud();
}
function startRun(tutorial=false){
 resetRun(tutorial); hideAll();state=tutorial?"tutorial":"running";last=performance.now();
 if(tutorial) toast("Tap to jump");
}
function hideAll(){["intro","menu","pause","gameover"].forEach(id=>$(id).classList.add("hidden"))}
function show(id){hideAll();$(id).classList.remove("hidden")}
function updateHud(){
 $("lives").textContent=lives;$("maxLives").textContent=maxLives;$("score").textContent=Math.floor(score);$("mult").textContent=mult;$("coins").textContent=runCoins;$("speed").textContent=Math.round(worldSpeed*0.42);
 $("shieldPower").style.display=player&&player.shield>0?"block":"none";
 $("magnetPower").style.display=player&&player.magnet>0?"block":"none";
 $("dashPower").style.display=player&&player.dash>0?"block":"none";
 $("jumpPower").style.display=player&&player.jumpBoost>0?"block":"none";
 $("slowPower").style.display=player&&player.slow>0?"block":"none";
 $("frenzyPower").style.display=player&&player.frenzy>0?"block":"none";
 $("guardianPower").style.display=guardian>0?"block":"none";
 $("bonusFrenzyPower").style.display=bonusFrenzy>0?"block":"none";
 $("bonusMagnetPower").style.display=player&&player.bonusMagnet>0?"block":"none";
 $("blasterPower").style.display=player&&player.blaster>0?"block":"none";
 $("freezePower").style.display=freezeWorld>0?"block":"none";
}
function toast(text){const t=$("toast");t.textContent=text;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),1200)}
function beep(freq=440,dur=.07,type="sine"){
 if(!save.sound)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;beep.ac=beep.ac||new AC();const a=beep.ac,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.06,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur)}catch{}
}
function actionDown(e){
 if(e){e.preventDefault();e.stopPropagation()}
 if(!["running","tutorial"].includes(state))return;
 held=true;
 player.maxJumps=player.jumpBoost>0?4:2;
 if(player.jumps<player.maxJumps){player.vy=player.jumps===0?-760:(player.jumps===1?-650:-590);player.jumps++;burst(player.x,player.y+12,"#fff",7);beep(player.jumps===1?520:660,.05,"square")}
 if(state==="tutorial"){
   if(tutorialStep===0){tutorialStep=1;toast("Great — tap again in the air")}
   else if(tutorialStep===1&&player.jumps===2){tutorialStep=2;toast("Hold while falling to glide")}
 }
}
function actionUp(e){if(e)e.preventDefault();held=false}
function burst(x,y,color,n=10){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*220,vy:(Math.random()-.5)*220,l:.45+Math.random()*.25,c:color,s:2+Math.random()*3})}
function spawnHazard(){
 const r=Math.random(); worldSpeed=255+Math.min(score*1.35,150); const speed=worldSpeed;
 if(bossT>0){hazards.push({type:"orb",x:W+40,y:90+Math.random()*(H-190),w:28,h:28,vx:speed+55});return}
 if(r<.46)hazards.push({type:"spike",x:W+35,y:groundY(),w:30+Math.random()*18,h:48+Math.random()*75,vx:speed});
 else if(r<.72)hazards.push({type:"drone",x:W+35,y:100+Math.random()*(H-240),w:42,h:24,vx:speed+10,phase:Math.random()*6});
 else if(r<.88)hazards.push({type:"gate",x:W+35,y:groundY()-120-Math.random()*90,w:24,h:70,vx:speed});
 else hazards.push({type:"roller",x:W+35,y:groundY()-18,w:36,h:36,vx:speed*.9,spin:0});
}
function spawnStarRow(){
 const count=4+Math.floor(Math.random()*4),pattern=Math.floor(Math.random()*4);
 const minY=Math.max(105,H*.22),maxY=groundY()-74;
 const baseY=minY+Math.random()*Math.max(40,maxY-minY);
 for(let i=0;i<count;i++){
   let y=baseY;
   if(pattern===0)y=baseY-Math.sin(i/(count-1)*Math.PI)*42;
   else if(pattern===1)y=baseY+(i%2?24:-24);
   else if(pattern===2)y=baseY-i*15;
   else y=baseY+Math.sin(i*1.2)*30;
   y=Math.max(minY,Math.min(maxY,y));
   stars.push({x:W+30+i*34,y,r:7});
 }
}
function spawnPower(){
 const bag=["shield","magnet","dash","bonus","jumpBoost","heart","slow","frenzy","coinRain","heart","magnet","bonus","goldenHeart","guardian","bonusFrenzy","bonusMagnet","bonusMagnet","blaster","blaster","freeze","rocket","mystery"],type=bag[Math.floor(Math.random()*bag.length)];
 const minY=Math.max(groundY()-220,H*.48),maxY=groundY()-82; powers.push({type,x:W+30,y:minY+Math.random()*Math.max(28,maxY-minY),r:12});
}
function hitHazard(h,index){
 if(player.inv>0)return;
 if(player.dash>0){burst(h.x,h.y,"#ffd84a",18);hazards.splice(index,1);score+=10;combo+=2;shake=8;beep(150,.1,"sawtooth");return}
 if(player.shield>0){player.shield=0;player.inv=1.2;burst(player.x,player.y,"#3df4ff",22);hazards.splice(index,1);shake=10;flash=.16;toast("Shield saved you");beep(190,.12,"square");return}
 if(guardian>0){
   guardian--;player.inv=2.5;hazards.splice(index,1);shake=12;flash=.2;
   burst(player.x,player.y,"#fff4b8",30);toast("Guardian saved you");beep(980,.2,"sine");updateHud();return;
 }
 lives--;
 if(lives>0){
   player.inv=2.2;player.vy=-420;player.y=Math.min(player.y,groundY()-90);combo=0;mult=1;
   hazards.splice(index,1);shake=14;flash=.22;burst(player.x,player.y,"#ff6b8a",28);
   toast(`${lives} ${lives===1?"life":"lives"} left`);beep(140,.2,"sawtooth");updateHud();return;
 }
 endRun();
}
function missionValue(){
 const m=save.mission;
 if(m.type==="stars")return save.bank+runCoins;
 if(m.type==="score")return score;
 return distance;
}
function missionText(){
 const m=save.mission,n=m.type==="stars"?"Collect stars":m.type==="score"?"Score points":"Travel distance";
 return `${n}: ${Math.min(m.progress,m.target)} / ${m.target}`;
}
function rollMission(){
 const opts=[{type:"stars",target:30},{type:"score",target:120},{type:"distance",target:900}];
 save.mission={...opts[Math.floor(Math.random()*opts.length)],progress:0};persist();
}
function updateMission(){
 const gained=Math.max(0,missionValue()-missionStart);save.mission.progress=Math.min(save.mission.target,gained);
}
function completeMission(){
 if(save.mission.progress>=save.mission.target){save.bank+=25;toast("Mission complete +25 ⭐");rollMission();return true}persist();return false
}
function endRun(){
 state="gameover";save.best=Math.max(save.best,Math.floor(score));save.bank+=runCoins;updateMission();const completed=completeMission();persist();
 $("result").innerHTML=`Score <b>${Math.floor(score)}</b><br>Stars earned <b>${runCoins}</b><br>Lives remaining <b>${lives}/${maxLives}</b><br>Best <b>${save.best}</b>`;
 $("missionResult").innerHTML=completed?"<p>Mission complete! Bonus: 25 ⭐</p>":`<p>${missionText()}</p>`;
 show("gameover");renderMenu();
}
function pause(){if(!["running","tutorial"].includes(state))return;stateBeforePause=state;state="paused";show("pause")}
let stateBeforePause="running";
function resume(){hideAll();state=stateBeforePause;last=performance.now()}
function renderMenu(){
 $("best").textContent=save.best;$("bank").textContent=save.bank;$("soundBtn").textContent="Sound: "+(save.sound?"On":"Off");
 $("mission").innerHTML=`<b>Current mission</b><br>${missionText()}<div class="small">Reward: 25 ⭐</div>`;
 $("skins").innerHTML="";
 characters.forEach((character,i)=>{
  const btn=document.createElement("button");btn.className="skin"+(save.skin===i?" selected":"");btn.title=`Play as ${character.name}`;
  const preview=document.createElement("canvas");preview.width=50;preview.height=50;
  const label=document.createElement("span");label.textContent=character.name;btn.append(preview,label);
  const pc=preview.getContext("2d");pc.imageSmoothingEnabled=false;drawPixelCharacter(pc,25,28,character.type,performance.now()/1000,true,0);
  btn.onclick=()=>{save.skin=i;persist();renderMenu();toast(`${character.name} selected`)};
  $("skins").appendChild(btn);
 });
}
