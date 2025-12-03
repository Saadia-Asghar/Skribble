# Firebase Setup Guide for Scribble Royale

Follow these exact steps to get your multiplayer game working online.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Create a project"** (or "Add project").
3. Enter a name (e.g., `Scribble-Royale`).
4. Toggle **OFF** "Enable Google Analytics" (it simplifies setup).
5. Click **"Create project"**. Wait for it to finish and click **"Continue"**.

## Step 2: Get Your API Keys
1. You should now be on the "Project Overview" page.
2. Look for the text "Get started by adding Firebase to your app" and click the **Web icon** `</>` (it looks like a code bracket).
3. **App nickname**: Enter `Scribble Web`.
4. Leave "Also set up Firebase Hosting" **unchecked**.
5. Click **"Register app"**.
6. You will see a code block under "Add Firebase SDK". Look for the `const firebaseConfig = { ... }` section.
7. **Keep this page open** or copy these values to a notepad. You need them for Step 4.

## Step 3: Enable Realtime Database (CRITICAL)
*If you skip this, the game will not work!*

1. On the left sidebar menu, click **Build** > **Realtime Database**.
2. Click **"Create Database"**.
3. **Database location**: Choose the default (usually `us-central1`). Click **Next**.
4. **Security rules**: Select **"Start in test mode"**.
   * *Note: This allows anyone with your keys to read/write for 30 days. This is perfect for development/demos.*
5. Click **"Enable"**.
6. You will see a URL at the top (e.g., `https://scribble-royale-default-rtdb.firebaseio.com/`). This is your `databaseURL`.

## Step 4: Add Keys to Your Project
1. Open the file named `.env` in your project folder (`d:\scribble\.env`).
2. Fill in the values from Step 2. It should look like this:

```env
VITE_FIREBASE_API_KEY=AIzaSyD... (from apiKey)
VITE_FIREBASE_AUTH_DOMAIN=scribble-royale.firebaseapp.com (from authDomain)
VITE_FIREBASE_DATABASE_URL=https://scribble-royale-default-rtdb.firebaseio.com (from Step 3 or databaseURL)
VITE_FIREBASE_PROJECT_ID=scribble-royale (from projectId)
VITE_FIREBASE_STORAGE_BUCKET=scribble-royale.appspot.com (from storageBucket)
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789 (from messagingSenderId)
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef (from appId)
```

## Step 5: Restart Your App
1. If your terminal is running, stop it (Click inside terminal, press `Ctrl+C`).
2. Run `npm run dev` again.
3. The "Demo Mode" warning should disappear, and you can now play with friends on different computers!
