import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { token } = useAuth();

  const [neodobreni, setNeodobreni] = useState([]);
  const [ucionice, setUcionice] = useState([]);
  const [rokovi, setRokovi] = useState([]);
  const [poruka, setPoruka] = useState(null);

  // Forme
  const [naziv, setNaziv] = useState('');
  const [kapacitet, setKapacitet] = useState('');
  const [oprema, setOprema] = useState('');

  const [nazivRoka, setNazivRoka] = useState('');
  const [datumPocetka, setDatumPocetka] = useState('');
  const [datumKraja, setDatumKraja] = useState('');

const [termini, setTermini] = useState([]);
const [datumTermina, setDatumTermina] = useState('');
const [vremePocetka, setVremePocetka] = useState('');
const [vremeKraja, setVremeKraja] = useState('');
const [izabranaUcionica, setIzabranaUcionica] = useState('');
const [izabraniRokZaTermin, setIzabraniRokZaTermin] = useState('');

const [sveRezervacije, setSveRezervacije] = useState([]);
const [izmenaUcionicaId, setIzmenaUcionicaId] = useState(null);
const [editNaziv, setEditNaziv] = useState('');
const [editKapacitet, setEditKapacitet] = useState('');
const [editOprema, setEditOprema] = useState('');

const [izmenaRokaId, setIzmenaRokaId] = useState(null);
const [editNazivRoka, setEditNazivRoka] = useState('');
const [editDatumPocetka, setEditDatumPocetka] = useState('');
const [editDatumKraja, setEditDatumKraja] = useState('');

const [izmenaTerminaId, setIzmenaTerminaId] = useState(null);
const [editDatum, setEditDatum] = useState('');
const [editVremePocetka, setEditVremePocetka] = useState('');
const [editVremeKraja, setEditVremeKraja] = useState('');
const [editUcionicaId, setEditUcionicaId] = useState('');
const [editRokId, setEditRokId] = useState('');

const [predmeti, setPredmeti] = useState([]);
const [nazivPredmeta, setNazivPredmeta] = useState('');
const [nivoStudija, setNivoStudija] = useState('osnovne');
const [studijskiProgram, setStudijskiProgram] = useState('');
const [godinaStudijaPredmeta, setGodinaStudijaPredmeta] = useState('');

useEffect(() => {
  ucitajNeodobrene();
  ucitajUcionice();
  ucitajRokove();
  ucitajTermine();
  ucitajSveRezervacije();
  ucitajPredmete();
}, []);

  function ucitajNeodobrene() {
    fetch('http://localhost:5000/api/profesori/neodobreni', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNeodobreni)
      .catch(() => setPoruka('Greška pri učitavanju profesora.'));
  }

  function ucitajUcionice() {
    fetch('http://localhost:5000/api/ucionice')
      .then((res) => res.json())
      .then(setUcionice)
      .catch(() => setPoruka('Greška pri učitavanju učionica.'));
  }

  function ucitajRokove() {
    fetch('http://localhost:5000/api/ispitni-rokovi')
      .then((res) => res.json())
      .then(setRokovi)
      .catch(() => setPoruka('Greška pri učitavanju rokova.'));
  }
  function ucitajTermine() {
  fetch('http://localhost:5000/api/termini')
    .then((res) => res.json())
    .then(setTermini)
    .catch(() => setPoruka('Greška pri učitavanju termina.'));
}

  async function odobri(id) {
    setPoruka(null);
    try {
      const res = await fetch(`http://localhost:5000/api/profesori/${id}/odobri`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setPoruka(data.poruka); return; }
      setPoruka('Nalog uspešno odobren.');
      ucitajNeodobrene();
    } catch (error) {
      setPoruka('Ne mogu da se povežem sa serverom.');
    }
  }

  async function dodajUcionicu(e) {
    e.preventDefault();
    setPoruka(null);
    try {
      const res = await fetch('http://localhost:5000/api/ucionice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naziv, kapacitet: parseInt(kapacitet), oprema }),
      });
      const data = await res.json();
      if (!res.ok) { setPoruka(data.poruka); return; }
      setPoruka('Učionica dodata.');
      setNaziv(''); setKapacitet(''); setOprema('');
      ucitajUcionice();
    } catch (error) {
      setPoruka('Ne mogu da se povežem sa serverom.');
    }
  }

  async function dodajRok(e) {
    e.preventDefault();
    setPoruka(null);
    try {
      const res = await fetch('http://localhost:5000/api/ispitni-rokovi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naziv: nazivRoka, datum_pocetka: datumPocetka, datum_kraja: datumKraja }),
      });
      const data = await res.json();
      if (!res.ok) { setPoruka(data.poruka); return; }
      setPoruka('Ispitni rok dodat.');
      setNazivRoka(''); setDatumPocetka(''); setDatumKraja('');
      ucitajRokove();
    } catch (error) {
      setPoruka('Ne mogu da se povežem sa serverom.');
    }
  }

async function dodajTermin(e) {
  e.preventDefault();
  setPoruka(null);
  try {
    const res = await fetch('http://localhost:5000/api/termini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: datumTermina,
        vreme_pocetka: vremePocetka,
        vreme_kraja: vremeKraja,
        ucionica_id: parseInt(izabranaUcionica),
        ispitni_rok_id: parseInt(izabraniRokZaTermin),
      }),
    });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Termin dodat.');
    setDatumTermina(''); setVremePocetka(''); setVremeKraja('');
    setIzabranaUcionica(''); setIzabraniRokZaTermin('');
    ucitajTermine();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

function ucitajSveRezervacije() {
  fetch('http://localhost:5000/api/rezervacije', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(setSveRezervacije)
    .catch(() => setPoruka('Greška pri učitavanju rezervacija.'));
}

async function otkaziRezervaciju(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/rezervacije/${id}/otkazi`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Rezervacija otkazana.');
    ucitajSveRezervacije();
    ucitajTermine();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

async function obrisiUcionicu(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/ucionice/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Učionica obrisana.');
    ucitajUcionice();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

async function sacuvajIzmenuUcionice(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/ucionice/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naziv: editNaziv, kapacitet: parseInt(editKapacitet), oprema: editOprema }),
    });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Učionica izmenjena.');
    setIzmenaUcionicaId(null);
    ucitajUcionice();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

async function obrisiRok(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/ispitni-rokovi/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Rok obrisan.');
    ucitajRokove();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

async function sacuvajIzmenuRoka(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/ispitni-rokovi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naziv: editNazivRoka, datum_pocetka: editDatumPocetka, datum_kraja: editDatumKraja }),
    });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Rok izmenjen.');
    setIzmenaRokaId(null);
    ucitajRokove();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

async function obrisiTermin(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/termini/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Termin obrisan.');
    ucitajTermine();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

async function sacuvajIzmenuTermina(id) {
  setPoruka(null);
  try {
    const res = await fetch(`http://localhost:5000/api/termini/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: editDatum,
        vreme_pocetka: editVremePocetka,
        vreme_kraja: editVremeKraja,
        ucionica_id: parseInt(editUcionicaId),
        ispitni_rok_id: parseInt(editRokId),
      }),
    });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Termin izmenjen.');
    setIzmenaTerminaId(null);
    ucitajTermine();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

function ucitajPredmete() {
  fetch('http://localhost:5000/api/predmeti')
    .then((res) => res.json())
    .then(setPredmeti)
    .catch(() => setPoruka('Greška pri učitavanju predmeta.'));
}

async function dodajPredmet(e) {
  e.preventDefault();
  setPoruka(null);
  try {
    const res = await fetch('http://localhost:5000/api/predmeti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        naziv: nazivPredmeta,
        nivo_studija: nivoStudija,
        studijski_program: studijskiProgram,
        godina_studija: parseInt(godinaStudijaPredmeta),
      }),
    });
    const data = await res.json();
    if (!res.ok) { setPoruka(data.poruka); return; }
    setPoruka('Predmet dodat.');
    setNazivPredmeta(''); setStudijskiProgram(''); setGodinaStudijaPredmeta('');
    ucitajPredmete();
  } catch (error) {
    setPoruka('Ne mogu da se povežem sa serverom.');
  }
}

  return (
    <div>
      <h1>Admin panel</h1>
      {poruka && <p className="poruka">{poruka}</p>}
      <hr />
      <h2>Neodobreni nalozi</h2>
      {neodobreni.length === 0 && <p>Nema naloga koji čekaju odobrenje.</p>}
      <ul>
  {neodobreni.map((p) => (
    <li key={p.id}>
      <span className="li-tekst">{p.ime} {p.prezime} ({p.email})</span>
      <div className="li-akcije">
        <button onClick={() => odobri(p.id)}>Odobri</button>
      </div>
    </li>
  ))}
</ul>

      <hr />
      <h2>Učionice</h2>
      <form onSubmit={dodajUcionicu}>
        <input type="text" placeholder="Naziv" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
        <input type="number" placeholder="Kapacitet" value={kapacitet} onChange={(e) => setKapacitet(e.target.value)} required />
        <input type="text" placeholder="Oprema (opciono)" value={oprema} onChange={(e) => setOprema(e.target.value)} />
        <button type="submit">Dodaj učionicu</button>
      </form>
      <ul>
  {ucionice.map((u) => (
    <li key={u.id}>
      {izmenaUcionicaId === u.id ? (
        <>
          <input type="text" value={editNaziv} onChange={(e) => setEditNaziv(e.target.value)} />
          <input type="number" value={editKapacitet} onChange={(e) => setEditKapacitet(e.target.value)} />
          <input type="text" value={editOprema} onChange={(e) => setEditOprema(e.target.value)} />
          <div className="li-akcije">
            <button onClick={() => sacuvajIzmenuUcionice(u.id)}>Sačuvaj</button>
            <button onClick={() => setIzmenaUcionicaId(null)}>Otkaži</button>
          </div>
        </>
      ) : (
        <>
          <span className="li-tekst">{u.naziv} - kapacitet {u.kapacitet} ({u.oprema})</span>
          <div className="li-akcije">
            <button onClick={() => {
              setIzmenaUcionicaId(u.id);
              setEditNaziv(u.naziv);
              setEditKapacitet(u.kapacitet);
              setEditOprema(u.oprema || '');
            }}>Izmeni</button>
            <button onClick={() => obrisiUcionicu(u.id)}>Obriši</button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

      <hr />
      <h2>Ispitni rokovi</h2>
      <form onSubmit={dodajRok}>
        <input type="text" placeholder="Naziv (npr. Januarski rok 2027)" value={nazivRoka} onChange={(e) => setNazivRoka(e.target.value)} required />
        <label>Od: <input type="date" value={datumPocetka} onChange={(e) => setDatumPocetka(e.target.value)} required /></label>
        <label>Do: <input type="date" value={datumKraja} onChange={(e) => setDatumKraja(e.target.value)} required /></label>
        <button type="submit">Dodaj rok</button>
      </form>
      <ul>
  {rokovi.map((r) => (
    <li key={r.id}>
      {izmenaRokaId === r.id ? (
        <>
          <input type="text" value={editNazivRoka} onChange={(e) => setEditNazivRoka(e.target.value)} />
          <input type="date" value={editDatumPocetka} onChange={(e) => setEditDatumPocetka(e.target.value)} />
          <input type="date" value={editDatumKraja} onChange={(e) => setEditDatumKraja(e.target.value)} />
          <div className="li-akcije">
            <button onClick={() => sacuvajIzmenuRoka(r.id)}>Sačuvaj</button>
            <button onClick={() => setIzmenaRokaId(null)}>Otkaži</button>
          </div>
        </>
      ) : (
        <>
          <span className="li-tekst">{r.naziv} ({r.datum_pocetka} - {r.datum_kraja})</span>
          <div className="li-akcije">
            <button onClick={() => {
              setIzmenaRokaId(r.id);
              setEditNazivRoka(r.naziv);
              setEditDatumPocetka(r.datum_pocetka);
              setEditDatumKraja(r.datum_kraja);
            }}>Izmeni</button>
            <button onClick={() => obrisiRok(r.id)}>Obriši</button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>
      <hr />
      
<h2>Predmeti</h2>
<form onSubmit={dodajPredmet}>
  <input type="text" placeholder="Naziv predmeta" value={nazivPredmeta} onChange={(e) => setNazivPredmeta(e.target.value)} required />
  <select value={nivoStudija} onChange={(e) => setNivoStudija(e.target.value)}>
    <option value="osnovne">Osnovne studije</option>
    <option value="master">Master studije</option>
    <option value="doktorske">Doktorske studije</option>
  </select>
  <input type="text" placeholder="Studijski program" value={studijskiProgram} onChange={(e) => setStudijskiProgram(e.target.value)} required />
  <input type="number" placeholder="Godina studija" min="1" max="4" value={godinaStudijaPredmeta} onChange={(e) => setGodinaStudijaPredmeta(e.target.value)} required />
  <button type="submit">Dodaj predmet</button>
</form>
<ul>
  {predmeti.map((p) => (
    <li key={p.id}>
      <span className="li-tekst">{p.naziv} - {p.studijski_program} ({p.nivo_studija}, {p.godina_studija}. godina)</span>
    </li>
  ))}
</ul>
<h2>Termini</h2>
<form onSubmit={dodajTermin}>
  <label>Datum: <input type="date" value={datumTermina} onChange={(e) => setDatumTermina(e.target.value)} required /></label>
  <label>Od: <input type="time" value={vremePocetka} onChange={(e) => setVremePocetka(e.target.value)} required /></label>
  <label>Do: <input type="time" value={vremeKraja} onChange={(e) => setVremeKraja(e.target.value)} required /></label>

  <select value={izabranaUcionica} onChange={(e) => setIzabranaUcionica(e.target.value)} required>
    <option value="">-- Izaberite učionicu --</option>
    {ucionice.map((u) => (
      <option key={u.id} value={u.id}>{u.naziv}</option>
    ))}
  </select>

  <select value={izabraniRokZaTermin} onChange={(e) => setIzabraniRokZaTermin(e.target.value)} required>
    <option value="">-- Izaberite ispitni rok --</option>
    {rokovi.map((r) => (
      <option key={r.id} value={r.id}>{r.naziv}</option>
    ))}
  </select>

  <button type="submit">Dodaj termin</button>
</form>
<ul>
  {termini.map((t) => (
    <li key={t.id}>
      {izmenaTerminaId === t.id ? (
        <>
          <input type="date" value={editDatum} onChange={(e) => setEditDatum(e.target.value)} />
          <input type="time" value={editVremePocetka} onChange={(e) => setEditVremePocetka(e.target.value)} />
          <input type="time" value={editVremeKraja} onChange={(e) => setEditVremeKraja(e.target.value)} />
          <select value={editUcionicaId} onChange={(e) => setEditUcionicaId(e.target.value)}>
            {ucionice.map((u) => <option key={u.id} value={u.id}>{u.naziv}</option>)}
          </select>
          <select value={editRokId} onChange={(e) => setEditRokId(e.target.value)}>
            {rokovi.map((r) => <option key={r.id} value={r.id}>{r.naziv}</option>)}
          </select>
          <div className="li-akcije">
            <button onClick={() => sacuvajIzmenuTermina(t.id)}>Sačuvaj</button>
            <button onClick={() => setIzmenaTerminaId(null)}>Otkaži</button>
          </div>
        </>
      ) : (
        <>
          <span className="li-tekst">{t.datum} {t.vreme_pocetka}-{t.vreme_kraja} - {t.Ucionica?.naziv} ({t.IspitniRok?.naziv})</span>
          <div className="li-akcije">
            <button onClick={() => {
              setIzmenaTerminaId(t.id);
              setEditDatum(t.datum);
              setEditVremePocetka(t.vreme_pocetka);
              setEditVremeKraja(t.vreme_kraja);
              setEditUcionicaId(t.Ucionica?.id || '');
              setEditRokId(t.IspitniRok?.id || '');
            }}>Izmeni</button>
            <button onClick={() => obrisiTermin(t.id)}>Obriši</button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>
<hr />
<h2>Sve rezervacije</h2>
<ul>
  {sveRezervacije.map((r) => (
    <li key={r.id}>
      <span className="li-tekst">
        {r.Profesor?.ime} {r.Profesor?.prezime} - {r.Predmet?.naziv} - {r.Termin?.Ucionica?.naziv} - {r.Termin?.datum} ({r.status})
      </span>
      {r.status === 'aktivna' && (
        <div className="li-akcije">
          <button onClick={() => otkaziRezervaciju(r.id)}>Otkaži</button>
        </div>
      )}
    </li>
  ))}
</ul>
    </div>
  );
}

export default AdminPanel;