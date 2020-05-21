
import './css/styles-travelinfo.scss'

import Logo from './media/logo.png'

import {
  cityArray,
  departDatesArray,
  returnDatesArray,
  countdownArray
} from './js/dom.js'

import {handleRemoveBtn, createWeatherInfoTile, postForm, handleWeatherBtn} from './js/travelinfo.js'

/* event listeners from 'travelinfo.js'*/
//******************************************************************

const allRemoveBtns = document.querySelectorAll(".tile-text button");
document.addEventListener("DOMContentLoaded", function() {
  for (let i = 0; i < allRemoveBtns.length; i++) {
    allRemoveBtns[i].setAttribute("id", `remove${i}`);
  }
})

//event listener for remove button
allRemoveBtns.forEach(inp => {
  inp.addEventListener("click", handleRemoveBtn);
});
// event listener for the weather info button
document.querySelectorAll('.weather-btn').forEach(inp => {
  inp.addEventListener("click", handleWeatherBtn);
})

export {
  cityArray,
  departDatesArray,
  returnDatesArray,
  countdownArray,
  handleRemoveBtn,
  createWeatherInfoTile,
  postForm,
  handleWeatherBtn
}
