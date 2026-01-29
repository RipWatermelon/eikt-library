import './App.css'
import background from "./assets/librarybg.png";

function App() {
  return (
    <>
    
    <div className="bg" style={{ backgroundImage: `url(${background})` }}></div>
      <div className="mainglass">
        <form action=" ">
          <label htmlFor="name">Vārds:</label>
          <input type="text" id="name" name="name" /><br /><br />

          <label htmlFor="email">Epasts:</label>
          <input type="text" id="email" name="email" /><br /><br />

          <input className="button" type="submit" value="Submit" />
        </form>
      </div>
    </>
  )
}

export default App
