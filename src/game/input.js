//inputs.js

export const keys = {
  left: false,
  right: false,
  launch:false
};

export function setupInput() {

  function keyDown(e) {

    //Flechas izquierda y derecha
    if (e.key === "ArrowLeft") {
      keys.left = true;
    }

    if (e.key === "ArrowRight") {
      keys.right = true;
    }

    //Barra espaciadora
    if (e.code === "Space") {
      keys.launch = true;
    }
  }

  function keyUp(e) {
    
    //Flechas izquierda y derecha
    if (e.key === "ArrowLeft") {
      keys.left = false;
    }

    if (e.key === "ArrowRight") {
      keys.right = false;
    }

    //Barra espaciadora
    if (e.code === "Space") {
      keys.launch = false;
    }
  }

  //Click del ratón
  function mouseDown() {
    keys.launch = true;
  }

  function mouseUp() {
    keys.launch = false;
  }


  //Listeners globales para detectar las teclas presionadas

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);

return () => {
  window.removeEventListener("keydown", keyDown);
  window.removeEventListener("keyup", keyUp);

  window.removeEventListener("mousedown", mouseDown);
  window.removeEventListener("mouseup", mouseUp);
};
}