// lib/getInstrumentsJson.ts
// PURPOSE: Fetch and parse dynamic instruments data from process.env.PUBLIC_INSTRUMENTS_JSON_URL
// Maps each instrument card to latitude & longitude coordinates, contact information, district, and Google Maps links.

import baselineInstitutions from '@/data/institutions_mapped.json';

export interface InstrumentItem {
  id: string;
  name: string;
  instruments1?: string;
  instruments?: string;
  acronym?: string;
  facility: string;
  institution_name: string;
  institution_id?: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  url: string;
  image_link?: string;
  original_image_link?: string;
  lat: number;
  lng: number;
  google_maps_url: string;
}

const districtCenters: Record<string, { lat: number; lng: number }> = {
  kasaragod: { lat: 12.4996, lng: 74.9869 },
  kannur: { lat: 11.8745, lng: 75.3704 },
  wayanad: { lat: 11.6854, lng: 76.1320 },
  kozhikode: { lat: 11.2588, lng: 75.7804 },
  malappuram: { lat: 11.0735, lng: 76.0740 },
  palakkad: { lat: 10.7867, lng: 76.6547 },
  thrissur: { lat: 10.5276, lng: 76.2144 },
  ernakulam: { lat: 9.9816, lng: 76.2999 },
  idukki: { lat: 9.9189, lng: 77.1025 },
  kottayam: { lat: 9.5916, lng: 76.5222 },
  alappuzha: { lat: 9.4981, lng: 76.3388 },
  alapuzha: { lat: 9.4981, lng: 76.3388 },
  pathanamthitta: { lat: 9.2648, lng: 76.7870 },
  kollam: { lat: 8.8932, lng: 76.6141 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  trivandrum: { lat: 8.5241, lng: 76.9366 },
  thrivandrum: { lat: 8.5241, lng: 76.9366 }
};

function cleanStr(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getDirectDriveUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  const queryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${queryMatch[1]}`;
  }
  return url;
}

let cachedInstrumentsPromise: Promise<InstrumentItem[]> | null = null;
let cachedInstrumentsData: InstrumentItem[] | null = null;

export async function fetchInstrumentsJson(): Promise<InstrumentItem[]> {
  if (cachedInstrumentsData) return cachedInstrumentsData;
  if (cachedInstrumentsPromise) return cachedInstrumentsPromise;

  const instrumentsUrl = process.env.PUBLIC_INSTRUMENTS_JSON_URL || 'https://rink-git-cron.vercel.app/instrument.json';

  cachedInstrumentsPromise = (async () => {
    try {
      const res = await fetch(instrumentsUrl, {
        next: { revalidate: 3600 }
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      const rawItems: any[] = json.main_data || json.data || (Array.isArray(json) ? json : []);
      const instList: any[] = json.instituitiion_list || [];

      const instMap = new Map<string, any>();
      instList.forEach(inst => {
         if (inst.institution_id) {
           instMap.set(inst.institution_id, inst);
         }
      });

      const items: InstrumentItem[] = rawItems.map((raw: any, index: number) => {
        const id = raw.id || `inst_${index + 1}`;
        const name = raw.instruments1 || raw.instruments || raw.acronym || 'Instrumentation Equipment';
        const acronym = raw.acronym && raw.acronym !== 'None' ? raw.acronym : '';
        const facility = raw.name_of_facility || raw.facility || 'Research Facility';
        const instName = raw.institution_name || raw.matched_institution || 'Research Institution';
        const district = raw.standardized_district || raw.district || 'Ernakulam';
        const address = raw.address || `${facility}, ${district}, Kerala, India`;
        const phone = raw.enquiry_contact_number || raw.phone || '';
        const email = raw.enquiry_mail || raw.email || '';
        const bookingUrl = raw.website_booking_link || raw.website_booking_link_fallback || raw.url || `https://rink-ui.vercel.app/instruments/${id}`;
        
        let imageLink = raw.image_link || '';
        if (imageLink && !imageLink.startsWith('http')) {
          const baseUrl = instrumentsUrl.replace(/\/instrument\.json$/, '');
          imageLink = `${baseUrl}${imageLink}`;
        }

        const originalImageLink = raw.original_image_link ? getDirectDriveUrl(raw.original_image_link) : '';

        // Resolve coordinates (lat, lng)
        let lat = 10.35;
        let lng = 76.3;
        
        const instData = instMap.get(raw.institution_id);
        if (instData && instData.latitude && instData.longitude) {
           lat = parseFloat(instData.latitude);
           lng = parseFloat(instData.longitude);
        } else {
          // Try matching by institution name or matched_institution
          const cleanInst = cleanStr(instName);
          const matchedInst = baselineInstitutions.find(b => {
            const bName = cleanStr(b.name);
            return bName.includes(cleanInst) || cleanInst.includes(bName);
          });

          if (matchedInst) {
            lat = matchedInst.lat;
            lng = matchedInst.lng;
          } else {
            // Fallback to district center coordinates
            const distClean = cleanStr(district);
            if (districtCenters[distClean]) {
              lat = districtCenters[distClean].lat;
              lng = districtCenters[distClean].lng;
            }
          }
        }

        // Slight jitter to prevent overlapping pins if multiple instruments share same inst
        const offsetLat = (index % 5 - 2) * 0.0005;
        const offsetLng = (Math.floor(index / 5) % 5 - 2) * 0.0005;
        const finalLat = Number((lat + offsetLat).toFixed(6));
        const finalLng = Number((lng + offsetLng).toFixed(6));

        const googleMapsUrl = (instData && instData.link) ? instData.link : `https://www.google.com/maps/search/?api=1&query=${finalLat},${finalLng}`;

        return {
          id,
          name,
          instruments1: raw.instruments1,
          instruments: raw.instruments,
          acronym,
          facility,
          institution_name: instName,
          institution_id: raw.institution_id,
          district,
          address,
          phone,
          email,
          url: bookingUrl,
          image_link: imageLink,
          original_image_link: originalImageLink,
          lat: finalLat,
          lng: finalLng,
          google_maps_url: googleMapsUrl,
        };
      });

      cachedInstrumentsData = items;
      return items;
    } catch (err) {
      console.error("Error fetching instrument.json from .env URL:", err);
      return [];
    }
  })();

  return cachedInstrumentsPromise;
}
