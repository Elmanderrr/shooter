import Phaser from 'phaser';
import { Bullet } from '../entities/bullet/bullet.ts';
import { Bullets } from '../entities/bullet/bullets.ts';
import { Enemy } from '../entities/enemy.ts';
import { Laser } from '../entities/laser/Laser.ts';
import { Player } from '../entities/player.ts';
import { PrimarySkill, SecondarySkill } from '../models/player.model.ts';
import { Level } from '../scenes/level.ts';
import { BaseSkill } from '../skills/BaseSkill.ts';
import { SPRITES } from '../utils/constats.ts';

export class BattleController {
  constructor(
    private scene: Level,
    private player: Player,
    private enemies: Phaser.GameObjects.Group,
  ) {
    this.bullets = new Bullets(this.scene);
    this.laser = new Laser(this.scene, this.player.x, this.player.y);

    this.playerShoot();
    this.bulletsCollider();
    this.events();
  }

  public bullets!: Bullets;

  public laser!: Laser;

  private lastLaserHits: Map<Enemy, number> = new Map();

  private playerShoot() {
    const timer = this.scene.time.addEvent({
      callback: () => {
        if (this.player.alive && this.enemies.countActive() > 0) {
          if (this.player.skillsSet.primary === PrimarySkill.AUTO_GUN) {
            this.bullets.fireBullet(this.player.x, this.player.y, this.fireDirection());
          }

          if (this.player.skillsSet.primary === PrimarySkill.LASER) {
            this.laser.fire(
              this.fireDirection() * this.scene.map.widthInPixels,
              this.player,
              this.player.attackSpeed / 2,
            );
          }
        } else {
          timer.destroy();
        }
      },
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

    this.scene.physics.add.collider(this.enemies, this.laser, (e) => {
      const enemy = e as Enemy;

      const enemyLastHitTime = this.lastLaserHits.get(enemy) || 0;

      if (this.scene.time.now > enemyLastHitTime && enemy.alive) {
        this.lastLaserHits.set(enemy, this.scene.time.now + 500);
        enemy.takeDamage(this.player.power);
      } else if (!enemy.alive) {
        this.lastLaserHits.delete(enemy);
      }
    });
  }

  private events() {
    // this.scene.input.keyboard!.on('keyup', (event: KeyboardEvent) => {
    //   if (event.key === '4') {
    //     this.usePlayerTeleportAbility();
    //   }
    // });
  }

  public useSkill(skill: BaseSkill) {
    switch (skill.name) {
      case SecondarySkill.TELEPORT:
        this.usePlayerTeleportAbility();
        break;
      default:
        break;
    }
  }

  private usePlayerTeleportAbility() {
    if (!this.player.alive) {
      return;
    }

    const closest = this.scene.physics.closest(this.player, this.enemies.getChildren()) as Enemy;

    if (!closest) {
      return;
    }

    const teleportXDestination = closest.x > this.player.x ? 800 : 150;

    this.player.teleport(teleportXDestination, this.player.y);
  }

  private fireDirection(): 1 | -1 {
    const closest = this.scene.physics.closest(this.player, this.enemies.getChildren()) as Enemy;

    return closest && closest.x > this.player.x ? 1 : -1;
  }

  update() {
    if (this.enemies.countActive() === 0) {
      this.respawnBossLevel();
    }
  }

  private respawnBossLevel() {
    const boss = new Enemy(
      this.scene,
      500,
      200,
      SPRITES.ORC.BASE,
      {
        health: 500,
        speed: 50,
        power: 50,
        attackSpeed: 2000,
      },
      {
        reward: {
          credits: 5,
          experience: 40,
        },
        attackRange: 50,
      },
    );
    boss.setScale(1);

    this.enemies.add(boss);
  }
}
