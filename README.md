# Meme Generator Web Application (MemeBolt)

A modern, full-stack, state-of-the-art Meme Generator crafted with a professional enterprise-grade design interface. Build, upload, and customize your own memes easily without any messy setups.

## Features
- **Browse Templates:** Real-time fetching from the Imgflip public API.
- **Meme Editor:** Canvas-based interactive text engine (customizable text size, font color, outline).
- **Custom Uploads:** Drag-and-drop your own personal images to meme on.
- **Local Storage:** Everything saves locally seamlessly, minimizing backend setup friction out of the box.
- **Unified Architecture:** The frontend UI is built and delivered natively through the Node Express backend, resulting in a painless, single-server launch.

## Tech Stack
**Frontend:** React (Vite), Tailwind CSS v4, Axios, React Router, Lucide Icons.
**Backend:** Node.js, Express.js, Multer (for image parsing), JSON Data storage.

---

## 🚀 Quick Start Instructions

Follow these two steps from the **root directory (`meme-generator-project`)** to get everything installed and running.

### 1. Install & Build
This command automatically installs the dependencies for both the frontend and backend, compiles the React UI, and merges it into the backend static folder.

```bash
npm run build
```

### 2. Launch Application
Start the unified application server.

```bash
npm start
```

*The full application (frontend interface + backend API) will now be running seamlessly at **http://localhost:5000***
