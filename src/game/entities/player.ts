import Phaser from 'phaser';
import { PrimarySkill, SecondarySkill, SkillsSet } from '../models/player.model.ts';
import { Level } from '../scenes/level.ts';
import { Skill } from '../skills/Skill.ts';
import { Teleport } from '../skills/Teleport.ts';
import { PlayerState, StateManager } from '../utils/StateManager.ts';
import { Orc } from './orc.ts';
import { Entity } from './entity.ts';
import { Missile } from '../skills/Missile.ts';

export class Player extends Entity {
  constructor(scene: Level, x: number, y: number, texture: string, playerState: PlayerState) {
    super(scene, x, y, texture, {
      power: 60,
      attackSpeed: 1000,
      health: 100,
      speed: 100,
    });
    Object.assign(this, playerState);
    this.setSize(28, 32);
    this.setOffset(10, 16);
    this.setScale(0.8);
    this.setDepth(2);

    this.drawHealthBar();

    this.skills = [
      new Teleport(this.scene, this, 5000),
      new Missile(this.scene, this, { cooldown: 3000, splashDistance: 50, power: 50 }),
    ];

    StateManager.setPlayerState({
      experience: this.experience,
      xpToLvlUp: this.experienceToNextLevel[this.level + 1],
      level: this.level,
    });
  }

  public get teleportSkill(): Teleport {
    return this.skills.find((s) => s instanceof Teleport) as Teleport;
  }

  public get missileSkill(): Missile {
    return this.skills.find((s) => s instanceof Missile) as Missile;
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

  public update(delta: number, enemies: Phaser.GameObjects.Group) {
    if (!this.alive) {
      return;
    }
    const closest = this.scene.physics.closest(this, enemies?.getChildren()) as Orc;

    this.setFlipX(closest?.x < this.x);

    this.movementsController(delta);

    if (this.healthBar) {
      this.healthBar!.x = this.x;
      this.healthBar!.y = this.y - this.height / 2;
    }
  }

  private drawHealthBar() {
    this.healthBar = this.scene.add.rectangle(0, 0, this.width, 5, 0x4287f5);
  }

  private movementsController(delta: number) {
    const keyW = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyS = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const velocity = (delta / 1000) * this.speed;

    if (keyW.isDown) {
      this.play('down', true);
      this.setVelocity(0, -velocity * this.speed);
    } else if (keyS.isDown) {
      this.play('down', true);
      this.setVelocity(0, velocity * this.speed);
    } else {
      this.setVelocity(0, 0);
      this.stop();
    }
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
    this.scene.gameOver();
    this.destroy();
  }

  public earnExperience(amount: number) {
    this.experience += amount;
    if (this.experience >= this.experienceToNextLevel[this.level + 1]) {
      this.lvlUp();
    }
    StateManager.setPlayerState({
      experience: this.experience,
    });
  }

  public earnCredits(amount: number) {
    this.credits += amount;
    StateManager.setPlayerState({
      credits: this.credits,
    });
  }

  public spendCredits(amount: number) {
    this.credits -= amount;
    StateManager.setPlayerState({
      credits: this.credits,
    });
  }

  public lvlUp() {
    this.level += 1;
    this.experience = 0;
    StateManager.setPlayerState({
      level: this.level,
      xpToLvlUp: this.experienceToNextLevel[this.level + 1],
    });
  }
}
