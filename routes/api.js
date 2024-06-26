'use strict';
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const Book = mongoose.model('Book', new mongoose.Schema({
  title: String,
  commentcount: Number,
  comments: Array
}));

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      const books = await Book.find();
      res.json(books);
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        res.send('missing required field title');
        return;
      }
      const newBook = new Book({
        title,
        commentcount: 0,
        comments: []
      });
      const _id = newBook._id.toString();
      await newBook.save();
      res.json({
        _id,
        title
      });
    })
    
    .delete(async (req, res) => {
      await Book.deleteMany({});
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      if (!bookid) {
        res.send('missing required field _id');
        return;
      }
      if (!mongoose.isValidObjectId(bookid)) {
        res.send('no book exists');
        return;
      }
      const book = await Book.findById({_id: bookid});
      if (!book) {
        res.send('no book exists');
        return;
      }
      res.json({
        _id: book._id,
        title: book.title,
        commentcount: book.commentcount,
        comments: book.comments
      });
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!bookid) {
        res.send('missing required field _id');
        return;
      }
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      if (!mongoose.isValidObjectId(bookid)) {
        res.send('no book exists');
        return;
      }
      const book = await Book.findById({_id: bookid});
      if (!book) {
        res.send('no book exists');
        return;
      }
      book.comments.push(comment);
      book.comments.commentcount = book.comments.commentcount + 1;
      await book.save();
      res.json({
        _id: book._id,
        title: book.title,
        commentcount: book.commentcount,
        comments: book.comments
      });
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      if (!bookid) {
        res.send('missing required field _id');
        return;
      }
      if (!mongoose.isValidObjectId(bookid)) {
        res.send('no book exists');
        return;
      }
      const book = await Book.findById({_id: bookid});
      if (!book) {
        res.send('no book exists');
        return;
      }
      await Book.deleteOne({_id: bookid});
      res.send('delete successful');
    });
};
