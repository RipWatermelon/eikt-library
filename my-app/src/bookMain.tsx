import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import background from "./assets/librarybg.png";

type User = {
  id: number;
  username: string;
  password?: string;
  role: "user" | "admin" | string;
};

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
};

type Borrowed = {
  id: number;
  userId: number;
  bookId: number;
};

const usersDB: User[] = [
  { id: 1, username: "user", password: "1234", role: "user" },
  { id: 2, username: "admin", password: "admin", role: "admin" }
];

const initialBooksDB: Book[] = [
  { id: 1, title: "Ziemassvētku paltuss", author: "Račs Guntars", available: true },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", available: false },
  { id: 3, title: "Pasaka par žurķi Frici", author: "Ingrīda Bērziņa", available: true },
  { id: 4, title: "Bīstamā skola", author: "Volkinšteine, Zane", available: true },
  { id: 5, title: "Var krist arī augšup", author: "Meierhofs, Joahims", available: true },
  { id: 6, title: "Laimes pieskārieni", author: "Bērziņa, Ruta", available: true },
  { id: 7, title: "Sudrabs", author: "Šmite, Linda", available: true },
  { id: 8, title: "Es nemiršu nekad", author: "Jundze, Arno", available: true },
  { id: 9, title: "Āpsēns Pēcis un svešinieki", author: "Staka, Agija", available: true },
  { id: 10, title: "Kārumpasakas un vērtīgu konfekšu receptes", author: "Margeviča, Liene", available: true },
  { id: 11, title: "Trīs kapibaras grib zināt", author: "Bērs, Mateuss", available: true }
];

//simple login part
function Login({ onLogin }: { onLogin: (u: string, p: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onLogin(username, password);
  }

  return (
    <><div className="bg" style={{ backgroundImage: `url(${background})` }}></div><div className="mainglass">
    <form onSubmit={submit}>
      <h2 className="loginTitle" >Lūdzu pierakstaties</h2>
      <div>
        <label>Segvārds</label>
        <input value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Parole</label>
        <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Ienākt
      </button>
    </form>
    </div>
    </>
  );
}

function BookList(props: {
  books: Book[];
  search: string;
  user: User;
  borrowed: Borrowed[];
  onBorrow: (bookId: number) => void;
  onReturn: (bookId: number) => void;
  onRemove: (bookId: number) => void;
}) {
  const { books, search, user, borrowed, onBorrow, onReturn, onRemove } = props;

  

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <ul>
        {filtered.map(b => (
          <li className="booktitle" key={b.id}>
            <strong >{b.title}</strong> — {b.author} {b.available ? "(pieejama)" : "(paņemta)"}
            {b.available ? (
              <button className="borrowButton" onClick={() => onBorrow(b.id)}>Aizņemties</button>
            ) : (
              borrowed.some(x => x.bookId === b.id && x.userId === user.id) ? (
                <button className="borrowButton" onClick={() => onReturn(b.id)}>Atgriezt</button>
              ) : null
            )}
            {user.role === "admin" && <button className="deleteButton" onClick={() => onRemove(b.id)}>Izdzēst</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPanel({ onAdd }: { onAdd: (title: string, author: string) => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title || !author) return;
    onAdd(title, author);
    setTitle("");
    setAuthor("");
  }

  return (
      <><div className="mainglass">
          <form onSubmit={submit}>
              <h3>Admin panelis</h3>
              <input placeholder="Grāmatas nosaukums" style={{marginBottom:"10px"}} value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              <input placeholder="Autors" value={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} />
              <button type="submit">Pievienot grāmatu</button>
          </form>
      </div></>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>(initialBooksDB);
  const [borrowed, setBorrowed] = useState<Borrowed[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const item = localStorage.getItem("books");
    if (item) {
      setBooks(JSON.parse(item));
    }
  }
  , []);

  function login(username: string, password: string) {
    const found = usersDB.find(
      u => u.username === username && u.password === password
    );
    if (found) setUser(found);
    else alert("Nepareizs lietotājvārds vai parole");
  }

  function borrowBook(bookId: number) {
    if (!user) {
      alert("Tev jābūt pierakstītam lai paņemtu grāmatu!");
      return;
    }
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, available: false } : b
    ));
    setBorrowed([...borrowed, {
      userId: user.id, bookId,
      id: Date.now()
    }]);
  }

  function returnBook(bookId: number) {
    if (!user) return;
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, available: true } : b
    ));
    setBorrowed(borrowed.filter(
      b => !(b.userId === user.id && b.bookId === bookId)
    ));
  }

  function addBook(title: string, author: string) {
    setBooks([
      ...books,
      { id: Date.now(), title, author, available: true }
    ]);
    localStorage.setItem("books", JSON.stringify([
      ...books,
      { id: Date.now(), title, author, available: true }
    ]));
  }

  function removeBook(bookId: number) {
    setBooks(books.filter(b => b.id !== bookId));
    setBorrowed(borrowed.filter(b => b.bookId !== bookId));
    localStorage.setItem("books", JSON.stringify([
      ...books.filter(b => b.id !== bookId)
    ]));
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <><div className="bg" style={{ backgroundImage: `url(${background})` }}></div><div className="mainglass">
          <h2>Bibliotēkas panelis</h2>
          <p>Pierakstījies kā: {user.username}</p>

          <input
              placeholder="Meklēt grāmatu"
              value={search}
              onChange={e => setSearch(e.target.value)} />

          <BookList
              books={books}
              search={search}
              user={user}
              borrowed={borrowed}
              onBorrow={borrowBook}
              onReturn={returnBook}
              onRemove={removeBook} />

          {user.role === "admin" && <AdminPanel onAdd={addBook} />}
          <button className="logoutButton" onClick={() => setUser(null)}>Iziet</button>
      </div></>
  );
}

export default App;
