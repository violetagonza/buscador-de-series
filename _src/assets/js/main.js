'use strict';
//Recojo el button y el input
const btn = document.querySelector('.js-btn');
const input = document.querySelector('.js-input');

//Handle del btn
function handlebtn() {
  event.preventDefault();
  getData();
}

// Declaro un array para meter los resultados de búsqueda
let searchResults = [];
//Fetch al servidor
function getData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`)
    .then(response => response.json())
    //Meto la info en el array searchResults
    .then(results => {
      searchResults = results;
      paintResults();
    });
}

//Pinto los resultados en el DOM
function paintResults() {
  const list = document.querySelector('.js-list');
  list.innerHTML = '';
  let HTMLcode = '';
  for (let i = 0; i < searchResults.length; i++) {
    HTMLcode += `<li class="card--normal js-card"> ${searchResults[i].show.name}`;
    if (searchResults[i].show.image === null) {
      HTMLcode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${searchResults[i].show.name}"></li>`;
    } else {
      HTMLcode += `<img src="${searchResults[i].show.image.medium}" alt="${searchResults[i].show.name}"></li>`;
    }
  }
  list.innerHTML = HTMLcode;
  listenCards();
}

//Escucho al botón
btn.addEventListener('click', handlebtn);

//Favs

//Escucho las tarjetas
function listenCards() {
  // Recojo tarjeta (temporalmete imagen porque no me genera el div)
  const cards = document.querySelectorAll('.js-card');

  // Escucho tarjeta (temporalmete imagen porque no me genera el div)
  for (const card of cards) {
    card.addEventListener('click', handleCard);
  }
}

// //Handle de la tarjeta
function handleCard() {
  console.log('me han clickado');
  //   paintFavs();
}
