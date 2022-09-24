const express = require('express');
const {books} = require('../data/books.json');
const {users} = require('../data/users.json');
const router  = express.Router();


/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * parameters: None
 */

router.get('/',(req,res) => {
    res.status(200).json({ success: true, data: books });

});


/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * parameters: id
 */

 router.get('/:id',(req,res) => {
   const {id} = req.params;

   const book = books.find((each) => each.id === id);

   if(!book) return res.status(404).json({
    success: false,
    message: "Book not found",




   });

   return res.status(200).json({
    success: true,
    data: book,

   });

});



/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * parameters: none
 */
router.get('/issued/by-user',(req,res) => {
    const usersWithIssuedBooks = users.filter((each) => {
        if(each.issuedBook) return each;

    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
     
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

   if(issuedBooks.length === 0)
   return res.status(404).json({
    success: false,
    message: "No books issued yet",
   });

   return res.status(200).json({
    success: true,
    data: issuedBooks,
   });
});


/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * parameters: none
 * data: author,name,genre,price,publisher,id
 */

router.post('/', (req,res) => {
    const {data} = req.body;

    if(!data) {
        return res.status(400).json({
            success: false,
            message: "No data provided",

    });

    }

    const book = books.find((each) => each.id === data.id);

    if(book){
        return res.status(404).json({
            success: false,
            message: "book already exist with this id , please use a unique id",

        });

    }

    const allbooks = [...books, data];

    return res.status(201).json({
        success: true,
        data: allbooks,

    });
    
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update book
 * Access: Public
 * parameters: id
 * data: author,name,genre,price,publisher,id
 */

router.put('/:id', (req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each) => each.id === id);

    if(!book){
        return res.status(400).json({
            success: false,
            message: "book not found with this particular id",

        });

    }

    const updateData = books.map((each) => {
        if(each.id === id){
            return { ...each, ...data};

        }
        return each;

    });
    return res.status(200).json({
        success: true,
        data: updateData,
    });

});

/**
 * Route: /books/issued/with-fine
 * Method: GET
 * Description: Get issued book with fine
 * Access: Public
 * parameters: none

 */

router.get("/issued/with-fine", (req,res) => {
    const usersWithIssuedBooksWithFine = users.filter((each) => {
        if(each.issuedBook) return each;
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
            let days = Math.floor(
                date / (1000*60*60*24));  // we use 1000 to convert it in milliseconds

                return days;
        };

            let returnDate = getDateInDays(each.returnDate);
            let currentDate = getDateInDays();

            if (returnDate < currentDate){
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
            })


    
                                              
});

//default export
module.exports = router;