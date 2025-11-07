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
  socket.on('disconnect', () => console.log('❌ User disconnected:', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('🚀 Server running on port', PORT));
