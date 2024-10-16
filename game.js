import { Input } from './scripts/input.js';
import { World } from './scripts/world.js';
import { Hero } from './scripts/hero.js';
import { Camera } from './scripts/camera.js';

export const TILE_SIZE = 64;
export const COL_SIZE = 40;
export const ROW_SIZE = 30;
const GAME_WIDTH = 2560;
const GAME_HEIGHT = 1920;
const CAMERA_WIDTH = 1000;
const CAMERA_HEIGHT = 800;
const HALF_TILE = TILE_SIZE / 2;

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;

  const map = document.querySelector('#map');
  const heroImage = document.querySelector('#hero1');

  class Game {
    constructor() {
      this.world = new World();
      this.input = new Input(this);
      this.hero = new Hero(heroImage);
      this.camera = new Camera(GAME_WIDTH, GAME_HEIGHT, CAMERA_WIDTH, CAMERA_HEIGHT);
      this.rectX = 985;
      this.rectY = 330;
      this.speed = 1;
      this.lastTime = 0;
      this.moveCooldown = 0.2;
      this.timeSinceLastMove = 0;
      this.interpolationProgress = 1;
      this.startX = this.rectX;
      this.startY = this.rectY;
      this.targetX = this.rectX;
      this.targetY = this.rectY;
      this.debug = false;
      this.update(0);
    }

    toggleDebug() {
      this.debug = !this.debug;
    }

    drawGrid() {
      for (let row = 0; row < ROW_SIZE; row++) {
        for (let col = 0; col < COL_SIZE; col++) {
          ctx.strokeRect(
            col * TILE_SIZE - this.cameraX,
            row * TILE_SIZE - this.cameraY,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }

    drawImage() {
      ctx.drawImage(
        map,
        this.cameraX,
        this.cameraY,
        CAMERA_WIDTH,
        CAMERA_HEIGHT,
        0,
        0,
        CAMERA_WIDTH,
        CAMERA_HEIGHT
      );
    }

    update(timeStamp) {
      const deltaTime = (timeStamp - this.lastTime) / 1000;
      this.lastTime = timeStamp;
      this.timeSinceLastMove += deltaTime;
      let isMoving = false;

      if (this.timeSinceLastMove >= this.moveCooldown && this.interpolationProgress >= 1) {
        let newRectX = this.rectX;
        let newRectY = this.rectY;

        if (this.input.lastKey === 'UP') {
          newRectY = Math.max(0, this.rectY - TILE_SIZE);
          this.hero.config.sprite.y = 8;
          isMoving = true;
        } else if (this.input.lastKey === 'DOWN') {
          newRectY = Math.min(GAME_HEIGHT - TILE_SIZE, this.rectY + TILE_SIZE);
          this.hero.config.sprite.y = 10;
          isMoving = true;
        } else if (this.input.lastKey === 'LEFT') {
          newRectX = Math.max(0, this.rectX - TILE_SIZE);
          this.hero.config.sprite.y = 9;
          isMoving = true;
        } else if (this.input.lastKey === 'RIGHT') {
          newRectX = Math.min(GAME_WIDTH - TILE_SIZE, this.rectX + TILE_SIZE);
          this.hero.config.sprite.y = 11;
          isMoving = true;
        }

        const col = Math.floor(newRectX / TILE_SIZE);
        const row = Math.floor(newRectY / TILE_SIZE);

        if (this.world.getTile(this.world.level1.collisionLayer, row, col) !== 1) {
          this.startX = this.rectX;
          this.startY = this.rectY;
          this.targetX = newRectX;
          this.targetY = newRectY;
          this.interpolationProgress = 0;
        }

        this.timeSinceLastMove = 0;
      }

      if (this.interpolationProgress < 1) {
        this.interpolationProgress += deltaTime / this.moveCooldown;
        if (this.interpolationProgress > 1) this.interpolationProgress = 1;
        this.rectX = this.startX + (this.targetX - this.startX) * this.interpolationProgress;
        this.rectY = this.startY + (this.targetY - this.startY) * this.interpolationProgress;
      }

      const cameraPosition = this.camera.update(this.rectX, this.rectY, HALF_TILE);
      this.cameraX = cameraPosition.cameraX;
      this.cameraY = cameraPosition.cameraY;

      ctx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
      this.drawImage();
      if (this.debug) {
        this.world.drawCollisionMap(ctx);
        this.drawGrid();
      }
      this.hero.updateSprite(isMoving);
      this.hero.draw(ctx, this.cameraX, this.cameraY, this.rectX, this.rectY, TILE_SIZE);

      requestAnimationFrame((timeStamp) => this.update(timeStamp));
    }
  }

  let imagesLoaded = 0;
  const totalImages = 2;
  
  function checkAllImagesLoaded() {
    if (imagesLoaded === totalImages) {
      const game = new Game();
    }
  }

  function imageLoaded() {
    imagesLoaded++;
    checkAllImagesLoaded();
  }

  if (map.complete) {
    imageLoaded();
  } else {
    map.addEventListener('load', imageLoaded);
  }

  if (heroImage.complete) {
    imageLoaded();
  } else {
    heroImage.addEventListener('load', imageLoaded);
  }
  
});
