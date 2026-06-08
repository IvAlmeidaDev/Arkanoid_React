// game/initgame.js

import { setupInput, keys } from "./input";
import { ballHitsBrick } from "./collissions";
import { stage1 } from "./stg/stg1";

export function createGame(canvas, { onExit, setHudData, onVictory, onGameOver }) {
  const cleanupInput = setupInput();
  const ctx = canvas.getContext("2d");
  let rafId = 0;
  let running = false;

  function updateHUD() {
    console.log("HUD actualizado");
  
    setHudData({
    score: state.score,
    lives: state.lives,
    level: 1,
    ballAttached: state.ball.attached
  });
}

  const state = structuredClone(stage1);

function update() {

  const paddle = state.paddle;
  const ball = state.ball;

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

  // Ball

  // Si la pelota está "pegada" al paddle, sigue su movimiento
  if (ball.attached) {

  ball.x = paddle.x + paddle.width / 2;

  ball.y = paddle.y - ball.radius - 2;
}

//Mover la pelota solo si no está pegada al paddle
if (!ball.attached) {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Refrescar HUD
  updateHUD();
}

//Lanzar pelota
if (
  ball.attached &&
  (keys.space || keys.launch)
) {
  ball.attached = false;
  keys.launch = false; // evita múltiples lanzamientos

  updateHUD();
}

  // Rebotes laterales
  if (
    ball.x + ball.radius > canvas.width ||
    ball.x - ball.radius < 0
  ) {
    ball.dx *= -1;
  }

  // Rebote techo
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
    ball.y += ball.dy; // evita múltiples colisiones
  }

  // Rebote paddle
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

  //Romper ladrillos
  for (const brick of state.bricks) {

  if (brick.destroyed) continue;

  if (ballHitsBrick(ball, brick)) {

    // rebote
    ball.dy *= -1;

    // daño
    brick.hp--;

    // destruir
    if (brick.hp <= 0) {

      brick.destroyed = true;

      state.score += 100;

      updateHUD();
    }

    // importante:
    // evita múltiples colisiones simultáneas
    break;
  }
}

    //Victoria
    const remainingBricks = state.bricks.filter(
  brick => !brick.destroyed
);

if (remainingBricks.length === 0) {

  running = false;

  //Mostrar pantalla de victoria
  onVictory();
}

    //Pelota cae
    if (ball.y - ball.radius > canvas.height) {

  state.lives--;

  updateHUD();

  // reset pelota
  ball.dx = 4;
  ball.dy = -4;

  ball.attached = true;

  if (state.lives <= 0) {

    running = false;

    //Mostrar pantalla de Game Over
    onGameOver();
  }
}
}

function draw() {

  const paddle = state.paddle;
  const ball = state.ball;

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
  ctx.beginPath();

  ctx.arc(
    ball.x,
    ball.y,
    ball.radius,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "red";
  ctx.fill();

  ctx.closePath();

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
  }

  return { start, destroy };
}