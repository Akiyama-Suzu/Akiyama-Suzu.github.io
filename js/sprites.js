/* === 精灵生成器 ===
 * 先通过 Canvas 程序化绘制默认贴图。
 * 然后尝试加载外部 PNG 文件替换对应贴图，
 * 自动等比缩放至游戏所需尺寸。
 */

const SPRITES = {};

/** 工具：创建一个像素风精灵 Image 对象 */
function _makeSprite(w, h, drawFn) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  drawFn(ctx, w, h);
  const img = new Image();
  img.src = c.toDataURL('image/png');
  return img;
}

/** 像素块绘制 */
function _px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/* ====== 生成所有精灵 ====== */

function generateSprites() {

  // --- 玩家·奔跑 (40×56) ---
  SPRITES.playerRun = _makeSprite(40, 56, (ctx) => {
    // 头发
    _px(ctx, 13, 0,  14, 5,  '#5C3A28');
    _px(ctx, 11, 3,  18, 3,  '#5C3A28');
    // 脸
    _px(ctx, 14, 6,  12, 10, '#F4C29A');
    // 眼睛
    _px(ctx, 22, 9,  3, 3,  '#1A1A2E');
    // 身体（衬衫）
    _px(ctx, 11, 16, 18, 16, '#4A90D9');
    // 手臂 — 跑步姿态（前后摆动）
    _px(ctx, 6,  17, 6, 11, '#F4C29A');  // 左臂后摆
    _px(ctx, 28, 19, 6, 11, '#F4C29A');  // 右臂前摆
    // 裤子
    _px(ctx, 12, 32, 7, 16, '#2C3E50');
    _px(ctx, 21, 32, 7, 16, '#2C3E50');
    // 鞋子
    _px(ctx, 11, 46, 9, 6,  '#1A1A2E');
    _px(ctx, 20, 46, 9, 6,  '#1A1A2E');
  });

  // --- 玩家·跳跃 (40×56) ---
  SPRITES.playerJump = _makeSprite(40, 56, (ctx) => {
    _px(ctx, 13, 0,  14, 5,  '#5C3A28');
    _px(ctx, 11, 3,  18, 3,  '#5C3A28');
    _px(ctx, 14, 6,  12, 10, '#F4C29A');
    _px(ctx, 22, 9,  3, 3,  '#1A1A2E');
    _px(ctx, 11, 16, 18, 14, '#4A90D9');
    // 手臂上举
    _px(ctx, 6,  12, 6, 10, '#F4C29A');
    _px(ctx, 28, 12, 6, 10, '#F4C29A');
    // 腿收起
    _px(ctx, 12, 30, 7, 12, '#2C3E50');
    _px(ctx, 21, 30, 7, 12, '#2C3E50');
    _px(ctx, 11, 40, 9, 5,  '#1A1A2E');
    _px(ctx, 20, 40, 9, 5,  '#1A1A2E');
  });

  // --- 玩家·二段跳 (40×56) ---
  SPRITES.playerDoubleJump = _makeSprite(40, 56, (ctx) => {
    _px(ctx, 13, 0,  14, 5,  '#5C3A28');
    _px(ctx, 11, 3,  18, 3,  '#5C3A28');
    _px(ctx, 14, 6,  12, 10, '#F4C29A');
    _px(ctx, 22, 9,  3, 3,  '#1A1A2E');
    _px(ctx, 11, 16, 18, 13, '#4A90D9');
    // 手臂张开
    _px(ctx, 4,  13, 7, 9,  '#F4C29A');
    _px(ctx, 29, 13, 7, 9,  '#F4C29A');
    // 腿更收
    _px(ctx, 12, 29, 7, 10, '#2C3E50');
    _px(ctx, 21, 29, 7, 10, '#2C3E50');
    _px(ctx, 11, 37, 8, 5,  '#1A1A2E');
    _px(ctx, 21, 37, 8, 5,  '#1A1A2E');
  });

  // --- 玩家·滑铲 (40×30) ---
  SPRITES.playerSlide = _makeSprite(40, 30, (ctx) => {
    // 头发（压低）
    _px(ctx, 13, 0, 14, 4, '#5C3A28');
    // 脸（压低）
    _px(ctx, 14, 4, 12, 7, '#F4C29A');
    _px(ctx, 21, 6, 3, 2, '#1A1A2E');
    // 身体（压低延伸）
    _px(ctx, 10, 10, 20, 10, '#4A90D9');
    // 手臂前伸
    _px(ctx, 30, 11, 7, 4, '#F4C29A');
    // 腿（横向排列）
    _px(ctx, 8,  18, 8, 7, '#2C3E50');
    _px(ctx, 16, 18, 8, 7, '#2C3E50');
    _px(ctx, 7,  23, 10, 5, '#1A1A2E');
    _px(ctx, 17, 23, 10, 5, '#1A1A2E');
  });

  // --- 玩家·死亡 (40×56) ---
  SPRITES.playerDead = _makeSprite(40, 56, (ctx) => {
    _px(ctx, 13, 0,  14, 5,  '#5C3A28');
    _px(ctx, 14, 6,  12, 10, '#F4C29A');
    // X 眼
    _px(ctx, 20, 9,  1, 4,  '#1A1A2E'); // \
    _px(ctx, 21, 9,  1, 4,  '#1A1A2E');
    _px(ctx, 24, 9,  1, 4,  '#1A1A2E'); // /
    _px(ctx, 23, 9,  1, 4,  '#1A1A2E');
    _px(ctx, 11, 16, 18, 16, '#4A90D9');
    // 手臂外伸
    _px(ctx, 4,  18, 8, 8,  '#F4C29A');
    _px(ctx, 28, 18, 8, 8,  '#F4C29A');
    _px(ctx, 12, 32, 7, 16, '#2C3E50');
    _px(ctx, 21, 32, 7, 16, '#2C3E50');
    _px(ctx, 11, 46, 9, 6,  '#1A1A2E');
    _px(ctx, 20, 46, 9, 6,  '#1A1A2E');
  });

  // --- 玩家·护盾状态 (40×56) — 原奔跑+蓝色光晕 ---
  SPRITES.playerShield = _makeSprite(40, 56, (ctx) => {
    // 先画奔跑姿态
    _px(ctx, 13, 0,  14, 5,  '#5C3A28');
    _px(ctx, 11, 3,  18, 3,  '#5C3A28');
    _px(ctx, 14, 6,  12, 10, '#F4C29A');
    _px(ctx, 22, 9,  3, 3,  '#1A1A2E');
    _px(ctx, 11, 16, 18, 16, '#4A90D9');
    _px(ctx, 6,  17, 6, 11, '#F4C29A');
    _px(ctx, 28, 19, 6, 11, '#F4C29A');
    _px(ctx, 12, 32, 7, 16, '#2C3E50');
    _px(ctx, 21, 32, 7, 16, '#2C3E50');
    _px(ctx, 11, 46, 9, 6,  '#1A1A2E');
    _px(ctx, 20, 46, 9, 6,  '#1A1A2E');
    // 半透明蓝色光晕边框
    ctx.strokeStyle = 'rgba(68,136,255,0.7)';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 36, 52);
  });

  // --- 地面尖刺 (26×34) ---
  SPRITES.spike = _makeSprite(26, 34, (ctx) => {
    // 像素三角尖刺
    const colors = ['#D94040', '#C42828', '#8B2020'];
    // 从底部往上逐行收窄
    const rows = [
      { y: 28, x: 2, w: 22 }, { y: 24, x: 4, w: 18 },
      { y: 20, x: 6, w: 14 }, { y: 16, x: 8, w: 10 },
      { y: 12, x: 9, w: 8 },  { y: 8,  x: 10, w: 6 },
      { y: 4,  x: 11, w: 4 }, { y: 0,  x: 12, w: 2 }
    ];
    rows.forEach((r, i) => {
      _px(ctx, r.x, r.y, r.w, 4, colors[i % 3]);
    });
    // 底座
    _px(ctx, 0, 30, 26, 4, '#666666');
  });

  // --- 空中横梁 (56×14) ---
  SPRITES.beam = _makeSprite(56, 14, (ctx) => {
    _px(ctx, 0, 0, 56, 14, '#777777');
    // 警告条纹
    for (let i = 0; i < 7; i++) {
      _px(ctx, i * 8 + 1, 2, 6, 4, '#DAA520');
      _px(ctx, i * 8 + 1, 8, 6, 4, '#DAA520');
    }
    // 边框
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 56, 14);
  });

  // --- 金币 (22×22) ---
  SPRITES.coin = _makeSprite(22, 22, (ctx) => {
    // 圆形金币
    _px(ctx, 7, 0,  8, 3,  '#FFD700');
    _px(ctx, 4, 3,  14, 3, '#FFD700');
    _px(ctx, 2, 6,  18, 3, '#FFC000');
    _px(ctx, 1, 9,  20, 4, '#FFD700');
    _px(ctx, 2, 13, 18, 3, '#FFC000');
    _px(ctx, 4, 16, 14, 3, '#FFD700');
    _px(ctx, 7, 19, 8,  3,  '#FFA500');
    // 高光
    _px(ctx, 7, 6, 5, 3, '#FFEC8B');
  });

  // --- 护盾道具 (26×26) ---
  SPRITES.shieldItem = _makeSprite(26, 26, (ctx) => {
    // 盾形
    _px(ctx, 9,  0,  8, 4,  '#4488FF');
    _px(ctx, 6,  4,  14, 3, '#4488FF');
    _px(ctx, 4,  7,  18, 4, '#4488FF');
    _px(ctx, 3,  11, 20, 5, '#4488FF');
    _px(ctx, 4,  16, 18, 4, '#3366DD');
    _px(ctx, 6,  20, 14, 4, '#3366DD');
    _px(ctx, 10, 24, 6,  2,  '#3366DD');
    // 内圈浅色
    _px(ctx, 9,  4,  8, 3,  '#88BBFF');
    _px(ctx, 7,  7,  12, 3, '#88BBFF');
    _px(ctx, 6,  10, 14, 2, '#88BBFF');
  });

  // --- 磁铁道具 (26×26) ---
  SPRITES.magnetItem = _makeSprite(26, 26, (ctx) => {
    // U 形磁铁
    _px(ctx, 6,  0,  14, 6,  '#D94040'); // N 极（上横条）
    _px(ctx, 6,  6,  4,  14, '#D94040'); // 左竖
    _px(ctx, 16, 6,  4,  14, '#D94040'); // 右竖
    // 底部银色
    _px(ctx, 5,  18, 4,  2,  '#AAAAAA');
    _px(ctx, 17, 18, 4,  2,  '#AAAAAA');
    // 字母 N / S
    _px(ctx, 9,  8,  2, 3,  '#FFFFFF');
    _px(ctx, 12, 8,  2, 3,  '#FFFFFF');
    _px(ctx, 9,  12, 6, 2,  '#FFFFFF');
    _px(ctx, 9,  15, 2, 3,  '#FFFFFF');
    _px(ctx, 15, 8,  3, 7,  '#FFFFFF'); // S
  });

  // --- 地面砖块 (64×64) ---
  SPRITES.ground = _makeSprite(64, 64, (ctx) => {
    _px(ctx, 0, 0, 64, 64, '#8B6914');
    // 砖缝
    ctx.strokeStyle = '#6B4F12';
    ctx.lineWidth = 1;
    // 横缝
    for (let y = 0; y < 64; y += 16) {
      _px(ctx, 0, y, 64, 1, '#6B4F12');
    }
    // 竖缝（交错）
    for (let y = 0; y < 64; y += 32) {
      for (let x = 0; x < 64; x += 32) {
        _px(ctx, x + 15, y, 1, 16, '#6B4F12');
      }
    }
    for (let y = 16; y < 64; y += 32) {
      for (let x = 0; x < 64; x += 32) {
        _px(ctx, x + 31, y, 1, 16, '#6B4F12');
      }
    }
    // 顶部草皮
    _px(ctx, 0, 0, 64, 4, '#4A8C3F');
    _px(ctx, 0, 4, 64, 2, '#3D7233');
  });

  // --- 背景·远山 (200×80) ---
  SPRITES.bgMountain = _makeSprite(200, 80, (ctx) => {
    // 深色远山剪影
    ctx.fillStyle = '#2A2A4A';
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(0, 50);
    ctx.lineTo(30, 20);
    ctx.lineTo(60, 45);
    ctx.lineTo(80, 10);
    ctx.lineTo(110, 35);
    ctx.lineTo(150, 5);
    ctx.lineTo(180, 40);
    ctx.lineTo(200, 25);
    ctx.lineTo(200, 80);
    ctx.closePath();
    ctx.fill();
  });

  // --- 背景·近丘 (200×50) ---
  SPRITES.bgHill = _makeSprite(200, 50, (ctx) => {
    ctx.fillStyle = '#3A5A3A';
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.quadraticCurveTo(40, 20, 70, 50);
    ctx.quadraticCurveTo(100, 30, 140, 50);
    ctx.quadraticCurveTo(170, 25, 200, 45);
    ctx.lineTo(200, 50);
    ctx.closePath();
    ctx.fill();
  });
}

/* ====== 外部贴图加载（自动等比缩放） ====== */

/** 加载外部图片并等比缩放至目标尺寸（含超时，避免 file:// 下卡死） */
function _loadAndScale(src, targetW, targetH, timeoutMs) {
  timeoutMs = timeoutMs || 3000;
  return new Promise((resolve) => {
    // 超时兜底：3 秒加载不到就用默认贴图
    const timer = setTimeout(() => {
      console.warn('加载贴图超时: ' + src + '，使用默认生成贴图');
      img.onload = null;
      img.onerror = null;
      resolve(null);
    }, timeoutMs);

    const img = new Image();
    img.onload = () => {
      clearTimeout(timer);
      const c = document.createElement('canvas');
      c.width = targetW;
      c.height = targetH;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      // 等比缩放：取较小的缩放比，保持宽高比，居中绘制
      const scale = Math.min(targetW / img.width, targetH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (targetW - dw) / 2;
      const dy = (targetH - dh) / 2;

      ctx.drawImage(img, dx, dy, dw, dh);

      const out = new Image();
      out.src = c.toDataURL('image/png');
      resolve(out);
    };
    img.onerror = () => {
      clearTimeout(timer);
      console.warn('无法加载贴图: ' + src + '，使用默认生成贴图');
      resolve(null);
    };
    img.src = src;
  });
}

/** 尝试加载外部贴图，替换对应 SPRITES 条目 */
async function loadExternalSprites() {
  // 主角贴图 — man.png（替换所有玩家状态）
  const man = await _loadAndScale('assets/audio/man.png', 40, 56);
  if (man) {
    SPRITES.playerRun = man;
    SPRITES.playerJump = man;
    SPRITES.playerDoubleJump = man;
    // 滑铲：整体高度压缩至 30px（变扁，不裁剪）
    SPRITES.playerSlide = _makeSprite(40, 30, (ctx) => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(man, 0, 0, 40, 56, 0, 0, 40, 30);
    });
    // 护盾+滑铲：压缩 + 蓝色光晕
    SPRITES.playerShieldSlide = _makeSprite(40, 30, (ctx) => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(man, 0, 0, 40, 56, 0, 0, 40, 30);
      ctx.strokeStyle = 'rgba(68,136,255,0.7)';
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, 36, 26);
    });
    SPRITES.playerDead = man;
    SPRITES.playerShield = man;
  }

  // 护盾道具 — qiaolezi.png（放大至 48×48）
  const shield = await _loadAndScale('assets/audio/qiaolezi.png', 48, 48);
  if (shield) {
    SPRITES.shieldItem = shield;
  }

  // 磁铁道具 — xuebi.png（放大至 48×48）
  const magnet = await _loadAndScale('assets/audio/xuebi.png', 48, 48);
  if (magnet) {
    SPRITES.magnetItem = magnet;
  }
}
