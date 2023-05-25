import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import LibraryPage from "./pages/LibraryPage";
import BookPage from "./pages/BookPage";
import TranslationListPage from './pages/TranslationListPage'
import LoadingItem from "./components/LoadingItem";

function App() {
  return (
    <Router>
      <div className="container dark"> {/* Dark theme */}
        <div className="app">
          <LoadingItem/>
          <Header />

          <Routes>
            <Route path="/" exact element={<LibraryPage />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/book/:id/translations" element={<TranslationListPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
