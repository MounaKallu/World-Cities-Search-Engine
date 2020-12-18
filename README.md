# World Cities DB

Stay in the root folder where you can see the folders `Backend`, `Frontend` and `data` and follow below steps.

## Database setup
* Install [MongoDB]("https://www.mongodb.com/try/download/community)
* Run the below commands to import csv file into mongo db and do initial db setup
```
mongoimport --db WorldCities --collection Locations --type CSV --file "./data/WorldCityLocations.csv" --headerline

mongo ./Database/setup.js
```

## Backend setup
You'll need the following:
* [Node.js](https://nodejs.org/en/download/)
* npm

You have to make sure that mongodb is running on port 27017 otherwise change the port accordingly in `./Backend/index.js`

Run the below commands:
```
cd Backend

npm install

node index.js
```

## Frontend setup
Just open `./Frontend/index.html` in a browser

