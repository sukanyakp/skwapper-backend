import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import session from 'express-session'
import db from '../src/config/db'

dotenv.config()
db()  // we need to set for the mongoDB connection 

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));

app.use(session({
  secret : process.env.SESSION_SECRET as string,
  resave : false,
  saveUninitialized : false,
  cookie : {secure : false , maxAge : 24 * 60 * 60 * 1000 }
}))

app.use(express.json());
app.use('/', userRoutes)
app.use('/admin',adminRoutes)


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
