/* === 关卡生成器 === */

class Level {
  constructor() {
    this.obstacles = [];
    this.items = [];
    this.pits = [];        // { worldX, width }
    this.nextSpawnX = 800;
  }

  reset() {
    this.obstacles = [];
    this.items = [];
    this.pits = [];
    this.nextSpawnX = 800;
  }

  /** 检测某世界坐标是否在坑洞内 */
  isInPit(worldX) {
    for (const pit of this.pits) {
      if (worldX + 20 > pit.worldX && worldX < pit.worldX + pit.width) {
        return true;
      }
    }
    return false;
  }

  update(game) {
    // 按需生成前方区块
    while (game.scrollX + 1200 > this.nextSpawnX) {
      this._generateChunk(game);
    }

    // 清理离开屏幕的对象
    this.obstacles = this.obstacles.filter(o => !o.isOffScreen(game.scrollX));
    this.items = this.items.filter(i => !i.isOffScreen(game.scrollX) && !i.collected);
    this.pits = this.pits.filter(p => p.worldX + p.width > game.scrollX - 400);
  }

  _generateChunk(game) {
    const difficulty = game.scrollX / 1000; // 0 起步
    const chunkW = 500 + Math.random() * 350;
    const startX = this.nextSpawnX;

    // --- 坑洞 ---
    let pitInfo = null;
    const pitChance = Math.min(0.4, 0.05 + difficulty * 0.04);
    if (Math.random() < pitChance) {
      const pw = 110 + Math.random() * 50 + difficulty * 5;
      const px = startX + 220 + Math.random() * (chunkW - pw - 50);
      this.pits.push({ worldX: px, width: pw });
      pitInfo = { x: px, w: pw };
    }

    // --- 障碍物 ---
    const obsCount = 1 + Math.floor(Math.random() * (2 + Math.min(difficulty * 0.5, 3)));
    let lastX = startX + 120;

    for (let i = 0; i < obsCount; i++) {
      const minGap = 160 + Math.random() * 60;
      const ox = lastX + minGap + Math.random() * ((chunkW - 100) / obsCount);

      if (ox < startX + chunkW - 80) {
        // 避开坑洞
        if (pitInfo && ox > pitInfo.x - 40 && ox < pitInfo.x + pitInfo.w + 40) {
          continue;
        }
        const type = Math.random() < 0.55 ? 'spike' : 'beam';
        this.obstacles.push(new Obstacle(Math.floor(ox), type));
        lastX = ox;
      }
    }

    // --- 金币（弧形排列） ---
    const coinCount = 3 + Math.floor(Math.random() * 4);
    const coinStartX = startX + 100 + Math.random() * 80;
    for (let i = 0; i < coinCount; i++) {
      const cx = coinStartX + i * 45 + Math.random() * 20;
      const cy = GROUND_Y - 50 - Math.random() * 90;
      this.items.push(new Item(Math.floor(cx), Math.floor(cy), 'coin'));
    }

    // --- 道具（偶尔） ---
    if (Math.random() < 0.18) {
      const px = startX + 250 + Math.random() * (chunkW - 250);
      const py = GROUND_Y - 70 - Math.random() * 50;
      const ptype = Math.random() < 0.45 ? 'shield' : 'magnet';
      this.items.push(new Item(Math.floor(px), Math.floor(py), ptype));
    }

    this.nextSpawnX += chunkW;
  }

  // ========== 地面绘制 ==========

  drawGround(ctx, scrollX, canvasW) {
    const worldStart = scrollX - 200;
    const worldEnd   = scrollX + canvasW + 100;
    const tile = SPRITES.ground;
    const tileW = 64;

    // 将可见范围内的坑洞排序
    const visiblePits = this.pits
      .filter(p => p.worldX + p.width > worldStart && p.worldX < worldEnd)
      .sort((a, b) => a.worldX - b.worldX);

    let segStart = worldStart;

    for (const pit of visiblePits) {
      // 坑洞前的地面段
      if (pit.worldX > segStart) {
        this._fillGround(ctx, segStart, pit.worldX, scrollX, tile, tileW);
      }
      segStart = pit.worldX + pit.width;
    }

    // 最后一段
    if (segStart < worldEnd) {
      this._fillGround(ctx, segStart, worldEnd, scrollX, tile, tileW);
    }
  }

  _fillGround(ctx, wStart, wEnd, scrollX, tile, tileW) {
    const screenStart = Math.floor(wStart - scrollX + 150);
    const screenEnd   = Math.ceil(wEnd - scrollX + 150);
    if (screenEnd <= screenStart) return;

    if (tile) {
      for (let sx = screenStart; sx < screenEnd; sx += tileW) {
        ctx.drawImage(tile, sx, GROUND_Y);
      }
    } else {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(screenStart, GROUND_Y, screenEnd - screenStart, 90);
      ctx.fillStyle = '#4A8C3F';
      ctx.fillRect(screenStart, GROUND_Y, screenEnd - screenStart, 4);
    }
  }
}
