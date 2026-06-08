export default function GameOverScreen({
  score,
  onRetry
}) {
  return (
    <main className="result-screen">

      <h1>GAME OVER</h1>

      <p>Final Score: {score}</p>

      <button onClick={onRetry}>
        Retry
      </button>

    </main>
  );
}