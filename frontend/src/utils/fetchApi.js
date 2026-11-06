export async function fetchApi(url, options = {}, logout) {
  const res = await fetch(url, options);

  if (res.status === 401 || res.status === 403) {
    const data = await res.json().catch(() => ({}));
    // Ako poruka ukazuje na problem sa tokenom (ne na "nemate dozvolu" poslovnu grešku), odjavi
    if (data.poruka === 'Nevalidan ili istekao token.' || data.poruka === 'Niste ulogovani.') {
      logout();
      window.location.href = '/login';
      return null;
    }
  }

  return res;
}