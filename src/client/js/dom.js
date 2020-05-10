// variable to get header tabs
const headerTabs = document.querySelectorAll('.nav-links a');
// variable to store list of cities that user has enetered
let cityArray = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
// variable to hold the state of 'view my list' button
let viewListPressed = false;

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
  if (e != $('#addBtn')[0] && e != $('#addBtn span')[0] && valid) {
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
$(".btn-addToList").click(function() {
  /* Local storage code goes here */
  const newCityEntry = $('#destination-text').val();
  if (!cityArray.includes(newCityEntry)) {
    cityArray.push(newCityEntry);
  };
  localStorage.setItem('cities', JSON.stringify(cityArray));
})

// event listener for 'View my list' button
$("#addBtn").click(function() {
  $("#travelListId").toggleClass("toggleList");
  if (!viewListPressed) {
    for (let i = 0; i < cityArray.length; i++) {
      const travelItem = document.createElement('div');
      travelItem.setAttribute('id', `li${i+1}`);
      travelItem.setAttribute('class', 'travelItem');
      travelItem.innerHTML = '<Strong>' + cityArray[i] + '</Strong>';
      travelItem.innerHTML += '<i class="fas fa-trash-alt"></i>';
      $("#travelListId").append(travelItem);
      $(`#li${i}`).addClass('travelItem');
    }
    viewListPressed = true;
    // event listener for the trash icon
    document.querySelectorAll(".fa-trash-alt").forEach(inp =>
      inp.addEventListener('click', function() {
        inp.parentNode.classList.add("travelItemSlide");
        setTimeout(function(){
          inp.parentNode.style.display = 'none';
        }, 700);
        //remove it from localStorage
        const txt = inp.parentNode.textContent;
        for (let i = 0; i < cityArray.length; i++) {
          if (txt === cityArray[i]) {
            cityArray.splice(i, 1);
          }
        }
        localStorage.setItem('cities', JSON.stringify(cityArray));
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

export {
  closeAutoList,
  addAutoCompleteList,
}
