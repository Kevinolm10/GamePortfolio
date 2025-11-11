import Phaser from 'phaser';
import AssetLoader from '../components/assetLoader.js';
import Player from '../components/player.js';
import Objects from '../components/objects.js';
import collisonZone from '../services/game/collision.js';
import debug from '../services/game/debug.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Load assets using AssetLoader
    AssetLoader.loadAssets(this);

    // Load tile images
    this.load.image('interorTiles', '/assets/images/floorsNwalls.png');
    this.load.image('interiorObjects', '/assets/images/interiorAssets.png');

    this.load.spritesheet('table', '/assets/images/interiorAssets.png', { frameWidth: 16, frameHeight: 16 });

    // load player sprite sheet
    this.load.spritesheet('player', '/assets/images/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    // Load the Tiled map JSON
    this.load.tilemapTiledJSON('house', '/assets/tileMap/house.json');
  }

  create() {
    // Tilemap Setup
    const map = this.make.tilemap({ key: 'house' });

    // Add tilesets
    const tilesetA = map.addTilesetImage(map.tilesets[0].name, 'interorTiles');
    const tilesetB = map.addTilesetImage(map.tilesets[1].name, 'interiorObjects');

    // Create layers
    const floorLayer = map.createLayer('floor', [tilesetA, tilesetB]);
    const outsideWallsLayer = map.createLayer('outsideWalls', [tilesetA, tilesetB]);
    const wallsLayer = map.createLayer('walls', [tilesetA, tilesetB]);
    const interiorObjectsLayer = map.createLayer('interiorObjects', [tilesetA, tilesetB]);
    const objectsTopLayer = map.createLayer('objectsTop', [tilesetA, tilesetB]);

    // Player Setup
    Player.createAnimations(this);
    this.player = new Player(this, 270, 200);
    this.player.setScale(1);

    // Collision Setup
    collisonZone(this, { outsideWallsLayer, wallsLayer, interiorObjectsLayer, objectsTopLayer }, this.player);

    // Debugging
    debug(this, { outsideWallsLayer, wallsLayer, interiorObjectsLayer, objectsTopLayer }, false, { setAllCollisions: false, map });


    // Camera Setup
    const Z = 2;
    this.cameras.main.setZoom(Z);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);


    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      phone: Phaser.Input.Keyboard.KeyCodes.Q
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
