const Author = require("../models/author");
const async = require("async");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");


// Display list of all Authors.
exports.author_list = function (req, res, next) {
    Author.find()
      .sort([["family_name", "ascending"]])
      .exec(function (err, list_authors) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("author_list", {
          title: "Author List",
          author_list: list_authors,
        });
      });
  };
  

// Display detail page for a specific Author.
// Display detail page for a specific Author.
exports.author_detail = (req, res, next) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.params.id).exec(callback);
        },
        authors_books(callback) {
          Book.find({ author: req.params.id }, "title summary").exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          // Error in API usage.
          return next(err);
        }
        if (results.author == null) {
          // No results.
          const err = new Error("Author not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render.
        res.render("author_detail", {
          title: "Author Detail",
          author: results.author,
          author_books: results.authors_books,
        });
      }
    );
  };
  

// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
    res.render("author_form", { title: "Create Author" });
  };
  

// Handle Author create on POST.
exports.author_create_post = [
    (req, res, next) => {

      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    },
  ];
  

// Display Author delete form on GET.
exports.author_delete_get = (req, res, next) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.params.id).exec(callback);
        },
        authors_books(callback) {
          Book.find({ author: req.params.id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.author == null) {
          // No results.
          res.redirect("/catalog/authors");
        }
        // Successful, so render.
        res.render("author_delete", {
          title: "Delete Author",
          author: results.author,
          author_books: results.authors_books,
        });
      }
    );
  };
  

// Handle Author delete on POST.
exports.author_delete_post = (req, res, next) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.body.authorid).exec(callback);
        },
        authors_books(callback) {
          Book.find({ author: req.body.authorid }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        // Success
        if (results.authors_books.length > 0) {
          // Author has books. Render in same way as for GET route.
          res.render("author_delete", {
            title: "Delete Author",
            author: results.author,
            author_books: results.authors_books,
          });
          return;
        }
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, (err) => {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/catalog/authors");
        });
      }
    );
  };
  
// Display Author update form on GET.
exports.author_update_get = (req, res) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.params.id).exec(callback)
        }
      },
      (err, results) => {
        res.render("author_form", {
          title: "Update Author",
          author: results.author
        })
      }
    )
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    })

    Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
        res.redirect("/catalog/authors")
    })
};
