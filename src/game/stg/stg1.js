export const stage1 = {

  paddle: {
    x: 350,
    y: 560,
    width: 100,
    height: 20,
    speed: 7
  },

  ball: {
    x: 400,
    y: 300,
    radius: 10,
    dx: 4,
    dy: -4,
    
    attached: true
  },

  bricks: generateBricks(),

  score: 0,
  lives: 3
};

function generateBricks() {

  const bricks = [];

  const rows = 5;
  const cols = 10;

  const width = 70;
  const height = 25;

  const padding = 10;

  const offsetTop = 60;
  const offsetLeft = 5;

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      let hp = 1;

      // filas superiores más resistentes
      if (row === 0) hp = 3;
      else if (row <= 2) hp = 2;

      bricks.push({

        x: offsetLeft + col * (width + padding),
        y: offsetTop + row * (height + padding),

        width,
        height,

        hp,
        destroyed: false
      });
    }
  }

  return bricks;
}