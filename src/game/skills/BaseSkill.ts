import { Entity } from '../entities/entity.ts';
import { Level } from '../scenes/level.ts';

export abstract class BaseSkill {
  constructor(
    protected scene: Level,
    protected entity: Entity,
    cooldown: number,
  ) {
    this.cooldown = cooldown;
  }

  public cooldown: number;

  public lastUsedTime: number = -Infinity;

  /**
   * Method to check if the skill is ready to be used
   * @returns boolean - true if the skill can be used, otherwise false
   */
  public get ready(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastUsedTime >= this.cooldown;
  }

  protected use() {
    if (this.ready) {
      this.lastUsedTime = Date.now();
    } else {
      const remainToReady = Date.now() - this.lastUsedTime;

      console.log(`teleport is on cooldown. ${(this.cooldown - remainToReady) / 1000} s left`);
    }
  }

  /**
   * Abstract method to define the skill's behavior.
   * Must be implemented by subclasses.
   */
  protected abstract activate(...args: unknown[]): void;
}
