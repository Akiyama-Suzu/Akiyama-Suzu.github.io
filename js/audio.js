/* === Web Audio API 音效引擎 ===
 * 使用程序化合成生成 8-bit 风格音效。
 * 如需替换为你自己的音频文件，修改 play() 方法即可。
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgm = null;         // 背景音乐 Audio 元素
    this.bgmVolume = 0.25;
    // 延迟初始化 AudioContext（需要用户交互后才能创建）
  }

  /** 初始化背景音乐 */
  initBGM() {
    this.bgm = new Audio('assets/audio/music.mp3');
    this.bgm.loop = true;
    this.bgm.volume = this.bgmVolume;
  }

  /** 确保 AudioContext 已创建 */
  _ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /** 播放一个简单的音调 */
  _tone(freq, duration, type, volume, ramp) {
    if (!this.enabled) return;
    try {
      const ctx = this._ensure();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type || 'square';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(freq, now);
      if (ramp) osc.frequency.linearRampToValueAtTime(ramp, now + duration);
      gain.gain.setValueAtTime(volume || 0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } catch (_) { /* 静默失败 */ }
  }

  /** 跳跃音效 — 上升短音 */
  jump() {
    if (!this.enabled) return;
    try {
      const ctx = this._ensure();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  /** 二段跳音效 — 更高音 */
  doubleJump() {
    if (!this.enabled) return;
    try {
      const ctx = this._ensure();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.06);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (_) {}
  }

  /** 金币拾取 — 两声叮铃 */
  coin() {
    if (!this.enabled) return;
    try {
      const ctx = this._ensure();
      const now = ctx.currentTime;
      [1200, 1600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        const t = now + i * 0.06;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
      });
    } catch (_) {}
  }

  /** 道具拾取 — 上升琶音 */
  powerUp() {
    if (!this.enabled) return;
    try {
      const ctx = this._ensure();
      const notes = [400, 500, 650, 800];
      const now = ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        const t = now + i * 0.05;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch (_) {}
  }

  /** 死亡音效 — 下降+噪音 */
  death() {
    if (!this.enabled) return;
    try {
      const ctx = this._ensure();
      const now = ctx.currentTime;
      // 下降音
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (_) {}
  }

  // ========== 背景音乐 ==========

  playBGM() {
    if (!this.bgm || !this.enabled) return;
    this.bgm.currentTime = 0;
    this.bgm.play().catch(() => {});
  }

  pauseBGM() {
    if (!this.bgm) return;
    this.bgm.pause();
  }

  stopBGM() {
    if (!this.bgm) return;
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }
}
