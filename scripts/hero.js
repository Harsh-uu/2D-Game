export class Hero {
    constructor(image) {
      this.image = image;
      this.config = {
        sprite: {
          image: image,
          x: 0,
          y: 10,
          width: 64,
          height: 64,
        },
        scale: 3,
      };
      this.maxFrame = 8;
    }
  
    updateSprite(isMoving) {
      if (isMoving) {
        this.config.sprite.x < this.maxFrame ? this.config.sprite.x++ : this.config.sprite.x = 0;
      }
    }
  
    draw(ctx, cameraX, cameraY, rectX, rectY, tileSize) {
      const scaledWidth = this.config.sprite.width * this.config.scale;
      const scaledHeight = this.config.sprite.height * this.config.scale;
      const yOffset = 55;
  
      ctx.drawImage(
        this.config.sprite.image,
        this.config.sprite.x * this.config.sprite.width,
        this.config.sprite.y * this.config.sprite.height,
        this.config.sprite.width,
        this.config.sprite.height,
        rectX - cameraX - (scaledWidth - tileSize) / 2,
        rectY - cameraY - (scaledHeight - tileSize) / 2 - yOffset,
        scaledWidth,
        scaledHeight
      );
    }
  }
  