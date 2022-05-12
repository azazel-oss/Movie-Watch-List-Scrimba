const movieForm = document.getElementById("movie-form");
const inputEl = document.getElementById("movie");
const emptyEl = document.getElementById("empty");
const noResultEl = document.getElementById("no-result");
const moviesContainerEl = document.getElementById("movies");

movieForm.addEventListener("submit", getMoviesBySearch);

async function getMoviesBySearch(event) {
  event.preventDefault();
  const moviesArray = [];
  const movieName = inputEl.value;
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=866de549&s=${movieName}`
    );
    const data = await response.json();
    let numMovieRecords = data.Search.length >= 5 ? 5 : data.Search.length;
    for (let i = 0; i < numMovieRecords; i++) {
      moviesArray.push(data.Search[i].imdbID);
    }

    let moviesHTML = ``;
    for (let movieId of moviesArray) {
      moviesHTML += await getMovieHtml(movieId);
    }
    console.log(moviesHTML);
    moviesContainerEl.innerHTML = moviesHTML;

    const movies = document.querySelectorAll(".movie");
    movies.forEach((movie) => {
      movie.addEventListener("click", (event) => {
        event.preventDefault();
        if (event.target.tagName === "A") {
          console.log(event.target.id);
          console.log(event.target.textContent);
          if (event.target.textContent === "Add to watchlist") {
            event.target.innerHTML = `<i class="fa-solid fa-circle-minus"></i>Remove`;
            if (!localStorage.getItem("moviesToWatch")) {
              localStorage.setItem(
                "moviesToWatch",
                JSON.stringify([event.target.id])
              );
            } else {
              let watchlistMovies = JSON.parse(
                localStorage.getItem("moviesToWatch")
              );
              watchlistMovies.push(event.target.id);
              localStorage.setItem(
                "moviesToWatch",
                JSON.stringify(watchlistMovies)
              );
            }
          } else {
            event.target.innerHTML = `<i class="fa-solid fa-circle-plus"></i>Add to watchlist`;
            let watchlistMovies = JSON.parse(
              localStorage.getItem("moviesToWatch")
            );
            watchlistMovies = watchlistMovies.filter(
              (movie) => movie !== event.target.id
            );
            localStorage.setItem(
              "moviesToWatch",
              JSON.stringify(watchlistMovies)
            );
          }
        }
      });
    });

    emptyEl.classList.add("hidden");
    moviesContainerEl.classList.remove("hidden");
  } catch (error) {
    console.log("Oops, something went terribly wrong!!!");
    emptyEl.classList.add("hidden");
    noResultEl.classList.remove("hidden");
  }
}

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
  html += `<a id=${data.imdbID} href="/" class="watchlist-toggle"><i class="fa-solid fa-circle-plus"></i>Add to watchlist</a></div>`;
  html += `<div class="movie-plot">${data.Plot}</div>`;
  html += "</div></div>";
  return html;
}

/*

{
  "Title":"Blade Runner",
  "Runtime":"117 min",
  "Genre":"Action, Drama, Sci-Fi",
  "Plot":"A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.",
  "Poster":"https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  "imdbRating":"8.1",
  "imdbID":"tt0083658",
}

*/
