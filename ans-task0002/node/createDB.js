// [!] run createDB.js before testing the input prompt box

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var dbUrl = 'mongodb://localhost:27017/ife2015spring-task0002';

// documents to insert
var documents = [{
    keyword: 'test'
}, {
    keyword: 'html'
}, {
    keyword: 'css'
}, {
    keyword: 'javascript'
}, {
    keyword: 'java'
}];

var insertDocuments = function(db, callback) {
    // get the collection
    var collection = db.collection('keywords');
    collection.find().count(function(err, count) {
        assert.equal(err, null);
        if (count === 0) {
            // insert documents
            collection.insertMany(documents, function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 5);
                console.log("Inserted 5 documents into the collection");
            });
        } else {
            console.log('Documents already exist');
        }
        callback();
    });
};

// Use connect method to connect to the server
mongoClient.connect(dbUrl, function(err, db) {
    assert.equal(err, null);
    console.log("Connected successfully to server");

    insertDocuments(db, function() {
        db.close();
    });
});