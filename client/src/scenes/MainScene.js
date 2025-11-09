import Phaser from 'phaser';
import AssetLoader from '../components/assetLoader.js';
import Player from '../components/player.js';
import Objects from '../components/objects.js';


export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    AssetLoader.loadAssets(this);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.load.once('complete', () => {
      Player.createAnimations(this);
      this.player = new Player(this, 400, 300);
      this.player.setScale(3);

      const tableFrames = [883, 884, 899, 900];
      this.table = new Objects(this, 200, 200, 'table', tableFrames);
      this.table.setScale(2);

      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    });
  }

  update() {
    if (!this.player) return;

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    this.player.move(left, right, up, down);

    
  }
}
