import { Start } from '../scenes/Start.ts';

function GameUI(ref: any) {
  function changeScene() {
    const scene = ref.scene.current.scene as Start;
    scene.changeScene();
  }

  return (
    <>
      <div>
        <button onClick={changeScene}>start game</button>
      </div>
    </>
  );
}

export default GameUI;
