import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Termini from './pages/Termini';
import AdminPanel from './pages/AdminPanel';
import Profil from './pages/Profil';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
  const { token, profesor } = useAuth();

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Termini />} />
          <Route path="/profil" element={<Profil />} />
          <Route
            path="/admin"
            element={profesor?.uloga === 'admin' ? <AdminPanel /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;