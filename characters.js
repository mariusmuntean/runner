function pxRect(c,x,y,w,h,color,s=2){c.fillStyle=color;c.fillRect(Math.round(x*s)/s,Math.round(y*s)/s,w,h)}
function drawPixelCharacter(c,x,y,type,time,preview=false,vy=0){
 c.save();c.translate(Math.round(x),Math.round(y));c.imageSmoothingEnabled=false;
 const grounded=preview||Math.abs(vy)<45;const phase=time*10;const step=grounded?Math.sin(phase):0;const bob=grounded?Math.round(Math.abs(Math.sin(phase))*2):0;
 const rising=!preview&&vy<-80,falling=!preview&&vy>80;
 if(type==="explorer"){
  const legA=grounded?Math.round(step*4):(rising?-3:2),legB=grounded?-Math.round(step*4):(rising?2:4);
  pxRect(c,-8,-10-bob,16,15,"#2f6fd6");pxRect(c,-10,-22-bob,20,15,"#f2b38b");
  pxRect(c,-10,-25-bob,17,6,"#503020");pxRect(c,7,-18-bob,4,5,"#f2b38b");
  pxRect(c,-5,-16-bob,3,3,"#172033");pxRect(c,3,-16-bob,3,3,"#172033");pxRect(c,-2,-11-bob,6,2,"#a84b45");
  pxRect(c,-12,-8-bob,4,12,"#d94b46");pxRect(c,8,-7-bob,7,3,"#ffd84a");pxRect(c,13,-6-bob,8,2,"#ffd84a");
  pxRect(c,-7,5-bob+legA,6,10,"#28344c");pxRect(c,2,5-bob+legB,6,10,"#28344c");
  pxRect(c,-10,13-bob+legA,9,4,"#252525");pxRect(c,1,13-bob+legB,9,4,"#252525");
  const arm=Math.round(step*3);pxRect(c,-13,-8-bob-arm,4,10,"#f2b38b");pxRect(c,9,-8-bob+arm,4,10,"#f2b38b");
 }else if(type==="dog"){
  const legA=grounded?Math.round(step*3):1,legB=grounded?-Math.round(step*3):3;
  pxRect(c,-13,-11-bob,25,14,"#c87534");pxRect(c,7,-18-bob,14,14,"#d98a45");
  pxRect(c,8,-23-bob,5,8,"#8a4d27");pxRect(c,17,-22-bob,5,8,"#8a4d27");pxRect(c,17,-13-bob,5,4,"#f4c590");
  pxRect(c,12,-14-bob,3,3,"#171717");pxRect(c,18,-9-bob,3,3,"#171717");pxRect(c,-17,-13-bob,7,4,"#c87534");
  pxRect(c,-10,2-bob+legA,5,9,"#f4c590");pxRect(c,-1,2-bob+legB,5,9,"#f4c590");pxRect(c,7,2-bob+legA,5,9,"#f4c590");
  pxRect(c,-12,9-bob+legA,7,3,"#6c3c22");pxRect(c,-3,9-bob+legB,7,3,"#6c3c22");pxRect(c,6,9-bob+legA,7,3,"#6c3c22");
 }else if(type==="robot"){
  const legA=grounded?Math.round(step*4):0,legB=grounded?-Math.round(step*4):3;
  pxRect(c,-10,-20-bob,20,15,"#9de8f2");pxRect(c,-7,-17-bob,14,7,"#20324c");pxRect(c,-5,-15-bob,3,3,"#55f6ff");pxRect(c,3,-15-bob,3,3,"#55f6ff");
  pxRect(c,-8,-5-bob,16,12,"#607a9b");pxRect(c,-4,-2-bob,8,5,"#ffcf55");pxRect(c,-13,-4-bob,5,10,"#829ab6");pxRect(c,8,-4-bob,5,10,"#829ab6");
  pxRect(c,-7,7-bob+legA,5,9,"#40536d");pxRect(c,2,7-bob+legB,5,9,"#40536d");pxRect(c,-9,14-bob+legA,8,3,"#26354a");pxRect(c,1,14-bob+legB,8,3,"#26354a");
  if(!grounded){pxRect(c,-6,17,4,5,"#ff8a32");pxRect(c,2,17,4,5,"#ffcf55")}
 }else{
  const legA=grounded?Math.round(step*3):0,legB=grounded?-Math.round(step*3):3;
  pxRect(c,-13,-10-bob,22,15,"#58bd68");pxRect(c,5,-20-bob,16,16,"#6bd379");pxRect(c,16,-16-bob,5,5,"#b8ef83");pxRect(c,13,-15-bob,3,3,"#172033");
  pxRect(c,-22,-7-bob,12,5,"#58bd68");pxRect(c,-27,-9-bob,7,3,"#58bd68");pxRect(c,8,-4-bob,8,3,"#58bd68");pxRect(c,13,-2-bob,5,2,"#58bd68");
  pxRect(c,-8,4-bob+legA,6,10,"#3d914c");pxRect(c,2,4-bob+legB,6,10,"#3d914c");pxRect(c,-10,12-bob+legA,10,4,"#255f35");pxRect(c,0,12-bob+legB,10,4,"#255f35");
  pxRect(c,-7,-13-bob,4,4,"#b8ef83");pxRect(c,-1,-15-bob,4,4,"#b8ef83");
 }
 c.restore();
}
