/**
 * Central content hub for the whole website.
 * All text, images, services, packages and reviews come from this single file,
 * so they can later be swapped out easily from an admin panel.
 */

export const site = {
  name: "A One Photo Studio",
  tagline: "We Frame Your Memories",
  phone: "+91 9105501322",
  phoneRaw: "919105501322",
  whatsapp: "919105501322",
  email: "aonephotostudio@gmail.com",
  address: "Main Market Road, Your City, State",
  hours: "Mon - Sun · 9 AM - 8 PM",
  socials: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
    { label: "WhatsApp", href: "https://wa.me/919105501322", icon: "whatsapp" },
  ],
};

/**
 * Image registry — every photo on the site is referenced through this object,
 * so an admin panel can later swap any of these paths in one place.
 * Real studio photos: gear, studio wall/shop, wedding + album designs, newborn.
 * The 3 legacy files keep working too (their original filenames are swapped
 * relative to content, which the two comments below document).
 */
export const IMG = {
  poster: "/images/photographer.jpeg", // tall dark brand poster (couple + gift items)
  posterLight: "/images/poster-light.jpeg", // light brand poster version
  portrait: "/images/studio-poster.jpeg", // photographer portrait (man with camera)
  event: "/images/event-bg.png", // wide event-hall shot with bokeh lights
  gear: "/images/studio-gear.jpeg", // camera equipment wall with studio neon
  studioWall: "/images/studio-wall.jpeg", // studio interior photo wall
  studioShop: "/images/studio-shop.jpeg", // studio shop counter interior
  weddingCollage: "/images/wedding-collage.jpeg", // 6-photo real wedding collage
  albumBride: "/images/album-bride.jpeg", // "The Bride" album spread
  albumWedding: "/images/album-wedding.jpeg", // wedding ceremony album spread
  albumLoveStory: "/images/album-love-story.jpeg", // love story album cover
  albumEngagement: "/images/album-engagement.jpeg", // engagement album spread
  albumKrishna: "/images/album-krishna.jpeg", // little-krishna baby album design
  newbornCollage: "/images/newborn-collage.jpeg", // newborn session collage
  giftPoster: "/images/gift-poster.jpeg", // gift items promo poster
};

export type Service = {
  slug: string;
  title: string;
  image: string;
  pos: string;
  tint: string;
  desc: string;
  tag: string;
  includes: string[];
};

export const services: Service[] = [
  {
    slug: "wedding", title: "Wedding Photography", image: IMG.weddingCollage, pos: "center", tint: "none",
    desc: "Candid, traditional and cinematic coverage for your complete wedding story.",
    tag: "Most Booked",
    includes: ["2-3 Day Coverage", "Candid + Traditional", "Cinematic Highlights Film", "Premium Album"],
  },
  {
    slug: "pre-wedding", title: "Pre-Wedding Shoot", image: IMG.albumEngagement, pos: "center", tint: "none",
    desc: "Romantic concepts, outdoor locations and portraits designed around your story.",
    tag: "Trending",
    includes: ["Location Scouting", "Outfit Guidance", "Same-Day Teaser", "20+ Edited Photos"],
  },
  {
    slug: "candid", title: "Candid & Cinematic", image: IMG.portrait, pos: "center 18%", tint: "none",
    desc: "Natural emotions and story-driven photography and films, unposed and real.",
    tag: "Signature",
    includes: ["Documentary Style", "Prime Lens Coverage", "Same-Day Edits", "Reels & Shorts"],
  },
  {
    slug: "birthday", title: "Birthday Photography", image: IMG.studioWall, pos: "center 60%", tint: "warm",
    desc: "Joyful family moments, cake smash fun and full celebration coverage.",
    tag: "Family",
    includes: ["Decor Captures", "Cake Moment Coverage", "Family Portraits", "48H Delivery"],
  },
  {
    slug: "new-born", title: "New Born Baby Shoot", image: IMG.newbornCollage, pos: "center", tint: "none",
    desc: "Gentle, warm in-studio or home sessions focused on your baby and family.",
    tag: "In Studio",
    includes: ["Safe Props & Wraps", "Parent + Baby Poses", "Soft Pastel Sets", "Custom Albums"],
  },
  {
    slug: "events", title: "Event Coverage", image: IMG.event, pos: "center 55%", tint: "warm",
    desc: "Professional photo and video coverage for sangeet, receptions and functions.",
    tag: "Multi-Day",
    includes: ["Multi-Camera Setup", "Live Screen Feed", "Full Event Film", "Group Portraits"],
  },
  {
    slug: "drone", title: "Drone Photography", image: IMG.posterLight, pos: "center 74%", tint: "none",
    desc: "Licensed aerial visuals that add cinematic scale to your celebration.",
    tag: "4K Aerial",
    includes: ["Licensed Pilot", "4K Aerial Film", "Venue Flyovers", "Couple Top Shots"],
  },
  {
    slug: "editing", title: "Photo & Video Editing", image: IMG.gear, pos: "center", tint: "none",
    desc: "Carefully colour-graded photographs and cinematic edits for your memories.",
    tag: "Post Studio",
    includes: ["Colour Grading", "Retouching", "Reel Editing", "Album Design"],
  },
];

export type Work = {
  title: string;
  cat: string;
  image: string;
  pos: string;
  tint: string;
};

export const portfolio: Work[] = [
  { title: "Real Wedding Moments", cat: "Wedding", image: IMG.weddingCollage, pos: "center", tint: "none" },
  { title: "The Bride — Album Design", cat: "Wedding", image: IMG.albumBride, pos: "center", tint: "none" },
  { title: "Wedding Ceremony Album", cat: "Wedding", image: IMG.albumWedding, pos: "center", tint: "none" },
  { title: "Love Story Album", cat: "Wedding", image: IMG.albumLoveStory, pos: "center", tint: "none" },
  { title: "Engagement Album", cat: "Pre-Wedding", image: IMG.albumEngagement, pos: "center", tint: "none" },
  { title: "Little Krishna Concept", cat: "Newborn", image: IMG.albumKrishna, pos: "center 25%", tint: "none" },
  { title: "New Born Session", cat: "Newborn", image: IMG.newbornCollage, pos: "center", tint: "none" },
  { title: "Behind The Scenes", cat: "Candid", image: IMG.portrait, pos: "center 18%", tint: "none" },
  { title: "Pre-Wedding Films", cat: "Pre-Wedding", image: IMG.event, pos: "center 40%", tint: "cool" },
  { title: "Sangeet Nights", cat: "Events", image: IMG.event, pos: "right center", tint: "rose" },
  { title: "Studio & Equipment", cat: "Cinematic", image: IMG.gear, pos: "center", tint: "none" },
  { title: "Creative Portrait", cat: "Candid", image: IMG.portrait, pos: "center 30%", tint: "mono" },
];

export const workCats = ["All", "Wedding", "Pre-Wedding", "Candid", "Newborn", "Events", "Cinematic"];

export type Pack = {
  name: string;
  price: string;
  popular?: boolean;
  features: string[];
};

export const packages: Pack[] = [
  {
    name: "Basic Package", price: "₹9,999",
    features: ["Photography (Unlimited)", "Basic Video Coverage", "All Original Photos", "Online Gallery", "1 Photographer"],
  },
  {
    name: "Premium Package", price: "₹24,999", popular: true,
    features: ["Candid Photography", "Cinematic Video (HD)", "Drone Shoot (Basic)", "Premium Photo Album", "2 Photographers", "Same-Day Teaser"],
  },
  {
    name: "Ultimate Package", price: "₹49,999",
    features: ["Candid + Traditional Photography", "Cinematic Full Video (4K)", "Drone Shoot (Advanced)", "Premium Album + Photobook", "3 Photographers + 1 Videographer", "Same-Day Edit Reel"],
  },
];

export type Review = { name: string; event: string; text: string; stars: number };

export const reviews: Review[] = [
  { name: "Rohit Sharma", event: "Wedding", stars: 5, text: "Amazing work! Very professional team and beautiful photos. Every ritual was captured perfectly." },
  { name: "Neha Verma", event: "Pre-Wedding", stars: 5, text: "Our pre-wedding shoot was just perfect. Creative ideas, great locations and high quality photos." },
  { name: "Amit Kumar", event: "Birthday", stars: 5, text: "Excellent service and beautiful memories from our daughter's birthday. Delivery was super fast." },
  { name: "Priya Singh", event: "Wedding", stars: 5, text: "The cinematic wedding film made our families emotional. Worth every rupee, highly recommended." },
  { name: "Vikram Patel", event: "Event", stars: 4, text: "Booked them for our office annual day. Punctual team, great candid shots of everyone." },
  { name: "Sneha Gupta", event: "New Born", stars: 5, text: "So gentle and patient with our 15-day-old baby. The pastel setups looked dreamy in photos." },
  { name: "Arjun Mehta", event: "Pre-Wedding", stars: 5, text: "Drone shots at sunset were breathtaking. The team made us feel comfortable throughout." },
  { name: "Kavita Joshi", event: "Wedding", stars: 5, text: "From haldi to vidaai, nothing was missed. The album quality is premium and precious." },
];

export const stats = [
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 1000, suffix: "+", label: "Events Covered" },
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 4, suffix: "K", label: "Photo & Video Quality", prefix: "HD " },
];

export const features = [
  { icon: "⭐", title: "Experienced Team", text: "Skilled photographers and filmmakers who have covered 1000+ celebrations." },
  { icon: "🎥", title: "Cinematic Films", text: "Story-driven wedding films with professional colour grading and sound design." },
  { icon: "🚁", title: "Drone Coverage", text: "Licensed aerial pilots capturing breathtaking 4K top views of your venue." },
  { icon: "⚡", title: "Fast Delivery", text: "Same-day teasers, quick edited galleries and premium albums on time." },
  { icon: "💡", title: "Modern Equipment", text: "Full-frame cameras, prime lenses, stabilisers and professional lighting." },
  { icon: "🤝", title: "Personal Service", text: "A dedicated coordinator from enquiry to delivery, always one call away." },
];

export const processSteps = [
  { step: "Plan", text: "We understand your story, dates, venue and shot expectations in detail." },
  { step: "Shoot", text: "Punctual, friendly team with pro gear capturing every real emotion." },
  { step: "Edit", text: "Careful curation, colour grading and cinematic editing of your memories." },
  { step: "Deliver", text: "Online gallery, films and premium albums delivered right on schedule." },
];

export const faqs = [
  { q: "How far in advance should we book?", a: "For weddings, 2-3 months in advance is ideal as dates fill fast in season. For birthdays and smaller events, 2-3 weeks is usually enough." },
  { q: "Do you travel outside the city?", a: "Yes, we cover destination weddings and outstation events. Travel and stay charges are shared upfront during booking." },
  { q: "Can packages be customised?", a: "Absolutely. Packages are starting points — hours, crew size, albums and films can all be adjusted to your needs and budget." },
  { q: "How soon do we get the photos?", a: "A same-day teaser is shared for weddings. Full edited galleries are delivered within 2-3 weeks, and premium albums within 4-6 weeks." },
  { q: "Do you provide both photo and video?", a: "Yes. Photo, cinematic video, drone and same-day edits can all be combined in a single crew as per your package." },
  { q: "Is drone coverage available at all venues?", a: "Drone shots depend on venue permission and local regulations. We handle approvals and will always suggest alternatives if restricted." },
];
