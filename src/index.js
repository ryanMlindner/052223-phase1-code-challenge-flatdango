// Your code here
const apiURL = "http://localhost:3000/films";
const headers = {
  Accept: 'application/json',
  'Content-type': 'application/json',
}

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
  filmContainer.innerHTML = '';
  filmsList.forEach(displayFilmInList);
}

function displayFilmInList(film) {
  const filmLI = document.createElement("li");
  filmLI.innerText = film.title;
  filmLI.classList.add("film");
  filmLI.classList.add("item");//interesting design choice in the css here
  if (film.capacity === film.tickets_sold){
    filmLI.classList.add("sold-out");
  }

  filmLI.addEventListener("click", () => {displayFilmDetails(film.id)});
  filmContainer.append(filmLI);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {deleteFilm(film.id)});
  filmLI.append(deleteButton);
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

  checkTicketAmountForButton(targetFilm);
}

document.getElementById("buy-ticket").addEventListener("click", buyTicket);

//no persist ticket buying
function buyTicket() {
  const targetFilm = filmsList.find(film => film.id === currentFilmDisplay);
  if ((targetFilm.capacity - targetFilm.tickets_sold) > 0) {
    targetFilm.tickets_sold+=1;

    console.log(`${apiURL}/${currentFilmDisplay}`);
    fetch(`${apiURL}/${currentFilmDisplay}`, {
      headers,
      method: "PATCH",
      body: JSON.stringify({
        "tickets_sold": targetFilm.tickets_sold
      })
    })
      .then(res => res.json())
      .then(json => {console.log(json);});
    
    checkTicketAmountForButton(targetFilm);
  }
  updateTicketAmount();
}

function updateTicketAmount() {
  const targetFilm = filmsList.find(film => film.id === currentFilmDisplay);
  detailTicketsRemaining.innerText = (targetFilm.capacity - targetFilm.tickets_sold);
}

function checkTicketAmountForButton(targetFilm) {
  //extra extra credit logic
  if(targetFilm.capacity === targetFilm.tickets_sold) {
    document.getElementById("buy-ticket").innerText = "Sold Out";
    filmContainer.children[currentFilmDisplay - 1].classList.add("sold-out");
  }
  else{document.getElementById("buy-ticket").innerText = "Buy Ticket";}
}

function deleteFilm(id) {
  const compareString = `${id}`;
  newList = filmsList.filter(film => film.id !== compareString);
  console.log(newList);
  fetch(`${apiURL}/${compareString}`, {
    headers,
    method: "DELETE"
  })
  filmsList = newList;
  displayFilms();
}