//Configure datepicker
// src: https://www.cssscript.com/flat-style-javascript-date-picker-flatpickr/
const fp_departure = flatpickr("#flatpickrDept", {
  dateFormat: 'm-d-Y',
  shorthandCurrentMonth: true,
  minDate: new Date(),
});

const fp_return = flatpickr("#flatpickrRet", {
  dateFormat: 'm-d-Y',
  shorthandCurrentMonth: true,
  minDate: new Date(),
});
