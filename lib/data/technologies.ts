export interface Technology {
  id: string;
  name: string;
  image: string;
  sector: string;
  institution: string;
  ipStatus: 'Patented' | 'Patent Filed' | 'Not Specified';
  featured: boolean;
  trl?: number;
  description?: string;
  problemSolved?: string;
  applications?: string[];
}

export const technologiesData: Technology[] = [
  {
    id: 'tech-001',
    name: 'Coconut Pollen Cryopreservation',
    image: 'https://images.unsplash.com/photo-1500595046891-3ba5e000aa77?w=500&h=300&fit=crop',
    sector: 'Food Technology',
    institution: 'ICAR-CPCRI Kasaragod',
    ipStatus: 'Patented',
    featured: true,
    trl: 6,
    description: 'Advanced cryopreservation technology for coconut pollen enabling year-round breeding programs and genetic preservation.',
    problemSolved: 'Seasonal limitations in coconut breeding and genetic resource conservation',
    applications: ['Crop breeding', 'Genetic preservation', 'Commercial agriculture', 'Climate resilience'],
  },
  {
    id: 'tech-002',
    name: 'Microbial Biofertilizer for Coconut',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop',
    sector: 'Biotechnology & Life Sciences',
    institution: 'ICAR-CPCRI Kasaragod',
    ipStatus: 'Patent Filed',
    featured: true,
    trl: 5,
    description: 'Bio-based fertilizer using beneficial microorganisms for sustainable coconut cultivation.',
    problemSolved: 'Chemical fertilizer dependency and soil degradation',
    applications: ['Sustainable farming', 'Soil health', 'Cost reduction', 'Environmental protection'],
  },
  {
    id: 'tech-003',
    name: 'Smart IoT Irrigation System',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3649b6d?w=500&h=300&fit=crop',
    sector: 'Digital Technologies',
    institution: 'NIIST Thiruvananthapuram',
    ipStatus: 'Patented',
    featured: false,
    trl: 7,
    description: 'IoT-based irrigation monitoring and automated water management system.',
    problemSolved: 'Water wastage and inefficient irrigation',
    applications: ['Agriculture', 'Smart farming', 'Water conservation', 'Precision agriculture'],
  },
  {
    id: 'tech-004',
    name: 'Advanced Water Purification',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop',
    sector: 'Water, Environment & Waste Management',
    institution: 'NIT Calicut',
    ipStatus: 'Not Specified',
    featured: false,
    trl: 4,
    description: 'Novel water purification technology using nanotechnology and bio-filters.',
    problemSolved: 'Water contamination and purification costs',
    applications: ['Water treatment', 'Rural areas', 'Industrial applications', 'Sustainable development'],
  },
];

export const sectors = [
  'All',
  'Agriculture',
  'Biotechnology & Life Sciences',
  'Food Technology',
  'Advanced Materials & Chemicals',
  'MedTech & Health Care',
  'Robotics, Automation & Drones',
  'Infrastructure, Construction & Smart Cities',
  'Digital Technologies',
  'AI & Software',
  'Consumer & Lifestyle Products',
  'Energy, Climate & Sustainability',
  'Water, Environment & Waste Management',
];

export const institutions = Array.from(
  new Set(technologiesData.map((tech) => tech.institution))
);

export const ipStatuses = ['All', 'Patented', 'Patent Filed', 'Not Specified'];
