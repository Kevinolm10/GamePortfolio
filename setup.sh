#!/usr/bin/env bash
set -e

echo "📦 Setting up project in current folder: $(pwd)"

# ---- Root setup ----
npm init -y || true
npm install concurrently json --save-dev

# ---- CLIENT ----
echo "🎮 Setting up client..."
mkdir -p client
cd client

# Manual Vite + dependencies
npm init -y
npm install vite three phaser socket.io-client

# Create folder structure
mkdir -p src/{scenes,three,components,utils,socket} public
touch index.html vite.config.js src/main.js src/scenes/MainScene.js

# index.html
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GamePortfolio</title>
  </head>
  <body>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
EOF

# vite.config.js
cat << 'EOF' > vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
  },
});
EOF

# main.js
cat << 'EOF' > src/main.js
import Phaser from 'phaser';
import io from 'socket.io-client';
import MainScene from './scenes/MainScene.js';

const socket = io('http://localhost:4000');
socket.on('connect', () => console.log('✅ Connected to server:', socket.id));

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene]
};

new Phaser.Game(config);
EOF

# MainScene.js
cat << 'EOF' > src/scenes/MainScene.js
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
EOF

# Update package.json scripts for client
npx json -I -f package.json -e '
this.scripts = { 
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}'

cd ..

# ---- SERVER ----
echo "🧠 Setting up server..."
mkdir -p server
cd server
npm init -y
npm install express socket.io pg dotenv cors
npm install --save-dev nodemon

mkdir -p src/{api,config,db,services,sockets,utils}
touch src/index.js .env

cat << 'EOF' > src/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api', (req, res) => res.send('✅ Express server running!'));

io.on('connection', (socket) => {
  console.log('🧩 User connected:', socket.id);
  socket.on('ping', () => socket.emit('pong'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('🚀 Server running on port', PORT));
EOF

cat << 'EOF' > .env
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/mydb
EOF

# Update server package.json scripts
npx json -I -f package.json -e '
this.scripts = { 
  "dev": "nodemon src/index.js"
}'

cd ..

# ---- SHARED + ROOT ----
echo "🧩 Creating shared folder..."
mkdir -p shared
echo "// shared constants" > shared/constants.js

# Root workspace scripts
npx json -I -f package.json -e '
this.private = true;
this.workspaces = ["client", "server"];
this.scripts = {
  "dev": "concurrently \"npm run dev -w client\" \"npm run dev -w server\"",
  "build": "npm run build -w client && npm run build -w server"
}'

cat << 'EOF' > docker-compose.yml
version: '3'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
EOF

echo ""
echo "✅ Project setup complete!"
echo "Run:"
echo "  npm run dev"
echo ""
