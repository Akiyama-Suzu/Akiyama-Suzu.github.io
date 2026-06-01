/* === 游戏主循环 & 状态管理 === */

// —— 全局常量 ——
const GROUND_Y = 360;  // 地面顶部 Y 坐标

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // 尺寸
    this._resize();

    // 子系统
    this.input  = new Input();
    this.audio  = new AudioManager();
    this.player = new Player();
    this.level  = new Level();
    this.particles = [];

    // 游戏状态
    this.state  = 'menu';   // menu | playing | paused | dead
    this.scrollX = 0;       // 世界滚动距离
    this.score  = 0;
    this.highScore = parseInt(localStorage.getItem('pkHighScore')) || 0;
    this.speed  = 4;        // 基础滚动速度 (px/帧)
    this.magnetTimer = 0;   // 磁铁剩余时间（帧）
    this.deathTimer = 0;    // 死亡后到可重开的延时

    // 屏幕震动
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeDur = 0;

    // 帧计时
    this.lastTime = 0;
    this.dt = 1.0;          // delta time (60fps 归一化)

    // 绑定
    this._loop = this._loop.bind(this);
  }

  // -------- 尺寸适配 --------

  _resize() {
    const W = 800, H = 450;
    this.canvas.width = W;
    this.canvas.height = H;

    // CSS 缩放以适应屏幕
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;
    const scale = Math.min(maxW / W, maxH / H, 1.0);
    this.canvas.style.width  = Math.floor(W * scale) + 'px';
    this.canvas.style.height = Math.floor(H * scale) + 'px';
  }

  // -------- 启动 --------

  async start() {
    // 生成默认精灵（兜底）
    generateSprites();
    // 尝试加载外部贴图（自动等比缩放）
    await loadExternalSprites();
    // 初始化背景音乐
    this.audio.initBGM();
    // 确保玩家初始站在地面上
    this.player.y = GROUND_Y - this.player.height;
    // 监听输入
    this.input.listen();
    // 窗口尺寸变化
    window.addEventListener('resize', () => this._resize());
    // 循环开始
    this.lastTime = performance.now();
    requestAnimationFrame(this._loop);
  }

  // ========== 主循环 ==========

  _loop(now) {
    const rawDt = (now - this.lastTime) / 16.667; // 60fps 归一化
    this.dt = Math.min(rawDt, 3);                 // 防止切后台造成大跳帧
    this.lastTime = now;

    this._update();
    this._render();
    this.input.endFrame();

    requestAnimationFrame(this._loop);
  }

  // ========== 更新逻辑 ==========

  _update() {
    const dt = this.dt;

    switch (this.state) {
      case 'menu':
        // 按跳跃键开始
        if (this.input.jumpPressed()) {
          // 初始化 AudioContext（需要用户手势）
          this.audio._ensure();
          this._startGame();
        }
        break;

      case 'playing':
        this._updatePlaying(dt);
        break;

      case 'paused':
        if (this.input.pausePressed()) {
          this.state = 'playing';
          this.audio.bgm?.play().catch(() => {});
          this.lastTime = performance.now(); // 防止 dt 跳帧
        }
        break;

      case 'dead':
        this.player.update(dt, this);
        this._updateParticles(dt);
        this._updateShake(dt);
        this.deathTimer -= dt;
        // 延迟 1 秒后可重开
        if (this.deathTimer <= 0 && this.input.jumpPressed()) {
          this._restart();
        }
        break;
    }
  }

  _updatePlaying(dt) {
    // 暂停
    if (this.input.pausePressed()) {
      this.state = 'paused';
      this.audio.pauseBGM();
      return;
    }

    // 速度递增（缓慢提升，上限 10）
    this.speed = Math.min(4 + this.scrollX / 3000, 10);
    this.scrollX += this.speed * dt;

    // 距离分数
    this.score = Math.floor(this.scrollX / 10);

    // 玩家
    this.player.update(dt, this);

    // 关卡生成
    this.level.update(this);

    // 磁铁效果
    if (this.magnetTimer > 0) {
      this.magnetTimer -= dt;
      this._applyMagnet(dt);
    }

    // 碰撞检测
    this._checkCollisions();

    // 粒子
    this._updateParticles(dt);

    // 震动衰减
    this._updateShake(dt);
  }

  // -------- 磁铁效果 --------

  _applyMagnet(dt) {
    const pWorldX = this.scrollX;
    const pY = this.player.y + this.player.height / 2;
    for (const item of this.level.items) {
      if (item.type !== 'coin' || item.collected) continue;
      const dx = item.worldX - pWorldX;
      const dy = item.worldY - pY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180 && dist > 3) {
        const pullSpeed = 12 * dt;
        item.worldX -= (dx / dist) * pullSpeed;
        item.worldY -= (dy / dist) * pullSpeed;
        item.baseY = item.worldY; // 更新浮动基准
      }
    }
  }

  // -------- 碰撞检测 --------

  _checkCollisions() {
    const pBox = this.player.getCollisionBox();
    if (!pBox) return;

    // 1. 障碍物碰撞
    for (const obs of this.level.obstacles) {
      const oBox = obs.getCollisionBox(this.scrollX);
      if (this._aabb(pBox, oBox)) {
        if (this.player.shielded) {
          // 护盾挡一次
          this.player.shieldBreak(this);
          // 移除这个障碍物防止二次碰撞
          obs.worldX = -9999;
          return;
        } else {
          this.player.die(this);
          return;
        }
      }
    }

    // 2. 道具收集
    for (const item of this.level.items) {
      if (item.collected) continue;
      const iBox = item.getCollisionBox(this.scrollX);
      if (this._aabb(pBox, iBox)) {
        item.collect(this);
      }
    }

    // 3. 坑洞坠落检测（玩家在地面以下且处于坑洞区域）
    if (this.player.onGround) {
      const pWorldX = this.scrollX; // 玩家屏幕 x=150 → 世界 x=scrollX
      if (this.level.isInPit(pWorldX)) {
        // 玩家站在坑洞上 → 坠落
        this.player.onGround = false;
        this.player.vy = 2;
      }
    }
  }

  /** AABB 碰撞 */
  _aabb(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  // -------- 粒子更新 --------

  _updateParticles(dt) {
    this.particles = this.particles.filter(p => !p.update(dt));
  }

  // -------- 震动 --------

  triggerShake(intensity, duration) {
    this.shakeDur = Math.max(this.shakeDur, duration);
    this.shakeX = intensity;
    this.shakeY = intensity;
  }

  _updateShake(dt) {
    if (this.shakeDur > 0) {
      this.shakeDur -= dt;
      if (this.shakeDur <= 0) {
        this.shakeX = 0;
        this.shakeY = 0;
      }
    }
  }

  // -------- 状态流转 --------

  _startGame() {
    this.state = 'playing';
    this.scrollX = 0;
    this.score = 0;
    this.speed = 4;
    this.magnetTimer = 0;
    this.deathTimer = 0;
    this.particles = [];
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeDur = 0;
    this.player.reset();
    this.level.reset();
    this.lastTime = performance.now();
    // 播放背景音乐
    this.audio.playBGM();
  }

  onPlayerDeath() {
    this.state = 'dead';
    this.deathTimer = 60; // 1 秒后允许重开
    this.triggerShake(8, 18);
    this.audio.stopBGM();
    // 更新最高分
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('pkHighScore', this.highScore);
    }
  }

  _restart() {
    this._startGame();
  }

  // ========== 渲染 ==========

  _render() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // 震动偏移
    let ox = 0, oy = 0;
    if (this.shakeDur > 0) {
      ox = (Math.random() - 0.5) * this.shakeX * 2;
      oy = (Math.random() - 0.5) * this.shakeY * 2;
    }

    ctx.save();
    ctx.translate(ox, oy);

    // 1. 天空
    this._drawSky(ctx, W, H);

    // 2. 远山（视差 0.2）
    this._drawParallax(ctx, 'bgMountain', 0.2, W, 200);

    // 3. 近丘（视差 0.5）
    this._drawParallax(ctx, 'bgHill', 0.5, W, 260);

    // 4. 地面
    this.level.drawGround(ctx, this.scrollX, W);

    // 5. 道具
    for (const item of this.level.items) {
      item.draw(ctx, this.scrollX);
    }

    // 6. 障碍物
    for (const obs of this.level.obstacles) {
      obs.draw(ctx, this.scrollX);
    }

    // 7. 粒子
    for (const p of this.particles) {
      p.draw(ctx, this.scrollX);
    }

    // 8. 玩家
    this.player.draw(ctx, this.scrollX);

    ctx.restore();

    // 9. UI（不受震动影响）
    switch (this.state) {
      case 'menu':
        UI.drawMenu(ctx, W, H);
        break;
      case 'playing':
        UI.drawHUD(ctx, W, this);
        break;
      case 'paused':
        UI.drawHUD(ctx, W, this);
        UI.drawPause(ctx, W, H);
        break;
      case 'dead':
        UI.drawGameOver(ctx, W, H, this);
        break;
    }
  }

  // -------- 天空 --------

  _drawSky(ctx, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    grad.addColorStop(0, '#4A90D9');
    grad.addColorStop(0.5, '#87CEEB');
    grad.addColorStop(1, '#B0D4F1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, GROUND_Y);

    // 简单云朵
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const clouds = [
      { x: 100, y: 40, s: 1.0 },
      { x: 350, y: 70, s: 0.7 },
      { x: 600, y: 30, s: 1.2 },
      { x: 750, y: 90, s: 0.5 },
    ];
    for (const c of clouds) {
      const rawX = c.x - this.scrollX * 0.05;
      const cx  = ((rawX % (W + 200)) + (W + 200)) % (W + 200) - 100;
      this._drawCloud(ctx, cx, c.y, c.s);
    }
  }

  _drawCloud(ctx, x, y, s) {
    const r = 16 * s;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 1.2, y - r * 0.3, r * 0.8, 0, Math.PI * 2);
    ctx.arc(x + r * 1.8, y, r * 0.7, 0, Math.PI * 2);
    ctx.arc(x - r * 0.5, y + r * 0.2, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // -------- 视差背景 --------

  _drawParallax(ctx, spriteKey, factor, W, baseY) {
    const img = SPRITES[spriteKey];
    if (!img) return;
    const offset = -(this.scrollX * factor) % img.width;
    for (let x = offset - img.width; x < W + img.width; x += img.width) {
      ctx.drawImage(img, Math.floor(x), baseY - img.height);
    }
  }
}
