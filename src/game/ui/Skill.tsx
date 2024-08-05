import { BaseSkill } from '../skills/BaseSkill.ts';
import './ui.scss';
export function Ability(props: { skill: BaseSkill; onClick: (skill: BaseSkill) => void }) {
  return (
    <div
      className={
        'rounded cursor-pointer bg-contain bg-white w-10 h-10 skill hover:shadow-black hover:shadow-md transition-shadow duration-150'
      }
      onClick={() => props.onClick(props.skill)}
      style={{
        backgroundImage: `url(${props.skill.iconPath})`,
      }}
    ></div>
  );
}
