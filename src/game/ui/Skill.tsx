import { useEffect, useRef, useState } from 'react';
import { Skill } from '../skills/Skill.ts';
import './ui.scss';

export function Ability(props: { skill: Skill; onClick: (skill: Skill) => void }) {
  const timer = useRef<number>(0);
  const [cdValue, setCdValue] = useState<string>('');
  const [ready, setReady] = useState<boolean>(true);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    props.skill.onActivated(onActivated);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onActivated = () => {
    timer.current = setInterval(intervalHandler, 100);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (props.skill.hotKey === e.key) {
      handleClick();
    }
  };

  const renderCooldownOverlay = () => {
    if (!ready) {
      return (
        <div>
          <div className={'bg-black bg-opacity-50 absolute left-0 top-0 w-full h-full '}></div>
          <div className={'text-white z-10 flex items-center justify-center relative'}>
            {cdValue}
          </div>
        </div>
      );
    }
  };

  const intervalHandler = () => {
    if (props.skill.ready) {
      clearInterval(timer.current);
      setCdValue('');
      setReady(true);
    } else {
      setCdValue(props.skill.cooldownLeft().toFixed(2));
      setReady(false);
    }
  };
  const handleClick = () => {
    props.onClick(props.skill);
  };

  return (
    <div
      className={
        'rounded relative cursor-pointer flex flex-col justify-center bg-contain bg-no-repeat bg-center bg-white w-10 h-10 skill hover:shadow-black hover:shadow-md transition-shadow duration-150'
      }
      onClick={handleClick}
      style={{
        backgroundImage: `url(${props.skill.iconPath})`,
      }}
    >
      {renderCooldownOverlay()}
      <span className={'hotkey absolute left-[2px] top-0 font-mono'}>{props.skill.hotKey}</span>
    </div>
  );
}
