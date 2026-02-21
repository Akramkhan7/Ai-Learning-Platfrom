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
    console.log(`Server running in ${process.env.NODE_ENV} node on PORT : ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) =>{
console.log(`Error : ${err.message} `)
process.exit(1);
})