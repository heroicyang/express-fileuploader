express-fileuploader
===================

[![Build Status](https://travis-ci.org/heroicyang/express-fileuploader.png)](https://travis-ci.org/heroicyang/express-fileuploader]) [![Coverage Status](https://coveralls.io/repos/heroicyang/express-fileuploader/badge.png)](https://coveralls.io/r/heroicyang/express-fileuploader)  [![Dependency Status](https://gemnasium.com/heroicyang/express-fileuploader.png)](https://gemnasium.com/heroicyang/express-fileuploader)

Easy to use generic file uploader for Express.

## Features

- **Automatically delete temporary files**
- **Plugable**
- **Custom strategy**
- **Growing number of strategies**

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

Strategy | Description
--- | ---
[QiniuStrategy](https://github.com/heroicyang/express-fileuploader-qiniu) | Upload files to [Qiniu](http://www.qiniu.com/)
[S3Strategy](https://github.com/heroicyang/express-fileuploader-s3) | Upload files to [Amazon S3](http://aws.amazon.com/s3/)
[DropboxStrategy](https://github.com/heroicyang/express-fileuploader-dropbox) | Upload files to [Dropbox](https://www.dropbox.com/)

## Custom strategy

```javascript
var Strategy = require('express-fileuploader').Strategy;
var CustomStrategy = Strategy.extend({
  name: 'custom',
  constructor: function(options) {
    options = options || {};
    this.uploadPath = options.uploadPath;
    this.options = options.options || {};
  },
  // override upload method
  upload: function(file, callback) {
    // file process logic
  }
});

// publish to npm, named `express-fileuploader-test ` for example

// install
npm install express-fileuploader-test --save

// use
var uploader = require('express-fileuploader');
var CustomStrategy = require('express-fileuploader-test');
uploader.use('custom', new CustomStrategy({
  uploadPath: '/uploads',
  options: {
    bucket: 'test'
  }
}));

// upload
uploader.upload('custom', req.files['images'], function(err, files) {
  // uploaded
});
```

An example: https://github.com/heroicyang/express-fileuploader/blob/master/lib/strategies/local.js

##License

The MIT License (MIT)

Copyright (c) 2013 Heroic Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
