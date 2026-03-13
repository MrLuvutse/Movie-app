import { useState, useEffect } from 'react';
import { useMovies } from '../context/MovieContext';

const useFetch = (url, dispatchType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useMovies();

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data.results || data);
        if (dispatchType) {
          dispatch({ type: dispatchType, payload: data.results || data });
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url, dispatchType]);

  return { data, loading, error };
};

export default useFetch;
