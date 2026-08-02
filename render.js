function draw(){
 const b=biomes[biomeIndex],grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,b.sky[0]);grad.addColorStop(1,b.sky[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
 clouds.forEach((c,i)=>{c.x-=.12+i*.015;if(c.x<-100)c.x=W+80;ctx.globalAlpha=.11;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(c.x,c.y,c.s,0,7);ctx.arc(c.x+c.s,c.y+4,c.s*1.25,0,7);ctx.arc(c.x+c.s*2,c.y,c.s*.8,0,7);ctx.fill()});ctx.globalAlpha=1;
 if(biomeIndex===2){ctx.fillStyle="#ffffff10";for(let i=0;i<12;i++)ctx.fillRect(i*80,H-180-(i%4)*35,55,140+(i%4)*35)}
 if(biomeIndex===0){
   ctx.fillStyle="#173f2a88";
   for(let i=0;i<9;i++){const x=((i*130-groundOffset*.35)%(W+180))-90;ctx.beginPath();ctx.arc(x,groundY()-28,34,Math.PI,0);ctx.fill()}
 }else if(biomeIndex===1){
   ctx.fillStyle="#d47e3988";
   for(let i=0;i<7;i++){const x=((i*170-groundOffset*.25)%(W+220))-110;ctx.beginPath();ctx.moveTo(x,groundY());ctx.lineTo(x+55,groundY()-52);ctx.lineTo(x+110,groundY());ctx.fill()}
 }else{
   ctx.fillStyle="#3df4ff22";
   for(let i=0;i<10;i++){const x=((i*110-groundOffset*.5)%(W+160))-80;ctx.fillRect(x,groundY()-70-(i%3)*20,6,70+(i%3)*20)}
 }
 ctx.fillStyle=b.ground;ctx.fillRect(0,groundY(),W,H-groundY());ctx.fillStyle=b.accent;ctx.fillRect(0,groundY(),W,6);
 ctx.save();
 ctx.globalAlpha=.42;
 for(let x=-groundOffset;x<W+80;x+=80){
   ctx.fillStyle=b.accent;
   ctx.fillRect(x,groundY()+17,42,5);
   ctx.fillRect(x+12,groundY()+29,22,3);
 }
 ctx.globalAlpha=.22;
 for(let x=-(groundOffset*.45)%120;x<W+120;x+=120){
   ctx.fillStyle="#fff";
   ctx.fillRect(x,groundY()-10,2,10);
 }
 ctx.restore();

 hazards.forEach(h=>{
  if(h.type==="spike"){ctx.fillStyle="#ff4165";ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.lineTo(h.x+h.w/2,h.y-h.h);ctx.lineTo(h.x+h.w,h.y);ctx.fill()}
  else if(h.type==="drone"){ctx.fillStyle="#c55cff";roundedRect(h.x,h.y-h.h,h.w,h.h,8);ctx.fillStyle="#fff";ctx.fillRect(h.x+8,h.y-h.h+8,7,4)}
  else if(h.type==="gate"){ctx.fillStyle="#ff8a32";ctx.fillRect(h.x,h.y-h.h,h.w,h.h);ctx.fillStyle="#ffe37a";ctx.fillRect(h.x-6,h.y-h.h+28,h.w+12,8)}
  else if(h.type==="roller"){ctx.save();ctx.translate(h.x+h.w/2,h.y-h.h/2);ctx.rotate(h.spin);ctx.fillStyle="#ff9f43";ctx.beginPath();ctx.arc(0,0,18,0,7);ctx.fill();ctx.strokeStyle="#5a2a00";ctx.lineWidth=3;for(let a=0;a<6;a++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(15,0);ctx.stroke()}ctx.restore()}
  else{ctx.fillStyle="#ff4c7a";ctx.beginPath();ctx.arc(h.x,h.y,14,0,7);ctx.fill()}
 });
 stars.forEach(s=>{ctx.save();ctx.translate(s.x,s.y);ctx.rotate(performance.now()/350);ctx.fillStyle="#fff4a3";ctx.font="16px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("★",0,0);ctx.restore()});
 bullets.forEach(b=>{ctx.fillStyle="#bffcff";ctx.shadowColor="#53e7ff";ctx.shadowBlur=10;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.fill();ctx.shadowBlur=0});
 missiles.forEach(m=>{ctx.fillStyle="#ffcf55";ctx.beginPath();ctx.moveTo(m.x+14,m.y);ctx.lineTo(m.x-10,m.y-8);ctx.lineTo(m.x-10,m.y+8);ctx.fill();ctx.fillStyle="#ff6b3d";ctx.fillRect(m.x-18,m.y-3,10,6)});
 powers.forEach(p=>{ctx.fillStyle=p.type==="shield"?"#32e7ff":p.type==="magnet"?"#ffe45b":p.type==="dash"?"#ff784a":p.type==="jumpBoost"?"#c9f2ff":p.type==="heart"?"#ff6b8a":p.type==="slow"?"#9fd8ff":p.type==="frenzy"?"#ff7b2e":p.type==="coinRain"?"#f7dc6f":p.type==="goldenHeart"?"#ffd700":p.type==="guardian"?"#fff4c2":p.type==="bonusFrenzy"?"#ff72df":p.type==="bonusMagnet"?"#9c7cff":p.type==="blaster"?"#70efff":p.type==="freeze"?"#b9f4ff":p.type==="rocket"?"#ff9a4a":p.type==="mystery"?"#e878ff":"#ffd84a";ctx.beginPath();ctx.arc(p.x,p.y,p.r+3,0,7);ctx.fill();ctx.font="15px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#08111f";ctx.fillText(p.type==="shield"?"🛡":p.type==="magnet"?"🧲":p.type==="dash"?"⚡":p.type==="jumpBoost"?"🪽":p.type==="heart"?"❤️":p.type==="slow"?"⏳":p.type==="frenzy"?"🔥":p.type==="coinRain"?"🌟":p.type==="goldenHeart"?"💛":p.type==="guardian"?"👼":p.type==="bonusFrenzy"?"🎉":p.type==="bonusMagnet"?"🌀":p.type==="blaster"?"🔫":p.type==="freeze"?"❄️":p.type==="rocket"?"🚀":p.type==="mystery"?"❓":"🎁",p.x,p.y+1)});
 particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.l/.7);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.s,p.s)});ctx.globalAlpha=1;
 if(player){
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.angle);
  if(player.dash>0){ctx.fillStyle="#ffd84a88";for(let i=1;i<5;i++){ctx.beginPath();ctx.arc(-i*11,0,Math.max(2,13-i*2),0,7);ctx.fill()}}
  if(player.shield>0){ctx.strokeStyle="#3df4ff";ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,player.r+8,0,7);ctx.stroke()}
  ctx.globalAlpha=player.inv>0&&Math.floor(player.inv*12)%2===0?.35:1;drawPixelCharacter(ctx,0,2,(characters[save.skin]||characters[0]).type,performance.now()/1000,false,player.vy);ctx.restore()
 }
 if(bossT>0){ctx.fillStyle="#0008";ctx.fillRect(W*.2,75,W*.6,12);ctx.fillStyle="#ff4c7a";ctx.fillRect(W*.2,75,W*.6*(bossT/8),12)}
 ctx.restore();
 if(flash){ctx.fillStyle=`rgba(255,255,255,${flash*2})`;ctx.fillRect(0,0,W,H)}
}
function frame(now){const dt=Math.min((now-last)/1000,.033);last=now;update(dt);draw();requestAnimationFrame(frame)}

cv.addEventListener("pointerdown",actionDown,{passive:false});cv.addEventListener("pointerup",actionUp,{passive:false});cv.addEventListener("pointercancel",actionUp,{passive:false});
$("introStart").onclick=e=>{e.stopPropagation();startRun(true)};
$("playBtn").onclick=e=>{e.stopPropagation();startRun(false)};
$("againBtn").onclick=e=>{e.stopPropagation();startRun(false)};
$("homeBtn").onclick=e=>{e.stopPropagation();renderMenu();show("menu")};
$("pauseBtn").onclick=e=>{e.stopPropagation();pause()};
$("resumeBtn").onclick=e=>{e.stopPropagation();resume()};
$("quitBtn").onclick=e=>{e.stopPropagation();endRun()};
$("soundBtn").onclick=e=>{e.stopPropagation();save.sound=!save.sound;persist();renderMenu()};
$("howBtn").onclick=e=>{e.stopPropagation();show("intro");$("introStart").textContent="Start Tutorial"};
document.addEventListener("visibilitychange",()=>{if(document.hidden&&["running","tutorial"].includes(state))pause()});
window.addEventListener("resize",resize);

resize();renderMenu();updateHud();requestAnimationFrame(frame);
