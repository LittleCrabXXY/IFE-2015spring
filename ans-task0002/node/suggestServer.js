// 输入提示框服务器端

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 8080;
var ROOT = '../';

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
        var body = [];
        request.on('data', function(chunk) {
            body.push(chunk);
        }).on('end', function() {
            body = JSON.parse(body);
            if (body.target === 'suggest') {
                // console.log('body.text = ' + body.text);
                response.end('Simon,Erik,Kener');
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
