//express to run server and routes
const express = require('express');
// dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const fetch = require("node-fetch");
dotenv.config();
// endpoints
let imageUrl,          //links to pixabay images on the server side
    cityArrayNew,      //a new array for city where if pixabay returns no pic, the city is replaced by country
    cities,            //list of cities on the server side
    count,             //variable that makes sure all the inputs have been read
    map,               //map between cityArray and cityArrayNew
    mapC,              //map between cityArray and countdowns
    cDowns;           //countdowns on the server side

// intsance of the application
const app = express();

// use dependencies
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());

// ejs setup
app.set('views', './src/client/views');
app.set('view engine', 'ejs');

// use all the static files
app.use(express.static('./src/client'));

// spin up the server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`server is up and running on port ${port}`);
});

// get request to home route
app.get('/', function(req, res) {
  res.sendFile('/client/views/index.html', {
    root: __dirname + '/..'
  });
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
  // flush all the arrays to avoid repetition
  imageUrl = [];
  cityArrayNew = [];
  cities = [];
  cDowns = [];
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
                cities.push(map.get(cityArrayNew[k]));
                cDowns.push(mapC.get(cityArrayNew[k]));
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
  let indexMap = new Map();     //mao to save the indexes of an unsorted countdowns array
  for (let i = 0; i < cDowns.length; i++) {
    indexMap.set(cDowns[i], i);
  }
  cDowns.sort(function(x, y) {    //sorting the countdown array
    return x - y
  });
  //flush the already sorted arrays
  let sortedImageUrl = [];
  let sortedCities = [];
  //fill the arrays according to the sorted countdown array so that the values are moved around correctly
  for (let i = 0; i < cDowns.length; i++) {
    let index = indexMap.get(cDowns[i]);
    sortedImageUrl.push(imageUrl[index]);
    sortedCities.push(cities[index]);
  }
  imageUrl = sortedImageUrl;
  cities = sortedCities;
  res.render('travelInfo', {      //call the ejs file
    imageUrl: sortedImageUrl,
    cityArray: sortedCities,
    countdowns: cDowns,
  });
})

// post route for '/travelInfo-ejs' that is triggered when on '/travelInfo' page an entry is removed
app.post('/travelInfo-ejs', (req, res) => {
  const removed = req.body.deletedCity;
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].trim() === removed.trim()) { //find the removed item and delete its counterparts in the other arrays
      cities.splice(i, 1);
      cDowns.splice(i, 1);
      imageUrl.splice(i, 1);
    }
  }
  res.redirect("/travelInfo");
})
