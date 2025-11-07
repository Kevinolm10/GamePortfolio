import Phaser from 'phaser';
import AssetLoader from '../assets/assets.json';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.player = null;
  }

  async preload() {
    // Load all assets from JSON
    await AssetLoader.loadAssets(this);
  }

  async create() {

  }

  update(time, delta) {

  }
}
