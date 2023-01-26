import { addListener } from 'process';
import { getMovieDetails } from '../api/fetchAPI';
import { addListenerQueueAddBtn, renderQueue, checkQueueBtn } from './queueLS';
import {
  addListenerAddWatched,
  checkStatusBTN,
  renderWatched,
} from '../dom/watchedLS';
import { addListenerAddBtnTrailer } from './trailer';
import myImageUrl from '../../images/sorry.png';
import { refs } from '../dom/refs.js';

const modalMovie = document.querySelector('[data-modal]');
const btnClose = document.querySelector('.button-modal-movie--close');
function activeMovieModal() {
  setTimeout(() => {
    const movieItems = document.querySelectorAll('.movie__item');

    // console.log(movieItems);

    movieItems.forEach(movie => {
      movie.addEventListener('click', e => {
        e.preventDefault();

        const id = movie.getAttribute('data-id');

        getMovieDetails(id).then(data => {
          const backdrop = document.querySelector('.backdrop');
          backdrop.classList.remove('is-hidden');
          const btnClose = document.querySelector('.button-modal-movie--close');
          btnClose.addEventListener('click', onCloseMovieModal);
          window.addEventListener('keydown', onEscKeyPressMovieModal);
          backdrop.addEventListener('click', onBackdropMovieClick);
          //Заповнення id для кнопки Add to watched і Add to queue
          document
            .querySelector('.modal-movie__content')
            .setAttribute('data-id', id);
          let poster = '';
          if (!data.poster_path) {
            poster = myImageUrl;
          } else {
            poster = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
          }
          document.querySelector('.modal-movie__content').innerHTML = `
        <div class="movie-detail">
          <div class="movie-detail__image">
            <img src="${poster}" alt="" class="movie-detail__img" >
          </div>
          <div class="movie-detail__content">
            <h2 class="movie-detail__title">${data.title}</h2>
            <ul class="movie-detail__list">
              <li class="movie-detail__item">
                <h4 class="movie-detail__heading">Vote / Votes</h4>
                <p class="movie-detail__value"><span>${data.vote_average.toFixed(
                  1
                )}</span> / ${data.vote_count}</p>
              </li>
              <li class="movie-detail__item">
                <h4 class="movie-detail__heading">Popularity</h4>
                <p class="movie-detail__value">${data.popularity}</p>
              </li>
              <li class="movie-detail__item">
                <h4 class="movie-detail__heading">Original Title</h4>
                <p class="movie-detail__value">${data.original_title}</p>
              </li>
              <li class="movie-detail__item">
                <h4 class="movie-detail__heading">Genre</h4>
                <p class="movie-detail__value">Western </p>
              </li>
            </ul>
            <h5 class="movie-detail__subtitle">About</h5>
            <p class="movie-detail__text">${data.overview}</p>
            <div class="movie-detail__btns">
              <button class="movie-detail__btn-main add-to-watched-btn" id="add-watched-btn">add to Watched</button>
              <button class="movie-detail__add-queue-btn add-queue-btn" type="button">Add to queue</button>
              <button class="movie-detail__btn-main btn-trailer" id="trailer">trailer</button>
            </div>
          </div>
        </div>
        `;
          //додає слухача на кнопку і перевіряє чи є цей фільм в local storage
          addListenerAddWatched();
          addListenerQueueAddBtn();
          addListenerAddBtnTrailer();
          checkStatusBTN(Number(id));
          checkQueueBtn(Number(id));
        });
      });
    });

    // document
    //   .querySelector('.backdrop')
    //   .addEventListener('click', e => {
    //     e.preventDefault();
    //     document.querySelector('.backdrop').classList.add('is-hidden');
    //   });
  }, 1000);
}

activeMovieModal();
export { activeMovieModal };

export function onCloseMovieModal() {
  modalMovie.classList.toggle('is-hidden');
  refs.body.classList.remove('no-scroll');
  window.removeEventListener('keydown', onEscKeyPressMovieModal);
  btnClose.removeEventListener('click', onCloseMovieModal);
  modalMovie.removeEventListener('click', onBackdropMovieClick);
  refs.body.classList.remove('no-scroll');
}

export function onBackdropMovieClick(e) {
  if (e.currentTarget === e.target) {
    onCloseMovieModal();
  }
}

export function onEscKeyPressMovieModal(e) {
  if (e.code === 'Escape') {
    onCloseMovieModal();
  }
}
