//express to run server and routes
const express = require('express');
// dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const fetch = require("node-fetch");
const lookup = require('country-code-lookup');
const getNextDate = require('get-next-date');

dotenv.config();
// endpoints
let imageUrl, //links to pixabay images on the server side
  cityArrayNew, //a new array for city where if pixabay returns no pic, the city is replaced by country
  servCityArray, //list of cities on the server side
  count, //variable that makes sure all the inputs have been read
  map, //map between cityArray and cityArrayNew
  mapC, //map between cityArray and countdowns
  servDepartDates, //departure dates on the server side
  servReturnDates, //return dates on the server side
  servCountdowns; //countdowns on the server side

// intsance of the application
const app = express();

// use dependencies
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());

// ejs setup
app.set('views', 'dist');
app.set('view engine', 'ejs');

// use all the static files
app.use(express.static('dist'));

// spin up the server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});

// get request to home route
app.get('/', function(req, res) {
  res.sendFile('dist/index.html');
})

// post request to '/places' route which is used for google places api
app.post('/places', (req, res) => {
  const key = process.env.placesApiKey;
  const baseUrl = process.env.placesApiUrl;
  const city = req.body.cityName;

  const url = baseUrl + city + key;

  https.get(url, (resp) => {
    const {
      statusCode
    } = resp;
    const contentType = resp.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      resp.resume();
      return;
    }

    resp.setEncoding('utf8');
    let rawData = '';
    resp.on('data', (chunk) => {
      rawData += chunk;
    });
    resp.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        res.send(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

})

// post route for travel info
app.post('/travelInfo', (req, res) => {
  const API_KEY = process.env.pixabayApiKey;
  const pixabayUrl = process.env.pixabayApiUrl;
  let url;
  const cityArray = JSON.parse(req.body.cityNames);
  const countdowns = JSON.parse(req.body.countdowns);
  servDepartDates = JSON.parse(req.body.departDates);
  servReturnDates = JSON.parse(req.body.returnDates);
  // flush all the arrays to avoid repetition
  imageUrl = [];
  cityArrayNew = [];
  servCityArray = [];
  servCountdowns = [];
  sortedImageUrl = [];
  sortedCities = [];
  map = new Map();
  mapC = new Map();
  count = 0;
  for (let i = 0; i < cityArray.length; i++) {
    url = pixabayUrl + encodeURIComponent(cityArray[i]) + API_KEY;
    // extract the country name
    let country = cityArray[i].split(',');
    country = country[country.length - 1];

    fetch(url)
      .then(res => res.json())
      .then(data => {
        //if pixabay finds a picture for that url
        if (data.hits.length === 0) {
          cityArrayNew.push(country);
          map.set(country, cityArray[i]);
          mapC.set(country, countdowns[i]);
          count++;
        } else {
          cityArrayNew.push(cityArray[i]);
          map.set(cityArray[i], cityArray[i]);
          mapC.set(cityArray[i], countdowns[i]);
          count++;
        }
        if (count == cityArray.length) {
          count = 0;
          for (let k = 0; k < cityArrayNew.length; k++) {
            url = pixabayUrl + encodeURIComponent(cityArrayNew[k]) + API_KEY;
            fetch(url)
              .then(res => res.json())
              .then(data => {
                imageUrl.push(data.hits[0].largeImageURL);
                servCityArray.push(map.get(cityArrayNew[k]));
                servCountdowns.push(mapC.get(cityArrayNew[k]));
                count++;
                if (count == cityArrayNew.length) {
                  res.redirect("/travelInfo");
                }
              })
          }
        }
      })
  }

})

// get route for the '/travelInfo' route that renders the travel information
app.get('/travelInfo', (req, res) => {
  let indexMap = new Map(); //mao to save the indexes of an unsorted countdowns array
  for (let i = 0; i < servCountdowns.length; i++) {
    indexMap.set(servCountdowns[i], i);
  }
  servCountdowns.sort(function(x, y) { //sorting the countdown array
    return x - y
  });
  //flush the already sorted arrays
  let sortedImageUrl = [];
  let sortedCities = [];
  //fill the arrays according to the sorted countdown array so that the values are moved around correctly
  for (let i = 0; i < servCountdowns.length; i++) {
    let index = indexMap.get(servCountdowns[i]);
    sortedImageUrl.push(imageUrl[index]);
    sortedCities.push(servCityArray[index]);
  }
  imageUrl = sortedImageUrl;
  servCityArray = sortedCities;
  res.render('travelInfo', { //call the ejs file
    imageUrl: sortedImageUrl,
    cityArray: sortedCities,
    countdowns: servCountdowns,
  });
})

// post route for '/travelInfo-ejs' that is triggered when on '/travelInfo' page an entry is removed
app.post('/travelInfo-ejs', (req, res) => {
  const removed = req.body.deletedCity;
  for (let i = 0; i < servCityArray.length; i++) {
    if (servCityArray[i].trim() === removed.trim()) { //find the removed item and delete its counterparts in the other arrays
      servCityArray.splice(i, 1);
      servDepartDates.splice(i, 1);
      servReturnDates.splice(i, 1);
      servCountdowns.splice(i, 1);
      imageUrl.splice(i, 1);
    }
  }
  res.redirect("/travelInfo");
})

// post route for waether data
app.post('/weatherInfo', (req, res) => {
  const city = req.body.cityName;
  let country;
  // use country-code-lookup package
  if (lookup.byCountry(req.body.countryName) !== null) {
    country = lookup.byCountry(req.body.countryName).iso2;
  } else if (lookup.byIso(req.body.countryName) !== null) {
    country = lookup.byIso(req.body.countryName).iso2;
  } else {
    country = lookup.byFips(req.body.countryName).iso2;
  }

  // construct the query url for Geonames api
  const geoBaseUrl = process.env.geoUrl;
  const geoUsername = process.env.geoUsername;
  const url = geoBaseUrl + city + "&country=" + country + geoUsername;

  const weatherbitBaseUrl = process.env.weatherbitBaseUrl;
  const weatherBitSecondUrl = process.env.weatherBitSecondUrl;
  const weatherbitApiKey = process.env.weatherbitApiKey;

  // start apis query
  let longitude, lattitude, start, end, bitUrlHistory, bitUrlCurrent;
  for (let i = 0; i < servCityArray.length; i++) {
    if (servCityArray[i].includes(city)) {
      start = servDepartDates[i];
      end = servReturnDates[i];
    }
  }
  let startArr = start.split("/");
  start = (startArr[2]-1) + "-" + startArr[0] + "-" + startArr[1];
  end = new Date(getNextDate(start));
  end =  end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      longitude = data.postalcodes[0].lng;
      lattitude = data.postalcodes[0].lat;
      bitUrlHistory = weatherbitBaseUrl + "lat=" + lattitude + "&lon=" + longitude + "&start_date="+ start + "&end_date=" + end + weatherbitApiKey;   //get histroical weather data
      bitUrlCurrent = weatherBitSecondUrl + "lat=" + lattitude + "&lon=" + longitude + weatherbitApiKey;   //get current weather data
      Promise.all([
        fetch(bitUrlHistory).then(value => value.json()),
        fetch(bitUrlCurrent).then(value => value.json())
      ])
      .then(files => {
        res.send(files);
      })

    })
    .catch(function(error){
      console.log("Geoname did not find a relevant data!");
      bitUrlHistory = weatherbitBaseUrl + "city=" + city + "&country=" + country + "&start_date="+ start + "&end_date=" + end + weatherbitApiKey;
      bitUrlCurrent = weatherBitSecondUrl + "city=" + city + "&country=" + country + weatherbitApiKey;
      Promise.all([
        fetch(bitUrlHistory).then(value => value.json()),
        fetch(bitUrlCurrent).then(value => value.json())
      ])
      .then(files => {
        res.send(files);
      })
    })

})

module.exports = app
