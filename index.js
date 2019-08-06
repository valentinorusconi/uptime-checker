/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/\+|\/+$/g, '');

  const queryStringObject = parsedUrl.query;

  const method = req.method.toLowerCase();
  const headers = req.headers;

  const decoder = new StringDecoder('utf8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    const chosenHandler = typeof(router[trimmedPath] !== 'undefined' ? router[trimmedPath]: handlers.notFound);
    
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object' ? payload : {};
      const paylaodString = JSON.stringify(payload);
      res.writeHead(statusCode);
      res.end(paylaodString);
      console.log('response: ',statusCode,paylaodString);
    });

    res.end('Hello World \n');
    console.log('payload', buffer);
  });

});

server.listen(3000, () => {
  console.log('The sever is up on Port 3000');
});


var handlers = {
  sample: function(data, callback) {
    callback(406, {'name': 'sample handler' });

  },
  notFound: function(data, callback) {
    callback(404);
  }
};


const router = {
  '/sample': handlers.sample
}