import React from 'react';
import ReactDOM from 'react-dom/client';

import Phaser from 'phaser';
import PhaserNavMeshPlugin from 'phaser-navmesh';
import { Level } from './scenes/level.ts';
import { SIZES } from './utils/constats.ts';
import levelJSON from '../public/assets/leve1-horizontal.json';
import GameUI from './game-ui/GameUI.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameUI />
  </React.StrictMode>,
);

new Phaser.Game({
  type: Phaser.AUTO,
  width: levelJSON.width * SIZES.TILE,
  height: levelJSON.height * SIZES.TILE,
  title: 'shooter',
  backgroundColor: 'orange',
  scene: [Level],
  plugins: {
    scene: [
      {
        key: 'PhaserNavMeshPlugin',
        plugin: PhaserNavMeshPlugin,
        mapping: 'navMeshPlugin',
        start: true,
      },
    ],
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
});
