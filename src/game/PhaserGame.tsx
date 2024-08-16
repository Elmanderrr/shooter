import { Scene } from 'phaser';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GameScale } from '../App.tsx';
import { EventBus } from './EventBus.ts';
import StartGame from './main';
import { Level } from './scenes/level.ts';
import { Skill } from './skills/Skill.ts';
import { GameUI } from './ui/GameUI.tsx';
import { EVENTS } from './utils/events.ts';
import { GameState, PlayerState, StateChange } from './utils/StateManager.ts';

export interface RefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export interface Props {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<RefPhaserGame, Props>(({ currentActiveScene }, ref) => {
  const game = useRef<Phaser.Game | null>(null!);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [scene, setScene] = useState<Level | null>(null);
  const [gameSize, setGameSize] = useState<GameScale | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame('game-container');

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [ref]);

  useEffect(() => {
    EventBus.on(EVENTS.CURRENT_SCENE_READY, (sceneInstance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === 'function') {
        currentActiveScene(sceneInstance);
      }

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: sceneInstance });
      } else if (ref) {
        ref.current = { game: game.current, scene: sceneInstance };
      }
    });

    EventBus.on(EVENTS.PLAYER_STATE_CHANGED, (state: StateChange<PlayerState>) => {
      setPlayerState({
        ...playerState,
        ...state.newState,
      });
    });

    EventBus.on(EVENTS.CURRENT_SCENE_READY, (scene: Scene) => {
      if (scene instanceof Level) {
        setSkills(scene.player.skills);
        setScene(scene);
      }
    });

    EventBus.on(EVENTS.GAME_STATE_CHANGED, (state: StateChange<GameState>) => {
      setGameState({
        ...gameState,
        ...state.newState,
      });
    });

    EventBus.on(EVENTS.RESIZE, (scaleManager: Phaser.Scale.ScaleManager) => {
      setGameSize({
        width: scaleManager.displaySize.width,
        height: scaleManager.displaySize.height,
        y: scaleManager.canvasBounds.y,
        x: scaleManager.canvasBounds.x,
      });
    });

    EventBus.on(EVENTS.NEXT_LEVEL, () => {
      setSkills([]);
    });

    return () => {
      setSkills([]);
      setScene(null);
      setGameSize(null);
      setPlayerState(null);
      EventBus.removeListenerByKeys(Object.keys(EVENTS), this);
    };
  }, [currentActiveScene, ref]);

  return (
    <div>
      <div id="game-container"></div>
      <GameUI
        skills={skills}
        gameSize={gameSize}
        playerState={playerState}
        scene={scene}
        gameState={gameState}
      ></GameUI>
    </div>
  );
});
