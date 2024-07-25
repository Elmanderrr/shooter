import Phaser from 'phaser';
import PhaserNavMeshPlugin from 'phaser-navmesh';
import { Level } from './scenes/level.ts';
import { SIZES } from './utils/constats.ts';
import levelJSON from '../public/assets/level1.json';

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
        key: 'PhaserNavMeshPlugin', // Key to store the plugin class under in cache
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: 'navMeshPlugin', // Property mapping to use for the scene, e.g. this.navMeshPlugin
        start: true,
      },
    ],
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
});
