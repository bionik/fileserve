/*jshint esversion: 6 */

const formidable = require('formidable');
const http = require('http');
const fs = require('fs');

const upload_folder = 'uploads';

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'application/json'});

      fs.readdir(upload_folder, (err, files) => {
        var response = {'status': 'OK', 'files': files};
        res.end(JSON.stringify(response));
      });

    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );

}).listen(8080);
