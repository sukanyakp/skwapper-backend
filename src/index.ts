import express from 'express';
import dotenv from 'dotenv';
dotenv.config()

import cors from 'cors';

import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import tutorRoutes from './routes/tutorRoutes'
import courseRoutes from './routes/courseRoutes'
import paymentRoutes from './routes/paymentRoutes'
import webhookRoutes from './routes/webhookRoutes'

import session from 'express-session'
import db from '../src/config/db'
import cookieParser from "cookie-parser";

db() 

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true               
}));

app.use(cookieParser());

app.use(session({
  secret : process.env.SESSION_SECRET as string,
  resave : false,
  saveUninitialized : false,
  cookie : {secure : false , maxAge : 24 * 60 * 60 * 1000 }
}))

app.use('/webhook/stripe',express.raw({type:"application/json"}),webhookRoutes);

app.use(express.json());
app.use('/auth',authRoutes)
app.use('/user', userRoutes)
app.use('/admin',adminRoutes)
app.use('/tutor',tutorRoutes)
app.use('/courses',courseRoutes)
app.use('/payment',paymentRoutes)


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
