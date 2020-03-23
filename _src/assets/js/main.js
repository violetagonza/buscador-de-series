'use strict';

//PINTAR RESULTADOS Y METER EN ARRAY searchResults

//Recojo el button y el input
const btn = document.querySelector('.js-btn');
const input = document.querySelector('.js-input');

// Declaro un array para meter los resultados de búsqueda
let searchResults = [];
//Creo array para favoritos
let favs = [];

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
  addOrRemoveClassInCards();
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

//PINTAR EN FAVS Y METER/SACAR EN ARRAY favs

//Creo variable para los botones de borrar
let deleteIcons;

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

  // Guardo o borro el objeto dentro de favs (para el click en la tarjeta de búsquedas)
  if (isInFavs === false) {
    favs.push({
      id: foundShow.show.id,
      name: foundShow.show.name,
      imgurl: foundShow.image
    });
  } else {
    favs.splice(favIndex, 1);
  }
  paintFavs();
  paintResults();
  setInLocalStorage();
}
//Borro de favs (para click en el botón de borrar en la lista de favoritos)
function deleteFav() {
  for (let i = 0; i < favs.length; i++) {
    if (foundFavForDelete.id === favs[i].id) {
      favs.splice(i, 1);
    }
  }
  paintFavs();
  paintResults();
  setInLocalStorage();
}

//Pinto la lista de favoritos
function paintFavs() {
  const favList = document.querySelector('.js-fav-list');
  let HTMLFavsCode = '';
  for (let i = 0; i < favs.length; i++) {
    HTMLFavsCode += `<li><div class="aside--list-div"><p class="aside--list__text">${favs[i].name}</p>`;
    HTMLFavsCode += `<i id="${favs[i].id}" class="js-icon aside--list__icon fas fa-trash-alt" title="Borrar serie"></i></div>`;
    HTMLFavsCode += `<img class="aside--list__img" src="${favs[i].imgurl}" alt="${favs[i].name}"></li>`;
  }
  HTMLFavsCode += '<button class="js-reset-btn aside--list__reset" title="Borrar todos los favoritos"> Borrar todos los favoritos</button>';
  favList.innerHTML = HTMLFavsCode;

  //Recojo el icono de borrar
  deleteIcons = document.querySelectorAll('.js-icon');

  // handler del icono
  function handleIcon(ev) {
    // //Busco el icono clickado
    clickedFavID = ev.currentTarget.id;
    foundFavForDelete = findFavforDelete();
    deleteFav();
    setInLocalStorage();
    paintResults();
  }

  //Escucho el icono
  for (const icon of deleteIcons) {
    icon.addEventListener('click', handleIcon);
  }
  //Encuentro el objeto correspondiente al icono clickado
  function findFavforDelete() {
    for (const object of favs) {
      if (object.id === parseInt(clickedFavID)) {
        return object;
      }
    }
    return undefined;
  }

  //Recojo el botón de reset
  const resetBtn = document.querySelector('.js-reset-btn');
  function handleResetBtn() {
    //Borro del array
    favs = [];
    //Vuelvo a guardar en LS (Esta vez vacío)
    setInLocalStorage();
    //Vuelvo a pintar los favs
    paintFavs();
    //Vuelvo a pintar los resultados para que no sagan seleccionadas las tarjetas
    paintResults();
  }
  //Escucho el botón de reset
  resetBtn.addEventListener('click', handleResetBtn);
}

// //Handler de la tarjeta
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
  // Cojo la serie del producto clickado
  foundShow = findShowforFavs(clickedID, searchResults);
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

//LOCAL STORAGE

//Recojo de LS y pinto en favs cuando arranca la página
function getFromLS() {
  const LSFavs = localStorage.getItem('favorite shows');
  if (LSFavs !== null) {
    favs = JSON.parse(LSFavs);
    paintFavs();
  }
}

//Guardo en LS con favoritos
function setInLocalStorage() {
  localStorage.setItem('favorite shows', JSON.stringify(favs));
}

getFromLS();
