import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 200;
    this.setFrame(0);

    this.lastDirection = 'down';
  }

  static createAnimations(scene) {
    const FRAME_RATE = 8;

    // Idle animations
    scene.anims.create({
      key: 'idle-down',
      frames: [{ key: 'player', frame: 3 }],
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle-right',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle-left',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle-up',
      frames: [{ key: 'player', frame: 1 }],
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('player', { start: 66, end: 70 }),
      frameRate: FRAME_RATE,
      repeat: -1
    });

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('player', { start: 60, end: 65 }),
      frameRate: FRAME_RATE,
      repeat: -1
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('player', { start: 48, end: 53 }),
      frameRate: FRAME_RATE,
      repeat: -1
    });

    scene.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('player', { start: 54, end: 59 }),
      frameRate: FRAME_RATE,
      repeat: -1
    });
  }

  move(left, right, up, down) {
    this.body.setVelocity(0);

    let moving = false;

    if (left) {
      this.body.setVelocityX(-this.speed);
      this.anims.play('left', true);
      this.lastDirection = 'left';
      moving = true;
    } else if (right) {
      this.body.setVelocityX(this.speed);
      this.anims.play('right', true);
      this.lastDirection = 'right';
      moving = true;
    }

    if (up) {
      this.body.setVelocityY(-this.speed);
      this.anims.play('up', true);
      this.lastDirection = 'up';
      moving = true;
    } else if (down) {
      this.body.setVelocityY(this.speed);
      this.anims.play('down', true);
      this.lastDirection = 'down';
      moving = true;
    }

    if (!moving) {
      this.anims.play(`idle-${this.lastDirection}`, true);
    }

    this.body.velocity.normalize().scale(this.speed);
  }
}
