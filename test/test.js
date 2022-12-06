const request = require('supertest');
const app = require('../app.js');
describe('GET /', function() {
 it('respond with access refuzat', function(done) {
     request(app).get('/').expect(401, done)
 });
});
