import { Scene } from 'phaser';
import { Skill, SkillsSet } from '../models/player.model.ts';
import { Level } from '../scenes/level.ts';
import { BaseSkill } from '../skills/BaseSkill.ts';
import { Teleport } from '../skills/Teleport.ts';
import { EVENTS } from '../utils/events.ts';
import { useEffect, useState } from 'react';
import { EventBus } from '../EventBus.ts';
import { PlayerState } from '../utils/StateManager.ts';
import './ui.scss';
import { Ability } from './Skill.tsx';

function GameUI(ref: any) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [skills, setSkills] = useState<BaseSkill[]>([]);

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
      }
    });
    //
    // document.addEventListener('keyup', (e) => {
    //   if (e.key === '4') {
    //     const tp = skills.find((s) => s instanceof Teleport);
    //
    //     if (tp) {
    //       useSkill(tp as Teleport);
    //     }
    //   }
    // });
  }, []);

  const useSkill = (skill: BaseSkill) => {
    const levelScene = ref.scene.current.scene as Level;

    if (levelScene) {
      levelScene.battleCtrl.useSkill(skill);
    }
  };

  const skillsList = skills.map((skill) => (
    <Ability key={skill.name} onClick={useSkill} skill={skill} />
  ));

  return (
    <>
      <div className={'text-gray-800 font-bold'}>
        killed : {playerState?.killed} <br />
        xp: {playerState?.xp} / {playerState?.xpToLvlUp} <br />
        lvl: {playerState?.lvl}
      </div>
      <div className={'absolute bottom-2 left-2'}>
        <div className={'flex gap-2'}>{skillsList}</div>
      </div>
    </>
  );
}

export default GameUI;
