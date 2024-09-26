const apiKey = "62487db17621000276c5541af4bf5c86"; // Reemplaza con tu clave API
const apiUrl = `https://api.themoviedb.org/3`;
const movieList = document.getElementById("movies");
const movieDetails = document.getElementById("movie-details");
const detailsContainer = document.getElementById("details");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const favoritesList = document.getElementById("favorites-list");
const addToFavoritesButton = document.getElementById("add-to-favorites");
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjQ4N2RiMTc2MjEwMDAyNzZjNTU0MWFmNGJmNWM4NiIsIm5iZiI6MTcyNzM4NTk1Ny40NzUyMjMsInN1YiI6IjY2ZjVkMDNlZWZjYzBhZTkwZGJlZTQ4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VRnPYUWzdXZzKyzX8HzyJw_WGvJHKW7X9MtV4lFdA8A",
  },
};

// Fetch and display popular movies
async function fetchPopularMovies() {
  try {
    // tu codigo aqui: realiza una solicitud para obtener las películas populares
    // y llama a displayMovies con los resultados
    fetch(`${apiUrl}/movie/popular?language=en-US&page=1`, options)
      .then((response) => response.json())
      .then((response) => displayMovies(response));
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

// Display movies
function displayMovies(movies) {
  movieList.innerHTML = ""; // Limpia la lista de películas
  movies.results.forEach((movie) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
    li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
    movieList.appendChild(li);
  });
}

// Show movie details
async function showMovieDetails(movieId) {
  try {
    // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
    // y actualiza el contenedor de detalles con la información de la película
    const response = await fetch(
      `${apiUrl}/movie/${movieId}?language=en-US`,
      options
    );
    const movie = await response.json();
    selectedMovieId = movie.id;
    detailsContainer.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <p>${movie.overview}</p>
    `;
    document.getElementById("movie-details").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Search movies
searchButton.addEventListener("click", async () => {
  const query = searchInput.value;
  if (query) {
    try {
      const response = await fetch(
        `${apiUrl}/search/movie?query=${query}&language=en-US&page=1`,
        options
      );
      const data = await response.json();
      displayMovies(data);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  }
});

// Add movie to favorites
addToFavoritesButton.addEventListener("click", () => {
  if (selectedMovieId) {
    const favoriteMovie = {
      id: selectedMovieId,
      title: document.querySelector("#details h3").textContent,
    };
    if (!favoriteMovies.some((movie) => movie.id === selectedMovieId)) {
      favoriteMovies.push(favoriteMovie);
      localStorage.setItem("favorites", JSON.stringify(favoriteMovies)); // Guarda en localStorage
      displayFavorites(); // Muestra la lista actualizada de favoritos
    }
  }
});

// Display favorite movies
function displayFavorites() {
  favoritesList.innerHTML = ""; // Limpia la lista de favoritos
  favoriteMovies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = movie.title;
    favoritesList.appendChild(li);
  });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
