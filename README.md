# Bass Configurator (Three.js + Vite)

This is a small 3D bass configurator built with **Three.js** and **Vite**.  
You can rotate the instrument, change colors, toggle parts, and adjust the environment using a built-in GUI panel.

---

## 🚀 How to Run the Project

### 1. Install dependencies

Make sure you have **Node.js** installed (version 16+ recommended).  
Then install the project dependencies:

```bash
npm install
```

---

### 2. Start the development server

Run:

```bash
npm run dev
```

or directly with Vite:

```bash
npx vite
```

This will start a local server (usually on **http://localhost:5173/**).

The browser should open automatically. If not, open it manually.

---

## 🎮 Controls

### Mouse Controls (OrbitControls)
- **Left mouse:** rotate camera
- **Right mouse:** pan
- **Scroll wheel:** zoom

---

## 🛠 GUI Features

The GUI panel lets you modify:

### 🎸 Bass
- Body Color  
- Pickguard Color  
- Show/Hide Pickguard  
- Show/Hide Pick  

### 🌄 Environment
- Background Color  
- Floor Color  
- Show/Hide Floor  

---

## 🧱 Technologies Used

- **Three.js** – 3D rendering
- **GLTFLoader** – loads GLB/GLTF models
- **OrbitControls** – smooth camera controls
- **lil-gui** – UI panel
- **Vite** – fast development server + bundler

---

## ✅ Requirements

- Node.js 16+
- Modern browser with WebGL2 support

---

Have fun customizing your bass! 🎸
