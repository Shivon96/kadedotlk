import { Product } from '../types';

import fridgeImg from '../assets/images/appl_smart_refrigerator_1790632372149.jpg';
import tvImg from '../assets/images/appl_oled_smart_tv_1790632383838.jpg';
import washerImg from '../assets/images/appl_washing_machine_1790632397322.jpg';
import kitchenImg from '../assets/images/appl_espresso_blender_1790632411446.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kade-prod-001',
    name: 'Samsung 450L Twin Cooling Plus French Door Inverter Refrigerator',
    sinhalaName: 'සැම්සුන්ග් 450L ඉන්වර්ටර් ශීතකරණය',
    category: 'refrigerators',
    brand: 'Samsung',
    modelNumber: 'RT45K6340SL',
    price: 389900,
    originalPrice: 425000,
    inStock: true,
    stockQuantity: 8,
    warrantyYears: 10,
    warrantyDetails: '10 Years on Digital Inverter Compressor + 2 Years Comprehensive Agent Warranty',
    rating: 4.9,
    reviewCount: 38,
    image: fridgeImg,
    badge: 'Bestseller',
    isFeatured: true,
    description: 'Advanced Twin Cooling Plus system with 5 conversion modes. Retains up to 70% moisture to keep food fresh for longer. Digital Inverter Technology automatically adjusts compressor speed across 7 levels in response to cooling demand.',
    sinhalaDescription: 'ඩිජිටල් ඉන්වර්ටර් තාක්ෂණය සහිත ඉහළ ගුණාත්මක 450L ශීතකරණය. විදුලි පරිභෝජනය 50% දක්වා අඩු කරයි.',
    features: [
      'Twin Cooling Plus independent cooling circuits',
      'Digital Inverter with 10-year compressor guarantee',
      'Power Freeze and Power Cool rapid chilling',
      'Deodorizing Filter with activated carbon',
      'Energy efficient A+++ star rated'
    ],
    specs: {
      'Gross Capacity': '450 Liters',
      'Compressor Type': 'Digital Inverter',
      'Refrigerant': 'R600a Eco-friendly',
      'Door Finish': 'Easy Clean Inox Stainless Steel',
      'Dimensions (W x H x D)': '700 x 1785 x 726 mm',
      'Voltage': '220V - 240V / 50Hz'
    },
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'kade-prod-002',
    name: 'LG 65" 4K OLED Smart TV with α8 AI Processor & Dolby Atmos',
    sinhalaName: 'LG 65 අඟල් 4K OLED ස්මාර්ට් ටීවී',
    category: 'smart_tvs',
    brand: 'LG',
    modelNumber: 'OLED65B4PSA',
    price: 529000,
    originalPrice: 575000,
    inStock: true,
    stockQuantity: 5,
    warrantyYears: 3,
    warrantyDetails: '3 Years Full Comprehensive Panel & Board Agent Warranty',
    rating: 5.0,
    reviewCount: 42,
    image: tvImg,
    badge: 'Hot Deal',
    isFeatured: true,
    description: 'Self-lit pixels achieve infinite contrast and 100% color fidelity. Powered by the α8 AI Processor 4K for pristine upscaling and dynamic tone mapping. Features webOS 24 with Apple AirPlay 2, Google Assistant, and Magic Remote.',
    sinhalaDescription: 'අසමසම පැහැදිලි බවක් සහ සැබෑ කළු වර්ණ සහිත 65 අඟල් 4K OLED තිරය. ඩොල්බි ඇට්මොස් ශබ්ද තාක්ෂණය.',
    features: [
      'Self-Lit OLED 4K panel with 120Hz native refresh rate',
      'α8 AI Processor 4K with AI Sound Pro (9.1.2 Virtual Up-mix)',
      'Dolby Vision & Dolby Atmos cinematic experience',
      'HDMI 2.1 support for PS5 and Xbox Series X (VRR, ALLM, G-Sync)',
      'Magic Remote with voice recognition'
    ],
    specs: {
      'Screen Size': '65 Inch (165 cm)',
      'Display Resolution': '3840 x 2160 (4K Ultra HD)',
      'Refresh Rate': '120Hz Native',
      'Audio Output': '20W 2.0ch with AI Sound Pro',
      'Operating System': 'webOS 24',
      'Connectivity': '4x HDMI 2.1, 2x USB, Wi-Fi 5, Bluetooth 5.0'
    },
    createdAt: '2026-02-10T12:30:00.000Z'
  },
  {
    id: 'kade-prod-003',
    name: 'Panasonic 9.5kg Front Load Inverter Washing Machine with Steam Care',
    sinhalaName: 'පැනසොනික් 9.5kg ඉන්වර්ටර් රෙදි සෝදන යන්ත්‍රය',
    category: 'washing_machines',
    brand: 'Panasonic',
    modelNumber: 'NA-V95FC1WSG',
    price: 245000,
    originalPrice: 268000,
    inStock: true,
    stockQuantity: 12,
    warrantyYears: 10,
    warrantyDetails: '10 Years Motor Warranty + 2 Years Comprehensive Agent Warranty',
    rating: 4.8,
    reviewCount: 29,
    image: washerImg,
    badge: 'Inverter Tech',
    isFeatured: true,
    description: 'Hygiene Dry and Blue Ag+ allergen elimination eliminate 99.99% of bacteria with cold wash technology. StainMaster+ removes stubborn collar, sauce, and grease stains effortlessly. 3Di Inverter optimizes sensor load detection to conserve electricity and water.',
    sinhalaDescription: 'බැක්ටීරියා 99.9% ක් විනාශ කරන ස්ටීම් කෙයාර් සහ ඉන්වර්ටර් තාක්ෂණයෙන් සමන්විත රෙදි සෝදන යන්ත්‍රය.',
    features: [
      'Blue Ag+ cold wash anti-bacterial technology',
      'StainMaster+ intensive hot steam wash',
      '3Di Inverter for ultra-quiet operation (54dB)',
      'Auto Tub Clean function prevents mold buildup',
      '15-minute quick wash program'
    ],
    specs: {
      'Washing Capacity': '9.5 kg',
      'Max Spin Speed': '1400 RPM',
      'Motor': 'Inverter Direct Drive',
      'Water Rating': '5 Star Efficiency',
      'Dimensions (W x H x D)': '596 x 845 x 600 mm',
      'Net Weight': '68 kg'
    },
    createdAt: '2026-01-20T09:15:00.000Z'
  },
  {
    id: 'kade-prod-004',
    name: 'DeLonghi Magnifica S Compact Espresso Machine & Digital Touch Air Fryer Set',
    sinhalaName: 'ඩිලොන්ගි එස්ප්‍රෙසෝ මැෂින් සහ ඩිජිටල් එයාර් ෆ්‍රයර් කට්ටලය',
    category: 'kitchen_appliances',
    brand: 'DeLonghi',
    modelNumber: 'ECAM22.110.B-COMBO',
    price: 198000,
    originalPrice: 220000,
    inStock: true,
    stockQuantity: 6,
    warrantyYears: 2,
    warrantyDetails: '2 Years Manufacturer & Official Agent Replacement Warranty',
    rating: 4.9,
    reviewCount: 31,
    image: kitchenImg,
    badge: 'Hot Deal',
    isFeatured: true,
    description: 'The ultimate kitchen setup: Bean-to-cup automated espresso machine with 15-bar Italian pump, accompanied by a 6.5L rapid vortex digital air fryer for healthy oil-free cooking.',
    sinhalaDescription: 'ඉහළ පෙළේ ඉතාලි එස්ප්‍රෙසෝ කෝපි යන්ත්‍රය සහ තෙල් රහිත ආහාර පිසින 6.5L ඩිජිටල් එයාර් ෆ්‍රයර්.',
    features: [
      'Integrated silent burr coffee grinder with 13 settings',
      'Manual Cappuccino System for rich velvety milk froth',
      '6.5L XL capacity digital air fryer with 12 preset functions',
      'Rapid air circulation cooks 40% faster than conventional ovens',
      'Dishwasher safe removable non-stick components'
    ],
    specs: {
      'Espresso Pressure': '15 Bar Italian Pump',
      'Bean Container Capacity': '250g',
      'Air Fryer Capacity': '6.5 Liters',
      'Power Consumption': '1450W (Coffee) + 1800W (Fryer)',
      'Voltage': '220V - 240V'
    },
    createdAt: '2026-02-01T15:45:00.000Z'
  },
  {
    id: 'kade-prod-005',
    name: 'Daikin 18,000 BTU Inverter Split Air Conditioner with PM2.5 Filter',
    sinhalaName: 'ඩයිකින් 18000 BTU ඉන්වර්ටර් වායුසමීකරණ යන්ත්‍රය',
    category: 'cooling_air',
    brand: 'Daikin',
    modelNumber: 'FTKM50TV16U',
    price: 315000,
    originalPrice: 345000,
    inStock: true,
    stockQuantity: 9,
    warrantyYears: 10,
    warrantyDetails: '10 Years Compressor Warranty + 1 Year Unit & Free 3 Services',
    rating: 4.8,
    reviewCount: 19,
    image: fridgeImg, // clean fallback
    badge: 'Agent Warranty',
    isFeatured: false,
    description: 'Engineered for tropical climates. Coanda airflow distributes refreshing cool air evenly without blasting directly at occupants. Triple Display indicates power consumption percentage in real time.',
    sinhalaDescription: 'ශ්‍රී ලංකාවේ දේශගුණයට ඉතා සුදුසු අඩු විදුලි පරිභෝජනයක් සහිත 1.5 HP ඉන්වර්ටර් වායුසමීකරණ යන්ත්‍රය.',
    features: [
      'Coanda airflow ceiling draft prevention',
      'PM 2.5 air purification particulate filter',
      'Econo mode limits maximum power consumption',
      '100% Copper condenser coil with anti-corrosion coating',
      'Stabilizer-free operation (130V - 285V)'
    ],
    specs: {
      'Cooling Capacity': '18,000 BTU (1.5 Ton)',
      'Energy Star': '5 Star Inverter',
      'Refrigerant': 'R32 Eco Gas',
      'Power Input': '1420 W',
      'Noise Level': '26 dB (Silent Sleep Mode)'
    },
    createdAt: '2026-02-14T11:00:00.000Z'
  },
  {
    id: 'kade-prod-006',
    name: 'Philips Avance Collection 1200W Induction Cooktop & Multi-Cooker',
    sinhalaName: 'ෆිලිප්ස් 1200W ඉන්ඩක්ෂන් කුකර් සහ මල්ටිකුකර්',
    category: 'kitchen_appliances',
    brand: 'Philips',
    modelNumber: 'HD4938/01',
    price: 34500,
    originalPrice: 38900,
    inStock: true,
    stockQuantity: 24,
    warrantyYears: 2,
    warrantyDetails: '2 Years Philips International Warranty',
    rating: 4.7,
    reviewCount: 56,
    image: kitchenImg,
    badge: 'New Arrival',
    isFeatured: false,
    description: 'Electromagnetic induction technology seals in nutrition and cuts cooking time in half. Premium micro-crystal glass plate with preset cooking programs tailored for Sri Lankan curry, stir-fry, milk boiling, and slow cooking.',
    sinhalaDescription: 'විනාඩි කිහිපයකින් ආහාර පිසින විදුලිය ඉතිරි කරන වීදුරු ඉන්ඩක්ෂන් කුකරය.',
    features: [
      'Full glass sensor touch control panel',
      '10 customized cooking menus including local gravies',
      'Child lock safety mechanism and auto-off sensor',
      'Cool-to-touch cooking surface prevents burns',
      '0 to 3 hour cooking timer preset'
    ],
    specs: {
      'Rated Power': '2100 Watts',
      'Plate Material': 'Full Grade A Ceramic Glass',
      'Cord Length': '1.2 meters',
      'Safety': 'Over-heat protection sensor',
      'Voltage': '220V - 240V'
    },
    createdAt: '2026-02-18T14:20:00.000Z'
  }
];

export const CATEGORIES_LIST = [
  { id: 'all', name: 'All Household Devices', sinhala: 'සියලුම උපාංග' },
  { id: 'refrigerators', name: 'Refrigerators & Freezers', sinhala: 'ශීතකරණ' },
  { id: 'washing_machines', name: 'Washing Machines & Dryers', sinhala: 'රෙදි සෝදන යන්ත්‍ර' },
  { id: 'smart_tvs', name: 'Smart 4K TVs & Audio', sinhala: 'ස්මාර්ට් ටීවී' },
  { id: 'kitchen_appliances', name: 'Kitchen & Cooking', sinhala: 'කුස්සියේ උපකරණ' },
  { id: 'cooling_air', name: 'Inverter Air Conditioners', sinhala: 'වායුසමීකරණ' },
  { id: 'home_electronics', name: 'Home Electronics & Care', sinhala: 'ගෘහස්ථ ඉලෙක්ට්‍රොනික්ස්' },
];

export const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];
