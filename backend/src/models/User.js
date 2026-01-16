import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        requred:true,
    },
    email : {
        type : String,
        required : true ,
        unique :trusted
    },
    profileImage : {
        type : String,
        default : ""
    },
    clerkId : {
        type : String,
        required : true,
        unique : true,
    },

    }, 
    
    {timestamps : true} // createdAt , updatedAt
);

const User = mongoose.model("User",userSchema)


export default User;