
document.getElementById('destination-text').addEventListener('input', citySearch);

function citySearch(e) {
  let name = e.target.value;
  postData('http://localhost:3000/places', {cityName: name})
  // .then(function(data) {
  //   console.log(data.predictions[0].description);
  // })
}

// post data to the server side to find the city name suggestions
const postData = async ( url = '', data = {}) => {
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
    console.log(newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}
