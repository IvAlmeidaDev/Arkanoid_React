import '../components/hud.css'

export default function HUD({
  score,
  lives,
  level
}) {
  return (
    <header className="hud">

      <div>
        Score: {score}
      </div>

      <div>
        Level: {level}
      </div>

      <div>
        Lives: {lives}
      </div>

    </header>
  );
}