export default function VictoryScreen({
  score,
  onContinue
}) {
  return (
    <main className="result-screen">

      <h1>LEVEL COMPLETE!</h1>

      <p>Score: {score}</p>

      <button onClick={onContinue}>
        Continue
      </button>

    </main>
  );
}