// Your code here
const apiURL = "http://localhost:3000/films";

const filmContainer = document.getElementById("films");
const detailTitle = document.getElementById("title");
const detailRuntime = document.getElementById("runtime");
const detailDescription = document.getElementById("film-info");
const detailShowtime = document.getElementById("showtime");
const detailTicketsRemaining = document.getElementById("ticket-num");
const detailPoster = document.getElementById("poster");

let filmsList = [];
let currentFilmDisplay = null;

fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    data.forEach(addToList);
    displayFilms();
    displayFilmDetails(1);
  })

function addToList(film) {
  filmsList.push(film);
}

function displayFilms() {
  filmsList.forEach(displayFilmInList);
}

function displayFilmInList(film) {
  const filmLI = document.createElement("li");
  filmLI.innerText = film.title;
  filmLI.classList.add("film");
  filmLI.classList.add("item");//interesting design choice in the css here
  filmLI.addEventListener("click", () => {displayFilmDetails(film.id)});
  filmContainer.append(filmLI);
}

function displayFilmDetails(id) {
  const compareString = `${id}`;//another interesting design choice
  currentFilmDisplay = compareString;
  const targetFilm = filmsList.find(film => film.id === currentFilmDisplay);
  detailTitle.innerText = targetFilm.title;
  detailRuntime.innerText = `${targetFilm.runtime} minutes`;
  detailDescription.innerText = targetFilm.description;
  detailShowtime.innerText = targetFilm.showtime;
  detailTicketsRemaining.innerText = (targetFilm.capacity - targetFilm.tickets_sold);
  detailPoster.src = targetFilm.poster;
}

document.getElementById("buy-ticket").addEventListener("click", buyTicket);

//no persist ticket buying
function buyTicket() {
  const targetFilm = filmsList.find(film => film.id === currentFilmDisplay);
  if ((targetFilm.capacity - targetFilm.tickets_sold) > 0) {
    targetFilm.tickets_sold+=1;
    if(targetFilm.capacity === targetFilm.tickets_sold) {
      document.getElementById("buy-ticket").innerText = "Sold Out";
      filmContainer.children[currentFilmDisplay - 1].classList.add("sold-out");
    }
  }
  updateTicketAmount();
}

function updateTicketAmount() {
  const targetFilm = filmsList.find(film => film.id === currentFilmDisplay);
  detailTicketsRemaining.innerText = (targetFilm.capacity - targetFilm.tickets_sold);
}
