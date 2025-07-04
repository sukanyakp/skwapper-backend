import mongoose, { Schema } from "mongoose";
import { ref } from "process";

export interface IPayment {
    studentId : mongoose.Types.ObjectId;
    tutorId : mongoose.Types.ObjectId;
    sessionId?: mongoose.Types.ObjectId;
    amount : number
    status: "pending" | "succeeded" | "failed";
    stripePaymentId: string;
    paymentDate: Date;
}


const paymentSchema = new Schema<IPayment>({
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    tutorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    sessionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Session"
    },
    amount : {
        type : Number,
        required : true
    },
  status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
  stripePaymentId: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },

})



const Payment =  mongoose.model("Payments" , paymentSchema)
export default Payment