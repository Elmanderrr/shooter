import Phaser from 'phaser';
import { EventBus } from '../EventBus.ts';
import { SCENES } from '../utils/constats.ts';
import { EVENTS } from '../utils/events.ts';

export class Start extends Phaser.Scene {
  constructor() {
    super(SCENES.START);
  }

  create() {
    EventBus.emit(EVENTS.CURRENT_SCENE_READY, this);
    this.changeScene();
  }

  changeScene() {
    this.scene.start(SCENES.FIRST);
  }
}
