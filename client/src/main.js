import Phaser from 'phaser';
import io from 'socket.io-client';
import MainScene from './scenes/MainScene.js';

const socket = io('http://localhost:4000');
socket.on('connect', () => console.log('✅ Connected to server:', socket.id));

const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 750,
  scene: [MainScene]
};

new Phaser.Game(config);
