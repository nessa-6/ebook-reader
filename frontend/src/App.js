import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import LibraryPage from "./pages/LibraryPage";
import BookPage from "./pages/BookPage";
import TranslationListPage from './pages/TranslationListPage'

function App() {
  return (
    <Router>
      <div className="container dark">
        {/* Dark theme */}
        <div className="app">
          <Header />

          <Routes>
            <Route path="/" exact element={<LibraryPage />} />
            <Route path="/book/:id/:title" element={<BookPage />} />
            <Route
              path="/book/:id/:title/translations"
              element={<TranslationListPage />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
