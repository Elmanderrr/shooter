import Phaser from 'phaser';
import PhaserNavMeshPlugin, { PhaserNavMesh } from 'phaser-navmesh/dist/phaser-navmesh/src';
import levelJSON from '../../../public/assets/leve1-horizontal.json';
import { Bullet } from '../entities/bullet/bullet.ts';
import { EnemyEntity } from '../entities/enemyEntity.ts';
import { Orc } from '../entities/orc.ts';
import { Player } from '../entities/player.ts';
import { EventBus } from '../EventBus.ts';
import { AUDIO, LAYERS, SCENES, SIZES, SPRITES } from '../utils/constats.ts';
import { BattleController } from '../controllers/battle.controller.ts';
import { EVENTS } from '../utils/events.ts';
import { StateManager } from '../utils/StateManager.ts';

export class Level extends Phaser.Scene {
  public player!: Player;

  public enemiesGroup!: Phaser.GameObjects.Group;

  public map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  public battleCtrl!: BattleController;

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
    this.createMap();
    this.player = new Player(this, 150, 200, SPRITES.PLAYER, StateManager.playerState);

    this.createEnemies();

    this.battleCtrl = new BattleController(this, this.player, this.enemiesGroup);

    this.setUpPhysics();

    this.cameras.main.fadeIn(500);

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
    window.addEventListener('resize', this.onWindowResize);

    this.events.on('shutdown', () => this.onLevelEnd());

    EventBus.on(EVENTS.ENEMY_DIED, this.onEnemyDied);
  }

  update(_: number, delta: number) {
    this.player.update(delta, this.enemiesGroup);
    this.enemiesGroup.getChildren().forEach((e) => (e as Orc).update(this.player));
    this.battleCtrl.update();
  }

  public newLevel() {
    this.cameras.main.fadeOut(1000);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      EventBus.emit(EVENTS.NEXT_LEVEL);
      StateManager.setGameState({
        level: StateManager.gameState.level + 1,
      });
      this.scene.start();
    });
  }

  private setUpPhysics() {
    this.player.setCollideWorldBounds(true);

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
    const enemiesCount = 12;

    this.enemiesGroup = this.add.group({
      key: SPRITES.ORC.BASE,

      createCallback: (e) => {
        const enemy = e as Orc;
      },
      classType: Orc,
      maxSize: enemiesCount,
      quantity: enemiesCount,
    });
    Phaser.Actions.RandomRectangle(
      this.enemiesGroup.getChildren(),
      new Phaser.Geom.Rectangle(610, 30, 120, 200),
    );
    StateManager.setGameState({ enemiesLeft: this.enemiesGroup.countActive() });
  }

  private onLevelEnd() {
    this.battleCtrl.destroy();
    this.sys.game.scale.removeListener('resize');
    window.removeEventListener('resize', this.onWindowResize);
    this.enemiesGroup.destroy();
    EventBus.removeListener(EVENTS.ENEMY_DIED, this.onEnemyDied);
  }

  private onWindowResize = () => {
    EventBus.emit(EVENTS.RESIZE, this.sys.game.scale);
  };

  private onEnemyDied = (enemy: EnemyEntity) => {
    const enemiesLeft = this.enemiesGroup.countActive();
    this.player.earnExperience(enemy.reward.experience);
    this.player.earnCredits(enemy.reward.credits);

    StateManager.setPlayerState({
      killed: StateManager.playerState.killed + 1,
    });

    StateManager.setGameState({ enemiesLeft });

    if (enemiesLeft === 0) {
      this.newLevel();
    }
  };

  public gameOver() {
    this.sound.add(AUDIO.WASTED).play();

    const gameOverText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'WASTED',
      {
        fontSize: '32px',
        fontStyle: 'bold',
        color: 'red',
      },
    );

    gameOverText.setOrigin(0.5, 0.5);
    gameOverText.setAlpha(0);

    this.tweens.add({
      targets: gameOverText,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2',
    });

    this.tweens.addCounter({
      from: 32,
      to: 84,
      onUpdate: function (tween) {
        gameOverText.setFontSize(tween.getValue());
      },
    });
  }
}
