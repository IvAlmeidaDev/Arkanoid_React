// game/initgame.js

import { setupInput, keys } from "./input";
import { ballHitsBrick } from "./collissions";
import { stage1 } from "./stg/stg1";
import { POWERUPS,spawnCapsule, updateCapsules, drawCapsules, explodeBomb, clearCurrentPower } from "./powerups";

export function createGame(canvas, { onExit, setHudData, onVictory, onGameOver }) {
  const cleanupInput = setupInput();
  const ctx = canvas.getContext("2d");
  let rafId = 0;
  let running = false;
  let paused = false;

// Función para alternar el estado de pausa

  function togglePause() {

    paused = !paused;

    setHudData(prev => ({
      ...prev,
      paused
    }));
  }

  function handlePause() {
  togglePause();
}

window.addEventListener(
  "togglePause",
  handlePause
);

//Renderizado del HUD

  function updateHUD() {
    console.log("HUD actualizado");
  
    setHudData({
    score: state.score,
    lives: state.lives,
    level: 1,
    ballAttached: state.balls.some(
      ball => ball.attached
    )
  });
}

  const state = structuredClone(stage1);

function update() {

  //Detectar la pausa y detener la lógica del juego
  if (keys.pause) {

  togglePause();

  keys.pause = false;
}

    if (paused) {
    return;
  }

  const paddle = state.paddle;

  // Paddle
  if (keys.left) {
    paddle.x -= paddle.speed;
  }

  if (keys.right) {
    paddle.x += paddle.speed;
  }

  // límites
  paddle.x = Math.max(0, paddle.x);

  paddle.x = Math.min(
    canvas.width - paddle.width,
    paddle.x
  );


  // CÓDIGO DE LA PELOTA
  for (const ball of state.balls) {

  // Pelota pegada al paddle
  if (ball.attached) {

    ball.x = paddle.x + paddle.width / 2;

    ball.y = paddle.y - ball.radius - 2;
  }

  // Movimiento
  if (!ball.attached) {

    ball.x += ball.dx;

    ball.y += ball.dy;
  }

  // Rebotes laterales
  if (
    ball.x + ball.radius > canvas.width ||
    ball.x - ball.radius < 0
  ) {

    ball.dx *= -1;
  }

  // Techo
  if (ball.y - ball.radius < 0) {

    ball.dy *= -1;

    ball.y += ball.dy;
  }

  // Paddle
  if (

    ball.dy > 0 &&

    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&

    ball.x + ball.radius >= paddle.x &&
    ball.x - ball.radius <= paddle.x + paddle.width

  ) {

    const hitPosition =
      (ball.x - paddle.x) / paddle.width;

    ball.dx = (hitPosition - 0.5) * 8;

    ball.dy = -Math.abs(ball.dy);

    ball.y = paddle.y - ball.radius;
  }

}

  //COLISIÓN DE LA PELOTA CON LOS LADRILLOS

for (const ball of state.balls) {

  for (const brick of state.bricks) {

    if (brick.destroyed)
      continue;

    if (ballHitsBrick(ball, brick)) {

      ball.dy *= -1;

      brick.hp--;

      if (brick.hp <= 0) {

        brick.destroyed = true;

        state.score += 100;

        spawnCapsule(state, brick);

        updateHUD();

      }

      break;

    }

  }

}

//Debug stuff
console.log(
  keys.launch,
  state.powerUp,
  state.balls[0].bomb
);

//COMPORTAMIENTO DE LA PELOTA AL PULSAR ESPACIO 

if (  //Explotar la pelota si se tiene el powerup de bomba y se pulsa espacio
  state.powerUp === POWERUPS.BOMB &&
  keys.launch
) {

  explodeBomb(state);

  clearCurrentPower(state);

  keys.launch = false;
}
else {
  //Lanzar la pelota si está pegada al paddle y se pulsa espacio
  //Esto evita que la bomba y el lanzamiento de la pelota se activen al mismo tiempo
  for (const ball of state.balls) {

    if (
      ball.attached &&
      keys.launch
    ) {

      ball.attached = false;

      keys.launch = false;

      updateHUD();
    }
  }

}


  //Cápsulas de powerup
  updateCapsules(
  state,
  paddle
);


    //Victoria
    const remainingBricks = state.bricks.filter(
  brick => !brick.destroyed
);

if (remainingBricks.length === 0) {

  running = false;

  //Mostrar pantalla de victoria
  onVictory();
}

    //PERDER UNA VIDA SI LA PELOTA SALE DE PANTALLA

    state.balls = state.balls.filter(
  ball => ball.y - ball.radius <= canvas.height
);

  if (state.balls.length === 0) {

  state.lives--;

  updateHUD();

    if (state.lives <= 0) {

    running = false;

    onGameOver();

  }
  else{

    state.balls.push({
      x: 400,
      y: 300,
      radius: 10,
      dx: 4,
      dy: -4,
      attached: true,
      bomb: false
    });

  }

}
}


//RENDERIZADO DEL JUEGO

function draw() {

  const paddle = state.paddle;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fondo
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // paddle
  ctx.fillStyle = "white";

  ctx.fillRect(
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height
  );

  // ball
for (const ball of state.balls) {

  ctx.beginPath();

  ctx.arc(

    ball.x,

    ball.y,

    ball.radius,

    0,

    Math.PI * 2

  );

  ctx.fillStyle = "red";

  ctx.fillStyle = ball.bomb
    ? (Date.now()/100 % 2 ? "orange" : "red")
    : "red";

  ctx.fill();

  ctx.closePath();

}

  //Cápsulas de powerup
  drawCapsules(
  ctx,
  state
);

  //Bricks
  for (const brick of state.bricks) {

  if (brick.destroyed) continue;

  // Color según HP
  if (brick.hp === 3) {
    ctx.fillStyle = "red";
  }

  else if (brick.hp === 2) {
    ctx.fillStyle = "orange";
  }

  else {
    ctx.fillStyle = "yellow";
  }

  ctx.fillRect(
    brick.x,
    brick.y,
    brick.width,
    brick.height
  );
}
}

  function loop() {
    if (!running) return;
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    running = true;
    loop();
  }

  function destroy() {
    running = false;
    cleanupInput();
    cancelAnimationFrame(rafId);
    window.removeEventListener(
      "togglePause",
      handlePause
    );
  }

  return { start, destroy };
}