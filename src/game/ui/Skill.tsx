import { useEffect, useRef, useState } from 'react';
import { BaseSkill } from '../skills/BaseSkill.ts';
import './ui.scss';

export function Ability(props: { skill: BaseSkill; onClick: (skill: BaseSkill) => void }) {
  const timer = useRef<number>(0);
  const [cdValue, setCdValue] = useState<string>('');

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (props.skill.hotKey === e.key) {
      handleClick();
    }
  };

  const renderCooldownOverlay = () => {
    if (cdValue) {
      return (
        <div className={'flex'}>
          <div className={'bg-black bg-opacity-30 absolute left-0 top-0 w-full h-full'}></div>
          <span className={'text-white z-10 flex items-center justify-center'}>{cdValue}</span>
        </div>
      );
    }
  };

  const intervalHandler = () => {
    if (props.skill.ready) {
      clearInterval(timer.current);
      setCdValue('');
    } else {
      setCdValue(props.skill.cooldownLeft().toPrecision(2));
    }
  };
  const handleClick = () => {
    timer.current = setInterval(intervalHandler, 100);
    props.onClick(props.skill);
  };

  return (
    <div
      className={
        'rounded relative cursor-pointer flex bg-contain bg-white w-10 h-10 skill hover:shadow-black hover:shadow-md transition-shadow duration-150'
      }
      onClick={handleClick}
      style={{
        backgroundImage: `url(${props.skill.iconPath})`,
      }}
    >
      {renderCooldownOverlay()}
    </div>
  );
}
