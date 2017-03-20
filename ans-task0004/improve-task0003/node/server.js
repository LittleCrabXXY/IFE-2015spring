// just for local performance test

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var ROOT = './ans-task0004/improve-task0003/';

http.createServer(function(request, response) {
    request.on('error', function(err) {
        console.error(err);
        response.statusCode = 400;    // Bad Request
        response.end();
    });
    response.on('error', function(err) {
        console.error(err);
    });
    if (request.method === 'GET') {
        var pathname = url.parse(request.url).pathname;
        fs.readFile(path.join(ROOT, pathname), function(err, file) {
            if (err) {
                console.error(err);
                response.statusCode = 404;
                response.end('Not Found');
            } else {
                response.end(file);
            }
        });
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(8080, 'localhost');