import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import LibraryPage from "./pages/LibraryPage";
import BookPage from "./pages/BookPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          {/* Matches / exactly */}
          <Route path="/" exact element={<LibraryPage />} /> 
          <Route path="/book/:id" element={<BookPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
