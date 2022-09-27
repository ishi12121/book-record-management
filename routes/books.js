const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

// const BookModel = required('../models/book-model')
// const UserModel = reuqired('../models/user-model')

const { UserModel, BookModel } = require("../models");

const { getAllBooks, getSingleBookById, gettAllIssuedBooks, addNewBook, updateBookById, getSingleBookByName } = require("../controllers/book-controller");

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * parameters: None
 */

router.get("/",getAllBooks);

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * parameters: id
 */

router.get("/:id", getSingleBookById);

router.get("/getbook/name/:name", getSingleBookByName);

/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * parameters: none
 */
router.get("/issued/by-user", gettAllIssuedBooks);



/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * parameters: none
 * data: author,name,genre,price,publisher,id
 */

router.post("/",addNewBook);

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update book
 * Access: Public
 * parameters: id
 * data: author,name,genre,price,publisher,id
 */

router.put("/:id",updateBookById);

/**
 * Route: /books/issued/with-fine
 * Method: GET
 * Description: Get issued book with fine
 * Access: Public
 * parameters: none

 */

router.get("/issued/with-fine", (req, res) => {
  const usersWithIssuedBooksWithFine = users.filter((each) => {
    if (each.issuedBook) return each;
  });

  const issuedBooksWithFine = [];

  usersWithIssuedBooksWithFine.forEach((each) => {
    const book = books.find((book) => book.id === each.issuedBook);

    book.issuedBy = each.name;
    book.issuedDate = each.issuedDate;
    book.returnDate = each.returnDate;

    const getDateInDays = (data = "") => {
      let date;
      if (data === "") {
        date = new Date();
      } else {
        date = new Date(data);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24)); // we use 1000 to convert it in milliseconds

      return days;
    };

    let returnDate = getDateInDays(each.returnDate);
    let currentDate = getDateInDays();

    if (returnDate < currentDate) {
      issuedBooksWithFine.push(book);
    }
  });

  if (issuedBooksWithFine.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No books with fine",
    });
  }

  return res.status(200).json({
    success: true,
    Data: issuedBooksWithFine,
  });
});

//default export
module.exports = router;
