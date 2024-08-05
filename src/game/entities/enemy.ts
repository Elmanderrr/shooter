import Phaser from 'phaser';

import { Position, Reward } from '../models/general.model.ts';
import { Level } from '../scenes/level.ts';
import { SIZES } from '../utils/constats.ts';
import { Entity, EntityConfig } from './entity.ts';
import { Player } from './player.ts';
import ANIMATION_COMPLETE = Phaser.Animations.Events.ANIMATION_COMPLETE;
import { EnemyEntity, EnemyEntityConfig } from './enemyEntity.ts';

export class Enemy extends EnemyEntity {
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
          credits: 1,
          experience: 10,
        },
        attackRange: 50,
      },
    );

    this.setScale(0.5);
    this.setSize(this.displayWidth, this.displayHeight);
    this.setOffset(35, 35);
    this.play('walking');
    this.setDepth(1);
    this.drawHealthBar();
  }

  public player!: Player;

  private pathToPlayer: Position[] | null = [];

  private destination?: Position;

  private healthBar!: Phaser.GameObjects.Rectangle;

  public timer?: Phaser.Time.TimerEvent;

  update(player: Player) {
    if (!this.alive) {
      return;
    }
    const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    const inAttackRange = distance <= this.attackRange;
    this.setFlipX(this.player.x < this.x);

    // stop at attack range otherwise follow player
    if (inAttackRange) {
      this.scene.tweens.killTweensOf(this);
      this.pathToPlayer = [];
      this.destination = undefined;
      this.play('slashing', true);
      this.handleAttack(player);
    } else {
      this.play('walking', true);
      this.timer?.destroy();
      this.timer = undefined;
      this.findPlayerAndFollow(player);
    }

    // intermediate mesh was reached, moving to the next target if exist
    if (this.intermediateTargetReached()) {
      const newDestination = this.pathToPlayer?.shift();

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

  private findPlayerAndFollow(p: Player) {
    const { x, y } = p;
    this.pathToPlayer = this.scene.phaserNavMesh.findPath({ x: this.x, y: this.y }, { x, y });

    this.destination = this.pathToPlayer?.shift();
    if (this.destination) {
      this.moveEnemyTo(this.destination);
    }
  }

  private moveEnemyTo(destination: Position) {
    const distance = Phaser.Math.Distance.Between(this.x, this.y, destination.x, destination.y);
    // todo play with physical methods accelerateTo, goTo etc
    this.scene.tweens.add({
      targets: this,
      x: destination.x,
      y: destination.y,
      duration: (distance / this.speed) * 1000,
    });
  }

  private intermediateTargetReached() {
    const targetTileX = Math.floor(this.x / SIZES.TILE);
    const targetTileY = Math.floor(this.y / SIZES.TILE);
    const destinationTileX = Math.floor((this.destination?.x || 0) / SIZES.TILE);
    const destinationTileY = Math.floor((this.destination?.y || 0) / SIZES.TILE);

    return targetTileY === destinationTileY && targetTileX === destinationTileX;
  }

  die() {
    super.die();
    const anim = this.play('dying');
    anim.on(ANIMATION_COMPLETE, () => {
      this.destroy();
      this.healthBar.destroy();
    });
    this.scene.tweens.killTweensOf(this);
    this.pathToPlayer = [];
    this.destination = undefined;
    this.timer?.destroy();
  }

  private handleAttack(player: Player) {
    if (!this.timer) {
      this.timer = this.scene.time.addEvent({
        callback: () => {
          this.attack(player);
        },
        callbackScope: this,
        delay: this.attackSpeed,
        loop: true,
      });
    }
  }

  public takeDamage(amount: number) {
    super.takeDamage(amount);
    const newWidthValue = 32 * (this.health / this.maxHealth);
    this.healthBar.width = newWidthValue < 0 ? 0 : newWidthValue;

    if (this.health <= 0) {
      this.die();
    }
  }

  private drawHealthBar() {
    this.healthBar = this.scene.add.rectangle(0, 0, 32, 5, 0x4287f5);
    this.healthBar.setDepth(2);
  }
}
