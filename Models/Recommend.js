import mongoose  from "mongoose";

const recommendSchema = new mongoose.Schema({
    recommend_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },

    recommender_id : {
        type : String,
        required : true,
    },

    recommendee_id : {
        type : String,
        required : true,
    },

    letter_of_recommendation : {
        type : String,
        required : true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// no mentor can assign the same student two or more letter of recommendation.
recommendSchema.index({ recommender_id: 1, recommendee_id: 1 }, { unique: true });

const Recommend = mongoose.model("recommend_student",recommendSchema);
export default Recommend;