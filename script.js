const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
const colors = ["#493226","#9d6e56","#d79a72","#f2c6a6","#fffaf5","#c99b7d"];

function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
addEventListener("resize",resize); resize();

function burst(){
  pieces = Array.from({length:150},(_,i)=>({
    x:innerWidth/2+(Math.random()-.5)*220,
    y:innerHeight*.38+(Math.random()-.5)*80,
    vx:(Math.random()-.5)*12,
    vy:-(Math.random()*11+5),
    g:.22+Math.random()*.12,
    r:Math.random()*Math.PI,
    vr:(Math.random()-.5)*.22,
    s:4+Math.random()*7,
    c:colors[i%colors.length],
    life:0,
    max:120+Math.random()*100
  }));
  requestAnimationFrame(frame);
}
function frame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces.forEach(p=>{
    p.life++; p.x+=p.vx; p.y+=p.vy; p.vy+=p.g; p.r+=p.vr;
    const alpha=Math.max(0,1-p.life/p.max);
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(p.x,p.y);ctx.rotate(p.r);
    ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);ctx.restore();
  });
  pieces=pieces.filter(p=>p.life<p.max);
  if(pieces.length) requestAnimationFrame(frame);
}
window.addEventListener("load",()=>setTimeout(burst,180));
