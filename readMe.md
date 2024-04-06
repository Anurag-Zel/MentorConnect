# MentorConnect: Rating, Review, and Recommendation Platform

## Description:
MentorConnect is a web application designed to facilitate the exchange of feedback between mentors and students. It provides a platform where users can rate and review mentors based on their experiences, as well as allowing mentors to recommend students through letters of appreciation. The backend APIs of MentorConnect enable seamless communication between the frontend interface and the database, ensuring secure and efficient handling of user interactions.

# API Contract

## Base URL
The base URL for all API endpoints is 
```
http://localhost:3000.
```

## 1. View All Students
Endpoint: /view/allStudents

Method: GET

Description: Retrieves details of all registered students including name, email, and student ID.

Request Body: N/A

Response :-
 ```
 {
    "students": [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "student_id": "66116b7e0a7f8279abfd8bee"
        },
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "student_id": "66116b7e0a7f8279abfd8bsaa"
        }
    ]
}
```

Error Response :-
Status Code: 400
Body: Error message

## 2. View All Mentors
Endpoint: /view/allMentors

Method: GET

Description: Retrieves details of all registered mentors including name, email, mentor ID, total rated, and average rating.

Request Body: N/A

Response :- 
```
{
    "mentors": [
        {
            "name": "John Smith",
            "email": "john@example.com",
            "mentor_id": "66116b7e0a7f8279abfdasdsad",
            "total_rated": 5,
            "average_rating": 4.5
        },
        {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "mentor_id": "66116b7easdsf8279abfdasdsad",
            "total_rated": 3,
            "average_rating": 3.8
        }
    ]
}
```

Error Response:-
Status Code: 400
Body: Error message

## 3. View Mentors by Rating
Endpoint: /mentors_by_rating

Method: GET

Description: Retrieves list of mentors within specified rating range.

Request Body:-
```
{
    "upperLimit": 5,
    "lowerLimit": 3
}
```

Response:-
```
{
    "mentors": [
        {
            "name": "John Smith",
            "email": "john@example.com",
            "mentor_id": "66116b747895f8279abfd8bee",
            "total_rated": 5,
            "average_rating": 4.5
        },
        {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "mentor_id": "66116b747897f8279abfd8bee",
            "total_rated": 3,
            "average_rating": 3.8
        }
    ]
}
```

Error Response:-
Status Code: 400
Body: Error message

## 4. View Reviews of a Mentor
Endpoint: /reviews/:id

Method: GET

Description: Retrieves all reviews of a mentor specified by mentor ID.

Request Parameters: id (mentor ID)

Response:
```
{
    "reviews": [
        {
            "review_text": "Great mentor!",
        },
        {
            "review_text": "Very helpful and knowledgeable.",
        }
    ]
}
```

Error Response:-
Status Code: 400
Body: Error message

## 5. View Letter of Recommendation
Endpoint: /view/:id

Method: GET

Description: Retrieves details of a letter of recommendation specified by recommendation ID.
Request Parameters: id (recommendation ID)

Response:
```
{
    "letter_text": "I highly recommend this student for their dedication and hard work.",
    "student_name": "John Doe",
    "mentor_name": "Jane Smith"
}
```

Error Response:-
Status Code: 400
Body: Error message

## 6. Register New Student
Endpoint: /studentRegister

Method: POST

Description: Registers a new student with the provided name and email.

Request Body:-
```
{
    "name": "John Doe",
    "email": "john@example.com"
}
```

Response:- Success message

Error Response:-
Status Code: 400
Body: Error message

## 7. Register New Mentor
Endpoint: /mentorRegister

Method: POST

Description: Registers a new mentor with the provided name and email.

Request Body:
```
{
    "name": "Jane Smith",
    "email": "jane@example.com"
}
```

Response: Success message

Error Response:
Status Code: 400
Body: Error message

## 8. Add Review
Endpoint: /addReview

Method: POST

Description: Adds a new review for a mentor by a student.

Request Body:
```
{
    "student_id": "66116b7e0a7f8279abfdasdsad",
    "mentor_id": "66116b7e0a7f8279abfwwwdsad",
    "review_content": "Great mentor!",
    "rate": 5
}
```
Response: Success message

Error Response:
Status Code: 400
Body: Error message

## 9. Recommend Student
Endpoint: /recommendStudent

Method: POST

Description: Recommends a student by a mentor through a letter of recommendation.

Request Body:
```
{
    "student_id": "66116b7e0a7f8279abfdasdsad",
    "mentor_id": "66116b7e0a7f8279abfwwwdsad",
    "text": "I highly recommend this student for their dedication and hard work."
}
```

Response: Success message

Error Response:
Status Code: 400
Body: Error message

# Database Schema
This section outlines the structure of the four collections used in the MentorConnect application.

## 1. Mentor Collection
### Fields:
```
1. mentor_id: Unique identifier for the mentor (auto-generated ObjectId).

2. name: Mentor's name (String, required).

3. email: Mentor's email (String, required, unique).

4. total_rated: Total number of times the mentor has been rated (Number, default: 0).

5. average_rating: Average rating of the mentor (Number, default: 0.0).
```

## 2. Recommend Collection
### Fields:
```
1. recommend_id: Unique identifier for the recommendation (auto-generated ObjectId).

2. recommender_id: ID of the mentor recommending the student (String, required).

3. recommendee_id: ID of the student being recommended (String, required).

4. letter_of_recommendation: Text of the recommendation letter (String, required).
createdAt: Date and time when the recommendation was created (Date, default: Date.now).

5. Unique Constraint: No mentor can assign the same student two or more letters of recommendation.
```

## 3. Review Collection
### Fields:
```
1. review_id: Unique identifier for the review (auto-generated ObjectId).

2. reviewer_id: ID of the student giving the review (String, required).

3. reviewee_id: ID of the mentor being reviewed (String, required).

4. review_text: Text of the review (String).

5. rate: Rating given by the student (Number, enum: [1, 2, 3, 4, 5], required).

6. Unique Constraint: No student can review the same mentor more than once.
```

## 4. Student Collection
### Fields:
```
1. student_id: Unique identifier for the student (auto-generated ObjectId).

2. name: Student's name (String, required).

3. email: Student's email (String, required, unique).
```