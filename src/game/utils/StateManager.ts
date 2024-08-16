import { EventBus } from '../EventBus.ts';
import { EVENTS } from './events.ts';

export interface PlayerState {
  level: number;
  experience: number;
  xpToLvlUp: number;
  killed: number;
  credits: number;
}

export interface GameState {
  level: number;
  enemiesLeft?: number;
}

export interface StateChange<S> {
  prevState: S;
  newState: S;
}

export class StateManager {
  constructor() {}

  public static playerState: PlayerState = {
    level: 1,
    killed: 0,
    xpToLvlUp: 0,
    experience: 0,
    credits: 0,
  };

  public static gameState: GameState = {
    level: 1,
  };

  public static setPlayerState(state: Partial<PlayerState>) {
    const prevState = { ...this.playerState };
    const newState = { ...prevState, ...state };

    this.playerState = newState;
    EventBus.emit(EVENTS.PLAYER_STATE_CHANGED, { newState, prevState } as StateChange<PlayerState>);
  }

  public static setGameState(state: Partial<GameState>) {
    const prevState = { ...this.gameState };
    const newState = { ...prevState, ...state };
    this.gameState = newState;
    EventBus.emit(EVENTS.GAME_STATE_CHANGED, { newState, prevState } as StateChange<GameState>);
  }
}
