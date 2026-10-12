import fs from 'node:fs';
import path from 'node:path';

export interface SiteData {
  settings: {
    businessName: string;
    tagline: string;
    slogan: string;
    address: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    openingHours: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    linkedinUrl: string;
    whatsappCommunityUrl: string;
  };
  announcements: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    summary: string;
    content: string;
    published: boolean;
    badge?: string;
  }>;
  services: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    items: string[];
    image: string;
    popular?: boolean;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    completionDate?: string;
    clientType?: string;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    image?: string;
    isPlaceholder?: boolean;
  }>;
  poll: {
    id: string;
    question: string;
    description: string;
    options: Array<{
      id: string;
      text: string;
      votes: number;
    }>;
  };
  testimonials?: Array<{
    id: string;
    name: string;
    role: string;
    organization?: string;
    category: 'Printing & Binding' | 'Computer Training' | 'Event & Stationery' | 'Typing & Data Entry' | 'Design & Branding';
    serviceUsed: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    avatarInitials: string;
    tag?: string;
    location?: string;
  }>;
  submissions: {
    serviceRequests: Array<{
      id: string;
      timestamp: string;
      fullName: string;
      phoneOrEmail: string;
      serviceCategory: string;
      serviceItem: string;
      details: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
    trainingRegistrations: Array<{
      id: string;
      timestamp: string;
      fullName: string;
      email: string;
      phone: string;
      program: string;
      preferredSchedule: string;
      status: 'new' | 'contacted' | 'enrolled';
    }>;
    contactMessages: Array<{
      id: string;
      timestamp: string;
      name: string;
      contact: string;
      serviceInterest: string;
      subject: string;
      message: string;
      status: 'unread' | 'read' | 'replied';
    }>;
  };
}

export const defaultSiteData: SiteData = {
  settings: {
    businessName: "Hogtech Int'l Ventures",
    tagline: "Innovation · Print · Tech · Solutions",
    slogan: "Your Vision, Our Priority",
    address: "76 Ekpo Abasi Street, Calabar, Cross River State, Nigeria",
    phone: "+234 903 502 9081 / +234 814 219 5668",
    whatsappNumber: "2349035029081",
    email: "info@hogtechventures.com",
    openingHours: "Monday – Friday: 8:00 AM – 8:00 PM · Saturday: 10:00 AM – 7:00 PM (WAT)",
    facebookUrl: "https://facebook.com/hogtechventures",
    instagramUrl: "https://instagram.com/hogtechventures",
    tiktokUrl: "https://tiktok.com/@hogtechventures",
    linkedinUrl: "https://linkedin.com/company/hogtech-ventures",
    whatsappCommunityUrl: "https://wa.me/2349035029081",
  },
  announcements: [
    {
      id: "ann-01",
      title: "Enrollment Open: Practical Computer Training & Digital Skills",
      category: "Training Opportunity",
      date: "October 2026",
      summary: "Hands-on instruction in office productivity (Word, Excel, PowerPoint), digital file management, and practical modern computer literacy for students, job seekers, and professionals.",
      content: "Registration is ongoing for our comprehensive computer literacy and digital productivity batches. Classes feature individual computer stations, practical step-by-step guidance, and real-world project assignments to ensure you gain employable and productive skills. Visit our center at 76 Ekpo Abasi Street or register online today.",
      published: true,
      badge: "Open for Admission"
    },
    {
      id: "ann-02",
      title: "Custom Event Printing & Stationery Packages",
      category: "Printing & Design",
      date: "October 2026",
      summary: "High-definition color printing for event programmes, wedding brochures, customized contribution jotters, and invitation cards with pristine finishing.",
      content: "Planning a wedding, anniversary, burial ceremony, or corporate seminar in Calabar? Hogtech offers end-to-end design, color separation, and heavy-duty printing on premium art paper with laminating and spiral or staple binding options.",
      published: true,
      badge: "Popular Service"
    },
    {
      id: "ann-03",
      title: "Fast-Track Online Portal Registration & Documentation",
      category: "Administrative Support",
      date: "October 2026",
      summary: "Reliable assistance with academic, examination, NYSC, recruitment, and official portal registrations with accurate scanning and passport resizing.",
      content: "Avoid errors and missed deadlines. Our dedicated documentation desks provide reliable high-speed internet, verified form completion, document upload optimization, and instant proof printing for all major online portals.",
      published: true
    }
  ],
  services: [
    {
      id: "srv-printing",
      category: "Printing & Document Services",
      title: "Commercial & Document Printing",
      description: "High-volume crisp black-and-white and vibrant full-colour printing, high-speed photocopying, large-format scanning, and protective lamination.",
      items: [
        "Colour & Black-and-White Printing",
        "A3 and A4 High-Definition Printing",
        "Fast Photocopying & Digital Scanning",
        "Matte & Gloss Document Laminating",
        "Business & Complimentary Cards",
        "Invitation Cards & Event Flyers",
        "Event Programmes & Booklets",
        "Custom Contribution Cards & Jotters",
        "Plastic ID Cards & Spiral Binding"
      ],
      image: "/src/assets/images/portfolio_event_programs_1791613507577.jpg",
      popular: true
    },
    {
      id: "srv-typing",
      category: "Typing & Document Preparation",
      title: "Professional Typing & Editorial Support",
      description: "Accurate typing, academic document formatting, proofreading, CV polishing, and seamless conversion between Word and PDF.",
      items: [
        "Rapid Professional Typing",
        "Standard Academic & Project Formatting",
        "Thorough Editing & Proofreading",
        "Professional CV & Résumé Structuring",
        "PDF to Word & Document Conversion",
        "School, Proposal & Research Document Preparation"
      ],
      image: "/src/assets/images/hero_hogtech_workspace_1791613498907.jpg"
    },
    {
      id: "srv-training",
      category: "Computer Training & Digital Skills",
      title: "Hands-On Practical ICT Training",
      description: "Learn practical, job-ready computer skills in a supportive environment with individual desktop access and experienced instructors.",
      items: [
        "Fundamental Computer Literacy",
        "Microsoft Office & Google Workspace (Word, Excel, PowerPoint)",
        "Practical Digital Productivity & Internet Research",
        "Introduction to AI Tools for Everyday Workflow",
        "Digital File Management & Data Handling"
      ],
      image: "/src/assets/images/training_digital_skills_1791613526038.jpg",
      popular: true
    },
    {
      id: "srv-admin",
      category: "Data Entry & Administrative Support",
      title: "Data Entry & Online Portal Assistance",
      description: "Fast, accurate data processing, spreadsheet compilation, online portal applications, and reliable administrative outsourcing.",
      items: [
        "High-Speed Accurate Data Entry",
        "Spreadsheet Preparation & Formulas",
        "Online Registration Assistance (JAMB, WAEC, NYSC, Job Portals)",
        "Internet Research & Information Gathering",
        "Digital File Sorting & Document Archiving",
        "General Business Administrative Support"
      ],
      image: "/src/assets/images/hero_hogtech_workspace_1791613498907.jpg"
    },
    {
      id: "srv-graphics",
      category: "Graphics & Creative Design",
      title: "Visual Branding & Graphic Design",
      description: "Eye-catching graphic design for promotional flyers, church and community events, business marketing, and social media flyers.",
      items: [
        "Flyers, Posters & Handbills",
        "Promotional & Social Media Graphics",
        "Business Marketing Materials & Banners",
        "Event, Wedding & Celebration Designs",
        "Branded Letterheads & Logo Cleanups"
      ],
      image: "/src/assets/images/portfolio_branding_suite_1791613516522.jpg",
      popular: true
    },
    {
      id: "srv-stationery",
      category: "Stationery & Office Supplies",
      title: "Office Stationery & Binding Supplies",
      description: "Essential office supplies, durable document files, paper reams, spiral combs, and customized stationery for offices and students.",
      items: [
        "Office Folders, Files & Envelopes",
        "Spiral Binding Combs & Plastic Covers",
        "Quality Bond & Art Paper Reams",
        "Customized Branded Jotters & Memo Pads",
        "General Office Consumables"
      ],
      image: "/src/assets/images/portfolio_event_programs_1791613507577.jpg"
    }
  ],
  portfolio: [
    {
      id: "port-01",
      title: "Cross River State Summit Programme & Materials",
      category: "Printing & Editorial",
      description: "Complete design layout, high-density color printing, and booklet binding for regional summit delegates.",
      image: "/src/assets/images/hero_hogtech_workspace_1791613498907.jpg",
      completionDate: "September 2026",
      clientType: "Corporate Conference"
    },
    {
      id: "port-02",
      title: "Deluxe Celebration Jotters & Event Invitation Set",
      category: "Custom Stationery",
      description: "Gold-accented hardbound souvenir jotters, foil-stamped event invitation cards, and banquet order of events.",
      image: "/src/assets/images/portfolio_event_programs_1791613507577.jpg",
      completionDate: "August 2026",
      clientType: "Special Event"
    },
    {
      id: "port-03",
      title: "Corporate Identity Suite & Executive Stationery",
      category: "Branding & Graphics",
      description: "Clean executive stationery design with deep navy and teal brand styling, custom business cards, and presentation folders.",
      image: "/src/assets/images/portfolio_branding_suite_1791613516522.jpg",
      completionDate: "October 2026",
      clientType: "Business Client"
    },
    {
      id: "port-04",
      title: "Practical ICT & Office Productivity Training Cohort",
      category: "Computer Training",
      description: "Successful 6-week intensive digital literacy and spreadsheet training for young professionals and university graduates.",
      image: "/src/assets/images/training_digital_skills_1791613526038.jpg",
      completionDate: "July 2026",
      clientType: "Education & Skills"
    }
  ],
  team: [
    {
      id: "team-01",
      name: "Managing Director / Principal",
      role: "Managing Director & Chief Executive",
      department: "Executive Leadership",
      bio: "Overseeing executive strategy, service excellence, and technology operations at Hogtech Int'l Ventures in Calabar.",
      image: "", // Will use actual photo from upload Photo_Hogtech.jpeg
      isPlaceholder: false
    },
    {
      id: "team-02",
      name: "Lead Computer Instructor",
      role: "Senior ICT & Digital Skills Trainer",
      department: "Training & Education",
      bio: "Dedicated to guiding students and professionals through practical digital tools, office applications, and computational productivity.",
      image: "",
      isPlaceholder: true
    },
    {
      id: "team-03",
      name: "Head of Print Production",
      role: "Senior Print Production Specialist",
      department: "Printing & Finishing",
      bio: "Ensures flawless print execution, accurate color reproduction, and high-standard finishing for all customer orders.",
      image: "",
      isPlaceholder: true
    },
    {
      id: "team-04",
      name: "Administrative & Client Services Desk",
      role: "Customer Service & Data Specialist",
      department: "Client Services",
      bio: "Managing front-desk inquiries, online portal registrations, and smooth document intake with friendly professionalism.",
      image: "",
      isPlaceholder: true
    }
  ],
  poll: {
    id: "poll-skills-2026",
    question: "Which computer skill or digital service would you like Hogtech to offer next?",
    description: "Help us expand our service catalog and training workshops to match your exact goals.",
    options: [
      { id: "opt-1", text: "Advanced Excel & Data Analytics", votes: 42 },
      { id: "opt-2", text: "Graphic Design & Flyer Masterclass", votes: 38 },
      { id: "opt-3", text: "Practical AI Productivity for Work", votes: 55 },
      { id: "opt-4", text: "Online Business Portal Setup & CV Clinic", votes: 29 }
    ]
  },
  testimonials: [
    {
      id: "test-01",
      name: "Emem Bassey",
      role: "Final Year Student Researcher",
      organization: "University of Calabar (UNICAL)",
      category: "Printing & Binding",
      serviceUsed: "Thesis Formatting, Color Plot Printing & Deluxe Hardcover Binding",
      rating: 5,
      comment: "I had less than 24 hours to turn in 4 hardbound copies of my final year research project before departmental clearance closed. Hogtech corrected my page layout margins, printed every full-color statistical chart with immaculate clarity, and had the gold-lettered hardcover binding finished early. Truly saved my graduation timeline!",
      date: "October 2026",
      verified: true,
      avatarInitials: "EB",
      tag: "Thesis & Hardbound Binding",
      location: "Calabar, Cross River"
    },
    {
      id: "test-02",
      name: "Engr. Victor Effiong",
      role: "Managing Director",
      organization: "Apex Energy & Maritime Logistics",
      category: "Design & Branding",
      serviceUsed: "Executive Brand Suite, Company Letterheads & Plastic RFID Cards",
      rating: 5,
      comment: "Hogtech handled our corporate stationery, presentation folders, and plastic staff identity cards. The print resolution on the 350gsm cardstock was crisp, and the color matching across our corporate blue and teal branding was exact. A dependable partner for business materials.",
      date: "September 2026",
      verified: true,
      avatarInitials: "VE",
      tag: "Corporate Identity & PVC Cards",
      location: "Marina Road, Calabar"
    },
    {
      id: "test-03",
      name: "Mrs. Glory Edet",
      role: "Lead Event Coordinator",
      organization: "Royal Pearls Events & Banquets",
      category: "Event & Stationery",
      serviceUsed: "250 Custom Gold-Foil Souvenir Jotters & 400 Glossy Event Programmes",
      rating: 5,
      comment: "The wedding souvenir jotters they designed and printed were the highlight of our guest tables. The gold foiling, thick laminated art-covers, and sturdy spiral binding were executed with extreme care. The couple and guests were thrilled. Hogtech is now our default printing partner.",
      date: "October 2026",
      verified: true,
      avatarInitials: "GE",
      tag: "Wedding & Souvenir Print",
      location: "State Housing Estate, Calabar"
    },
    {
      id: "test-04",
      name: "Daniel O. Asuquo",
      role: "Administrative Officer",
      organization: "Cross River State Civil Service",
      category: "Computer Training",
      serviceUsed: "Practical Microsoft Office Suite & Digital File Management",
      rating: 5,
      comment: "I enrolled in their 6-week computer literacy and practical Excel workshop. The hands-on, dedicated computer station format allowed me to master spreadsheet formulas, data filtering, and professional memo formatting. The recognized certificate helped me secure my departmental role.",
      date: "August 2026",
      verified: true,
      avatarInitials: "DA",
      tag: "Certified Computer Training",
      location: "Calabar South"
    },
    {
      id: "test-05",
      name: "Blessing N. Chukwu",
      role: "Field Coordinator",
      organization: "Niger Delta Community Health Initiative",
      category: "Typing & Data Entry",
      serviceUsed: "Survey Questionnaire Digitization, Tabulation & Statistical Entry",
      rating: 5,
      comment: "We had over 1,800 printed community health surveys that needed urgent digitization for our donor project report. Hogtech's data team handled the data entry with zero omissions and delivered structured Excel sheets with cross-checks ahead of schedule.",
      date: "September 2026",
      verified: true,
      avatarInitials: "BC",
      tag: "Data Management & Entry",
      location: "Calabar Municipal"
    },
    {
      id: "test-06",
      name: "Dr. Patrick Akpan",
      role: "Senior Lecturer & Academic Author",
      organization: "Department of Education",
      category: "Printing & Binding",
      serviceUsed: "Course Monograph Production, Matte Lamination & Wire-O Binding",
      rating: 5,
      comment: "Produced 350 copies of our university conference monographs with wire-o spiral binding and clear protective lamination. The text sharpness, double-sided alignment, and durable paper quality were outstanding. Honest pricing and prompt communication throughout.",
      date: "July 2026",
      verified: true,
      avatarInitials: "PA",
      tag: "Academic Monograph Printing",
      location: "Ekpo Abasi, Calabar"
    },
    {
      id: "test-07",
      name: "Amina Abubakar",
      role: "Creative Director",
      organization: "Amie Couture & Apparel",
      category: "Design & Branding",
      serviceUsed: "Custom Garment Hangtags, Packaging Stickers & Brand Flyers",
      rating: 5,
      comment: "From review of my design on WhatsApp to physical collection at the 76 Ekpo Abasi center, everything was smooth and courteous. The glossy vinyl stickers and branded hangtags made our boutique orders feel like high-end luxury merchandise.",
      date: "September 2026",
      verified: true,
      avatarInitials: "AA",
      tag: "Brand Packaging & Labels",
      location: "Calabar"
    },
    {
      id: "test-08",
      name: "Godwin Ita",
      role: "Graduate Trainee",
      organization: "Tech & Professional Services",
      category: "Typing & Data Entry",
      serviceUsed: "Executive CV Redesign, High-Res Certificate Scanning & Portal Submission",
      rating: 5,
      comment: "They reformatted my curriculum vitae into a clean modern standard, correctly compressed my educational credentials to portal specifications, and assisted with error-free upload. The attention to detail is unmatched in Calabar.",
      date: "October 2026",
      verified: true,
      avatarInitials: "GI",
      tag: "CV & Portal Documentation",
      location: "Calabar"
    }
  ],
  submissions: {
    serviceRequests: [
      {
        id: "req-101",
        timestamp: "2026-10-09 14:30",
        fullName: "Bassey Okon",
        phoneOrEmail: "08023456789",
        serviceCategory: "Printing & Document Services",
        serviceItem: "Event Programmes & Booklets",
        details: "Need 200 copies of 16-page full colour funeral programme booklet with glossy cover before Friday.",
        status: "in_progress"
      }
    ],
    trainingRegistrations: [
      {
        id: "trn-201",
        timestamp: "2026-10-08 11:15",
        fullName: "Ekaette Edet",
        email: "ekaette.edet@example.com",
        phone: "08134567890",
        program: "Microsoft Office & Practical Productivity",
        preferredSchedule: "Morning (9:00 AM – 11:30 AM)",
        status: "contacted"
      }
    ],
    contactMessages: [
      {
        id: "msg-301",
        timestamp: "2026-10-09 09:20",
        name: "Samuel Archibong",
        contact: "07089123456",
        serviceInterest: "Custom Contribution Cards & Jotters",
        subject: "Bulk Jotter Printing for Community Cooperative",
        message: "Good day, I would like to enquire about printing 500 spiral jotters for our cooperative society. Please share price range and lead time.",
        status: "unread"
      }
    ]
  }
};

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

export function getDb(): SiteData {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSiteData, null, 2), 'utf-8');
      return defaultSiteData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.testimonials || !Array.isArray(parsed.testimonials) || parsed.testimonials.length === 0) {
      parsed.testimonials = defaultSiteData.testimonials;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB, returning defaults:', err);
    return defaultSiteData;
  }
}

export function saveDb(data: SiteData): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}
