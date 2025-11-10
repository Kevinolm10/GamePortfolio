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
    this.load.image('interorTiles', '/assets/images/floorsNwalls.png'); // tileset name in your JSON is "interorTiles"
    this.load.image('interiorObjects', '/assets/images/interiorAssets.png');        // name is "interiorObjects"


    this.load.spritesheet('table', '/assets/images/interiorAssets.png', { frameWidth: 16, frameHeight: 16 });

    // Load the Tiled map JSON
    this.load.tilemapTiledJSON('house', '/assets/tileMap/house.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'house' });

    console.log('map.tilesets:', map.tilesets.map(t => ({ name: t.name, firstgid: t.firstgid })));

    const tilesetA = map.addTilesetImage(map.tilesets[0].name, 'interorTiles');
    const tilesetB = map.addTilesetImage(map.tilesets[1].name, 'interiorObjects');

    const floorLayer = map.createLayer('floor', [tilesetA, tilesetB]);
    const outsideWallsLayer = map.createLayer('outsideWalls', [tilesetA, tilesetB]);
    const wallsLayer = map.createLayer('walls', [tilesetA, tilesetB]);
    const interiorObjectsLayer = map.createLayer('interiorObjects', [tilesetA, tilesetB]);
    const objectsTopLayer = map.createLayer('objectsTop', [tilesetA, tilesetB]);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      phone: Phaser.Input.Keyboard.KeyCodes.Q
    });

    this.load.once('complete', () => {
      Player.createAnimations(this);
      this.player = new Player(this, 400, 300);
      this.player.setScale(1);

      const Z = 2
      this.cameras.main.setZoom(Z);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    });
  }

  update() {
    if (!this.player) return;

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    this.player.move(left, right, up, down, this.wasd.phone.isDown);

  }
}
