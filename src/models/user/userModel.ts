import mongoose, { Document ,Types} from "mongoose";

// Interface for User
export interface Iuser extends Document  {
    _id: mongoose.Types.ObjectId; 
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
    tutorProfileId : mongoose.Types.ObjectId; // not string ok ? 
   
}

// Schema
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    tutorProfileId : {
        type: mongoose.Schema.Types.ObjectId, ref: "TutorProfile", // why we need to mension here as TutorProfile ?
    }
  
},
{ 
    timestamps : true
}
)


// Export Model
export default mongoose.model<Iuser>('User' , userSchema)