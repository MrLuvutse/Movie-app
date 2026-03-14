import { useState, useEffect } from "react";

const BASE = "http://localhost:5000";

export default function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE}${endpoint}`)
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [endpoint]);

  return { data, loading, error };
}