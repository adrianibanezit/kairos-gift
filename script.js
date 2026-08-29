const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationId = null;
const colors = ["#493226","#9d6e56","#d79a72","#f2c6a6","#fffaf5","#c99b7d"];

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize); resize();

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function createPieces(count){
  const baseX = innerWidth / 2;
  const baseY = innerHeight * 0.38;
  return Array.from({length: count}, (_, i) => ({
    x: baseX + (Math.random() - 0.5) * 220,
    y: baseY + (Math.random() - 0.5) * 80,
    vx: (Math.random() - 0.5) * 8,
    vy: -(Math.random() * 8 + 4),
    g: 0.14 + Math.random() * 0.08,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.18,
    s: 3 + Math.random() * 6,
    c: colors[i % colors.length],
    life: 0,
    max: 80 + Math.random() * 80
  }));
}

function burst(){
  if (prefersReduced) return; // don't run burst for users who prefer reduced motion
  // smaller burst for performance & subtlety
  pieces = createPieces(60);
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(frame);
}

function frame(){
  if (document.hidden) { // pause when tab not visible
    animationId = requestAnimationFrame(frame);
    return;
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces.forEach(p => {
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.r += p.vr;
    const alpha = Math.max(0, 1 - p.life / p.max);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    // rounded rect-like shape for friendlier look
    ctx.beginPath();
    ctx.ellipse(0, 0, p.s * 0.8, p.s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  pieces = pieces.filter(p => p.life < p.max);
  if (pieces.length) {
    animationId = requestAnimationFrame(frame);
  } else {
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}

// Pause/resume on visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return; // when coming back, allow next burst to start if pieces exist
});

// Run burst on load with small delay, unless user prefers reduced motion
window.addEventListener("load", () => {
  if (prefersReduced) return;
  setTimeout(burst, 180);
});

// Optional: expose a simple trigger for debugging or manual activation
window.kairos = window.kairos || {};
window.kairos.triggerConfetti = () => { if (!prefersReduced) burst(); };
