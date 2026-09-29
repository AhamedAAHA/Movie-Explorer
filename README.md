<<<<<<< HEAD
# Movie-Explorer
Discover Your Favorite Films
=======
# Movie Explorer – Discover Your Favorite Films

Loons Lab Developer Selection Test implementation (React + TMDb), with a
cinematic UI and CineMate — a trilingual voice movie buddy (EN / සිංහල / தமிழ்).

## Features
- **Auth:** Register / Login / Logout with session persistence (SHA-256 hashed
  passwords in localStorage). All main routes protected.
- **Cinematic UI:** dark + light theater themes, rotating hero, trending rail,
  hover-lift poster cards, page transitions, skeleton loaders, glass navbar.
- **Search + Discover:** debounced search, trending rail, genre/year/rating filters.
- **Grid:** poster, title, release year, rating, favorite heart. Click → details.
- **Details:** backdrop banner, overview, genres, top cast, runtime, YouTube trailer.
- **CineMate chatbot:** floating bubble, text + mic. Say "I want a romantic movie"
  (or ආදර ෆිල්ම් / காதல் படம்) and it suggests real TMDb titles, reads the reply
  aloud, and lets you save / open trailers inline. Mood chips + Surprise me.
- **State:** React Context API (`AuthContext`, `MovieContext`); favorites + last
  search persist in localStorage.
- **Demo mode:** works with no keys (mock catalogue + keyword brain). Add keys
  for live TMDb + AI answers.

## Setup
```bash
cd movie-explorer
cp .env.example .env   # fill in keys (see below)
npm install
npm start              # http://localhost:3000
```

Keys:
- `REACT_APP_TMDB_API_KEY` — free at https://www.themoviedb.org/settings/api (v3)
- `AIML_API_KEY` — https://aimlapi.com (server-only, Vercel env)
- `SPEECHMATICS_API_KEY` — https://www.speechmatics.com (server-only, Vercel env)

Without the last two, chat still works: browser mic + keyword brain take over.

## How CineMate works
- Mic → `POST /api/transcribe` (Speechmatics) → `{ text, lang }`.
  Falls back to the browser Web Speech API when no key is set.
- Text → `POST /api/chat` (AIML.io) → `{ lang, genre, rating, reply }`.
  Falls back to the keyword brain in `src/api/assistant.js`.
- The app queries TMDb `discover` with that genre/rating, so every suggestion
  is a real movie — the model never invents titles.
- Replies are spoken back with `speechSynthesis` in the detected language.

## TMDb endpoints used (`src/api/tmdb.js`, axios)
- `GET /trending/movie/week` – trending + hero
- `GET /search/movie?query=` – search
- `GET /movie/{id}?append_to_response=videos,credits` – details + trailer + cast
- `GET /genre/movie/list` – filter options
- `GET /discover/movie?...` – filters + chatbot picks

## Structure
```
src/
  api/         tmdb.js, mockData.js, assistant.js (chat brain), voice.js
  context/     AuthContext.js, MovieContext.js
  components/  Navbar, Hero, TrendingRow, SearchBar, MovieCard, MovieGrid,
               FilterBar, TrailerModal, ProtectedRoute, Chatbot/ChatWidget
  hooks/       useInfiniteScroll.js
  pages/       Home, MovieDetails, Favorites, Login
api/           chat.js, transcribe.js (Vercel serverless, keys stay server-side)
```

## Tech
Create React App, React 19, axios, Material-UI v9, React Router v7, framer-motion.

## Deploy (Vercel)
```bash
npm run build
vercel --prod
```
Set env vars in the Vercel dashboard: `REACT_APP_TMDB_API_KEY`, `AIML_API_KEY`,
`SPEECHMATICS_API_KEY` (optional `AIML_MODEL`, defaults to gpt-4o-mini).

## Notes
- CRA used per spec (deprecated upstream; Vite recommended for new work).
- Auth is frontend-real (no mock bypass).
>>>>>>> 11f117d (add cinemate voice chatbot in sinhala tamil and english)
