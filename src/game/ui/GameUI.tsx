import { GameScale } from '../../App.tsx';
import { Level } from '../scenes/level.ts';
import { Skill } from '../skills/Skill.ts';
import { GameState, PlayerState } from '../utils/StateManager.ts';
import { Ability } from './Skill.tsx';

export interface GameUIParams {
  skills: Skill[];
  gameSize: GameScale | null;
  playerState: PlayerState | null;
  gameState: GameState | null;
  scene: Level | null;
}

export function GameUI({ skills, gameSize, playerState, gameState, scene }: GameUIParams) {
  const executeSkill = (skill: Skill) => {
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

  const renderInfo = () => {
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
          <div>Game Level - {gameState?.level}</div>
          <div>Level - {playerState?.level}</div>
          <div>Credits - {playerState?.credits}</div>
          <div>
            Experience {playerState?.experience}/{playerState?.xpToLvlUp}
          </div>
          <div>Enemies killed {playerState?.killed}</div>
          <div>Enemies left in that level {gameState?.enemiesLeft}</div>
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
    <>
      {renderSkillsList()}
      {renderInfo()}
    </>
  );
}
