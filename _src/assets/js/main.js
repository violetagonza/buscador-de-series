'use strict';
//Recojo el button y el input
const btn = document.querySelector('.js-btn');
const input = document.querySelector('.js-input');

// Declaro un array para meter los resultados de búsqueda
let searchResults = [];
//Fetch al servidor

function handlebtn(ev) {
  ev.preventDefault();
  fetch(`//api.tvmaze.com/search/shows?q=${input.value}`)
    .then(response => response.json())
    //Meto la info en el array searchResults
    .then(results => {
      searchResults = results;
      //¿Tiene imagen?
      for (let i = 0; i < searchResults.length; i++) {
        if (searchResults[i].show.image === null) {
          //No la tiene: le añado la url de la imagen por defecto
          searchResults[i].image = 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV';
        } else {
          //La tiene: le añado la url de searchResults.image.medium a image
          searchResults[i].image = searchResults[i].show.image.medium;
        }
      }
      paintResults();
      addOrRemoveClassInCards();
    });
}

//Pinto los resultados en el DOM
function paintResults() {
  const list = document.querySelector('.js-list');
  list.innerHTML = '';
  let HTMLSearchcode = '';
  for (let i = 0; i < searchResults.length; i++) {
    HTMLSearchcode += `<li title="Click para añadir a favoritos" id="${searchResults[i].show.id}" class="main--list__item card--normal js-card"> <p class="main--list__text">${searchResults[i].show.name}</p>`;
    HTMLSearchcode += `<img src="${searchResults[i].image}" alt="${searchResults[i].show.name}"></li>`;
  }

  list.innerHTML = HTMLSearchcode;
  listenCards();
}
//Miro si la serie del resultado de búsqueda está en favoritos y si está le añado la clase del color de series seleccionadas
function addOrRemoveClassInCards() {
  for (let i = 0; i < searchResults.length; i++) {
    for (let index = 0; index < favs.length; index++) {
      if (searchResults[i].show.id === favs[index].id) {
        document.getElementById(searchResults[i].show.id).classList.add('card--fav');
      } else {
        document.getElementById(searchResults[i].show.id).classList.add('card--normal');
      }
    }
  }
}

//Escucho al botón
btn.addEventListener('click', handlebtn);

//Favs

//Creo array para favs
let favs = [];
let icons;

//Varieble para ver el ID del favorito clickado
let clickedFavID;
let foundFavForDelete;

//Función para borrar o añadir favoritos
function addOrDeleteFavs() {
  // //Miro si el objeto está ya en favs
  let isInFavs = false;
  let favIndex;
  for (let i = 0; i < favs.length; i++) {
    if (foundShow.show.id === favs[i].id) {
      isInFavs = true;
      favIndex = i;
    }
  }
  console.log(isInFavs, favIndex);

  // Guardo el objeto dentro de favs
  if (isInFavs === false) {
    favs.push({
      id: foundShow.show.id,
      name: foundShow.show.name,
      imgurl: foundShow.image
    });
  } else {
    favs.splice(favIndex, 1);
  }
}
function deleteFav() {
  for (let i = 0; i < favs.length; i++) {
    if (foundFavForDelete.id === favs[i].id) {
      favs.splice(i, 1);
    }
    paintFavs();
  }
}

//Pinto favs
function paintFavs() {
  const favList = document.querySelector('.js-fav-list');
  let HTMLFavsCode = '';
  for (let i = 0; i < favs.length; i++) {
    HTMLFavsCode += `<li><div class="aside--list-div"><p class="aside--list__text">${favs[i].name}</p>`;
    HTMLFavsCode += `<i id="${favs[i].id}" class="js-icon aside--list__icon fas fa-trash-alt" title="Borrar serie"></i></div>`;
    HTMLFavsCode += `<img class="aside--list__img" src="${favs[i].imgurl}" alt="${favs[i].name}"></li>`;
  }
  favList.innerHTML = HTMLFavsCode;

  //Recojo el icono
  icons = document.querySelectorAll('.js-icon');

  // handler del icono
  function handleIcon(ev) {
    console.log('me han clickado');
    // //Busco el icono clickado
    clickedFavID = ev.currentTarget.id;
    foundFavForDelete = findFavforDelete();
    console.log(clickedFavID, foundFavForDelete);
    deleteFav();
    setInLocalStorage();
  }

  //Escucho el icono
  for (const icon of icons) {
    icon.addEventListener('click', handleIcon);
  }
  //Encuentro el objeto correspondiente al icono clockado
  function findFavforDelete() {
    for (const object of favs) {
      if (object.id === parseInt(clickedFavID)) {
        return object;
      }
    }
    return undefined;
  }
}

// //Handle de la tarjeta
let clickedID;
let foundShow;
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

  clickedID = ev.currentTarget.id;
  console.log(clickedID);
  // Cojo la serie del producto clickado
  foundShow = findShowforFavs(clickedID, searchResults);
  console.log(foundShow);
  addOrDeleteFavs();
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
