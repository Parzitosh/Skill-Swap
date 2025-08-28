SkillSwap - Peer Learning & Barter Platform 🚀
SkillSwap is a full-stack web application designed to connect individuals who want to learn new skills by bartering their expertise. Built with Node.js, Express, MongoDB, and EJS, this platform allows users to create profiles, list skills, and connect with others through a real-time chat system.

This project was developed as part of the "Back End Engineering-II" (23CS008) course at Chitkara University, demonstrating a comprehensive understanding of modern backend technologies and architecture.

Core Features ✨
🔐 User Authentication: Secure user registration and login with password hashing (bcrypt.js) and persistent session management (express-session).

👤 User Profiles: Users can create and update their profiles with a bio, location, and lists of "Skills Offered" and "Skills Needed".

🔍 Search & Filter: A dynamic dashboard where users can search for others based on the skills they offer.

🤝 Skill Matching Engine: Proactively suggests relevant users to connect with based on mutual skill needs.

📬 Request System: A complete system to send, receive, accept, or reject skill-swap requests.

⭐ Rating & Review System: Users can leave a rating (1-5) and a text review for others after a swap, with average ratings displayed publicly.

❤️ Bookmark/Wishlist: Users can save profiles they are interested in to a personal wishlist for easy access later.

💬 Real-Time Chat: Once a request is accepted, a private, real-time chat room is opened for the two users to communicate using Socket.IO.

📚 Persistent Chat History: All chat messages are saved to the database, allowing users to view their conversation history.

🔔 In-App Notifications: A notification system alerts users to new requests and updates to their existing requests.

Tech Stack 🛠️
Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Real-Time Communication: Socket.IO

Authentication: bcrypt.js, express-session

Templating Engine: EJS (Embedded JavaScript)

Environment Variables: dotenv

Frontend
Styling: Pico.css (a modern, classless CSS framework for clean semantics)

Templating: EJS for server-side rendering

Project Setup & Installation ⚙️
Follow these steps to get the project running on your local machine.

1. Prerequisites
Node.js and npm installed

A free MongoDB Atlas account (or a local MongoDB instance)

2. Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/server

3. Install Dependencies
Install all the required npm packages.

npm install

4. Set Up Environment Variables
Create a .env file in the skillswap/server/ directory. This file will store your database connection string and session secret.

# .env file

# MongoDB Atlas connection string
# Replace <username>, <password>, and your cluster details.
# Make sure to specify a database name (e.g., skillswap) in the URI.
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority

# A long, random string for securing sessions
SESSION_SECRET=yourrandomsessionsecretstringgoeshere

Update the MONGO_URI and SESSION_SECRET with your own credentials.

5. Run the Application
Start the development server using Nodemon.

npm run dev

The server will start on http://localhost:3000.

Available Scripts
In the server/ directory, you can run the following commands:

npm run dev: Starts the server with Nodemon, which automatically restarts on file changes.

npm start: Starts the server in a production-ready mode.