User Management App

This is a full-stack web application designed for user management, including adding, viewing, updating, and deleting user data. The application uses a MongoDB database and is built with Node.js and Express.js on the backend and plain HTML, CSS, and JavaScript on the frontend. This project is ideal for learning and practicing full-stack development.

Features

    Add New User: A form is provided to add new users with a username and age.

    View User List: All users are displayed in a paginated table.

    Update User: Users can be edited via an "Edit" button in the table.

    Delete User: Users can be deleted via a "Delete" button in the table.

    RESTful API: The backend exposes a set of RESTful API endpoints to handle CRUD (Create, Read, Update, Delete) operations.

Technologies Used

    Frontend:

        HTML5

        CSS3

        JavaScript (ES6+)

        Axios for API calls

    Backend:

        Node.js

        Express.js

        Mongoose for MongoDB object modeling

        MongoDB as the database

        dotenv for environment variables

        cors for Cross-Origin Resource Sharing

Prerequisites

    Node.js installed on your machine.

    A MongoDB database (local or cloud-hosted).

    A code editor (e.g., VS Code).

Installation and Setup

    Clone the repository (if applicable) or place the provided files into a new project directory.

    Navigate to the project root and install the necessary dependencies:
    Bash

npm install

Create a .env file in the root directory. This file will store your database connection string and server port. Add the following line, replacing <your-mongodb-url> with your actual MongoDB connection URL:
Ini, TOML

    MONGODBURL = <your-mongodb-url>
    PORT = 4000

    The .gitignore file is already set up to ignore this file, ensuring your sensitive data is not committed to a public repository.

How to Run the App

    Start the server: In your terminal, run the following command from the project root directory:
    Bash

    npm start

    The server will start and run at http://localhost:4000 by default.

    Open the frontend: Navigate to the frontend folder and open the index.html file in your web browser. You should see the User Management Dashboard.

API Endpoints

The backend exposes the following API endpoints:
Method	Endpoint	Description
GET	/api/getData	Fetches all user data from the database.
GET	/api/getSingleUsers/:userid	Fetches a single user by their ID.
POST	/api/sendData	Adds a new user to the database.
PUT	/api/updateData/:userid	Updates an existing user by their ID.
DELETE	/api/deleteData/:userid	Deletes a user by their ID.
