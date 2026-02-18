import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"this is required"],

    },
    email:{
        type: String,
        required:[true,"Email is required"],
        unique:true,
        lowercase: true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength: 6,
    },
    avatar: {
        type:String,
        default:"",
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires:Date,

    favourites:[
        {
            id:{type: String, required : true},
            name: String,
            artist_name: String,
            image: String,
            duration: String,
            audio: String,
        },
    ],
});

//pre save function for password
userSchema.pre("save",async function (){
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

//compare password
userSchema.methods.comparePassword = function(enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
