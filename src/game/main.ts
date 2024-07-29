import PhaserNavMeshPlugin from 'phaser-navmesh';
import { Level } from './scenes/level.ts';
import { Game } from 'phaser';
import { SIZES } from './utils/constats.ts';
import levelJSON from '../../public/assets/leve1-horizontal.json';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: levelJSON.width * SIZES.TILE,
    height: levelJSON.height * SIZES.TILE,
    title: 'shooter',
    backgroundColor: 'orange',
    scene: [Level],
    plugins: {
        scene: [
            {
                key: 'PhaserNavMeshPlugin',
                plugin: PhaserNavMeshPlugin,
                mapping: 'navMeshPlugin',
                start: true,
            },
        ],
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
    },
};

const initGame = (parent: string) => new Game({ ...config, parent });

export default initGame;
