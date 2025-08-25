## Task Manager API

A lightweight Node.js/Express API for managing user accounts and personal tasks using JSON file storage. Includes session-based authentication, input validation, and centralized error handling.

### Features
- **Auth**: Signup, login, logout via `express-session` (cookie-based)
- **Tasks**: CRUD for tasks scoped to the logged-in user
- **Validation**: Request body validation with consistent 4xx errors
- **Error handling**: Centralized 404 and error middleware
- **Config**: `.env` support for port and session secret

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Auth**: express-session, bcrypt
- **Storage**: JSON files (`users.json`, `tasks.json`)

### Getting Started
1) Install dependencies
```bash
npm install
```

2) Environment variables (create a `.env` in project root)
```bash
PORT=5000
SESSION_SECRET=your-secure-random-secret
NODE_ENV=development
```

3) Run
```bash
# development (with reload)
npm run dev

# production
npm start
```

Server starts on `http://localhost:${PORT}` (default `5000`). CORS is enabled for `http://localhost:3000` with credentials.

### API Overview
Base URL: `/api`

#### Auth
- `POST /api/auth/signup`
  - Body: `{ "username": string(min 3), "password": string(min 6) }`
  - 201 Created → `{ message }`
  - 409 Conflict if user exists

- `POST /api/auth/login`
  - Body: `{ "username": string, "password": string }`
  - 200 OK → `{ message }` and sets session cookie
  - 401 Unauthorized on bad credentials

- `POST /api/auth/logout`
  - 200 OK → `{ message }`

#### Tasks (requires session cookie)
- `GET /api/tasks`
  - 200 OK → `[ { id, username, title, priority } ]` (only current user’s tasks)

- `POST /api/tasks`
  - Body: `{ "title": string, "priority": "low" | "medium" | "high" }`
  - 201 Created → task object
  - 400 Bad Request on invalid input

- `PUT /api/tasks/:id`
  - Body: `{ "title"?: string, "priority"?: "low" | "medium" | "high" }`
  - 200 OK → updated task
  - 404 Not Found if not owned or missing

- `DELETE /api/tasks/:id`
  - 200 OK → `{ message }`
  - 404 Not Found if not owned or missing

### Error Handling
- Unknown route → 404 `{ message: "Route not found" }`
- Validation/auth errors → 4xx with `{ message, details? }`
- Server errors → 500 `{ message: "Internal Server Error" }` (details not exposed in production)

### Project Structure
```
task-manager/
  app.js               # Express app setup, CORS, sessions, routes, error handlers
  server.js            # Server bootstrap
  config/sessionConfig.js
  middleware/          # auth, async handler, http error, error middleware
  controllers/         # auth and task controllers
  models/              # file-backed models for users and tasks
  routes/              # route definitions
  users.json           # created on first write
  tasks.json           # created on first write
```

### Notes
- Update CORS origin in `app.js` if your frontend URL differs
- Use HTTPS and set `cookie.secure=true` in production (`config/sessionConfig.js`)
- Files are read/write synchronously for simplicity; suitable for demos or small workloads
