import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Upload from './pages/Upload';
import SavedMemes from './pages/SavedMemes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/saved" element={<SavedMemes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
