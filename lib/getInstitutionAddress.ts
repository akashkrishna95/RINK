const ADDRESS_CACHE_PREFIX = 'rink-addr-';

export async function getResolvedAddress(lat: number, lng: number): Promise<string | null> {
  const key = `${ADDRESS_CACHE_PREFIX}${lat.toFixed(4)}_${lng.toFixed(4)}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return cached;
  } catch { /* localStorage unavailable */ }

  try {
    const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.address) {
      try { localStorage.setItem(key, data.address); } catch { /* quota full, non-fatal */ }
      return data.address;
    }
  } catch (err) {
    console.error('[GEOCODE] client lookup failed:', err);
  }
  return null;
}