//Global variables
const addToListBtn = document.querySelector('.btn-addToList');
const headerTabs = document.querySelectorAll('.nav-links a');

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

//Appear the "View my list" button after clicking the "+Add to list" button
addToListBtn.addEventListener('click', function() {
  document.querySelector('#addBtn').classList.remove('listview');
  document.querySelector('#addBtn').classList.add('listview-afterAddBtn', 'fade-in');
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
});

// function to close the open autocomplete list
function closeAutoList(e) {
  const elems = document.querySelectorAll(".cityNamesAuto");
  const cityInputField = document.getElem
  for (let i = 0; i < elems.length; i++) {
    if (e != elems[i] && e != document.getElementById('destination-text')) {
      elems[i].parentNode.removeChild(elems[i]);
    }
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
          currentFocus = -1;   //reset the current focus
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


export {
  closeAutoList,
  addAutoCompleteList,
}
