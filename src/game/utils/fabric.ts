import { random } from 'lodash-es';
import { Orc } from '../entities/orc.ts';
import { Level } from '../scenes/level.ts';
import { SIZES, SPRITES } from './constats.ts';

export class Fabric {
  static generateEnemies(scene: Level, amount: number) {
    const xRange = [3, 7];
    const yRange = [2, 7];

    const enemies = [];

    for (let i = 0; i < amount; i++) {
      enemies.push(
        new Orc(
          scene,
          random(xRange[0] * SIZES.TILE, xRange[1] * SIZES.TILE),
          random(yRange[0] * SIZES.TILE, yRange[1] * SIZES.TILE),
          SPRITES.BOAR,
          random(30, 70),
        ),
      );
    }

    return enemies;
  }
}
