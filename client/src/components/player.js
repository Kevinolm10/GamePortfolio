import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 200;
  }

  move(cursors) {
    this.body.setVelocity(0);

    if (cursors.left.isDown) this.body.setVelocityX(-this.speed);
    if (cursors.right.isDown) this.body.setVelocityX(this.speed);
    if (cursors.up.isDown) this.body.setVelocityY(-this.speed);
    if (cursors.down.isDown) this.body.setVelocityY(this.speed);
  }
}
