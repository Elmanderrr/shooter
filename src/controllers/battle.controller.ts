import { Level } from '../scenes/level.ts';
import { Player } from '../entities/player.ts';
import Phaser from 'phaser';
import { Bullets } from '../entities/bullet/bullets.ts';
import { Enemy } from '../entities/enemy.ts';
import { Bullet } from '../entities/bullet/bullet.ts';

export class BattleController {
  constructor(
    private scene: Level,
    private player: Player,
    private enemies: Phaser.GameObjects.Group,
  ) {
    this.bullets = new Bullets(this.scene);

    this.playerShoot();
    this.bulletsCollider();
  }

  public bullets!: Bullets;

  private playerShoot() {
    const timer = this.scene.time.addEvent({
      callback: () => {
        if (this.player.alive) {
          this.bullets.fireBullet(this.player.x, this.player.y);
        } else {
          timer.destroy();
        }
      },
      callbackScope: this,

      delay: this.player.attackSpeed,
      loop: true,
    });
  }

  private bulletsCollider() {
    this.scene.physics.add.overlap(this.enemies, this.bullets, (e, b) => {
      const enemy = e as Enemy;
      const bullet = b as Bullet;

      if (bullet.active && enemy.alive) {
        bullet.kill();
        enemy.takeDamage(this.player.power);
      }
    });
  }
}
