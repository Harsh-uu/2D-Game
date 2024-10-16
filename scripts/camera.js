export class Camera {
    constructor(gameWidth, gameHeight, cameraWidth, cameraHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.cameraWidth = cameraWidth;
      this.cameraHeight = cameraHeight;
    }
  
    update(rectX, rectY, halfTile) {
      let cameraX = rectX - this.cameraWidth / 2 + halfTile;
      let cameraY = rectY - this.cameraHeight / 2 + halfTile;
  
      // Clamp the camera values within the world boundaries
      cameraX = Math.max(0, Math.min(cameraX, this.gameWidth - this.cameraWidth));
      cameraY = Math.max(0, Math.min(cameraY, this.gameHeight - this.cameraHeight));
  
      return { cameraX, cameraY };
    }
  }
  