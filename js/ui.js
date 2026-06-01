/* === UI 渲染 === */

const UI = {

  /** 主菜单 */
  drawMenu(ctx, canvasW, canvasH) {
    // 半透明遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 标题
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 标题阴影
    ctx.fillStyle = '#000';
    ctx.font = 'bold 40px "Courier New", monospace';
    ctx.fillText('雪 峰 大 冒 险', canvasW / 2 + 2, 142);

    // 标题主体
    ctx.fillStyle = '#FFD700';
    ctx.fillText('雪 峰 大 冒 险', canvasW / 2, 140);

    // 副标题
    ctx.fillStyle = '#CCC';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('XUEFEN ADVENTURE', canvasW / 2, 178);

    // 小人
    const py = 210;
    if (SPRITES.playerRun) {
      ctx.drawImage(SPRITES.playerRun, canvasW / 2 - 20, py);
    }

    // 提示文字
    ctx.fillStyle = '#FFF';
    ctx.font = '18px "Courier New", monospace';
    const blink = Math.sin(Date.now() / 400) > -0.3;
    if (blink) {
      ctx.fillText('按 空格键 / ↑  开始游戏', canvasW / 2, 310);
    }

    // 操作说明
    ctx.fillStyle = '#999';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText('↑ / 空格 跳跃（可二段跳）  ↓ 滑铲', canvasW / 2, 350);
    ctx.fillText('Esc 暂停', canvasW / 2, 372);
  },

  /** 游戏内 HUD */
  drawHUD(ctx, canvasW, game) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // 分数背景
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(8, 8, 180, 32);

    // 分数
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText(`SCORE: ${game.score}`, 16, 14);

    // 距离（米）
    const meters = Math.floor(game.scrollX / 12);
    ctx.fillStyle = '#CCC';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText(`${meters} m`, 16, 34);

    // 道具状态
    let statusY = 50;
    if (game.player.shielded) {
      ctx.fillStyle = '#4488FF';
      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.fillText('🛡 SHIELD', 16, statusY);
      statusY += 20;
    }
    if (game.magnetTimer > 0) {
      ctx.fillStyle = '#D94040';
      ctx.font = 'bold 14px "Courier New", monospace';
      const sec = (game.magnetTimer / 60).toFixed(1);
      ctx.fillText(`🧲 MAGNET ${sec}s`, 16, statusY);
    }
  },

  /** 暂停界面 */
  drawPause(ctx, canvasW, canvasH) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText('暂  停', canvasW / 2, canvasH / 2 - 10);

    ctx.fillStyle = '#CCC';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('按 Esc / P 继续', canvasW / 2, canvasH / 2 + 32);
  },

  /** 死亡结算 */
  drawGameOver(ctx, canvasW, canvasH, game) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#D94040';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.fillText('游 戏 结 束', canvasW / 2, 120);

    // 分数面板
    const px = canvasW / 2 - 100;
    const py = 150;
    ctx.fillStyle = 'rgba(20,20,40,0.9)';
    ctx.fillRect(px, py, 200, 120);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, 200, 120);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('得分', canvasW / 2, py + 25);

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillText(game.score, canvasW / 2, py + 58);

    ctx.fillStyle = '#AAA';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText(`最高分: ${game.highScore}`, canvasW / 2, py + 88);

    if (game.score >= game.highScore && game.score > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.fillText('★ 新纪录! ★', canvasW / 2, py + 108);
    }

    // 重开提示
    const blink = Math.sin(Date.now() / 400) > -0.3;
    if (blink) {
      ctx.fillStyle = '#FFF';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('按 空格键 重新开始', canvasW / 2, 310);
    }
  },
};
