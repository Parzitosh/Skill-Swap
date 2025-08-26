SkillSwap - Peer Learning & Barter Platform 🚀
SkillSwap is a full-stack web application designed to connect individuals who want to learn new skills by bartering their expertise. Built with Node.js, Express, and MongoDB, this platform allows users to create profiles, list skills they can teach and skills they want to learn, and connect with others through a real-time chat system.

This project was developed as part of the "Back End Engineering-II" (23CS008) course at Chitkara University.

Core Features ✨
User Authentication: Secure user registration and login system with password hashing (bcrypt.js) and session management (express-session).

Profile Management: Users can create and update their profiles, including listing "Skills Offered" and "Skills Needed".

User Dashboard: A central dashboard to view all other users on the platform and their respective skills.

Skill-Swap Request System: Users can send, receive, accept, or reject skill-swap requests to initiate a connection.

Real-Time Chat: Once a request is accepted, a private, real-time chat room is opened for the two users to communicate using Socket.IO.

Persistent Chat History: All chat messages are saved to the database, allowing users to view their conversation history upon re-entering a chat room.

Responsive Styling: A clean and modern user interface styled with the classless Pico.css framework.

Tech Stack 🛠️
Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Real-Time Communication: Socket.IO

Authentication: bcrypt.js for hashing, express-session for session management

Templating Engine: EJS (Embedded JavaScript)

Environment Variables: dotenv

Frontend
Styling: Pico.css (a classless CSS framework)

Templating: EJS for server-side rendering

Project Setup & Installation ⚙️
Follow these steps to get the project running on your local machine.

1. Prerequisites
Node.js and npm installed

A free MongoDB Atlas account (or a local MongoDB instance)

2. Clone the Repository
git clone <your-repository-url>
cd skillswap/server

3. Install Dependencies
Install all the required npm packages.

npm install

4. Set Up Environment Variables
Create a .env file in the skillswap/server/ directory. This file will store your database connection string and session secret.

Copy the contents of .env.example into your new .env file:

# .env.example

# MongoDB Atlas connection string
# Replace <username>, <password>, and your cluster details.
# Make sure to specify a database name (e.g., skillswap) in the URI.
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority

# A long, random string for securing sessions
SESSION_SECRET=yourrandomsessionsecretstring

Update the MONGO_URI and SESSION_SECRET with your own credentials.

5. Run the Application
Start the development server using Nodemon.

npm run dev

The server will start on http://localhost:3000.

Available Scripts
In the server/ directory, you can run the following commands:

npm run dev: Starts the server with Nodemon, which automatically restarts on file changes.

npm start: Starts the server in production mode using Node.
