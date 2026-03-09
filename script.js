/* ═══════════════════════════════════════════════
   LEBARAN V2 — script.js
   Konsep: cinematic dark luxury × editorial
═══════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════
// ★ LOGIN
// ════════════════════════════════════════════════════════════
const LOGIN_USER = 'latif';
const LOGIN_PASS = 'tia sayang latif';

// Check if already logged in this session
if (!sessionStorage.getItem('loggedIn')) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginScreen')?.classList.remove('hidden');
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const ls = document.getElementById('loginScreen');
    if (ls) ls.style.display = 'none';
  });
}

window.doLogin = () => {
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();
  const err  = document.getElementById('loginErr');
  const uInp = document.getElementById('loginUser');
  const pInp = document.getElementById('loginPass');
  const btn  = document.getElementById('loginBtnTxt');
  const scr  = document.getElementById('loginScreen');

  const userOk = user === LOGIN_USER;
  const passOk = pass === LOGIN_PASS;

  if (userOk && passOk) {
    err.classList.add('hidden');
    scr.classList.add('loading');
    btn.textContent = 'Masuk... ✦';
    document.querySelectorAll('.login-ring').forEach(r => r.style.animationDuration = '0.35s');

    sessionStorage.setItem('loggedIn', '1');

    setTimeout(() => {
      scr.classList.add('out');
    }, 1600);
    setTimeout(() => {
      scr.style.display = 'none';
    }, 2300);

  } else {
    err.classList.remove('hidden');
    uInp.classList.add('wrong');
    pInp.classList.add('wrong');
    setTimeout(() => {
      uInp.classList.remove('wrong');
      pInp.classList.remove('wrong');
    }, 600);
    pInp.value = '';
    pInp.focus();
  }
};

window.toggleLoginPass = btn => {
  const inp = document.getElementById('loginPass');
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
};

// ── FOTO KAMU ────────────────────────────────
// Ganti isi array ini dengan path foto kamu
// Taruh foto di folder yang sama dengan index.html
// Contoh: const PHOTOS = ['foto1.jpg','foto2.jpg','foto3.jpg'];
const PHOTOS = [];

// ── HARI BERSAMA ─────────────────────────────
// Ganti dengan tanggal pertama kalian jadian
// Format: 'YYYY-MM-DD'
const START_DATE = '2026-02-08';

// ─────────────────────────────────────────────

/* ═══ CINEMATIC BARS ═══ */
let cinEl;
function cinIn(cb) {
  if (!cinEl) {
    cinEl = document.createElement('div');
    cinEl.className = 'cin-wrap';
    cinEl.innerHTML = '<div class="cin-bar cin-top"></div><div class="cin-bar cin-bot"></div>';
    document.body.appendChild(cinEl);
  }
  cinEl.classList.add('in');
  setTimeout(() => {
    cb && cb();
    setTimeout(() => cinEl.classList.remove('in'), 420);
  }, 300);
}

/* ═══ SCENE NAV ═══ */
let curScene = 's-profil';

function goScene(id) {
  cinIn(() => {
    const prev = document.getElementById(curScene);
    const next = document.getElementById(id);
    if (!next || curScene === id) return;
    prev.classList.remove('active');
    prev.classList.add('out');
    setTimeout(() => prev.classList.remove('out'), 700);
    next.classList.add('active');
    curScene = id;
  });
}

/* ═══ PARTICLE CANVAS ═══ */
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
let W, H, pts = [], mouse = { x: -999, y: -999 };
const N = 160;
const PCOLS = ['#c9a25e','#e2c07e','#f0e8d8','#8a7a52','#fff3dc'];

function resizeCvs() {
  W = cvs.width = window.innerWidth;
  H = cvs.height = window.innerHeight;
}

class P {
  constructor(x, y, burst) {
    this.x = x ?? Math.random() * W;
    this.y = y ?? Math.random() * H;
    this.s = burst ? Math.random() * 2.8 + .8 : Math.random() * 1.8 + .3;
    this.c = PCOLS[Math.floor(Math.random() * PCOLS.length)];
    this.a = Math.random() * .55 + .1;
    this.vx = (Math.random() - .5) * (burst ? 5.5 : .25);
    this.vy = (Math.random() - .5) * (burst ? 5.5 : .25) - (burst ? 2 : 0);
    this.life = burst ? 1 : Infinity;
    this.decay = burst ? Math.random() * .014 + .007 : 0;
    this.burst = burst || false;
    this.g = burst ? .07 : 0;
  }
  update() {
    if (this.burst) {
      this.x += this.vx; this.y += this.vy;
      this.vy += this.g; this.vx *= .98;
      this.life -= this.decay;
      this.a = this.life * .75;
      return;
    }
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const d = Math.sqrt(dx*dx + dy*dy), R = 95;
    if (d < R && d > 0) {
      const f = (R - d) / R, ang = Math.atan2(dy, dx);
      this.x += Math.cos(ang) * f * 3.5;
      this.y += Math.sin(ang) * f * 3.5;
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.a);
    ctx.fillStyle = this.c;
    ctx.shadowBlur = 5; ctx.shadowColor = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.s, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

function initPts() {
  pts = [];
  for (let i = 0; i < N; i++) pts.push(new P());
}

function burst(x, y, n = 28) {
  for (let i = 0; i < n; i++) pts.push(new P(x, y, true));
}

/* word particles */
let wPts = [], wTimer;
function spawnWord(text, cx, cy) {
  const off = document.createElement('canvas');
  off.width = 420; off.height = 110;
  const oc = off.getContext('2d');
  oc.fillStyle = '#fff';
  oc.font = '500 56px "Playfair Display", serif';
  oc.textAlign = 'center'; oc.textBaseline = 'middle';
  oc.fillText(text, 210, 55);
  const d = oc.getImageData(0, 0, 420, 110).data;
  const ps = [];
  for (let y = 0; y < 110; y += 4)
    for (let x = 0; x < 420; x += 4)
      if (d[(y*420+x)*4+3] > 128) ps.push({ x: x-210, y: y-55 });
  wPts = ps.map(p => ({
    tx: cx+p.x, ty: cy+p.y,
    x: cx + (Math.random()-.5)*280,
    y: cy + (Math.random()-.5)*280,
    a: 0, c: PCOLS[Math.floor(Math.random()*PCOLS.length)],
    s: Math.random()*2+.8
  }));
  if (wTimer) clearTimeout(wTimer);
  wTimer = setTimeout(() => { wPts = []; }, 3200);
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  pts = pts.filter(p => !p.burst || p.life > 0);
  pts.forEach(p => { p.update(); p.draw(); });
  wPts.forEach(p => {
    p.x += (p.tx - p.x) * .08;
    p.y += (p.ty - p.y) * .08;
    p.a = Math.min(p.a + .04, .85);
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.c;
    ctx.shadowBlur = 4; ctx.shadowColor = p.c;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
  requestAnimationFrame(loop);
}

window.addEventListener('resize', () => { resizeCvs(); initPts(); });
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
});
document.addEventListener('touchmove', e => {
  if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
}, { passive: true });
document.addEventListener('click', e => burst(e.clientX, e.clientY, 22));
document.addEventListener('touchend', e => {
  if (e.changedTouches[0]) burst(e.changedTouches[0].clientX, e.changedTouches[0].clientY, 22);
});

/* ═══ CUSTOM CURSOR ═══ */
const cur = document.getElementById('cur');
const curR = document.getElementById('curRing');
const SPARKS = ['✦','✧','☽','·','⋆'];
let lastSpark = 0;

document.addEventListener('mousemove', e => {
  const x = e.clientX, y = e.clientY;
  cur.style.left = x+'px'; cur.style.top = y+'px';
  curR.style.left = x+'px'; curR.style.top = y+'px';
  const now = Date.now();
  if (now - lastSpark > 85) {
    lastSpark = now;
    const sp = document.createElement('div');
    sp.className = 'cur-spark';
    sp.textContent = SPARKS[Math.floor(Math.random()*SPARKS.length)];
    sp.style.left = (x + (Math.random()-.5)*14)+'px';
    sp.style.top  = (y + (Math.random()-.5)*14)+'px';
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 650);
  }
});

document.addEventListener('mouseover', e => {
  if (e.target.closest('button, a, input, label')) {
    curR.style.width = '48px'; curR.style.height = '48px'; curR.style.opacity = '.5';
  } else {
    curR.style.width = '32px'; curR.style.height = '32px'; curR.style.opacity = '1';
  }
});

/* ═══ PHOTO SLIDER ═══ */
let slide = 0;

function initSlider() {
  const track = document.getElementById('sliderTrack');
  const dotsEl = document.getElementById('sliderDots');

  if (PHOTOS.length > 0) {
    track.innerHTML = '';
    PHOTOS.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'slide';
      div.innerHTML = `<div class="slide-img"><img src="${src}" alt="foto ${i+1}"/></div><p class="slide-caption">momen ${i+1}</p>`;
      track.appendChild(div);
    });
  }

  const slides = track.querySelectorAll('.slide');
  dotsEl.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 's-dot' + (i===0?' on':'');
    d.onclick = () => goSlide(i);
    dotsEl.appendChild(d);
  });

  setInterval(() => goSlide((slide+1) % slides.length), 4000);
}

function goSlide(i) {
  const track = document.getElementById('sliderTrack');
  const slides = track.querySelectorAll('.slide');
  slide = i;
  track.style.transform = `translateX(-${i*100}%)`;
  document.querySelectorAll('.s-dot').forEach((d,j) => d.classList.toggle('on', j===i));
}

window.slideMove = (dir) => {
  const track = document.getElementById('sliderTrack');
  const count = track.querySelectorAll('.slide').length;
  goSlide((slide + dir + count) % count);
};

/* ═══ FLEE BUTTON ═══ */
let fleeCount = 0;
window.flee = btn => {
  fleeCount++;
  const bRect = btn.getBoundingClientRect();
  const mx = window.innerWidth  - bRect.width  - 16;
  const my = window.innerHeight - bRect.height - 16;
  btn.style.position = 'fixed';
  btn.style.left = Math.random()*mx + 'px';
  btn.style.top  = Math.random()*my + 'px';
  btn.style.right = 'auto';
  btn.style.zIndex = 400;
  const msgs = ['beneran ga mau? 🥺','yah kabur lagi...','fokus ke MAU aja ya','dia ga mau disentuh 😂','udah deh maafin...','oke oke ketauan 😅'];
  const hint = document.getElementById('fleeHint');
  hint.textContent = msgs[Math.min(fleeCount-1, msgs.length-1)];
  hint.classList.add('tease');
};

/* ═══ CONFETTI ═══ */
const confCvs = document.getElementById('confCvs');
const confCtx = confCvs.getContext('2d');
let confPts = [], confGo = false;

function setConfSize() {
  confCvs.width  = window.innerWidth;
  confCvs.height = window.innerHeight;
}
setConfSize();
window.addEventListener('resize', setConfSize);

const CCOLS = ['#c9a25e','#e2c07e','#f0e8d8','#fff8e6','#d4a845','#fffbe8'];
function spawnConf(n=130) {
  for (let i=0; i<n; i++) {
    const sh = ['r','c','s'][Math.floor(Math.random()*3)];
    confPts.push({
      x: Math.random()*confCvs.width, y: -10-Math.random()*180,
      vx:(Math.random()-.5)*2.8, vy:1.8+Math.random()*3.5,
      sz:4+Math.random()*7, c:CCOLS[Math.floor(Math.random()*CCOLS.length)],
      rot:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.13,
      sh, a:1, decay:.003+Math.random()*.004,
      wb:Math.random()*Math.PI*2, ws:.05+Math.random()*.04
    });
  }
}

function drawStar(c,x,y,r){
  c.beginPath();
  for(let i=0;i<5;i++){
    const a=(i*4*Math.PI)/5-Math.PI/2, b=a+(2*Math.PI)/5;
    i===0?c.moveTo(x+r*Math.cos(a),y+r*Math.sin(a)):c.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));
    c.lineTo(x+(r/2)*Math.cos(b),y+(r/2)*Math.sin(b));
  }
  c.closePath(); c.fill();
}

function animConf() {
  if (!confGo) return;
  confCtx.clearRect(0,0,confCvs.width,confCvs.height);
  confPts = confPts.filter(p=>p.a>.01);
  confPts.forEach(p=>{
    p.wb+=p.ws; p.x+=p.vx+Math.sin(p.wb)*.7; p.y+=p.vy;
    p.rot+=p.rv; p.vy+=.04;
    p.a -= p.y>confCvs.height*.65 ? p.decay*2.2 : p.decay*.25;
    confCtx.save();
    confCtx.globalAlpha=Math.max(0,p.a);
    confCtx.fillStyle=p.c;
    confCtx.shadowBlur=3; confCtx.shadowColor=p.c;
    confCtx.translate(p.x,p.y); confCtx.rotate(p.rot);
    if(p.sh==='r') confCtx.fillRect(-p.sz/2,-p.sz/4,p.sz,p.sz/2);
    else if(p.sh==='c'){ confCtx.beginPath();confCtx.arc(0,0,p.sz/2,0,Math.PI*2);confCtx.fill(); }
    else drawStar(confCtx,0,0,p.sz/2);
    confCtx.restore();
  });
  if (confPts.length>0) requestAnimationFrame(animConf);
  else { confGo=false; confCtx.clearRect(0,0,confCvs.width,confCvs.height); }
}

function triggerConf() {
  confGo=true; confPts=[];
  spawnConf(150);
  setTimeout(()=>spawnConf(80),380);
  animConf();
}

/* ═══ DANCER ═══ */
function showDancer() {
  const el = document.getElementById('dancer');
  el.classList.remove('hidden');
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.classList.add('hidden'),500); },6000);
}

/* ═══ ON MAU ═══ */
window.onMau = () => {
  triggerConf();
  showDancer();
  setTimeout(()=>{ goScene('s-final'); showNav(); }, 650);
};

/* ═══ NAVBAR ═══ */
let navShown = false;
function showNav() {
  if (navShown) return;
  navShown = true;
  const nav = document.getElementById('nav');
  nav.classList.remove('nav-hidden');
  nav.classList.add('nav-show');
}

window.navGo = (pgId) => {
  cinIn(()=>{
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
    document.querySelectorAll('.scene').forEach(s=>{ s.classList.remove('active'); s.classList.add('out'); setTimeout(()=>s.classList.remove('out'),500); });
    document.querySelectorAll('.nav-ul a[data-pg]').forEach(a=>a.classList.toggle('on', a.dataset.pg===pgId));
    const pg = document.getElementById(pgId);
    if (!pg) return;
    pg.classList.add('on');
    pg.scrollTop = 0;
    onPageIn(pgId);
  });
};

function onPageIn(id) {
  if (id==='pg-home')     { checkVideo(); countUp('stDays', calcDays(), 1800); }
  if (id==='pg-kenangan') { initTlObserver(); }
  if (id==='pg-lagu')     { initLyrObserver(); checkVideo(); pAutoLoad('Christina Perri - A Thousand Years [Official Music Video].mp3'); }
  if (id==='pg-about')    { setTimeout(()=>{ const f=document.getElementById('lmFill'); if(f)f.style.width='100%'; },350); }
  if (id==='pg-game')     { initGamePage(); }
  if (id==='pg-galaxy')   { galaxyAnim = false; setTimeout(initGalaxy, 100); }
  if (id==='pg-jar')      { initJar(); }
  if (id==='pg-playlist') { renderPlaylist(); }
  if (id==='pg-puzzle')   { initPuzzle(); }
  if (id==='pg-vlog')     { initVlog(); }
  if (id==='pg-media')    { renderMediaCards(); }
  if (id==='pg-mood')     { renderMoodCalendar(); }
  if (id==='pg-letter')   { initChat(); }
  if (id==='pg-map')      { initMemoryMap(); }
  if (id==='pg-story')    { renderStory(); }
  if (id==='pg-arcade')   { /* static */ }
  if (id==='pg-surat')    { renderSuratThread(); }
}

function calcDays() {
  const start = new Date(START_DATE);
  const now   = new Date();
  return Math.max(0, Math.floor((now - start) / 86400000));
}

function countUp(elId, target, dur) {
  const el = document.getElementById(elId);
  if (!el) return;
  const t0 = performance.now();
  const step = now => {
    const p = Math.min((now-t0)/dur, 1);
    const e = 1-Math.pow(1-p,3);
    el.textContent = Math.floor(e*target);
    if (p<1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ═══ DRAWER ═══ */
window.toggleDrawer = () => {
  document.getElementById('drawer').classList.toggle('open');
  document.getElementById('drawerBg').classList.toggle('open');
};

/* ═══ TIMELINE OBSERVER ═══ */
function initTlObserver() {
  const items = document.querySelectorAll('.tl-reveal');
  const ob = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{ if(e.isIntersecting) setTimeout(()=>e.target.classList.add('in'),i*160); });
  },{ threshold:.25 });
  items.forEach(i=>ob.observe(i));
}

/* ═══ LYRIC OBSERVER ═══ */
// ════════════════════════════════════════════════════════════
// ★ SYNCED KARAOKE LYRICS — A Thousand Years
// Timestamps (seconds) matched to official recording
// ════════════════════════════════════════════════════════════
const LYRICS = [
  { t: 17.5,  text: "Heart beats fast",                         tag: "Verse I" },
  { t: 20.8,  text: "Colors and promises" },
  { t: 24.2,  text: "How to be brave?" },
  { t: 27.5,  text: "How can I love when I'm afraid to fall?" },
  { t: 33.0,  text: "But watching you stand alone" },
  { t: 37.2,  text: "All of my doubt suddenly goes away somehow" },
  { t: 43.0,  text: "One step closer",                          small: true },
  { t: 50.0,  text: "I have died every day waiting for you",    tag: "Chorus", chorus: true },
  { t: 55.5,  text: "Darling, don't be afraid, I have loved you", chorus: true },
  { t: 61.0,  text: "For a thousand years",                     chorus: true },
  { t: 65.5,  text: "I'll love you for a thousand more",        chorus: true },
  { t: 80.5,  text: "Time stands still",                        tag: "Verse II" },
  { t: 84.0,  text: "Beauty in all she is" },
  { t: 87.5,  text: "I will be brave" },
  { t: 90.8,  text: "I will not let anything take away" },
  { t: 94.5,  text: "What's standing in front of me" },
  { t: 98.2,  text: "Every breath, every hour has come to this" },
  { t: 104.5, text: "One step closer",                          small: true },
  { t: 111.5, text: "I have died every day waiting for you",    tag: "Chorus", chorus: true },
  { t: 117.0, text: "Darling, don't be afraid, I have loved you", chorus: true },
  { t: 122.5, text: "For a thousand years",                     chorus: true },
  { t: 127.0, text: "I'll love you for a thousand more",        chorus: true },
  { t: 142.0, text: "And all along I believed I would find you", tag: "Bridge" },
  { t: 148.5, text: "Time has brought your heart to me" },
  { t: 154.0, text: "I have loved you for a thousand years" },
  { t: 159.5, text: "I'll love you for a thousand more" },
  { t: 173.0, text: "I have died every day waiting for you",    tag: "Outro", chorus: true },
  { t: 178.5, text: "Darling, don't be afraid, I have loved you", chorus: true },
  { t: 184.0, text: "For a thousand years",                     chorus: true },
  { t: 188.5, text: "I'll love you for a thousand more",        chorus: true },
  { t: 196.0, text: "And all along I believed I would find you" },
  { t: 202.0, text: "Time has brought your heart to me" },
  { t: 207.5, text: "I have loved you for a thousand years" },
  { t: 213.0, text: "I'll love you for a thousand more 🤍" },
];

function initLyrObserver() {
  buildLyrDOM();
  lyrLastIdx = -1;
  // pGet() might already exist — attach if so
  if (pAudio) {
    // listener already attached inside pGet, just reset
  }
}

function buildLyrDOM() {
  const cont = document.getElementById('lyrContainer');
  if (!cont) return;
  cont.innerHTML = '';
  LYRICS.forEach((l, i) => {
    const div = document.createElement('div');
    div.className = 'lyr-line' + (l.chorus ? ' lyr-line-chorus' : '') + (l.small ? ' lyr-line-small' : '');
    div.id = 'lyr-' + i;
    if (l.tag) {
      const tag = document.createElement('span');
      tag.className = 'lyr-tag'; tag.textContent = l.tag;
      div.appendChild(tag);
    }
    const txt = document.createElement('span');
    txt.className = 'lyr-text';
    txt.dataset.full = l.text;
    txt.textContent = l.text;
    div.appendChild(txt);
    cont.appendChild(div);
  });
}

let lyrLastIdx = -1;

function lyrSync() {
  const cont = document.getElementById('lyrContainer');
  if (!cont || !cont.children.length) return;
  if (!pAudio || !pAudio.duration) return;
  const t = pAudio.currentTime;

  // Find current line index
  let cur = -1;
  for (let i = LYRICS.length - 1; i >= 0; i--) {
    if (t >= LYRICS[i].t) { cur = i; break; }
  }
  if (cur === lyrLastIdx) return;
  lyrLastIdx = cur;

  document.querySelectorAll('#lyrContainer .lyr-line').forEach((el, i) => {
    el.classList.remove('lyr-active', 'lyr-past');
    const txt = el.querySelector('.lyr-text');
    if (!txt) return;
    if (i < cur) {
      el.classList.add('lyr-past');
      txt.textContent = txt.dataset.full || txt.textContent;
    }
    if (i === cur) {
      el.classList.add('lyr-active');
      // Typing animation — slow, one char at a time
      const full = txt.dataset.full || txt.textContent;
      txt.textContent = '';
      txt.classList.add('lyr-typing');
      let ci = 0;
      const type = () => {
        if (ci < full.length) { txt.textContent += full[ci++]; setTimeout(type, 110); }
        else { txt.classList.remove('lyr-typing'); }
      };
      type();
      // Scroll into view smoothly
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ═══ VIDEO CHECK ═══ */
function checkVideo() {
  const v = document.getElementById('pgVideo');
  const ph= document.getElementById('videoPh');
  if (!v || !ph) return;
  const src = v.querySelector('source')?.getAttribute('src')||'';
  if (src && src!=='VIDEO_KAMU.mp4') {
    ph.style.display = 'none';
    v.classList.remove('hidden');
  }
}

/* ═══ BG MUSIC ═══ */
const bgAudio  = document.getElementById('bgAudio');
const musBtnEl = document.getElementById('musBtnEl');
let bgStarted  = false;

function tryBg() {
  if (!bgStarted) {
    bgAudio.volume = .22;
    bgAudio.play().then(()=>{ bgStarted=true; musBtnEl.classList.add('playing'); }).catch(()=>{});
  }
}

window.toggleBg = () => {
  if (bgAudio.paused) { bgAudio.play(); musBtnEl.classList.add('playing'); musBtnEl.textContent='♪'; }
  else                { bgAudio.pause(); musBtnEl.classList.remove('playing'); musBtnEl.textContent='♩'; }
};

/* ═══ CAMERA ═══ */
let camOn=false, prevFrame=null, lastBurst=0, lastWord=0, motHist=[];

window.initCam = async () => {
  if (camOn) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{facingMode:'user',width:160,height:120}, audio:false });
    const vid = document.getElementById('camVideo');
    const mc  = document.getElementById('camCanvas');
    vid.srcObject = stream;
    vid.classList.add('show');
    mc.width=160; mc.height=120;
    camOn = true;
    const toast = document.getElementById('camToast');
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 4000);
    document.getElementById('camBtn').textContent = '✦ Kamera Aktif ✓';
    document.getElementById('camBtn').style.color = 'var(--gold)';
    procMotion(vid, mc.getContext('2d'));
  } catch { alert('Gagal akses kamera. Cek izin browser ya! 📷'); }
};

function procMotion(vid, mc) {
  if (!camOn) return;
  mc.drawImage(vid,0,0,160,120);
  const d = mc.getImageData(0,0,160,120).data;
  if (prevFrame) {
    let tot=0, cx=0, cy=0, cnt=0;
    for (let i=0;i<d.length;i+=16) {
      const diff=Math.abs(d[i]-prevFrame[i])+Math.abs(d[i+1]-prevFrame[i+1])+Math.abs(d[i+2]-prevFrame[i+2]);
      if (diff>42){ tot+=diff; const idx=i/4; cx+=(idx%160)/160*W; cy+=Math.floor(idx/160)/120*H; cnt++; }
    }
    const now=Date.now();
    if (cnt>0) {
      cx/=cnt; cy/=cnt;
      motHist.push({m:tot,t:now});
      motHist=motHist.filter(x=>now-x.t<1000);
      const avg=motHist.reduce((a,b)=>a+b.m,0)/motHist.length;
      if (tot>75000 && now-lastBurst>180) { burst(cx,cy,18); lastBurst=now; }
      if (avg>5000&&avg<38000&&now-lastWord>3500) { spawnWord('i love you',W/2,H/2); lastWord=now; }
    }
  }
  prevFrame=new Uint8ClampedArray(d);
  requestAnimationFrame(()=>procMotion(vid,mc));
}

/* ═══ MUSIC PLAYER ═══ */
let pAudio=null, pPlaying=false;

function pGet() {
  if (!pAudio) {
    pAudio = new Audio();
    pAudio.volume = .7;
    pAudio.addEventListener('timeupdate',()=>{
      if (!pAudio.duration) return;
      const pct=(pAudio.currentTime/pAudio.duration)*100;
      const fill=document.getElementById('playerFill');
      const cur =document.getElementById('pCur');
      if(fill) fill.style.width=pct+'%';
      if(cur)  cur.textContent=fmt(pAudio.currentTime);
      // lyric sync
      lyrSync();
    });
    pAudio.addEventListener('loadedmetadata',()=>{
      const d=document.getElementById('pDur');
      if(d) d.textContent=fmt(pAudio.duration);
    });
    pAudio.addEventListener('ended',()=>{
      pPlaying=false; pUpdBtn();
      document.getElementById('playerDisk')?.classList.remove('spin');
      lyrLastIdx = -1;
    });
    document.getElementById('playerProgWrap')?.addEventListener('click',e=>{
      if (!pAudio.duration) return;
      const bar=document.querySelector('.player-prog-bg');
      const r=bar.getBoundingClientRect();
      pAudio.currentTime=((e.clientX-r.left)/r.width)*pAudio.duration;
    });
  }
  return pAudio;
}

window.pToggle=()=>{
  const a=pGet();
  if (!a.src||a.src===location.href){ pNote('Pilih file MP3 atau paste link dulu 👇'); return; }
  pPlaying?a.pause():a.play().catch(()=>pNote('Gagal play. Coba link/file lain.'));
  pPlaying=!pPlaying;
  pUpdBtn();
  document.getElementById('playerDisk')?.classList.toggle('spin',pPlaying);
};
window.pSkip=s=>{ const a=pGet(); if(a.src) a.currentTime=Math.max(0,a.currentTime+s); };
window.pVol=v=>pGet().volume=parseFloat(v);

window.pLoadUrl=()=>{
  const url=document.getElementById('pUrlIn')?.value?.trim();
  if(!url) return;
  const a=pGet(); a.pause(); a.src=url; a.load();
  pPlaying=false; pUpdBtn();
  resetProg();
  a.play().then(()=>{ pPlaying=true; pUpdBtn(); document.getElementById('playerDisk')?.classList.add('spin'); }).catch(()=>pNote('Link tidak bisa diplay. Gunakan link langsung ke file MP3.'));
};

window.pLoadFile=inp=>{
  const file=inp.files[0]; if(!file) return;
  const url=URL.createObjectURL(file);
  const a=pGet(); a.pause(); a.src=url; a.load();
  pPlaying=false; pUpdBtn(); resetProg();
  const t=document.querySelector('.player-title');
  if(t) t.textContent=file.name.replace(/\.[^.]+$/,'');
  a.play().then(()=>{ pPlaying=true; pUpdBtn(); document.getElementById('playerDisk')?.classList.add('spin'); }).catch(()=>{});
};

function pUpdBtn(){
  const b=document.getElementById('pPlayBtn');
  if(b) b.textContent=pPlaying?'⏸':'▶';
}
function resetProg(){
  const f=document.getElementById('playerFill'); if(f) f.style.width='0%';
  const c=document.getElementById('pCur'); if(c) c.textContent='0:00';
  const d=document.getElementById('pDur'); if(d) d.textContent='—:——';
}
function fmt(s){
  if(isNaN(s)) return '0:00';
  return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
}
function pNote(msg){
  const n=document.querySelector('.psrc-note'); if(!n) return;
  const orig=n.innerHTML;
  n.style.color='var(--goldi)'; n.textContent=msg;
  setTimeout(()=>{ n.style.color=''; n.innerHTML=orig; },3000);
}

function pAutoLoad(src) {
  const a = pGet();
  if (a.src && a.src.includes('blob')) return; // udah pilih file manual, skip
  a.src = src;
  a.load();
  resetProg();
  const t = document.querySelector('.player-title');
  if (t) t.textContent = 'A Thousand Years';
}

// ════════════════════════════════════════════════════════════
// ★ TRIVIA GAME ENGINE
// ════════════════════════════════════════════════════════════

// ── EDIT PERTANYAAN DI SINI ──────────────────────────────────
// ans = index jawaban benar (0=A, 1=B, 2=C, 3=D)
const QUESTIONS = [
  {
    cat: 'Tentang Aku',
    q: 'Warna favorit aku apa?',
    opts: ['Hitam', 'Navy Blue', 'Gold', 'Abu-abu'],
    ans: 1,
    exp: 'Aku suka navy blue karena tenang tapi tetap dalam. Kamu harusnya tau ini! 😏'
  },
  {
    cat: 'Momen Kita',
    q: 'Hal pertama yang aku bilang waktu kita pertama ketemu?',
    opts: ['"Hei, kamu siapa?"', '"Cantik banget sih"', '"Eh, kamu kenal si X?"', '"Boleh kenalan?"'],
    ans: 2,
    exp: 'Kita ketemu lewat temen dulu sebelum akhirnya ngobrol sendiri. Masih inget kan?'
  },
  {
    cat: 'Fakta Random',
    q: 'Kalau lagi bad mood, aku paling suka ngapain?',
    opts: ['Main game', 'Diem-dieman', 'Makan banyak', 'Dengerin musik'],
    ans: 3,
    exp: 'Musik adalah pelarian terbaik. A Thousand Years salah satunya 🎵'
  },
  {
    cat: 'Tentang Aku',
    q: 'Makanan yang paling aku suka?',
    opts: ['Mie ayam', 'Nasi goreng', 'Sushi', 'Bakso'],
    ans: 0,
    exp: 'Mie ayam forever. Kapan mau traktir? 😂'
  },
  {
    cat: 'Momen Kita',
    q: 'Di mana kita pertama kali pergi berdua?',
    opts: ['Mall', 'Cafe', 'Taman', 'Bioskop'],
    ans: 1,
    exp: 'Masih ingat kan cafe itu? Kamu pesan apa? Aku masih inget lho 😌'
  },
  {
    cat: 'Trivia Hard 🔥',
    q: 'Aku paling ga suka kalau kamu...',
    opts: ['Bales chat lama', 'Lupa bilang udah makan', 'Cerita hal yang sama', 'Ga bilang kalau lg sibuk'],
    ans: 0,
    exp: 'Bales chat lama itu bikin overthinking tau ga. Tapi aku maafin kok 🙃'
  },
  {
    cat: 'Tentang Aku',
    q: 'Cita-cita aku yang pernah aku ceritain ke kamu?',
    opts: ['Punya usaha sendiri', 'Kerja di luar negeri', 'Jadi freelancer', 'Punya rumah dengan taman'],
    ans: 0,
    exp: 'Punya usaha sendiri — bebas, mandiri, dan bisa jaga orang yang aku sayang.'
  },
  {
    cat: 'Trivia Hard 🔥',
    q: 'Kata yang paling sering aku pakai kalau lagi ngobrol sama kamu?',
    opts: ['"Anjir"', '"Serius?"', '"Beneran?"', '"Ga mungkin"'],
    ans: 1,
    exp: '"Serius?" — karena aku sering ga percaya hal baik bisa terjadi. Termasuk kamu 🥺'
  },
  {
    cat: 'Momen Kita',
    q: 'Lagu yang jadi "lagu kita" menurut aku?',
    opts: ['Perfect - Ed Sheeran', 'A Thousand Years - Christina Perri', 'Thinking Out Loud', 'All of Me - John Legend'],
    ans: 1,
    exp: 'A Thousand Years. "I have loved you for a thousand years..." 🎵'
  },
  {
    cat: 'Final Boss 👑',
    q: 'Dari semua hal di dunia ini, yang paling aku syukuri adalah?',
    opts: ['Kesehatan', 'Keluarga', 'Kamu', 'Hidup yang tenang'],
    ans: 2,
    exp: 'Kamu. Selalu kamu. Selamat Idul Fitri sayang 🌙🤍'
  }
];

// Game state
let gQ = [], gCur = 0, gScore = 0, gLives = 3, gAnswers = [], gTimer = null, gTimeLeft = 0;
const G_TIME = 18;

function initGamePage() {
  document.getElementById('gameStart').classList.remove('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('gameResult').classList.add('hidden');
}

window.startGame = () => {
  gQ       = [...QUESTIONS].sort(() => Math.random() - .5);
  gCur     = 0; gScore  = 0;
  gLives   = 3; gAnswers = [];

  document.getElementById('gameStart').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
  document.getElementById('gameResult').classList.add('hidden');
  renderQ();
};

function renderQ() {
  const q = gQ[gCur];
  updateHUD();

  // Card slide-in
  const card = document.getElementById('qCard');
  card.style.cssText = 'opacity:0;transform:translateY(14px);transition:none';
  requestAnimationFrame(() => {
    card.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity .4s,transform .4s';
  });

  document.getElementById('qCat').textContent  = q.cat;
  document.getElementById('qNum').textContent  = `Q${gCur+1}`;
  document.getElementById('qText').textContent = q.q;

  const grid = document.getElementById('optsGrid');
  grid.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'opt-btn';
    b.innerHTML = `<strong style="color:var(--gold);margin-right:.35rem">${'ABCD'[i]}.</strong>${opt}`;
    b.onclick = () => pickAns(i);
    grid.appendChild(b);
  });

  document.getElementById('qFeedback').classList.add('hidden');
  document.getElementById('nextBtn').classList.add('hidden');
  startGTimer();
}

function startGTimer() {
  clearInterval(gTimer);
  gTimeLeft = G_TIME;
  const bar = document.getElementById('timerBar');
  bar.style.cssText = 'transition:none;width:100%';
  bar.classList.remove('danger');
  requestAnimationFrame(() => {
    bar.style.cssText = `transition:width ${G_TIME}s linear;width:0%`;
  });
  gTimer = setInterval(() => {
    gTimeLeft--;
    if (gTimeLeft <= 5) document.getElementById('timerBar').classList.add('danger');
    if (gTimeLeft <= 0) { clearInterval(gTimer); gTimeUp(); }
  }, 1000);
}

function gTimeUp() {
  const q = gQ[gCur];
  hitLife();
  disableQ();
  markCorrect(q.ans);
  showFB(false, '⏰ Waktu habis!', q.exp);
  gAnswers.push({ q: q.q, chosen: null, correct: q.opts[q.ans], ok: false });
  revealNext();
}

function pickAns(idx) {
  clearInterval(gTimer);
  const q   = gQ[gCur];
  const ok  = idx === q.ans;
  disableQ();

  const btns = document.querySelectorAll('.opt-btn');
  if (ok) {
    btns[idx].classList.add('correct');
    const bonus = Math.round(gTimeLeft / G_TIME * 50) + 50;
    gScore += bonus;
    burst(innerWidth/2, innerHeight/2, 22);
    showFB(true, `✓ Bener! +${bonus} pts`, q.exp);
    gAnswers.push({ q: q.q, chosen: q.opts[idx], correct: q.opts[q.ans], ok: true });
  } else {
    btns[idx].classList.add('wrong');
    markCorrect(q.ans);
    hitLife();
    showFB(false, '✗ Salah...', q.exp);
    gAnswers.push({ q: q.q, chosen: q.opts[idx], correct: q.opts[q.ans], ok: false });
  }

  updateHUD();
  revealNext();
}

function markCorrect(i) {
  const b = document.querySelectorAll('.opt-btn')[i];
  if (b) b.classList.add('reveal');
}

function disableQ() {
  document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
}

function hitLife() {
  gLives = Math.max(0, gLives - 1);
  const el = document.getElementById('hudLives');
  el.textContent = ['💔','❤️','❤️❤️','❤️❤️❤️'][gLives];
  el.style.animation = 'wrongShake .4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

function updateHUD() {
  document.getElementById('hudQ').textContent   = `${gCur+1}/${gQ.length}`;
  document.getElementById('hudPts').textContent = `${gScore} pts`;
}

function showFB(ok, msg, exp) {
  const fb = document.getElementById('qFeedback');
  const ic = document.getElementById('fbIcon');
  const ms = document.getElementById('fbMsg');
  fb.classList.remove('hidden');
  ic.textContent = ok ? '✓' : '✗';
  ic.style.color = ok ? '#6bcb77' : '#ff6b6b';
  ms.textContent = msg; ms.style.color = ic.style.color;
  document.getElementById('fbExp').textContent = exp;
}

function revealNext() {
  const btn = document.getElementById('nextBtn');
  const txt = document.getElementById('nextBtnTxt');
  btn.classList.remove('hidden');
  txt.textContent = (gCur >= gQ.length-1 || gLives <= 0) ? 'Lihat Hasil 🏆' : 'Lanjut';
}

window.nextQuestion = () => {
  if (gCur >= gQ.length-1 || gLives <= 0) { showResult(); return; }
  gCur++;
  renderQ();
};

function showResult() {
  clearInterval(gTimer);
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('gameResult').classList.remove('hidden');

  const tot = gQ.length;
  const ok  = gAnswers.filter(a => a.ok).length;
  const pct = ok / tot;
  let emoji, title, msg;

  if (gLives <= 0) {
    emoji='💀'; title='Game Over!';
    msg='Nyawa habis... Kayaknya kamu kurang kenal aku 😢 Coba lagi!';
  } else if (pct===1) {
    emoji='👑'; title='PERFECT!';
    msg='PERFECT SCORE!! Kamu beneran kenal aku luar dalam. Aku terharu banget 🥺🤍';
    triggerConf();
    for(let i=0;i<8;i++) setTimeout(()=>spawnEggHeart(),i*150);
  } else if (pct>=.8) {
    emoji='🏆'; title='Keren banget!';
    msg='Hampir sempurna! Kamu emang selalu perhatian. Aku salut 💛';
  } else if (pct>=.6) {
    emoji='😊'; title='Lumayan!';
    msg='Cukup bagus, tapi masih ada yang perlu diingat. Kita perlu lebih banyak ngobrol! 😏';
  } else if (pct>=.4) {
    emoji='😅'; title='Hmm...';
    msg='Kamu kurang dengerin aku kayaknya. Tapi aku masih sayang kok 😂';
  } else {
    emoji='😭'; title='Aduh...';
    msg='Kayaknya kamu perlu belajar lebih kenal aku. Tapi tetap aku sayang kamu! 🤍';
  }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultScore').textContent = `${ok} / ${tot}`;
  document.getElementById('resultMsg').textContent   = msg;

  document.getElementById('resultBreakdown').innerHTML = gAnswers.map(a=>`
    <div class="rb-item">
      <span class="rb-icon">${a.ok?'✓':'✗'}</span>
      <div>
        <div class="rb-q">${a.q}</div>
        <div class="rb-a">${a.ok ? '✓ ' + a.correct : 'Jawaban: ' + a.correct}</div>
      </div>
    </div>`).join('');

  const em = document.getElementById('resultEmoji');
  em.style.animation='none';
  requestAnimationFrame(()=>{ em.style.animation=''; });
}

window.restartGame = () => {
  document.getElementById('gameResult').classList.add('hidden');
  document.getElementById('gameStart').classList.remove('hidden');
};

// ════════════════════════════════════════════════════════════
// ★ ID CARD INTERACTIONS
// ════════════════════════════════════════════════════════════

let cardFlipped = false;
let cardDragging = false;
let cardDragStartX = 0;
let cardVelX = 0;
let cardRotX = 0, cardRotY = 0;
let cardPhysX = 0, cardPhysVX = 0;

window.flipCard = () => {
  const card = document.getElementById('card3d');
  if (cardDragging) return;
  cardFlipped = !cardFlipped;
  card.classList.toggle('flipped', cardFlipped);
  // Burst effect on flip
  const rect = card.getBoundingClientRect();
  burst(rect.left + rect.width/2, rect.top + rect.height/2, 14);
  // Hide hint after first flip
  const hint = document.getElementById('cardHint');
  if (hint) hint.style.opacity = '0';
};

function initCardPhysics() {
  const card   = document.getElementById('card3d');
  const wrap   = document.getElementById('lanyardWrap');
  if (!card || !wrap) return;

  // ── Mouse tilt (desktop) ──
  document.addEventListener('mousemove', e => {
    if (curScene !== 's-profil') return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    cardRotY = dx * 18;
    cardRotX = -dy * 12;
    if (!cardDragging) applyCardTilt();
  });

  // ── Drag swing ──
  card.addEventListener('mousedown', e => {
    cardDragging = true;
    cardDragStartX = e.clientX - cardPhysX;
    card.classList.add('grabbed');
    card.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!cardDragging) return;
    cardPhysX = e.clientX - cardDragStartX;
    const swing = Math.max(-35, Math.min(35, cardPhysX / 4));
    card.style.transform = `rotate(${swing}deg)`;
  });

  document.addEventListener('mouseup', e => {
    if (!cardDragging) return;
    cardDragging = false;
    card.classList.remove('grabbed');
    card.style.cursor = 'pointer';
    // Spring back with bounce
    springBack(card);
    // Was it a click (not a drag)?
    if (Math.abs(cardPhysX) < 6) flipCard();
    cardPhysX = 0;
  });

  // ── Touch drag + tilt ──
  let touchStartX = 0, touchStartY = 0, touchMoved = false;

  card.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved  = false;
    cardDragStartX = touchStartX - cardPhysX;
    card.classList.add('grabbed');
    card.style.animation = 'none';
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) > 5) touchMoved = true;
    cardPhysX = e.touches[0].clientX - cardDragStartX;
    const swing = Math.max(-40, Math.min(40, cardPhysX / 3.5));
    cardRotY = (e.touches[0].clientX - (window.innerWidth/2)) / (window.innerWidth/2) * 15;
    cardRotX = -dy / window.innerHeight * 12;
    card.style.transform = `rotate(${swing}deg) rotateY(${cardFlipped?180:0}deg)`;
    e.preventDefault();
  }, { passive: false });

  card.addEventListener('touchend', () => {
    card.classList.remove('grabbed');
    springBack(card);
    if (!touchMoved) flipCard();
    cardPhysX = 0;
  });

  // ── Lanyard string physics ──
  initStringPhysics();
}

function applyCardTilt() {
  const card = document.getElementById('card3d');
  if (!card || cardDragging) return;
  const flipY = cardFlipped ? 180 : 0;
  card.style.transform = `rotateX(${cardRotX}deg) rotateY(${flipY + cardRotY}deg)`;
}

function springBack(card) {
  card.style.transition = 'transform .8s cubic-bezier(.2,.8,.3,1.2)';
  const flipY = cardFlipped ? 180 : 0;
  card.style.transform = `rotateX(0deg) rotateY(${flipY}deg)`;
  setTimeout(() => {
    card.style.transition = '';
    card.style.transform  = '';
    card.style.animation  = '';
  }, 850);
}

// ── Lanyard string wave ──
function initStringPhysics() {
  let t = 0;
  function waveTick() {
    if (curScene !== 's-profil') { requestAnimationFrame(waveTick); return; }
    t += 0.04;
    const sway = Math.sin(t) * 6;
    const path = document.getElementById('stringPath');
    if (path) {
      path.setAttribute('d',
        `M30 0 C${30 + sway} 30, ${30 - sway * .5} 70, 30 120`
      );
    }
    requestAnimationFrame(waveTick);
  }
  requestAnimationFrame(waveTick);
}

// Init after DOM ready
setTimeout(initCardPhysics, 100);

/* ═══ INIT ═══ */
resizeCvs();
initPts();
initSlider();
loop();
initStarfield();
initRipple();
initCountdown();
initHearts();
initEasterEgg();
initShake();
initParallax();

// ════════════════════════════════════════════════════════════
// ★ STARFIELD — bintang + shooting stars
// ════════════════════════════════════════════════════════════
function initStarfield() {
  const sc = document.getElementById('starCvs');
  const sx = sc.getContext('2d');
  let sw, sh, stars = [], shoots = [];

  function rsz() { sw = sc.width = window.innerWidth; sh = sc.height = window.innerHeight; }
  rsz();
  window.addEventListener('resize', rsz);

  // Static stars
  for (let i = 0; i < 220; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + .2,
      a: Math.random() * .7 + .1,
      speed: Math.random() * .0004 + .0001,
      phase: Math.random() * Math.PI * 2
    });
  }

  function spawnShoot() {
    shoots.push({
      x: Math.random() * sw, y: Math.random() * sh * .5,
      len: 80 + Math.random() * 120,
      speed: 6 + Math.random() * 8,
      angle: Math.PI / 5 + (Math.random() - .5) * .3,
      a: 1, trail: []
    });
  }
  setInterval(spawnShoot, 2800);

  function starLoop(t) {
    sx.clearRect(0, 0, sw, sh);

    // Stars twinkle
    stars.forEach(s => {
      const tw = Math.sin(t * s.speed * 1000 + s.phase) * .3 + .6;
      sx.save();
      sx.globalAlpha = s.a * tw;
      sx.fillStyle = '#fff';
      sx.shadowBlur = 4; sx.shadowColor = 'rgba(255,255,200,.8)';
      sx.beginPath();
      sx.arc(s.x * sw, s.y * sh, s.r, 0, Math.PI * 2);
      sx.fill();
      sx.restore();
    });

    // Shooting stars
    shoots.forEach((s, i) => {
      s.trail.push({ x: s.x, y: s.y, a: s.a });
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.a -= .018;

      // Draw trail
      s.trail.forEach((pt, j) => {
        const ratio = j / s.trail.length;
        sx.save();
        sx.globalAlpha = pt.a * ratio * .6;
        sx.strokeStyle = `rgba(255,240,180,${ratio})`;
        sx.lineWidth = ratio * 2;
        if (j > 0) {
          sx.beginPath();
          sx.moveTo(s.trail[j-1].x, s.trail[j-1].y);
          sx.lineTo(pt.x, pt.y);
          sx.stroke();
        }
        sx.restore();
      });

      // Head glow
      sx.save();
      sx.globalAlpha = s.a;
      sx.fillStyle = '#fffbe8';
      sx.shadowBlur = 12; sx.shadowColor = 'rgba(255,240,150,.9)';
      sx.beginPath(); sx.arc(s.x, s.y, 2, 0, Math.PI*2); sx.fill();
      sx.restore();

      if (s.a <= 0) shoots.splice(i, 1);
    });

    requestAnimationFrame(starLoop);
  }
  requestAnimationFrame(starLoop);
}

// ════════════════════════════════════════════════════════════
// ★ RIPPLE — tiap klik/tap
// ════════════════════════════════════════════════════════════
function initRipple() {
  const rc = document.getElementById('rippleCvs');
  const rx = rc.getContext('2d');
  let rw, rh, ripples = [];

  function rsz() { rw = rc.width = window.innerWidth; rh = rc.height = window.innerHeight; }
  rsz();
  window.addEventListener('resize', rsz);

  function addRipple(x, y) {
    ripples.push({ x, y, r: 0, maxR: 90 + Math.random() * 60, a: .7, color: Math.random() > .5 ? '201,162,94' : '180,120,255' });
  }

  document.addEventListener('click', e => addRipple(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    if (e.touches[0]) addRipple(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function rippleLoop() {
    rx.clearRect(0, 0, rw, rh);
    ripples = ripples.filter(r => r.a > 0);
    ripples.forEach(r => {
      r.r += 3.5;
      r.a -= .018;
      const prog = r.r / r.maxR;
      rx.save();
      rx.globalAlpha = r.a * (1 - prog * .5);
      rx.strokeStyle = `rgba(${r.color},${r.a})`;
      rx.lineWidth = 1.5;
      rx.shadowBlur = 12; rx.shadowColor = `rgba(${r.color},.6)`;
      rx.beginPath(); rx.arc(r.x, r.y, r.r, 0, Math.PI*2); rx.stroke();
      // Inner ring
      if (r.r > 12) {
        rx.globalAlpha = r.a * .3;
        rx.beginPath(); rx.arc(r.x, r.y, r.r * .5, 0, Math.PI*2); rx.stroke();
      }
      rx.restore();
    });
    requestAnimationFrame(rippleLoop);
  }
  requestAnimationFrame(rippleLoop);
}

// ════════════════════════════════════════════════════════════
// ★ COUNTDOWN ke Idul Fitri
// ════════════════════════════════════════════════════════════
function initCountdown() {
  // Target: 31 Maret 2025 (1 Syawal 1446H) — ganti kalau perlu
  const TARGET = new Date('2025-03-31T00:00:00');

  function update() {
    const now  = new Date();
    const diff = TARGET - now;

    const wrap = document.getElementById('countdownWrap');
    if (!wrap) return;

    if (diff <= 0) {
      // Sudah lewat — tampilkan pesan
      wrap.innerHTML = '<p style="font-family:var(--f-display);font-style:italic;color:var(--goldi);font-size:1.1rem">Selamat Idul Fitri 🌙</p>';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    function set(id, val) {
      const el = document.getElementById(id);
      if (!el) return;
      const str = String(val).padStart(2, '0');
      if (el.textContent !== str) {
        el.classList.add('flip');
        setTimeout(() => { el.textContent = str; el.classList.remove('flip'); }, 75);
      }
    }
    set('cdD', d); set('cdH', h); set('cdM', m); set('cdS', s);
  }

  update();
  setInterval(update, 1000);
}

// ════════════════════════════════════════════════════════════
// ★ FLOATING HEARTS
// ════════════════════════════════════════════════════════════
function initHearts() {
  const EMOJIS = ['🤍','💛','✨','🌙','💫','⭐','🫶'];

  function spawnHeart() {
    const wrap = document.getElementById('heartsWrap');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'heart-float';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = (Math.random() * 95) + 'vw';
    el.style.fontSize = (.8 + Math.random() * 1) + 'rem';
    const dur = 5 + Math.random() * 5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = '0s';
    wrap.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000);
  }

  // Spawn 1 setiap 1.8 detik
  setInterval(spawnHeart, 1800);
  // Langsung spawn beberapa
  setTimeout(spawnHeart, 500);
  setTimeout(spawnHeart, 1200);
}

// ════════════════════════════════════════════════════════════
// ★ EASTER EGG — tap judul 5x
// ════════════════════════════════════════════════════════════
function initEasterEgg() {
  let tapCount = 0, tapTimer;
  const EGGS = [
    { emoji: '🌙', msg: 'kamu nemu easter egg nya 🥚✨', sub: 'aku sayang kamu seribu tahun 🤍' },
    { emoji: '💛', msg: 'ketauan lagi! hehe', sub: 'makasih udah mau klik-klik ini sayang' },
    { emoji: '🫶', msg: 'masih nyari lagi?? 😭', sub: 'oke deh, aku sayang kamu beneran kok' },
    { emoji: '✨', msg: 'ini yang terakhir yaa', sub: 'selamat lebaran, semoga kita selalu bahagia 🌸' },
  ];
  let eggIdx = 0;

  // Tap anywhere 5x cepat = trigger
  document.addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => tapCount = 0, 1000);
    if (tapCount >= 5) {
      tapCount = 0;
      showEgg(EGGS[eggIdx % EGGS.length]);
      eggIdx++;
    }
  });
}

function showEgg(data) {
  const ov = document.getElementById('eggOverlay');
  const em = document.getElementById('eggEmoji');
  const ms = document.getElementById('eggMsg');
  if (!ov) return;
  em.textContent = data.emoji;
  ms.textContent = data.msg;
  document.querySelector('.egg-sub').textContent = data.sub;
  // Reset animation
  em.style.animation = 'none';
  requestAnimationFrame(() => {
    em.style.animation = '';
    ov.classList.add('show');
  });
  // Spawn banyak hearts pas easter egg muncul
  for (let i = 0; i < 8; i++) setTimeout(() => spawnEggHeart(), i * 150);
}

function spawnEggHeart() {
  const wrap = document.getElementById('heartsWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'heart-float';
  el.textContent = ['🤍','💛','✨','🌙','🫶'][Math.floor(Math.random()*5)];
  el.style.left = (Math.random() * 90 + 5) + 'vw';
  el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  el.style.animationDuration = (3 + Math.random() * 3) + 's';
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

window.closeEgg = () => {
  document.getElementById('eggOverlay')?.classList.remove('show');
};

// ════════════════════════════════════════════════════════════
// ★ SHAKE — getar HP buat trigger efek
// ════════════════════════════════════════════════════════════
function initShake() {
  let lastX = 0, lastY = 0, lastZ = 0, lastShake = 0;

  if (!window.DeviceMotionEvent) return;

  // iOS 13+ perlu izin
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // Minta izin pas pertama kali user tap
    document.addEventListener('click', async () => {
      try { await DeviceMotionEvent.requestPermission(); } catch {}
    }, { once: true });
  }

  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const dx = Math.abs(acc.x - lastX);
    const dy = Math.abs(acc.y - lastY);
    const dz = Math.abs(acc.z - lastZ);
    lastX = acc.x; lastY = acc.y; lastZ = acc.z;

    const now = Date.now();
    if (dx + dy + dz > 35 && now - lastShake > 1500) {
      lastShake = now;
      onShake();
    }
  });
}

function onShake() {
  // Spawn burst particles di tengah
  burst(W/2, H/2, 40);
  // Spawn banyak hearts
  for (let i = 0; i < 6; i++) setTimeout(() => spawnEggHeart(), i * 120);
  // Flash aurora
  const blobs = document.querySelectorAll('.aurora-blob');
  blobs.forEach(b => {
    b.style.transition = 'opacity .1s';
    b.style.opacity = '1';
    setTimeout(() => b.style.opacity = '', 400);
  });
  // Toast
  const toast = document.getElementById('camToast');
  if (toast) {
    const orig = toast.textContent;
    toast.textContent = '✨ wah kamu guncang HP nya!';
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); toast.textContent = orig; }, 2500);
  }
}

// ════════════════════════════════════════════════════════════
// ★ PARALLAX — mouse/gyro gerakin elemen
// ════════════════════════════════════════════════════════════
function initParallax() {
  let tx = 0, ty = 0, cx = 0, cy = 0;

  // Mouse parallax
  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth  - .5) * 30;
    ty = (e.clientY / window.innerHeight - .5) * 20;
  });

  // Gyro parallax (mobile)
  window.addEventListener('deviceorientation', e => {
    if (e.gamma !== null) tx = e.gamma * .8;
    if (e.beta  !== null) ty = (e.beta - 30) * .5;
  });

  function parallaxLoop() {
    // Smooth lerp
    cx += (tx - cx) * .06;
    cy += (ty - cy) * .06;

    const moon = document.getElementById('introMoon');
    if (moon) moon.style.transform = `translate(${cx * .6}px, ${cy * .4}px)`;

    const lines = document.querySelectorAll('.intro-bg-line');
    lines.forEach((l, i) => {
      const d = (i + 1) * .25;
      l.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
    });

    requestAnimationFrame(parallaxLoop);
  }
  requestAnimationFrame(parallaxLoop);
}

// ════════════════════════════════════════════════════════════
// ★ GALAXY INTERACTIVE
// ════════════════════════════════════════════════════════════

const GALAXY_MEMORIES = [
  { label: 'Momen Pertama', msg: 'Pertama kali kita ngobrol — dan aku ga nyangka bakal secandu ini.' },
  { label: 'Favorit', msg: 'Saat kamu cerita hal random dan aku dengerin sambil senyum-senyum sendiri.' },
  { label: 'Yang Bikin Kangen', msg: 'Ketawa bareng sampai lupa kita lagi ngomongin apa.' },
  { label: 'Rahasia', msg: 'Sejak ketemu kamu, aku jadi lebih baik. Meski kamu ga tau itu.' },
  { label: 'Harapan', msg: 'Semoga suatu hari kita bisa cerita "dulu kita gini" sambil ketawa bareng.' },
  { label: 'Momen Tenang', msg: 'Waktu kita diam tapi ga canggung. Itu yang paling aku suka.' },
  { label: 'Yang Ga Pernah Bilang', msg: 'Aku selalu lihat pesanmu lebih dulu sebelum balas yang lain.' },
  { label: 'Bintang Kita', msg: 'Kalau ada satu bintang buat kita, aku mau yang paling terang itu.' },
  { label: 'Lebaran Ini', msg: 'Hari ini aku bersyukur banget — salah satunya karena ada kamu.' },
  { label: 'Seribu Tahun', msg: '"I have loved you for a thousand years, I\'ll love you for a thousand more." 🤍' },
  { label: 'Kamu', msg: 'Tia. Nama yang entah kenapa selalu bikin aku tenang tiap nyebutnya.' },
  { label: 'Nanti', msg: 'Aku ga tau masa depan, tapi aku tau aku mau kamu ada di dalamnya.' },
];

let galaxyStars = [], galaxyAnim = false;

function initGalaxy() {
  const cvs = document.getElementById('galaxyCvs');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  function resize() {
    const wrap = cvs.parentElement;
    cvs.width  = wrap.clientWidth;
    cvs.height = wrap.clientHeight;
    buildStars();
  }

  function buildStars() {
    galaxyStars = [];
    const W = cvs.width, H = cvs.height;

    // Background dust stars
    for (let i = 0; i < 180; i++) {
      galaxyStars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * .8 + .2,
        a: Math.random() * .4 + .1,
        twinkle: Math.random() * Math.PI * 2,
        ts: .003 + Math.random() * .004,
        special: false
      });
    }

    // Special clickable stars with memories
    GALAXY_MEMORIES.forEach((mem, i) => {
      const angle = (i / GALAXY_MEMORIES.length) * Math.PI * 2;
      const dist  = 0.18 + Math.random() * 0.28;
      galaxyStars.push({
        x: W/2 + Math.cos(angle) * W * dist,
        y: H/2 + Math.sin(angle) * H * dist * .75,
        r: 2.5 + Math.random() * 2,
        a: .9, twinkle: Math.random() * Math.PI * 2,
        ts: .008 + Math.random() * .006,
        special: true, mem,
        glow: 0, glowDir: 1,
        orbitAngle: angle, orbitDist: dist,
        baseX: 0, baseY: 0
      });
    });
  }

  resize();
  window.addEventListener('resize', resize);

  // Click handler
  cvs.addEventListener('click', e => {
    const rect = cvs.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (cvs.width / rect.width);
    const my = (e.clientY - rect.top)  * (cvs.height / rect.height);
    const hit = galaxyStars.find(s => s.special && Math.hypot(s.x-mx, s.y-my) < 18);
    if (hit) showGalaxyPop(hit.mem);
    else burst(e.clientX, e.clientY, 8);
  });

  cvs.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    const rect = cvs.getBoundingClientRect();
    const mx = (t.clientX - rect.left) * (cvs.width / rect.width);
    const my = (t.clientY - rect.top)  * (cvs.height / rect.height);
    const hit = galaxyStars.find(s => s.special && Math.hypot(s.x-mx, s.y-my) < 22);
    if (hit) showGalaxyPop(hit.mem);
  });

  if (!galaxyAnim) { galaxyAnim = true; drawGalaxy(ctx, cvs); }
}

function drawGalaxy(ctx, cvs) {
  if (!document.getElementById('pg-galaxy')?.classList.contains('on')) {
    galaxyAnim = false; return;
  }
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // Nebula center glow
  const grad = ctx.createRadialGradient(cvs.width/2, cvs.height/2, 0, cvs.width/2, cvs.height/2, cvs.width*.45);
  grad.addColorStop(0,   'rgba(180,120,255,.06)');
  grad.addColorStop(.5,  'rgba(201,162,94,.03)');
  grad.addColorStop(1,   'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  const t = Date.now() * .001;

  galaxyStars.forEach(s => {
    s.twinkle += s.ts;
    const tw = Math.sin(s.twinkle) * .35 + .65;

    if (s.special) {
      s.glow += s.glowDir * .03;
      if (s.glow > 1 || s.glow < 0) s.glowDir *= -1;

      // Orbit drift
      s.orbitAngle += .0003;
      s.x = cvs.width/2  + Math.cos(s.orbitAngle) * cvs.width  * s.orbitDist;
      s.y = cvs.height/2 + Math.sin(s.orbitAngle) * cvs.height * s.orbitDist * .75;

      // Outer glow ring
      const glw = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 18 + s.glow * 10);
      glw.addColorStop(0,   `rgba(201,162,94,${.35 * tw})`);
      glw.addColorStop(.5,  `rgba(201,162,94,${.08 * tw})`);
      glw.addColorStop(1,   'transparent');
      ctx.fillStyle = glw;
      ctx.beginPath(); ctx.arc(s.x, s.y, 18 + s.glow * 10, 0, Math.PI*2); ctx.fill();

      // Star cross sparkle
      ctx.save();
      ctx.globalAlpha = .5 * tw;
      ctx.strokeStyle = `rgba(255,240,180,${.6 * tw})`;
      ctx.lineWidth = .8;
      const sp = 6 + s.glow * 4;
      ctx.beginPath();
      ctx.moveTo(s.x - sp, s.y); ctx.lineTo(s.x + sp, s.y);
      ctx.moveTo(s.x, s.y - sp); ctx.lineTo(s.x, s.y + sp);
      ctx.stroke();
      ctx.restore();
    }

    // Core dot
    ctx.save();
    ctx.globalAlpha = s.a * tw;
    ctx.fillStyle = s.special ? '#fffbe8' : '#ffffff';
    if (s.special) { ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(201,162,94,.8)'; }
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });

  requestAnimationFrame(() => drawGalaxy(ctx, cvs));
}

function showGalaxyPop(mem) {
  const pop = document.getElementById('galaxyPopup');
  pop.classList.remove('hidden');
  requestAnimationFrame(() => {
    document.getElementById('gpopLabel').textContent = mem.label;
    document.getElementById('gpopMsg').textContent   = mem.msg;
    pop.classList.add('show');
  });
  burst(window.innerWidth/2, window.innerHeight/2, 16);
}

window.closeGalaxyPop = () => {
  const pop = document.getElementById('galaxyPopup');
  pop.classList.remove('show');
  setTimeout(() => pop.classList.add('hidden'), 350);
};

// ════════════════════════════════════════════════════════════
// ★ PHOTO BOOTH V2 — Real-time canvas filter + strip
// ════════════════════════════════════════════════════════════

let b2Stream = null, b2Filter = 'none', b2ShotsDone = 0;
let b2LiveLoop = null, b2Shooting = false;
const B2_TOTAL = 3;
const b2Shots = []; // ImageData per shot

// Apply pixel filter to canvas context
function applyPixelFilter(ctx, w, h, filter) {
  if (filter === 'none') return;
  if (filter === 'bw') {
    const id = ctx.getImageData(0, 0, w, h);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = d[i]*.3 + d[i+1]*.59 + d[i+2]*.11;
      d[i] = d[i+1] = d[i+2] = g;
    }
    ctx.putImageData(id, 0, 0);
  } else if (filter === 'warm') {
    const id = ctx.getImageData(0, 0, w, h);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i]   = Math.min(255, d[i]   * 1.12 + 18);  // R up
      d[i+1] = Math.min(255, d[i+1] * 1.04 + 5);   // G slight
      d[i+2] = Math.max(0,   d[i+2] * 0.85 - 10);  // B down
    }
    ctx.putImageData(id, 0, 0);
  } else if (filter === 'cold') {
    const id = ctx.getImageData(0, 0, w, h);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i]   = Math.max(0,   d[i]   * 0.85 - 8);   // R down
      d[i+1] = Math.min(255, d[i+1] * 1.03 + 4);   // G slight
      d[i+2] = Math.min(255, d[i+2] * 1.18 + 20);  // B up
    }
    ctx.putImageData(id, 0, 0);
  } else if (filter === 'dream') {
    const id = ctx.getImageData(0, 0, w, h);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i]   = Math.min(255, d[i]   * 1.08 + 15);
      d[i+1] = Math.min(255, d[i+1] * 0.92 + 8);
      d[i+2] = Math.min(255, d[i+2] * 1.15 + 25);
      // Slight brightness lift
      d[i]   = Math.min(255, d[i]   + 8);
      d[i+1] = Math.min(255, d[i+1] + 8);
      d[i+2] = Math.min(255, d[i+2] + 8);
    }
    ctx.putImageData(id, 0, 0);
    // Soft vignette
    const vg = ctx.createRadialGradient(w/2,h/2,h*.2,w/2,h/2,h*.8);
    vg.addColorStop(0, 'rgba(255,180,230,0)');
    vg.addColorStop(1, 'rgba(180,80,255,.18)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,w,h);
  } else if (filter === 'vintage') {
    const id = ctx.getImageData(0, 0, w, h);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2];
      d[i]   = Math.min(255, r*.393 + g*.769 + b*.189 + 20);
      d[i+1] = Math.min(255, r*.349 + g*.686 + b*.168 + 10);
      d[i+2] = Math.min(255, r*.272 + g*.534 + b*.131);
    }
    ctx.putImageData(id, 0, 0);
    // Vignette
    const vg = ctx.createRadialGradient(w/2,h/2,h*.25,w/2,h/2,h*.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(40,20,0,.45)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,w,h);
  }
}

// Live preview loop — draws video + filter to canvas every frame
function b2LiveRender() {
  const vid = document.getElementById('boothVideo');
  const cvs = document.getElementById('boothLiveCvs');
  if (!cvs || !vid || vid.readyState < 2) {
    b2LiveLoop = requestAnimationFrame(b2LiveRender); return;
  }
  const vw = document.getElementById('booth2Viewfinder').clientWidth;
  const vh = document.getElementById('booth2Viewfinder').clientHeight;
  cvs.width  = vw;
  cvs.height = vh;
  const ctx = cvs.getContext('2d');
  // Mirror + draw
  ctx.save();
  ctx.translate(vw, 0); ctx.scale(-1, 1);
  ctx.drawImage(vid, 0, 0, vw, vh);
  ctx.restore();
  // Apply filter pixel-by-pixel
  applyPixelFilter(ctx, vw, vh, b2Filter);
  b2LiveLoop = requestAnimationFrame(b2LiveRender);
}

window.b2Start = async () => {
  try {
    b2Stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false
    });
    const vid = document.getElementById('boothVideo');
    vid.srcObject = b2Stream;
    vid.style.display = 'none'; // hide raw video, use canvas
    await vid.play();
    document.getElementById('b2StartBtn').classList.add('hidden');
    document.getElementById('b2ShutterWrap').classList.remove('hidden');
    b2LiveLoop = requestAnimationFrame(b2LiveRender);
  } catch(e) {
    alert('Gagal akses kamera 📷\nCek izin browser ya! Error: ' + e.message);
  }
};

window.b2SetFilter = (btn, f) => {
  b2Filter = f;
  document.querySelectorAll('.b2filt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.b2TakeStrip = async () => {
  if (b2Shooting) return;
  b2Shooting = true;
  b2ShotsDone = 0;
  b2Shots.length = 0;
  document.getElementById('b2ShutterBtn').disabled = true;

  for (let i = 0; i < B2_TOTAL; i++) {
    // Countdown 3-2-1
    await b2Countdown(3);
    // Flash
    await b2DoFlash();
    // Capture
    b2CaptureShot(i);
    // Gap between shots
    if (i < B2_TOTAL - 1) await b2Wait(800);
  }

  b2Shooting = false;
  document.getElementById('b2ShutterBtn').disabled = false;
  // Show save buttons
  document.getElementById('booth2SaveWrap').classList.remove('hidden');
  burst(window.innerWidth/2, window.innerHeight/2, 40);
  triggerConf();
};

function b2Countdown(from) {
  return new Promise(resolve => {
    const el  = document.getElementById('booth2Cd');
    const num = document.getElementById('booth2CdNum');
    let n = from;
    el.classList.remove('hidden');

    const tick = () => {
      num.textContent = n;
      // Reset anim
      num.style.animation = 'none';
      requestAnimationFrame(() => { num.style.animation = 'cdPop .5s var(--ease) forwards'; });
      if (n <= 0) { el.classList.add('hidden'); resolve(); return; }
      n--;
      setTimeout(tick, 900);
    };
    tick();
  });
}

function b2DoFlash() {
  return new Promise(resolve => {
    const fl = document.getElementById('booth2Flash');
    fl.classList.add('on');
    setTimeout(() => { fl.classList.remove('on'); resolve(); }, 120);
  });
}

function b2Wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function b2CaptureShot(idx) {
  const vid = document.getElementById('boothVideo');
  // Capture at high res
  const W = vid.videoWidth  || 640;
  const H = vid.videoHeight || 480;
  const offscreen = document.createElement('canvas');
  offscreen.width  = W;
  offscreen.height = H;
  const ctx = offscreen.getContext('2d');
  // Mirror
  ctx.save();
  ctx.translate(W, 0); ctx.scale(-1, 1);
  ctx.drawImage(vid, 0, 0, W, H);
  ctx.restore();
  // Apply full-quality filter
  applyPixelFilter(ctx, W, H, b2Filter);
  b2Shots[idx] = offscreen;

  // Put into strip slot
  const slot = document.getElementById(`stripSlot${idx}`);
  slot.innerHTML = '';
  const img = document.createElement('img');
  img.src = offscreen.toDataURL('image/jpeg', .92);
  slot.appendChild(img);
  slot.classList.add('capturing');
  setTimeout(() => slot.classList.remove('capturing'), 300);

  // Update shot counter
  b2ShotsDone = idx + 1;
  document.getElementById('booth2ShotCount').textContent = `📸 ${b2ShotsDone} / ${B2_TOTAL}`;
}

window.b2SaveStrip = () => {
  // Build full strip canvas
  const SW = 480, PH = 360, GAP = 8;
  const HEADER = 80, FOOTER = 50, PAD = 20;
  const totalH = HEADER + (PH + GAP) * B2_TOTAL + FOOTER + PAD * 2;

  const cvs = document.createElement('canvas');
  cvs.width  = SW;
  cvs.height = totalH;
  const ctx  = cvs.getContext('2d');

  // Strip background
  const bg = ctx.createLinearGradient(0, 0, 0, totalH);
  bg.addColorStop(0, '#f8f2e4');
  bg.addColorStop(1, '#e8d8bc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SW, totalH);

  // Hole punch
  ctx.save();
  ctx.beginPath(); ctx.arc(SW/2, 16, 8, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fill(); ctx.restore();

  // Header
  ctx.save();
  ctx.fillStyle = '#5a3e1b';
  ctx.font = 'italic 28px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ Latif & Tia', SW/2, 50);
  ctx.font = '12px "Jost", sans-serif';
  ctx.fillStyle = '#8a7050';
  ctx.letterSpacing = '3px';
  ctx.fillText('LEBARAN 1446 H', SW/2, 70);
  ctx.restore();

  // Photos
  b2Shots.forEach((shot, i) => {
    const y = HEADER + PAD + i * (PH + GAP);
    ctx.drawImage(shot, PAD, y, SW - PAD*2, PH);
    // Inner shadow
    const sh = ctx.createLinearGradient(PAD, y, PAD, y+PH);
    sh.addColorStop(0, 'rgba(0,0,0,.12)');
    sh.addColorStop(.15, 'rgba(0,0,0,0)');
    sh.addColorStop(.85, 'rgba(0,0,0,0)');
    sh.addColorStop(1,  'rgba(0,0,0,.12)');
    ctx.fillStyle = sh;
    ctx.fillRect(PAD, y, SW - PAD*2, PH);
  });

  // Footer
  const fy = HEADER + PAD + B2_TOTAL * (PH + GAP) + 14;
  ctx.save();
  ctx.fillStyle = '#8a7050';
  ctx.font = '13px "Jost", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌙 Idul Fitri · Selamat Hari Raya', SW/2, fy);
  ctx.restore();

  // Download
  const a = document.createElement('a');
  a.download = 'photobooth-latif-tia-1446.png';
  a.href = cvs.toDataURL('image/png');
  a.click();
};

window.b2Reset = () => {
  b2ShotsDone = 0;
  b2Shots.length = 0;
  for (let i = 0; i < B2_TOTAL; i++) {
    const slot = document.getElementById(`stripSlot${i}`);
    slot.innerHTML = `<div class="strip-ph"><span>${i+1}</span></div>`;
  }
  document.getElementById('booth2SaveWrap').classList.add('hidden');
  document.getElementById('booth2ShotCount').textContent = '📸 0 / 3';
  document.getElementById('b2ShutterBtn').disabled = false;
};

// ════════════════════════════════════════════════════════════
// ★ WISH JAR
// ════════════════════════════════════════════════════════════

const WISHES = [
  'Semoga kita bisa ketawa bareng tanpa henti, lebih sering dari sekarang.',
  'Semoga kamu selalu sehat dan bahagia, bahkan di hari yang berat sekalipun.',
  'Semoga suatu hari aku bisa bilang ini langsung — dan kamu tersenyum.',
  'Semoga setiap Lebaran kita lewatin bareng, sampai kita bosan menghitung.',
  'Semoga kamu tahu betapa berartinya kamu, bahkan tanpa aku harus bilang.',
  'Semoga kita saling tumbuh — bukan menjauh, tapi makin dekat.',
  'Semoga nama kita disebut di doa yang sama, di langit yang sama.',
  'Semoga aku bisa jadi orang yang layak buat kamu percaya.',
  'Semoga Lebaran tahun depan, statusnya udah beda. 😌',
  'Semoga "nanti" itu datang lebih cepat dari yang kita kira. 🌙',
];

let jarWishIdx = 0, jarShaking = false, jarWishShuffled = [];

function initJar() {
  const cvs = document.getElementById('jarCvs');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  cvs.width = 220; cvs.height = 280;
  jarWishShuffled = [...WISHES].sort(() => Math.random() - .5);
  drawJar(ctx, cvs, 0);
}

function drawJar(ctx, cvs, shake) {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  const cx = cvs.width/2 + (shake ? (Math.random()-.5)*shake : 0);
  const cy = 40;

  // Jar neck
  ctx.save();
  const neckGrad = ctx.createLinearGradient(cx-16, cy, cx+16, cy);
  neckGrad.addColorStop(0,   'rgba(201,162,94,.15)');
  neckGrad.addColorStop(.4,  'rgba(240,232,216,.25)');
  neckGrad.addColorStop(1,   'rgba(201,162,94,.1)');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.roundRect(cx-16, cy, 32, 20, 4);
  ctx.fill();
  ctx.restore();

  // Lid
  ctx.save();
  const lidGrad = ctx.createLinearGradient(cx-22, cy-8, cx+22, cy-8);
  lidGrad.addColorStop(0, 'rgba(160,120,50,.6)');
  lidGrad.addColorStop(.5,'rgba(201,162,94,.9)');
  lidGrad.addColorStop(1, 'rgba(140,100,40,.6)');
  ctx.fillStyle = lidGrad;
  ctx.beginPath();
  ctx.roundRect(cx-22, cy-10, 44, 14, 5);
  ctx.fill();
  ctx.strokeStyle = 'rgba(201,162,94,.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Jar body
  const jarY = cy+20, jarH = 210, jarW = 130;
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(cx-jarW/2, 0, cx+jarW/2, 0);
  bodyGrad.addColorStop(0,    'rgba(201,162,94,.08)');
  bodyGrad.addColorStop(.25,  'rgba(240,232,216,.18)');
  bodyGrad.addColorStop(.75,  'rgba(240,232,216,.12)');
  bodyGrad.addColorStop(1,    'rgba(201,162,94,.06)');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 16, jarY);
  ctx.bezierCurveTo(cx - jarW/2 - 10, jarY+30, cx - jarW/2, jarY+60, cx - jarW/2, jarY+jarH*.4);
  ctx.lineTo(cx - jarW/2 + 8, jarY+jarH);
  ctx.lineTo(cx + jarW/2 - 8, jarY+jarH);
  ctx.lineTo(cx + jarW/2, jarY+jarH*.4);
  ctx.bezierCurveTo(cx + jarW/2, jarY+60, cx + jarW/2 + 10, jarY+30, cx + 16, jarY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(201,162,94,.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Floating wish papers inside
  const t = Date.now() * .001;
  const paperColors = ['rgba(240,200,130,.7)','rgba(255,220,160,.6)','rgba(220,180,100,.65)'];
  for (let i = 0; i < 7; i++) {
    const px = cx - 40 + Math.sin(t*.8 + i*1.1) * 35 + Math.cos(t*.5 + i*.7) * 15;
    const py = jarY + 40 + (i * 22) + Math.sin(t + i * .8) * 8;
    const rot = Math.sin(t*.6 + i) * 20 * (Math.PI/180);
    ctx.save();
    ctx.globalAlpha = .55 + Math.sin(t + i) * .15;
    ctx.translate(px, py); ctx.rotate(rot);
    ctx.fillStyle = paperColors[i % 3];
    ctx.beginPath(); ctx.roundRect(-12, -5, 24, 10, 2); ctx.fill();
    ctx.restore();
  }

  // Shimmer line
  ctx.save();
  ctx.globalAlpha = .15 + Math.abs(Math.sin(t*.5)) * .1;
  ctx.strokeStyle = 'rgba(255,240,200,.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - jarW/2 + 18, jarY + 30);
  ctx.lineTo(cx - jarW/2 + 22, jarY + jarH - 30);
  ctx.stroke();
  ctx.restore();

  requestAnimationFrame(() => {
    if (document.getElementById('pg-jar')?.classList.contains('on')) drawJar(ctx, cvs, 0);
  });
}

window.shakeJar = () => {
  if (jarShaking) return;
  jarShaking = true;
  const cvs = document.getElementById('jarCvs');
  const ctx = cvs.getContext('2d');
  let shakeT = 0;

  const si = setInterval(() => {
    shakeT++;
    drawJar(ctx, cvs, 10 - shakeT * .8);
    if (shakeT >= 10) {
      clearInterval(si);
      jarShaking = false;
      showWish();
    }
  }, 50);

  // Also trigger phone vibration
  if (navigator.vibrate) navigator.vibrate([30,20,30,20,40]);
};

function showWish() {
  const pop  = document.getElementById('wishPopup');
  const txt  = document.getElementById('wishText');
  const num  = document.getElementById('wishNum');
  const next = document.getElementById('jarNextBtn');
  const hint = document.getElementById('jarTapHint');

  if (jarWishIdx >= jarWishShuffled.length) {
    jarWishIdx = 0;
    jarWishShuffled = [...WISHES].sort(() => Math.random() - .5);
  }

  txt.textContent = jarWishShuffled[jarWishIdx];
  num.textContent = `${jarWishIdx + 1} / ${jarWishShuffled.length}`;
  jarWishIdx++;

  pop.classList.remove('hidden');
  pop.classList.add('show');
  next.classList.remove('hidden');
  hint.textContent = 'kocok lagi ✨';

  for (let i = 0; i < 5; i++) setTimeout(() => spawnEggHeart(), i * 120);
}

window.nextWish = () => {
  const pop = document.getElementById('wishPopup');
  pop.classList.remove('show');
  pop.classList.add('hidden');
  document.getElementById('jarNextBtn').classList.add('hidden');
  document.getElementById('jarTapHint').textContent = 'tap untuk kocok ✨';
};

// ════════════════════════════════════════════════════════════
// ★ SECRET ROOM
// ════════════════════════════════════════════════════════════

const SECRET_PASSWORD = 'tia';
let secretUnlocked = false;

window.openSecretRoom = () => {
  const ov = document.getElementById('secretOverlay');
  ov.classList.remove('hidden');
  requestAnimationFrame(() => ov.classList.add('show'));
  setTimeout(() => document.getElementById('secretInput')?.focus(), 300);
  if (secretUnlocked) showSecretRoom();
};

window.closeSecret = () => {
  const ov = document.getElementById('secretOverlay');
  ov.classList.remove('show');
  setTimeout(() => ov.classList.add('hidden'), 500);
};

window.checkPassword = (val) => {
  const inp  = document.getElementById('secretInput');
  const dots = document.querySelectorAll('.lock-dots span');
  const icon = document.getElementById('lockIcon');
  const hint = document.getElementById('lockHint');
  const clean = val.trim().toLowerCase();

  // Animate dots
  dots.forEach((d, i) => d.classList.toggle('on', i < clean.length));

  if (clean === SECRET_PASSWORD) {
    inp.classList.remove('wrong');
    inp.classList.add('correct');
    icon.textContent = '🔓';
    secretUnlocked = true;
    burst(window.innerWidth/2, window.innerHeight/2, 35);
    triggerConf();
    setTimeout(() => showSecretRoom(), 700);
  } else if (clean.length >= SECRET_PASSWORD.length && !SECRET_PASSWORD.startsWith(clean)) {
    inp.classList.add('wrong');
    inp.classList.remove('correct');
    icon.textContent = '🔒';
    hint.textContent = 'salah... coba lagi 😢';
    setTimeout(() => { inp.classList.remove('wrong'); inp.value = ''; dots.forEach(d=>d.classList.remove('on')); }, 600);
  }
};

function showSecretRoom() {
  document.getElementById('secretLock').classList.add('hidden');
  const room = document.getElementById('secretRoom');
  room.classList.remove('hidden');
  for (let i = 0; i < 10; i++) setTimeout(() => spawnEggHeart(), i * 100);
}

// galaxy & jar init handled in onPageIn above

// ════════════════════════════════════════════════════════════
// ★ PLAYLIST V2 — MP3 + YouTube
// ════════════════════════════════════════════════════════════
let plSongs = [];       // { type:'mp3'|'yt', title, artist, note, url (mp3 blob or yt id) }
let plCurIdx = -1;
let plAudio  = new Audio();
let plYtPlayer = null;
let plIsPlaying = false;

// ── Tab switching ──
window.plSetAddTab = (btn, tab) => {
  document.querySelectorAll('.pl-add-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('plMp3Panel').classList.toggle('hidden', tab !== 'mp3');
  document.getElementById('plYtPanel').classList.toggle('hidden', tab !== 'yt');
};

// ── Handle MP3 file pick ──
window.plHandleMp3 = inp => {
  const f = inp.files[0]; if (!f) return;
  document.getElementById('plMp3Name').textContent = f.name;
  const name = f.name.replace(/\.[^.]+$/, '');
  if (!document.getElementById('plMp3Title').value) document.getElementById('plMp3Title').value = name;
};

// ── Add MP3 ──
window.plAddMp3 = () => {
  const inp    = document.getElementById('plMp3Input');
  const title  = document.getElementById('plMp3Title').value.trim();
  const artist = document.getElementById('plMp3Artist').value.trim();
  const note   = document.getElementById('plMp3Note').value.trim();
  if (!inp.files[0]) { alert('Pilih file MP3 dulu ya!'); return; }
  if (!title) { document.getElementById('plMp3Title').focus(); return; }
  const url = URL.createObjectURL(inp.files[0]);
  plSongs.push({ type: 'mp3', title, artist: artist||'Unknown', note, url });
  inp.value = ''; document.getElementById('plMp3Name').textContent = 'mp3, m4a, wav, flac';
  document.getElementById('plMp3Title').value = '';
  document.getElementById('plMp3Artist').value = '';
  document.getElementById('plMp3Note').value = '';
  renderPlaylist();
  burst(window.innerWidth/2, window.innerHeight/2, 12);
};

// ── Add YouTube ──
window.plAddYt = () => {
  const raw    = document.getElementById('plYtUrl').value.trim();
  const title  = document.getElementById('plYtTitle').value.trim();
  const artist = document.getElementById('plYtArtist').value.trim();
  const note   = document.getElementById('plYtNote').value.trim();
  const ytId   = plExtractYtId(raw);
  if (!ytId)  { alert('Link YouTube tidak valid. Pastikan formatnya youtube.com/watch?v=... atau youtu.be/...'); return; }
  if (!title) { document.getElementById('plYtTitle').focus(); return; }
  plSongs.push({ type: 'yt', title, artist: artist||'Unknown', note, url: ytId });
  document.getElementById('plYtUrl').value = '';
  document.getElementById('plYtTitle').value = '';
  document.getElementById('plYtArtist').value = '';
  document.getElementById('plYtNote').value = '';
  renderPlaylist();
  burst(window.innerWidth/2, window.innerHeight/2, 12);
};

function plExtractYtId(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ── Render list ──
function renderPlaylist() {
  const list = document.getElementById('plList');
  if (!list) return;
  if (!plSongs.length) {
    list.innerHTML = '<p class="pl-empty">Belum ada lagu. Tambahkan di bawah! 🎵</p>'; return;
  }
  list.innerHTML = plSongs.map((s, i) => `
    <div class="pl-item ${i===plCurIdx?'playing':''}" onclick="plPlay(${i})">
      <div class="pl-item-type ${s.type}">${s.type==='yt'?'▶':'♪'}</div>
      <div class="pl-info">
        <p class="pl-song">${s.title}</p>
        <p class="pl-artist-name">${s.artist}</p>
        ${s.note ? `<p class="pl-note-text">${s.note}</p>` : ''}
      </div>
      <button class="pl-del" onclick="event.stopPropagation();plDel(${i})">✕</button>
    </div>`).join('');
}

// ── Play a song ──
window.plPlay = idx => {
  if (idx < 0 || idx >= plSongs.length) return;
  plCurIdx = idx;
  const s = plSongs[idx];

  // Stop whatever's playing
  plAudio.pause();
  plAudio.src = '';
  plHideYt();

  // Update now playing UI
  const np = document.getElementById('plNowPlaying');
  np.classList.remove('hidden');
  document.getElementById('plNpTitle').textContent  = s.title;
  document.getElementById('plNpArtist').textContent = s.artist;
  document.getElementById('plNpFill').style.width   = '0%';
  document.getElementById('plNpCur').textContent    = '0:00';
  document.getElementById('plNpDur').textContent    = '—:——';

  if (s.type === 'mp3') {
    np.classList.add('spinning');
    plAudio.src = s.url;
    plAudio.play().catch(()=>{});
    plIsPlaying = true;
    document.getElementById('plNpPlay').textContent = '⏸';
    plAudio.ontimeupdate = () => {
      if (!plAudio.duration) return;
      const pct = (plAudio.currentTime / plAudio.duration) * 100;
      document.getElementById('plNpFill').style.width = pct + '%';
      document.getElementById('plNpCur').textContent = plFmt(plAudio.currentTime);
      document.getElementById('plNpDur').textContent = plFmt(plAudio.duration);
    };
    plAudio.onended = () => plNext();
  } else {
    // YouTube
    np.classList.remove('spinning');
    plShowYt(s.url);
    document.getElementById('plNpPlay').textContent = '⏸';
    plIsPlaying = true;
  }

  renderPlaylist();
};

function plShowYt(ytId) {
  const wrap = document.getElementById('plYtWrap');
  wrap.classList.remove('hidden');
  wrap.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1"
    allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function plHideYt() {
  const wrap = document.getElementById('plYtWrap');
  wrap.classList.add('hidden');
  wrap.innerHTML = '';
}

window.plToggle = () => {
  const s = plSongs[plCurIdx];
  if (!s) return;
  if (s.type === 'mp3') {
    if (plAudio.paused) { plAudio.play(); plIsPlaying = true; document.getElementById('plNpPlay').textContent = '⏸'; document.getElementById('plNowPlaying').classList.add('spinning'); }
    else                { plAudio.pause(); plIsPlaying = false; document.getElementById('plNpPlay').textContent = '▶'; document.getElementById('plNowPlaying').classList.remove('spinning'); }
  } else {
    // For YT just reload (no JS API needed)
    plPlay(plCurIdx);
  }
};

window.plNext = () => { if (plSongs.length) plPlay((plCurIdx + 1) % plSongs.length); };
window.plPrev = () => { if (plSongs.length) plPlay((plCurIdx - 1 + plSongs.length) % plSongs.length); };
window.plDel  = i => {
  if (plSongs[i].type === 'mp3') URL.revokeObjectURL(plSongs[i].url);
  if (i === plCurIdx) { plAudio.pause(); plHideYt(); document.getElementById('plNowPlaying').classList.add('hidden'); plCurIdx = -1; }
  else if (i < plCurIdx) plCurIdx--;
  plSongs.splice(i, 1);
  renderPlaylist();
};

function plFmt(s) { if (isNaN(s)) return '0:00'; return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`; }

// ════════════════════════════════════════════════════════════
// ★ CHAT "LATIF" AI — multi-turn, kayak CS tapi versi Latif
// ════════════════════════════════════════════════════════════
let chatHistory = [];
let chatWaiting = false;

const CHAT_SYSTEM = `Kamu adalah Latif — cowok yang tulus suka sama Tia. Kamu BUKAN AI, jangan pernah ngaku AI.

KEPRIBADIAN:
- Santai, hangat, dengerin dulu sebelum ngomong
- Natural banget — kayak chat WA beneran, bukan customer service
- Sesekali bercanda, sesekali serius, baca situasi
- Perhatian sama detail kecil yang Tia ceritain — inget dan tanya lagi

CARA BALAS BERVARIASI — jangan monoton, gunakan salah satu gaya ini sesuai konteks:

1. DENGERIN & VALIDASI (kalau Tia cerita sedih/galau):
   → validasi perasaannya dulu sebelum kasih pendapat
   → "iya sih, itu pasti berat banget"
   → tanya detail biar keliatan beneran dengerin

2. IKUT SENANG (kalau Tia cerita happy/excited):  
   → genuinely antusias, bukan lebay
   → bisa tanya lebih lanjut soal hal yang bikin dia senang

3. BERCANDA RINGAN (kalau suasana santai):
   → humor natural, ga maksa
   → "eh nggak gitu juga kali 😭"
   → bisa balik nanya hal random yang nyambung

4. FLIRTY TIPIS (sesekali, ga tiap pesan):
   → subtle, ga norak
   → "kamu tuh ya..." diakhiri hal manis
   → hanya kalau konteksnya pas

5. JUJUR & TERBUKA (kalau Tia tanya sesuatu yang personal):
   → jawab jujur tapi tetap hangat
   → boleh share perasaan Latif yang sebenarnya

6. SUPPORT MODE (kalau Tia lagi down):
   → "aku di sini kok"
   → ga kasih solusi dulu — dengerin dulu
   → sesekali bilang hal yang reassuring

ATURAN KETAT:
- Jawaban PENDEK-MENENGAH — kayak chat WA, bukan essay
- Jangan pakai bullet point atau heading
- Jangan mulai dengan "Hei" atau "Hai" terus — variasikan
- Setiap balasan harus BEDA gaya dari sebelumnya — jangan monoton
- Pakai "kamu", "aku" — bukan "anda" atau "saya"
- Boleh pakai "eh", "iya sih", "beneran?", "hehe", "wah", "anjir" secukupnya
- JANGAN pernah copy-paste template yang sama

Konteks: Lebaran 1446 H. Latif dan Tia belum resmi, tapi Latif serius dan tulus.`;

function initChat() {
  // Only show first greeting if chat is empty
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  if (chatHistory.length === 0) {
    msgs.innerHTML = `<div class="chat-msg bot">
      <div class="chat-bubble">Hei Tia 🌙 aku di sini. Mau cerita apa hari ini?</div>
      <span class="chat-time">${chatTimeNow()}</span>
    </div>`;
  }
}

window.chatSend = async () => {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg || chatWaiting) return;
  inp.value = ''; inp.style.height = 'auto';

  // Render user bubble
  chatAppend('user', msg);
  chatHistory.push({ role: 'user', content: msg });

  // Show typing
  chatWaiting = true;
  const typing = document.getElementById('chatTyping');
  if (typing) typing.classList.remove('hidden');
  chatScrollBottom();

  // Delay typing indicator realism (1.2–2.5s)
  const thinkMs = 1200 + Math.random() * 1300;
  await new Promise(r => setTimeout(r, thinkMs));

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: CHAT_SYSTEM,
        messages: chatHistory
      })
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || 'eh, koneksinya gangguan bentar. coba lagi ya 😅';
    if (typing) typing.classList.add('hidden');
    chatAppend('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch {
    if (typing) typing.classList.add('hidden');
    chatAppend('bot', 'kalau mau cerita langsung ke wa aja si ngapa disini😡');
  }
  chatWaiting = false;
};

function chatAppend(role, text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="chat-bubble">${text.replace(/\n/g,'<br>')}</div><span class="chat-time">${chatTimeNow()}</span>`;
  msgs.appendChild(div);
  chatScrollBottom();
  if (role === 'bot') for (let i=0;i<3;i++) setTimeout(()=>spawnEggHeart(), i*200);
}

function chatScrollBottom() {
  const msgs = document.getElementById('chatMessages');
  if (msgs) setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
}

function chatTimeNow() {
  return new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
}

window.chatClear = () => {
  chatHistory = [];
  initChat();
};

// ════════════════════════════════════════════════════════════
// ★ MINI VLOG
// ════════════════════════════════════════════════════════════
let vlogStream = null, vlogRecorder = null, vlogChunks = [], vlogInterval = null, vlogSecs = 0;
let vlogItems = [];

window.vlogStartCam = async () => {
  try {
    vlogStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    const vid = document.getElementById('vlogVideo');
    vid.srcObject = vlogStream;
    document.getElementById('vlogStartCamBtn').classList.add('hidden');
    document.getElementById('vlogRecBtn').classList.remove('hidden');
  } catch(e) { alert('Gagal akses kamera/mic: ' + e.message); }
};

window.vlogToggleRec = () => {
  if (!vlogRecorder || vlogRecorder.state === 'inactive') {
    vlogStartRec();
  } else {
    vlogStopRec();
  }
};

function vlogStartRec() {
  vlogChunks = []; vlogSecs = 0;
  vlogRecorder = new MediaRecorder(vlogStream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm' });
  vlogRecorder.ondataavailable = e => { if (e.data.size) vlogChunks.push(e.data); };
  vlogRecorder.onstop = vlogSave;
  vlogRecorder.start(100);
  document.getElementById('vlogBadge').classList.remove('hidden');
  document.getElementById('vlogRecTxt').textContent = '⏹ Stop';
  vlogInterval = setInterval(() => {
    vlogSecs++;
    const m = Math.floor(vlogSecs/60), s = vlogSecs%60;
    document.getElementById('vlogTimer').textContent = `${m}:${String(s).padStart(2,'0')}`;
    if (vlogSecs >= 30) vlogStopRec(); // max 30s
  }, 1000);
}

function vlogStopRec() {
  vlogRecorder?.stop();
  clearInterval(vlogInterval);
  document.getElementById('vlogBadge').classList.add('hidden');
  document.getElementById('vlogRecTxt').textContent = '⏺ Mulai Rekam';
}

function vlogSave() {
  const blob = new Blob(vlogChunks, { type: 'video/webm' });
  const url  = URL.createObjectURL(blob);
  vlogItems.unshift({ url, blob, caption: '', secs: vlogSecs });
  renderVlogList();
}

function renderVlogList() {
  const list = document.getElementById('vlogList');
  if (!vlogItems.length) { list.innerHTML = '<p class="vlog-empty">Belum ada vlog. Rekam sesuatu! 🎬</p>'; return; }
  list.innerHTML = vlogItems.map((v,i) => `
    <div class="vlog-card" id="vc${i}">
      <video src="${v.url}" playsinline controls style="width:100%;max-height:200px;object-fit:cover;display:block;transform:scaleX(-1)"></video>
      <div class="vlog-card-body">
        <input class="vlog-caption-input" placeholder="Tulis caption..." value="${v.caption}"
          oninput="vlogItems[${i}].caption=this.value"/>
        <div class="vlog-card-actions">
          <button class="vc-btn" onclick="vlogDownload(${i})">💾 Simpan</button>
          <button class="vc-btn del" onclick="vlogDelete(${i})">🗑️ Hapus</button>
        </div>
      </div>
    </div>`).join('');
}

window.vlogDownload = i => {
  const a = document.createElement('a');
  a.href = vlogItems[i].url;
  a.download = `vlog-latif-tia-${i+1}.webm`;
  a.click();
};
window.vlogDelete = i => { URL.revokeObjectURL(vlogItems[i].url); vlogItems.splice(i,1); renderVlogList(); };
window.initVlog = () => { renderVlogList(); };

// ════════════════════════════════════════════════════════════
// ★ PUZZLE
// ════════════════════════════════════════════════════════════
let pzImg = null, pzSize = 3, pzTiles = [], pzMoves = 0, pzInterval = null, pzSecs = 0, pzEmpty = 0;

window.puzzleSetSize = (btn, s) => {
  pzSize = s;
  document.querySelectorAll('.psp-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.puzzleLoadImg = inp => {
  const file = inp.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    pzImg = e.target.result;
    const lbl = document.getElementById('puzzleUploadLabel');
    lbl.innerHTML = `<img src="${pzImg}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-bottom:.5rem"/><p class="pu-text">Foto dipilih ✓</p>`;
  };
  reader.readAsDataURL(file);
};

window.puzzleStart = () => {
  if (!pzImg) {
    // use a gradient as default
    const c = document.createElement('canvas'); c.width=c.height=300;
    const cx = c.getContext('2d');
    const g = cx.createLinearGradient(0,0,300,300);
    g.addColorStop(0,'#c9a25e'); g.addColorStop(.5,'#7b3fa0'); g.addColorStop(1,'#1a1820');
    cx.fillStyle=g; cx.fillRect(0,0,300,300);
    cx.fillStyle='rgba(255,255,255,.15)'; cx.font='italic 28px serif'; cx.textAlign='center';
    cx.fillText('Latif & Tia', 150, 155);
    pzImg = c.toDataURL();
  }
  document.getElementById('puzzleSetup').classList.add('hidden');
  document.getElementById('puzzleGame').classList.remove('hidden');
  document.getElementById('puzzleWin').classList.add('hidden');
  // Set thumb
  document.getElementById('puzzleThumb').style.backgroundImage = `url(${pzImg})`;
  buildPuzzle();
};

function buildPuzzle() {
  const n = pzSize, total = n*n;
  pzTiles = Array.from({length: total}, (_,i) => i);
  // Shuffle (solvable)
  do { pzTiles.sort(() => Math.random()-.5); } while (!isPuzzleSolvable(pzTiles, n));
  pzEmpty  = pzTiles.indexOf(total-1);
  pzMoves  = 0; pzSecs = 0;
  clearInterval(pzInterval);
  pzInterval = setInterval(() => {
    pzSecs++;
    const m=Math.floor(pzSecs/60), s=pzSecs%60;
    document.getElementById('phTimer').textContent = `${m}:${String(s).padStart(2,'0')}`;
  }, 1000);
  renderPuzzle();
}

function isPuzzleSolvable(tiles, n) {
  let inv = 0;
  const t = tiles.filter(x => x !== n*n-1);
  for (let i=0;i<t.length;i++) for(let j=i+1;j<t.length;j++) if(t[i]>t[j]) inv++;
  if (n%2===1) return inv%2===0;
  const row = Math.floor(tiles.indexOf(n*n-1)/n);
  return (inv + row) % 2 === 1;
}

function renderPuzzle() {
  const n = pzSize, board = document.getElementById('puzzleBoard');
  const tileSize = Math.min(Math.floor((window.innerWidth-60)/n), 90);
  board.style.gridTemplateColumns = `repeat(${n},${tileSize}px)`;
  document.getElementById('phMoves').textContent = pzMoves + ' moves';
  board.innerHTML = pzTiles.map((t,i) => {
    if (t === n*n-1) return `<div class="p-tile empty" data-i="${i}"></div>`;
    const row = Math.floor(t/n), col = t%n;
    const pct = 100/(n-1);
    return `<div class="p-tile${t===i?'correct':''}" data-i="${i}"
      style="width:${tileSize}px;height:${tileSize}px;
             background-image:url(${pzImg});
             background-size:${n*100}%;
             background-position:${col*pct}% ${row*pct}%"
      onclick="pzMove(${i})"></div>`;
  }).join('');
}

window.pzMove = idx => {
  const n = pzSize;
  const er = Math.floor(pzEmpty/n), ec = pzEmpty%n;
  const tr = Math.floor(idx/n),    tc = idx%n;
  if (Math.abs(er-tr)+Math.abs(ec-tc) !== 1) return;
  [pzTiles[pzEmpty], pzTiles[idx]] = [pzTiles[idx], pzTiles[pzEmpty]];
  pzEmpty = idx; pzMoves++;
  renderPuzzle();
  if (pzTiles.every((t,i) => t===i)) puzzleDone();
};

function puzzleDone() {
  clearInterval(pzInterval);
  document.getElementById('puzzleGame').classList.add('hidden');
  document.getElementById('puzzleWin').classList.remove('hidden');
  const m=Math.floor(pzSecs/60),s=pzSecs%60;
  document.getElementById('pwStats').textContent = `${pzMoves} moves · ${m}:${String(s).padStart(2,'0')}`;
  triggerConf();
  burst(window.innerWidth/2, window.innerHeight/2, 40);
}

window.puzzleReset = () => {
  clearInterval(pzInterval);
  document.getElementById('puzzleGame').classList.add('hidden');
  document.getElementById('puzzleWin').classList.add('hidden');
  document.getElementById('puzzleSetup').classList.remove('hidden');
  pzImg = null;
  document.getElementById('puzzleUploadLabel').innerHTML =
    '<div class="pu-icon">🖼️</div><p class="pu-text">Tap untuk pilih foto</p><p class="pu-sub">atau pakai foto default</p>';
};

window.initPuzzle = () => {};

// ════════════════════════════════════════════════════════════
// ★ MEDIA CARDS — foto & musik dalam kartu
// ════════════════════════════════════════════════════════════
let mcItems = [];
let mcCurrentTab = 'photo';

window.mcSetTab = (btn, tab) => {
  mcCurrentTab = tab;
  document.querySelectorAll('.mc-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mcPhotoPanel').classList.toggle('hidden', tab !== 'photo');
  document.getElementById('mcMusicPanel').classList.toggle('hidden', tab !== 'music');
};

window.mcAddPhotos = inp => {
  const caption = document.getElementById('mcPhotoCaption').value.trim();
  Array.from(inp.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      mcItems.unshift({ type: 'photo', src: e.target.result, caption, name: file.name });
      renderMediaCards();
    };
    reader.readAsDataURL(file);
  });
  inp.value = '';
  document.getElementById('mcPhotoCaption').value = '';
};

window.mcAddMusic = inp => {
  const file   = inp.files[0]; if (!file) return;
  const title  = document.getElementById('mcMusicTitle').value.trim() || file.name.replace(/\.[^.]+$/,'');
  const artist = document.getElementById('mcMusicArtist').value.trim() || 'Unknown';
  const url    = URL.createObjectURL(file);
  mcItems.unshift({ type: 'music', url, title, artist, name: file.name });
  renderMediaCards();
  inp.value = '';
  document.getElementById('mcMusicTitle').value = '';
  document.getElementById('mcMusicArtist').value = '';
};

function renderMediaCards() {
  const grid  = document.getElementById('mcGrid');
  const empty = document.getElementById('mcEmpty');
  if (!grid) return;
  if (!mcItems.length) {
    grid.innerHTML = '<p class="mc-empty" id="mcEmpty">Belum ada media. Tambahkan foto atau musik! 🌙</p>';
    return;
  }
  grid.innerHTML = mcItems.map((m,i) => {
    if (m.type === 'photo') return `
      <div class="mc-card photo" onclick="mcViewPhoto(${i})">
        <div class="mc-thumb-wrap" style="position:relative">
          <img class="mc-thumb" src="${m.src}" alt="${m.caption||'foto'}"/>
        </div>
        <div class="mc-card-footer">
          <span class="mc-caption">${m.caption || 'tap untuk lihat'}</span>
          <button class="mc-del" onclick="event.stopPropagation();mcDel(${i})">✕</button>
        </div>
      </div>`;
    else return `
      <div class="mc-card music">
        <div class="mc-music-icon">🎵</div>
        <div class="mc-music-info">
          <p class="mc-card-title">${m.title}</p>
          <p class="mc-card-sub">${m.artist}</p>
        </div>
        <audio class="mc-music-player" src="${m.url}" controls></audio>
        <div class="mc-card-footer" style="padding:.4rem .2rem 0;border:none">
          <span class="mc-caption"></span>
          <button class="mc-del" onclick="mcDel(${i})">✕</button>
        </div>
      </div>`;
  }).join('');
}

window.mcDel = i => {
  if (mcItems[i].url && mcItems[i].type === 'music') URL.revokeObjectURL(mcItems[i].url);
  mcItems.splice(i,1); renderMediaCards();
};

// Full-screen photo viewer
window.mcViewPhoto = i => {
  const m = mcItems[i]; if (m.type !== 'photo') return;
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;';
  ov.innerHTML = `<img src="${m.src}" style="max-width:90vw;max-height:80vh;border-radius:12px;object-fit:contain"/>
    ${m.caption ? `<p style="color:rgba(240,232,216,.7);font-family:'Playfair Display',serif;font-style:italic;margin-top:1rem;font-size:1rem">${m.caption}</p>` : ''}
    <button style="position:absolute;top:1rem;right:1.25rem;background:none;border:none;color:rgba(255,255,255,.5);font-size:1.5rem;cursor:pointer">✕</button>`;
  ov.onclick = () => document.body.removeChild(ov);
  document.body.appendChild(ov);
};

// ════════════════════════════════════════════════════════════
// ★ MOOD TRACKER
// ════════════════════════════════════════════════════════════
let moodData = JSON.parse(localStorage.getItem('mood_data') || '{}');
let moodCalYear = new Date().getFullYear();
let moodCalMonth = new Date().getMonth();
let moodPicked = '';

const MOOD_COLORS = { '😊':'#f9c74f','🥰':'#f94144','🥺':'#90be6d','😔':'#577590','😤':'#f3722c','😴':'#a8dadc','🤔':'#b5838d','✨':'#c9a25e' };
const MONTH_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

window.moodPick = (btn, emoji, label) => {
  moodPicked = emoji;
  document.querySelectorAll('.mood-emoji-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.moodSave = () => {
  if (!moodPicked) { alert('Pilih mood dulu ya! 😊'); return; }
  const today = new Date().toISOString().slice(0,10);
  const note  = document.getElementById('moodNote').value.trim();
  const label = document.querySelector('.mood-emoji-btn.active span')?.textContent || '';
  moodData[today] = { emoji: moodPicked, label, note };
  localStorage.setItem('mood_data', JSON.stringify(moodData));
  document.getElementById('moodNote').value = '';
  moodPicked = '';
  document.querySelectorAll('.mood-emoji-btn').forEach(b => b.classList.remove('active'));
  renderMoodCalendar();
  burst(window.innerWidth/2, window.innerHeight/3, 20);
  showToast('Mood tersimpan ' + moodData[today].emoji);
};

window.moodCalNav = dir => {
  moodCalMonth += dir;
  if (moodCalMonth > 11) { moodCalMonth = 0; moodCalYear++; }
  if (moodCalMonth < 0)  { moodCalMonth = 11; moodCalYear--; }
  renderMoodCalendar();
};

function renderMoodCalendar() {
  const cal   = document.getElementById('moodCalendar');
  const label = document.getElementById('moodCalMonth');
  if (!cal) return;
  label.textContent = `${MONTH_ID[moodCalMonth]} ${moodCalYear}`;

  const firstDay = new Date(moodCalYear, moodCalMonth, 1).getDay();
  const daysIn   = new Date(moodCalYear, moodCalMonth+1, 0).getDate();
  const today    = new Date().toISOString().slice(0,10);

  let html = '<div class="mood-cal-days-header">';
  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(d => html += `<span>${d}</span>`);
  html += '</div><div class="mood-cal-grid">';

  for (let i=0; i<firstDay; i++) html += '<div class="mood-cal-cell empty"></div>';
  for (let d=1; d<=daysIn; d++) {
    const key   = `${moodCalYear}-${String(moodCalMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const entry = moodData[key];
    const isToday = key === today;
    const bg    = entry ? MOOD_COLORS[entry.emoji] || '#c9a25e' : 'transparent';
    html += `<div class="mood-cal-cell${isToday?' today':''}${entry?' has-mood':''}"
      style="${entry?`background:${bg}22;border-color:${bg}55`:''}"
      onclick="moodShowDetail('${key}')">
      <span class="mcc-day">${d}</span>
      ${entry ? `<span class="mcc-emoji">${entry.emoji}</span>` : ''}
    </div>`;
  }
  html += '</div>';
  cal.innerHTML = html;
}

window.moodShowDetail = key => {
  const entry = moodData[key]; if (!entry) return;
  const det = document.getElementById('moodDetail');
  document.getElementById('mdDate').textContent  = key;
  document.getElementById('mdEmoji').textContent = entry.emoji;
  document.getElementById('mdLabel').textContent = entry.label;
  document.getElementById('mdNote').textContent  = entry.note || '(tidak ada catatan)';
  det.classList.remove('hidden');
};

// ════════════════════════════════════════════════════════════
// ★ SURAT BERSAMBUNG
// ════════════════════════════════════════════════════════════
let suratLetters = JSON.parse(localStorage.getItem('surat_letters') || '[]');

// Pre-load Latif's first letter if empty
if (!suratLetters.length) {
  suratLetters.push({
    from: 'latif',
    text: 'Tia,\n\nAku ga tau harus mulai dari mana. Tapi aku rasa kalau nunggu momen yang "tepat", momen itu ga akan pernah datang sendiri.\n\nJadi aku mulai dari sini — dari hal yang sederhana. Aku pengen kamu tau bahwa setiap kali kamu cerita sesuatu, aku dengerin. Bukan cuma suaranya, tapi maksudnya. Perasaannya.\n\nSekarang giliranmu. Cerita apa aja yang kamu mau.',
    date: new Date().toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'})
  });
  localStorage.setItem('surat_letters', JSON.stringify(suratLetters));
}

function renderSuratThread() {
  const thread = document.getElementById('suratThread');
  if (!thread) return;
  thread.innerHTML = suratLetters.map((s,i) => `
    <div class="surat-item ${s.from}">
      <div class="surat-paper">
        <div class="surat-from">${s.from === 'latif' ? '— Latif' : '— Tia'}</div>
        <p class="surat-text">${s.text.replace(/\n/g,'<br>')}</p>
        <p class="surat-date">${s.date}</p>
      </div>
    </div>`).join('');
  thread.scrollTop = thread.scrollHeight;

  const last = suratLetters[suratLetters.length-1];
  const lbl  = document.getElementById('suratComposeLabel');
  if (lbl) lbl.textContent = last.from === 'latif' ? 'Giliran kamu balas Tia... 💌' : 'Latif belum balas. Tunggu sebentar... 🌙';
  document.getElementById('suratKirimTxt').textContent = last.from === 'latif' ? 'Kirim Balasan 💌' : 'Sudah dibalas';
  document.getElementById('suratInput').disabled = last.from === 'tia';
}

window.suratKirim = async () => {
  const last = suratLetters[suratLetters.length-1];
  if (last.from === 'tia') return; // tunggu Latif balas
  const txt = document.getElementById('suratInput').value.trim();
  if (!txt) return;

  // Save Tia's letter
  suratLetters.push({ from:'tia', text:txt, date: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) });
  localStorage.setItem('surat_letters', JSON.stringify(suratLetters));
  document.getElementById('suratInput').value = '';
  renderSuratThread();

  // Auto generate Latif's reply after delay
  document.getElementById('suratKirimTxt').textContent = 'Latif lagi nulis... ✍️';
  await new Promise(r => setTimeout(r, 2500 + Math.random()*2000));

  try {
    const history = suratLetters.map(s => ({
      role: s.from === 'latif' ? 'assistant' : 'user',
      content: s.text
    }));
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:500,
        system:`Kamu adalah Latif yang sedang bertukar surat dengan Tia, gadis yang kamu suka. 
Tulis balasan surat yang natural, hangat, dan personal — seperti cowok muda nulis surat beneran.
Ga perlu salam pembuka formal. Langsung isi surat. 2-3 paragraf.
Balas sesuai isi surat terakhir dari Tia. Jujur dan tulus, kadang sedikit puitis.`,
        messages: history
      })
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Tia, aku baca suratmu berkali-kali. Setiap kalinya selalu ada sesuatu yang bikin aku tersenyum tanpa sadar.';
    suratLetters.push({ from:'latif', text:reply, date: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) });
  } catch {
    suratLetters.push({ from:'latif', text:'Tia, maaf baru balas. Aku baca suratmu dan... ada banyak yang pengen aku bilang tapi susah dirangkai. Yang pasti — makasih udah mau nulis ke aku. 🤍', date: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) });
  }
  localStorage.setItem('surat_letters', JSON.stringify(suratLetters));
  renderSuratThread();
  for(let i=0;i<5;i++) setTimeout(()=>spawnEggHeart(),i*120);
};

// ════════════════════════════════════════════════════════════
// ★ MEMORY MAP — pakai Leaflet.js
// ════════════════════════════════════════════════════════════
let mapInstance = null;
let mapPins = JSON.parse(localStorage.getItem('map_pins') || '[]');

// Default pins
if (!mapPins.length) {
  mapPins = [
    { name:'Tempat Pertama Kali Ketemu', emoji:'✨', note:'Di sinilah semuanya dimulai.', lat:-6.2088, lng:106.8456 },
    { name:'Cafe Favorit Kita', emoji:'☕', note:'Tempat kita ngobrol paling lama.', lat:-6.2150, lng:106.8350 },
  ];
  localStorage.setItem('map_pins', JSON.stringify(mapPins));
}

function initMemoryMap() {
  if (mapInstance) { mapInstance.invalidateSize(); renderMapPinsList(); return; }

  // Load Leaflet dynamically
  if (!window.L) {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(css);
    const scr = document.createElement('script');
    scr.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    scr.onload = () => buildMap();
    document.head.appendChild(scr);
  } else { buildMap(); }
}

function buildMap() {
  const el = document.getElementById('memoryMap');
  if (!el || mapInstance) return;

  mapInstance = L.map('memoryMap', { zoomControl:true }).setView([-6.2088, 106.8456], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'© CartoDB', maxZoom:19
  }).addTo(mapInstance);

  // Click to place pin
  mapInstance.on('click', e => {
    document.getElementById('mapLat').value = e.latlng.lat.toFixed(6);
    document.getElementById('mapLng').value = e.latlng.lng.toFixed(6);
    showToast('Koordinat dipilih! Isi nama & simpan 📍');
  });

  renderMapMarkers();
  renderMapPinsList();
}

function renderMapMarkers() {
  if (!mapInstance) return;
  mapInstance.eachLayer(l => { if (l instanceof L.Marker) mapInstance.removeLayer(l); });
  mapPins.forEach((p, i) => {
    const icon = L.divIcon({
      html: `<div class="map-marker-icon">${p.emoji||'📍'}</div>`,
      className:'', iconSize:[36,36], iconAnchor:[18,36]
    });
    L.marker([p.lat, p.lng], {icon})
      .addTo(mapInstance)
      .bindPopup(`<div class="map-popup"><strong>${p.name}</strong><p>${p.note||''}</p></div>`);
  });
}

function renderMapPinsList() {
  const list = document.getElementById('mapPinsList');
  if (!list) return;
  list.innerHTML = mapPins.map((p,i) => `
    <div class="map-pin-card">
      <span class="map-pin-emoji">${p.emoji||'📍'}</span>
      <div class="map-pin-info">
        <p class="map-pin-name">${p.name}</p>
        <p class="map-pin-note">${p.note||''}</p>
      </div>
      <div class="map-pin-actions">
        <button class="map-pin-btn" onclick="mapFly(${i})">🗺️</button>
        <button class="map-pin-btn del" onclick="mapDel(${i})">✕</button>
      </div>
    </div>`).join('') || '<p class="pl-empty">Belum ada pin. Tap peta atau isi form!</p>';
}

window.mapAddPin = () => {
  const name  = document.getElementById('mapPinName').value.trim();
  const emoji = document.getElementById('mapPinEmoji').value.trim() || '📍';
  const note  = document.getElementById('mapPinNote').value.trim();
  const lat   = parseFloat(document.getElementById('mapLat').value);
  const lng   = parseFloat(document.getElementById('mapLng').value);
  if (!name) { document.getElementById('mapPinName').focus(); return; }
  if (isNaN(lat)||isNaN(lng)) { alert('Tap peta dulu untuk pilih lokasi, atau isi koordinat manual!'); return; }
  mapPins.push({ name, emoji, note, lat, lng });
  localStorage.setItem('map_pins', JSON.stringify(mapPins));
  ['mapPinName','mapPinEmoji','mapPinNote','mapLat','mapLng'].forEach(id => document.getElementById(id).value='');
  renderMapMarkers(); renderMapPinsList();
  mapInstance?.flyTo([lat,lng], 15, {duration:1.5});
  burst(window.innerWidth/2, window.innerHeight/2, 16);
};

window.mapFly  = i => mapInstance?.flyTo([mapPins[i].lat, mapPins[i].lng], 15, {duration:1.5});
window.mapDel  = i => {
  mapPins.splice(i,1);
  localStorage.setItem('map_pins', JSON.stringify(mapPins));
  renderMapMarkers(); renderMapPinsList();
};

window.mapGetGPS = () => {
  if (!navigator.geolocation) { alert('GPS tidak tersedia di browser ini'); return; }
  showToast('Mengambil lokasi GPS... 📍');
  navigator.geolocation.getCurrentPosition(pos => {
    document.getElementById('mapLat').value = pos.coords.latitude.toFixed(6);
    document.getElementById('mapLng').value = pos.coords.longitude.toFixed(6);
    mapInstance?.flyTo([pos.coords.latitude, pos.coords.longitude], 15);
    showToast('Lokasi kamu didapat! ✓');
  }, () => showToast('Gagal dapat GPS. Izinkan lokasi di browser.'));
};

// ════════════════════════════════════════════════════════════
// ★ ARCADE HUB
// ════════════════════════════════════════════════════════════
window.arcadeOpen = (pgId) => {
  navGo(pgId);
};

// ════════════════════════════════════════════════════════════
// ★ STORY MODE
// ════════════════════════════════════════════════════════════
let storyCustomPanels = JSON.parse(localStorage.getItem('story_panels') || '[]');

function renderStory() {
  // Custom panels already in DOM via JS addition — just ensure static ones are visible
  // Remove old custom panels first
  document.querySelectorAll('.story-panel-custom').forEach(el => el.remove());
  const strip = document.getElementById('storyStrip');
  const addBtn = strip?.querySelector('.story-panel-add');
  if (!strip || !addBtn) return;

  storyCustomPanels.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'story-panel story-panel-custom';
    el.innerHTML = `
      <div class="sp-number">${String(6 + i).padStart(2,'0')}</div>
      <div class="sp-visual">
        <div class="sp-bg sp-bg-custom"></div>
        <div class="sp-emoji">${p.emoji || '🌙'}</div>
      </div>
      <div class="sp-content">
        <p class="sp-label">${p.label}</p>
        <p class="sp-text">${p.text}</p>
      </div>
      <div class="sp-expand-hint">tap untuk baca selengkapnya</div>
      <button class="sp-del" onclick="event.stopPropagation();storyDelPanel(${i})">✕</button>`;
    el.onclick = () => storyExpand(el);
    strip.insertBefore(el, addBtn);
  });
}

window.storyExpand = el => {
  if (el.classList.contains('story-panel-add')) return;
  const num   = el.querySelector('.sp-number')?.textContent || '';
  const label = el.querySelector('.sp-label')?.textContent || '';
  const text  = el.querySelector('.sp-text')?.textContent || '';
  const emoji = el.querySelector('.sp-emoji')?.textContent || '✨';
  const bgClass = [...el.querySelector('.sp-bg')?.classList || []].find(c => c.startsWith('sp-bg-') && c !== 'sp-bg');

  document.getElementById('smNum').textContent   = num;
  document.getElementById('smLabel').textContent = label;
  document.getElementById('smText').textContent  = text;
  document.getElementById('smEmoji').textContent = emoji;
  const smBg = document.getElementById('smBg');
  smBg.className = 'sm-bg ' + (bgClass || 'sp-bg1');

  const ov = document.getElementById('storyOverlay');
  ov.classList.remove('hidden');
  burst(window.innerWidth/2, window.innerHeight/2, 12);
};

window.storyClose = () => document.getElementById('storyOverlay').classList.add('hidden');

window.storyAddPanel = () => {
  document.getElementById('storyAddForm').classList.remove('hidden');
  document.getElementById('safLabel').focus();
};

window.storySavePanel = () => {
  const label = document.getElementById('safLabel').value.trim();
  const emoji = document.getElementById('safEmoji').value.trim() || '🌙';
  const text  = document.getElementById('safText').value.trim();
  if (!label || !text) return;
  storyCustomPanels.push({ label, emoji, text });
  localStorage.setItem('story_panels', JSON.stringify(storyCustomPanels));
  document.getElementById('storyAddForm').classList.add('hidden');
  document.getElementById('safLabel').value = '';
  document.getElementById('safEmoji').value = '';
  document.getElementById('safText').value  = '';
  renderStory();
  burst(window.innerWidth/2, window.innerHeight/2, 16);
};

window.storyDelPanel = i => {
  storyCustomPanels.splice(i, 1);
  localStorage.setItem('story_panels', JSON.stringify(storyCustomPanels));
  renderStory();
};

// ════════════════════════════════════════════════════════════
// ★ SKIN / THEME PICKER
// ════════════════════════════════════════════════════════════
const THEMES = {
  gold:   { gold: '#c9a25e', goldi: '#e8c97a', line: 'rgba(201,162,94,.12)' },
  pink:   { gold: '#ff8fab', goldi: '#ffb3c6', line: 'rgba(255,143,171,.12)' },
  blue:   { gold: '#7eb8f7', goldi: '#a8d4ff', line: 'rgba(126,184,247,.12)' },
  sage:   { gold: '#90c9a0', goldi: '#b0e0b8', line: 'rgba(144,201,160,.12)' },
  purple: { gold: '#c084fc', goldi: '#d8a8ff', line: 'rgba(192,132,252,.12)' },
  peach:  { gold: '#ffb347', goldi: '#ffcc80', line: 'rgba(255,179,71,.12)'  },
};

let currentTheme = localStorage.getItem('theme') || 'gold';

// ── Toast helper ──
function showToast(msg) {
  let t = document.getElementById('toastEl');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toastEl';
    t.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
      background:rgba(15,14,22,.92);border:1px solid var(--gold);color:var(--goldi);
      font-family:var(--f-body);font-size:.78rem;letter-spacing:.06em;
      padding:.55rem 1.2rem;border-radius:50px;z-index:9000;
      backdrop-filter:blur(12px);pointer-events:none;
      transition:opacity .3s,transform .3s;opacity:0;transform:translateX(-50%) translateY(8px)`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(8px)'; }, 2200);
}
window.showToast = showToast;

function applyThemeOnLoad() {
  applyThemeColors(currentTheme);
  const active = document.querySelector(`.theme-swatch[data-theme="${currentTheme}"]`);
  if (active) {
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    active.classList.add('active');
  }
}

function applyThemeColors(name) {
  const t = THEMES[name]; if (!t) return;
  const root = document.documentElement;
  root.style.setProperty('--gold',  t.gold);
  root.style.setProperty('--goldi', t.goldi);
  root.style.setProperty('--line',  t.line);
}

window.applyTheme = (el, name) => {
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  applyThemeColors(name);
  currentTheme = name;
  localStorage.setItem('theme', name);
  burst(window.innerWidth/2, window.innerHeight/2, 20);
  showToast('Tema ' + name + ' aktif! 🎨');
};

window.openThemePicker  = () => document.getElementById('themeOverlay')?.classList.remove('hidden');
window.closeThemePicker = () => document.getElementById('themeOverlay')?.classList.add('hidden');

// Apply on load
document.addEventListener('DOMContentLoaded', applyThemeOnLoad);
