export function ballHitsBrick(ball, brick) {

  return (

    ball.x + ball.radius > brick.x &&
    ball.x - ball.radius < brick.x + brick.width &&

    ball.y + ball.radius > brick.y &&
    ball.y - ball.radius < brick.y + brick.height
  );
}