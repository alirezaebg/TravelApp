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

// project endpoint to store list of user destinations if they are added to his list
let destinationArray = [];


// use dependencies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

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

// post request to '/listitem' route to store user's traval info
app.post('/listitem', (req, res) => {
  const inp = {
    city: req.body.dest,
  }
  destinationArray.push(inp);
  console.log(inp);
})

// get request from '/listitems' route to retrieve user's travel info
app.get('/listitem', (req, res) => {
  res.send(destinationArray);
})
