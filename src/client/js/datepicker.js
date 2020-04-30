//Configure datepicker
// src: https://www.cssscript.com/flat-style-javascript-date-picker-flatpickr/
const fp = flatpickr("#flatpickr", {
  dateFormat: 'm-d-Y',
  shorthandCurrentMonth: true,
  minDate: new Date(),
});
