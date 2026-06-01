/* === 玩家角色 === */

// 物理常量
const GRAVITY        = 0.55;   // 重力加速度 (px/frame²)
const JUMP_VELOCITY  = -10.5;  // 跳跃初速度
const MAX_JUMPS      = 2;      // 最大跳跃次数（支持二段跳）
const SLIDE_HEIGHT   = 30;     // 滑铲时碰撞箱高度

class Player {
  constructor() {
    // 屏幕坐标（x 固定，y 变化）
    this.screenX = 150;
    this.y = 0;          // 将在 reset() 中设置
    this.vy = 0;         // 垂直速度
    this.width  = 40;
    this.height = 56;

    // 状态
    this.onGround = false;
    this.sliding = false;
    this.dead    = false;
    this.shielded = false;
    this.jumpCount = 0;

    // 贴图引用（在 generateSprites 后赋值）
    this.sprite = null;

    // 护盾闪烁
    this.shieldBlink = 0;

    this.reset();
  }

  reset() {
    // y 座标：站在地面上
    this.y = GROUND_Y - this.height;  // GROUND_Y 在 game.js 中定义
    this.vy = 0;
    this.onGround = true;
    this.sliding = false;
    this.dead = false;
    this.shielded = false;
    this.jumpCount = 0;
    this.shieldBlink = 0;
  }

  /** 碰撞箱 — 随状态动态变化 */
  getCollisionBox() {
    if (this.dead) return null; // 死亡后不参与碰撞

    let w = 28;  // 碰撞箱略窄于贴图，增加手感
    let h = this.height;
    let x = this.screenX + (this.width - w) / 2;
    let y = this.y;

    if (this.sliding) {
      h = SLIDE_HEIGHT;
      y = this.y + this.height - SLIDE_HEIGHT;
    }

    return { x, y, w, h };
  }

  /** 跳跃 */
  jump() {
    if (this.jumpCount < MAX_JUMPS) {
      this.vy = JUMP_VELOCITY;
      this.jumpCount++;
      this.onGround = false;
      this.sliding = false;
      return true;
    }
    return false;
  }

  update(dt, game) {
    if (this.dead) {
      // 死亡后物理（弹起→掉落）
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      this.shieldBlink -= dt;
      return;
    }

    const input = game.input;

    // --- 输入 ---
    // 下蹲/滑铲
    this.sliding = this.onGround && input.slideHeld();

    // 跳跃
    if (input.jumpPressed()) {
      if (this.jump(this)) {
        if (this.jumpCount === 1) {
          game.audio.jump();
          FX.jumpDust(game.particles, this.screenX, this.y);
        } else {
          game.audio.doubleJump();
          FX.jumpDust(game.particles, this.screenX, this.y);
        }
      }
    }

    // 空中快速下落（按下方向键时重力加倍）
    if (!this.onGround && input.slideHeld()) {
      this.vy += GRAVITY * 0.8 * dt;
    }

    // --- 物理 ---
    this.vy += GRAVITY * dt;
    this.y += this.vy * dt;

    // 检测地面碰撞
    const groundY = GROUND_Y - this.height;
    if (this.y >= groundY) {
      // 检查是否在坑洞区域
      const inPit = game.level ? game.level.isInPit(this.screenX, game.scrollX) : false;
      if (!inPit || this.sliding) {
        this.y = groundY;
        this.vy = 0;
        this.onGround = true;
        this.jumpCount = 0;
      }
    }

    // 掉出屏幕底部 = 死亡
    if (this.y > game.canvas.height + 100) {
      this.die(game);
    }

    // 护盾闪烁计时器
    if (this.shielded) {
      this.shieldBlink += dt;
    }
  }

  die(game) {
    if (this.dead) return;
    this.dead = true;
    this.shielded = false;
    this.vy = -8; // 弹起
    this.onGround = false;
    game.audio.death();
    FX.deathExplosion(game.particles, this.screenX, this.y);
    game.onPlayerDeath();
  }

  /** 被护盾保护 — 触发护盾破碎 */
  shieldBreak(game) {
    this.shielded = false;
    this.shieldBlink = 0;
    this.vy = -8;
    this.onGround = false;
    game.audio.death();
    FX.shieldBreak(game.particles, this.screenX, this.y);
  }

  draw(ctx, scrollX) {
    // 根据状态选择贴图（护盾+滑铲组合优先于单独状态）
    if (this.dead) {
      this.sprite = SPRITES.playerDead;
    } else if (this.shielded && this.sliding) {
      this.sprite = SPRITES.playerShieldSlide || SPRITES.playerSlide;
    } else if (this.sliding) {
      this.sprite = SPRITES.playerSlide;
    } else if (this.shielded) {
      this.sprite = SPRITES.playerShield;
    } else if (!this.onGround && this.jumpCount === 2) {
      this.sprite = SPRITES.playerDoubleJump;
    } else if (!this.onGround) {
      this.sprite = SPRITES.playerJump;
    } else {
      this.sprite = SPRITES.playerRun;
    }

    if (this.sprite) {
      // 滑铲时贴图从顶部压缩，底部紧贴地面
      const drawY = this.sliding ? Math.floor(this.y + this.height - SLIDE_HEIGHT) : Math.floor(this.y);
      ctx.drawImage(this.sprite, Math.floor(this.screenX), drawY);
    }

    // 护盾闪烁特效（适配当前碰撞箱尺寸）
    if (this.shielded && this.shieldBlink > 0) {
      const blink = Math.sin(this.shieldBlink * 12) * 0.3 + 0.3;
      const box = this.getCollisionBox();
      ctx.strokeStyle = `rgba(100,180,255,${blink})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        Math.floor(box.x) - 3,
        Math.floor(box.y) - 3,
        box.w + 6,
        box.h + 6
      );
    }
  }
}
