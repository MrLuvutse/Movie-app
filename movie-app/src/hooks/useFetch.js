import { useState, useEffect, useCallback } from "react";

const BASE = "http://localhost:5000";

export default function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!endpoint);
  const [error, setError] = useState(null);
  const page = options.page || 1;
  const refetchKey = options.refetchKey;

  const [trigger, setTrigger] = useState(0);
  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    if (!endpoint) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    const url = new URL(`${BASE}${endpoint}`, BASE);
    url.searchParams.set("page", String(page));

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [endpoint, page, refetchKey, trigger]);

  return { data, loading, error, refetch };
}

