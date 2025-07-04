import mongoose, { Document } from "mongoose";

// Interface for User
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

// Schema
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
    isApproved:{                 
            type:Boolean,
            default:false
    },
    status:{
            type:String,
            enum:["applied","notApplied"],
            default:"notApplied"
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


// Export Model
export default mongoose.model<Iuser>('User' , userSchema)