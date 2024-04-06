import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    review_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },

    reviewer_id : {
        type : String,
        required : true,
    },

    reviewee_id : {
        type : String,
        required : true,
    },

    review_text : {
        type : String,
        required : false,
    },

    rate : {
        type : Number,
        enum : [1,2,3,4,5],
        required : true,
    }
})

reviewSchema.index({ reviewer_id: 1, reviewee_id: 1 }, { unique: true });

const Review = mongoose.model("review",reviewSchema);
export default Review;