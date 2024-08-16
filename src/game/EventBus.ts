import { Events } from 'phaser';

export class MyEventBus extends Events.EventEmitter {
  removeListenerByKeys(names: string[], context: unknown) {
    names.forEach((name) => this.removeListener(name, undefined, context));
  }
}

export const EventBus = new MyEventBus();
