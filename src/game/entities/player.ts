import Phaser from 'phaser';
import { PrimarySkill, SecondarySkill, SkillsSet } from '../models/player.model.ts';
import { Level } from '../scenes/level.ts';
import { Teleport } from '../skills/Teleport.ts';
import { Entity } from './entity.ts';

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

    this.teleportSkill = new Teleport(this.scene, this, 1000);
  }

  public skillsSet: SkillsSet = {
    primary: PrimarySkill.LASER,
    secondary: SecondarySkill.TELEPORT,
  };

  public teleportSkill!: Teleport;

  public healthBar?: Phaser.GameObjects.Rectangle;

  public update(delta: number) {
    if (!this.alive) {
      return;
    }

    this.movementsController(delta);

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

  private movementsController(delta: number) {
    // const keyA = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // const keyD = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    // const keyFour = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    // const velocity = (delta / 1000) * this.speed;
    // if (keyA.isDown) {
    //   this.play('left', true);
    //   this.setVelocity(-velocity * this.speed, 0);
    // } else if (keyD.isDown) {
    //   this.play('right', true);
    //   this.setVelocity(velocity * this.speed, 0);
    // } else {
    //   this.setVelocity(0, 0);
    //   this.stop();
    // }
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
    this.teleportSkill.activate(x, y);
  }
}
