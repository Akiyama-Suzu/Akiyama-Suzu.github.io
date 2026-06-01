/* === 输入管理器 ===
 * 处理键盘事件，提供"按下"和"刚按下"两种查询。
 */

class Input {
  constructor() {
    this.keys = {};        // 当前帧按住状态
    this.justKeys = {};    // 当前帧刚按下（会在 update 后清空）
    this.prevKeys = {};    // 上一帧按住状态

    this._onDown = (e) => {
      // 阻止默认行为（方向键滚动页面等）
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyS'].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys[e.code]) {
        this.justKeys[e.code] = true;
      }
      this.keys[e.code] = true;
    };

    this._onUp = (e) => {
      this.keys[e.code] = false;
    };
  }

  /** 开始监听 */
  listen() {
    window.addEventListener('keydown', this._onDown);
    window.addEventListener('keyup', this._onUp);
  }

  /** 停止监听 */
  unlisten() {
    window.removeEventListener('keydown', this._onDown);
    window.removeEventListener('keyup', this._onUp);
  }

  /** 检测某键是否按住 */
  held(code) {
    return !!this.keys[code];
  }

  /** 检测某键是否在本帧刚按下 */
  pressed(code) {
    return !!this.justKeys[code];
  }

  /** 跳跃键是否持有（↑ / 空格 / W） */
  jumpHeld() {
    return this.held('ArrowUp') || this.held('Space') || this.held('KeyW');
  }

  /** 跳跃键是否刚按下 */
  jumpPressed() {
    return this.pressed('ArrowUp') || this.pressed('Space') || this.pressed('KeyW');
  }

  /** 下蹲键是否持有 */
  slideHeld() {
    return this.held('ArrowDown') || this.held('KeyS');
  }

  /** 暂停键是否刚按下 */
  pausePressed() {
    return this.pressed('Escape') || this.pressed('KeyP');
  }

  /** 每帧末调用，清除 justPressed 状态 */
  endFrame() {
    this.justKeys = {};
  }
}
