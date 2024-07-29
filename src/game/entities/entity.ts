import Phaser from 'phaser';
import { Level } from '../scenes/level.ts';

export interface EntityConfig {
  health: number;
  power: number;
  speed: number;
  attackSpeed: number;
}

// create base method like health, power, attackSpeed etc.
export abstract class Entity extends Phaser.Physics.Arcade.Sprite {
  protected constructor(
    public scene: Level,
    x: number,
    y: number,
    texture?: string,
    config?: EntityConfig,
  ) {
    super(scene, x, y, texture || '');
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    Object.assign(this, config || {});
    this.maxHealth = this.health;
  }

  public maxHealth!: number;

  public health!: number;

  public power!: number;
  public alive = true;
  public attackSpeed!: number;
  public speed!: number;

  public takeDamage(amount: number) {
    this.health -= amount;
  }

  public attack(entity: Entity) {
    if (entity.alive) {
      entity.takeDamage(this.power);
    }
  }

  public die() {
    this.alive = false;
  }
}
