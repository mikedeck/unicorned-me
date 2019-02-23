const assert = require('assert');
const http = require('http');
const axios = require('axios');

const requestHandler = (request, response) => {
    console.log(request.url);
    response.end('Hello Node.js Server!');
}
  
const server = http.createServer(requestHandler);

before(() => {
    server.listen(8080, (err) => {
        if (err) {
            return console.log('something bad happened', err);
        }

        console.log(`server is listening on 8080`);
    });
});

describe('HTTP', function() {
  describe('server', function() {
    it('should return 200', function() {
        return axios.get('http://localhost:8080/test')
            .then((response) => {
                assert(response.status, 200);
            });
      
    });
  });
});

after(() => {
    server.close();
});