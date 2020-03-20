'use strict';
//Recojo el button y el input
const btn = document.querySelector('.js-btn');
const input = document.querySelector('.js-input');
const list = document.querySelector('.js-list');

//Handle del btn
function handlebtn() {
  event.preventDefault();
  getData();
  console.log('Me han clickado');
}

//Fetch al servidor
function getData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    //Busco dentro del array nombre y url de la imagen
    .then(results => {
      for (let i = 0; i < results.length; i++) {
        // arrPosition = arrPosition + 1;
        list.innerHTML += `<li> ${results[i].show.name}</li>`;
        if (results[i].show.image === null) {
          list.innerHTML += `<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${results[i].show.name}">`;
        } else {
          list.innerHTML += `<img src="${results[i].show.image.medium}" alt="${results[i].show.name}">`;
        }
      }
    });
}

//Escucho al botón
btn.addEventListener('click', handlebtn);
