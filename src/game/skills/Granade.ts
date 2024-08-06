import { Skill } from './Skill.ts';
import { SecondarySkill } from '../models/player.model.ts';

export class Granade extends Skill {
  name = SecondarySkill.GRENADE;

  iconPath = './assets/elements/skills/teleport2.png';

  hotKey = '3';

  public activate(): void {
    if (this.ready) {
      console.log(this.name);
    }
    super.use();
  }
}
