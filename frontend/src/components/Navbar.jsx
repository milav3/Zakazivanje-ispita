import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import grb from '../assets/grb.png';

function Navbar() {
  const { profesor, logout } = useAuth();

  return (
    <div className="navbar">
      <span className="naslov">
        <img src={grb} alt="Grb fakulteta" />
        Zakazivanje ispitnih termina
      </span>
      <div className="navbar-linkovi">
        <Link to="/">Termini</Link>
        {profesor.uloga === 'admin' && <Link to="/admin">Admin panel</Link>}
        <Link to="/profil" className="navbar-korisnik">{profesor.ime} {profesor.prezime}</Link>
        <button onClick={logout} className="navbar-odjava">Odjavi se</button>
      </div>
    </div>
  );
}

export default Navbar;