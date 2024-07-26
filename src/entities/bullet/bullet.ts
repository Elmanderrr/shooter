import levelJSON from '../../../public/assets/level1.json';
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

  fire(x: number, y: number) {
    this.body?.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(0, -levelJSON.height * SIZES.TILE);
  }

  kill() {
    this.setActive(false);
    this.setVisible(false);
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.y > levelJSON.height * SIZES.TILE || this.y < -32) {
      this.kill();
    }
  }
}
