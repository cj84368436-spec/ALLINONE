export const STEP = 1 / 60;
export class FixedClock {
  constructor() { this.accumulator = 0; this.dropped = 0; }
  reset() { this.accumulator = 0; }
  advance(delta, step, active = () => true) {
    if (!active()) { this.reset(); return 0; }
    const elapsed = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    this.dropped += Math.max(0, elapsed - .15);
    this.accumulator += Math.min(elapsed, .15);
    let count = 0;
    while (this.accumulator + 1e-9 >= STEP && count < 9) {
      this.accumulator = Math.max(0, this.accumulator - STEP);
      step(STEP); count++;
      if (!active()) { this.reset(); break; }
    }
    return count;
  }
}
export class RenderBudget {
  constructor(mode = "auto") { this.mode = mode; this.scale = 1; this.slow = 0; this.fast = 0; this.targetFPS = mode === "battery" ? 30 : 60; }
  set(mode) { this.mode = ["auto", "smooth", "battery"].includes(mode) ? mode : "auto"; this.scale = this.mode === "battery" ? .65 : 1; this.targetFPS = this.mode === "battery" ? 30 : 60; this.slow = this.fast = 0; }
  observe(ms) {
    if (this.mode !== "auto" || !Number.isFinite(ms) || ms <= 0 || ms > 120) return false;
    if (ms > 24) { this.slow++; this.fast = 0; } else if (ms < 19) { this.fast++; this.slow = Math.max(0, this.slow - 1); }
    if (this.slow >= 45 && (this.scale > .65 || this.targetFPS > 30)) { this.scale = Math.max(.65, this.scale - .2); this.targetFPS = this.scale <= .65 ? 30 : 60; this.slow = this.fast = 0; return true; }
    if (this.fast >= 240 && this.scale < 1) { this.scale = Math.min(1, this.scale + .2); this.targetFPS = 60; this.slow = this.fast = 0; return true; }
    return false;
  }
}
export function joystick(pointerX, pointerY, originX, originY, radius = 43) {
  let dx = pointerX - originX, dy = pointerY - originY, distance = Math.hypot(dx, dy);
  if (distance > radius) { originX = pointerX - dx / distance * radius; originY = pointerY - dy / distance * radius; dx = pointerX - originX; dy = pointerY - originY; distance = radius; }
  const strength = distance < 4 ? 0 : Math.min(1, (distance - 4) / (radius - 4));
  return { originX, originY, x: distance ? dx / distance * strength : 0, y: distance ? dy / distance * strength : 0 };
}
