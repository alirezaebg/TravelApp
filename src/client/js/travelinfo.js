//function to handle the remove button
function handleRemoveBtn(e) {
  const inp = e.target;
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
  for (let i = 0; i < Info.cityArray.length; i++) {
    if (tripToText.includes(Info.cityArray[i])) {
      removed = Info.cityArray[i];
      Info.cityArray.splice(i, 1);
      Info.departDatesArray.splice(i, 1);
      Info.returnDatesArray.splice(i, 1);
      Info.countdownArray.splice(i, 1);
    }
  }
  localStorage.setItem('cities', JSON.stringify(Info.cityArray));
  localStorage.setItem('departs', JSON.stringify(Info.departDatesArray));
  localStorage.setItem('returns', JSON.stringify(Info.returnDatesArray));
  localStorage.setItem('countdowns', JSON.stringify(Info.countdownArray));

  fetch('/travelInfo-ejs', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({deletedCity: removed}),
  });
}

function handleWeatherBtn(e) {
  const inp = e.target;
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
  for (let i = 0; i < Info.cityArray.length; i++) {
    if (Info.cityArray[i].includes(city)) {
      date = Info.departDatesArray[i];
    }
  }
  postForm("/weatherInfo", {
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
        currTemp, currDescription, currIcon, currDate, date, city, country);
    })
}

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
  cTemp, cDescription, cIcon, cDate, date, city, country) {
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
  histPart.innerHTML = "<span>Destination: " + city + ", " + country + "<br></span><span>Forecast for: " + date +
    "<br>(Based on last year)</span><br><span>Temperature: " + hTemp + " C</span><br><span>Min: " +
    hMinTemp + " C</span><br></span>Max: " + hMaxTemp + " C</span><br></span>";
  currPart.innerHTML = "<span>Current weather:</span><br><span>Temperature: " + cTemp + " C</span><br><span>Description: " +
    cDescription + " </span><br><span><img src=https://www.weatherbit.io/static/img/icons/" + cIcon + ".png></span>";
  weatherTile.appendChild(histPart);
  weatherTile.appendChild(currPart);
  infoDiv.appendChild(weatherTile);
  setTimeout(function() {
    weatherTile.classList.remove("stayRight");
    weatherTile.classList.add("slideFromRightToLeft");
  }, 1)
}

export {
  handleRemoveBtn,
  createWeatherInfoTile,
  postForm,
  handleWeatherBtn,
}
