/* === 障碍物 ===
 * 所有坐标均为世界坐标（worldX），渲染时转屏幕坐标。
 */

class Obstacle {
  constructor(worldX, type) {
    this.worldX = worldX;
    this.type = type;   // 'spike' | 'beam'
    this.passed = false; // 玩家是否已通过（用于计分统计）
    this._init();
  }

  _init() {
    switch (this.type) {
      case 'spike':
        this.width  = 26;
        this.height = 34;
        this.y = GROUND_Y - this.height; // 站在地面上
        this.sprite = SPRITES.spike;
        break;
      case 'beam':
        this.width  = 56;
        this.height = 14;
        this.y = GROUND_Y - 60; // 头部高度（需要滑铲通过）
        this.sprite = SPRITES.beam;
        break;
      default:
        this.width = 0;
        this.height = 0;
        this.y = 0;
        this.sprite = null;
    }
  }

  /** AABB 碰撞箱 */
  getCollisionBox(scrollX) {
    const screenX = this.worldX - scrollX + 150;
    return {
      x: screenX,
      y: this.y,
      w: this.width,
      h: this.height,
    };
  }

  /** 是否在屏幕可见范围内 */
  isOnScreen(scrollX) {
    const screenX = this.worldX - scrollX + 150;
    return screenX > -100 && screenX < 900;
  }

  /** 是否完全离开屏幕左侧 */
  isOffScreen(scrollX) {
    const screenX = this.worldX - scrollX + 150;
    return screenX < -200;
  }

  draw(ctx, scrollX) {
    const screenX = Math.floor(this.worldX - scrollX + 150);
    if (this.sprite) {
      ctx.drawImage(this.sprite, screenX, Math.floor(this.y));
    }
  }
}
