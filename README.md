# Scribble 🎨

A real-time multiplayer drawing & guessing game built with React, Vite, Firebase, and TailwindCSS.
Features integrated DSA structures (Stack, Queue, Trie, MinHeap, HashMap) for game logic.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- Firebase Account

### 1. Installation

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Go to **Realtime Database** and create a database.
4. Set rules to **test mode** (read/write true) for development:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. Go to **Project Settings** > **General** > **Your apps** > **Add app** (Web).
6. Copy the `firebaseConfig` object.
7. Open `src/db/firebase.js` and replace the placeholder config with yours.

### 3. Run Locally

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing Instructions

### Local Testing
1. Open the app in one browser tab (Chrome).
2. Create a room.
3. Copy the **Room ID** from the top bar.
4. Open a new Incognito window or a different browser (Firefox/Edge).
5. Join the room using the Room ID and a different name.
6. **Host (Tab 1)**: Click "START GAME".
7. **Drawer**: Draw on the canvas. Verify it appears on the other tab.
8. **Guesser**: Type guesses. Verify correct guesses award points and show in chat.

### Multiplayer Testing
1. Deploy the app (see below) or use `ngrok` to expose localhost.
2. Share the URL with a friend or open on a second laptop.
3. Follow the same Create/Join flow.

### Firebase Emulator (Optional)
If you prefer not to use the live cloud DB:
1. `npm install -g firebase-tools`
2. `firebase init emulators`
3. `firebase emulators:start`
4. Update `src/db/firebase.js` to connect to localhost emulator.

---

## 📦 Deployment

### Vercel
1. Push code to GitHub.
2. Import project in Vercel.
3. Vercel will auto-detect Vite.
4. Deploy.
5. **Important**: Ensure your Firebase config is committed or set as Environment Variables.

### Netlify
1. Drag and drop the `dist` folder after running `npm run build`.
2. Or connect GitHub repo for auto-builds.

---

## 🧠 DSA Implementation Details

- **Stack**: Used in `CanvasBoard.jsx` (conceptually) and `src/dsa/Stack.js` for Undo/Redo history.
- **Queue**: Used in `ChatBox.jsx` and `src/dsa/Queue.js` for managing message flow.
- **Trie**: Used in `GuessBox.jsx` and `src/dsa/Trie.js` for efficient word validation.
- **MinHeap**: Used in `GameRoom.jsx` and `src/dsa/MinHeap.js` for selecting words based on difficulty.
- **HashMap**: Used in `PlayerList.jsx` and `src/dsa/HashMap.js` for efficient player score management.
