import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


function Termini() {
  const { profesor, token, logout } = useAuth();

  const [rokovi, setRokovi] = useState([]);
  const [izabraniRok, setIzabraniRok] = useState('');
  const [termini, setTermini] = useState([]);
  const [mojeRezervacije, setMojeRezervacije] = useState([]);
  const [poruka, setPoruka] = useState(null);
const [predmeti, setPredmeti] = useState([]);
const [izabraniPredmet, setIzabraniPredmet] = useState('');
  const [izmenaId, setIzmenaId] = useState(null);
const [noviPredmetId, setNoviPredmetId] = useState('');
  

  // Ucitaj ispitne rokove jednom, na pocetku
  useEffect(() => {
    fetch('http://localhost:5000/api/ispitni-rokovi')
      .then((res) => res.json())
      .then(setRokovi)
      .catch(() => setPoruka('Greška pri učitavanju rokova.'));
  }, []);

useEffect(() => {
  fetch('http://localhost:5000/api/predmeti')
    .then((res) => res.json())
    .then(setPredmeti)
    .catch(() => setPoruka('Greška pri učitavanju predmeta.'));
}, []);

  // Ucitaj termine i moje rezervacije, i ponovo svaki put kad se promeni izabrani rok
  useEffect(() => {
    ucitajTermine();
    ucitajMojeRezervacije();
  }, [izabraniRok]);

  function ucitajTermine() {
    fetch('http://localhost:5000/api/termini')
      .then((res) => res.json())
      .then((data) => {
        const filtrirano = izabraniRok
          ? data.filter((t) => t.IspitniRok?.id === parseInt(izabraniRok))
          : data;
        setTermini(filtrirano);
      })
      .catch(() => setPoruka('Greška pri učitavanju termina.'));
  }

  function ucitajMojeRezervacije() {
    fetch('http://localhost:5000/api/rezervacije', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const mine = data.filter((r) => r.Profesor?.id === profesor.id);
        setMojeRezervacije(mine);
      })
      .catch(() => setPoruka('Greška pri učitavanju rezervacija.'));
  }

  async function rezervisi(terminId) {
    setPoruka(null);
    try {
      const res = await fetch('http://localhost:5000/api/rezervacije', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  termin_id: terminId,
  profesor_id: profesor.id,
  predmet_id: parseInt(izabraniPredmet),
}),
      });
      const data = await res.json();

      if (!res.ok) {
        setPoruka(data.poruka || 'Greška pri rezervaciji.');
        return;
      }

      setPoruka('Uspešno rezervisano!');
      ucitajTermine();
      ucitajMojeRezervacije();
    } catch (error) {
      setPoruka('Ne mogu da se povežem sa serverom.');
    }
  }

async function otkazi(rezervacijaId) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/rezervacije/${rezervacijaId}/otkazi`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      setPoruka(data.poruka || 'Greška pri otkazivanju.');
      return;
    }

    setPoruka('Rezervacija otkazana.');
    ucitajTermine();
    ucitajMojeRezervacije();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

  // Termin je slobodan ako nema Rezervaciju sa statusom 'aktivna'
  function jeSlobodan(termin) {
    return !termin.Rezervacija || termin.Rezervacija.status !== 'aktivna';
  }

async function sacuvajIzmenu(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/rezervacije/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ predmet_id: parseInt(noviPredmetId) }),
    });
    const data = await res.json();

    if (!res.ok) {
      setPoruka(data.poruka || 'Greška pri izmeni.');
      return;
    }

    setPoruka('Rezervacija izmenjena.');
    setIzmenaId(null);
    ucitajMojeRezervacije();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

  return (
    <div>
      <h1>Dobrodošli, {profesor?.ime} {profesor?.prezime}!</h1>
      
      <hr />

      <h2>Moje rezervacije</h2>
      {mojeRezervacije.length === 0 && <p>Nemate rezervacija.</p>}
     <ul>
  {mojeRezervacije.map((r) => (
    <li key={r.id}>
      {izmenaId === r.id ? (
        <>
          <select value={noviPredmetId} onChange={(e) => setNoviPredmetId(e.target.value)}>
            <option value="">-- Izaberite predmet --</option>
            {predmeti.map((p) => (
              <option key={p.id} value={p.id}>
                {p.naziv} ({p.studijski_program}, {p.godina_studija}. godina)
              </option>
            ))}
          </select>
          <div className="li-akcije">
            <button onClick={() => sacuvajIzmenu(r.id)}>Sačuvaj</button>
            <button onClick={() => setIzmenaId(null)}>Otkaži izmenu</button>
          </div>
        </>
      ) : (
        <>
          <span className="li-tekst">
          {r.Predmet?.naziv} - {r.Termin?.Ucionica?.naziv} - {r.Termin?.datum} ({r.Termin?.vreme_pocetka}-{r.Termin?.vreme_kraja})
          {' - status: '}{r.status}
          </span>
          {r.status === 'aktivna' && (
            <div className="li-akcije">
              <button onClick={() => { setIzmenaId(r.id); setNoviPredmetId(r.Predmet?.id || ''); }}>Izmeni</button>
              <button onClick={() => otkazi(r.id)}>Otkaži</button>
            </div>
          )}
        </>
      )}
    </li>
  ))}
</ul>

      <hr />

      <h2>Dostupni termini</h2>

      <label>Izaberite ispitni rok: </label>
      <select value={izabraniRok} onChange={(e) => setIzabraniRok(e.target.value)}>
        <option value="">-- Svi rokovi --</option>
        {rokovi.map((rok) => (
          <option key={rok.id} value={rok.id}>{rok.naziv}</option>
        ))}
      </select>

      <div style={{ margin: '10px 0' }}>
  <label>Predmet: </label>
  <select value={izabraniPredmet} onChange={(e) => setIzabraniPredmet(e.target.value)}>
    <option value="">-- Izaberite predmet --</option>
    {predmeti.map((p) => (
      <option key={p.id} value={p.id}>
        {p.naziv} ({p.studijski_program}, {p.godina_studija}. godina)
      </option>
    ))}
  </select>
</div>

      {poruka && <p className="poruka">{poruka}</p>}
      <ul>
  {termini.map((termin) => (
    <li key={termin.id}>
      <span className="li-tekst">
        {termin.datum} {termin.vreme_pocetka}-{termin.vreme_kraja} - {termin.Ucionica?.naziv}
      </span>
      {jeSlobodan(termin) ? (
        <div className="li-akcije">
          <button onClick={() => rezervisi(termin.id)}>Rezerviši</button>
        </div>
      ) : (
        <span style={{ color: 'gray' }}>(zauzeto)</span>
      )}
    </li>
  ))}
</ul>
    </div>
  );
}

export default Termini;