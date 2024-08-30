'use strict';
const countriesContainer=document.querySelector('.countries');

const renderCountry=function(data,className=' '){
   
        const html=`
        <article class="country ${className}">
        <a href = "https://www.google.com/maps/place/${data.latlng}" target="_blank">
        <img class="country__img" src="${data.flag}" />
        </a>
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>${(+data.population/1000000).toFixed(1)}</span>people</p>
             <p class="country__row"><span>${data.languages[0].name}</span></p>
             <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>`;

        countriesContainer.insertAdjacentHTML('beforeend',html);
        countriesContainer.style.opacity=1;
    };


const getCountryData=function(country){
    fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response=>response.json())
    .then(data=>{
        renderCountry(data[0]);
            const neighbour =data[0].borders;
              for (let each of neighbour) {
                let neighbour1 = each;
                // console.log(neighbour1);
                console.log(data[0]);
            if (!neighbour) return;

            //country2
         fetch(`https://restcountries.com/v2/alpha/${neighbour1}`)
        .then(response=>response.json())

        .then(data=>renderCountry(data,'neighbour'));
      } 
        })
        
};


getCountryData('bharat');




 