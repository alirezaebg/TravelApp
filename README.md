# TravelApp
This project develops a website that can be used to choose a destination and find relevant travel information pertaining to that
location.

## Deployment
Using Heroku cloud platform, the app url is:
https://secure-dusk-26305.herokuapp.com/

## How to use
On https://secure-dusk-26305.herokuapp.com/
1. Enter a destination
2. Choose the departue and return dates
3. Press '+Add to list'
4. Repeat steps 1-3 if you want to add more locations
5. Press 'View my list' to view/remove your chosen destinations
6. Press 'Travel info >>' to proceed to the '/travelInfo' endpoint

On https://secure-dusk-26305.herokuapp.com/travelInfo
1. Press 'Weather info' to check the relevant weather information
2. Press 'Hotel info' to check the relevant hotel information (not completed yet)
3. Press' Remove trip' if you wish to remove your selection
4. You can return back to the homepage at all times by pressing 'Return to home' link on top of the page

## Quick start
Follow these commands on terminal ro run the app locally. Please note that the API keys are confidential and have not been provided. 
Therefore, API calls are not functioning unless you use your own API keys and store them in a '.env' file.

```java
1. npm install
2. npm run build-prod
3. npm start
```
Make sure Node.js is installed already. The program will be running on port 3000.

## List of APIs used
1. Google Places
2. Pixabay
3. Geonames
4. Weatherbit.io

## Tools/Libraries

1. Boostrap
2. jQuery
3. Node.js and express
4. Webpack @4.43
5. localStorage

## Testing (using Jest)
Install Jest:
```python
npm i jest --save-dev
```
Also, install the following packages:
```python
npm instal supertest --save-dev
yarn add --dev fetch-mock
```
Be sure to install yarn prior to running the above command.

Run tests:
```python
npm test
```

## Author
Dr. Alireza Ebadi Ghajari (Ph.D. Simon Fraser University 2017)

