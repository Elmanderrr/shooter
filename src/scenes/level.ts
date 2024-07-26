import { throttle } from 'lodash-es';
import Phaser from 'phaser';
import PhaserNavMeshPlugin, { PhaserNavMesh } from 'phaser-navmesh/dist/phaser-navmesh/src';
import levelJSON from '../../public/assets/level1.json';
import { Bullet } from '../entities/bullet/bullet.ts';
import { Bullets } from '../entities/bullet/bullets.ts';
import { Enemy } from '../entities/enemy.ts';
import { Player } from '../entities/player.ts';
import { LAYERS, LEVELS, SIZES, SPRITES } from '../utils/constats.ts';

export class Level extends Phaser.Scene {
  public player!: Player;

  public enemiesGroup!: Phaser.GameObjects.Group;

  public bullets!: Bullets;

  public map!: Phaser.Tilemaps.Tilemap;

  private tileset!: Phaser.Tilemaps.Tileset;

  public navMeshPlugin: PhaserNavMeshPlugin = this['navMeshPlugin'];

  public phaserNavMesh!: PhaserNavMesh;

  public wallLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super('level1');
  }

  preload() {
    this.load.image(LEVELS.FIRST, '/assets/level1.png');
    this.load.image(SPRITES.BULLET, '/assets/elements/bullets/01.png');
    this.load.tilemapTiledJSON('map', '/assets/level1.json');
    this.load.spritesheet(SPRITES.PLAYER, '/assets/characters/player.png', {
      frameWidth: SIZES.PLAYER.WIDTH,
      frameHeight: SIZES.PLAYER.HEIGHT,
    });
    this.load.atlas(
      SPRITES.ORC,
      '/assets/characters/texture.png',
      '/assets/characters/texture.json',
    );
    this.load.spritesheet(SPRITES.BOAR, '/assets/characters/boar.png', {
      frameWidth: SIZES.ENEMY.WIDTH,
      frameHeight: SIZES.ENEMY.HEIGHT,
    });
  }

  create() {
    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNames(SPRITES.ORC, {
        start: 1,
        end: 11,
        zeroPad: 3,
        prefix: '0_Orc_Running_',
        suffix: '',
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.createMap();

    this.createEnemies();
    this.player = new Player(this, 5 * SIZES.TILE, 19 * SIZES.TILE, SPRITES.PLAYER);
    this.bullets = new Bullets(this);

    this.setUpPhysics();
    this.setUpEvents();

    // building meshes for pathfinding
    this.phaserNavMesh = this.navMeshPlugin.buildMeshFromTilemap(
      'mesh',
      this.map,
      [this.wallLayer],
      undefined,
      Math.floor(SIZES.TILE / 3),
    );
  }

  update(_: number, delta: number) {
    this.player.update(delta);
    this.enemiesGroup.getChildren().forEach((e) => (e as Enemy).update(this.player));
  }

  private createWallsLayer(tileset: Phaser.Tilemaps.Tileset) {
    const walls = this.map.createLayer(LAYERS.WALLS, tileset!);

    if (walls) {
      this.wallLayer = walls;
      this.wallLayer?.setCollisionByExclusion([-1]);
    }
  }

  private setUpPhysics() {
    this.player.setCollideWorldBounds(true);

    if (this.wallLayer) {
      this.physics.add.collider(this.player, this.wallLayer);
      this.physics.add.collider(this.enemiesGroup, this.wallLayer);
      this.physics.add.collider(this.enemiesGroup, this.wallLayer);
    }

    this.physics.add.overlap(this.enemiesGroup, this.bullets, (e, b) => {
      const enemy = e as Enemy;
      const bullet = b as Bullet;

      if (bullet.active) {
        bullet.kill();
        enemy.die();
      }
    });

    this.physics.add.collider(this.wallLayer, this.bullets, (b) => {
      const bullet = b as Bullet;

      bullet.kill();
    });
  }

  private setUpEvents() {
    this.time.addEvent({
      callback: () => {
        this.bullets.fireBullet(this.player.x, this.player.y);
      },
      callbackScope: this,
      delay: this.player.attackSpeed,
      loop: true,
    });
  }

  private createMap() {
    this.map = this.make.tilemap({ key: 'map' });

    this.tileset = this.map.addTilesetImage(
      levelJSON.tilesets[0].name,
      LEVELS.FIRST,
      SIZES.TILE,
      SIZES.TILE,
    )!;

    this.map.createLayer(LAYERS.GROUND, this.tileset);
    this.createWallsLayer(this.tileset);
  }

  private createEnemies() {
    this.enemiesGroup = this.add.group({
      key: SPRITES.ORC,
      classType: Enemy,
      quantity: 10,
    });
    Phaser.Actions.PlaceOnRectangle(
      this.enemiesGroup.getChildren(),
      new Phaser.Geom.Rectangle(110, 30, 120, 200),
    );
  }
}
