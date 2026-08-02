function pxRect(c,x,y,w,h,color,s=2){c.fillStyle=color;c.fillRect(Math.round(x*s)/s,Math.round(y*s)/s,w,h)}
function drawPixelCharacter(c,x,y,type,time,preview=false,vy=0){
 c.save();c.translate(Math.round(x),Math.round(y));c.imageSmoothingEnabled=false;
 const grounded=preview||Math.abs(vy)<45;
 const phase=time*18;
 const stride=grounded?Math.sin(phase):0;
 const bob=grounded?Math.round(Math.abs(Math.sin(phase))*2):0;
 const front=Math.round(stride*6),back=-front;
 const frontLift=grounded?Math.round(Math.max(0,-stride)*4):0;
 const backLift=grounded?Math.round(Math.max(0,stride)*4):0;
 const rising=!preview&&vy<-80,falling=!preview&&vy>80;
 const airFront=rising?5:falling?2:0,airBack=rising?-3:falling?5:0;
 const lf=grounded?front:airFront,lb=grounded?back:airBack;
 const yf=grounded?-frontLift:(rising?-2:2),yb=grounded?-backLift:(rising?2:4);

 if(type==="explorer"){
  pxRect(c,-13,-9-bob,5,13,"#b33c42");
  pxRect(c,-9,-9-bob,17,15,"#2f6fd6");
  pxRect(c,-9,-23-bob,19,15,"#f2b38b");
  pxRect(c,-9,-26-bob,16,6,"#503020");pxRect(c,-4,-28-bob,8,3,"#503020");
  pxRect(c,10,-18-bob,4,5,"#f2b38b");
  pxRect(c,5,-17-bob,3,3,"#172033");
  pxRect(c,6,-11-bob,5,2,"#a84b45");
  pxRect(c,-13,-7-bob,5,3,"#ffd84a");pxRect(c,-19,-6-bob,8,2,"#ffd84a");
  pxRect(c,-8+lb*.45,-7-bob+yb*.3,4,9,"#f2b38b");pxRect(c,-7+lb*.7,0-bob+yb*.4,7,3,"#f2b38b");
  pxRect(c,6-lb*.45,-7-bob-yb*.2,4,9,"#f2b38b");pxRect(c,7-lb*.75,0-bob-yb*.25,7,3,"#f2b38b");
  pxRect(c,-5+lb*.55,5-bob+yb,6,9,"#28344c");pxRect(c,2+lf*.55,5-bob+yf,6,9,"#28344c");
  pxRect(c,-8+lb,12-bob+yb,10,4,"#252525");pxRect(c,1+lf,12-bob+yf,10,4,"#252525");
 }else if(type==="dog"){
  pxRect(c,-15,-11-bob,26,14,"#c87534");pxRect(c,7,-18-bob,15,14,"#d98a45");
  pxRect(c,8,-23-bob,5,8,"#8a4d27");pxRect(c,17,-22-bob,5,8,"#8a4d27");
  pxRect(c,17,-12-bob,7,5,"#f4c590");pxRect(c,14,-14-bob,3,3,"#171717");pxRect(c,22,-10-bob,3,3,"#171717");
  pxRect(c,-20,-13-bob,8,4,"#c87534");pxRect(c,-24,-16-bob,6,3,"#d98a45");
  pxRect(c,-11+lb*.5,2-bob+yb,4,8,"#f4c590");pxRect(c,-4+lf*.5,2-bob+yf,4,8,"#f4c590");
  pxRect(c,4+lb*.5,2-bob+yb,4,8,"#f4c590");pxRect(c,10+lf*.5,1-bob+yf,4,9,"#f4c590");
  pxRect(c,-13+lb,9-bob+yb,7,3,"#6c3c22");pxRect(c,-6+lf,9-bob+yf,7,3,"#6c3c22");
  pxRect(c,2+lb,9-bob+yb,7,3,"#6c3c22");pxRect(c,8+lf,9-bob+yf,8,3,"#6c3c22");
 }else if(type==="robot"){
  pxRect(c,-10,-20-bob,20,15,"#9de8f2");pxRect(c,-7,-17-bob,14,7,"#20324c");
  pxRect(c,3,-15-bob,4,3,"#55f6ff");pxRect(c,9,-16-bob,3,5,"#9de8f2");
  pxRect(c,-8,-5-bob,16,12,"#607a9b");pxRect(c,-4,-2-bob,8,5,"#ffcf55");
  pxRect(c,-10+lb*.55,-4-bob+yb*.3,5,9,"#829ab6");pxRect(c,-11+lb,3-bob+yb*.4,7,3,"#40536d");
  pxRect(c,6-lb*.55,-4-bob-yb*.2,5,9,"#829ab6");pxRect(c,7-lb,3-bob-yb*.3,7,3,"#40536d");
  pxRect(c,-6+lb*.55,7-bob+yb,5,8,"#40536d");pxRect(c,2+lf*.55,7-bob+yf,5,8,"#40536d");
  pxRect(c,-9+lb,13-bob+yb,8,4,"#26354a");pxRect(c,1+lf,13-bob+yf,8,4,"#26354a");
  if(!grounded){pxRect(c,-5,17,4,5,"#ff8a32");pxRect(c,2,17,4,5,"#ffcf55")}
 }else{
  pxRect(c,-14,-10-bob,23,15,"#58bd68");pxRect(c,5,-20-bob,17,16,"#6bd379");
  pxRect(c,16,-15-bob,9,7,"#b8ef83");pxRect(c,14,-16-bob,3,3,"#172033");pxRect(c,23,-11-bob,3,3,"#255f35");
  pxRect(c,-23,-7-bob,12,5,"#58bd68");pxRect(c,-29,-9-bob,8,3,"#58bd68");
  pxRect(c,7+lb*.35,-5-bob+yb*.2,7,3,"#3d914c");pxRect(c,12+lb*.55,-3-bob+yb*.2,5,2,"#3d914c");
  pxRect(c,-7+lb*.55,4-bob+yb,6,9,"#3d914c");pxRect(c,2+lf*.55,4-bob+yf,6,9,"#3d914c");
  pxRect(c,-10+lb,11-bob+yb,10,4,"#255f35");pxRect(c,0+lf,11-bob+yf,10,4,"#255f35");
  pxRect(c,-7,-13-bob,4,4,"#b8ef83");pxRect(c,-1,-15-bob,4,4,"#b8ef83");
 }
 c.restore();
}
