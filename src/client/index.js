import {fp_departure} from './js/datepicker.js'
import {fp_return} from './js/datepicker.js'

import {lookupHandler} from './js/app.js'
import {citySearch} from './js/app.js'
import {postData} from './js/app.js'

import {addAutoCompleteList} from './js/dom.js'
import {viewListPressed} from './js/dom.js'
import {cityArray, departDatesArray, returnDatesArray, countdownArray} from './js/dom.js'
import {addNewEntry, displayMessage, updateValues} from './js/dom.js'
import {closeAutoList, closeTravelList} from './js/dom.js'
import {removeTravelListItems, handleViewMyList} from './js/dom.js'

import './css/styles-home.scss'

import {Brazil} from './media/Brazil.jpg'
import Logo from './media/logo.png'

let req = require.context("./media", true, /\.(png|svg|jpg|gif)$/);
req.keys().forEach(function(key){
    req(key);
});

/* event listeners from 'app.js'*/
//******************************************************************
// event listener for the input text field (destination)
const dest_box = document.getElementById('destination-text');
dest_box.addEventListener('input', citySearch);
// Event listener for the travel info button
$(".btn-lookUp").on('click touchstart', lookupHandler);

/* event listeners from 'dom.js'*/
//******************************************************************
// variable to get header tabs
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
document.addEventListener("click", closeAll);
document.addEventListener("touchstart", closeAll);

function closeAll(e) {
  closeAutoList(e.target);
  closeTravelList(e.target);
}

// event listner for '+Add to list' button
$(".btn-addToList").on('click touchstart', addNewEntry);

// event listener for 'View my list' button
$("#addBtn").on('click touchstart', handleViewMyList);

// event listener to update the values of countdowns
window.onbeforeunload = updateValues;


export {
  fp_departure,
  fp_return,
  lookupHandler,
  citySearch,
  postData,
  addAutoCompleteList,
  viewListPressed,
  cityArray,
  departDatesArray,
  returnDatesArray,
  countdownArray,
  addNewEntry,
  displayMessage,
  updateValues,
  closeAutoList,
  closeTravelList,
  removeTravelListItems,
  handleViewMyList,
}
