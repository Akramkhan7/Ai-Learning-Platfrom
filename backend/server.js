import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './Routes/authRoutes.js';
import documentRoutes from './Routes/documentRoutes.js';
import flashcardRoutes from './Routes/flashcardRoutes.js';
import aiRoutes from './Routes/aiRoutes.js'
import quizRoutes from './Routes/quizRoutes.js'
import progressRoutes from './Routes/progressRoutes.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai',aiRoutes);
app.use('/api/quizzes',quizRoutes)
app.use('/api/progress',progressRoutes)

//Routes
app.use(errorHandler);


//404 handler
app.use((req, res) =>{
    res.status(404).json({
        success : false,
        error : 'Route not found.',
        STATUS_CODES : 404,
    })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
console.log(`Server running on PORT: ${PORT}`);
});

process.on('unhandledRejection', (err) =>{
console.log(`Error : ${err.message} `)
process.exit(1);
})