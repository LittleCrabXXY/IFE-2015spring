// server for input prompt box
// [!] run createDB.js before testing the input prompt box

// Node.js v4.4.5
// npm v2.15.5
// MongoDB Server v3.2
// MongoDB Driver for Node.js v2.2.11

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 8080;
var ROOT = './ans-task0002';

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/ife2015spring-task0002';

var findDocuments = function(db, filter, callback) {
    var collection = db.collection('keywords');
    collection.find(filter).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

http.createServer(function(request, response) {
    request.on('error', function(err) {
        console.error(err);
        response.statusCode = 400;
        response.end('Bad Request');
    });
    response.on('error', function(err) {
        console.error(err);
    });
    if (request.method === 'GET') {
        var pathname = url.parse(request.url).pathname;
        fs.readFile(path.join(ROOT, pathname), function(err, file) {
            if (err) {
                // console.error(err);
                response.statusCode = 404;
                response.end('Not Found');
            } else {
                response.end(file);
            }
        });
    } else if (request.method === 'POST') {
        var reqBody = [];
        request.on('data', function(chunk) {
            reqBody.push(chunk);
        }).on('end', function() {
            reqBody = JSON.parse(reqBody);
            if (reqBody.target === 'suggest') {
                // connect to the server of mongodb
                mongoClient.connect(dbUrl, function(err, db) {
                    assert.equal(err, null);
                    // Regular Expression with variable
                    var regExp = new RegExp('^' + reqBody.text, 'gi');
                    var filter = {
                        'keyword': regExp
                    };
                    findDocuments(db, filter, function(docs) {
                        db.close();
                        var resBody = [];
                        for (var i = 0; i < docs.length; i++) {
                            resBody.push(docs[i].keyword);
                        }
                        resBody = resBody.join();
                        response.end(resBody);
                    });
                });
            } else {
                response.statusCode = 501;
                response.end('Not Implemented');
            }
        });
    } else {
        response.statusCode = 501;
        response.end('Not Implemented');
    }
}).listen(port, hostname);
