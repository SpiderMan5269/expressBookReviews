const express = require('express');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  getBooksAsync()
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
});

function getBooksAsync() {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books, null, 4));
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookByIsbnAsync(isbn)
    .then(bookRecord => {
      return res.send(bookRecord);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
});

function getBookByIsbnAsync(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book Wasn't Found");
    }
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  getBookByAuthorAsync(author)
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
});

function getBookByAuthorAsync(author) {
  return new Promise((resolve, reject) => {
    const booksExist = Object.values(books).filter(book => book.author == author);
    if (booksExist.length > 0) {
      resolve(booksExist);
    } else {
      reject("Book Wasn't Found");
    }
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  getBookByTitleAsync(title)
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })

});

function getBookByTitleAsync(title) {
  return new Promise((resolve, reject) => {
    const booksExist = Object.values(books).filter(book => book.title == title);
    if (booksExist.length > 0) {
      resolve(booksExist);
    } else {
      reject("Book Wasn't Found");
    }
  });
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookRecord = books[isbn];
  return res.send(bookRecord ? bookRecord.reviews : "Book Wasn't Found");
});

module.exports.general = public_users;
