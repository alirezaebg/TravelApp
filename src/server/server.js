//express to run server and routes
const express = require('express');
// dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
dotenv.config();
// intsance of the application
const app = express();

// use dependencies
app.use(bodyParser.urlencoded({extended: false}));
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
  res.sendFile('/client/views/index.html', {root: __dirname + '/..'});
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

let imageUrl = [];
// post route for travel info
app.post('/travelInfo', (req, res) => {
  const API_KEY = process.env.pixabayApiKey;
  const pixabayUrl = process.env.pixabayApiUrl;
  const query = req.body.cityName;
  const url = pixabayUrl + encodeURIComponent(query) + API_KEY;
  console.log(url);
  imageUrl = [];
  imageUrl.push("https://pixabay.com/get/57e0d6474b55b10ff3d8992cc62e3476173fdfe04e5074417c2d7dd39245c0_640.jpg");
  res.redirect("/travelInfo");
})

app.get('/travelInfo', (req, res) => {
  res.render('travelInfo', {imageUrl: imageUrl});
})
