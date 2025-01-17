import moviesTemplate from '../templates/movies-list.hbs';
import { pagination } from './pagination';

const axios = require('axios');

const API_KEY = '1aaaa4b4eb79ea073919ef453434f2ea';
const BASE_URL = 'https://api.themoviedb.org/3/';

const moviesList = document.querySelector('.movies-list');

let page = 1;

const search__button = document.querySelector('.search__button');
const search__input = document.querySelector('.search__input');

search__button.addEventListener('click', onSearch);

search__input.addEventListener('input', event => {
  searchQuery = event.currentTarget.value;
});

function changeReleaseDate(data) {
  for (let result of data.results) {
    if (result.release_date !== '') {
      let newDate = result.release_date.slice(0, 4);
      Object.defineProperties(result, {
        release_date: {
          value: newDate,
          writable: true,
        },
      });
    } else {
      Object.defineProperties(result, {
        release_date: {
          value: 'Unknown',
          writable: true,
        },
      });
    }
  }
}

function changeReleaseGenres(data) {
  for (let result of data.results) {
    const genresWord = [];

    result.genre_ids.forEach(element => {
      genres.find(({ id, name }) => {
        if (id === element) {
          genresWord.push(name);
        }
      });
    });

    if (genresWord.length > 2 || genresWord.length === 0) {
      const extraGenres = genresWord.length - 2;
      genresWord.splice(2, extraGenres, 'Other');
    }

    Object.defineProperties(result, {
      genre_ids: {
        value: genresWord,
        writable: true,
      },
    });
  }
}

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

let searchQuery = '';

function onSearch(event) {
  event.preventDefault();

  getMoviesbySearchQuery().then(data => {
    changeReleaseGenres(data);
    changeReleaseDate(data);
    moviesList.innerHTML = '';
    moviesList.innerHTML = moviesTemplate(data.results);
  });
}

async function getMoviesbySearchQuery() {
  const url = `${BASE_URL}search/movie?api_key=${API_KEY}&page=${page}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;
  try {
    const { data } = await axios.get(url);
    const { page, results, total_pages, total_results } = data;
    console.log(data);
    return { results, total_pages, page, total_results };
  } catch (error) {
    console.error(error);
  }
}
