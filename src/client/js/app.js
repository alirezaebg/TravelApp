import {
  addAutoCompleteList
} from './dom.js';

// event listener for the input text field (destination)
const dest_box = document.getElementById('destination-text');
dest_box.addEventListener('input', citySearch);

// function that calls google places api and populates the auto complete list
function citySearch(e) {
  let name = e.target.value;
  if (!name) return false;
  if (name.length >= 3) { //if user has entered the first three letters
    postData('http://localhost:3000/places', { //calls for /places route
        cityName: name
      })
      .then(addAutoCompleteList) //populates the city auto complete list
  } else {
    const auto = document.getElementById("auto");
    if (auto) auto.remove();
  }
}

// post data to the server side to find the city name suggestions
const postData = async (url = '', data = {}) => {
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

// event listener for 'View my list' button

// Pixabay api call
var API_KEY = '16382015-63fe13ad973b21882312bf3a7';
var query = 'Paris';
var URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(query);
fetch(URL)
  .then(response => response.json())
  .then(data => console.log(data));
