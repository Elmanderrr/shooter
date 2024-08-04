import Phaser from 'phaser';
import { Level } from '../../scenes/level.ts';
import { SPRITES } from '../../utils/constats.ts';
import { Bullet } from './bullet.ts';

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene: Level) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 10,
      key: SPRITES.BULLET,
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  public fireBullet(x: number, y: number, direction: 1 | -1) {
    const bullet = this.getFirstDead(false) as Bullet;

    if (bullet) {
      bullet.fire(x, y, direction);
    }
  }
}
