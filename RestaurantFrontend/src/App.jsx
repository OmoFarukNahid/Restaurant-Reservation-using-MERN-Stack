import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home';
import Success from './Pages/Success';
import NotFound from './Pages/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import Recommendations from './components/Recomandations';
import { AuthProvider } from './authState';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/recommendations' element={<Recommendations />} />
          <Route path='/success' element={<Success />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;