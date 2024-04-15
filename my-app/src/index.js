import { configureStore } from "@reduxjs/toolkit";

const initialState = [];
let recordState = []; // Initialize recordState
const reducer = function (state = initialState, action) {
  switch (action.type) {
    case "addBook":
      console.log(state);
      console.log(action);
      return [
        ...state,
        {
          bookId: action.info.bookId,
          bookName: action.info.bookName
        }
      ];
    case "delBook":
      return [];
    default:
      return [...state];
      break;
  }
};

const store = configureStore({
  reducer: {
    books: reducer,
  },
});

const root = document.getElementById("app");
const addBook = document.getElementById("addBook");
const delBook = document.getElementById("delBook");
const bookList = document.getElementById("bookList");

if (addBook && delBook && bookList) {
  const addBookBtn = document.createElement("button");
  const bookNameInput = document.createElement("input");
  const delBookBtn = document.createElement("button");
  const bookIDInput = document.createElement("input");

  addBookBtn.innerText = "ADD BOOK";
  delBookBtn.innerText = "DEL BOOK";

  addBookBtn.addEventListener("click", addBookFn);
  delBookBtn.addEventListener("click", delBookFn);

  function* generateId() {
    let id = 0;
    while (true) {
      yield id++;
    }
  }
  const genId = generateId();
  const genBookId = () => genId.next().value;

  function addBookFn() {
    const bookName = bookNameInput.value;
    if (bookName) {
      const bookId = genBookId();
      console.log("Added Book:", { id: bookId, name: bookName });
     
      bookNameInput.value = "";
      const action={
        type:"addBook",
        info:{
          bookId:bookId,
          bookName: bookName
        }
      };
      store.dispatch(action);
    }
  }

  function delBookFn() {
    // Dispatch action for deleting book
    store.dispatch({ type: "delBook" });
  }

  addBook.appendChild(bookNameInput);
  addBook.appendChild(addBookBtn);
  delBook.appendChild(bookIDInput);
  delBook.appendChild(delBookBtn);
} else {
  console.error(
    "One or both of the elements with IDs 'addBook', 'delBook', or 'bookList' were not found in the DOM."
  );
}

// Subscription callback to update book list
const showNewList = store.subscribe(() => {
  const currentState = store.getState().books; // Ensure we're accessing the books slice of the state
  if (currentState.length !== recordState.length) {
    bookList.innerHTML = ""; // Clear existing book list
    currentState.forEach(info => {
      bookList.appendChild(createBookList(info));
    });
    recordState = currentState.slice(); // Update record state by creating a shallow copy
  }
});


function createBookList(info) {
  const element = document.createElement('li');
  element.innerText = `BookID:${info.bookId} BookName:${info.bookName}`;
  return element;
}
