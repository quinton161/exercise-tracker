# Exercise Tracker API

A full-stack JavaScript application that allows users to track their exercises. This project meets all the requirements of the freeCodeCamp Exercise Tracker challenge.

## Features

* Create new users
* Add exercises for users with descriptions, durations, and dates
* Retrieve user exercise logs
* Filter logs by date range and limit the number of results
* Full API and web interface

## API Endpoints

* `POST /api/users` - Create a new user  
   * Body: `{ username: String }`  
   * Response: `{ username: String, _id: String }`
* `GET /api/users` - Get a list of all users  
   * Response: `[{ username: String, _id: String }, ...]`
* `POST /api/users/:_id/exercises` - Add an exercise for a user  
   * Body: `{ description: String, duration: Number, date: String (optional) }`  
   * Response: `{ _id: String, username: String, description: String, duration: Number, date: String }`
* `GET /api/users/:_id/logs` - Get a user's exercise log  
   * Query Parameters:  
         * `from` - Date (yyyy-mm-dd)  
         * `to` - Date (yyyy-mm-dd)  
         * `limit` - Number  
   * Response: `{ _id: String, username: String, count: Number, log: [{ description: String, duration: Number, date: String }, ...] }`

## Installation

1. Clone the repository:  
```
git clone <repository-url>  
```
2. Install dependencies:  
```
npm install  
```
3. Create a `.env` file in the root directory with the following variables:  
```
PORT=3001  
MONGO_URI=mongodb://localhost:27017/exercise-tracker  
```
4. Make sure MongoDB is running on your system.
5. Start the application:  
```
npm start  
```
6. For development with auto-restart:  
```
npm run dev  
```
7. Open the application in your browser:  
```
http://localhost:3001  
```

## Project Structure

* `server.js` - Main application entry point
* `models/` - Database models  
   * `User.js` - User model  
   * `Exercise.js` - Exercise model
* `routes/` - API routes  
   * `users.js` - User and exercise routes
* `public/` - Frontend files  
   * `index.html` - Main HTML page  
   * `style.css` - CSS styles  
   * `script.js` - Frontend JavaScript

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* HTML/CSS
* JavaScript (ES6+)

## Example Usage

### Create a new user

```
POST /api/users
Body: { username: "johndoe" }
```

### Add an exercise

```
POST /api/users/5fb5853f734231456ccb3b05/exercises
Body: { 
  description: "Morning Run", 
  duration: 30,
  date: "2023-01-15"
}
```

### Get user logs

```
GET /api/users/5fb5853f734231456ccb3b05/logs?from=2023-01-01&to=2023-01-31&limit=5
```

## FCC Test Requirements

This application passes all the FreeCodeCamp test requirements:

1. You can POST to /api/users with form data username to create a new user
2. The returned response from POST /api/users is an object with username and _id properties
3. You can make a GET request to /api/users to get a list of all users
4. The GET request to /api/users returns an array
5. Each element in the array has username and _id properties
6. You can POST to /api/users/:_id/exercises with form data description, duration, and date
7. The response from POST /api/users/:_id/exercises has the correct format
8. You can make a GET request to /api/users/:_id/logs to retrieve exercise logs
9. The GET response includes count property representing the number of exercises
10. The log array in the response contains all exercises with description, duration, and date properties 