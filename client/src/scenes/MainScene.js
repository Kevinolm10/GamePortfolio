import * as THREE from 'three';
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  create() {
    const canvas = this.add.dom(400, 300, document.createElement('canvas'));
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.node });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 5;

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(cube);

    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }
}
