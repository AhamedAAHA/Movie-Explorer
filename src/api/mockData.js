// Minimal mock catalogue so the app works with zero config (no API key).
// Real TMDb data replaces this automatically once REACT_APP_TMDB_API_KEY is set.
export const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Sci-Fi' },
  { id: 35, name: 'Comedy' },
];

const M = (id, title, date, rating, genres, overview, poster, backdrop) => ({
  id, title, release_date: date, vote_average: rating, genre_ids: genres,
  overview, poster_path: poster, backdrop_path: backdrop,
});

export const mockMovies = [
  M(1, 'Inception', '2010-07-16', 8.4, [28, 878], 'A thief who steals secrets from dreams takes one last job.',
    '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg'),
  M(2, 'Interstellar', '2014-11-07', 8.7, [878, 18], 'Explorers travel through a wormhole in search of a new home.',
    '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', '/xJHokMpbjvUTBnmOYk pole.jpg'.replace(' ', '')),
  M(3, 'The Dark Knight', '2008-07-18', 9.0, [28, 18], 'Batman faces the Joker in Gotham City.',
    '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg'),
  M(4, 'Dune: Part Two', '2024-03-01', 8.3, [878, 28], 'Paul Atreides unites with the Fremen for war.',
    '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'),
  M(5, 'Spider-Man: No Way Home', '2021-12-17', 8.0, [28, 878], 'Peter Parker asks Doctor Strange for help.',
    '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', '/14QwaYFnAcqvqYgPnnfx8lvPvTi.jpg'),
  M(6, 'Oppenheimer', '2023-07-21', 8.1, [18], 'The story of J. Robert Oppenheimer and the atomic bomb.',
    '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg'),
];

// Rich detail object for the details page (overview, genres, cast, trailer).
export function mockDetails(id) {
  const base = mockMovies.find((m) => m.id === Number(id)) || mockMovies[0];
  return {
    ...base,
    genres: base.genre_ids.map((g) => mockGenres.find((x) => x.id === g)).filter(Boolean),
    runtime: 148, tagline: 'Demo data — add a TMDb key for live data.',
    videos: { results: [{ key: 'YoHD9XEInc0', site: 'YouTube', type: 'Trailer', name: 'Trailer' }] },
    credits: { cast: [{ id: 1, name: 'Demo Actor', character: 'Hero' }, { id: 2, name: 'Demo Star', character: 'Lead' }] },
  };
}
