conn = new Mongo('mongodb://localhost:27017');
db = conn.getDB("WorldCities");

print('Updating all collections with geolocation...')
db.Locations.find({}).forEach(element => {
    db.Locations.update({
        _id: element._id
    },
    {
        $set: {
            geolocation: {
                type: "Point",
                coordinates: [element.lng, element.lat]
            }
        },
        $unset: {
            loc: ""
        }
    });
});

db.Locations.createIndex( { geolocation : "2dsphere" } );