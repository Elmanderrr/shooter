import Phaser from 'phaser';
import { LEVELS, SIZES, SPRITES } from '../utils/constats.ts';

export class PreloadManager {
  static preloadForLevel(scene: Phaser.Scene, level: string) {
    switch (level) {
      case LEVELS.FIRST:
        this.level1(scene);
        break;
    }
  }

  static level1(scene: Phaser.Scene) {
    scene.load.image(LEVELS.FIRST, '/assets/level1.png');
    scene.load.image(SPRITES.BULLET, '/assets/elements/bullets/01.png');
    scene.load.tilemapTiledJSON('map', '/assets/leve1-horizontal.json');
    scene.load.spritesheet(SPRITES.PLAYER, '/assets/characters/player.png', {
      frameWidth: SIZES.PLAYER.WIDTH,
      frameHeight: SIZES.PLAYER.HEIGHT,
    });
    scene.load.atlas(
      SPRITES.ORC.BASE,
      '/assets/characters/texture.png',
      '/assets/characters/texture.json',
    );

    scene.load.atlas(
      SPRITES.ORC.DYING,
      '/assets/characters/orc/dying.png',
      '/assets/characters/orc/dying.json',
    );

    scene.load.atlas(
      SPRITES.ORC.SLASHING,
      '/assets/characters/orc/slashing.png',
      '/assets/characters/orc/slashing.json',
    );
    scene.load.spritesheet(SPRITES.BOAR, '/assets/characters/boar.png', {
      frameWidth: SIZES.ENEMY.WIDTH,
      frameHeight: SIZES.ENEMY.HEIGHT,
    });
  }
}
