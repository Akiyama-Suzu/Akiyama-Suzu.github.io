/* === 收集品 / 道具 === */

const ITEM_TYPES = {
  coin:   { w: 22, h: 22, sprite: 'coinItem',   score: 100, effect: null },
  shield: { w: 48, h: 48, sprite: 'shieldItem', score: 0,   effect: 'shield',   duration: 999 },
  magnet: { w: 48, h: 48, sprite: 'magnetItem', score: 0,   effect: 'magnet',   duration: 300 },
};

class Item {
  /**
   * @param {number} worldX — 世界坐标 x
   * @param {number} worldY — 世界坐标 y
   * @param {string} type  — 'coin' | 'shield' | 'magnet'
   */
  constructor(worldX, worldY, type) {
    this.worldX = worldX;
    this.worldY = worldY;
    this.type = type;
    this.collected = false;

    const cfg = ITEM_TYPES[type];
    this.width  = cfg.w;
    this.height = cfg.h;
    this.score  = cfg.score;
    this.effect = cfg.effect;
    this.effectDuration = cfg.duration || 0;
    this.sprite = null; // 在 generateSprites 之后赋值

  }

  /** 碰撞箱 */
  getCollisionBox(scrollX) {
    const screenX = this.worldX - scrollX + 150;
    return {
      x: screenX,
      y: this.worldY,
      w: this.width,
      h: this.height,
    };
  }

  isOnScreen(scrollX) {
    const screenX = this.worldX - scrollX + 150;
    return screenX > -50 && screenX < 850;
  }

  isOffScreen(scrollX) {
    const screenX = this.worldX - scrollX + 150;
    return screenX < -200;
  }

  /** 被玩家收集 */
  collect(game) {
    if (this.collected) return;
    this.collected = true;

    switch (this.type) {
      case 'coin':
        game.score += this.score;
        game.audio.coin();
        FX.coinCollect(game.particles, this.worldX, this.worldY);
        break;
      case 'shield':
        game.player.shielded = true;
        game.player.shieldBlink = 0;
        game.audio.powerUp();
        FX.powerUpCollect(game.particles, this.worldX, this.worldY, '#4488FF');
        break;
      case 'magnet':
        game.magnetTimer = this.effectDuration;
        game.audio.powerUp();
        FX.powerUpCollect(game.particles, this.worldX, this.worldY, '#D94040');
        break;
    }
  }

  draw(ctx, scrollX) {
    if (this.collected) return;

    // 根据类型获取贴图
    let sprite;
    switch (this.type) {
      case 'coin':   sprite = SPRITES.coin; break;
      case 'shield': sprite = SPRITES.shieldItem; break;
      case 'magnet': sprite = SPRITES.magnetItem; break;
    }

    const screenX = Math.floor(this.worldX - scrollX + 150);
    const screenY = Math.floor(this.worldY);

    if (sprite) {
      ctx.drawImage(sprite, screenX, screenY);
    }
  }
}
