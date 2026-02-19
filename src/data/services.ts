export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  features: string[];
  seoTitle: string;
  seoDescription: string;
}

export const BOOKING_URL = 'https://procleanautodetailing.setmore.com/';

export const CONTACT = {
  phone: '509-454-9299',
  phoneLink: 'tel:+15094549299',
  email: 'detailproclean@gmail.com',
  emailLink: 'mailto:detailproclean@gmail.com',
  address: '1231 S 1st, Yakima, WA 98901',
  addressLink: 'https://www.google.com/maps/search/?api=1&query=1231+S+1st+Yakima+WA+98901',
  instagram: 'https://www.instagram.com/procleanautoyakima?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  facebook: 'https://www.facebook.com/ProCleanAutoDetail',
  hours: {
    weekday: 'Monday - Friday: 8:00 AM - 5:30 PM',
    saturday: 'Saturday: 9:00 AM - 4:00 PM',
    sunday: 'Sunday: Closed',
  },
};

export const services: Service[] = [
  {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    shortTitle: 'Ceramic Coating',
    description:
      'Protect your vehicle with professional-grade ceramic coating from Pro Clean Auto Detail Systems in Yakima, WA. Our multi-layer ceramic coatings create a durable, hydrophobic barrier that shields your paint from UV damage, chemical stains, bird droppings, and environmental contaminants. With over 15 years of expertise, we deliver a deep, glossy finish that lasts years rather than months using only industry-leading ceramic products.',
    features: [
      'Multi-layer professional-grade application',
      'Hydrophobic surface protection',
      'UV and chemical resistance',
      'Deep gloss enhancement',
      'Long-lasting durability (2-5+ years)',
      'Full paint decontamination included',
    ],
    seoTitle: 'Ceramic Coating Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Professional ceramic coating in Yakima, WA. Long-lasting paint protection with deep gloss finish. Over 15 years experience. Book today.',
  },
  {
    id: 'paint-correction',
    title: 'Paint Correction',
    shortTitle: 'Paint Correction',
    description:
      'Restore your vehicle\'s paint to its original brilliance with paint correction services from Pro Clean Auto Detail Systems. Our skilled technicians in Yakima, WA use advanced multi-stage polishing techniques to remove swirl marks, scratches, oxidation, and other imperfections that dull your vehicle\'s finish. Whether your car needs a single-stage polish or a full multi-step correction, we have the tools, products, and expertise to bring your paint back to life. Every correction begins with a thorough paint assessment to determine the best approach for your specific needs.',
    features: [
      'Multi-stage polishing process',
      'Swirl mark and scratch removal',
      'Oxidation correction',
      'Paint depth measurement',
      'Machine polishing with professional compounds',
      'Final inspection under specialized lighting',
    ],
    seoTitle: 'Paint Correction Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Expert paint correction in Yakima, WA. Remove swirls, scratches, and oxidation. 15+ years experience restoring paint finishes.',
  },
  {
    id: 'interior-detailing',
    title: 'Interior Detailing',
    shortTitle: 'Interior Detailing',
    description:
      'Experience a thoroughly refreshed cabin with interior detailing from Pro Clean Auto Detail Systems in Yakima, WA. Our comprehensive interior service covers every surface inside your vehicle, from leather conditioning and fabric extraction to dashboard restoration and odor elimination. We treat every vehicle with the same meticulous attention to detail, ensuring seats, carpets, door panels, and hard surfaces are cleaned, protected, and restored. Whether you need a routine interior refresh or a deep clean after years of use, our Yakima team delivers results you can see and feel.',
    features: [
      'Deep carpet and upholstery extraction',
      'Leather cleaning and conditioning',
      'Dashboard and trim restoration',
      'Odor elimination treatment',
      'Air vent and crevice detailing',
      'Glass cleaning inside and out',
    ],
    seoTitle: 'Interior Detailing Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Professional interior detailing in Yakima, WA. Deep cleaning, leather conditioning, odor removal. 15+ years of expert care.',
  },
  {
    id: 'exterior-detailing',
    title: 'Exterior Detailing',
    shortTitle: 'Exterior Detailing',
    description:
      'Give your vehicle the exterior treatment it deserves at Pro Clean Auto Detail Systems in Yakima, WA. Our exterior detailing service goes far beyond a standard wash. We perform a full decontamination, clay bar treatment, polish, and sealant application to restore and protect your vehicle\'s finish. Wheels, tires, trim, and glass all receive dedicated attention. With over 15 years of experience, our Yakima-based team knows how to tackle the road grime, tree sap, and harsh weather conditions that vehicles in Central Washington face every day.',
    features: [
      'Hand wash and decontamination',
      'Clay bar treatment',
      'Machine polish for gloss',
      'Paint sealant application',
      'Wheel and tire detailing',
      'Trim and glass treatment',
    ],
    seoTitle: 'Exterior Detailing Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Complete exterior detailing in Yakima, WA. Clay bar, polish, sealant, and more. Trusted by Yakima drivers for over 15 years.',
  },
  {
    id: 'wheel-restoration',
    title: 'Wheel Restoration',
    shortTitle: 'Wheel Restoration',
    description:
      'Bring your wheels back to showroom condition with wheel restoration services from Pro Clean Auto Detail Systems in Yakima, WA. Over time, brake dust, curb damage, road salt, and corrosion can take a toll on your wheels. Our team carefully cleans, repairs, and restores wheels to their original finish, removing stubborn contamination and repairing cosmetic damage. We work with alloy, chrome, and painted wheels to deliver results that complement your vehicle\'s overall appearance.',
    features: [
      'Brake dust and contamination removal',
      'Curb rash and scratch repair',
      'Alloy and chrome restoration',
      'Protective coating application',
      'Tire dressing and conditioning',
      'Detailed spoke and barrel cleaning',
    ],
    seoTitle: 'Wheel Restoration Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Professional wheel restoration in Yakima, WA. Curb rash repair, deep cleaning, and protective coating. 15+ years experience.',
  },
  {
    id: 'paint-touchup',
    title: 'Paint Touchup',
    shortTitle: 'Paint Touchup',
    description:
      'Address minor paint damage before it becomes a major problem with paint touchup services from Pro Clean Auto Detail Systems in Yakima, WA. Small chips, scratches, and nicks in your vehicle\'s paint can expose bare metal to moisture and lead to rust. Our technicians carefully match your vehicle\'s color and apply professional-grade touchup paint to blend repairs seamlessly into the surrounding finish. This service is ideal for maintaining your vehicle\'s value and appearance between major paint correction sessions.',
    features: [
      'Precise color matching',
      'Chip and scratch filling',
      'Seamless blending technique',
      'Clear coat application',
      'Rust prevention treatment',
      'Multi-panel touchup available',
    ],
    seoTitle: 'Paint Touchup Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Expert paint touchup in Yakima, WA. Color-matched chip and scratch repair. Prevent rust and maintain your vehicle\'s value.',
  },
  {
    id: 'rock-chip-repair',
    title: 'Rock Chip Repair',
    shortTitle: 'Rock Chip Repair',
    description:
      'Protect your windshield and prevent costly replacements with rock chip repair from Pro Clean Auto Detail Systems in Yakima, WA. Central Washington\'s gravel roads and highway conditions mean rock chips are a common occurrence. Our team uses professional repair techniques to fill and seal chips before they spread into cracks. A quick repair now can save you the expense and hassle of a full windshield replacement later. We handle chips of various sizes and work to restore clarity and structural integrity to your glass.',
    features: [
      'Quick and effective chip sealing',
      'Prevents crack spreading',
      'Restores glass clarity',
      'Maintains structural integrity',
      'Saves cost versus full replacement',
      'Multiple chip repairs available',
    ],
    seoTitle: 'Rock Chip Repair Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Rock chip repair in Yakima, WA. Prevent costly windshield replacements. Quick, professional chip sealing. Serving Yakima 15+ years.',
  },
  {
    id: 'paintless-dent-repair',
    title: 'Paintless Dent Repair',
    shortTitle: 'Paintless Dent Repair',
    description:
      'Restore your vehicle\'s body with paintless dent repair (PDR) from Pro Clean Auto Detail Systems in Yakima, WA. Minor dents, dings, and creases don\'t need expensive traditional bodywork or repainting. Our PDR specialists use specialized tools and techniques to carefully massage dents out from behind panels, preserving your vehicle\'s original factory paint. This cost-effective solution works perfectly for hail damage, door dings, minor collisions, and parking lot incidents. Fast turnaround times and significantly lower costs make PDR the smart choice for dent removal.',
    features: [
      'Preserves original factory paint',
      'No body filler or repainting',
      'Fast repair turnaround',
      'Cost-effective dent removal',
      'Hail damage specialist',
      'Door ding and crease repair',
    ],
    seoTitle: 'Paintless Dent Repair Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Paintless dent repair in Yakima, WA. Remove dents, dings, and hail damage without repainting. Fast, affordable, professional.',
  },
  {
    id: 'rv-detailing',
    title: 'RV Detailing',
    shortTitle: 'RV Detailing',
    description:
      'Keep your RV road-ready and looking its best with professional RV detailing from Pro Clean Auto Detail Systems in Yakima, WA. Recreational vehicles face unique challenges — extended sun exposure, road grime buildup, black streaks, and oxidized fiberglass are just a few. Our experienced team has the equipment and knowledge to handle full-size motorhomes, travel trailers, and fifth wheels. We clean, polish, and protect every exterior surface while giving the interior the deep cleaning it needs after months on the road.',
    features: [
      'Full exterior wash and decontamination',
      'Oxidation and black streak removal',
      'Fiberglass polishing and wax',
      'Roof cleaning and treatment',
      'Complete interior deep clean',
      'Awning and slide-out cleaning',
    ],
    seoTitle: 'RV Detailing Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Professional RV detailing in Yakima, WA. Full interior and exterior cleaning, oxidation removal, and protection. 15+ years experience.',
  },
  {
    id: 'boat-detailing',
    title: 'Boat Detailing',
    shortTitle: 'Boat Detailing',
    description:
      'Protect your investment on the water with professional boat detailing from Pro Clean Auto Detail Systems in Yakima, WA. Whether you trailer your boat to local lakes or store it through the off-season, our team provides thorough cleaning, polishing, and protection for gel coat, fiberglass, vinyl, and metal surfaces. We remove water spots, oxidation, and algae stains while applying marine-grade protectants to keep your boat looking sharp all season long. Serving boat owners throughout the Yakima Valley and surrounding areas.',
    features: [
      'Gel coat and fiberglass polishing',
      'Oxidation and water spot removal',
      'Vinyl and upholstery cleaning',
      'Metal brightening and protection',
      'Marine-grade wax and sealant',
      'Trailer cleaning included',
    ],
    seoTitle: 'Boat Detailing Yakima WA | Pro Clean Auto Detail Systems',
    seoDescription: 'Professional boat detailing in Yakima, WA. Gel coat polishing, oxidation removal, and marine protection. Trusted local experts.',
  },
];
