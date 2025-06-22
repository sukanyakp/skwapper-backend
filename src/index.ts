import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import tutorRoutes from './routes/tutorRoutes'
import session from 'express-session'
import db from '../src/config/db'
import cookieParser from "cookie-parser";

dotenv.config()
db() 

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));

app.use(cookieParser());

app.use(session({
  secret : process.env.SESSION_SECRET as string,
  resave : false,
  saveUninitialized : false,
  cookie : {secure : false , maxAge : 24 * 60 * 60 * 1000 }
}))

app.use(express.json());
app.use('/auth',authRoutes)
app.use('/user', userRoutes)
app.use('/admin',adminRoutes)
app.use('/tutor',tutorRoutes)


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
