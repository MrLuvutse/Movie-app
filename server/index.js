require('dotenv').config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

const TMDB_KEY = process.env.TMDB_KEY || "6db390c6380c1f6f5140fd047c7af8be";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

app.use(cors());
app.use(express.json());

function shape(m) {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster: m.poster_path ? `${IMG_BASE}${m.poster_path}` : null,
    backdrop: m.backdrop_path ? `${BACKDROP_BASE}${m.backdrop_path}` : null,
    rating: Math.round(m.vote_average * 10) / 10,
    votes: m.vote_count,
    year: m.release_date ? m.release_date.slice(0, 4) : "—",
    genre_ids: m.genre_ids || [],
  };
}

app.get("/api/trending", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/trending/movie/week`, { params: { api_key: TMDB_KEY } });
    res.json(data.results.map(shape));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/now-playing", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/now_playing`, { params: { api_key: TMDB_KEY, language: "en-US", page: 1 } });
    res.json(data.results.map(shape));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/popular", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/popular`, { params: { api_key: TMDB_KEY, language: "en-US", page: 1 } });
    res.json(data.results.map(shape));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/top-rated", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/top_rated`, { params: { api_key: TMDB_KEY, language: "en-US", page: 1 } });
    res.json(data.results.map(shape));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/movie/:id", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/${req.params.id}`, {
      params: { api_key: TMDB_KEY, append_to_response: "credits,videos" },
    });
    res.json({
      id: data.id,
      title: data.title,
      tagline: data.tagline,
      overview: data.overview,
      poster: data.poster_path ? `${IMG_BASE}${data.poster_path}` : null,
      backdrop: data.backdrop_path ? `${BACKDROP_BASE}${data.backdrop_path}` : null,
      rating: Math.round(data.vote_average * 10) / 10,
      votes: data.vote_count,
      year: data.release_date ? data.release_date.slice(0, 4) : "—",
      runtime: data.runtime,
      genres: data.genres,
      cast: data.credits?.cast?.slice(0, 8).map((c) => ({
        id: c.id, name: c.name, character: c.character,
        photo: c.profile_path ? `${IMG_BASE}${c.profile_path}` : null,
      })),
      trailer: data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key || null,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const { data } = await axios.get(`${TMDB_BASE}/search/movie`, { params: { api_key: TMDB_KEY, query: q } });
    res.json(data.results.map(shape));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/genres", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/genre/movie/list`, { params: { api_key: TMDB_KEY } });
    res.json(data.genres);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🎬 CineVault server on http://localhost:${PORT}`));