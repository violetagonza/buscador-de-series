'use strict';
//Recojo el button y el input
const btn = document.querySelector('.js-btn');
const input = document.querySelector('.js-input');

// Declaro un array para meter los resultados de búsqueda
let searchResults = [];

//Handle del btn
function handlebtn() {
  //   event.preventDefault();
  getData();
}

//Fetch al servidor
function getData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    //Meto la info en un array
    .then(results => {
      searchResults = results;
    });
  paintResults();
}

//Pinto los resultados en el DOM
function paintResults() {
  const list = document.querySelector('.js-list');
  list.innerHTML = '';
  for (let i = 0; i < searchResults.length; i++) {
    list.innerHTML += `<li> ${searchResults[i].show.name}</li>`;
    if (searchResults[i].show.image === null) {
      list.innerHTML += `<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${searchResults[i].show.name}">`;
    } else {
      list.innerHTML += `<img src="${searchResults[i].show.image.medium}" alt="${searchResults[i].show.name}">`;
    }
  }
}

//Escucho al botón
btn.addEventListener('click', handlebtn);
