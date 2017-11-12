/*jshint esversion: 6 */
const formidable = require('formidable');
const http = require('http');
const fs = require('fs');
const util = require('util');

const upload_folder = 'uploads';

try {
  fs.lstatSync(upload_folder).isDirectory();
} catch(e){
   if(e.code == 'ENOENT'){
    console.log('ERROR: Upload directory does not exist!');
    return false;
   }
}

http.createServer(function(req, res) {
  //Check if there is a POST to /upload
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    console.log('Processing POST to /upload');
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      var file = files.upload;

      res.writeHead(200, {'content-type': 'application/json'});

      console.log('Trying to move '+file.path+' to '+upload_folder+'/'+file.name);

      fs.rename(file.path, upload_folder+'/'+file.name, function(err){
        if(err){
          console.log('ERROR: Move failed');
          res.end(JSON.stringify({'status': 'FAIL'}));
          return;
        }

        console.log('File move succeeded');

        fs.readdir(upload_folder, function(err, files){
          res.end(JSON.stringify({'status': 'OK', 'files': files}));
        });

      });
    });

    return;
  }

  //Show the default page
  fs.readFile('index.html', 'utf8', function (err, data) {
    if(err){
      console.log('ERROR: index.html cannot be read!');
      res.writeHead(404, {'content-type': 'text/html'});
      res.end('404');
      return false;
    }
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(data);
  });

}).listen(8080);