export type CurrencyCode = 'USD' | 'AUD';

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface Highlight {
  title: string;
  body: string;
}

export interface Residence {
  slug: string;
  name: string;
  collection: string;
  location: {
    city: string;
    region: string;
    country: string;
    setting: string;
  };
  style: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  areaSqft: number;
  priceFrom: number;
  currency: CurrencyCode;
  architect: string;
  completion: string;
  plot: string;
  tagline: string;
  intro: string;
  description: string[];
  heroImage: string;
  heroAlt: string;
  gallery: GalleryImage[];
  highlights: Highlight[];
  features: string[];
  materials: string[];
  planImages: Record<FloorId, string>;
  modelNote: string;
  accent: 'coast' | 'alpine' | 'harbour';
}

export type FloorId = 'ground' | 'first' | 'second' | 'rooftop';

export interface FloorLevel {
  id: FloorId;
  index: string;
  name: string;
  level: string;
  area: number;
  rooms: string[];
  summary: string;
  details: string;
  planImage: string;
  elevation: number;
}

export interface Hotspot {
  id: string;
  label: string;
  floor: FloorId;
  position: [number, number, number];
  eyebrow: string;
  title: string;
  description: string;
  facts: string[];
}

export type MaterialId =
  | 'limestone'
  | 'travertine'
  | 'oak'
  | 'concrete'
  | 'glass'
  | 'metal';

export interface MaterialFinish {
  id: MaterialId;
  name: string;
  origin: string;
  description: string;
  swatch: string;
  swatchSecondary: string;
  appliesTo: string;
}

export type LightingMode = 'day' | 'sunset' | 'night';

export type CameraPresetId =
  | 'front'
  | 'rear'
  | 'aerial'
  | 'garden'
  | 'pool'
  | 'interior';

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const PRICE_NOTE =
  'Illustrative demonstration pricing. Not an offer, listing or availability statement.';

export const properties: Residence[] = [
  {
    slug: 'vanguard-residence-coastal',
    name: 'Vanguard Residence',
    collection: 'Coastal Collection',
    location: {
      city: 'Malibu',
      region: 'California',
      country: 'United States',
      setting: 'Pacific coastline',
    },
    style: 'Contemporary coastal villa',
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 612,
    areaSqft: 6589,
    priceFrom: 8500000,
    currency: 'USD',
    architect: 'Vanguard Atelier',
    completion: 'Illustrative completion 2027',
    plot: '2,400 m² landscaped site',
    tagline: 'A horizon held in glass and limestone.',
    intro:
      'A low-slung coastal villa composed around a reflecting court, with the Pacific as its constant backdrop.',
    description: [
      'Vanguard Residence is conceived as a sequence of thresholds between land and water. A limestone plinth grounds the house in the coastal terrain; above it, a single sweeping roof shelters living spaces that open entirely to the horizon.',
      'The interiors are arranged along a central gallery, with a living pavilion, kitchen and private study facing the ocean. The primary suite occupies its own quiet wing, reached through a planted courtyard that filters sound, light and sea air.',
      'Every material was selected for the way it ages in salt air: honed limestone, bronze detailing, warm oak and low-iron glass that holds the coastline without tint.',
    ],
    heroImage: '/assets/images/coastal-hero.svg',
    heroAlt:
      'Architectural rendering of a low contemporary villa above a Pacific cove at golden hour, with limestone terraces and an infinity pool.',
    gallery: [
      {
        src: '/assets/images/coastal-hero.svg',
        alt: 'Coastal villa facade with deep roof overhangs and a reflecting pool at sunset.',
        caption: 'West elevation, golden hour',
      },
      {
        src: '/assets/images/coastal-interior.svg',
        alt: 'Warm minimalist living room with floor-to-ceiling glass facing the ocean.',
        caption: 'Living pavilion',
      },
      {
        src: '/assets/images/coastal-pool.svg',
        alt: 'Infinity pool terrace at dusk with the villa silhouetted beyond.',
        caption: 'Infinity terrace',
      },
      {
        src: '/assets/images/detail-stone.svg',
        alt: 'Close architectural study of limestone, oak and bronze detailing.',
        caption: 'Material study',
      },
    ],
    highlights: [
      {
        title: 'Ocean-facing living pavilion',
        body: 'Eight metres of retractable glass dissolve the boundary between the living room, terrace and horizon.',
      },
      {
        title: 'Reflecting arrival court',
        body: 'A shallow water court mirrors the facade and brings cool light into the gallery.',
      },
      {
        title: 'Private primary wing',
        body: 'An independent suite with courtyard, dressing room and a bath oriented to the sunset.',
      },
    ],
    features: [
      'Infinity-edge pool and sun terrace',
      'Retractable low-iron glass walls',
      'Ocean-facing primary suite',
      'Chef’s kitchen with catering pantry',
      'Private courtyard and orchard',
      'Two-car garage with EV charging',
      'Solar array and rainwater harvesting',
      'Independent guest casita',
    ],
    materials: [
      'Honed Portuguese limestone',
      'Bronze window frames',
      'Warm European oak',
      'Low-iron structural glass',
    ],
    planImages: {
      ground: '/assets/images/plan-ground.svg',
      first: '/assets/images/plan-first.svg',
      second: '/assets/images/plan-second.svg',
      rooftop: '/assets/images/plan-rooftop.svg',
    },
    modelNote:
      'The interactive explorer presents a representative Vanguard coastal villa prototype, not a measured survey of this demonstration residence.',
    accent: 'coast',
  },
  {
    slug: 'highlands-estate',
    name: 'The Highlands Estate',
    collection: 'Alpine Collection',
    location: {
      city: 'Aspen',
      region: 'Colorado',
      country: 'United States',
      setting: 'Alpine meadow',
    },
    style: 'Modern alpine residence',
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 540,
    areaSqft: 5813,
    priceFrom: 6800000,
    currency: 'USD',
    architect: 'Vanguard Atelier with Studio Meridian',
    completion: 'Illustrative completion 2028',
    plot: '1.8 hectares of protected meadow',
    tagline: 'Shelter, elevation and long northern light.',
    intro:
      'A modern alpine house of stone and darkened timber, set low into the meadow to preserve the mountain silhouette.',
    description: [
      'The Highlands Estate begins with restraint. Its two volumes are held apart by a glazed circulation hall, allowing the meadow to pass beneath the roofline and the view to remain uninterrupted from every principal room.',
      'A thermal stone core anchors the house against winter, while a deep timber canopy creates a sheltered outdoor room for three seasons. Interiors are intimate, layered and deliberately quiet.',
      'The lower ground level contains a wellness suite, ski room and guest accommodation; above, living spaces open to the continental divide through a continuous band of glass.',
    ],
    heroImage: '/assets/images/highlands-hero.svg',
    heroAlt:
      'Modern alpine estate of stone and dark timber in a snow-dusted mountain meadow under cool evening light.',
    gallery: [
      {
        src: '/assets/images/highlands-hero.svg',
        alt: 'Alpine house with deep timber canopy against a mountain ridge at dusk.',
        caption: 'Mountain elevation, blue hour',
      },
      {
        src: '/assets/images/alpine-interior.svg',
        alt: 'Warm alpine interior with stone hearth, oak floors and a framed view of the mountains.',
        caption: 'Great room and hearth',
      },
      {
        src: '/assets/images/detail-timber.svg',
        alt: 'Architectural detail of dark timber battens meeting rough stone.',
        caption: 'Timber and stone',
      },
      {
        src: '/assets/images/plan-ground.svg',
        alt: 'Ground floor plan drawing of the alpine residence.',
        caption: 'Ground floor plan',
      },
    ],
    highlights: [
      {
        title: 'Glass entry hall',
        body: 'A double-height glazed link frames the ridge and separates the private and guest wings.',
      },
      {
        title: 'Sheltered outdoor room',
        body: 'A deep timber canopy with a suspended hearth extends the living season into the shoulder months.',
      },
      {
        title: 'Wellness level',
        body: 'Lower-ground spa, plunge pool and ski room connect directly to the meadow trail.',
      },
    ],
    features: [
      'Thermal stone core with triple glazing',
      'Suspended outdoor hearth',
      'Lower-ground wellness suite',
      'Ski room and boot drying',
      'Guest wing with independent access',
      'Heated arrival court',
      'Native meadow restoration',
      'Two-car garage plus equipment bay',
    ],
    materials: [
      'Local quarried granite',
      'Charred cedar cladding',
      'Rough-sawn oak floors',
      'Blackened steel',
    ],
    planImages: {
      ground: '/assets/images/plan-ground.svg',
      first: '/assets/images/plan-first.svg',
      second: '/assets/images/plan-second.svg',
      rooftop: '/assets/images/plan-rooftop.svg',
    },
    modelNote:
      'The interactive explorer presents a representative Vanguard villa prototype. The alpine residence would be developed as a site-specific architectural commission.',
    accent: 'alpine',
  },
  {
    slug: 'aurelia-residences',
    name: 'Aurelia Residences',
    collection: 'Harbour Collection',
    location: {
      city: 'Sydney',
      region: 'New South Wales',
      country: 'Australia',
      setting: 'Harbour foreshore',
    },
    style: 'Contemporary luxury residential development',
    bedrooms: 3,
    bathrooms: 4,
    areaSqm: 268,
    areaSqft: 2885,
    priceFrom: 4200000,
    currency: 'AUD',
    architect: 'Vanguard Atelier with Harbourline Studio',
    completion: 'Illustrative completion 2029',
    plot: '12 residences over four levels',
    tagline: 'A quieter kind of harbour living.',
    intro:
      'Twelve residences arranged around a planted courtyard, each with a deep loggia and a view through eucalyptus to the harbour.',
    description: [
      'Aurelia is a residential building conceived at the scale of a house. Only three residences share each level, giving every home a corner condition, cross ventilation and a private outdoor room.',
      'The building’s facade is articulated in sandstone-coloured precast, bronze and glass, with deep planted loggias that shade the interiors and give the building its layered rhythm.',
      'Residents share a rooftop garden, a lap pool and a residents’ library. Ground-level retail is deliberately omitted; the entire site is given over to living and landscape.',
    ],
    heroImage: '/assets/images/aurelia-hero.svg',
    heroAlt:
      'Contemporary harbourfront residential building with layered stone loggias and planting at dusk.',
    gallery: [
      {
        src: '/assets/images/aurelia-hero.svg',
        alt: 'Harbour residences with deep loggias and native planting at twilight.',
        caption: 'Harbour elevation, twilight',
      },
      {
        src: '/assets/images/aurelia-interior.svg',
        alt: 'Refined apartment interior with sandstone tones and harbour views.',
        caption: 'Residence 07',
      },
      {
        src: '/assets/images/aurelia-pool.svg',
        alt: 'Rooftop lap pool and garden overlooking the harbour.',
        caption: 'Rooftop garden',
      },
      {
        src: '/assets/images/plan-first.svg',
        alt: 'Typical residence floor plan drawing.',
        caption: 'Typical residence plan',
      },
    ],
    highlights: [
      {
        title: 'Three homes per level',
        body: 'Every residence is a corner home with dual aspect, cross ventilation and a deep loggia.',
      },
      {
        title: 'Rooftop residents’ garden',
        body: 'A 22-metre lap pool, outdoor kitchen and library pavilion are shared by twelve households.',
      },
      {
        title: 'Planted facade',
        body: 'Native planting shades the stone loggias and supports the building’s passive cooling strategy.',
      },
    ],
    features: [
      'Deep planted loggia to every residence',
      'Rooftop lap pool and garden',
      'Residents’ library and dining room',
      'Secure parking with EV charging',
      'Natural cross ventilation',
      'Acoustic separation between homes',
      'Native landscape by Harbourline',
      'Concierge and parcel room',
    ],
    materials: [
      'Sandstone-toned precast concrete',
      'Bronze balcony soffits',
      'Australian spotted gum timber',
      'Performance glazing',
    ],
    planImages: {
      ground: '/assets/images/plan-ground.svg',
      first: '/assets/images/plan-first.svg',
      second: '/assets/images/plan-second.svg',
      rooftop: '/assets/images/plan-rooftop.svg',
    },
    modelNote:
      'The interactive explorer presents a representative Vanguard villa prototype. Aurelia is a multi-residential demonstration concept shown for illustrative purposes only.',
    accent: 'harbour',
  },
];

export const floors: FloorLevel[] = [
  {
    id: 'ground',
    index: '01',
    name: 'Ground Floor',
    level: 'Level 00',
    area: 248,
    rooms: ['Living pavilion', 'Kitchen', 'Dining', 'Study', 'Guest suite'],
    summary: 'The public floor: a limestone plinth, open living pavilion and a reflecting court.',
    details:
      'Arrival is through a planted court into a gallery that runs the length of the house. Living, dining and kitchen share one continuous space, framed by a nine-metre opening to the terrace. A guest suite and study sit quietly behind the stone core.',
    planImage: '/assets/images/plan-ground.svg',
    elevation: 0,
  },
  {
    id: 'first',
    index: '02',
    name: 'First Floor',
    level: 'Level 01',
    area: 206,
    rooms: ['Primary suite', 'Dressing room', 'Two bedrooms', 'Family room'],
    summary: 'A cantilevered private level of oak, glass and long horizontal views.',
    details:
      'The primary suite projects beyond the floor below, creating a shaded terrace above the water court. A family room opens to a second terrace, with two further bedrooms in the timber-clad east wing.',
    planImage: '/assets/images/plan-first.svg',
    elevation: 3.7,
  },
  {
    id: 'second',
    index: '03',
    name: 'Second Floor',
    level: 'Level 02',
    area: 148,
    rooms: ['Sky lounge', 'Study', 'Wellness room', 'Guest suite'],
    summary: 'A quieter, higher floor for work, rest and the long view.',
    details:
      'Set back from the lower volumes, the second floor is a sequence of intimate rooms around a lightwell. The sky lounge opens to a sheltered terrace on the western edge; a wellness room and study complete the level.',
    planImage: '/assets/images/plan-second.svg',
    elevation: 7.3,
  },
  {
    id: 'rooftop',
    index: '04',
    name: 'Rooftop Terrace',
    level: 'Level 03',
    area: 132,
    rooms: ['Terrace', 'Outdoor kitchen', 'Pergola', 'Plunge pool'],
    summary: 'An outdoor room above the tree line, sheltered by a fine timber pergola.',
    details:
      'A slatted pergola filters the western sun over an outdoor kitchen and dining table. A plunge pool and shower sit at the quiet end of the terrace, screened by planting.',
    planImage: '/assets/images/plan-rooftop.svg',
    elevation: 10.9,
  },
];

export const hotspots: Hotspot[] = [
  {
    id: 'living',
    label: 'Living Room',
    floor: 'ground',
    position: [-1.6, 1.8, 1.5],
    eyebrow: 'Ground floor',
    title: 'The living pavilion',
    description:
      'A double-height room held between a limestone wall and nine metres of retractable glass. The ceiling plane continues beyond the facade to form the terrace canopy.',
    facts: ['68 m²', '9 m glass opening', 'Integrated oak joinery', 'Concealed acoustic ceiling'],
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    floor: 'ground',
    position: [2.4, 1.9, -1.2],
    eyebrow: 'Ground floor',
    title: 'The kitchen',
    description:
      'A monolithic stone island faces the dining table and courtyard beyond. A separate catering pantry keeps the working kitchen out of view when entertaining.',
    facts: ['Honed limestone island', 'Gaggenau appliances', 'Catering pantry', 'Wine store for 320 bottles'],
  },
  {
    id: 'bedroom',
    label: 'Primary Bedroom',
    floor: 'first',
    position: [3.4, 5.3, 0.4],
    eyebrow: 'First floor',
    title: 'The primary suite',
    description:
      'A cantilevered suite with a private terrace, dressing room and a bath positioned for the last light of the day. The oak ceiling runs uninterrupted from inside to out.',
    facts: ['52 m² suite', 'Private 18 m² terrace', 'Dressing room', 'Freestanding stone bath'],
  },
  {
    id: 'terrace',
    label: 'Roof Terrace',
    floor: 'rooftop',
    position: [4.6, 12.4, 1.2],
    eyebrow: 'Rooftop',
    title: 'The roof terrace',
    description:
      'A slatted timber pergola shelters an outdoor kitchen and a long table for twelve. Planted screens and a plunge pool make the terrace usable from early morning to late evening.',
    facts: ['132 m²', 'Timber pergola', 'Outdoor kitchen', 'Plunge pool'],
  },
  {
    id: 'pool',
    label: 'Swimming Pool',
    floor: 'ground',
    position: [7.2, 1.1, 9.4],
    eyebrow: 'Landscape',
    title: 'The infinity pool',
    description:
      'An 18-metre pool set flush with the terrace, its dark stone lining holding reflections of the villa and the sky. The water is treated with a low-chlorine mineral system.',
    facts: ['18 m length', 'Dark basalt lining', 'Mineral filtration', 'Integrated sun shelf'],
  },
  {
    id: 'garden',
    label: 'Garden',
    floor: 'ground',
    position: [-8.6, 1.5, -8.2],
    eyebrow: 'Landscape',
    title: 'The garden',
    description:
      'A drought-tolerant Mediterranean garden of olive, rosemary and native grasses. A gravel path leads from the guest casita through the orchard to the lower lawn.',
    facts: ['2,400 m² site', 'Drought-tolerant planting', 'Productive orchard', 'Gravel arrival court'],
  },
  {
    id: 'garage',
    label: 'Garage',
    floor: 'ground',
    position: [-9.8, 1.7, 6.6],
    eyebrow: 'Arrival',
    title: 'The arrival court',
    description:
      'A discreet two-car garage sits beneath a timber canopy, finished in the same limestone as the house. EV charging and a secure equipment store are integrated into the court.',
    facts: ['Two cars', 'EV charging', 'Secure equipment store', 'Direct entry to gallery'],
  },
];

export const materials: MaterialFinish[] = [
  {
    id: 'limestone',
    name: 'Natural Limestone',
    origin: 'Portugal',
    description:
      'A honed, fossil-rich limestone with a soft chalky surface. Used for the plinth, terraces and the thermal core.',
    swatch: '#cfc4ad',
    swatchSecondary: '#b3a68d',
    appliesTo: 'Plinth, stone core, terraces',
  },
  {
    id: 'travertine',
    name: 'Travertine',
    origin: 'Italy',
    description:
      'A vein-cut travertine with horizontal striation and a brushed finish. Applied here as an alternative terrace stone.',
    swatch: '#d8c9ae',
    swatchSecondary: '#beaa87',
    appliesTo: 'Terraces, paving, pool coping',
  },
  {
    id: 'oak',
    name: 'Warm Oak',
    origin: 'France',
    description:
      'European oak, rift-sawn and fumed to a warm tobacco tone. Used in the slatted upper facade and interior floors.',
    swatch: '#a97c4f',
    swatchSecondary: '#8a6039',
    appliesTo: 'Upper facade, pergola, interiors',
  },
  {
    id: 'concrete',
    name: 'Architectural Concrete',
    origin: 'Site-cast',
    description:
      'A fine-board-marked concrete with a low-sheen sealed finish, used where the architecture needs a quieter mass.',
    swatch: '#a9a7a1',
    swatchSecondary: '#8b8984',
    appliesTo: 'Upper shell, retaining walls',
  },
  {
    id: 'glass',
    name: 'Structural Glass',
    origin: 'Low-iron',
    description:
      'Low-iron, low-e structural glazing with minimal mullions. The glass is tuned to hold the landscape without colour shift.',
    swatch: '#9db4b6',
    swatchSecondary: '#cfe0df',
    appliesTo: 'Facades, balustrades',
  },
  {
    id: 'metal',
    name: 'Dark Metal',
    origin: 'Bronze / steel',
    description:
      'A dark bronze-toned metal used for mullions, pergola framing and the fine edge details of the house.',
    swatch: '#3a3b37',
    swatchSecondary: '#57584f',
    appliesTo: 'Mullions, pergola frame, details',
  },
];

export const cameraPresets: CameraPreset[] = [
  {
    id: 'front',
    label: 'Front Elevation',
    description: 'The approach, pool terrace and principal facade.',
    position: [3, 7.2, 29],
    target: [1, 4.4, 0],
  },
  {
    id: 'rear',
    label: 'Rear Elevation',
    description: 'The garden side and the stone service core.',
    position: [-2, 6.4, -26],
    target: [-1, 4, 0],
  },
  {
    id: 'aerial',
    label: 'Aerial',
    description: 'The full composition of house, pool and landscape.',
    position: [23, 25, 23],
    target: [1, 3.4, 1],
  },
  {
    id: 'garden',
    label: 'Garden',
    description: 'A low view through the olive grove.',
    position: [-16, 4.2, -12],
    target: [-3, 3.2, 0],
  },
  {
    id: 'pool',
    label: 'Pool Terrace',
    description: 'Water level, looking back at the glass facade.',
    position: [9.6, 3.1, 15.2],
    target: [4, 4.2, 0],
  },
  {
    id: 'interior',
    label: 'Interior',
    description: 'Inside the living pavilion, looking to the garden.',
    position: [-3.4, 1.85, 2.6],
    target: [4.5, 2.4, -3],
  },
];

export const lightingModes: { id: LightingMode; label: string; description: string }[] = [
  { id: 'day', label: 'Day', description: 'Clear coastal daylight, high sun and crisp shadows.' },
  { id: 'sunset', label: 'Sunset', description: 'Golden-hour light with warm interior illumination.' },
  { id: 'night', label: 'Night', description: 'Architectural lighting, illuminated interiors and a deep sky.' },
];

export function getProperty(slug: string | undefined): Residence | undefined {
  return properties.find((property) => property.slug === slug);
}

export function getFloor(id: FloorId): FloorLevel {
  const floor = floors.find((item) => item.id === id);
  if (!floor) throw new Error(`Unknown floor: ${id}`);
  return floor;
}

export function formatPrice(property: Residence): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property.currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(property.priceFrom);
}

export function formatArea(area: number): string {
  return new Intl.NumberFormat('en-US').format(area);
}
