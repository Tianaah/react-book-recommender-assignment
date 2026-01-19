📚 Book Recommender App

A React app that suggests books based on your genre, mood, and reading level using Google Gemini API.

🔹 Features

Select Genre, Mood, and Reading Level.

Fetches AI-generated book recommendations.

Optimized with React hooks:

useReducer → for state management

useCallback → for memoized functions

useEffect → for side effects and error logging

Displays results in expandable details sections.

Handles loading and error states.

🌐 Demo

Hosted App: [Insert your Vercel link]

GitHub Repo: [Insert your GitHub link]

⚡ Setup

Clone the repo

git clone <your-repo-link>
cd <repo-folder>


Install dependencies

npm install


Add environment variables

VITE_GEMINI_API_KEY=YOUR_GOOGLE_API_KEY


Get your API key here: Google Gemini API

Run the app

npm run dev

🛠️ Technologies

React (v18+)

Google Gemini API

Vite

JSON for genre & mood data

🔗 References

Gemini API Docs

React Hooks Guide

💡 Notes

Make sure your API key supports the generateText endpoint.

Recommendations may fail if the model is unavailable or the API key is invalid.
