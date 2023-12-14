//Importing the modules needed to run this
const express = require("express");
const fs = require("fs").promises;

//Declaring the app and saying we'll be using express
const app = express();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

//The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads
app.use(express.json());

//Start of the helper functions

const addBook = async (title, author, available) => {
  const bookArray = await fs.readFile("../data/book.json", "utf8");
  const bookList = JSON.parse(bookArray);
  const newBook = { title: title, author: author, available: available };
  bookList.push(newBook);
  const jsonAddBook = JSON.stringify(bookList, null, 2);
  await fs.writeFile("../data/book.json", jsonAddBook);
};

//This function accesses all books in the data file
//Using async-await gives the program time to get the data and be ready for these functions - otherwise, they would run immediately, before anything else, and return "undefined" as it wouldn't know there's a database just yet
const getBooks = async () => {
  const books = await fs.readFile("../data/book.json", "utf8");
  return books;
};

const getBook = async (id) => {
  const number = Number(id);
  const data = await fs.readFile("../data/book.json", "utf8");
  return JSON.parse(data)[number];
};

const updateBook = async (id, title, author, available) => {
  const number = Number(id);
  const data = await fs.readFile("../data/book.json", "utf8");
  const bookArray = JSON.parse(data);
  const updatedBook = { title: title, author: author, available: available };
  bookArray[number] = updatedBook;
  const jsonUpdatedList = JSON.stringify(bookArray, null, 2);
  await fs.writeFile("../data/book.json", jsonUpdatedList);
};

const deleteBook = async (id) => {
  const number = Number(id);
  const data = await fs.readFile("../data/book.json", "utf8");
  const books = JSON.parse(data).filter((book, i) => i !== number);
  const jsonBooks = JSON.stringify(books, null, 2);
  await fs.writeFile("../data/book.json", jsonBooks);
};

//API CALLS

app.post("/add-book", async (req, res) => {
  await addBook(req.body.title, req.body.author, req.body.available);
  res
    .status(201)
    .json("You wrote a book! Congratulations - it's now in the library!");
});

app.get("/book-list", async (req, res) => {
  const bookList = await getBooks();
  res.send(bookList);
});

app.get("/book/:id", async (req, res) => {
  const book = await getBook(req.params.id);
  res.send(book);
});

app.put("/update-book/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const author = req.body.author;
  const available = req.body.available;
  await updateBook(id, title, author, available);
  res.status(201).json(`${title} is now updated`);
});

app.delete("/delete/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await fs.readFile("../data/book.json", "utf8");
  const jsonData = JSON.parse(data);
  const name = jsonData[id]["title"];
  console.log(name);
  await deleteBook(id);
  res
    .status(201)
    .json(
      `${name} is now deleted. Sadly, Moms for Liberty have won this case. But don't worry, it's still in the secret library that they'll never ever find.`
    );
});
