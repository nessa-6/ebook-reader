import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import LibraryPage from "./pages/LibraryPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" exact element={<LibraryPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
