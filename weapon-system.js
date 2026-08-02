"use strict";
(() => {
  const specs = {
    water:  { ammo: 42, interval: .18, label: "💧 Water",  color: "#7ee8ff" },
    bullet: { ammo: 30, interval: .11, label: "🔫 Bullets", color: "#ffd36b" },
    rocket: { ammo: 8,  interval: .62, label: "🚀 Rockets", color: "#ff8a42" }
  };
  let queue = [], active = null, fireTimer = 0;
  let shots = [], rockets = [];

  function enqueue(type) {
    const spec = specs[type];
    if (!spec) return;
    queue.push({ type, ammo: spec.ammo, interval: spec.interval });
    if (!active) activateNext();
    toast(`${spec.label} queued`);
  }
  function activateNext() {
    active = queue.shift() || null;
    fireTimer = 0;
    if (player) player.blaster = active ? 999 : 0;
    if (active) toast(`${specs[active.type].label} ready`);
  }
  function consume() {
    if (!active) return;
    active.ammo--;
    if (active.ammo <= 0) activateNext();
  }
  function resetWeapons() {
    queue = []; active = null; fireTimer = 0; shots = []; rockets = [];
  }
  function touches(a, b, extra = 0) {
    const dx = a.x - b.x, dy = a.y - b.y, r = a.r + b.r + extra;
    return dx * dx + dy * dy <= r * r;
  }
  function collectStar(index) {
    const s = stars[index]; if (!s) return;
    stars.splice(index, 1); runCoins++; score += 5 * mult * (player.frenzy > 0 ? 2 : 1);
    combo++; mult = 1 + Math.min(4, Math.floor(combo / 5));
    burst(s.x, s.y, "#fff4a3", 8); beep(790, .035);
  }
  function collectPower(index) {
    const p = powers[index]; if (!p) return;
    powers.splice(index, 1);
    p.x = player.x; p.y = player.y;
    powers.push(p);
  }
  function fire() {
    if (!active) return;
    if (active.type === "water") {
      shots.push({ type: "water", x: player.x + 20, y: player.y, vx: 590, r: 6, life: 1.7 });
      burst(player.x + 18, player.y, "#9ffcff", 4); beep(680, .025, "square");
    } else if (active.type === "bullet") {
      shots.push({ type: "bullet", x: player.x + 21, y: player.y, vx: 840, r: 4, life: 1.45 });
      burst(player.x + 18, player.y, "#ffd36b", 3); beep(980, .022, "square");
    } else {
      rockets.push({ x: player.x + 20, y: player.y, vx: 480, r: 15, life: 2.5 });
      beep(170, .14, "sawtooth");
    }
    consume();
  }
  function interceptWeaponPickups() {
    for (let i = powers.length - 1; i >= 0; i--) {
      const p = powers[i];
      if (Math.hypot(player.x - p.x, player.y - p.y) >= player.r + p.r + 5) continue;
      let type = null;
      if (p.type === "blaster") type = "water";
      else if (p.type === "bulletGun") type = "bullet";
      else if (p.type === "rocketGun" || p.type === "rocket") type = "rocket";
      if (type) { powers.splice(i, 1); enqueue(type); }
    }
  }
  function updateWeapons(dt) {
    if (!active && queue.length) activateNext();
    if (active) {
      fireTimer -= dt;
      if (fireTimer <= 0) { const interval = active.interval; fire(); fireTimer = interval; }
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i]; s.x += s.vx * dt; s.life -= dt; let used = false;
      for (let j = hazards.length - 1; j >= 0; j--) {
        const h = hazards[j], rx = Math.max(h.x, Math.min(s.x, h.x + h.w)), ry = Math.max(h.y - h.h, Math.min(s.y, h.y));
        if ((s.x - rx) ** 2 + (s.y - ry) ** 2 <= s.r ** 2) { destroyHazard(j, s.type === "bullet" ? 12 : 9); used = true; break; }
      }
      if (!used) for (let j = stars.length - 1; j >= 0; j--) if (touches(s, stars[j], s.type === "water" ? 4 : 1)) { collectStar(j); used = true; break; }
      if (!used) for (let j = powers.length - 1; j >= 0; j--) if (touches(s, powers[j], s.type === "water" ? 5 : 2)) { collectPower(j); used = true; break; }
      if (used || s.life <= 0 || s.x > W + 40) shots.splice(i, 1);
    }
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]; r.x += r.vx * dt; r.life -= dt;
      for (let j = hazards.length - 1; j >= 0; j--) {
        const h = hazards[j];
        if (r.x + r.r > h.x && r.x - r.r < h.x + h.w && r.y + r.r > h.y - h.h && r.y - r.r < h.y) destroyHazard(j, 15);
      }
      for (let j = stars.length - 1; j >= 0; j--) if (touches(r, stars[j], 20)) collectStar(j);
      for (let j = powers.length - 1; j >= 0; j--) if (touches(r, powers[j], 22)) collectPower(j);
      if (r.life <= 0 || r.x > W + 70) rockets.splice(i, 1);
    }
  }
  function drawWeapons() {
    shots.forEach(s => {
      if (s.type === "bullet") {
        ctx.fillStyle = "#ffd36b"; ctx.fillRect(s.x - 8, s.y - 2, 16, 4);
        ctx.fillStyle = "#fff3bd"; ctx.fillRect(s.x + 5, s.y - 1, 5, 2);
      } else {
        ctx.fillStyle = "#7ee8ff"; ctx.shadowColor = "#53e7ff"; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
    });
    rockets.forEach(r => {
      ctx.fillStyle = "#d9dde8"; ctx.beginPath(); ctx.moveTo(r.x + 16, r.y); ctx.lineTo(r.x - 10, r.y - 8); ctx.lineTo(r.x - 10, r.y + 8); ctx.fill();
      ctx.fillStyle = "#ff5a36"; ctx.fillRect(r.x - 18, r.y - 4, 10, 8);
      ctx.fillStyle = "#ffd36b"; ctx.fillRect(r.x - 23, r.y - 2, 7, 4);
    });
  }
  function updateWeaponHud() {
    const el = $("blasterPower");
    if (!el) return;
    el.style.display = active || queue.length ? "block" : "none";
    if (active || queue.length) {
      const current = active ? `${specs[active.type].label} ${active.ammo}` : "";
      const waiting = queue.length ? ` → ${queue.map(w => specs[w.type].label).join(" → ")}` : "";
      el.textContent = current + waiting;
    }
  }

  const originalResetRun = resetRun;
  resetRun = function(...args) { resetWeapons(); return originalResetRun(...args); };

  const originalSpawnPower = spawnPower;
  spawnPower = function() {
    const r = Math.random();
    if (r < .11) powers.push({ type: "bulletGun", x: W + 30, y: Math.max(groundY() - 220, H * .48) + Math.random() * 120, r: 12 });
    else if (r < .19) powers.push({ type: "rocketGun", x: W + 30, y: Math.max(groundY() - 220, H * .48) + Math.random() * 120, r: 12 });
    else originalSpawnPower();
  };

  openMysteryCrate = function() {
    const r = Math.random();
    if (r < .15) { if (lives < maxLives) lives++; else guardian = Math.min(3, guardian + 1); toast("Crate: extra life"); }
    else if (r < .35) { runCoins += 20; score += 40; toast("Crate: +20 stars"); }
    else if (r < .52) { player.shield = Math.max(player.shield, 10); toast("Crate: shield"); }
    else if (r < .70) enqueue("water");
    else if (r < .86) enqueue("bullet");
    else enqueue("rocket");
    beep(900, .14, "triangle");
  };

  const originalUpdate = update;
  update = function(dt) {
    if (["running", "tutorial"].includes(state)) interceptWeaponPickups();
    originalUpdate(dt);
    if (["running", "tutorial"].includes(state)) updateWeapons(dt);
    updateWeaponHud();
  };

  const originalDraw = draw;
  draw = function() { originalDraw(); drawWeapons(); };
})();
