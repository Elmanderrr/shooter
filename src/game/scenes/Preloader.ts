import { Scene } from 'phaser';
import { AUDIO, IMAGES, SCENES, SIZES, SPRITES } from '../utils/constats.ts';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.audio(AUDIO.WASTED, ['/assets/audio/wasted.mp3']);
    this.load.audio(AUDIO.MISSILE_FLIGHT, ['/assets/audio/missile-flight-loop.mp3']);
    this.load.audio(AUDIO.PUNCH, ['/assets/audio/punch.ogg']);
    this.load.audio(AUDIO.EXPLOSION, ['/assets/audio/explosion.mp3']);
    this.load.audio(AUDIO.LASER, ['/assets/audio/laser.ogg']);
    this.load.image(SCENES.FIRST, '/assets/level1.png');
    this.load.image(SPRITES.BULLET, '/assets/elements/bullets/01.png');
    this.load.image(IMAGES.MISSILE, '/assets/elements/skills/missile.png');
    this.load.image('crosshair', '/assets/elements/skills/crosshair.png');
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
      SPRITES.EXPLOSION,
      '/assets/elements/skills/explosion.png',
      '/assets/elements/skills/explosion.json',
    );
    this.load.spritesheet(SPRITES.BOAR, '/assets/characters/boar.png', {
      frameWidth: SIZES.ENEMY.WIDTH,
      frameHeight: SIZES.ENEMY.HEIGHT,
    });
  }

  create() {
    this.animations();
    this.scene.start(SCENES.START);
  }

  private animations() {
    this.anims.create({
      key: 'walking',
      frames: this.anims.generateFrameNames(SPRITES.ORC.BASE, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Running_',
        suffix: '',
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'dying',
      frames: this.anims.generateFrameNames(SPRITES.ORC.DYING, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Dying_',
        suffix: '',
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'slashing',
      frames: this.anims.generateFrameNames(SPRITES.ORC.SLASHING, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Slashing_',
        suffix: '',
      }),
      repeat: -1,
    });
    this.anims.create({
      key: 'blow',
      frames: this.anims.generateFrameNames(SPRITES.EXPLOSION, {
        prefix: 'Explosion_',
        start: 1,
        end: 10,
      }),
      repeat: 0,
      frameRate: 19,
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers(SPRITES.PLAYER, {
        start: 0,
        end: 2,
      }),
      frameRate: 9,
    });

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(SPRITES.PLAYER, {
        start: 12,
        end: 14,
      }),
      frameRate: 9,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(SPRITES.PLAYER, {
        start: 24,
        end: 26,
      }),
      frameRate: 9,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers(SPRITES.PLAYER, {
        start: 36,
        end: 38,
      }),
      frameRate: 9,
    });
  }
}
