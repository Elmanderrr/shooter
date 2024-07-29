import { useRef } from 'react';
import { RefPhaserGame, PhaserGame } from './game/PhaserGame';
import GameUI from './game/ui/GameUI.tsx';

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<RefPhaserGame | null>(null);
    
    const logScene = () => {

        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            if (scene) {
                console.log(scene);
            }
        }
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef}  />
            <div>
                <GameUI scene={phaserRef.current}/>
            </div>
        </div>
    );
}

export default App;
