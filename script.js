const movieForm = document.getElementById("movie-form");
const inputEl = document.getElementById("movie");
const emptyEl = document.getElementById("empty");
const noResultEl = document.getElementById("no-result");

movieForm.addEventListener("submit", getMoviesBySearch);

async function getMoviesBySearch(event) {
  event.preventDefault();
  const movieName = inputEl.value;
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=866de549&s=${movieName}`
    );
    const data = await response.json();
    console.log(data);
    let i = data.Search.length >= 5 ? 5 : data.Search.length;
    console.log(i);
    emptyEl.classList.add("hidden");
  } catch (error) {
    console.log("Oops, something went terribly wrong!!!");
    emptyEl.classList.add("hidden");
    noResultEl.classList.remove("hidden");
  }
}
