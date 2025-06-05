import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { setupSocket } from './config/socket';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import { authenticateToken } from './middleware/auth.middleware';

import multer from 'multer';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';
import fs from 'fs';

// Environment
const dev = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 5000;
const uploadDir = path.join(__dirname, '../uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Express + HTTP Server
const app = express();
const httpServer = createServer(app);

// CORS configuration
const allowedOrigins = [
  'http://localhost:9000',
  'http://localhost:3000',
  'https://app.kersacco.co.ke',
  
];

const io = new IOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadDir));

// Routes

  connectDB();

  // app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);

 
  // Start server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Setup WebSocket
  setupSocket(io);

