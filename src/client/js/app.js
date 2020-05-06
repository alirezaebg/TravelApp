import {
  closeAutoList
} from './dom.js';
import {
  addAutoCompleteList
} from './dom.js';

// event listener for the input text field (destination)
const dest_box = document.getElementById('destination-text')
dest_box.addEventListener('input', citySearch);

// function that calls google places api and populates the auto complete list
function citySearch(e) {
  let name = e.target.value;
  closeAutoList();
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

// event listner for '+Add to list' button
$(".btn-addToList").click(function() {
  if (dest_box.value.length >= 3) { // --> this check has to be changed later to verify if the destination actually exists!
    const entry = {
      dest: dest_box.value
    };
    fetch('http://localhost:3000/listitem', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })
    //Appear the "View my list" button after clicking the "+Add to list" button
    $('#addBtnDiv').removeClass('listview');
    $('#addBtnDiv').addClass('listview-afterAddBtn fade-in');
  }
})

// event listener for 'View my list' button
$("#addBtn").click(function() {
  const travelList = document.createElement('div');
  travelList.classList.add('travelList');
  document.getElementById('addBtnDiv').appendChild(travelList);
  // get data from the ''/listitem' route
  fetch('http://localhost:3000/listitem')
  .then(response => response.json())
  .then(data => {
    data.forEach(elem => {
      let cityItem = document.createElement('div');
      cityItem.innerHTML = "<strong>" + elem.city + "</strong>";
      cityItem.classList.add('travelListItem');
      travelList.appendChild(cityItem);
    });
  });


})

// Pixabay api call
var API_KEY = '16382015-63fe13ad973b21882312bf3a7';
var query = 'Paris';
var URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(query);
fetch(URL)
  .then(response => response.json())
  .then(data => console.log(data));
