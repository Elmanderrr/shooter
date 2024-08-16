import Phaser from 'phaser';
import { Level } from '../../scenes/level.ts';
import { AUDIO } from '../../utils/constats.ts';
import { EnemyEntity } from '../enemyEntity.ts';
import { Entity } from '../entity.ts';
import { Orc } from '../orc.ts';

export interface LaserConfig {
  /**
   * Through how many enemies can it go through at every shot
   */
  penetration: number;

  power: number;
}

export class Laser extends Phaser.GameObjects.Rectangle {
  constructor(scene: Level, x: number, y: number, config: LaserConfig) {
    super(scene, x, y, 100, 1, 0xff1400);
    Object.assign(this, config);

    this.postFX.addGlow(this.fillColor, 4, 0, false, 0.4, 10);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setVisible(false);
    this.audio.setVolume(0.1);
    (this.body as Phaser.Physics.Arcade.Body).setEnable(false);
  }

  public power!: number;

  public penetration!: number;

  public penetrationLeft = this.penetration;

  private lastLaserHits: Map<Orc, number> = new Map();

  private audio = this.scene.sound.add(AUDIO.LASER);

  public fire(xDestination: number, target: Entity, duration: number) {
    this.audio.play();
    this.reset(target);
    this.resetPenetration();
    this.scene.tweens.add({
      targets: this,
      x: xDestination + this.width,
      duration,
    });
  }

  private reset(target: Entity) {
    this.x = target.x;
    this.y = target.y;
    this.scene.tweens.killTweensOf(this);
    this.setVisible(true);
    (this.body as Phaser.Physics.Arcade.Body).setEnable(true);
  }

  private resetPenetration() {
    this.penetrationLeft = this.penetration;
  }

  public reducePenetration() {
    this.penetrationLeft -= 1;
  }

  public hasPenetrationPower(): boolean {
    return this.penetrationLeft > 0;
  }

  public onCollide(enemy: EnemyEntity) {
    if (!this.hasPenetrationPower()) {
      return;
    }

    const enemyLastHitTime = this.lastLaserHits.get(enemy) || 0;

    if (this.scene.time.now > enemyLastHitTime && enemy.alive) {
      this.lastLaserHits.set(enemy, this.scene.time.now + 500);
      enemy.takeDamage(this.power);
      this.reducePenetration();
    } else if (!enemy.alive) {
      this.lastLaserHits.delete(enemy);
    }
  }
}
