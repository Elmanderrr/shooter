import { EventBus } from '../EventBus.ts';
import { EVENTS } from './events.ts';

export interface PlayerState {
  lvl: number;
  xp: number;
  killed: number;
}

export class StateManager {
  constructor() {}

  player: PlayerState;

  setPlayerState(state: Partial<PlayerState>) {
    this.player = { ...this.player, ...state };
    EventBus.emit(EVENTS.PLAYER_STATE_CHANGED, this.player);
  }
}
