import mongoose, { Document } from "mongoose";

export interface Iuser extends Document  {
    name : string
    email : string
    password : string
    role : "student" | "tutor" | "admin"
    profilePic : string
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
            enum:['student',"tutor",'admin'],
            required : true,
            default:'student'
    },
    profilePic : {
        type : String
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
    },
    bio:{
            type:String,  
    },
},
{ 
    timestamps : true
}
)

export default mongoose.model<Iuser>('User' , userSchema)