# How to Deploy Scribble Royale

## ⚠️ CRITICAL: Multiplayer Requirement
Before deploying, you **MUST** configure Firebase. The "Demo Mode" only works on **one device**.
If you deploy without Firebase keys, you and your friend will be in **separate** games and cannot see each other.

### 1. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a project -> Add Web App -> Copy `firebaseConfig`.
3. Open `src/db/firebase.js` in this project.
4. Replace the placeholder config with your actual keys.

---

## Option A: Play on Local Network (Same WiFi)
I have restarted the server with "Network Access" enabled.
1. Look at the terminal output for the **Network URL** (e.g., `http://192.168.1.5:5175`).
2. Send that link to your friend.
3. **Note**: You must be on the same WiFi.

## Option B: Deploy to Public Internet (Netlify)
If your friend is far away, use Netlify Drop (easiest method).

1. **Build the Project**:
   (I have already run this for you)
   ```bash
   npm run build
   ```
   This creates a `dist` folder in your project directory.

2. **Upload**:
   *   Go to [Netlify Drop](https://app.netlify.com/drop).
   *   Open your project folder `d:\scribble` in File Explorer.
   *   Drag and drop the **`dist`** folder onto the Netlify page.

3. **Share**:
   *   Netlify will give you a public URL (e.g., `https://random-name.netlify.app`).
   *   Send this to your friend!
