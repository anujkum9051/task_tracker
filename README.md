# Team Task Manager

A production-ready full-stack task management app for admins and members. It includes JWT auth, role-based access control, project membership, task assignment, task status updates, filters, deadlines, overdue highlighting, and a Railway-compatible build path.

## Tech Stack

- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication with bcrypt password hashing

## Folder Structure

```txt
frontend/
  src/
    components/
    context/
    pages/
    services/
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
```

## Requirements

- Node.js 20+
- MongoDB database, local or hosted

## Local Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Create environment files:

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

4. Run the app:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend API runs at `http://localhost:5000`.

## API Overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Projects:

- `POST /api/projects` admin only
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/members` admin only

Tasks:

- `POST /api/tasks` admin only
- `GET /api/tasks?status=&project=&assignedTo=&search=`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` admin only

Users:

- `GET /api/users`
- `POST /api/users/invite` admin only

## Roles

Admin users can create projects, invite users, manage project members, assign tasks to any user, view all tasks, update tasks, and delete tasks.

Member users can view projects they belong to, view assigned tasks, and update the status of tasks assigned to them.

## Railway Deployment

Create a Railway service from this repository and add these environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your-railway-app-url>
```

Use these commands:

- Build command: `npm run build`
- Start command: `npm start`

The backend serves the built Vite frontend from `frontend/dist` in production.

## Notes

- Public signup supports choosing `admin` or `member` for demo convenience. For a stricter production policy, restrict admin creation to an invite flow or seed the first admin.
- Invited users receive a generated temporary password in the API response so the admin can share it securely.
