import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 100;
    this.setFrame(0);

    this.lastDirection = 'down';

    // enable collision with canvas boundaries and other objects
    this.setCollideWorldBounds(true);
    this.body.setBounce(1, 1);
    const bodySize = this.body.setSize(10, 18);
    const bodyOffset = this.body.setOffset(3, 14);

    // Sprite dimensions
    const spriteWidth = 16;
    const spriteHeight = 32;
    const collisionWidth = spriteWidth;
    const collisionHeight = spriteHeight / 4;

    this.body.setSize(collisionWidth, collisionHeight);
    this.body.setOffset(0, spriteHeight - collisionHeight);

    // ray for interaction
    const rayLength = 300;
    // ray facing direction
    this.facingDirection = 'down' || 'up' || 'left' || 'right';

    this.interactionRay = new Phaser.Geom.Line(0, 0, 0, rayLength);

      // graphics for ray debugging
    this.rayGraphics = scene.add.graphics();
    this.rayGraphics.setDepth(1000);
    this.rayGraphics.setVisible(false);
  }

  static createAnimations(scene) {
    const FRAME_RATE = 8;
    const IDLE_FRAME_RATE = 4;

    if (!scene.anims.exists('idle-down')) {
      scene.anims.create({
        key: 'idle-down',
        frames: [
          { key: 'player', frame: 42 },
          { key: 'player', frame: 43 },
          { key: 'player', frame: 44 },
          { key: 'player', frame: 45 },
          { key: 'player', frame: 46 },
          { key: 'player', frame: 47 }
        ],
        frameRate: IDLE_FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('idle-right')) {
      scene.anims.create({
        key: 'idle-right',
        frames: [
          { key: 'player', frame: 24 },
          { key: 'player', frame: 25 },
          { key: 'player', frame: 26 },
          { key: 'player', frame: 27 },
          { key: 'player', frame: 28 },
          { key: 'player', frame: 29 }
        ],
        frameRate: IDLE_FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('idle-left')) {
      scene.anims.create({
        key: 'idle-left',
        frames: [
          { key: 'player', frame: 36 },
          { key: 'player', frame: 37 },
          { key: 'player', frame: 38 },
          { key: 'player', frame: 39 },
          { key: 'player', frame: 40 },
          { key: 'player', frame: 41 }
        ],
        frameRate: IDLE_FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('idle-up')) {
      scene.anims.create({
        key: 'idle-up',
        frames: [
          { key: 'player', frame: 30 },
          { key: 'player', frame: 31 },
          { key: 'player', frame: 32 },
          { key: 'player', frame: 33 },
          { key: 'player', frame: 34 },
          { key: 'player', frame: 35 }
        ],
        frameRate: IDLE_FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('down')) {
      scene.anims.create({
        key: 'down',
        frames: scene.anims.generateFrameNumbers('player', { start: 66, end: 70 }),
        frameRate: FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('left')) {
      scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('player', { start: 60, end: 65 }),
        frameRate: FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('right')) {
      scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('player', { start: 48, end: 53 }),
        frameRate: FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('up')) {
      scene.anims.create({
        key: 'up',
        frames: scene.anims.generateFrameNumbers('player', { start: 54, end: 59 }),
        frameRate: FRAME_RATE,
        repeat: -1
      });
    }

    if (!scene.anims.exists('phone')) {
      scene.anims.create({
        key: 'phone',
        frames: scene.anims.generateFrameNumbers('player', { start: 144, end: 152 }),
        frameRate: FRAME_RATE,
        repeat: -1
      });
    }
  }

  move(left, right, up, down, phone = false) {
    this.body.setVelocity(0);

    let moving = false;

    if (left) {
      this.body.setVelocityX(-this.speed);
      this.anims.play('left', true);
      this.lastDirection = 'left';
      this.facingDirection = 'left';
      moving = true;
    } else if (right) {
      this.body.setVelocityX(this.speed);
      this.anims.play('right', true);
      this.lastDirection = 'right';
      this.facingDirection = 'right';
      moving = true;
    }

    if (up) {
      this.body.setVelocityY(-this.speed);
      this.anims.play('up', true);
      this.lastDirection = 'up';
      this.facingDirection = 'up';
      moving = true;
    } else if (down) {
      this.body.setVelocityY(this.speed);
      this.anims.play('down', true);
      this.lastDirection = 'down';
      this.facingDirection = 'down';
      moving = true;
    }

    if (!moving) {
      this.anims.play(`idle-${this.lastDirection}`, true);
    }

    if (!moving && phone) {
      this.anims.play('phone', true);
    }

    this.body.velocity.normalize().scale(this.speed);
  }


  updateInteractionRay() {
    if (!this.interactionRay) return;

    const debugOn = !!this.scene.debugEnabled;

    if (!this.rayGraphics) {
      this.rayGraphics = this.scene.add.graphics();
      this.rayGraphics.setDepth(1000);
    }

    const rayLen = 20;
    const startX = this.x;
    const startY = this.y + Math.round(this.displayHeight * 0.25);

    let endX = startX;
    let endY = startY;
    switch (this.facingDirection) {
        case 'up': endY = startY - rayLen; break;
        case 'down': endY = startY + rayLen; break;
        case 'left': endX = startX - rayLen; break;
        case 'right': endX = startX + rayLen; break;
    }

    this.interactionRay.setTo(startX, startY, endX, endY);

    if (debugOn) {
        this.rayGraphics.setVisible(true);
        this.rayGraphics.clear();
        this.rayGraphics.lineStyle(2, 0xff0000, 1);
        this.rayGraphics.strokeLineShape(this.interactionRay);
        this.rayGraphics.strokeRectShape(this.getBounds());
    } else {
        if (this.rayGraphics.visible) {
          this.rayGraphics.clear();
          this.rayGraphics.setVisible(false);
        }
    }
  }
}