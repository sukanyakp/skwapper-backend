import { connect } from "http2";
import mongoose from "mongoose";

const connectDB = async () => {

   try {
    
    await mongoose.connect(process.env.MONGODB as string)
    console.log('Mongodb connected successfully');
    

   } catch (error) {
    console.log(error);
    
   }


}

export default  connectDB;
