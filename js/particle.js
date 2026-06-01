/* === 粒子系统 === */

/** 单个粒子 */
class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size || 3;
  }

  /** @returns {boolean} 是否已死亡 */
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 0.3 * dt; // 重力
    this.life -= dt;
    return this.life <= 0;
  }

  draw(ctx, camX) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      Math.floor(this.x - camX + 150),
      Math.floor(this.y),
      this.size, this.size
    );
    ctx.globalAlpha = 1;
  }
}

/** 粒子特效工厂 */
const FX = {
  /** 跳跃扬尘 */
  jumpDust(particles, px, py) {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(
        px + 5 + Math.random() * 30,
        py + 50,
        (Math.random() - 0.5) * 2,
        -1 - Math.random() * 2,
        15 + Math.random() * 10,
        '#C8B89A',
        2 + Math.random() * 2
      ));
    }
  },

  /** 滑铲火花 */
  slideSparks(particles, px, py) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(
        px + Math.random() * 20,
        py + 28,
        -1 - Math.random() * 3,
        -2 - Math.random() * 3,
        10 + Math.random() * 6,
        '#FFD700',
        2
      ));
    }
  },

  /** 金币收集 */
  coinCollect(particles, x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 2,
        20 + Math.random() * 10,
        '#FFD700',
        2 + Math.random() * 2
      ));
    }
  },

  /** 道具拾取 */
  powerUpCollect(particles, x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 3,
        25 + Math.random() * 15,
        color,
        2 + Math.random() * 3
      ));
    }
  },

  /** 死亡爆炸 */
  deathExplosion(particles, x, y) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      const colors = ['#D94040', '#FF6666', '#FFD700', '#FFA500', '#FFFFFF'];
      particles.push(new Particle(
        x + 20, y + 28,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 4,
        30 + Math.random() * 20,
        colors[Math.floor(Math.random() * colors.length)],
        2 + Math.random() * 3
      ));
    }
  },

  /** 护盾破碎 */
  shieldBreak(particles, x, y) {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push(new Particle(
        x + 20, y + 28,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        18 + Math.random() * 12,
        '#4488FF',
        2 + Math.random() * 2
      ));
    }
  },
};
