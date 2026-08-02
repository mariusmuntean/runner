function shoot(){
 bullets.push({x:player.x+20,y:player.y,vx:620,r:5,life:1.6});
 burst(player.x+18,player.y,"#9ffcff",4);beep(680,.025,"square");
}
function launchRocket(){
 missiles.push({x:player.x+18,y:player.y,vx:470,r:11,life:2.2});
 toast("Piercing rocket!");beep(170,.16,"sawtooth");
}
function destroyHazard(index,bonus=8){
 const h=hazards[index];if(!h)return;
 burst(h.x+h.w/2,h.y-h.h/2,"#ffcf70",18);
 hazards.splice(index,1);score+=bonus;combo+=2;mult=1+Math.min(4,Math.floor(combo/5));shake=5;
}
function openMysteryCrate(){
 const r=Math.random();
 if(r<.15){if(lives<maxLives)lives++;else guardian=Math.min(3,guardian+1);toast("Crate: extra life")}
 else if(r<.40){runCoins+=20;score+=40;toast("Crate: +20 stars")}
 else if(r<.62){player.shield=Math.max(player.shield,10);toast("Crate: shield")}
 else if(r<.84){player.blaster=Math.max(player.blaster,8);toast("Crate: blaster")}
 else{player.frenzy=Math.max(player.frenzy,7);toast("Crate: score frenzy")}
 beep(900,.14,"triangle");
}
function update(dt){
 if(!["running","tutorial"].includes(state))return;
 distance+=dt*100;score+=dt*(5+mult)*(player.frenzy>0?2:1);worldSpeed=(255+Math.min(score*1.35,150))*(player.slow>0?.62:1)*(freezeWorld>0?.38:1);groundOffset=(groundOffset+worldSpeed*dt)%80;
 biomeIndex=Math.floor(score/80)%biomes.length;
 if(Math.floor(score)>0&&Math.floor(score)%100===0&&bossT<=0&&!bossRewarded){bossT=8;bossRewarded=true;toast("Boss wave!");beep(110,.25,"sawtooth")}
 if(bossT>0)bossT-=dt;

 player.inv=Math.max(0,player.inv-dt);player.shield=Math.max(0,player.shield-dt);player.magnet=Math.max(0,player.magnet-dt);player.bonusMagnet=Math.max(0,player.bonusMagnet-dt);player.blaster=Math.max(0,player.blaster-dt);freezeWorld=Math.max(0,freezeWorld-dt);rewardWave=Math.max(0,rewardWave-dt);player.dash=Math.max(0,player.dash-dt);player.jumpBoost=Math.max(0,player.jumpBoost-dt);player.slow=Math.max(0,player.slow-dt);player.frenzy=Math.max(0,player.frenzy-dt);coinRain=Math.max(0,coinRain-dt);bonusFrenzy=Math.max(0,bonusFrenzy-dt);player.maxJumps=player.jumpBoost>0?4:2;
 if(player.blaster>0){
   fireTimer-=dt;
   if(fireTimer<=0){shoot();fireTimer=Math.max(.20,.34-score*.00014)}
 }else{
   fireTimer=0;
 }
 player.vy+=(held&&player.vy>0?720:2050)*dt;player.y+=player.vy*dt;
 if(player.y>=groundY()-player.r){player.y=groundY()-player.r;player.vy=0;player.jumps=0}
 player.angle+=(Math.max(-.45,Math.min(.45,player.vy/1400))-player.angle)*.12;

 spawnT-=dt*60;if(spawnT<=0){if(rewardWave<=0)spawnHazard();spawnT=(bossT>0?46:Math.max(58,92-score*.02))+Math.random()*32}
 starT-=dt*60;if(starT<=0){spawnStarRow();starT=85+Math.random()*80}
 powerT-=dt*60;if(powerT<=0){spawnPower();powerT=300+Math.random()*220}
 if(rewardWave>0&&Math.random()<dt*2.2){powers.push({type:Math.random()<.5?"mystery":"heart",x:W+25,y:groundY()-100-Math.random()*100,r:12})}
 if(coinRain>0&&Math.random()<dt*(bonusFrenzy>0?13:7)){stars.push({x:W+20,y:110+Math.random()*(H-240),r:7})}
 if(bonusFrenzy>0&&Math.random()<dt*.8){powers.push({type:Math.random()<.5?"magnet":"heart",x:W+30,y:130+Math.random()*(H-260),r:12})}

 for(let i=hazards.length-1;i>=0;i--){
  const h=hazards[i];h.x-=h.vx*dt;if(h.type==="drone")h.y+=Math.sin(performance.now()/280+h.phase)*18*dt;if(h.type==="roller")h.spin+=dt*5;
  if(h.x+h.w<-40){hazards.splice(i,1);combo++;mult=1+Math.min(4,Math.floor(combo/5));continue}
  let collided=false;
  const pr=player.r*0.62;

  if(h.type==="spike"){
    const localX=player.x-h.x;
    if(localX>=0&&localX<=h.w){
      const half=h.w/2;
      const surfaceY = localX<=half
        ? h.y-(localX/half)*h.h
        : h.y-((h.w-localX)/half)*h.h;
      collided = player.y+pr > surfaceY+5 && player.y-pr < h.y;
    }
  } else if(h.type==="drone"){
    const insetX=6,insetY=4;
    collided =
      player.x+pr > h.x+insetX &&
      player.x-pr < h.x+h.w-insetX &&
      player.y+pr > h.y-h.h+insetY &&
      player.y-pr < h.y-insetY;
  } else if(h.type==="gate"){
    const insetX=5,insetY=8;
    collided =
      player.x+pr > h.x+insetX &&
      player.x-pr < h.x+h.w-insetX &&
      player.y+pr > h.y-h.h+insetY &&
      player.y-pr < h.y-insetY;
  } else if(h.type==="roller"){
    const dx=player.x-(h.x+h.w/2),dy=player.y-(h.y-h.h/2);
    collided=dx*dx+dy*dy<(pr+13)*(pr+13);
  } else {
    const dx=player.x-h.x,dy=player.y-h.y;
    collided = dx*dx+dy*dy < (pr+10)*(pr+10);
  }

  if(collided) hitHazard(h,i);
  else if(!h.near&&h.x<player.x&&Math.abs(player.y-(h.y-h.h/2))<48){
    h.near=true;score+=3;combo+=2;mult=1+Math.min(4,Math.floor(combo/5));toast("Near miss +3")
  }
 }
 for(let i=stars.length-1;i>=0;i--){
  const s=stars[i];s.x-=worldSpeed*.92*dt;
  if(player.magnet>0){const dx=player.x-s.x,dy=player.y-s.y,d=Math.hypot(dx,dy);if(d<220){s.x+=dx*dt*5;s.y+=dy*dt*5}}
  if(Math.hypot(player.x-s.x,player.y-s.y)<player.r+s.r+4){stars.splice(i,1);runCoins++;score+=5*mult*(player.frenzy>0?2:1);combo++;mult=1+Math.min(4,Math.floor(combo/5));
    if(runCoins%10===0){score+=25;toast("Star streak +25");burst(s.x,s.y,"#ffd84a",18)}
    else burst(s.x,s.y,"#fff4a3",8);
    beep(790,.035)}
  else if(s.x<-20)stars.splice(i,1);
 }
 for(let i=bullets.length-1;i>=0;i--){
  const b=bullets[i];b.x+=b.vx*dt;b.life-=dt;
  let used=false;
  for(let j=hazards.length-1;j>=0;j--){
    const h=hazards[j],rect={x:h.x,y:h.y-h.h,w:h.w,h:h.h};
    const px=Math.max(rect.x,Math.min(b.x,rect.x+rect.w)),py=Math.max(rect.y,Math.min(b.y,rect.y+rect.h));
    if((b.x-px)**2+(b.y-py)**2<=b.r*b.r){destroyHazard(j,9);used=true;break}
  }
  if(used||b.life<=0||b.x>W+30)bullets.splice(i,1)
 }
 for(let i=missiles.length-1;i>=0;i--){
  const m=missiles[i];m.x+=m.vx*dt;m.life-=dt;
  for(let j=hazards.length-1;j>=0;j--){
    const h=hazards[j];
    if(m.x+m.r>h.x&&m.x-m.r<h.x+h.w&&m.y+m.r>h.y-h.h&&m.y-m.r<h.y){destroyHazard(j,12)}
  }
  if(m.life<=0||m.x>W+60)missiles.splice(i,1)
 }
 for(let i=powers.length-1;i>=0;i--){
  const p=powers[i];p.x-=worldSpeed*.88*dt;
  if(player.bonusMagnet>0){const dx=player.x-p.x,dy=player.y-p.y,d=Math.hypot(dx,dy);if(d<300){p.x+=dx*dt*4.8;p.y+=dy*dt*4.8}}
  if(Math.hypot(player.x-p.x,player.y-p.y)<player.r+p.r+4){
    powers.splice(i,1);if(p.type==="bonus"){
      const reward=10+Math.floor(Math.random()*16);
      runCoins+=reward;score+=reward*2;combo+=3;mult=1+Math.min(4,Math.floor(combo/5));
      toast(`Bonus crate +${reward} ⭐`);burst(p.x,p.y,"#ffd84a",24);beep(1040,.14,"triangle");
    }else{
      if(p.type==="jumpBoost"){
        player.jumpBoost=12;player.maxJumps=4;player.jumps=Math.min(player.jumps,2);
        toast("Wing boost: 4 jumps");beep(1080,.13,"triangle");
      }else if(p.type==="heart"){
        if(lives<maxLives){lives++;toast(`Extra life: ${lives}/${maxLives}`);}
        else{score+=50;runCoins+=5;toast("Max lives: +50 score");}
        burst(p.x,p.y,"#ff6b8a",22);beep(720,.16,"triangle");
      }else if(p.type==="goldenHeart"){
        const before=lives;lives=Math.min(maxLives,lives+2);
        if(lives>before)toast(`Golden heart: +${lives-before} lives`);
        else{score+=100;toast("Golden heart: +100 score");}
        burst(p.x,p.y,"#ffd84a",30);beep(880,.22,"triangle");
      }else if(p.type==="blaster"){
        player.blaster=Math.max(player.blaster,12);fireTimer=0;toast("Auto blaster online");beep(740,.16,"square");
      }else if(p.type==="freeze"){
        freezeWorld=6;toast("Freeze pulse");burst(p.x,p.y,"#b9f4ff",25);beep(420,.2,"sine");
      }else if(p.type==="rocket"){
        launchRocket();
      }else if(p.type==="mystery"){
        openMysteryCrate();
      }else if(p.type==="bonusMagnet"){
        player.bonusMagnet=12;toast("Bonus magnet activated");beep(860,.16,"triangle");
      }else if(p.type==="guardian"){
        guardian=Math.min(3,guardian+1);toast(`Guardian ready ×${guardian}`);beep(1040,.2,"sine");
      }else if(p.type==="bonusFrenzy"){
        bonusFrenzy=10;coinRain=10;player.magnet=Math.max(player.magnet,10);toast("BONUS FRENZY!");beep(1250,.22,"square");
      }else if(p.type==="slow"){
        player.slow=8;toast("Slow time");beep(520,.16,"sine");
      }else if(p.type==="frenzy"){
        player.frenzy=10;toast("Score frenzy ×2");beep(1120,.16,"square");
      }else if(p.type==="coinRain"){
        coinRain=6;toast("Coin rain!");beep(920,.18,"triangle");
      }else{
        player[p.type]=p.type==="shield"?16:p.type==="magnet"?14:7;
        toast(p.type[0].toUpperCase()+p.type.slice(1)+" activated");beep(960,.11,"triangle");
      }
    }
  }else if(p.x<-30)powers.splice(i,1);
 }
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=420*dt;p.l-=dt;if(p.l<=0)particles.splice(i,1)}
 shake=Math.max(0,shake-35*dt);flash=Math.max(0,flash-dt);
 if(combo>=50){
   const threshold=Math.floor(combo/50)*50;
   if(threshold>lastComboReward){
     lastComboReward=threshold;
     if(threshold%100===0){
       if(lives<maxLives){lives++;toast("100 combo: +1 life");}
       else{guardian=Math.min(3,guardian+1);toast("100 combo: Guardian");}
     }else{
       const rewards=["shield","magnet","dash","slow","frenzy","jumpBoost"];
       const type=rewards[Math.floor(Math.random()*rewards.length)];
       powers.push({type,x:player.x+120,y:Math.max(120,player.y-60),r:12});
       toast("50 combo reward!");
     }
   }
 }
 if(runCoins>=300){
   const threshold=Math.floor(runCoins/300)*300;
   if(threshold>lastLifeConversion){
     const gained=(threshold-lastLifeConversion)/300;
     lastLifeConversion=threshold;
     if(lives<maxLives){
       const before=lives;lives=Math.min(maxLives,lives+gained);
       toast(`${threshold} stars: +${lives-before} life${lives-before===1?"":"s"}`);
     }else{
       guardian=Math.min(3,guardian+gained);toast(`${threshold} stars: Guardian reward`);
     }
     burst(player.x,player.y,"#ff6b8a",34);beep(780,.22,"triangle");
   }
 }
 if(runCoins>=100){
   const milestone=Math.floor(runCoins/100)*100;
   if(milestone>lastStarMilestone){
     lastStarMilestone=milestone;
     if(lives<maxLives)lives++;
     else guardian=Math.min(3,guardian+1);
     mult=5;player.magnet=Math.max(player.magnet,6);rewardWave=5;toast("100 stars: life + reward wave");
   }
 }
 if(bossT<=0&&bossRewarded){
   bossRewarded=false;
   if(lives<maxLives)lives++;else guardian=Math.min(3,guardian+1);
   coinRain=4;player.shield=Math.max(player.shield,8);toast("Boss reward: life + shield");
 }
 updateMission();updateHud();

 if(state==="tutorial"){
   if(tutorialStep===2&&held&&player.vy>0){tutorialStep=3;toast("Collect the stars")}
   if(tutorialStep===3&&runCoins>=3){tutorialStep=4;toast("Tutorial complete!");setTimeout(()=>{state="running"},900)}
 }
}
function roundedRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
