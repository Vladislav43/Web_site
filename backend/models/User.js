import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordhash: {
        type: String,
        required: true,
    },
    // image :{type:Object,required:true},
    // matches: [
    //     {
    //         user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //         matchedAt: { type: Date, default: Date.now }
    //     }
    // ],
    dob_day: Number,
    dob_month: Number,
    dob_year: Number,
    show_gender: String,
    gender_identity: String,
    gender_interest: String,
    url: String,
    about: String
}, {
    timestamps: true
});


export default mongoose.model('User',UserSchema)