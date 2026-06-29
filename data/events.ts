export interface RinkEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'upcoming' | 'past';
  imageUrl: string;
  registrationLink?: string;
  galleryUrl?: string;
  galleryImages?: string[];
}

export const eventsData: RinkEvent[] = [
  {
    id: 'gunvatta-yatra-nabl',
    title: 'Gunvatta Yatra Awareness Program',
    description: 'Gunvatta Yatra Awareness Program on NABL Accreditation & Its Benefits. An exclusive session for research labs, institutions, and startups to understand quality standards and compliance.',
    date: '2026-08-15', // Placeholder future date
    location: 'Kerala Technology Innovation Zone, Kochi',
    type: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=1000', // Vertical 4:5 poster aspect ratio placeholder
    registrationLink: 'https://rinkevents.startupmission.in/'
  },
  {
    id: 'rink-demo-day-2025',
    title: 'RINK DeepTech Demo Day',
    description: 'A showcase of Kerala\'s premier research institutions presenting their commercializable patents and technologies to industry leaders and deep-tech investors.',
    date: '2025-11-20',
    location: 'Virtual Event',
    type: 'past',
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800&h=1000',
    galleryUrl: '/about/demoday',
    galleryImages: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'ipr-workshop',
    title: 'Intellectual Property Rights Masterclass',
    description: 'A comprehensive workshop on patent filing, IP valuation, and tech transfer agreements designed for academic researchers and early-stage innovators.',
    date: '2025-09-10',
    location: 'Trivandrum',
    type: 'past',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=1000',
    galleryUrl: '/about/iprsupport',
    galleryImages: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
    ]
  }
];
