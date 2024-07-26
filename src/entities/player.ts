import Phaser from 'phaser';
import { Level } from '../scenes/level.ts';
import { Entity } from './entity.ts';

export class Player extends Entity {
  private moveSpeed = 90;

  public idle: boolean | undefined = undefined;

  public health = 100;

  public alive = true;

  public remainedHealth = this.health;

  public healthBar?: Phaser.GameObjects.Rectangle;

  public attackSpeed = 600; // ms

  constructor(scene: Level, x: number, y: number, texture?: string) {
    super(scene, x, y, texture);
    this.setSize(28, 32);
    this.setOffset(10, 16);
    this.setScale(0.8);
    this.definedAnimations();

    this.drawHealthBar();

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const notWalkable = this.isWalkable(pointer);

      if (!notWalkable) {
        this.x = pointer.x;
      }
    });
  }

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
    const keyA = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const keyD = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const velocity = (delta / 1000) * this.moveSpeed;

    if (keyA.isDown) {
      this.play('left', true);
      this.setVelocity(-velocity * this.moveSpeed, 0);
      this.idle = false;
    } else if (keyD.isDown) {
      this.play('right', true);
      this.setVelocity(velocity * this.moveSpeed, 0);
      this.idle = false;
    } else {
      this.setVelocity(0, 0);
      this.stop();
      this.idle = true;
    }
  }

  public hit(amount: number) {
    this.remainedHealth -= amount;
    this.healthBar!.width = this.width * (this.remainedHealth / this.health);

    if (this.remainedHealth <= 0) {
      this.die();
    }
  }

  private die() {
    this.destroy();
    this.alive = false;
  }

  private isWalkable(pointer: Phaser.Input.Pointer): boolean {
    return (
      !!this.scene.map.getTileAtWorldXY(
        pointer.x - this.width / 2,
        pointer.y,
        undefined,
        undefined,
        this.scene.wallLayer,
      ) ||
      !!this.scene.map.getTileAtWorldXY(
        pointer.x + this.width / 2,
        pointer.y,
        undefined,
        undefined,
        this.scene.wallLayer,
      )?.collides
    );
  }
}
