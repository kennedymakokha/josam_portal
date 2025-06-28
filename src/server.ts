import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { setupSocket } from './config/socket';
import { connectDB } from './config/db';
import serviceRoutes from './routes/service.routes';
import postRoutes from './routes/post.routes';
import authRoutes from './routes/auth.routes'
import codeRoutes from './routes/code.routes';
import appRoutes from './routes/app.routes'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';
import * as admin from 'firebase-admin';
const serviceAccount = require('../firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
// Environment
const dev = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 5000;

// Express + HTTP Server
const app = express();

const httpServer = createServer(app);
app.set('trust proxy', true);
// CORS configuration
const allowedOrigins = [
  "*",
  'http://localhost:9000',
  'http://localhost:3000',
  'https://formbuilder.mtandao.app',
  'https://4242-41-90-180-102.ngrok-free.app'
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

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// Routes

connectDB();
app.use('/api/codes', codeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/theme', appRoutes);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Setup WebSocket
setupSocket(io);

