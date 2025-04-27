import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProviderLeads from './pages/ProviderLeads';
import ProviderDetailPage from './components/ProviderDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProviderLeads />} />
        <Route path="/provider/:npi" element={<ProviderDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;