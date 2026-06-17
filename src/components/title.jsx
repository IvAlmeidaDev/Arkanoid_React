export default function HomeScreen({ onStart }) {
  return (
    <main className="title-screen">

      <div className="title-content">

        <img
          src="../assets/Arkanoid-logo.svg"
          alt="Arkanoid"
          className="title-logo"
        />

        <button
          className="start-button"
          onClick={onStart}
        >
          START GAME
        </button>

      </div>

      <footer className="title-footer">
        Arkanoid React Fan Remake
        <br />
        Developed by Iván Almeida - 2026
      </footer>

    </main>
  );
}