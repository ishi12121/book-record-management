const { BookModel, UserModel } = require("../models");


exports.getAllBooks = async(req, res) => {
    const { id } = req.params;
    const book = await BookModel.findById(id);


    if(books.lenghth === 0)
    return res.status(404).json({
        success: false,
        message: "No book found",
    });

    res.status(200).json({
        success: true,
        data: books,
    });
};

exports.getSingleBookById = async (req, res) => {
    const { id } = req.params;

    const book = await BookModel.findById(id);

    if (!book)
    return res.status(404).json({
        success: false,
        message: "Book not found",
    });

   return res.status(200).json({
    success: true,
    data: book,

   });
};

exports.gettAllIssuedBooks = async (req, res) => {
    const users = await UserModel.find({
        issuedBook : {$exists: true},
    }).populate("issuedBook");

    const issuedBooks = users.map((each) => new IssuedBook(each));


    if (issuedBooks.length === 0)
      return res.status(404).json({
        success: false,
        message: "No books issued yet",
      });
  
    return res.status(200).json({
      success: true,
      data: issuedBooks,
    });
  };