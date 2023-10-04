const searchButton = document.getElementById("btnBuscar");
const MoviesList = document.getElementById("lista");
const URL = "https://japceibal.github.io/japflix_api/movies-data.json";

async function getMoviesData() {
  const response = await fetch(URL);
  return await response.json();
}

// Función para convertir votos en estrellas
function voteToStars(vote) {
  const checkedStar = '<span class="fa fa-star checked"></span>'; // Estrella llena
  const uncheckedStar = '<span class="fa fa-star"></span>'; // Estrella vacía
  const averageVote = Math.round(vote / 2); // Calcula el voto promedio
  const starsRating = checkedStar.repeat(averageVote) + uncheckedStar.repeat(5 - averageVote); // Genera estrellas según el voto
  return starsRating; // Devuelve el HTML de las estrellas
}

// Función para mostrar la lista de películas
function showMoviesList(movies, searchTerm) {
  const HTMLContentToAppend = movies
    .filter((pelicula) => {
      const data = (pelicula.title + pelicula.overview + pelicula.tagline + pelicula.genres.map(genre => genre.name).join(" - ")).toLowerCase();
      return data.includes(searchTerm);
    })
    .map((pelicula) => `
      <li class="list-group pt-1 pb-1">
        <a class="btn text-white" role="button" data-bs-target="#id${pelicula.id}" data-bs-toggle="offcanvas" aria-controls="#id${pelicula.id}">
          <div class="row d-flex w-100 justify-content-between">
            <div class="col-7">
              ${pelicula.title}
            </div>
            <div class="col-3 d-flex justify-content-end" id="ratingStars">
              ${voteToStars(pelicula.vote_average)}
            </div>
          </div>
          <div>
            ${pelicula.tagline}
          </div>
        </a>
        <div class="offcanvas offcanvas-top bg-dark" tabindex="-1" id="id${pelicula.id}" aria-labelledby="offcanvasTopLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasTopLabel">${pelicula.title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body pb-0 pt-0">
            <p>
              ${pelicula.overview}
            </p>
            <hr>
          </div>
          <div class="d-flex justify-content-between">
            <p class="ms-3 pt-2 text-muted">${pelicula.genres.map(genre => genre.name).join(" - ")}</p>
            <div class="dropdown pb-3 pe-3">
              <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                More
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-item">Year: ${(pelicula.release_date).slice(0, 4)}</li>
                <li class="dropdown-item">Runtime: ${pelicula.runtime} mins</li>
                <li class="dropdown-item">Budget: $${(pelicula.budget).toLocaleString()}</li>
                <li class="dropdown-item">Revenue: $${(pelicula.revenue).toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </div>
      </li>
      <hr class="m-0">
    `)
    .join(""); // Une todos los elementos en un solo bloque de HTML

  MoviesList.innerHTML = HTMLContentToAppend; // Agrega el contenido HTML al elemento de lista
} 


// Evento que se ejecuta cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
    // Evento click en el botón de búsqueda
  searchButton.addEventListener("click", async () => {
    const searchTerm = document.getElementById("inputBuscar").value.toLowerCase(); // Obtiene el término de búsqueda
    const moviesData = await getMoviesData(); // Obtiene los datos de películas
    MoviesList.classList.add("border", "border-secondary"); 
    showMoviesList(moviesData, searchTerm); // Mostrar la lista de películas filtradas
  });
});