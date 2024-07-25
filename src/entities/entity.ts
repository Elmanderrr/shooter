import Phaser from 'phaser';
import { Level } from '../scenes/level.ts';

export abstract class Entity extends Phaser.Physics.Arcade.Sprite {
  protected constructor(
    public scene: Level,
    x: number,
    y: number,
    texture?: string,
  ) {
    super(scene, x, y, texture || '');
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
  }
}
