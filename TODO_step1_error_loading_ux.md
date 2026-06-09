# TODO (Step 1): Error/Loading UX improvements

- [x] Update `movie-app/src/hooks/useFetch.js`:
  - [x] Add AbortController to cancel in-flight requests
  - [x] Include `page` as query param for all pages (including page=1)
  - [x] Add `refetchKey` option so components can retry without changing endpoint

- [x] Update `movie-app/src/pages/MovieDetail.js` to use `useFetch` instead of direct `fetch`
  - [x] Show spinner while loading
  - [x] Show a friendly error state with Retry

- [ ] (Optional but recommended) Update `movie-app/src/pages/Home.js` to pass through `error` states
- [ ] Ensure styles still look correct (no CSS changes required unless we add new classes)
