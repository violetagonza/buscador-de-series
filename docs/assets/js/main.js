"use strict";const btn=document.querySelector(".js-btn"),input=document.querySelector(".js-input");function handlebtn(){event.preventDefault(),getData()}let searchResults=[];function getData(){fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`).then(s=>s.json()).then(s=>{searchResults=s,paintResults()})}function paintResults(){const s=document.querySelector(".js-list");s.innerHTML="";let t="";for(let s=0;s<searchResults.length;s++)t+=`<li id="${searchResults[s].show.id}" class="main--list__item card--normal js-card"> <p class="main--list__text">${searchResults[s].show.name}</p>`,null===searchResults[s].show.image?t+=`<img src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV" alt="${searchResults[s].show.name}"></li>`:t+=`<img src="${searchResults[s].show.image.medium}" alt="${searchResults[s].show.name}"></li>`;s.innerHTML=t,listenCards()}btn.addEventListener("click",handlebtn);let favs=[];function paintFavs(){const s=document.querySelector(".js-fav-list");let t="";for(let s=0;s<favs.length;s++)t+=`<li><div class="aside--list-div"><p class="aside--list__text">${favs[s].name}</p> <i class="aside--list__icon fas fa-trash-alt"></i></div>`,t+=`<img class="aside--list__img" src="${favs[s].imgurl}" alt="${favs[s].name}"></li>`;s.innerHTML=t}function handleCard(s){s.currentTarget.classList.contains("card--normal")?(s.currentTarget.classList.remove("card--normal"),s.currentTarget.classList.add("card--fav")):s.currentTarget.classList.contains("card--fav")&&(s.currentTarget.classList.remove("card--fav"),s.currentTarget.classList.add("card--normal"));const t=s.target.id;console.log(t);let e=findShowforFavs(t,searchResults);favs.push({id:e.show.id,name:e.show.name,imgurl:"https://via.placeholder.com/210x295/ffffff/666666/? text=TV"}),console.log(e),console.log(favs),paintFavs(),setInLocalStorage()}function listenCards(){const s=document.querySelectorAll(".js-card");for(const t of s)t.addEventListener("click",handleCard)}function findShowforFavs(s,t){for(const e of t)if(e.show.id===parseInt(s))return e}function getFromLS(){const s=localStorage.getItem("favorite shows");null!==s&&(favs=JSON.parse(s),paintFavs())}function setInLocalStorage(){localStorage.setItem("favorite shows",JSON.stringify(favs))}getFromLS();