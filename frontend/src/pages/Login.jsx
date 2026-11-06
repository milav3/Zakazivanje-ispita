import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import grb from '../assets/grb.png';

function Login() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setGreska(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lozinka }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.poruka || 'Greška pri prijavi.');
        return;
      }
      login(data.token, data.profesor);
      navigate('/');
    } catch (error) {
      setGreska('Ne mogu da se povežem sa serverom.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
<img src={grb} className="auth-logo-slika" alt="Grb fakulteta" />
          <div className="auth-logo-tekst">
            Fakultet inženjerskih nauka<br />Zakazivanje ispitnih termina
          </div>
        </div>
        <h1>Prijava</h1>
        <p className="auth-podnaslov">Unesite email i lozinku da biste pristupili nalogu.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Lozinka</label>
            <input type="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} required />
          </div>
          {greska && <p className="poruka">{greska}</p>}
          <button type="submit">Prijavi se</button>
        </form>
        <p className="auth-footer">Nemate nalog? <Link to="/register">Registrujte se</Link></p>
      </div>
    </div>
  );
}

export default Login;