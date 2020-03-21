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
  let HTMLSearchcode = '';
  for (let i = 0; i < searchResults.length; i++) {
    HTMLSearchcode += `<li id="${searchResults[i].show.id}" class="card--normal js-card"> ${searchResults[i].show.name}`;
    if (searchResults[i].show.image === null) {
      HTMLSearchcode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${searchResults[i].show.name}"></li>`;
    } else {
      HTMLSearchcode += `<img src="${searchResults[i].show.image.medium}" alt="${searchResults[i].show.name}"></li>`;
    }
  }
  list.innerHTML = HTMLSearchcode;
  listenCards();
}

//Escucho al botón
btn.addEventListener('click', handlebtn);

//Favs

//Creo array para favs
let favs = [];

function paintFavs() {
  const favList = document.querySelector('.js-fav-list');
  let HTMLFavsCode = '';
  for (let i = 0; i < favs.length; i++) {
    HTMLFavsCode += `<li>${favs[i].name}`;
    //   if (favs[i].imgurl === null) {
    //     HTMLFavsCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${favs[i].name}"></li>`;
    //   } else {
    HTMLFavsCode += `<img src="${favs[i].imgurl}" alt="${favs[i].name}"></li>`;
    //   }
  }
  favList.innerHTML = HTMLFavsCode;
}

// //Handle de la tarjeta
function handleCard(ev) {
  //Cambio de color cuando hago click
  if (ev.currentTarget.classList.contains('card--normal')) {
    ev.currentTarget.classList.remove('card--normal');
    ev.currentTarget.classList.add('card--fav');
  } else if (ev.currentTarget.classList.contains('card--fav')) {
    ev.currentTarget.classList.remove('card--fav');
    ev.currentTarget.classList.add('card--normal');
  }
  //Encuento id de tarjeta clickada
  const clickedID = ev.target.id;
  console.log(clickedID);
  // Cojo la serie del producto clickado
  let foundShow = findShowforFavs(clickedID, searchResults);
  // Guardo el objeto dentro de favs
  favs.push({
    id: foundShow.show.id,
    name: foundShow.show.name,
    imgurl: 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV'
  });
  //Miro si el objeto tiene imgurl, si no lo tiene le meto la imagen por defecto
  // for (let i = 0; i < favs.length; i++) {
  //   if (foundShow.show.image === null) {
  //     favs[i].imgurl = 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV';
  //   } else {
  //     favs[i].imgurl = foundShow.show.image.medium;
  //   }
  // }
  //Ya está el objeto en el array, pero ahora se guardan diferentes versiones cada vez que haces click, hay que solucionar eso
  console.log(foundShow);

  console.log(favs);
  paintFavs();
  setInLocalStorage();
}

//Escucho las tarjetas
function listenCards() {
  // Recojo tarjeta
  const cards = document.querySelectorAll('.js-card');
  // Escucho tarjeta
  for (const card of cards) {
    card.addEventListener('click', handleCard);
  }
}
//Función que busca la serie dentro del array mediante su ID
function findShowforFavs(ID, array) {
  for (const object of array) {
    if (object.show.id === parseInt(ID)) {
      return object;
    }
  }
  return undefined;
}

//Local Storage

function getFromLS() {
  const LSFavs = localStorage.getItem('favorite shows');
  if (LSFavs !== null) {
    favs = JSON.parse(LSFavs);
    paintFavs();
  }
}

function setInLocalStorage() {
  localStorage.setItem('favorite shows', JSON.stringify(favs));
}
getFromLS();
