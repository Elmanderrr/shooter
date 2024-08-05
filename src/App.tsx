import Phaser, { Scene } from 'phaser';
import { useEffect, useRef, useState } from 'react';
import { EventBus } from './game/EventBus.ts';
import { RefPhaserGame, PhaserGame } from './game/PhaserGame';
import { Level } from './game/scenes/level.ts';
import { BaseSkill } from './game/skills/BaseSkill.ts';
import { Ability } from './game/ui/Skill.tsx';
import { EVENTS } from './game/utils/events.ts';
import { PlayerState } from './game/utils/StateManager.ts';

export interface GameScale {
  width: number;
  height: number;
  x: number;
  y: number;
}

function App() {
  const phaserRef = useRef<RefPhaserGame | null>(null);
  const [skills, setSkills] = useState<BaseSkill[]>([]);
  const [scene, setScene] = useState<Level | null>(null);
  const [gameSize, setGameSize] = useState<GameScale | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);

  useEffect(() => {
    EventBus.on(EVENTS.PLAYER_STATE_CHANGED, (state: PlayerState) => {
      setPlayerState({
        ...playerState,
        ...state,
      });
    });
    EventBus.on(EVENTS.CURRENT_SCENE_READY, (scene: Scene) => {
      if (scene instanceof Level) {
        setSkills(scene.player.skills);
        setScene(scene);
      }
    });
    EventBus.on(EVENTS.CURRENT_SCENE_READY, (scene: Scene) => {
      if (scene instanceof Level) {
        setSkills(scene.player.skills);
      }
    });
    EventBus.on(EVENTS.RESIZE, (scaleManager: Phaser.Scale.ScaleManager) => {
      setGameSize({
        width: scaleManager.displaySize.width,
        height: scaleManager.displaySize.height,
        y: scaleManager.canvasBounds.y,
        x: scaleManager.canvasBounds.x,
      });
    });

    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [skills]);

  const handleKeyUp = (e: KeyboardEvent) => {
    const assocSkill = skills.find((s) => s.hotKey == e.key);

    if (assocSkill) {
      executeSkill(assocSkill);
    }
  };

  const executeSkill = (skill: BaseSkill) => {
    scene?.battleCtrl.useSkill(skill);
  };

  const renderSkillsList = () => {
    if (gameSize) {
      return (
        <div
          className={'absolute flex gap-1 z-20 -translate-x-1/2'}
          style={{
            left: calcPosition().left + 'px',
            top: calcPosition().top + 'px',
          }}
        >
          {skills.map((skill) => {
            return <Ability key={skill.name} onClick={executeSkill} skill={skill} />;
          })}
        </div>
      );
    }
  };

  const renderPlayerState = () => {
    if (gameSize) {
      const pos = calcPlayerStatePosition();
      return (
        <div
          className={'absolute gap-2 text-gray-900'}
          style={{
            left: pos.left + 'px',
            top: pos.top + 'px',
          }}
        >
          <div>Level - {playerState?.lvl}</div>
          <div>
            Experience {playerState?.xp}/{playerState?.xpToLvlUp}
          </div>
        </div>
      );
    }
  };

  const calcPosition = () => {
    return {
      left: gameSize!.x + gameSize!.width / 2,
      top: gameSize!.y + gameSize!.height - 50,
    };
  };

  const calcPlayerStatePosition = () => {
    return {
      left: gameSize!.x + 10,
      top: gameSize!.y + 10,
    };
  };

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
      {renderSkillsList()}
      {renderPlayerState()}
    </div>
  );
}

export default App;
