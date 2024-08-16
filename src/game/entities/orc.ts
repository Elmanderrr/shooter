import Phaser from 'phaser';
import { Level } from '../scenes/level.ts';
import { AUDIO } from '../utils/constats.ts';
import { Entity, EntityConfig } from './entity.ts';
import { EnemyEntity, EnemyEntityConfig } from './enemyEntity.ts';

export class Orc extends EnemyEntity {
  constructor(
    scene: Level,
    x: number,
    y: number,
    texture: string,
    entityConfig: EntityConfig,
    enemyConfig: EnemyEntityConfig,
  ) {
    super(
      scene,
      x,
      y,
      texture,
      entityConfig ?? {
        health: 100,
        speed: 50,
        power: 10,
        attackSpeed: 1000,
      },
      enemyConfig ?? {
        reward: {
          credits: 3,
          experience: 10,
        },
        attackRange: 50,
      },
    );

    this.setScale(0.5);
    this.setSize(this.displayWidth, this.displayHeight);
    this.setOffset(35, 35);
    this.play('walking');

    this.on(
      Phaser.Animations.Events.ANIMATION_UPDATE,
      (_: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
        if (frame.textureKey === 'Slashing' && frame.index === 5 && this.attackingTarget) {
          this.attack(this.attackingTarget);
        }
      },
    );
    this.setDepth(1);
    this.punch.setVolume(0.1);
  }

  private punch = this.scene.sound.add(AUDIO.PUNCH);

  update(target: Entity) {
    super.update(target);
  }

  public attack(entity: Entity) {
    super.attack(entity);
    this.punch.play();
  }
}
