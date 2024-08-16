import Phaser from 'phaser';
import { EnemyEntity } from '../entities/enemyEntity.ts';
import { Entity } from '../entities/entity.ts';
import { Level } from '../scenes/level.ts';
import { AUDIO, IMAGES, SPRITES } from '../utils/constats.ts';
import { Skill } from './Skill.ts';
import { SecondarySkill } from '../models/player.model.ts';

export interface MissileConfig {
  cooldown: number;
  splashDistance: number;
  power: number;
}

export class Missile extends Skill {
  constructor(
    scene: Level,
    protected hostEntity: Entity,
    config: MissileConfig,
  ) {
    super(scene, hostEntity, config.cooldown);
    Object.assign(this, config);
    this.explosion = this.scene.physics.add.sprite(0, 0, SPRITES.EXPLOSION);
    this.missile = this.scene.physics.add.image(150, 200, IMAGES.MISSILE);
    this.missile.setVisible(false);
    this.missile.setScale(0.8);
    this.missile.setBodySize(30, 30);

    this.explosion.setScale(0.4);
    this.explosion.setVisible(false);
    this.explosion.setDepth(2);

    this.crosshair = this.scene.add.image(100, 200, 'crosshair');
    this.crosshair.setScale(0.5);
    this.crosshair.setVisible(false);
    this.crosshair.setDepth(2);
    this.explosionSound.setVolume(0.5);
    this.flightSound.setVolume(0.1);
  }

  private explosionSound = this.scene.sound.add(AUDIO.EXPLOSION);
  private flightSound = this.scene.sound.add(AUDIO.MISSILE_FLIGHT);

  name = SecondarySkill.MISSILE;

  iconPath = './assets/elements/skills/missile.png';

  hotKey = '2';

  public splashDistance!: number;

  public power!: number;

  private explosion!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  public missile!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  private crosshair!: Phaser.GameObjects.Image;

  public activate(): void {
    if (this.ready) {
      this.activateCrosshairCursor();
    }
  }

  private launch(destinationX: number, destinationY: number): void {
    this.missile.setVisible(true);
    this.missile.setPosition(this.hostEntity.x, this.hostEntity.y);
    const rotation = Phaser.Math.Angle.Between(
      this.hostEntity.x,
      this.hostEntity.y,
      destinationX,
      destinationY,
    );
    const angle = Phaser.Math.RadToDeg(rotation);

    this.missile.angle = (angle < 0 ? angle + 360 : angle) + 90;

    this.scene.physics.velocityFromRotation(rotation, 500, this.missile.body.velocity);
    this.flightSound.play(undefined, { loop: true, delay: 0 });
  }

  private explode(x: number, y: number) {
    this.explosion.setVisible(true);
    this.explosion.setPosition(x, y);
    this.explosionSound.play();
    this.explosion.play('blow').on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.explosion.setVisible(false);
    });
  }

  private activateCrosshairCursor() {
    this.hostEntity.busy = true;
    this.crosshair.setVisible(true);
    this.crosshair.setPosition(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
    this.scene.game.canvas.classList.add('crosshair');
    this.scene.input.on('pointermove', this.onPointerMove);
    this.scene.input.on('pointerup', this.onPointerUp);
    this.scene.input.keyboard!.on('keyup-ESC', () => {
      this.deactivateCrosshairCursor();
    });
  }

  private onPointerMove = ({ x, y }: Phaser.Input.Pointer) => {
    this.crosshair.setPosition(x, y);
  };

  private onPointerUp = ({ x, y }: Phaser.Input.Pointer) => {
    this.launch(x, y);
    super.use();
    this.deactivateCrosshairCursor();
    this.hostEntity.busy = false;
  };

  private deactivateCrosshairCursor() {
    this.scene.game.canvas.classList.remove('crosshair');
    this.scene.input.removeListener('pointermove', this.onPointerMove);
    this.scene.input.removeListener('pointerup', this.onPointerUp);
    this.crosshair.setVisible(false);
  }

  public onCollide(enemies: Phaser.GameObjects.Group) {
    this.flightSound.stop();
    if (!this.explosion.anims.isPlaying) {
      enemies.getChildren().forEach((e) => {
        const en = e as EnemyEntity;
        const distance = this.getMinDistance(en);
        if (distance < this.splashDistance && en.alive) {
          en.takeDamage(this.power, true);
        }
      });

      this.missile.setVisible(false);
      this.explode(this.missile.x, this.missile.y);
    }
  }

  private getMinDistance(enemy: EnemyEntity): number {
    return Math.min(
      ...[
        enemy.getTopLeft(),
        enemy.getLeftCenter(),
        enemy.getRightCenter(),
        enemy.getBottomCenter(),
        enemy.getTopCenter(),
        enemy.getTopRight(),
        enemy.getBottomLeft(),
        enemy.getBottomRight(),
      ].map(({ x, y }) => Phaser.Math.Distance.Between(this.missile.x, this.missile.y, x, y)),
    );
  }
}
