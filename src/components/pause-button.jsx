import './pause-button.css';

export default function PauseButton({
  paused,
  onToggle
}) {
  return (
    <button
      className="pause-button"
      onClick={onToggle}
    >
      {paused ? "▶" : "⏸"}
    </button>
  );
}