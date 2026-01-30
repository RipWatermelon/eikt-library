import './App.css'
import background from "./assets/librarybg.png";
import { useState } from "react";

const is_loggedin = true;

      const books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "Brave New World", author: "Aldous Huxley" },
  { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury" },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien" },
  { id: 5, title: "Crime and Punishment", author: "Fyodor Dostoevsky" }
];

  const [search, setSearch] = useState("");

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

function App() {
  return (
    <>
    { !is_loggedin && (
      <>
    <div className="bg" style={{ backgroundImage: `url(${background})` }}></div>
      <div className="mainglass">
        <h1>Ienākt</h1>
        <form action=" ">
         <label htmlFor="email">E-pasts:</label>
          <input type="text" id="email" name="email" /><br /><br />

          <label htmlFor="password">Parole:</label>
          <input type="password" id="password" name="password" /><br /><br />



          <input className="button" type="submit" value="Submit" />
        </form>
    </div>
    </>
    )}

       { is_loggedin && (
      <>
    <div>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filteredBooks.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> — {book.author}
          </li>
        ))}
      </ul>
    </div>
{/*
    <div className="bg" style={{ backgroundImage: `url(${background})` }}></div>
      <div className="mainglass">
        <h1>Panelis</h1>
        <form action=" ">
         <label htmlFor="text">Grāmatas nosaukums:</label>
          <input type="text" id="bookname" name="bookname" /><br /><br />
          <input className="button" type="submit" value="Submit" />
        </form>
    </div>*/}
    </>
    
    )}
    </>
  )
}

export default App
