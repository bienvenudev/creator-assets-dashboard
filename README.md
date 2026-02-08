# Creator Assets Dashboard

A modern web application for managing and previewing 3D models, audio, video, and image files. Built with React, TypeScript, Three.js, and Tailwind CSS v4.

## Setup

### Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Browser**: Modern browser with WebGL support (Chrome, Firefox, Safari, Edge)

### Install
```bash
npm install
```

### Run
**Two terminals required:**

Terminal 1 - API Server:
```bash
npm run api
```
Starts json-server on `http://localhost:3001`

Terminal 2 - Dev Server:
```bash
npm run dev
```
Starts Vite dev server on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

### Test
```bash
npm test              # Run all tests
npm run test:ui       # Run with UI
npm run build         # Build for production
```

## Assumptions

1. **Mock Upload**: File uploads create blob URLs (in-memory). Files don't persist after page refresh. For production would use real storage (Cloudflare).

2. **3D Model Format**: Only GLB format supported (single-file format). GLTF requires multiple files which complicates uploads.

3. **API Server**: Assumes `json-server` running on port 3001. Data resets on server restart (expected for mock API).

4. **No Authentication**: Open access for demo purposes. Production would require auth.

5. **Categories**: Limited to 4 types (3D Model, Audio, Video, Image).

6. **Browser Support**: Requires modern browser with ES6+, WebGL for 3D rendering.

## Tradeoffs

**Blob URLs for uploaded files**  
Files don't persist after refresh, but keeps the demo simple. Production would use cloud storage (Cloudflare R2, AWS S3).

**Separate page instead of modal**  
Used React Router (`/asset/:id`) for asset details. More setup, but gives shareable URLs and full-screen 3D viewer.

**React Three Fiber over vanilla Three.js**  
Additional dependency, but integrates cleanly with React and handles lifecycle automatically.

## What I would improve with more time

**Persistent storage**: Save uploaded files to `public/models/` or cloud storage instead of blob URLs

**Delete/Edit assets**: Add buttons to delete or update asset details (name, tags, description)

**Better 3D controls**: Add lighting adjustments, camera position presets (front/side/top views), screenshot feature

**Performance**: Virtual scrolling for large lists (1000+ assets), lazy load thumbnails

**Accessibility**: Keyboard navigation, ARIA labels, screen reader support

---

## Tech Stack

- **Frontend**: React 19, TypeScript
- **3D Rendering**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Testing**: Vitest, React Testing Library
- **Mock API**: json-server
- **Build**: Vite 7

---

**Assessment**: DRE Frontend-leaning Full-Stack Intern  
**Developer**: Bienvenu Cyuzuzo  
**Date**: February 2026
