// function that calls google places api and populates the auto complete list
function citySearch(e) {
  let name = e.target.value;
  if (!name) return false;
  if (name.length >= 3) { //if user has entered the first three letters
    postData('/places', { //calls for /places route
        cityName: name
      })
      .then(Client.addAutoCompleteList) //populates the city auto complete list
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

function lookupHandler() {
  Client.updateValues();
  document.getElementById("formCityNames").value = JSON.stringify(Client.cityArray);
  document.getElementById("formDepartDates").value = JSON.stringify(Client.departDatesArray);
  document.getElementById("formReturnDates").value = JSON.stringify(Client.returnDatesArray);
  document.getElementById("formCountdowns").value = JSON.stringify(Client.countdownArray);
  if (Client.cityArray.length > 0) $("#message").submit();
  else Client.displayMessage("Add a destination to list!");
}

export {
  citySearch,
  lookupHandler,
  postData,
}
