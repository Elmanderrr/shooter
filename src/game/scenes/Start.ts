import Phaser from 'phaser';
import { EventBus } from '../EventBus.ts';
import { SCENES } from '../utils/constats.ts';

export class Start extends Phaser.Scene {
  constructor() {
    super(SCENES.START);
  }

  create() {
    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start(SCENES.FIRST);
  }
}
