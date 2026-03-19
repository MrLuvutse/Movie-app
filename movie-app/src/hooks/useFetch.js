import { useState, useEffect } from "react";

const BASE = "http://localhost:5000";

export default function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const page = options.page || 1;

  useEffect(() => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);
    const url = new URL(`${BASE}${endpoint}`, BASE);
    if (page > 1) url.searchParams.append('page', page);
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [endpoint, page]);

  return { data, loading, error };
}
