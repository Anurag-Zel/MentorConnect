import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    mentor_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },

    name : {
        type : String,
        required : true,
        unique : false,
    },

    email : {
        type : String,
        required : true,
        unique : true,
    },

    total_rated : {
        type : Number,
        default : 0,
    },

    average_rating : {
        type : Number,
        default : 0.0,
    }
})

const Mentor = mongoose.model("mentor",mentorSchema);
export default Mentor;