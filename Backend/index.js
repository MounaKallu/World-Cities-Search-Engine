var express = require('express');
var app = express();
var cors = require('cors');
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017';

app.use(cors({origin: '*'}));

// To get countries starting with a substring (CASE SENSITIVE)
// eg. http://localhost:8081/country/search?name=Ind <- Click after index.js is running
app.get('/country/search', (req, res) => {
    let name = req.query.name;

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');

        locations.aggregate([
            {
                '$match': {
                    'country': {
                        '$regex': new RegExp(`^${name}`, "i")
                    }
                }
            }, {
                '$group': {
                    '_id': {
                        'country': '$country',
                        'iso2': '$iso2',
                        'iso3': '$iso3'
                    }
                }
            }, {
                '$addFields': {
                    'country': '$_id.country',
                    'iso2': '$_id.iso2',
                    'iso3': '$_id.iso3'
                }
            }, {
                '$project': {
                    '_id': 0
                }
            }
        ]).toArray((err, docs) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs));
        });
    })
})

// To get country with cities under that country details as list using country name (EXACT STRING and CASE SENSITIVE)
// eg. http://localhost:8081/country?name=India&includeCities=true <- Click after index.js is running
//
// To get just country info using country name (EXACT STRING and CASE SENSITIVE)
// eg. http://localhost:8081/country?name=India&includeCities=false <- Click after index.js is running
app.get('/country', (req, res) => {

    let countryName = req.query.name;
    let includeCities = (req.query.includeCities == 'true');

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');
        locations.find({
            'country': {
                '$regex': new RegExp(`^${countryName}`, "i")
            }
        }).toArray((err, docs) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs));
        });
    })
})

// To get cities starting with a substring (CASE INSENSITIVE)
// eg. http://localhost:8081/city/search?name=New <- Click after index.js is running
app.get('/city/search', (req, res) => {
    let name = req.query.name;

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');

        locations.find({
            'city': {
                '$regex': new RegExp(`^${name}`, "i")
            }
        }).toArray((err, docs) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs));
        });
    })
})

// To get a city by id
// eg. http://localhost:8081/city/5fb47d6ebb369e908a3d7392 <- Click after index.js is running
app.get('/city/:id', (req, res) => {
    let id = req.params.id;

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');

        locations.findOne({
            '_id': mongodb.ObjectID(id)
        }, (err, doc) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(doc));
        })
    })
})

// To get nearby cities by city id
// eg. http://localhost:8081/nearby/5fb47d6ebb369e908a3d7392?maxDistance=20000 <- Click after index.js is running
app.get('/nearby/:id', (req, res) => {
    let id = req.params.id;
    let maxDistance = Number.MAX_VALUE
    let minDistance = 0

    lat = req.query.lat
    lng = req.query.lng

    if (req.query.maxDistance) {
        maxDistance = req.query.maxDistance
    }
    if (req.query.minDistance) {
        minDistance = req.query.minDistance
    }

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');

        locations.findOne({
            _id: mongodb.ObjectID(id)
        }, (err, doc) => {
            locations.find({
                geolocation: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [doc.lng, doc.lat]
                        },
                        $maxDistance: Number(maxDistance)
                    }
                }
            }).toArray((err, docs) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(docs));
            });
        });
    });
})

// To get nearby cities by lat and lng
// eg. http://localhost:8081/nearby?maxDistance=20000&lat=40.6943&lng=-73.9249 <- Click after index.js is running
app.get('/nearby', (req, res) => {
    lat = Number(req.query.lat)
    lng = Number(req.query.lng)

    let maxDistance = Number.MAX_VALUE
    let minDistance = 0

    if (req.query.maxDistance) {
        maxDistance = Number(req.query.maxDistance)
    }
    if (req.query.minDistance) {
        minDistance = Number(req.query.minDistance)
    }

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');

        locations.find({
            geolocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: Number(maxDistance)
                }
            }
        }).toArray((err, docs) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs));
        });
    });
});

// To update comments in a city by id
app.put('/comment/city/update/:id', (req, res) => {
    let id = req.params.id;
    let comment = req.query.comment;

    MongoClient.connect(url, (err, client) => {
        let locations = client.db("WorldCities").collection('Locations');

        locations.updateOne({
                '_id': mongodb.ObjectID(id)
            }
            , {
                $push:
                    {
                        comments: comment
                    }
            }
            , (err, doc) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(doc));
            })
    })
})


var server = app.listen(8081, () => {
    console.log(`World cities db listening on port 8081`)
})


