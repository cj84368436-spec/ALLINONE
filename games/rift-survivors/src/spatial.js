// Reuse buckets and query buffers: bullets inspect only nearby enemy centers.
export class EnemyGrid {
  constructor(size = 96) { this.size = size; this.cells = new Map(); this.active = []; }
  rebuild(enemies) {
    for (const bucket of this.active) bucket.length = 0;
    this.active.length = 0;
    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      const key = Math.floor(enemy.x / this.size) * 65536 + Math.floor(enemy.y / this.size);
      let bucket = this.cells.get(key);
      if (!bucket) { bucket = []; this.cells.set(key, bucket); }
      if (!bucket.length) this.active.push(bucket);
      bucket.push(enemy);
    }
  }
  move(enemy, oldX, oldY) {
    const oldKey = Math.floor(oldX / this.size) * 65536 + Math.floor(oldY / this.size);
    const key = Math.floor(enemy.x / this.size) * 65536 + Math.floor(enemy.y / this.size);
    if (key === oldKey) return;
    const oldBucket = this.cells.get(oldKey);
    const index = oldBucket?.indexOf(enemy) ?? -1;
    if (index < 0) return;
    oldBucket.splice(index, 1);
    let bucket = this.cells.get(key);
    if (!bucket) { bucket = []; this.cells.set(key, bucket); }
    if (!this.active.includes(bucket)) this.active.push(bucket);
    bucket.push(enemy);
  }
  query(minX, minY, maxX, maxY, out = []) {
    out.length = 0;
    for (let x = Math.floor(minX / this.size); x <= Math.floor(maxX / this.size); x++)
      for (let y = Math.floor(minY / this.size); y <= Math.floor(maxY / this.size); y++) {
        const bucket = this.cells.get(x * 65536 + y);
        if (bucket) for (const enemy of bucket) out.push(enemy);
      }
    return out;
  }
}
