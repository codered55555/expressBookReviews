const { default: axios } = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  }
 });
  
// Get books details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let items = Object.keys(books).map((key) => {return books[key]})
  .filter((book) => book.author === author);
  res.send(JSON.stringify({items}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let items = Object.keys(books).map((key) => {return books[key]})
  .filter((book) => book.title === title);
  res.send(JSON.stringify({items}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }
});



// Asynchronous book details retrieval by using Promise and async
// ==========================================================

// [ASYNC] Get the book list available in the shop - Using async callback function
public_users.get('/async/',function (req, res) {
  const url = 'http://localhost:5000/';
  const request = axios.get(url);
    request.then(resp => {
      res.send(resp.data);
    })
  .catch(err => {
      res.send(err);
  });
});



// [ASYNC] Get book details based on ISBN - Using Promises
   public_users.get('/async/:isbn',function (req, res) {
    new Promise((resolve,reject)=>{
      const isbn = req.params.isbn;
      try {
         const data = JSON.stringify(books[isbn], null, 4);
         resolve(res.send(data));
      } catch(err) {
          reject(res.send(err));
      }});
   });

// [ASYNC] Get books details based on author - Using Promises
   public_users.get('/async/:author',function (req, res) {
    new Promise((resolve,reject)=>{
      const author = req.params.author;
      try {
         const items = Object.keys(books).map((key) => {return books[key]})
         .filter((book) => book.author === author);
         const data = JSON.stringify({items}, null, 4);
         resolve(res.send(data));
      } catch(err) {
          reject(res.send(err));
      }});
   });

// [ASYNC] Get all books based on title - Using Promises
   public_users.get('/async/:title',function (req, res) {
    new Promise((resolve,reject)=>{
      const title = req.params.title;
      try {
         let items = Object.keys(books).map((key) => {return books[key]})
         .filter((book) => book.title === title);
         const data = JSON.stringify({items}, null, 4);
         resolve(res.send(data));
      } catch(err) {
          reject(res.send(err));
      }});
   });


module.exports.general = public_users;
