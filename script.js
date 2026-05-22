/* =============================================
   BIRTHDAY WEBSITE — script.js
   Ultra Interactive Edition
   ============================================= */

/* ======= SCREEN MANAGER ======= */
const SCREENS = ['screenIntro','screenHero','screenCandle','screenSurprise','screenTimeline','screenLetter'];
let currentScreen = 0;

function goTo(idx, direction = 1) {
  const prev = document.getElementById(SCREENS[currentScreen]);
  const next = document.getElementById(SCREENS[idx]);
  if (!next || idx === currentScreen) return;

  prev.classList.add('exit');
  setTimeout(() => {
    prev.classList.add('hidden');
    prev.classList.remove('exit');
    next.classList.remove('hidden');
    currentScreen = idx;
    updateNavDots();
    onScreenEnter(idx);
  }, 600);
}

function updateNavDots() {
  document.querySelectorAll('.nd').forEach((d,i) => {
    d.classList.toggle('active', i === currentScreen);
  });
}

document.querySelectorAll('.nd').forEach(d => {
  d.addEventListener('click', () => {
    const idx = parseInt(d.dataset.screen);
    if (idx !== currentScreen) goTo(idx);
  });
});

function onScreenEnter(idx) {
  if (idx === 1) startHeroTyping();
  if (idx === 3) startFireworks();
  if (idx === 4) initTimeline();
}

/* ======= CURSOR ======= */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx-6+'px'; cursor.style.top = my-6+'px'; }
});

function animateCursor() {
  tx += (mx - tx) * .13;
  ty += (my - ty) * .13;
  if (trail) { trail.style.left = tx-15+'px'; trail.style.top = ty-15+'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ======= PARTICLES CANVAS ======= */
const mainCanvas = document.getElementById('canvas');
const mainCtx = mainCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * mainCanvas.width;
    this.y = Math.random() * mainCanvas.height + mainCanvas.height;
    this.vx = (Math.random() - .5) * .5;
    this.vy = -(Math.random() * .8 + .3);
    this.size = Math.random() * 4 + 1;
    this.alpha = Math.random() * .6 + .2;
    this.symbol = ['♡','✦','✿','❀','·'][Math.floor(Math.random()*5)];
    this.color = ['#f0a0b8','#c8a04a','#d4637a','#e8d080','#ffffff'][Math.floor(Math.random()*5)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - .5) * .02;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 150;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.life++;
    if (this.life > this.maxLife || this.y < -20) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha * Math.sin((this.life / this.maxLife) * Math.PI);
    ctx.fillStyle = this.color;
    ctx.font = `${this.size * 4}px serif`;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

for (let i = 0; i < 60; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animateParticles() {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  particles.forEach(p => { p.update(); p.draw(mainCtx); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ======= FLOATING HEARTS (INTRO) ======= */
const fhContainer = document.getElementById('floatingHearts');
const heartSymbols = ['♡','♥','❤','💕','💗'];

function spawnHeart() {
  const h = document.createElement('span');
  h.classList.add('fh');
  const size = Math.random() * 18 + 10;
  const duration = Math.random() * 10 + 8;
  const delay = Math.random() * 5;
  h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  h.style.cssText = `
    left:${Math.random()*100}%;
    --s:${size}px;
    --d:${duration}s;
    --del:${delay}s;
    color:hsl(${Math.random()*30+330}deg,60%,70%);
  `;
  fhContainer.appendChild(h);
  setTimeout(() => h.remove(), (duration + delay) * 1000);
}
setInterval(spawnHeart, 400);
for (let i = 0; i < 12; i++) spawnHeart();

/* ======= STARS (INTRO BG) ======= */
const starsBg = document.getElementById('starsBg');
for (let i = 0; i < 120; i++) {
  const s = document.createElement('div');
  const size = Math.random() * 3 + 1;
  s.style.cssText = `
    position:absolute;
    width:${size}px;height:${size}px;
    background:white;border-radius:50%;
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    opacity:${Math.random()*.7+.1};
    animation:twinkle ${Math.random()*3+2}s ease-in-out ${Math.random()*3}s infinite alternate;
  `;
  starsBg.appendChild(s);
}
const starStyle = document.createElement('style');
starStyle.textContent = `@keyframes twinkle{0%{opacity:.1;transform:scale(1)}100%{opacity:.9;transform:scale(1.5)}}`;
document.head.appendChild(starStyle);

/* ======= INTRO BUTTON ======= */
document.getElementById('btnEnter').addEventListener('click', () => {
  startMusic();
  goTo(1);
});

/* ======= MUSIC ======= */
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicWave = document.getElementById('musicWave');
let musicPlaying = false;

function startMusic() {
  music.volume = 0;
  music.play().then(() => {
    musicPlaying = true;
    musicWave.classList.add('visible');
    fadeAudio(music, 0, .55, 2500);
  }).catch(() => {});
}

function fadeAudio(audio, from, to, ms) {
  const steps = ms / 50;
  const step = (to - from) / steps;
  let v = from;
  const iv = setInterval(() => {
    v = Math.max(0, Math.min(1, v + step));
    audio.volume = v;
    if ((step > 0 && v >= to) || (step < 0 && v <= to)) {
      clearInterval(iv);
      if (to === 0) audio.pause();
    }
  }, 50);
}

musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    fadeAudio(music, music.volume, 0, 800);
    musicPlaying = false;
    musicWave.classList.remove('visible');
    musicToggle.textContent = '♪';
  } else {
    music.play();
    fadeAudio(music, 0, .55, 800);
    musicPlaying = true;
    musicWave.classList.add('visible');
    musicToggle.textContent = '♬';
  }
});

/* ======= HERO TYPING ======= */
const heroQuotes = [
  'Kamu adalah alasan aku percaya bahwa hal baik memang ada.',
  'Setiap hari bersamamu adalah anugerah yang tak pernah aku anggap biasa.',
  '"You are my safe place" — dan aku tidak ingin pulang ke manapun selain kamu.'
];
let heroTypingDone = false;

function startHeroTyping() {
  if (heroTypingDone) return;
  heroTypingDone = true;
  const el = document.getElementById('heroTyping');
  let qi = 0, ci = 0;
  el.textContent = '';

  function typeChar() {
    if (ci < heroQuotes[qi].length) {
      el.textContent += heroQuotes[qi][ci++];
      setTimeout(typeChar, 55);
    } else {
      setTimeout(eraseChar, 2500);
    }
  }
  function eraseChar() {
    if (ci > 0) {
      el.textContent = heroQuotes[qi].slice(0, --ci);
      setTimeout(eraseChar, 28);
    } else {
      qi = (qi + 1) % heroQuotes.length;
      setTimeout(typeChar, 600);
    }
  }
  setTimeout(typeChar, 800);
}

document.getElementById('btnToCandle').addEventListener('click', () => goTo(2));

/* ======= CANDLE SYSTEM ======= */
const candleMessages = [
  {
    title: '✦ Satu: Terima Kasih',
    text: 'Terima kasih sudah menjadi alasan aku tersenyum di pagi hari, bahkan sebelum aku membuka mataku sepenuhnya.'
  },
  {
    title: '✦ Dua: Maaf',
    text: 'Maaf untuk setiap kali aku tidak cukup peka, tidak cukup hadir. Tapi aku selalu berusaha menjadi lebih baik — untukmu.'
  },
  {
    title: '✦ Tiga: Bangga',
    text: 'Aku sangat bangga melihat betapa kuatnya kamu. Setiap hari kamu adalah inspirasiku untuk tidak menyerah.'
  },
  {
    title: '✦ Empat: Janji',
    text: 'Aku berjanji untuk selalu ada — di hari biasa maupun hari paling berat sekalipun. Kamu tidak akan pernah sendirian.'
  },
  {
    title: '✦ Lima: Cinta',
    text: 'Dan yang terakhir — aku mencintaimu. Bukan karena terpaksa, tapi karena setiap hari aku selalu memilihmu lagi.'
  }
];

let blownCandles = new Set();
let showingMsg = false;

document.querySelectorAll('.candle-wrap').forEach(cw => {
  cw.addEventListener('click', () => {
    const idx = parseInt(cw.dataset.index);
    if (blownCandles.has(idx) || showingMsg) return;

    blownCandles.add(idx);
    blowCandle(cw, idx);
  });
});

function blowCandle(cw, idx) {
  showingMsg = true;

  // Puff animation
  spawnCandlePuff(cw);

  // Extinguish flame
  const flame = cw.querySelector('.flame-wrap');
  const smoke = cw.querySelector('.smoke');
  flame.style.transition = 'opacity .4s ease';
  flame.style.opacity = '0';
  cw.classList.add('blown');
  smoke.classList.remove('hidden');
  smoke.style.display = 'block';
  setTimeout(() => smoke.classList.add('hidden'), 2000);

  // Update counter
  document.getElementById('candleCount').textContent = blownCandles.size;

  // Spawn sparks from candle position
  spawnCandleSparks(cw);

  // Show message overlay
  setTimeout(() => {
    showCandleMessage(idx);
  }, 500);
}

function spawnCandlePuff(cw) {
  const rect = cw.getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    const angle = (Math.random() * 120 - 60) * Math.PI / 180;
    const speed = Math.random() * 60 + 30;
    const size = Math.random() * 20 + 8;
    p.style.cssText = `
      position:fixed;
      left:${rect.left + rect.width/2}px;
      top:${rect.top}px;
      width:${size}px;height:${size}px;
      background:radial-gradient(circle,rgba(220,200,255,.8),transparent);
      border-radius:50%;
      pointer-events:none;z-index:999;
      animation:puffOut .8s ease-out forwards;
      --dx:${Math.sin(angle)*speed}px;
      --dy:${-Math.cos(angle)*speed - 30}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

const puffStyle = document.createElement('style');
puffStyle.textContent = `
@keyframes puffOut{
  0%{transform:translate(0,0) scale(1);opacity:1}
  100%{transform:translate(var(--dx),var(--dy)) scale(2.5);opacity:0}
}
`;
document.head.appendChild(puffStyle);

function spawnCandleSparks(cw) {
  const rect = cw.getBoundingClientRect();
  const colors = ['#ff8040','#ffcc00','#ff4080','#ff80c0','#fff0a0'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('div');
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 80 + 40;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 6 + 3;
    s.style.cssText = `
      position:fixed;
      left:${rect.left + rect.width/2}px;
      top:${rect.top + 10}px;
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50%;
      pointer-events:none;z-index:999;
      box-shadow:0 0 6px ${color};
      animation:sparkFly ${.6 + Math.random()*.5}s ease-out forwards;
      --dx:${Math.cos(angle)*speed}px;
      --dy:${Math.sin(angle)*speed - 60}px;
    `;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

const sparkStyle = document.createElement('style');
sparkStyle.textContent = `
@keyframes sparkFly{
  0%{transform:translate(0,0) scale(1);opacity:1}
  100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}
}
`;
document.head.appendChild(sparkStyle);

function showCandleMessage(idx) {
  const overlay = document.getElementById('candleMsgOverlay');
  const msg = candleMessages[idx];
  document.getElementById('cmbTitle').textContent = msg.title;
  document.getElementById('cmbText').textContent = msg.text;
  overlay.classList.add('active');
}

document.getElementById('cmbClose').addEventListener('click', () => {
  document.getElementById('candleMsgOverlay').classList.remove('active');
  showingMsg = false;

  if (blownCandles.size === 5) {
    setTimeout(() => goTo(3), 1200);
  }
});

/* ======= FIREWORKS ======= */
const fwCanvas = document.getElementById('fireworksCanvas');
let fwCtx, fwActive = false;
let rockets = [], sparksArr = [];

function startFireworks() {
  if (fwActive) return;
  fwActive = true;
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
  fwCtx = fwCanvas.getContext('2d');
  spawnConfetti();

  function loop() {
    if (!fwActive) return;
    fwCtx.fillStyle = 'rgba(6,3,16,.18)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

    // launch rockets
    if (Math.random() < .04) launchRocket();

    rockets.forEach((r, ri) => {
      r.x += r.vx; r.y += r.vy; r.vy += .12;
      r.trail.push({x:r.x,y:r.y,a:.8});
      r.trail = r.trail.slice(-8);

      r.trail.forEach((t,ti) => {
        fwCtx.globalAlpha = t.a * (ti/8);
        fwCtx.fillStyle = r.color;
        fwCtx.beginPath();
        fwCtx.arc(t.x, t.y, 2, 0, Math.PI*2);
        fwCtx.fill();
      });

      if (r.vy >= 0) {
        explode(r.x, r.y, r.color);
        rockets.splice(ri, 1);
      }
    });

    sparksArr.forEach((sp, si) => {
      sp.x += sp.vx; sp.y += sp.vy;
      sp.vy += .06; sp.vx *= .99;
      sp.life--;
      fwCtx.globalAlpha = sp.life / sp.maxLife;
      fwCtx.fillStyle = sp.color;
      fwCtx.beginPath();
      fwCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI*2);
      fwCtx.fill();
    });
    sparksArr = sparksArr.filter(sp => sp.life > 0);
    fwCtx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }
  loop();

  // auto-launch bursts for 8 seconds
  let t = 0;
  const burst = setInterval(() => {
    t++;
    for(let i=0;i<3;i++) launchRocket();
    if(t > 16) clearInterval(burst);
  }, 500);
}

const fwColors = ['#ff6080','#ffcc60','#c080ff','#60d0ff','#ff9060','#80ff80','#ff80c0','#fff080'];

function launchRocket() {
  const x = Math.random() * fwCanvas.width;
  rockets.push({
    x, y: fwCanvas.height,
    vx: (Math.random() - .5) * 3,
    vy: -(Math.random() * 10 + 8),
    color: fwColors[Math.floor(Math.random()*fwColors.length)],
    trail: []
  });
}

function explode(x, y, color) {
  const count = Math.floor(Math.random()*50 + 60);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i;
    const speed = Math.random() * 5 + 2;
    sparksArr.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color, r: Math.random()*2.5+1,
      life: Math.floor(Math.random()*40+50),
      maxLife: 90
    });
  }

  // heart burst
  if (Math.random() < .4) {
    for (let i = 0; i < 20; i++) {
      const t = (i/20) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
      const scale = (Math.random() * 2 + 1);
      sparksArr.push({
        x, y,
        vx: hx * scale * .15,
        vy: hy * scale * .15,
        color: '#ff6080', r: 2.5,
        life: 70, maxLife: 70
      });
    }
  }
}

/* ======= CONFETTI ======= */
function spawnConfetti() {
  const layer = document.getElementById('confettiLayer');
  const colors = ['#ff6080','#ffcc60','#c080ff','#60d0ff','#ff9060','#80ff80'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    const color = colors[Math.floor(Math.random()*colors.length)];
    const size = Math.random() * 10 + 5;
    const delay = Math.random() * 2;
    const duration = Math.random() * 4 + 3;
    c.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:-20px;
      width:${size}px;height:${size * (Math.random()<.5?1:.3)}px;
      background:${color};
      border-radius:${Math.random()<.5?'50%':'2px'};
      animation:confettiFall ${duration}s ${delay}s ease-in forwards;
      --rot:${Math.random()*720}deg;
      --dx:${(Math.random()-0.5)*200}px;
    `;
    layer.appendChild(c);
  }
}

const confStyle = document.createElement('style');
confStyle.textContent = `
@keyframes confettiFall{
  0%{transform:translateY(0) rotate(0deg) translateX(0);opacity:1}
  100%{transform:translateY(105vh) rotate(var(--rot)) translateX(var(--dx));opacity:0}
}
`;
document.head.appendChild(confStyle);

document.getElementById('btnToTimeline').addEventListener('click', () => {
  fwActive = false;
  goTo(4);
});

/* ======= TIMELINE SLIDER ======= */
const cards = document.querySelectorAll('.tl-card');
let tlIdx = 0;

function initTimeline() {
  buildDots();
  updateTimeline();

  // Click images to popup
  document.querySelectorAll('.tl-img-side img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('imgPopupSrc').src = img.src;
      document.getElementById('imgPopup').classList.add('active');
    });
  });
}

function buildDots() {
  const container = document.getElementById('tlDots');
  container.innerHTML = '';
  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.classList.add('tl-dot');
    container.appendChild(d);
  });
}

function updateTimeline() {
  document.getElementById('tlTrack').style.transform = `translateX(-${tlIdx * 100}%)`;
  document.getElementById('tlProgressFill').style.width = ((tlIdx+1)/cards.length*100)+'%';
  document.querySelectorAll('.tl-dot').forEach((d,i) => d.classList.toggle('active', i===tlIdx));

  const btnNext = document.getElementById('tlNext');
  btnNext.textContent = tlIdx === cards.length-1 ? 'Buka Surat →' : '→ Lanjut';
}

document.getElementById('tlPrev').addEventListener('click', () => {
  if (tlIdx > 0) { tlIdx--; updateTimeline(); }
});
document.getElementById('tlNext').addEventListener('click', () => {
  if (tlIdx < cards.length - 1) { tlIdx++; updateTimeline(); }
  else goTo(5);
});

// Touch/swipe support for timeline
let tlTouchX = 0;
const tlScroll = document.getElementById('tlScroll');
tlScroll.addEventListener('touchstart', e => { tlTouchX = e.touches[0].clientX; }, {passive:true});
tlScroll.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tlTouchX;
  if (Math.abs(dx) > 50) {
    if (dx < 0 && tlIdx < cards.length-1) tlIdx++;
    else if (dx > 0 && tlIdx > 0) tlIdx--;
    updateTimeline();
  }
}, {passive:true});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (currentScreen === 4) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (tlIdx < cards.length-1) { tlIdx++; updateTimeline(); }
      else goTo(5);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (tlIdx > 0) { tlIdx--; updateTimeline(); }
    }
  }
  if (e.key === 'Escape') {
    document.getElementById('imgPopup').classList.remove('active');
    document.getElementById('candleMsgOverlay').classList.remove('active');
    showingMsg = false;
  }
});

/* ======= IMAGE POPUP ======= */
document.getElementById('imgPopupClose').addEventListener('click', () => {
  document.getElementById('imgPopup').classList.remove('active');
});
document.getElementById('imgPopup').addEventListener('click', e => {
  if (e.target === document.getElementById('imgPopup'))
    document.getElementById('imgPopup').classList.remove('active');
});

/* ======= ENVELOPE / LETTER ======= */
let envelopeOpened = false;
const envelope = document.getElementById('envelope');

envelope.addEventListener('click', () => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  document.getElementById('envelopeSeal').style.animation = 'none';
  document.getElementById('envelopeSeal').style.transform = 'scale(0) rotate(180deg)';
  document.getElementById('envelopeSeal').style.opacity = '0';
  document.getElementById('envelopeSeal').style.transition = 'all .5s ease';

  setTimeout(() => {
    document.getElementById('envelopeFront')?.classList.add('opened');
    document.querySelector('.envelope-front').classList.add('opened');
    document.getElementById('envelopePaper').classList.add('open');

    // Spawn heart burst from envelope center
    const rect = envelope.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    spawnHeartBurst(cx, cy);
  }, 400);
});

function spawnHeartBurst(cx, cy) {
  const hearts = ['♡','♥','❤','💕'];
  for (let i = 0; i < 15; i++) {
    const h = document.createElement('div');
    const angle = (i / 15) * Math.PI * 2;
    const speed = Math.random() * 100 + 50;
    const dur = Math.random() * .6 + .6;
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    h.style.cssText = `
      position:fixed;
      left:${cx}px;top:${cy}px;
      font-size:${Math.random()*20+12}px;
      color:hsl(${Math.random()*30+330}deg,70%,70%);
      pointer-events:none;z-index:999;
      animation:heartBurst ${dur}s ease-out forwards;
      --ex:${Math.cos(angle)*speed}px;
      --ey:${Math.sin(angle)*speed - 60}px;
    `;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000 + 100);
  }
}

const hbStyle = document.createElement('style');
hbStyle.textContent = `
@keyframes heartBurst{
  0%{transform:translate(0,0) scale(0) rotate(0deg);opacity:1}
  60%{opacity:1}
  100%{transform:translate(var(--ex),var(--ey)) scale(1) rotate(var(--rot,30deg));opacity:0}
}
`;
document.head.appendChild(hbStyle);

/* ======= MOUSE TRAIL HEARTS ======= */
let lastHeartTime = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastHeartTime < 120) return;
  lastHeartTime = now;
  if (Math.random() > .4) return;

  const h = document.createElement('div');
  h.textContent = '✦';
  h.style.cssText = `
    position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    font-size:${Math.random()*10+6}px;
    color:rgba(240,160,184,${Math.random()*.5+.2});
    pointer-events:none;z-index:9997;
    animation:trailFade .8s ease-out forwards;
    transform:translate(-50%,-50%);
  `;
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 900);
});

const trailStyle = document.createElement('style');
trailStyle.textContent = `@keyframes trailFade{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-100%) scale(0.3);opacity:0}}`;
document.head.appendChild(trailStyle);

/* ======= SURPRISE SCREEN CLICK ======= */
document.getElementById('screenSurprise').addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') return;
  // extra fireworks on tap
  if (fwCtx) {
    for (let i = 0; i < 3; i++) setTimeout(() => launchRocket(), i * 150);
  }
});
