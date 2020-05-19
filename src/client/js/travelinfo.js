import {viewListPressed} from './dom.js'
import {cityArray, departDatesArray, returnDatesArray, countdownArray} from './dom.js'

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
    setTimeout(function(){
      parent.classList.add("slide-left");
    }, 400);
    setTimeout(function(){
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
  let arr, city, country;
  if (tripTo.includes(",")) {
    arr = tripTo.split(",");
    city = arr[0].trim();
    country = arr[1].trim();
  }
  else {
    arr = tripTo.split("-");
    city = arr[0].trim();
    country = arr[1].trim();
  }
  inp.addEventListener("click", function() {
    postForm("http://localhost:3000/weatherInfo", {
      cityName: city,
      countryName: country,
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
