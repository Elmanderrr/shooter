import { forwardRef, useLayoutEffect, useRef } from 'react';
import initGame from './main';

export interface RefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}


export const PhaserGame = forwardRef<RefPhaserGame>((_, ref) => {
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() => {
        if (!game.current) {
            game.current = initGame('game-container');
        }
    }, [ref]);


    return (
        <div id="game-container"></div>
    );

});
