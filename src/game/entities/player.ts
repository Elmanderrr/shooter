import Phaser from 'phaser';
import { PrimarySkill, SecondarySkill, SkillsSet } from '../models/player.model.ts';
import { Level } from '../scenes/level.ts';
import { Skill } from '../skills/Skill.ts';
import { Teleport } from '../skills/Teleport.ts';
import { Enemy } from './enemy.ts';
import { EnemyEntity } from './enemyEntity.ts';
import { Entity } from './entity.ts';
import { Granade } from '../skills/Granade.ts';

export class Player extends Entity {
  constructor(scene: Level, x: number, y: number, texture?: string) {
    super(scene, x, y, texture, {
      power: 60,
      attackSpeed: 1000,
      health: 100,
      speed: undefined,
    });
    this.setSize(28, 32);
    this.setOffset(10, 16);
    this.setScale(0.8);
    this.setDepth(2);
    this.definedAnimations();

    this.drawHealthBar();

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.alive && this.isWalkable(pointer)) {
        this.setY(pointer.y);
      }
    });

    this.skills = [new Teleport(this.scene, this, 5000), new Granade(this.scene, this, 1000)];
    this.scene.state.setPlayerState({
      xp: this.experience,
      xpToLvlUp: this.experienceToNextLevel[this.level + 1],
      lvl: this.level,
    });
  }

  public skillsSet: SkillsSet = {
    primary: PrimarySkill.LASER,
    secondary: SecondarySkill.TELEPORT,
  };

  public skills: Skill[] = [];

  public healthBar?: Phaser.GameObjects.Rectangle;

  public level: number = 1;

  public experience: number = 0;

  private experienceModifier = 2;

  public experienceToNextLevel = Array.from(new Array(100)).reduce(
    (acc: { [level: string]: number }, _, index) => {
      const level = index + 2;

      return {
        ...acc,
        [level]: level === 2 ? 100 : index * 100 * this.experienceModifier,
      };
    },
    {} as { [level: string]: number },
  );

  public credits: number = 0;

  public update() {
    if (!this.alive) {
      return;
    }

    if (this.healthBar) {
      this.healthBar!.x = this.x;
      this.healthBar!.y = this.y - this.height / 2;
    }
  }

  private definedAnimations() {
    this.scene.anims.create({
      key: 'down',
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
        start: 0,
        end: 2,
      }),
      frameRate: 9,
    });

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
        start: 12,
        end: 14,
      }),
      frameRate: 9,
    });
    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
        start: 24,
        end: 26,
      }),
      frameRate: 9,
    });
    this.scene.anims.create({
      key: 'up',
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, {
        start: 36,
        end: 38,
      }),
      frameRate: 9,
    });
  }

  private drawHealthBar() {
    this.healthBar = this.scene.add.rectangle(0, 0, this.width, 5, 0x4287f5);
  }

  public takeDamage(amount: number) {
    super.takeDamage(amount);
    this.healthBar!.width = this.width * (this.health / this.maxHealth);

    if (this.health <= 0) {
      this.die();
    }
  }

  public die() {
    super.die();
    this.destroy();
  }

  private isWalkable(pointer: Phaser.Input.Pointer): boolean {
    return (
      !!this.scene.map.getTileAtWorldXY(
        pointer.x,
        pointer.y - this.displayHeight / 2,
        undefined,
        undefined,
        this.scene.walkableLayer,
      ) &&
      !!this.scene.map.getTileAtWorldXY(
        pointer.x,
        pointer.y + this.displayHeight / 2,
        undefined,
        undefined,
        this.scene.walkableLayer,
      )
    );
  }

  public teleport(x: number, y: number) {
    const tp = this.skills.find((s) => s instanceof Teleport) as Teleport;
    if (tp) {
      tp.activate(x, y);
    }
  }

  public granade(x: number, y: number, player: Player, enemy: EnemyEntity) {
    const granade = this.skills.find((s) => s instanceof Granade) as Granade;

    if (granade) {
      granade.activate(x, y, player, enemy);
    }
  }

  public earnExperience(amount: number) {
    this.experience += amount;
    if (this.experience >= this.experienceToNextLevel[this.level + 1]) {
      this.lvlUp();
    }
    this.scene.state.setPlayerState({
      xp: this.experience,
    });
  }

  public earnCredits(amount: number) {
    this.credits += amount;
    // console.log('credits', this.credits);
  }

  public spendCredits(amount: number) {
    this.credits -= amount;
  }

  public lvlUp() {
    this.level += 1;
    this.experience = 0;
    this.scene.state.setPlayerState({
      lvl: this.level,
      xpToLvlUp: this.experienceToNextLevel[this.level + 1],
    });
  }
}
