import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    student_id : {
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
    }
})

const Student = mongoose.model("student",studentSchema);
export default Student;