import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Profil() {
  const { token } = useAuth();
  const [podaci, setPodaci] = useState(null);
  const [greska, setGreska] = useState(null);

  const [staraLozinka, setStaraLozinka] = useState('');
  const [novaLozinka, setNovaLozinka] = useState('');
  const [potvrdaLozinke, setPotvrdaLozinke] = useState('');
  const [porukaLozinka, setPorukaLozinka] = useState(null);
  const [prikaziFormu, setPrikaziFormu] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setPodaci)
      .catch(() => setGreska('Greška pri učitavanju profila.'));
  }, [token]);

  async function promeniLozinku(e) {
    e.preventDefault();
    setPorukaLozinka(null);

    if (novaLozinka !== potvrdaLozinke) {
      setPorukaLozinka('Nova lozinka i potvrda se ne poklapaju.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/promeni-lozinku', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ staraLozinka, novaLozinka }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPorukaLozinka(data.poruka || 'Greška pri promeni lozinke.');
        return;
      }

      setPorukaLozinka('Lozinka uspešno promenjena.');
      setStaraLozinka(''); setNovaLozinka(''); setPotvrdaLozinke('');
    } catch (error) {
      setPorukaLozinka('Ne mogu da se povežem sa serverom.');
    }
  }

  if (greska) return <p className="poruka">{greska}</p>;
  if (!podaci) return <p>Učitavanje...</p>;

  return (
    <div>
      <h1>Moj profil</h1>
      <ul>
        <li><span className="li-tekst"><strong>Ime i prezime:</strong> {podaci.ime} {podaci.prezime}</span></li>
        <li><span className="li-tekst"><strong>Email:</strong> {podaci.email}</span></li>
        <li><span className="li-tekst"><strong>Uloga:</strong> {podaci.uloga === 'admin' ? 'Administrator' : 'Profesor'}</span></li>
      </ul>

      <hr />
      <h2>Promena lozinke</h2>

      {!prikaziFormu ? (
        <button onClick={() => setPrikaziFormu(true)}>Promeni lozinku</button>
      ) : (
        <form onSubmit={promeniLozinku} className="uska-forma">
          <div>
            <label>Trenutna lozinka</label>
            <input type="password" value={staraLozinka} onChange={(e) => setStaraLozinka(e.target.value)} required />
          </div>
          <div>
            <label>Nova lozinka</label>
            <input type="password" value={novaLozinka} onChange={(e) => setNovaLozinka(e.target.value)} required minLength={6} />
          </div>
          <div>
            <label>Potvrda nove lozinke</label>
            <input type="password" value={potvrdaLozinke} onChange={(e) => setPotvrdaLozinke(e.target.value)} required minLength={6} />
          </div>
          {porukaLozinka && <p className="poruka">{porukaLozinka}</p>}
          <div className="li-akcije">
            <button type="submit">Sačuvaj novu lozinku</button>
            <button type="button" onClick={() => {
              setPrikaziFormu(false);
              setStaraLozinka(''); setNovaLozinka(''); setPotvrdaLozinke('');
              setPorukaLozinka(null);
            }}>Otkaži</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profil;