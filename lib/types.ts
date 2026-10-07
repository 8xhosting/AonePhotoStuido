/**
 * Shared entity types for the admin panel and data store.
 * All entities use string UUID ids and ISO date strings.
 */

export type Role = "superadmin" | "manager" | "photographer" | "editor";

export type AdminUser = {
  id: string;
  name: string;
  mobile: string; // login id, digits only
  passHash: string;
  salt: string;
  role: Role;
  staffId?: string; // link photographer/editor users to a staff member
  active: boolean;
  createdAt: string;
};

export type EnquiryStatus = "New" | "Contacted" | "Follow-up" | "Quoted" | "Confirmed" | "Cancelled";

export type Enquiry = {
  id: string;
  ref?: string; // friendly reference like A1-2026-4831 shown to the client
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate?: string;
  location?: string;
  budget?: string;
  message?: string;
  status: EnquiryStatus;
  followUpDate?: string;
  notes?: string;
  source: string; // "website" | "admin" | "whatsapp"
};

export type Customer = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  notes?: string;
};

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  createdAt: string;
  enquiryId?: string;
  customerId?: string;
  name: string;
  phone: string;
  eventType: string;
  eventDate: string; // yyyy-mm-dd
  time?: string;
  venue?: string;
  package?: string;
  photographerId?: string;
  videographerId?: string;
  editorId?: string;
  amount: number;
  advance: number;
  status: BookingStatus;
  contract?: string;
  notes?: string;
};

export type PaymentStatus = "Paid" | "Partial" | "Pending" | "Refunded";

export type Payment = {
  id: string;
  createdAt: string;
  bookingId?: string;
  client: string;
  amount: number;
  method: string; // Cash / UPI / Bank Transfer / Card / Cheque
  txnId?: string;
  date: string;
  status: PaymentStatus;
  notes?: string;
};

export type StaffRole = "Photographer" | "Videographer" | "Editor" | "Drone Operator" | "Other";

export type Staff = {
  id: string;
  createdAt: string;
  name: string;
  role: StaffRole;
  phone?: string;
  active: boolean;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  image: string;
  desc: string;
  tag?: string;
  price?: string;
  features: string[];
  gallery: string[];
  active: boolean;
  seoTitle?: string;
  seoDesc?: string;
};

export type Package = {
  id: string;
  name: string;
  price: string;
  discountPrice?: string;
  duration?: string;
  photos?: string;
  videoDuration?: string;
  deliverables: string[];
  features: string[];
  addons: string[];
  featured: boolean;
  active: boolean;
};

export type AlbumPhoto = { url: string; caption?: string };

export type Album = {
  id: string;
  createdAt: string;
  title: string;
  category: string; // Wedding / Pre-Wedding / Birthday / Baby / Events / Drone / Before-After / Other
  cover: string;
  photos: AlbumPhoto[];
  videos: string[];
  featured: boolean;
};

export type Testimonial = {
  id: string;
  createdAt: string;
  name: string;
  photo?: string;
  rating: number; // 1..5
  text: string;
  event?: string;
  published: boolean;
  featured: boolean;
};

export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  validFrom?: string;
  validTo?: string;
  minBooking?: number;
  active: boolean;
};

export type Notification = {
  id: string;
  createdAt: string;
  type: "enquiry" | "booking" | "payment" | "event" | "followup" | "system";
  title: string;
  body?: string;
  read: boolean;
  link?: string;
};

export type WhatsAppTemplate = {
  id: string;
  key: string; // enquiry-received, quotation, booking-confirmation, payment-reminder, event-reminder, thank-you
  title: string;
  body: string; // supports {{name}}, {{ref}}, {{service}}, {{date}}, {{amount}}, {{studio}}, {{phone}}
};

export type SiteSettings = {
  sessionSecret: string;
  studioName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  gstin?: string;
  currency: string;
  socials: { label: string; href: string }[];
  googleReviewUrl?: string;
  bookingTerms?: string;
  privacyPolicy?: string;
  cancellationPolicy?: string;
};

export type SiteContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroScript: string;
  heroText: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  contactNote: string;
};

export type PageSEO = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
};

export type SEOData = {
  pages: Record<string, PageSEO>; // key: "/" | "/about" | "/services" ...
  robots: string; // "index" | "noindex"
};

/** A booked event shown on the calendar. */
export type CalendarEvent = {
  date: string;
  title: string;
  category: string;
  color: string;
  time?: string;
};
