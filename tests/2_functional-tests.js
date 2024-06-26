/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const ObjectId = require('mongoose').Types.ObjectId;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  suite('Routing tests', function() {
    const bookids = [];
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        chai.request(server).keepOpen()
          .post('/api/books')
          .send({
            title: 'test book one'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'test book one');
            assert.property(res.body, '_id');
            bookids.push(res.body._id.toString());
            done();
          });
      });
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server).keepOpen()
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books',  function(done){
        chai.request(server).keepOpen()
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server).keepOpen()
          .get('/api/books/hf0ue2')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server).keepOpen()
          .get('/api/books/' + bookids[0])
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.equal(res.body._id, bookids[0]);
            assert.property(res.body, 'title');
            assert.property(res.body, 'commentcount');
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + bookids[0])
          .send({
            comment: 'this is a test comment'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.equal(res.body._id, bookids[0]);
            assert.property(res.body, 'title');
            assert.property(res.body, 'commentcount');
            assert.isArray(res.body.comments);
            assert.isTrue(res.body.comments.includes('this is a test comment'));
            done();
          });
      });
      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server).keepOpen()
          .post('/api/books/' + bookids[0])
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server).keepOpen()
          .post('/api/books/jf923jf')
          .send({
            comment: 'this is a test comment'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server).keepOpen()
        .delete('/api/books/' + bookids[0])
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server).keepOpen()
          .delete('/api/books/j0fi1we')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});
