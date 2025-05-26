import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import session from 'express-session'

dotenv.config()

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
app.use('/user', userRoutes)


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
