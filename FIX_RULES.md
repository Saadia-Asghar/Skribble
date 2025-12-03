# FIX FIREBASE CONNECTION

The "Timeout" error means your app cannot talk to the database. This is 99% caused by **Security Rules** blocking you.

## 1. Go to Database Rules
1. Open [Firebase Console](https://console.firebase.google.com/project/scribble-85248/database).
2. Click **Realtime Database** on the left.
3. Click the **Rules** tab at the top.

## 2. Update the Rules
You will see code that looks like this:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

**CHANGE IT TO THIS:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 3. Click "Publish"
Click the **Publish** button to save.

## 4. Check the URL (Important!)
Look at the **Data** tab.
At the top, you will see a URL like: `https://scribble-85248-default-rtdb.firebaseio.com/`

**Does it match exactly?**
If your URL ends in `firebasedatabase.app` (e.g. `europe-west1.firebasedatabase.app`), you MUST update your `.env` file to match it.

## 5. Restart
After fixing the rules, restart your app (`Ctrl+C`, `npm run dev`) and try again.
