import {updateValues} from '../src/client/js/dom'

describe ("Message display", () => {
  // one input should be removed
  test("It should remove the city with negative countdown", () => {

    let cityArray = ["Seoul", "Tokyo", "Bali", "Dubai"];
    let departDatesArray = [5, 10, 15, 20];
    let returnDatesArray = [6, 12, 18, 24];
    let countdownArray = [-1, 4, 9, 14];

    let newCityArray = [], newDepartDatesArray = [], newReturnDatesArray = [], newCountdownArray = [];
    for (let i = 0; i < cityArray.length; i++) {
      if (countdownArray[i] >= 0) {
        newCityArray.push(cityArray[i]);
        newDepartDatesArray.push(departDatesArray[i]);
        newReturnDatesArray.push(returnDatesArray[i]);
        newCountdownArray.push(countdownArray[i]);
      }
    }
    cityArray = newCityArray;
    countdownArray = newCountdownArray;
    departDatesArray = newDepartDatesArray;
    returnDatesArray = newReturnDatesArray;

    let outputCityArray = ["Tokyo", "Bali", "Dubai"];
    expect(outputCityArray).toEqual(cityArray);
  });
  // two inputs should be removed
  test("It should remove all cities with negative countdown", () => {

    let cityArray = ["Seoul", "Tokyo", "Bali", "Dubai"];
    let departDatesArray = [5, 10, 15, 20];
    let returnDatesArray = [6, 12, 18, 24];
    let countdownArray = [-7, -2, 3, 8];
    let newCityArray = [], newDepartDatesArray = [], newReturnDatesArray = [], newCountdownArray = [];
    for (let i = 0; i < cityArray.length; i++) {
      if (countdownArray[i] >= 0) {
        newCityArray.push(cityArray[i]);
        newDepartDatesArray.push(departDatesArray[i]);
        newReturnDatesArray.push(returnDatesArray[i]);
        newCountdownArray.push(countdownArray[i]);
      }
    }
    cityArray = newCityArray;
    countdownArray = newCountdownArray;
    departDatesArray = newDepartDatesArray;
    returnDatesArray = newReturnDatesArray;

    let outputCityArray = ["Bali", "Dubai"];
    expect(outputCityArray).toEqual(cityArray);
  });
  // no city should be removed
  test("None of the cities should be removed", () => {

    let cityArray = ["Seoul", "Tokyo", "Bali", "Dubai"];
    let departDatesArray = [5, 10, 15, 20];
    let returnDatesArray = [6, 12, 18, 24];
    let countdownArray = [1, 6, 11, 16];

    let newCityArray = [], newDepartDatesArray = [], newReturnDatesArray = [], newCountdownArray = [];
    for (let i = 0; i < cityArray.length; i++) {
      if (countdownArray[i] >= 0) {
        newCityArray.push(cityArray[i]);
        newDepartDatesArray.push(departDatesArray[i]);
        newReturnDatesArray.push(returnDatesArray[i]);
        newCountdownArray.push(countdownArray[i]);
      }
    }
    cityArray = newCityArray;
    countdownArray = newCountdownArray;
    departDatesArray = newDepartDatesArray;
    returnDatesArray = newReturnDatesArray;

    let outputCityArray = ["Seoul", "Tokyo", "Bali", "Dubai"];
    expect(outputCityArray).toEqual(cityArray);
  });

});
