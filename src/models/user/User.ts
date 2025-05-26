import mongoose, { Document } from "mongoose";

export interface Iuser extends Document  {
    name : string
    email : string
    password : string
    role : string
    isBlocked : boolean
    isApproved:boolean  // tutor
    status:string
    title:string
    bio:string
    createdAt : Date
    updatedAt : Date
}

const userSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : true
    },
    email : {
        type : String ,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role:{
            type:String,
            enum:['student','admin'],
            default:'student'
    },
    isBlocked:{
            type:Boolean,
            default:false
    },
    isApproved:{                  // tutor
            type:Boolean,
            default:false
    },
    status:{
            type:String,
            enum:["pending","approved","rejected"],
            default:"pending"
    },
    title:{
            type:String,
            required:true
    },
    bio:{
            type:String,
            required:true
    },
},
{ 
    timestamps : true
}
)

export default mongoose.model<Iuser>('User' , userSchema)