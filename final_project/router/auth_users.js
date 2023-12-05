const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let loggedUser = "";

const isValid = (username, password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login

regd_users.post("/login", (req,res) => {  
  const username = req.query.username;
  const password = req.query.password;

  if(!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if(isValid(username, password)) {
  
  let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
  }
  loggedUser = username;
  return res.status(200).send("User successfully logged in");  
  } else {
   return res.status(208).json({msessage: "Invalid login. Check username and password"});
}
});


// Add a book review
regd_users.put("/auth/review", (req, res) => {
  const isbn = req.query.isbn;
  const review = req.query.review;

  curReviews = books[isbn].reviews;
  var newReviews = {};

  Object.keys(curReviews).map((key) => {  
    newReviews[key] = curReviews[key]; });

  newReviews[loggedUser] = review;
  books[isbn].reviews = newReviews;

  return res.send("Your review has been added!\nUser: " + loggedUser + "\nReview: " + review);
});


// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  var curReviews = books[isbn].reviews;
  var newReviews = {};

  Object.keys(curReviews).map((key) => {  
    if(key != loggedUser) {
      newReviews[key] = curReviews[key]; 
    }
  });
  books[isbn].reviews = newReviews;

  return res.send("Your review has been deleted!");

});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
