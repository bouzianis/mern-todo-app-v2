# MERN Todo App v2 — Launch Guide

## Prerequisites

- **Node.js** v24+ (via nvm4w)
- **MongoDB** installed locally
- **npm** (comes with Node)

## Quick Start (3 Terminals)

Open **3 separate terminals** and run the commands below in order.

---

### 1. MongoDB (Port 27017)

```powershell
mongod --dbpath C:\Users\your_workspace\data\db
```

> If the data directory doesn't exist yet, create it first:
> ```powershell
> mkdir C:\Users\your_workspace\data\db
> ```

---

### 2. Backend — Express API (Port 3001)

```powershell
cd C:\User\\your_workspace\MERN-Projects\mern-todo-app-v2\backend

# First time only — install dependencies
npm install

# Development mode (auto-restarts on changes)
npm run dev

# Or production mode
npm start
```

The backend connects to `mongodb://localhost:27017/mern-todo-v2` and listens on **port 3001**.

---

### 3. Frontend — React App (Port 3000)

#### Production build

```powershell
cd C:\Users\your_workspace\mern-todo-app-v2\frontend

# First time only — install dependencies
npm install

# Build production bundle
npm run build

# Serve the build
npx serve -s build -l 3000
```

Then open **http://localhost:3000** in your browser.

---

## Ports & URLs

| Service    | Port | URL                     |
|------------|------|-------------------------|
| Frontend   | 3000 | http://localhost:3000   |
| Backend    | 3001 | http://localhost:3001   |
| MongoDB    | 27017| mongodb://localhost:27017|

---

## Environment Variables

### Backend (`backend/.env`)

| `PORT`     | `3001`    
| `MONGO_URI`| `mongodb://localhost:27017/mern-todo-v2` 


---

## Troubleshooting

### Build fails with "Cannot find module" errors

This was caused by a corrupted npm cache. Fix:

```powershell
cd frontend
cmd /c "rd /s /q node_modules 2>nul"
del /f /q package-lock.json 2>nul
npm cache clean --force
npm install
npm run build
```

The `frontend/package.json` has a global override forcing `source-map` to v0.7.4:
```json
"overrides": { "source-map": "0.7.4" }
```

### Backend can't connect to MongoDB

Ensure `mongod` is running on port 27017 before starting the backend.

### Frontend dev server silently exits (Node 24)

`react-scripts` 5.0.1 has known compatibility issues with Node.js v24. Use the production build approach (Option A above) for a reliable experience.
