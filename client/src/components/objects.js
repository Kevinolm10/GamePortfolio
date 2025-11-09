import Phaser from 'phaser';

export default class Objects extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, frames = [], isStatic = true) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this, isStatic);
    

    const tileSize = 16;

    frames.forEach((frame, index) => {
      const sprite = scene.add.sprite(
        (index % 2) * tileSize,
        Math.floor(index / 2) * tileSize,
        key,
        frame
      ).setOrigin(0, 0);

      this.add(sprite);
    });
  }

  // animated multiframe objects
  static createObjectsAnimations(scene) {

  }
}
