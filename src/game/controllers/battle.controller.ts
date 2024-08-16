import Phaser from 'phaser';
import { Bullet } from '../entities/bullet/bullet.ts';
import { Bullets } from '../entities/bullet/bullets.ts';
import { EnemyEntity } from '../entities/enemyEntity.ts';
import { Orc } from '../entities/orc.ts';
import { Laser } from '../entities/laser/Laser.ts';
import { Player } from '../entities/player.ts';
import { PrimarySkill, SecondarySkill } from '../models/player.model.ts';
import { Level } from '../scenes/level.ts';
import { Skill } from '../skills/Skill.ts';

export class BattleController {
  constructor(
    private scene: Level,
    private player: Player,
    private enemies: Phaser.GameObjects.Group,
  ) {
    this.bullets = new Bullets(this.scene);
    this.laser = new Laser(this.scene, this.player.x, this.player.y, { penetration: 2, power: 10 });

    this.playerShoot();
    this.bulletsCollider();
  }

  public bullets!: Bullets;

  public laser!: Laser;

  private playerShoot() {
    const timer = this.scene.time.addEvent({
      callback: () => {
        if (this.player.alive && this.enemies.countActive() > 0) {
          if (this.player.busy) {
            return;
          }

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
      const enemy = e as Orc;
      const bullet = b as Bullet;

      if (bullet.active && enemy.alive) {
        bullet.kill();
        enemy.takeDamage(this.player.power);
      }
    });

    this.scene.physics.add.collider(this.enemies, this.laser, (e) => {
      this.laser.onCollide(e as EnemyEntity);
    });
  }

  public useSkill(skill: Skill) {
    if (!this.player.alive) {
      return;
    }

    switch (skill.name) {
      case SecondarySkill.TELEPORT:
        this.usePlayerTeleportAbility();
        break;
      case SecondarySkill.MISSILE:
        this.useMissileAbility();

        break;
      default:
        break;
    }
  }

  private usePlayerTeleportAbility() {
    if (!this.player.alive) {
      return;
    }

    const closest = this.scene.physics.closest(this.player, this.enemies.getChildren()) as Orc;

    if (!closest) {
      return;
    }

    const teleportXDestination = closest.x > this.player.x ? 800 : 150;

    this.player.teleportSkill.activate(teleportXDestination, this.player.y);
  }

  private fireDirection(): 1 | -1 {
    const closest = this.scene.physics.closest(this.player, this.enemies.getChildren()) as Orc;

    return closest && closest.x > this.player.x ? 1 : -1;
  }

  update() {}

  private useMissileAbility() {
    this.player.missileSkill.activate();
    const collider = this.scene.physics.add.overlap(
      this.player.missileSkill.missile,
      this.enemies,
      () => {
        this.player.busy = false;
        this.player.missileSkill.onCollide(this.enemies);
        this.scene.physics.world.removeCollider(collider);
      },
    );
  }

  public destroy() {}
}
