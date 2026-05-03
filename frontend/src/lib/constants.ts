import type { NavLink, ServiceItem, StatItem, TeamMember } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "Building2",
    title: "Architectural Design",
    description:
      "From concept to construction, we craft buildings that harmonize form, function, and context.",
    features: [
      "Concept Development",
      "Schematic Design",
      "Design Development",
      "Construction Documents",
    ],
  },
  {
    icon: "Sofa",
    title: "Interior Architecture",
    description:
      "Thoughtful interior environments that elevate everyday living and working experiences.",
    features: [
      "Space Planning",
      "Material Selection",
      "Custom Furniture",
      "Lighting Design",
    ],
  },
  {
    icon: "TreePine",
    title: "Landscape Design",
    description:
      "Seamless transitions between built and natural environments through considered landscape planning.",
    features: [
      "Site Analysis",
      "Planting Design",
      "Hardscape Planning",
      "Sustainability",
    ],
  },
  {
    icon: "MapPin",
    title: "Urban Planning",
    description:
      "Visionary master planning that creates vibrant, sustainable communities for the future.",
    features: [
      "Master Planning",
      "Mixed-Use Development",
      "Public Space Design",
      "Transit-Oriented Design",
    ],
  },
  {
    icon: "Cpu",
    title: "3D Visualization",
    description:
      "Photorealistic renders and immersive walkthroughs that bring your vision to life before ground breaks.",
    features: [
      "3D Rendering",
      "Virtual Reality",
      "Animation",
      "Physical Models",
    ],
  },
  {
    icon: "FileCheck",
    title: "Project Management",
    description:
      "End-to-end project oversight ensuring on-time, on-budget delivery without compromise on quality.",
    features: [
      "Site Supervision",
      "Cost Management",
      "Contractor Coordination",
      "Quality Control",
    ],
  },
];

export const STATS: StatItem[] = [
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 5, suffix: " yrs", label: "Years of Experience" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 3, suffix: "+", label: "Cities Served" },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Ar. Sidhardh Baji",
    role: "Founder & Chief Architect",
    bio: "Sid is a design maverick who creates practical, sustainable, and innovative spaces that leave a lasting impression. He holds a bachelor's degree in architecture from Mcgan's Ooty School of Architecture and has worked on landmark projects including IIT Cube, SIPCOT Industrial Park in Chennai, and Naida Cave renovation in Daman and Diu.",
    photo: "/images/team/sid.webp",
    linkedin: "#",
  },
  {
    name: "Krishna Raj",
    role: "Business Management",
    bio: "Krishna is a business management maven with killer skills in strategic planning, project management, and business development. He thinks creatively, builds strong client relationships, and is all about coaching his team to greatness.",
    photo: "/images/team/krishna.webp",
    linkedin: "#",
  },
];

export const PROJECT_CATEGORIES = [
  { value: "all", label: "All Projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "interior", label: "Interior" },
  { value: "landscape", label: "Landscape" },
  { value: "urban", label: "Urban" },
  { value: "cultural", label: "Cultural" },
];

export const SERVICES_LIST = [
  "Architectural Design",
  "Interior Architecture",
  "Landscape Design",
  "Urban Planning",
  "3D Visualization",
  "Project Management",
  "Renovation & Restoration",
];

export const COMPANY_INFO = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Ethos Habitats",
  tagline: "Socially Responsible Architecture",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "info@ethoshabitats.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+91-6374042823",
  phones: ["+91-6374042823", "+91-8667037759", "04435912677"],
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "No.240/1A, Rohini Flats, Anna Nagar West, Thirumangalam, Chennai-600101",
  whatsapp: "+916374042823",
  lat: Number(process.env.NEXT_PUBLIC_MAP_LAT ?? "13.0843"),
  lng: Number(process.env.NEXT_PUBLIC_MAP_LNG ?? "80.2102"),
  social: {
    instagram: "https://instagram.com/ethoshabitats",
    linkedin: "https://linkedin.com/company/ethoshabitats",
    pinterest: "https://pinterest.com",
    houzz: "https://houzz.com",
  },
};

export const COLLABORATORS = [
  { name: "Earthscape Studio", description: "Landscape & Environmental Design", href: "#" },
];

export const EMPLOYMENT_INFO = {
  internship: {
    title: "Intern",
    description:
      "We receive a large number of applications for Internship. We are a small office and will not be able to reply immediately. Once you are shortlisted you will receive a mail from us for an interview. Do note only shortlisted candidates will receive a reply mail. We are genuinely sorry for not replying to every single one of you.",
    note: "(Note: Do not send printed matter or original work. We cannot be responsible for nor can we return original work)",
    email: "info@ethoshabitats.com",
  },
  work: {
    title: "Work",
    description:
      "If you think you can produce your best under pressure in a chaotic environment, please send us a cover letter, resume and work samples as PDF documents (not more than 5mb)",
    note: "Architects, please apply to info@ethoshabitats.com",
    email: "info@ethoshabitats.com",
  },
};
