# Mini Project Management Portal

A full-stack web application designed for simple project and task management. It allows users to create tasks, mark them as completed, delete them, and filter/search through their dashboard. The app features secure authentication, responsive design, dark mode, and a robust SQL database backend.

## Tech Stack
*   **Frontend**: React (Vite), Tailwind CSS v4, Lucide React (Icons)
*   **Backend**: Node.js, Express.js
*   **Database**: MySQL
*   **Testing**: Jest, Supertest

---

## Setup Steps

### 1. Clone the repository
```bash
git clone https://github.com/lasya2624/o2h---Mini-project-Mangement-Portal.git
cd o2h---Mini-project-Management-Portal
```

### 2. Database Setup
Ensure that you have MySQL installed and running locally on port `3306`.
By default, the application expects a database named `new` and connects using the username `root` and password `root`. The backend will automatically generate the required tables (`users` and `tasks`) upon its first successful run.

*(You can change these database credentials by editing the `backend/.env` file).*

### 3. Setup the Backend
Navigate to the backend directory, install the dependencies, and start the server.
```bash
cd backend
npm install
npm start
```
*The API will be available at `http://localhost:5000`.*

### 4. Setup the Frontend
In a new terminal window, navigate to the frontend directory, install the dependencies, and start the development server.
```bash
cd frontend
npm install
npm run dev
```
*The web app will be available at `http://localhost:5173`.*

---

## Assumptions Made

During the development of this portal, the following architectural and design assumptions were made:
1. **User Scope**: Tasks are private to the user who created them. Therefore, a basic authentication system with JWT was necessary to tie tasks to specific user IDs.
2. **Database System**: Originally built for an abstract SQL requirement, MySQL was explicitly selected. It's assumed the environment hosting the backend will have access to a MySQL daemon.
3. **Task Statuses**: A task fundamentally starts as either "Pending" or "In Progress", and its primary mutation is being marked as "Completed".
4. **Data Validation**: A task description requires a minimum of 20 characters to ensure detailed task reporting.
5. **Session Management**: JWT tokens are issued with a 24-hour expiration window and stored in the frontend's local storage.

---

## API Documentation

All API endpoints are prefixed with `http://localhost:5000`.

### Authentication

#### Register a New User
*   **Endpoint**: `POST /api/auth/register`
*   **Description**: Creates a new user account.
*   **Request Body**:
    ```json
    {
      "username": "johndoe",
      "password": "securepassword123"
    }
    ```
*   **Response (201 Created)**: Returns the newly generated user ID and username.

#### Log In
*   **Endpoint**: `POST /api/auth/login`
*   **Description**: Authenticates a user and issues a JWT token.
*   **Request Body**:
    ```json
    {
      "username": "johndoe",
      "password": "securepassword123"
    }
    ```
*   **Response (200 OK)**: Returns the JWT token and the username.

---

### Tasks

*Note: All task endpoints require an Authorization header.*
`Authorization: Bearer <your_jwt_token>`

#### Fetch All Tasks
*   **Endpoint**: `GET /api/tasks`
*   **Description**: Retrieves all tasks belonging to the authenticated user.
*   **Query Parameters (Optional)**:
    *   `status`: Filter by status (e.g., `Pending`, `Completed`).
    *   `search`: Search by title or description.
    *   `sort`: Sort by creation date (`newest` or `oldest`).
*   **Response (200 OK)**: Returns an array of task objects.

#### Fetch Dashboard Statistics
*   **Endpoint**: `GET /api/tasks/stats`
*   **Description**: Returns aggregate task counts for the dashboard.
*   **Response (200 OK)**:
    ```json
    {
      "total": 10,
      "completed": 5,
      "pending": 5
    }
    ```

#### Create a Task
*   **Endpoint**: `POST /api/tasks`
*   **Description**: Creates a new task.
*   **Request Body**:
    ```json
    {
      "title": "Build Login Page",
      "description": "Create a responsive login page. Must be longer than 20 chars.",
      "status": "Pending"
    }
    ```
*   **Response (201 Created)**: Returns the complete task object with ID and timestamps.

#### Update a Task
*   **Endpoint**: `PUT /api/tasks/:id`
*   **Description**: Updates an existing task (primarily used to mark as completed).
*   **Request Body**:
    ```json
    {
      "status": "Completed"
    }
    ```
*   **Response (200 OK)**: Returns the updated task object.

#### Delete a Task
*   **Endpoint**: `DELETE /api/tasks/:id`
*   **Description**: Permanently deletes a specific task.
*   **Response (200 OK)**: Returns a success message.
