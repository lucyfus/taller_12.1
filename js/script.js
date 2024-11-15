let movies = [];
async function loadMovies() {
    let response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    movies = await response.json(); 
    addOffcanvasToDOM();
}

function addOffcanvasToDOM() {
    let body = document.querySelector('body');
    let button = document.createElement('button');
    button.id = 'openOffcanvas';
    button.className = 'btn btn-primary';
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'offcanvas');
    button.setAttribute('data-bs-target', '#offcanvasTop');
    button.setAttribute('aria-controls', 'offcanvasTop');
    button.style.display = 'none'; 
    body.appendChild(button);
    let offcanvasDiv = document.createElement('div');
    offcanvasDiv.className = 'offcanvas offcanvas-top';
    offcanvasDiv.tabIndex = '-1';
    offcanvasDiv.id = 'offcanvasTop';
    offcanvasDiv.setAttribute('aria-labelledby', 'offcanvasTopLabel');
    offcanvasDiv.innerHTML = `
         <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasTopLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <h2 id="movieTitle"></h2>
            <p id="movieOverview"></p>
            <ul id="movieGenres"></ul>
        </div>
    `;

    body.appendChild(offcanvasDiv);
}

function searchMovies() {
    let searchTerm = document.getElementById('inputBuscar').value.toLowerCase();
    let filteredMovies = movies.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm) ||
               movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm)) ||
               movie.tagline.toLowerCase().includes(searchTerm) ||
               movie.overview.toLowerCase().includes(searchTerm);
    });

    displayMovies(filteredMovies);
}

function displayMovies(moviesToDisplay) {
    let lista = document.getElementById('lista');
    lista.innerHTML = ''; 
    moviesToDisplay.forEach(movie => {
        let li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.style.backgroundColor = '#212529';
        li.style.cursor = 'pointer';
        li.innerHTML = `
            <div class="flex-grow-1">
                <h5 style="color: white">${movie.title}</h5>
                <p style="color: #736f6f;">${movie.tagline}</p>
            </div>
            <div>
                ${createStars(movie.vote_average)}
            </div>
        `;
        li.onclick = function() {
            showMovieDetails(movie);
        };

        lista.appendChild(li);
    });
}
function showMovieDetails(movie) {
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieOverview').textContent = movie.overview;
    let genresList = document.getElementById('movieGenres');
    let genresText = movie.genres.map(genre => genre.name).join(' - '); 
    genresList.textContent = genresText; 
    let offcanvasBody = document.querySelector('.offcanvas-body');
    let dropdownExists = offcanvasBody.querySelector('.dropdown');
    if (dropdownExists) {
        dropdownExists.remove(); 
    }
    let dropdownHTML = `
        <div class="dropdown text-end  mt-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                More
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><span class="dropdown-item">Year: ${new Date(movie.release_date).getFullYear()}</span></li>
                <li><span class="dropdown-item">Runtime: ${movie.runtime} mins</span></li>
                <li><span class="dropdown-item">Budget: $${movie.budget.toLocaleString()}</span></li>
                <li><span class="dropdown-item">Revenue: $${movie.revenue.toLocaleString()}</span></li>
            </ul>
        </div>
    `;
    offcanvasBody.innerHTML += dropdownHTML;
    document.getElementById('openOffcanvas').click();
}

function createStars(vote) {
    let stars = Math.round(vote / 2); 
    let starHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= stars) {
            starHTML += '<i class="fa fa-star text-warning"></i>'; 
        } else {
            starHTML += '<i class="fa fa-star-o text-secondary"></i>';
        }
    }
    return starHTML;
}
document.getElementById('btnBuscar').addEventListener('click', searchMovies);
window.onload = loadMovies;