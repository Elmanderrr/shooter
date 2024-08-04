import { useRef } from 'react';
import { RefPhaserGame, PhaserGame } from './game/PhaserGame';
import GameUI from './game/ui/GameUI.tsx';

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<RefPhaserGame | null>(null);

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
      {/*<div>*/}
      {/*  <GameUI scene={phaserRef} />*/}
      {/*</div>*/}
    </div>
  );
}

export default App;
