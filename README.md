# Zakazivanje ispita

Veb aplikacija za organizaciju ispitnih rokova i termina. Omogucava pregled predmeta, profesora, ucionica i ispitnih rokova, kao i rezervaciju dostupnih termina za ulogovane korisnike.

## Funkcionalnosti

### Korisnik

- Registracija i prijava
- Pregled ispitnih rokova i dostupnih termina
- Rezervacija i pregled licnih rezervacija
- Pregled i izmena profila

### Administrator

- Upravljanje predmetima
- Upravljanje profesorima i korisnickim ulogama
- Upravljanje ucionicama
- Upravljanje ispitnim rokovima
- Upravljanje terminima
- Pregled i kontrola rezervacija

## Tehnologije

**Backend**

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT autentifikacija
- bcrypt za hesiranje lozinki

**Frontend**

- React
- Vite
- React Router

## Instalacija i pokretanje

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/milav3/Zakazivanje-ispita.git
cd Zakazivanje-ispita
```

### 2. Podesavanje MySQL baze

Kreirati MySQL bazu, na primer:

```sql
CREATE DATABASE zakazivanje_ispita;
```

### 3. Backend

```bash
cd backend
npm install
```

Kopirati `backend/.env.example` u `backend/.env` i uneti lokalne podatke za MySQL i novu JWT tajnu. Fajl `.env` se namerno ne cuva u Git repozitorijumu.

Pokrenuti backend:

```bash
npm run dev
```

Backend je dostupan na `http://localhost:5000`.

### 4. Frontend

U novom terminalu:

```bash
cd frontend
npm install
npm run dev
```

Frontend je dostupan na adresi koju Vite prikaze u terminalu, podrazumevano `http://localhost:5173`.

