import { SecondarySkill } from '../models/player.model.ts';
import { Skill } from './Skill.ts';

export class Teleport extends Skill {
  name = SecondarySkill.TELEPORT;

  hotKey = '1';

  iconPath = './assets/elements/skills/teleport.png';

  public activate(x: number, y: number): void {
    if (this.ready) {
      this.blink(x, y);
    }
    super.use();
  }

  private blink(x: number, y: number): void {
    this.hostEntity.busy = true;

    this.scene.tweens.chain({
      targets: this.hostEntity,
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
          callback: () => {
            this.hostEntity.busy = false;
          },
        },
      ],
    });
  }
}
