import Phaser from 'phaser';
import { Level } from '../../scenes/level.ts';
import { Entity } from '../entity.ts';

export class Laser extends Phaser.GameObjects.Rectangle {
  constructor(scene: Level, x: number, y: number) {
    super(scene, x, y, 100, 1, 0xff1400);

    this.postFX.addGlow(this.fillColor, 4, 0, false, 0.4, 10);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setVisible(false);
  }

  public fire(xDestination: number, target: Entity, duration: number) {
    this.reset(target);

    this.scene.tweens.add({
      targets: this,
      x: xDestination + this.width,
      duration,
    });
  }

  private reset(target: Entity) {
    this.x = target.x;
    this.y = target.y;
    this.scene.tweens.killTweensOf(this);
    this.setVisible(true);
  }
}
