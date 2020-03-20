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

//Añado al array el clickado
function addShowToFavs() {
  favs.push(searchResults[0]);
  console.log(favs);
}
function paintFavs() {
  const favList = document.querySelector('.js-fav-list');
  let HTMLFavsCode;
  HTMLFavsCode = `<li>${favs[0].show.name}`;
  if (favs[0].show.image === null) {
    HTMLFavsCode += `<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${favs[0].show.name}"></li>`;
  } else {
    HTMLFavsCode += `<img src="${favs[0].show.image.medium}" alt="${favs[0].show.name}"></li>`;
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
  favs.push({
    id: foundShow.show.id,
    name: foundShow.show.name,
    imgulr: ''
  });
  for (let i = 0; i < favs.length; i++) {
    if (foundShow.show.image === null) {
      favs[i].imgurl = 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV';
    } else {
      favs[i].imgurl = foundShow.show.image.medium;
    }
  }

  console.log(foundShow);

  console.log(favs);
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
