import { Level } from '../../scenes/level.ts';
import { SIZES, SPRITES } from '../../utils/constats.ts';
import { Entity } from '../entity.ts';

export class Bullet extends Entity {
  constructor(
    public scene: Level,
    x: number,
    y: number,
  ) {
    super(scene, x, y, SPRITES.BULLET);

    this.setScale(0.3);
    this.setAngle(-90);
    this.setSize(30, 30);
    this.setOffset(45, 45);
  }

  fire(x: number, y: number, direction: 1 | -1) {
    this.body?.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(direction * this.scene.map.width * SIZES.TILE, 0);
  }

  kill() {
    this.setActive(false);
    this.setVisible(false);
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.x > this.scene.map.widthInPixels || this.x < 32) {
      this.kill();
    }
  }
}
