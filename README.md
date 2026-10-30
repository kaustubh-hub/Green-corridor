# GreenCorridor AI: setup
1. Install Node.js 18 or newer.
2. Open `secrets.env` and paste your Gemini key after GEMINI_API_KEY=
3. Open `public/config.js` and paste your Google Maps key (browser key) as MAPS_API_KEY.
4. In a terminal in this folder: `npm install` then `npm start`, then open http://localhost:3000
5. To go live, deploy this folder to a Node host (Render, Railway, Google Cloud Run). Set GEMINI_API_KEY as an environment variable there instead of uploading secrets.env.

Google Cloud: enable "Maps JavaScript API" and "Directions API" for the Maps key. Restrict it to your website domain. Enable billing.
Gemini key: create at Google AI Studio. Keep it only in secrets.env.
Wrong-side (opposite lane) routing works in the demo grid only. Google Maps does not provide lane-level traffic.
