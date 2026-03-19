# Pagination + Genre Filtering TODO

- [x] Update server/index.js: Add page param support to all list endpoints (/trending, /popular, /top-rated, /now-playing, /search)
- [x] Update movie-app/src/hooks/useFetch.js: Accept options {page}, append ?page=${page}
- [x] Update movie-app/src/pages/Browse.js: Add page state, Load More button, genres fetch/filter
- [x] Update movie-app/src/pages/Browse.css: Styles for genre chips, load more btn
- [x] Update movie-app/src/pages/Home.js: Ensure links pass page=1
- [x] Test pagination in tabs/search, genre filtering
- [x] Update TODO.md with completion
