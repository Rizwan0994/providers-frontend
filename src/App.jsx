import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
import ProviderLeads from './pages/ProviderLeads';
import LandingPage from './pages/LandingPage';
import ProviderDetailPage from './components/ProviderDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/provider/:npi" element={<ProviderDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;