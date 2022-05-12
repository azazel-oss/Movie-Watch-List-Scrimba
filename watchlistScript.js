let moviesArray = JSON.parse(localStorage.getItem("moviesToWatch"));
const moviesContainerEl = document.getElementById("movies");
const emptyEl = document.querySelector(".content-info");
let watchListToggleLinks = [];

async function getMovieHtml(movieID) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=866de549&i=${movieID}`
  );
  const data = await response.json();
  let html = `<div class="movie">`;
  html += `<div class="poster"><img src=${data.Poster} alt=${data.Title} /></div>`;
  html += `<div class="movie-description">`;
  html += `<div class="movie-header"><div class="title">${data.Title}</div>`;
  html += `<div class="rating">⭐ ${data.imdbRating}</div></div>`;
  html += `<div class="info"><div>${data.Runtime}</div>`;
  html += `<div>${data.Genre}</div>`;
  if (
    JSON.parse(localStorage.getItem("moviesToWatch")) &&
    JSON.parse(localStorage.getItem("moviesToWatch").includes(data.imdbID))
  ) {
    html += `<a id=${data.imdbID} href="/" class="watchlist-toggle"><i class="fa-solid fa-circle-minus"></i>Remove</a></div>`;
  } else {
    html += `<a id=${data.imdbID} href="/" class="watchlist-toggle"><i class="fa-solid fa-circle-plus"></i>Add to watchlist</a></div>`;
  }
  html += `<div class="movie-plot">${data.Plot}</div>`;
  html += "</div></div>";
  return html;
}

async function populateWatchListMovies() {
  if (!moviesArray || moviesArray.length === 0) {
    moviesContainerEl.classList.add("hidden");
    emptyEl.classList.remove("hidden");
  } else {
    let moviesHTML = ``;
    for (let movieId of moviesArray) {
      moviesHTML += await getMovieHtml(movieId);
    }
    moviesContainerEl.innerHTML = moviesHTML;
    moviesContainerEl.classList.remove("hidden");
    emptyEl.classList.add("hidden");
    watchListToggleLinks = document.querySelectorAll(".watchlist-toggle");
    watchListToggleLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        moviesArray = moviesArray.filter((movie) => movie !== event.target.id);
        localStorage.setItem("moviesToWatch", JSON.stringify(moviesArray));
        document.location.reload();
      });
    });
  }
}

populateWatchListMovies();
