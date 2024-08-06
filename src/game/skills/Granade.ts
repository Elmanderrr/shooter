import { Enemy } from '../entities/enemy.ts';
import { EnemyEntity } from '../entities/enemyEntity.ts';
import { Entity } from '../entities/entity.ts';
import { Player } from '../entities/player.ts';
import { Level } from '../scenes/level.ts';
import { SPRITES } from '../utils/constats.ts';
import { Skill } from './Skill.ts';
import { SecondarySkill } from '../models/player.model.ts';
import Vector2 = Phaser.Math.Vector2;

export class Granade extends Skill {
  constructor(scene: Level, entity: Entity, cooldown: number) {
    super(scene, entity, cooldown);
    this.scene.anims.create({
      key: 'blow',
      frames: this.scene.anims.generateFrameNames(SPRITES.EXPLOSION, {
        prefix: 'Explosion_',
        start: 1,
        end: 10,
      }),
      repeat: 0,
      frameRate: 19,
    });
    this.explosion = this.scene.physics.add.sprite(0, 0, SPRITES.EXPLOSION);
    this.granade = this.scene.physics.add.image(0, 0, 'test');
    this.explosion.setScale(0.4);
    // this.explosion.setVisible(false);
    this.explosion.setDepth(2);
  }

  name = SecondarySkill.GRENADE;

  iconPath = './assets/elements/skills/teleport2.png';

  hotKey = '3';

  private explosion!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  private granade!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  public activate(x: number, y: number, player: Player, enemy: EnemyEntity): void {
    if (this.ready) {
      this.throwGranade(x, y, player, enemy);

      // this.explode(x, y);
    }
    super.use();
  }

  private throwGranade(x: number, y: number, player: Player, enemy: EnemyEntity): void {
    this.granade.setVisible(true);
    this.granade.setGravityY(1900);
    this.granade.setPosition(player.x, player.y);

    this.scene.physics.velocityFromRotation(
      Phaser.Math.Angle.Between(player.x, player.y, x, y),
      1500,
      this.granade.body.velocity,
    );

    this.scene.physics.add.overlap(this.granade, enemy, (_, e) => {
      if (!this.explosion.anims.isPlaying) {
        this.granade.setVisible(false);
        this.explode((e as EnemyEntity).x, (e as EnemyEntity).y);
      }
    });
  }

  private explode(x: number, y: number) {
    this.explosion.setVisible(true);
    this.explosion.setPosition(x, y);
    this.explosion.play('blow').on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.explosion.setVisible(false);
    });
  }
}
