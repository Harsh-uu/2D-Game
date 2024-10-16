// input.js
export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";

export class Input {
  constructor(game) {
    this.game = game;
    this.keys = [];

    // Key listeners for keyboard input
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        this.keyPressed(UP);
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        this.keyPressed(DOWN);
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        this.keyPressed(LEFT);
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        this.keyPressed(RIGHT);
      } else if (e.key === "Enter") {
        this.game.toggleDebug();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        this.keyReleased(UP);
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        this.keyReleased(DOWN);
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        this.keyReleased(LEFT);
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        this.keyReleased(RIGHT);
      }
    });

    // Touch and mouse event listeners for control buttons
    this.addTouchMouseListeners();
  }

  addTouchMouseListeners() {
    const buttons = {
      up: document.getElementById('up'),
      down: document.getElementById('down'),
      left: document.getElementById('left'),
      right: document.getElementById('right'),
    };

    Object.keys(buttons).forEach((key) => {
      const button = buttons[key];
      const action = key.toUpperCase();

      // Handle touch start and mouse down events
      button.addEventListener("touchstart", () => this.keyPressed(action));
      button.addEventListener("mousedown", () => this.keyPressed(action));

      // Handle touch end and mouse up events
      button.addEventListener("touchend", () => this.keyReleased(action));
      button.addEventListener("mouseup", () => this.keyReleased(action));
      button.addEventListener("mouseleave", () => this.keyReleased(action)); // Ensure key is released if the mouse leaves the button area
    });
  }

  keyPressed(key) {
    if (this.keys.indexOf(key) === -1) {
      this.keys.unshift(key);
    }
    console.log(key, this.keys);
  }

  keyReleased(key) {
    const index = this.keys.indexOf(key);
    if (index === -1) return;
    this.keys.splice(index, 1);
    console.log(key, this.keys);
  }

  get lastKey() {
    return this.keys[0];
  }
}
