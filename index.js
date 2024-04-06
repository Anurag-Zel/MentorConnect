import express from "express";
import bodyParser from "body-parser";
import connect from "./Database/connection.js";
import Student from "./Models/Student.js";
import Mentor from "./Models/Mentor.js";
import Review from "./Models/Review.js";
import Recommend from "./Models/Recommend.js";

const app = express();
const port = 3000;   // server running on port 3000

//Middleware
app.use(bodyParser.json());

//route to view all the student details like name,email,student_id
app.get("/view/allStudents", async (req,res) => {
    try{
        const allStudents = await Student.find({}, { name: 1, email: 1, student_id: 1 });
        res.status(200).json({ students: allStudents });
    }catch(error){
        return res.status(400).send(error);
    }
})

//route to view all mentor details like name, email, mentor_id, total_rated, average_rating
app.get("/view/allMentors", async (req,res) => {
    try{
        const allMentors = await Mentor.find({}, { name: 1, email: 1, mentor_id: 1, total_rated: 1, average_rating: 1 });
        res.status(200).json({ mentors: allMentors });
    }catch(error){
        return res.status(400).send(error);
    }
})

//route to view list of mentors my specifing rating
app.get("/mentors_by_rating", async (req,res) => {
    const {upperLimit, lowerLimit} = req.body;

    try{
        if (upperLimit < 0 || upperLimit > 5 || lowerLimit < 0 || lowerLimit > 5 || upperLimit < lowerLimit) {
            return res.status(400).send("Invalid limits");
        }
        const allMentors = await Mentor.find({ average_rating: { $gte: lowerLimit, $lte: upperLimit } });
        res.status(200).json({ mentors: allMentors });
    }catch(error){
        return res.status(400).send(error);
    }
})

//route to view all the reviews of a mentor using mentor id
app.get("/reviews/:id", async (req,res) => {
    const mentorId = req.params.id;

    try{
        const existingMentor = await Mentor.findOne({mentor_id : mentorId});
        if(!existingMentor){
            return res.status(500).send("Invalid Mentor Id");
        }

        const mentorReviews = await Review.find({ reviewee_id: mentorId },{review_text : 1});
        res.status(200).json({ reviews: mentorReviews });

    }catch(error){
        return res.status(400).send(error);
    }
})

//route to view the letter of recommendation using the id of letter
app.get("/view/:id", async (req,res) =>{
    const letter_id = req.params.id; 
    
    try{
        const letter = await Recommend.findOne({recommend_id : letter_id});
        if(!letter){
            return res.status(400).send("No such recommendation exist");
        }

        const {letter_of_recommendation, recommender_id, recommendee_id} = letter;

        const student = await Student.findOne({student_id : recommendee_id});
        const mentor = await Mentor.findOne({mentor_id : recommender_id});

        if(!student || !mentor){
            return res.status(400).send("Error while fetching details");
        }

        const details = {
            letter_text : letter_of_recommendation,
            student_name : student.name,
            mentor_name : mentor.name,
        }

        return res.status(200).json(details);

    }catch(error){
        return res.status(400).send(error);
    }
})

// route to add new student
app.post("/studentRegister", async (req,res) => {
    const {name, email} = req.body;

    try{
        const existing = await Student.findOne({email : email});
        if(existing){
           return res.status(400).send("Email already used");
        }
        
        const newStudent = new Student({
            name : name,
            email : email,
        });

        await newStudent.save();
        return res.status(200).send("Student added successfully"); 
    }catch(error){
        return res.status(400).send(error);
    }
})

//route to add new mentor
app.post("/mentorRegister", async(req,res) => {
    const {name, email} = req.body;

    try{
        const existing = await Mentor.findOne({email : email});
        if(existing){
            return res.status(400).send("Email already used");
        }

        const newMentor = new Mentor({
            name : name,
            email : email,
            total_rated : 0,
            average_rating : 0.0
        });

        await newMentor.save();
        return res.status(200).send("Mentor added successfully"); 
    }catch(error){
        return res.status(400).send(error);
    }
})

//route to add a new review
app.post("/addReview", async (req,res) => {
    const {student_id, mentor_id, review_content, rate} = req.body;

    try{
        const existingStudent = await Student.findOne({student_id : student_id});
        if(!existingStudent){
            return res.status(400).send("Student not registered");
        }

        const existingMentor = await Mentor.findOne({mentor_id : mentor_id});
        if(!existingMentor){
            return res.status(400).send("Mentor not registered");
        }

        const existingReview = await Review.findOne({ reviewee_id: mentor_id, reviewer_id: student_id });
        if (existingReview) {
            return res.status(400).send("Cannot review same mentor more than once");
        }


        if (review_content.split(" ").length > 50) {
            return res.status(400).send("Review cannot exceed 50 words");
        }

        const newAvgRating = ((existingMentor.average_rating * existingMentor.total_rated) + rate)/(existingMentor.total_rated + 1);
        existingMentor.average_rating = newAvgRating;
        existingMentor.total_rated += 1;

        await existingMentor.save();

        const newReview = new Review({
            reviewer_id : student_id,
            reviewee_id : mentor_id,
            review_text : review_content,
            rate : rate,
        })

        await newReview.save();
        return res.status(200).send("Review added");


    }catch(error){
        if (error.code === 11000) { 
            return res.status(400).send("Duplicate review");
        }
        return res.status(400).send(error);
    }
})

// route to recommend student
app.post("/recommendStudent", async (req,res) => {
    const {student_id, mentor_id, text} = req.body;

    try{
        const existingStudent = await Student.findOne({student_id : student_id});
        if(!existingStudent){
            return res.status(400).send("Student not registered");
        }

        const existingMentor = await Mentor.findOne({mentor_id : mentor_id});
        if(!existingMentor){
            return res.status(400).send("Mentor not registered");
        }

        const existingRecommendation = await Recommend.findOne({ recommender_id: mentor_id, recommendee_id: student_id });
        if (existingRecommendation) {
            return res.status(400).send("Cannot recommend same student more than once");
        }

        const newRecommend = new Recommend({
            recommender_id : mentor_id,
            recommendee_id : student_id,
            letter_of_recommendation : text,
        })

        await newRecommend.save();
        return res.status(200).send("Student recommended successfully");

    }catch(error){
        if (error.code === 11000) { 
            return res.status(400).send("Duplicate recommendation");
        }
        return res.status(400).send(error);
    }
})

// Server will run only when a valid database conncetion is established.
connect().then(() => {
    try{
        app.listen(port, () => {
            console.log(`Server Running on port ${port}.`);
        })
    }catch(error){
        console.log("Error while connecting...");
    }
}).catch(error => {
    console.log("Invalid database connection...!");
})