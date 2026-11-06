import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import grb from '../assets/grb.png';

function Register() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [poruka, setPoruka] = useState(null);
  const [uspesno, setUspesno] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setPoruka(null);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ime, prezime, email, lozinka, uloga: 'profesor' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPoruka(data.poruka || 'Greška pri registraciji.');
        return;
      }

      setUspesno(true);
    } catch (error) {
      setPoruka('Ne mogu da se povežem sa serverom.');
    }
  }

if (uspesno) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
          <img src={grb} className="auth-logo-slika" alt="Grb fakulteta" />
            <div className="auth-logo-tekst">Fakultet inženjerskih nauka</div>
          </div>
          <h1>Registracija uspešna!</h1>
          <p className="auth-podnaslov">Vaš nalog čeka odobrenje administratora. Bićete obavešteni kada budete mogli da se prijavite.</p>
          <Link to="/login">Nazad na prijavu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={grb} className="auth-logo-slika" alt="Grb fakulteta" />
          <div className="auth-logo-tekst">Fakultet inženjerskih nauka</div>
        </div>
        <h1>Registracija</h1>
        <p className="auth-podnaslov">Napravite nalog kao profesor.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Ime</label>
            <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />
          </div>
          <div>
            <label>Prezime</label>
            <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Lozinka</label>
            <input type="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} required minLength={6} />
          </div>
          {poruka && <p className="poruka">{poruka}</p>}
          <button type="submit">Registruj se</button>
        </form>
        <p className="auth-footer">Već imate nalog? <Link to="/login">Prijavite se</Link></p>
      </div>
    </div>
  );
}

export default Register;