import { Entity, EntityConfig } from './entity.ts';
import { Level } from '../scenes/level.ts';
import { Reward } from '../models/general.model.ts';

export interface EnemyEntityConfig {
  reward: Reward;
  attackRange: number;
}
export class EnemyEntity extends Entity {
  constructor(
    scene: Level,
    x: number,
    y: number,
    texture: string,
    config: EntityConfig,
    enemyConfig: EnemyEntityConfig,
  ) {
    super(scene, x, y, texture, config);

    this.reward = enemyConfig.reward;
    this.attackRange = enemyConfig.attackRange;
  }

  public reward: Reward;

  public attackRange: number;
}
