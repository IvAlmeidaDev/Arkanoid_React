import { keys } from "../game/input";

export default function TouchControls() {

  const pressLeft = () => {
    keys.left = true;
  };

  const releaseLeft = () => {
    keys.left = false;
  };

  const pressRight = () => {
    keys.right = true;
  };

  const releaseRight = () => {
    keys.right = false;
  };

  return (
    <div className="touch-controls">

      <button
        className="touch-btn"
        onTouchStart={pressLeft}
        onTouchEnd={releaseLeft}
        onMouseDown={pressLeft}
        onMouseUp={releaseLeft}
      >
        ◀
      </button>

      <button
        className="touch-btn"
        onTouchStart={pressRight}
        onTouchEnd={releaseRight}
        onMouseDown={pressRight}
        onMouseUp={releaseRight}
      >
        ▶
      </button>

    </div>
  );
}