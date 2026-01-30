import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

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
  { id: 1, title: "1984", author: "George Orwell", available: true },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", available: true },
  { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury", available: true }
];

// Minimal Login component so this file is self-contained
function Login({ onLogin }: { onLogin: (u: string, p: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onLogin(username, password);
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Username</label>
        <input value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
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
              <button onClick={() => onBorrow(b.id)}>Borrow</button>
            ) : (
              // show return button only if current user borrowed it
              borrowed.some(x => x.bookId === b.id && x.userId === user.id) ? (
                <button onClick={() => onReturn(b.id)}>Return</button>
              ) : null
            )}
            {user.role === "admin" && <button onClick={() => onRemove(b.id)}>Remove</button>}
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
    <form onSubmit={submit}>
      <h3>Admin</h3>
      <input placeholder="Title" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
      <input placeholder="Author" value={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} />
      <button type="submit">Add book</button>
    </form>
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
    else alert("Wrong login");
  }

  // BORROW
  function borrowBook(bookId: number) {
    if (!user) {
      alert("You must be logged in to borrow a book");
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
    <div>
      <h2>Library</h2>
      <p>Logged in as: {user.username} ({user.role})</p>

      <input
        placeholder="Search books..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <BookList
        books={books}
        search={search}
        user={user}
        borrowed={borrowed}
        onBorrow={borrowBook}
        onReturn={returnBook}
        onRemove={removeBook}
      />

      {user.role === "admin" && <AdminPanel onAdd={addBook} />}
    </div>
  );
}

export default App;
