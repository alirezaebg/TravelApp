//express to run server and routes
const express = require('express');
// dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
// intsance of the application
const app = express();

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

app.get('/', function(req, res) {
  res.sendFile('/client/views/index.html', {root: __dirname + '/..'});
})
