/* === 入口模块 === */

(function () {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('找不到 #game-canvas 元素');
    return;
  }

  const game = new Game(canvas);
  game.start();

  // 调试：暴露 game 实例到全局
  window.__game = game;
})();
