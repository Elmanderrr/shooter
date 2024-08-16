import Phaser from 'phaser';
import { EventBus } from '../EventBus.ts';
import { SIZES } from '../utils/constats.ts';
import { EVENTS } from '../utils/events.ts';
import { Entity, EntityConfig } from './entity.ts';
import { Level } from '../scenes/level.ts';
import { Position, Reward } from '../models/general.model.ts';

export interface EnemyEntityConfig {
  reward: Reward;
  attackRange: number;
}

export class EnemyEntity extends Entity {
  constructor(
    scene: Level,
    x: number,
    y: number,
    texture: string,
    config: EntityConfig,
    enemyConfig: EnemyEntityConfig,
  ) {
    super(scene, x, y, texture, config);

    this.reward = enemyConfig.reward;
    this.attackRange = enemyConfig.attackRange;
    this.drawHealthBar();
  }

  public reward: Reward;

  public attackRange: number;

  public attackingTarget?: Entity;

  private pathToTarget: Position[] | null = [];

  private destination?: Position;

  public healthBar!: Phaser.GameObjects.Rectangle;

  protected findTargetAndFollow(target: Entity) {
    const { x, y } = target;
    this.pathToTarget = this.scene.phaserNavMesh.findPath({ x: this.x, y: this.y }, { x, y });

    this.destination = this.pathToTarget?.shift();
    if (this.destination) {
      this.moveEnemyTo(this.destination);
    }
  }

  protected moveEnemyTo(destination: Position) {
    const distance = Phaser.Math.Distance.Between(this.x, this.y, destination.x, destination.y);
    this.scene.tweens.add({
      targets: this,
      x: destination.x,
      y: destination.y,
      duration: (distance / this.speed) * 1000,
    });
  }

  private prevX!: number;

  private direction!: 'left' | 'right';

  private checkDirection = () => {
    if (this.x > this.prevX) {
      this.direction = 'right';
    } else {
      this.direction = 'left';
    }
    this.prevX = this.x;
  };

  public update(target: Entity) {
    if (!this.alive) {
      return;
    }

    this.checkDirection();

    const distance = Phaser.Math.Distance.Between(target.x, target.y, this.x, this.y);
    const inAttackRange = distance <= this.attackRange;

    this.setFlipX(target.x < this.x);

    if (!this.busy) {
      // stop at attack range otherwise follow player
      if (inAttackRange) {
        this.scene.tweens.killTweensOf(this);
        this.pathToTarget = [];
        this.destination = undefined;
        this.handleAttack(target);
      } else {
        this.play('walking', true);
        this.findTargetAndFollow(target);
      }
    }

    // intermediate mesh was reached, moving to the next target if exist
    if (this.intermediateTargetReached()) {
      const newDestination = this.pathToTarget?.shift();

      if (newDestination) {
        this.destination = newDestination;
        this.moveEnemyTo(this.destination);
      }
    }

    if (this.healthBar) {
      this.healthBar!.x = this.x;
      this.healthBar!.y = this.y - 32;
    }
  }

  private handleAttack(target: Entity) {
    if (!this.attackingTarget) {
      this.attackingTarget = target;
    }
    const frameRate = 11 / (this.attackSpeed / 1000);
    this.play({ key: 'slashing', frameRate }, true);
  }

  private intermediateTargetReached() {
    const targetTileX = Math.floor(this.x / SIZES.TILE);
    const targetTileY = Math.floor(this.y / SIZES.TILE);
    const destinationTileX = Math.floor((this.destination?.x || 0) / SIZES.TILE);
    const destinationTileY = Math.floor((this.destination?.y || 0) / SIZES.TILE);

    return targetTileY === destinationTileY && targetTileX === destinationTileX;
  }

  override die() {
    super.die();
    this.play('dying');
    this.scene.tweens.killTweensOf(this);
    this.pathToTarget = [];
    this.destination = undefined;
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy();
      this.healthBar.destroy();
      EventBus.emit(EVENTS.ENEMY_DIED, this);
    });
  }

  private drawHealthBar() {
    this.healthBar = this.scene.add.rectangle(0, 0, 32, 5, 0x4287f5);
    this.healthBar.setDepth(2);
  }

  public takeDamage(amount: number, bounce: boolean = false) {
    super.takeDamage(amount);
    if (bounce && this.health > 0) {
      this.pushBack();
    }
    const newWidthValue = 32 * (this.health / this.maxHealth);
    this.healthBar.width = newWidthValue < 0 ? 0 : newWidthValue;

    if (this.health <= 0) {
      this.die();
    }
  }

  private pushBack() {
    this.busy = true;
    this.scene.tweens.killTweensOf(this);
    this.pathToTarget = [];
    this.destination = undefined;
    this.stop();
    this.scene.tweens.add({
      targets: this,
      x: this.x + (this.direction === 'left' ? +20 : -20),
      y: this.y + Phaser.Math.Between(-20, 20),
      duration: 500,
      onComplete: () => {
        this.busy = false;
      },
    });
  }
}
