import {
  viewListPressed
} from './dom.js'
import {
  cityArray,
  departDatesArray,
  returnDatesArray,
  countdownArray
} from './dom.js'

const allRemoveBtns = document.querySelectorAll(".tile-text button");

document.addEventListener("DOMContentLoaded", function() {
  for (let i = 0; i < allRemoveBtns.length; i++) {
    allRemoveBtns[i].setAttribute("id", `remove${i}`);
  }
})

allRemoveBtns.forEach(inp => {
  inp.addEventListener("click", function(e) {
    const parent = inp.parentNode.parentNode;
    const tripToText = inp.previousElementSibling.firstElementChild.innerHTML;
    parent.classList.add("slide-right");
    setTimeout(function() {
      parent.classList.add("slide-left");
    }, 400);
    setTimeout(function() {
      parent.style.display = 'none'; //hide the element from display
    }, 1000);
    let removed;
    // remove it from localStorage
    for (let i = 0; i < cityArray.length; i++) {
      if (tripToText.includes(cityArray[i])) {
        removed = cityArray[i];
        cityArray.splice(i, 1);
        departDatesArray.splice(i, 1);
        returnDatesArray.splice(i, 1);
        countdownArray.splice(i, 1);
      }
    }
    localStorage.setItem('cities', JSON.stringify(cityArray));
    localStorage.setItem('departs', JSON.stringify(departDatesArray));
    localStorage.setItem('returns', JSON.stringify(returnDatesArray));
    localStorage.setItem('countdowns', JSON.stringify(countdownArray));
    postForm('http://localhost:3000/travelInfo-ejs', {
      deletedCity: removed,
    });
  })
});

document.querySelectorAll('.weather-btn').forEach(inp => {
  let tripTo = inp.parentNode.parentNode.firstElementChild.firstElementChild.firstElementChild.textContent;
  tripTo = tripTo.substring("Trip to: ".length).trim();
  let arr, city, country, date;
  if (tripTo.includes(",")) {
    arr = tripTo.split(",");
    city = arr[0].trim();
    country = arr[1].trim();
  } else {
    arr = tripTo.split("-");
    city = arr[0].trim();
    country = arr[1].trim();
  }
  for (let i = 0; i < cityArray.length; i++) {
    if(cityArray[i].includes(city)) {
      date = departDatesArray[i];
    }
  }
  inp.addEventListener("click", function() {
    postForm("http://localhost:3000/weatherInfo", {
        cityName: city,
        countryName: country,
      })
      .then(data => {
        const histTemp = data[0].data[0].temp; //temperature on the same day last year
        const histMaxTemp = data[0].data[0].max_temp; //max temp on the same day last year
        const histMinTemp = data[0].data[0].min_temp; //min temp ...
        const histDate = data[0].data[0].datetime; //last year's date
        const currTemp = data[1].data[0].temp; //current temp
        const currDescription = data[1].data[0].weather.description //current weather description
        const currIcon = data[1].data[0].weather.icon; //current weather code
        const currDate = data[1].data[0].datetime; //current date
        createWeatherInfoTile(histTemp, histMaxTemp, histMinTemp, histDate,
          currTemp, currDescription, currIcon, currDate, date);
      })
  })
})

// post data to the server side to find the city name suggestions
const postForm = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}

function createWeatherInfoTile(hTemp, hMinTemp, hMaxTemp, hDate,
  cTemp, cDescription, cIcon, cDate, date) {
    const infoDiv = document.getElementById("travel-info");
    //clear the travel info section
    while (infoDiv.firstChild) {
      infoDiv.removeChild(infoDiv.firstChild);
    }
    const weatherTile = document.createElement("div");
    const histPart = document.createElement("div");
    const currPart = document.createElement("div");
    histPart.classList.add("hist-part");
    currPart.classList.add("curr-part");
    weatherTile.classList.add("weather-tile", "stayRight");
    histPart.innerHTML = "<span>Forecast for: " + date + " (Based on last year)</span><br><span>Temperature: " + hTemp + " C</span><br><span>Min: "
      + hMinTemp + " C</span><br></span>Max: " + hMaxTemp + " C</span><br></span>";
    currPart.innerHTML = "<span>Current weather:</span><br><span>Temperature: " + cTemp + " C</span><br><span>Description: "
        + cDescription + " </span><br><span><img src=https://www.weatherbit.io/static/img/icons/" + cIcon + ".png></span>";
    weatherTile.appendChild(histPart);
    weatherTile.appendChild(currPart);
    infoDiv.appendChild(weatherTile);
    setTimeout(function() {
      weatherTile.classList.remove("stayRight");
      weatherTile.classList.add("slideFromRightToLeft");
    }, 1)

  }
