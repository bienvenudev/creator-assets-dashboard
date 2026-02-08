import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/asset/:id" element={<AssetDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
