// Crear los distintos tipos de powerups que pueden aparecer en el juego

export const POWERUPS = {

  BOMB: "bomb",

  LASER: "laser",

  WIDE: "wide",

  MULTI: "multi"

};

// Función para generar un powerup aleatorio
export function randomPowerUp() {

  const types = [

    POWERUPS.BOMB,

    POWERUPS.LASER,

    POWERUPS.WIDE,

    POWERUPS.MULTI

  ];

  return types[
    Math.floor(
      Math.random() * types.length
    )
  ];
}

//Crear una cápsula de powerup que cae desde la posición del ladrillo destruido
export function spawnCapsule(state, brick) {

  if (Math.random() > 0.15)
    return;

  state.capsules.push({

    x: brick.x + brick.width / 2 - 10,

    y: brick.y,

    width: 20,
    height: 20,

    speed: 2,

    type: randomPowerUp()

  });

}

// Comportamiento de la cápsula de powerup al caer y colisionar con la paleta
export function updateCapsules(
  state,
  paddle
) {

  for (const capsule of state.capsules) {

    capsule.y += capsule.speed;

  }

  state.capsules =
    state.capsules.filter(

      capsule => {

        // fuera de pantalla

        if (capsule.y > 600)
          return false;

        // atrapada

        if (

          capsule.y + capsule.height >
          paddle.y &&

          capsule.x + capsule.width >
          paddle.x &&

          capsule.x <
          paddle.x + paddle.width

        ) {

          activatePowerUp(
            state,
            capsule.type
          );

          return false;

        }

        return true;

      }

    );

}

//Renderizar las cápsulas de powerup en el canvas
export function drawCapsules(
  ctx,
  state
) {

  for (const capsule of state.capsules) {

    switch (capsule.type) {

      case POWERUPS.BOMB:

        ctx.fillStyle = "red";

        break;

      case POWERUPS.LASER:

        ctx.fillStyle = "cyan";

        break;

      case POWERUPS.WIDE:

        ctx.fillStyle = "green";

        break;

      case POWERUPS.MULTI:

        ctx.fillStyle = "magenta";

        break;

    }

    ctx.fillRect(

      capsule.x,

      capsule.y,

      capsule.width,

      capsule.height

    );

  }

}


//Cambiar el estado del jugador según la cápsula de powerup recogida
export function activatePowerUp(
  state,
  type
) {

  clearCurrentPower(state);

  state.powerUp = type;

  switch (type) {

    case POWERUPS.WIDE:

      state.paddle.width = 160;

      break;

    case POWERUPS.BOMB:

    state.balls.forEach(ball=>{
        ball.bomb = true;
    });

      break;

    case POWERUPS.LASER:

      break;

    case POWERUPS.MULTI:

      if (state.balls.length === 1) {

    const ball = state.balls[0];

    state.balls.push({
      ...structuredClone(ball),
      dx: -4,
      dy: -4
    });

    state.balls.push({
      ...structuredClone(ball),
      dx: 4,
      dy: -4
    });
  }
      break;

  }

}

//Desactivar el powerup anterior 
export function clearCurrentPower(
  state
) {

  switch (state.powerUp) {

    case POWERUPS.WIDE:

      state.paddle.width = 100;

      break;

    case POWERUPS.BOMB:

      state.balls.forEach(
        ball => ball.bomb = false
      );

      break;

  }

  state.powerUp = null;

}


export function explodeBomb(state) {

  for (const ball of state.balls) {

    for (const brick of state.bricks) {

      if (brick.destroyed) continue;

      const dx = brick.x - ball.x;
      const dy = brick.y - ball.y;

      const distance = Math.hypot(dx,dy);

      if (distance < 200) {

        brick.hp--;

        if (brick.hp <= 0) {

          brick.destroyed = true;
          state.score += 100;

        }
      }

    }

    ball.bomb = false;

  }

}