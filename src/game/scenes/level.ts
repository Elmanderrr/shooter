import Phaser from 'phaser';
import PhaserNavMeshPlugin, { PhaserNavMesh } from 'phaser-navmesh/dist/phaser-navmesh/src';
import levelJSON from '../../../public/assets/leve1-horizontal.json';
import { Bullet } from '../entities/bullet/bullet.ts';
import { Enemy } from '../entities/enemy.ts';
import { Player } from '../entities/player.ts';
import { EventBus } from '../EventBus.ts';
import { LAYERS, SCENES, SIZES, SPRITES } from '../utils/constats.ts';
import { BattleController } from '../controllers/battle.controller.ts';
import { EVENTS } from '../utils/events.ts';
import { StateManager } from '../utils/StateManager.ts';

export class Level extends Phaser.Scene {
  public player!: Player;

  public enemiesGroup!: Phaser.GameObjects.Group;

  public map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  public battleCtrl!: BattleController;

  public state: StateManager = new StateManager();

  public navMeshPlugin: PhaserNavMeshPlugin = this['navMeshPlugin'];

  public phaserNavMesh!: PhaserNavMesh;

  public nonWalkableLayer!: Phaser.Tilemaps.TilemapLayer;
  public walkableLayer!: Phaser.Tilemaps.TilemapLayer;
  public obstaclesLayer!: Phaser.Tilemaps.TilemapLayer;
  public waterLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super(SCENES.FIRST);
  }

  create() {
    this.animations();
    this.createMap();
    this.player = new Player(this, 5 * SIZES.TILE, 200, SPRITES.PLAYER);

    this.createEnemies();

    this.battleCtrl = new BattleController(this, this.player, this.enemiesGroup);

    this.setUpPhysics();

    this.state.setPlayerState({
      lvl: this.player.level,
      xp: this.player.experience,
      killed: 0,
    });

    // building meshes for pathfinding
    this.phaserNavMesh = this.navMeshPlugin.buildMeshFromTilemap(
      'mesh',
      this.map,
      [this.obstaclesLayer],
      undefined,
      Math.floor(SIZES.TILE / 3),
    );
    EventBus.emit(EVENTS.CURRENT_SCENE_READY, this);
    EventBus.emit(EVENTS.RESIZE, this.sys.game.scale);
    this.sys.game.scale.on('resize', () => {
      EventBus.emit(EVENTS.RESIZE, this.sys.game.scale);
    });
  }

  update() {
    this.player.update();
    this.enemiesGroup.getChildren().forEach((e) => (e as Enemy).update(this.player));
    this.battleCtrl.update();
  }

  private setUpPhysics() {
    // this.player.setCollideWorldBounds(true);

    if (this.nonWalkableLayer) {
      this.physics.add.collider(this.player, this.nonWalkableLayer);
      this.physics.add.collider(this.enemiesGroup, this.nonWalkableLayer);
      this.physics.add.collider(this.enemiesGroup, this.nonWalkableLayer);
    }

    this.physics.add.collider(this.obstaclesLayer, this.battleCtrl.bullets, (b) => {
      const bullet = b as Bullet;

      bullet.kill();
    });
  }

  private createMap() {
    this.map = this.make.tilemap({ key: 'map' });

    this.tileset = this.map.addTilesetImage(
      levelJSON.tilesets[0].name,
      SCENES.FIRST,
      SIZES.TILE,
      SIZES.TILE,
    )!;

    this.waterLayer = this.map.createLayer(LAYERS.WATER, this.tileset)!;
    this.walkableLayer = this.map.createLayer(LAYERS.WALKABLE, this.tileset)!;
    this.obstaclesLayer = this.map.createLayer(LAYERS.OBSTACLES, this.tileset)!;

    this.obstaclesLayer?.setCollisionByExclusion([-1]);
  }

  private createEnemies() {
    this.enemiesGroup = this.add.group({
      key: SPRITES.ORC.BASE,
      maxSize: 12,
      removeCallback: (e) => {
        const enemy = e as Enemy;

        this.player.earnExperience(enemy.reward.experience);
        this.player.earnCredits(enemy.reward.credits);
        this.state.setPlayerState({
          killed: this.enemiesGroup.getTotalFree(),
        });
      },
      classType: Enemy,
      quantity: 12,
      createCallback: (p) => {
        (p as Enemy).player = this.player;
      },
    });
    Phaser.Actions.RandomRectangle(
      this.enemiesGroup.getChildren(),
      new Phaser.Geom.Rectangle(610, 30, 120, 200),
    );
  }

  private animations() {
    this.anims.create({
      key: 'walking',
      frames: this.anims.generateFrameNames(SPRITES.ORC.BASE, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Running_',
        suffix: '',
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'dying',
      frames: this.anims.generateFrameNames(SPRITES.ORC.DYING, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Dying_',
        suffix: '',
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'slashing',
      frames: this.anims.generateFrameNames(SPRITES.ORC.SLASHING, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Slashing_',
        suffix: '',
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('exp', {
        prefix: 'Explosion_',
        start: 24,
        end: 26,
      }),
      frameRate: 9,
    });
  }
}
