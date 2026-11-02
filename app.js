/* ============================================================
   Desecrated Dimensions — rebuilt player
   Continuous album playback · live EQ · synced highlighted lyrics
   ============================================================ */

const TRACKS = [
  { title: "Curb Stomp Your Local Pedo", src: "music/curb_stomp_your_local_pedo.mp3", art: "images/tracks/track-01.webp" },
  { title: "Vivisection", src: "music/vivisection.mp3", art: "images/tracks/track-02.webp" },
  { title: "Global Hate", src: "music/global_hate.mp3", art: "images/tracks/track-03.webp" },
  { title: "Tat2Face", src: "music/TAT2FACE_1.mp3", art: "images/tracks/track-04.webp" },
  { title: "Plagueborn", src: "music/plagueborn.mp3", art: "images/tracks/track-05.webp" },
  { title: "Back Stabber", src: "music/back_stabber.mp3", art: "images/tracks/track-06.webp" },
  { title: "Level 5 Slasher", src: "music/level_5_slasher.mp3", art: "images/tracks/track-07.webp" },
  { title: "Skull Collector", src: "music/skull_collector.mp3", art: "images/tracks/track-08.webp" },
  { title: "Ghost Operator", src: "music/ghost_operator.mp3", art: "images/tracks/track-09.webp" },
  { title: "Cold Dead Hands", src: "music/cold_dead_hands.mp3", art: "images/tracks/track-10.webp" },
  { title: "Dogs Love Rats", src: "music/dogs_love_rats.mp3", art: "images/tracks/track-11.webp" },
  { title: "Hung On The Hook", src: "music/Hung_on_the_hook.mp3", art: "images/tracks/track-12.webp" },
  { title: "Trench Rot", src: "music/trench_rot.mp3", art: "images/tracks/track-13.webp" },
];

const LYR = typeof LYRICS !== "undefined" ? LYRICS : window.LYRICS || {};
const censorText =
  typeof window.censorLyrics === "function"
    ? window.censorLyrics
    : typeof censor === "function"
      ? censor
      : (s) => String(s || "");

const $ = (id) => document.getElementById(id);
const audio = $("audio");
const playBtn = $("playBtn"), prevBtn = $("prevBtn"), nextBtn = $("nextBtn");
const shuffleBtn = $("shuffleBtn"), repeatBtn = $("repeatBtn");
const seek = $("seek"), volume = $("volume");
const curTime = $("curTime"), durTime = $("durTime");
const nowTitle = $("nowTitle"), playerArt = $("playerArt");
const statusLed = $("statusLed"), statusText = $("statusText");
const tracklistEl = $("tracklist");
const lyTitle = $("lyTitle"), lyLines = $("lyLines"), lyScroll = $("lyScroll");

let index = -1;            // loaded track (-1 = none)
let lyricIndex = -1;       // track whose lyrics are shown
let shuffle = false;
let repeatMode = 0;        // 0 off, 1 all, 2 one
let seeking = false;
let TIMINGS = null;        // { title: { duration, lines: [{t, text, section}] } }
let activeLine = -1;
let lastManualScroll = 0;
let lastProgrammaticScroll = 0;
let syncTimer = null;

const fmt = (s) => {
  if (!isFinite(s) || s == null) return "0:00";
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

/* ---------- timings (with fallback) ---------- */
function fallbackTimings(title, duration) {
  const raw = String(LYR[title] || "");
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => ({ text: l, section: /^\[.*\]$/.test(l), t: 0 }));
  const sung = lines.filter((l) => !l.section);
  sung.forEach((l, i) => {
    l.t = duration ? 1 + (i / Math.max(1, sung.length)) * (duration - 3) : i * 4;
  });
  let si = 0;
  lines.forEach((l) => {
    if (!l.section) l.t = sung[si++].t;
    else if (si < sung.length) l.t = sung[si].t;
  });
  return { duration: duration || 0, lines };
}
function timingsFor(i) {
  const tr = TRACKS[i];
  if (TIMINGS && TIMINGS[tr.title]) return TIMINGS[tr.title];
  return fallbackTimings(tr.title, audio.duration);
}

/* ---------- track list ---------- */
function buildTracklist() {
  tracklistEl.innerHTML = "";
  TRACKS.forEach((tr, i) => {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.i = i;
    const dur =
      TIMINGS && TIMINGS[tr.title] ? fmt(TIMINGS[tr.title].duration) : "—";
    li.innerHTML =
      '<img class="track-art" src="' + tr.art + '" alt="" loading="lazy" />' +
      '<span class="track-num">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<span class="track-name">' + tr.title + "</span>" +
      '<span class="mini-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="track-dur">' + dur + "</span>" +
      '<button class="lyr-btn" type="button">LYRICS</button>';
    li.addEventListener("click", () => load(i, true));
    li.querySelector(".lyr-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      showLyrics(i);
      document.getElementById("lyrics").scrollIntoView({ behavior: "smooth" });
    });
    tracklistEl.appendChild(li);
  });
}
function markRows() {
  tracklistEl.querySelectorAll(".track").forEach((el) => {
    const i = +el.dataset.i;
    el.classList.toggle("active", i === index);
    el.classList.toggle("playing", i === index && !audio.paused);
  });
}

/* ---------- lyrics panel ---------- */
function showLyrics(i) {
  lyricIndex = i;
  activeLine = -1;
  const tr = TRACKS[i];
  lyTitle.textContent = tr.title;
  const data = timingsFor(i);
  lyLines.innerHTML = "";
  data.lines.forEach((ln, li) => {
    const p = document.createElement("p");
    p.className = ln.section ? "ly-section" : "ly-line";
    p.textContent = censorText(ln.text);
    p.dataset.t = ln.t;
    p.dataset.li = li;
    p.addEventListener("click", () => {
      if (index !== i) load(i, true);
      const go = () => { audio.currentTime = ln.t + 0.01; syncLyrics(true); };
      if (audio.readyState >= 1) go();
      else audio.addEventListener("loadedmetadata", go, { once: true });
    });
    lyLines.appendChild(p);
  });
  lyScroll.scrollTop = 0;
  syncLyrics(true);
}
lyScroll.addEventListener("scroll", () => {
  if (Date.now() - lastProgrammaticScroll > 700) lastManualScroll = Date.now();
});
function centerLine(el) {
  const r = el.getBoundingClientRect();
  const sr = lyScroll.getBoundingClientRect();
  const top = lyScroll.scrollTop + (r.top - sr.top) - lyScroll.clientHeight / 2 + r.height / 2;
  lastProgrammaticScroll = Date.now();
  lyScroll.scrollTo({ top, behavior: "smooth" });
}
function syncLyrics(force) {
  if (lyricIndex < 0 || lyricIndex !== index) return;
  const data = timingsFor(lyricIndex);
  if (!data || !data.lines.length) return;
  const t = audio.currentTime;
  let cur = -1;
  for (let i = 0; i < data.lines.length; i++) {
    if (data.lines[i].t <= t) cur = i;
    else break;
  }
  if (cur === activeLine && !force) return;
  activeLine = cur;
  const kids = lyLines.children;
  for (let i = 0; i < kids.length; i++) {
    kids[i].classList.toggle("active", i === cur);
    kids[i].classList.toggle("past", i < cur);
  }
  if (cur >= 0 && kids[cur] && Date.now() - lastManualScroll > 4000) {
    centerLine(kids[cur]);
  }
}

/* ---------- player core ---------- */
function setStatus(txt, on) {
  statusText.textContent = txt;
  statusLed.classList.toggle("on", !!on);
}
function load(i, autoplay) {
  index = i;
  const tr = TRACKS[i];
  audio.src = tr.src;
  nowTitle.textContent = tr.title;
  playerArt.src = tr.art;
  if (lyricIndex !== i) showLyrics(i);
  activeLine = -1;
  markRows();
  updateMediaSession();
  if (autoplay) play();
  else setStatus("LOADED", false);
}
function play() {
  if (index < 0) { load(0, true); return; }
  initEQ();
  audio.play().catch(() => {});
}
function pause() { audio.pause(); }
function next(auto) {
  if (index < 0) { load(0, true); return; }
  if (auto && repeatMode === 2) { audio.currentTime = 0; play(); return; }
  let n;
  if (shuffle) {
    do { n = Math.floor(Math.random() * TRACKS.length); } while (n === index && TRACKS.length > 1);
  } else {
    n = index + 1;
    if (n >= TRACKS.length) {
      if (auto && repeatMode === 0) { setStatus("ALBUM DONE", false); return; }
      n = 0;
    }
  }
  load(n, true);
}
function prev() {
  if (index < 0) { load(0, true); return; }
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  load((index - 1 + TRACKS.length) % TRACKS.length, true);
}

playBtn.addEventListener("click", () => (audio.paused ? play() : pause()));
nextBtn.addEventListener("click", () => next(false));
prevBtn.addEventListener("click", prev);
shuffleBtn.addEventListener("click", () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("on", shuffle);
});
repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.classList.toggle("on", repeatMode > 0);
  repeatBtn.textContent = repeatMode === 2 ? "↻₁" : "↻";
  repeatBtn.title = "Repeat: " + ["off", "all", "one"][repeatMode];
});
$("playAlbumBtn").addEventListener("click", () => load(0, true));

audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
  setStatus("PLAYING", true);
  markRows();
  if (!syncTimer) syncTimer = setInterval(() => syncLyrics(false), 250);
});
audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  setStatus(index >= 0 ? "PAUSED" : "STANDBY", false);
  markRows();
});
audio.addEventListener("ended", () => next(true));
audio.addEventListener("loadedmetadata", () => {
  durTime.textContent = fmt(audio.duration);
  if (lyricIndex === index) showLyrics(index);
});
audio.addEventListener("timeupdate", () => {
  if (!seeking && isFinite(audio.duration) && audio.duration > 0) {
    const pct = (audio.currentTime / audio.duration) * 1000;
    seek.value = pct;
    seek.style.setProperty("--fill", (pct / 10) + "%");
  }
  curTime.textContent = fmt(audio.currentTime);
});
seek.addEventListener("input", () => {
  seeking = true;
  if (isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (seek.value / 1000) * audio.duration;
    seek.style.setProperty("--fill", (seek.value / 10) + "%");
    syncLyrics(true);
  }
});
seek.addEventListener("change", () => { seeking = false; });
volume.addEventListener("input", () => {
  audio.volume = +volume.value;
  volume.style.setProperty("--fill", volume.value * 100 + "%");
});
audio.volume = 0.8;
volume.style.setProperty("--fill", "80%");

/* ---------- media session ---------- */
function updateMediaSession() {
  if (!("mediaSession" in navigator) || index < 0) return;
  const tr = TRACKS[index];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: tr.title,
    artist: "Tat2Face",
    album: "Desecrated Dimensions",
    artwork: [{ src: tr.art, sizes: "1024x1024", type: "image/webp" }],
  });
  navigator.mediaSession.setActionHandler("previoustrack", prev);
  navigator.mediaSession.setActionHandler("nexttrack", () => next(false));
}

/* ---------- live EQ (Web Audio analyser) ---------- */
let actx = null, analyser = null, eqData = null, eqReady = false;
const peaks = [], levels = [];
function initEQ() {
  if (eqReady) { if (actx && actx.state === "suspended") actx.resume(); return; }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    const srcNode = actx.createMediaElementSource(audio);
    analyser = actx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;
    srcNode.connect(analyser);
    analyser.connect(actx.destination);
    eqData = new Uint8Array(analyser.frequencyBinCount);
    eqReady = true;
    requestAnimationFrame(drawEQ);
  } catch (e) { /* EQ unavailable — playback continues unaffected */ }
}
function drawEQ() {
  requestAnimationFrame(drawEQ);
  const cv = $("eq");
  const dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth * dpr, H = cv.clientHeight * dpr;
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const ctx = cv.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  /* grid */
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let g = 1; g < 4; g++) {
    ctx.beginPath(); ctx.moveTo(0, (H / 4) * g); ctx.lineTo(W, (H / 4) * g); ctx.stroke();
  }
  const BARS = 52;
  if (analyser && eqData) analyser.getByteFrequencyData(eqData);
  const bw = W / BARS;
  for (let b = 0; b < BARS; b++) {
    let v = 0;
    if (analyser && eqData && !audio.paused) {
      const bin = 2 + Math.floor(Math.pow(b / BARS, 1.6) * 90);
      v = eqData[Math.min(bin, eqData.length - 1)] / 255;
    }
    levels[b] = Math.max(v, (levels[b] || 0) * 0.9);
    peaks[b] = Math.max(levels[b], (peaks[b] || 0) - 0.004);
    const h = Math.max(2 * dpr, levels[b] * (H - 8 * dpr));
    const x = b * bw + bw * 0.18, w = bw * 0.64;
    const grad = ctx.createLinearGradient(0, H, 0, 0);
    grad.addColorStop(0, "#7d0d03");
    grad.addColorStop(0.55, "#e81d0c");
    grad.addColorStop(1, "#ff7a4d");
    ctx.fillStyle = grad;
    ctx.shadowColor = "rgba(255,34,19,0.65)";
    ctx.shadowBlur = 7 * dpr;
    ctx.fillRect(x, H - h, w, h);
    ctx.shadowBlur = 0;
    /* peak cap */
    const py = H - Math.max(2 * dpr, peaks[b] * (H - 8 * dpr)) - 3 * dpr;
    ctx.fillStyle = "#f2e8d5";
    ctx.fillRect(x, Math.max(0, py), w, 2 * dpr);
  }
}

/* ---------- boot ---------- */
$("year").textContent = new Date().getFullYear();
buildTracklist();
fetch("timings.json")
  .then((r) => (r.ok ? r.json() : null))
  .then((j) => { if (j) { TIMINGS = j; buildTracklist(); } })
  .catch(() => {});
const splash = $("splash");
const hideSplash = () => splash.classList.add("gone");
splash.addEventListener("click", hideSplash);
window.addEventListener("load", () => setTimeout(hideSplash, 1500));
setTimeout(hideSplash, 4000);
