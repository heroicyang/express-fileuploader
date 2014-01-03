express-fileuploader
===================

Easy to use generic file uploader for Express.

## Install

```bash
npm install express-fileuploader --save
```

## Usage

```javascript
var http = require('http');
var express = require('express');
var mutilpart = require('connect-multiparty');
var uploader = require('express-fileuploader');

var app = express();
app.use('/upload/image', mutilpart());

uploader.use(new uploader.LocalStrategy({
  uploadPath: '/uploads',
  domain: 'http://127.0.0.1:8000'
}));

app.post('/upload/image', function(req, res, next) {
  uploader.upload('local', req.files['images'], function(err, files) {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify(files));
  });
});

http.createServer(app).listen(8000);
```

## Plugins / Strategies

- [Qiniu](https://github.com/heroicyang/express-uploader-qiniu)   Upload files to Qiniu
- [S3](https://github.com/heroicyang/express-uploader-s3)      Upload files to S3
