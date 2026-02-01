import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import background from "./assets/librarybg.png";


// Types
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
      <div>
        <label>Segvārds</label>
        <input value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Parole</label>
        <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Ieiet</button>
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
          <li key={b.id}>
            <strong>{b.title}</strong> — {b.author} {b.available ? "(available)" : "(checked out)"}
            {b.available ? (
              <button onClick={() => onBorrow(b.id)}>Aizņemties</button>
            ) : (
              // show return button only if current user borrowed it
              borrowed.some(x => x.bookId === b.id && x.userId === user.id) ? (
                <button onClick={() => onReturn(b.id)}>Aizņemties</button>
              ) : null
            )}
            {user.role === "admin" && <button onClick={() => onRemove(b.id)}>Izdzēst</button>}
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
      <><div className="bg" style={{ backgroundImage: `url(${background})` }}></div><div className="mainglass">
          <form onSubmit={submit}>
              <h3>Admin panelis</h3>
              <input placeholder="Title" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              <input placeholder="Author" value={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} />
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

  // LOGIN
  function login(username: string, password: string) {
    const found = usersDB.find(
      u => u.username === username && u.password === password
    );
    if (found) setUser(found);
    else alert("Nepareizs lietotājvārds vai parole");
  }

  // BORROW
  function borrowBook(bookId: number) {
    if (!user) {
      alert("Tev jābūt pierakstītam lai paņemtu grāmatu!");
      return;
    }
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, available: false } : b
    ));
    setBorrowed([...borrowed, { userId: user.id, bookId }]);
  }

  // RETURN
  function returnBook(bookId: number) {
    if (!user) return;
    setBooks(books.map(b =>
      b.id === bookId ? { ...b, available: true } : b
    ));
    setBorrowed(borrowed.filter(
      b => !(b.userId === user.id && b.bookId === bookId)
    ));
  }

  // ADMIN ADD
  function addBook(title: string, author: string) {
    setBooks([
      ...books,
      { id: Date.now(), title, author, available: true }
    ]);
  }

  // ADMIN REMOVE
  function removeBook(bookId: number) {
    setBooks(books.filter(b => b.id !== bookId));
    setBorrowed(borrowed.filter(b => b.bookId !== bookId));
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <><div className="bg" style={{ backgroundImage: `url(${background})` }}></div><div className="mainglass">
          <h2>Bibliotēkas panelis</h2>
          <p>Pierakstījies kā: {user.username} ({user.role})</p>

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
      </div></>
  );
}

export default App;
