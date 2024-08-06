import { Scene } from 'phaser';
import { IMAGES, SCENES, SIZES, SPRITES } from '../utils/constats.ts';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.image(SCENES.FIRST, '/assets/level1.png');
    this.load.image(SPRITES.BULLET, '/assets/elements/bullets/01.png');
    this.load.image(IMAGES.LASER, '/assets/elements/laser/beam.png');
    this.load.tilemapTiledJSON('map', '/assets/leve1-horizontal.json');
    this.load.spritesheet(SPRITES.PLAYER, '/assets/characters/player.png', {
      frameWidth: SIZES.PLAYER.WIDTH,
      frameHeight: SIZES.PLAYER.HEIGHT,
    });
    this.load.atlas(
      SPRITES.ORC.BASE,
      '/assets/characters/texture.png',
      '/assets/characters/texture.json',
    );

    this.load.atlas(
      SPRITES.ORC.DYING,
      '/assets/characters/orc/dying.png',
      '/assets/characters/orc/dying.json',
    );

    this.load.atlas(
      SPRITES.ORC.SLASHING,
      '/assets/characters/orc/slashing.png',
      '/assets/characters/orc/slashing.json',
    );
    this.load.atlas(
      'exp',
      '/assets/elements/skills/explosion.png',
      '/assets/elements/skills/explosion.json',
    );
    this.load.spritesheet(SPRITES.BOAR, '/assets/characters/boar.png', {
      frameWidth: SIZES.ENEMY.WIDTH,
      frameHeight: SIZES.ENEMY.HEIGHT,
    });
  }

  create() {
    this.scene.start(SCENES.START);
  }
}
