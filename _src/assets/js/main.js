'use strict';
//Recojo el button y el input
const btn = document.querySelector('.js-btn');
const input = document.querySelector('.js-input');

// Declaro un array para meter los resultados de búsqueda
let searchResults = [];
//Fetch al servidor
function handlebtn(ev) {
  ev.preventDefault();
  fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`)
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
    HTMLSearchcode += `<li id="${searchResults[i].show.id}" class="main--list__item card--normal js-card"> <p class="main--list__text">${searchResults[i].show.name}</p>`;
    HTMLSearchcode += `<img src="${searchResults[i].image}" alt="${searchResults[i].show.name}"></li>`;
  }
  list.innerHTML = HTMLSearchcode;
  listenCards();
}

//Escucho al botón
btn.addEventListener('click', handlebtn);

//Favs

//Creo array para favs
let favs = [];
let icons;
//Pinto favs
function paintFavs() {
  const favList = document.querySelector('.js-fav-list');
  let HTMLFavsCode = '';
  for (let i = 0; i < favs.length; i++) {
    HTMLFavsCode += `<li><div class="aside--list-div"><p class="aside--list__text">${favs[i].name}</p> <i id="${favs[i].id}" class="js-icon aside--list__icon fas fa-trash-alt"></i></div>`;
    HTMLFavsCode += `<img class="aside--list__img" src="${favs[i].imgurl}" alt="${favs[i].name}"></li>`;
  }
  favList.innerHTML = HTMLFavsCode;
  icons = document.querySelectorAll('.js-icon');
  console.log(icons);
  function handleIcon() {
    console.log('me han clickado');
  }
  for (const icon of icons) {
    icon.addEventListener('click', handleIcon);
  }
  //Recojo el icono
  // let icons = document.querySelectorAll('.js-icon');
  //Handler del icono
  // function handleIcon(ev) {
  //   deleteFav();
  // //Busco el icono clickado
  // let clickedID = ev.currentTarget.id;
  // console.log(clickedID);

  // function findFavforDelete() {
  //   for (const object of favs) {
  //     if (object.id === parseInt(clickedID)) {
  //       return object;
  //     }
  //   }
  //   return undefined;
  // }
  // let foundFav = findFavforDelete();
  // console.log(foundFav);

  // //Busco en el array el elemento clickado y si está, lo borro
  // for (let i = 0; i < favs.length; i++) {
  //   if (foundFav !== undefined) {
  //     favs.splice(i);
  //   }
  //   console.log('Me han clickado');
  // }

  //escucho el icon
  // for (let icon of icons) {
  //   icon.addEventListener('click', handleIcon);
  // }
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
  let favIndex;
  const clickedID = ev.currentTarget.id;
  console.log(clickedID);
  // Cojo la serie del producto clickado
  let foundShow = findShowforFavs(clickedID, searchResults);
  console.log(foundShow);

  //Miro si el objeto está ya en favs
  let isInFavs = false;
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
  }

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
