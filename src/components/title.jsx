export default function HomeScreen({ onStart }) {
  return (
    <main className="title-screen">
      <h1>ARKANOID</h1>

      <button onClick={onStart}>
        START GAME
      </button>
    </main>
  );
}