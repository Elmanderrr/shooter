import Phaser from 'phaser';

import { Position } from '../models/general.model.ts';
import { Level } from '../scenes/level.ts';
import { SIZES } from '../utils/constats.ts';
import { Entity } from './entity.ts';
import { Player } from './player.ts';

export class Enemy extends Entity {
  constructor(scene: Level, x: number, y: number, texture?: string) {
    super(scene, x, y, texture);
  }

  private speed = 50;

  private pathToPlayer: Position[] | null = [];

  private destination?: Position;

  private attackRange = 30;

  public health = 100;

  public power = 4;

  public alive = true;

  public timer?: Phaser.Time.TimerEvent;

  update(player: Player) {
    if (!this.alive) {
      return;
    }
    const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    const inAttackRange = distance <= this.attackRange;

    // stop at attack range otherwise follow player
    if (inAttackRange) {
      this.scene.tweens.killTweensOf(this);
      this.pathToPlayer = [];
      this.destination = undefined;
      this.handleAttack(player);
    } else {
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
    this.alive = false;
    this.scene.tweens.killTweensOf(this);
    this.pathToPlayer = [];
    this.destination = undefined;
    this.timer?.destroy();
    this.destroy();
  }

  public attack(player: Player) {
    if (player.alive) {
      player.hit(this.power);
    }
  }

  private handleAttack(player: Player) {
    if (!this.timer) {
      this.timer = this.scene.time.addEvent({
        callback: () => {
          this.attack(player);
        },
        callbackScope: this,
        delay: 1000,
        loop: true,
      });
    }
  }
}
