import { EVENTS } from '../utils/events.ts';
import { useState } from 'react';
import { EventBus } from '../EventBus.ts';
import { PlayerState } from '../utils/StateManager.ts';

function GameUI(ref: any) {
  const [playerState, setPlayerState] = useState<PlayerState>(null);

  EventBus.on(EVENTS.PLAYER_STATE_CHANGED, (state: PlayerState) => {
    console.log(state);
    setPlayerState({
      ...playerState,
      ...state,
    });
  });
  return (
    <div>
      killed : {playerState?.killed} <br />
      xp: {playerState?.xp} <br />
      lvl: {playerState?.lvl}
    </div>
  );
}

export default GameUI;
