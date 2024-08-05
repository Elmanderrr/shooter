import { SecondarySkill } from '../models/player.model.ts';
import { BaseSkill } from './BaseSkill.ts';

export class Teleport extends BaseSkill {
  name = SecondarySkill.TELEPORT;

  hotKey = '4';

  iconPath = './assets/elements/skills/teleport.png';

  public activate(x: number, y: number): void {
    if (this.ready) {
      this.blink(x, y);
    }
    super.use();
  }

  private blink(x: number, y: number): void {
    this.scene.tweens.chain({
      targets: this.entity,
      tweens: [
        {
          alpha: 0,
          duration: 500,
        },
        {
          x,
          y,
          duration: 0,
        },
        {
          alpha: 1,
          duration: 200,
        },
      ],
    });
  }
}
