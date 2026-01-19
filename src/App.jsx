import React, { useReducer, useCallback, useEffect } from "react";
import SelectField from "./components/select.jsx";
import listOfGenreOption from "./store/genre.json";
import listOfMoodOption from "./store/mood.json";

const initialState = {
  genre: "",
  mood: "",
  level: "",
  aiResponses: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_GENRE":
      return { ...state, genre: action.payload, mood: "" };
    case "SET_MOOD":
      return { ...state, mood: action.payload };
    case "SET_LEVEL":
      return { ...state, level: action.payload };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "SET_AI_RESPONSES":
      return { ...state, loading: false, aiResponses: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { genre, mood, level, aiResponses, loading, error } = state;

  const availableMoodBasedOnGenre = listOfMoodOption[genre] || [];

  const fetchRecommendations = useCallback(async () => {
    if (!genre || !mood || !level) return;

    dispatch({ type: "FETCH_START" });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Recommend 6 books for a ${level} ${genre} reader feeling ${mood}. List each book separately.`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();
      console.log("Full API response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "API request failed");
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No recommendation received.";

      const books = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      dispatch({ type: "SET_AI_RESPONSES", payload: books });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload:
          "Failed to fetch recommendations. Please check your API key and model access.",
      });
      console.error(err);
    }
  }, [genre, mood, level]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <section
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Book Recommender</h1>

      <SelectField
        placeholder="Please select a genre"
        id="genre"
        options={listOfGenreOption}
        value={genre}
        onSelect={(value) => dispatch({ type: "SET_GENRE", payload: value })}
      />

      <SelectField
        placeholder="Please select a mood"
        id="mood"
        options={availableMoodBasedOnGenre}
        value={mood}
        onSelect={(value) => dispatch({ type: "SET_MOOD", payload: value })}
      />

      <SelectField
        placeholder="Please select your level"
        id="level"
        options={["Beginner", "Intermediate", "Expert"]}
        value={level}
        onSelect={(value) => dispatch({ type: "SET_LEVEL", payload: value })}
      />

      <button
        onClick={fetchRecommendations}
        disabled={loading || !genre || !mood || !level}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        {loading ? "Loading..." : "Get Recommendation"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <div style={{ marginTop: "2rem" }}>
        {aiResponses.map((recommend, index) => (
          <details key={index} style={{ marginBottom: "1rem" }}>
            <summary>Recommendation {index + 1}</summary>
            <p style={{ marginLeft: "1rem" }}>{recommend}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
