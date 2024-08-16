import { Entity } from '../entities/entity.ts';
import { Level } from '../scenes/level.ts';

export abstract class Skill {
  constructor(
    protected scene: Level,
    protected hostEntity: Entity,
    cooldown: number,
  ) {
    this.cooldown = cooldown;
  }

  abstract name: string;

  abstract iconPath: string;

  abstract hotKey: string;

  public cooldown: number;

  public lastUsedTime: number = -Infinity;

  public skillSubscribers: any[] = [];

  public onActivated(cb: (any) => void) {
    this.skillSubscribers.push(cb);
  }

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
      this.skillSubscribers.forEach((sub) => sub());
    } else {
      console.log(`teleport is on cooldown. ${this.cooldownLeft()} s left`);
    }
  }

  public cooldownLeft() {
    const remainToReady = Date.now() - this.lastUsedTime;

    return this.ready ? 0 : (this.cooldown - remainToReady) / 1000;
  }

  /**
   * Abstract method to define the skill's behavior.
   * Must be implemented by subclasses.
   */
  public abstract activate(...args: unknown[]): void;
}
