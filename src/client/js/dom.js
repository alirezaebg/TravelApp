// variable to get header tabs
const headerTabs = document.querySelectorAll('.nav-links a');
// variable to store list of cities that user has enetered
export let cityArray = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
export let departDatesArray = localStorage.getItem('departs') ? JSON.parse(localStorage.getItem('departs')) : [];
export let returnDatesArray = localStorage.getItem('returns') ? JSON.parse(localStorage.getItem('returns')) : [];
export let countdownArray = localStorage.getItem('countdowns') ? JSON.parse(localStorage.getItem('countdowns')) : [];
// variable to hold the state of 'view my list' button
export let viewListPressed = false;

// Change header links appearance when hovering over them
headerTabs.forEach(heading => {
  //hover over
  heading.addEventListener('mouseover', function() {
    heading.parentElement.classList.add('header-tab');
  })
  //hover out
  heading.addEventListener('mouseout', function() {
    heading.parentElement.classList.remove('header-tab');
  })
})

//Scroll to section when clicking on the header tabs
headerTabs.forEach(heading => {
  heading.addEventListener('click', function(e) {
    e.preventDefault();
    const eventId = e.target.getAttribute('href');
    if (eventId != null && eventId !== '#') {
      console.log(eventId);
      document.getElementById(eventId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// On click event close the auto complete box for city suggestion
document.addEventListener("click", function(e) {
  closeAutoList(e.target);
  closeTravelList(e.target);
});

// function to close the open city-autocomplete list
function closeAutoList(e) {
  const elems = $(".cityNamesAuto");
  if (e != elems && e != $('#destination-text')) {
    elems.remove();
  }
}

// function to close an open travel list
function closeTravelList(e) {
  let valid = true; // it is set to true as initially none of the following 3 elements are clicked!
  let allStrongs = $("#travelListId strong");
  let allTrashes = $("#travelListId .fa-trash-alt");
  let allTravelListItems = $(".travelItem");
  // if any of the above elements are clicked, set the valid to false as we dont' want this function to work in those cases
  for (let i = 0; i < allTrashes.length; i++) {
    if (e === allStrongs.get(i) || e === allTrashes.get(i) || e === allTravelListItems.get(i)) {
      valid = false;
    }
  }
  if (e != $('#addBtn')[0] && e != $('#addBtn span')[0] && valid && allTrashes.length !== 0) {
    $("#travelListId").addClass("toggleList");
    removeTravelListItems();
  }
}

// function that opens an autocomplete list when user types a destination and handles if user choses a destination with mouse
function addAutoCompleteList(data) {
  const citySuggest = document.createElement('div');
  const dest_box = document.getElementById('destination-text');
  citySuggest.setAttribute("id", "auto");
  citySuggest.setAttribute("class", "cityNamesAuto");
  let currentFocus = -1;
  dest_box.parentNode.appendChild(citySuggest);
  /*for each suggested city in the array*/
  for (let i = 0; i < data.predictions.length; i++) {
    /*create a DIV element for suggestion*/
    let citySuggestElem = document.createElement("div");
    /*make the element bold*/
    citySuggestElem.innerHTML = "<strong>" + data.predictions[i].description + "</strong>";
    /*insert an input field that will hold the current array item's value:*/
    citySuggestElem.innerHTML += "<input type='hidden' value='" + data.predictions[i].description + "'>";
    /*execute a function when someone clicks on the item value (DIV element):*/
    citySuggestElem.addEventListener("click", function(e) {
      /*insert the value for the autocomplete text field:*/
      document.getElementById('destination-text').value = this.getElementsByTagName("input")[0].value;
      /*close the list of autocompleted values,
      (or any other open lists of autocompleted values:*/
      closeAutoList(e);
      currentFocus = -1; //reset the current focus
    });
    citySuggest.appendChild(citySuggestElem);
  }
  dest_box.addEventListener("keydown", function(e) {
    var x = document.getElementById("auto");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) {
          x[currentFocus].click();
          currentFocus = -1; //reset the current focus
        }
      }
    }
  })

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
}

// event listner for '+Add to list' button
$(".btn-addToList").click(addNewEntry);

function addNewEntry() {
  /* Local storage code goes here */
  if ($("#destination-text").val().length > 0 && $('#flatpickrDept').val().length > 0 &&
    $('#flatpickrRet').val().length > 0) { //non-empty inputs
    const newCityEntry = $('#destination-text').val();
    const newDepartDate = $('#flatpickrDept').val();
    const newReturnDate = $('#flatpickrRet').val();
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }
    const departDateVar = new Date(newDepartDate).getTime();
    const returnDateVar = new Date(newReturnDate).getTime();
    const now = new Date().getTime();
    const countDown = Math.floor((departDateVar - now) / (1000 * 60 * 60 * 24));
    // revise the city array so that is it more known to other APIs such as pixabay
    let newCityEdit = newCityEntry;
    if (newCityEdit.includes(',')) {
      newCityEdit = newCityEntry.split(',');
      newCityEdit = newCityEdit[0] + "," + newCityEdit[newCityEdit.length - 1]; //keeping the city name and country
    }
    if (!cityArray.includes(newCityEdit) && departDateVar < returnDateVar && countDown >= 0) {
      //add the new entry
      cityArray.push(newCityEdit.trim());
      departDatesArray.push(new Date(newDepartDate).toLocaleDateString("en-EN", options));
      returnDatesArray.push(new Date(newReturnDate).toLocaleDateString("en-EN", options));
      countdownArray.push(Math.floor(countDown));
      /* sort the arrays based on countdowns */
      let iMap = new Map(); //map to save the indexes of an unsorted countdowns array
      for (let i = 0; i < countdownArray.length; i++) {
        iMap.set(countdownArray[i], i);
      }
      countdownArray.sort(function(x, y) { //sorting the countdown array
        return x - y
      });
      //flush the already sorted arrays
      let sortedCityArray = [];
      let sortedDepartDatesArray = [];
      let sortedReturnDatesArray = [];
      //fill the arrays according to the sorted countdown array so that the values are moved around correctly
      for (let i = 0; i < countdownArray.length; i++) {
        let index = iMap.get(countdownArray[i]);
        sortedCityArray.push(cityArray[index]);
        sortedDepartDatesArray.push(departDatesArray[index]);
        sortedReturnDatesArray.push(returnDatesArray[index]);
      }
      //replace the original arrays with the sorted ones
      cityArray = sortedCityArray;
      departDatesArray = sortedDepartDatesArray;
      returnDatesArray = sortedReturnDatesArray;
      /* sort is done */
      //Add to localStorage
      localStorage.setItem('cities', JSON.stringify(cityArray));
      localStorage.setItem('departs', JSON.stringify(departDatesArray));
      localStorage.setItem('returns', JSON.stringify(returnDatesArray));
      localStorage.setItem('countdowns', JSON.stringify(countdownArray));
      displayMessage("Successfully added!");
    }
    else if (cityArray.includes(newCityEdit)) {
      displayMessage("Destination is already on the list");
    }
    else if (departDateVar >= returnDateVar) {
      displayMessage("Check your dates!");
    }
    else if (countDown < 0) {
      displayMessage("Change the departure date!");
    }
  }
  else {
    displayMessage("Fill in the required fields!");
  }
}

// event listener for 'View my list' button
$("#addBtn").click(function() {
  $("#travelListId").toggleClass("toggleList");
  if (!viewListPressed) {
    for (let i = 0; i < cityArray.length; i++) {
      const travelItem = document.createElement('div');
      travelItem.setAttribute('id', `li${i+1}`);
      travelItem.setAttribute('class', 'travelItem');
      travelItem.innerHTML = '<Strong>' + cityArray[i] + '</Strong>';
      if (countdownArray[i] == 1) {
        travelItem.innerHTML += '<Strong><span class="countdownSpan">(in ' + countdownArray[i] + ' day)</span></Strong>';
      }
      else if (countdownArray[i] == 0) {
        travelItem.innerHTML += '<Strong><span class="countdownSpan">(Today)</span></Strong>';
      }
      else {
        travelItem.innerHTML += '<Strong><span class="countdownSpan">(in ' + countdownArray[i] + ' days)</span></Strong>';
      }
      travelItem.innerHTML += '<i class="fas fa-trash-alt"></i>';
      $("#travelListId").append(travelItem);
      $(`#li${i}`).addClass('travelItem');
      document.querySelectorAll(`.travelItem span`)[i].style.color = '#679b9b';
    }
    viewListPressed = true;
    // event listener for the trash icon
    document.querySelectorAll(".fa-trash-alt").forEach(inp =>
      inp.addEventListener('click', function() {
        inp.parentNode.classList.add("travelItemSlide");
        setTimeout(function() {
          inp.parentNode.style.display = 'none';
        }, 700);
        //remove it from localStorage
        const txt = inp.parentNode.firstChild.textContent;
        for (let i = 0; i < cityArray.length; i++) {
          if (txt === cityArray[i]) {
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
      })
    )
  } else {
    removeTravelListItems();
  }
})

// function to remove all child elements of the travel list
function removeTravelListItems() {
  const list = document.querySelector("#travelListId");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  viewListPressed = false;
}

// function to print a message when using the form
function displayMessage(msg) {
  console.log(msg);
  $("#displayMsg").removeClass("hide");
  $("#displayMsg h6").text(msg);
  setTimeout(function() {
    $("#displayMsg").addClass("hide");
  }, 2000)
}

// event listener to update the values of countdowns
window.onbeforeunload = updateValues;

function updateValues() {
  for (let i = 0; i < cityArray.length; i++) {
    const departDate = departDatesArray[i];
    const departDateVar = new Date(departDate).getTime();
    const now = new Date().getTime();
    const countDown = departDateVar - now;
    countdownArray[i] = Math.floor(countDown / (1000 * 60 * 60 * 24));
    if (countdownArray[i] < 0) {
      cityArray.splice(i, 1);
      departDatesArray.splice(i, 1);
      returnDatesArray.splice(i, 1);
      countdownArray.splice(i, 1);
    }
  }
  // update local storage
  localStorage.setItem('cities', JSON.stringify(cityArray));
  localStorage.setItem('departs', JSON.stringify(departDatesArray));
  localStorage.setItem('returns', JSON.stringify(returnDatesArray));
  localStorage.setItem('countdowns', JSON.stringify(countdownArray));
}

export {
  closeAutoList,
  addAutoCompleteList,
  addNewEntry,
  displayMessage,
  updateValues,
}
