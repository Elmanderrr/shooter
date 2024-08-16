import { useRef } from 'react';
import { RefPhaserGame, PhaserGame } from './game/PhaserGame';

export interface GameScale {
  width: number;
  height: number;
  x: number;
  y: number;
}

function App() {
  const phaserRef = useRef<RefPhaserGame | null>(null);

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App;
