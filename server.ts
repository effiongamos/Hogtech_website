import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { getDb, saveDb, SiteData } from './data/defaultData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client (User-Agent header required by system instructions)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Admin auth middleware check
const ADMIN_SECRET = process.env.ADMIN_KEY || 'hogtech2026';
function isAuthenticated(req: Request): boolean {
  const auth = req.headers.authorization;
  return auth === `Bearer ${ADMIN_SECRET}`;
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// 1. Get site content (public view)
app.get('/api/site-data', (req: Request, res: Response) => {
  const db = getDb();
  // Return public subset
  res.json({
    settings: db.settings,
    announcements: db.announcements.filter(a => a.published),
    services: db.services,
    portfolio: db.portfolio,
    team: db.team,
    poll: db.poll,
    testimonials: db.testimonials || [],
  });
});

// 2. AI Assistant endpoint using Gemini 3.8 Flash
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const db = getDb();
    const systemPrompt = `You are the official conversational AI assistant for "Hogtech Int’l Ventures", a professional digital services, document preparation, commercial printing, computer training, and technology-enabled business solutions enterprise located in Calabar, Cross River State, Nigeria.

VERIFIED COMPANY FACTS:
- Company Name: ${db.settings.businessName}
- Physical Location: ${db.settings.address}
- Opening Hours: ${db.settings.openingHours}
- Official Phone: ${db.settings.phone}
- Official WhatsApp: ${db.settings.whatsappNumber}
- Official Email: ${db.settings.email}
- Company Tagline: "${db.settings.tagline}"
- Company Slogan: "${db.settings.slogan}"

SERVICES CATALOG:
1. Printing & Document Services: Colour and black-and-white printing, A3 and A4 printing, high-speed photocopying, digital scanning, laminating, business & complimentary cards, invitation cards, event flyers & posters, event programmes, custom contribution cards, jotters, plastic ID cards, and spiral binding.
2. Typing & Document Preparation: Professional typing, academic project formatting, editing and proofreading, CV and résumé preparation, PDF and Word conversion, school and research document preparation.
3. Computer Training & Digital Skills: Fundamental computer literacy, Office applications (Microsoft Word, Excel, PowerPoint), practical digital productivity, internet research, modern AI tools for everyday workflow, and digital file management.
4. Data Entry & Administrative Support: Accurate data entry, spreadsheet preparation, online registration assistance (JAMB, WAEC, NYSC, civil service, job portals), web research, and general business administrative support.
5. Graphics & Creative Design: Event and celebration flyers, promotional graphics, business marketing materials, banners, invitation designs, letterheads, and brand identity.
6. Stationery & Office Supplies: Office folders, files, envelopes, binding materials, quality paper reams, customized jotters, and office consumables.

RULES FOR YOUR RESPONSES:
- Be welcoming, professional, articulate, and trustworthy.
- Answer questions accurately using only verified information.
- NEVER invent or guess specific prices, delivery turnaround times, discounts, or guarantees. Explain that exact quotes depend on specifications (quantity, paper weight, binding type, urgency) and invite the user to request a quote via the website form or WhatsApp.
- If a visitor asks about something outside Hogtech's offerings, politely clarify what Hogtech does and offer to connect them to the team via WhatsApp.
- When appropriate, encourage the visitor to chat directly with Hogtech staff on WhatsApp (${db.settings.whatsappNumber}) or visit the office at 76 Ekpo Abasi Street, Calabar.
- Keep answers clear, well-structured, and concise.`;

    // Format contents with history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        if (turn.role === 'user' || turn.role === 'model') {
          contents.push({
            role: turn.role,
            parts: [{ text: String(turn.content || turn.text || '') }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let reply = '';
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      reply = `Welcome to Hogtech Int’l Ventures! I am your AI assistant for our digital printing, document preparation, and computer training center at 76 Ekpo Abasi Street, Calabar.\n\nTo connect live AI model responses via Gemini, ensure your GEMINI_API_KEY is configured in your project secrets. In the meantime, you can browse all 6 service categories or click the WhatsApp button to chat with our team directly!`;
    } else {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), 8000)
      );

      try {
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        const response = (await Promise.race([aiPromise, timeoutPromise])) as any;
        reply = response?.text || '';
      } catch (primaryErr: any) {
        console.warn('gemini-3.1-flash-lite error, attempting gemini-3.8-flash:', primaryErr?.message);
        try {
          const fallbackPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          });
          const response = (await Promise.race([fallbackPromise, timeoutPromise])) as any;
          reply = response?.text || '';
        } catch (secondaryErr) {
          throw primaryErr;
        }
      }
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Chat AI error:', error);
    // Graceful fallback with human handoff
    res.json({
      reply: 'Welcome to Hogtech Int’l Ventures! For immediate assistance, direct quotes, or urgent service orders, please connect directly with our office on WhatsApp (+234 903 502 9081 / +234 814 219 5668) or visit 76 Ekpo Abasi Street, Calabar.',
      error: error?.message,
    });
  }
});

// 3. Service Request Submission
app.post('/api/submissions/service-request', (req: Request, res: Response) => {
  const { fullName, phoneOrEmail, serviceCategory, serviceItem, details } = req.body;
  if (!fullName || !phoneOrEmail || !serviceCategory) {
    res.status(400).json({ error: 'Please provide full name, contact, and service category.' });
    return;
  }

  const db = getDb();
  const id = `req-${Date.now().toString(36)}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newSubmission = {
    id,
    timestamp: now,
    fullName: String(fullName).trim(),
    phoneOrEmail: String(phoneOrEmail).trim(),
    serviceCategory: String(serviceCategory).trim(),
    serviceItem: String(serviceItem || 'General Inquiry').trim(),
    details: String(details || '').trim(),
    status: 'pending' as const,
  };

  db.submissions.serviceRequests.unshift(newSubmission);
  saveDb(db);

  // Generate WhatsApp prefilled message
  const waNum = db.settings.whatsappNumber.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Hello Hogtech Int’l Ventures. I submitted a service request on your website.\n\nName: ${fullName}\nService: ${serviceCategory} (${serviceItem || 'General'})\nDetails: ${details || 'Looking forward to your quote.'}`
  );
  const whatsappUrl = `https://wa.me/${waNum}?text=${waText}`;

  res.json({ success: true, id, whatsappUrl });
});

// 4. Training Registration Submission
app.post('/api/submissions/training', (req: Request, res: Response) => {
  const { fullName, email, phone, program, preferredSchedule } = req.body;
  if (!fullName || !phone || !program) {
    res.status(400).json({ error: 'Please provide your full name, phone number, and selected program.' });
    return;
  }

  const db = getDb();
  const id = `trn-${Date.now().toString(36)}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newReg = {
    id,
    timestamp: now,
    fullName: String(fullName).trim(),
    email: String(email || '').trim(),
    phone: String(phone).trim(),
    program: String(program).trim(),
    preferredSchedule: String(preferredSchedule || 'Flexible').trim(),
    status: 'new' as const,
  };

  db.submissions.trainingRegistrations.unshift(newReg);
  saveDb(db);

  const waNum = db.settings.whatsappNumber.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Hello Hogtech Int’l Ventures. I registered for training on your website:\n\nName: ${fullName}\nProgram: ${program}\nSchedule: ${preferredSchedule || 'Flexible'}\nPhone: ${phone}`
  );
  const whatsappUrl = `https://wa.me/${waNum}?text=${waText}`;

  res.json({ success: true, id, whatsappUrl });
});

// 5. General Contact Message Submission
app.post('/api/submissions/contact', (req: Request, res: Response) => {
  const { name, contact, serviceInterest, subject, message } = req.body;
  if (!name || !contact || !message) {
    res.status(400).json({ error: 'Please provide name, contact details, and your message.' });
    return;
  }

  const db = getDb();
  const id = `msg-${Date.now().toString(36)}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newMsg = {
    id,
    timestamp: now,
    name: String(name).trim(),
    contact: String(contact).trim(),
    serviceInterest: String(serviceInterest || 'General Inquiry').trim(),
    subject: String(subject || 'General Inquiry').trim(),
    message: String(message).trim(),
    status: 'unread' as const,
  };

  db.submissions.contactMessages.unshift(newMsg);
  saveDb(db);

  res.json({ success: true, id });
});

// 6. Survey / Poll Vote
app.post('/api/surveys/vote', (req: Request, res: Response) => {
  const { optionId } = req.body;
  if (!optionId) {
    res.status(400).json({ error: 'optionId is required' });
    return;
  }

  const db = getDb();
  const option = db.poll.options.find(o => o.id === optionId);
  if (!option) {
    res.status(404).json({ error: 'Option not found' });
    return;
  }

  option.votes += 1;
  saveDb(db);

  res.json({ success: true, poll: db.poll });
});

// 7. Testimonials List & Submission
app.get('/api/testimonials', (req: Request, res: Response) => {
  const db = getDb();
  res.json({ testimonials: db.testimonials || [] });
});

app.post('/api/testimonials', (req: Request, res: Response) => {
  const { name, role, organization, category, serviceUsed, rating, comment, location } = req.body;
  if (!name || !comment || !serviceUsed) {
    res.status(400).json({ error: 'Name, service used, and feedback comment are required.' });
    return;
  }

  const db = getDb();
  if (!db.testimonials) {
    db.testimonials = [];
  }

  // Generate initials
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'CU';

  const newTestimonial = {
    id: `test-${Date.now().toString(36)}`,
    name: String(name).trim(),
    role: String(role || 'Client').trim(),
    organization: organization ? String(organization).trim() : undefined,
    category: (['Printing & Binding', 'Computer Training', 'Event & Stationery', 'Typing & Data Entry', 'Design & Branding'].includes(category)
      ? category
      : 'Printing & Binding') as any,
    serviceUsed: String(serviceUsed).trim(),
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    comment: String(comment).trim(),
    date: 'Just now',
    verified: true,
    avatarInitials: initials,
    tag: String(serviceUsed).trim().split(' ').slice(0, 3).join(' '),
    location: location ? String(location).trim() : 'Calabar',
  };

  db.testimonials.unshift(newTestimonial);
  saveDb(db);

  res.json({ success: true, testimonial: newTestimonial });
});

// -------------------------------------------------------------
// ADMIN ENDPOINTS (PERSISTENT & PROTECTED)
// -------------------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_SECRET) {
    res.json({ success: true, token: ADMIN_SECRET });
  } else {
    res.status(401).json({ error: 'Invalid administrator key.' });
  }
});

// Admin Get Full Database
app.get('/api/admin/data', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = getDb();
  res.json(db);
});

// Admin Update Settings
app.post('/api/admin/settings', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// Admin Announcement Create / Edit
app.post('/api/admin/announcements', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = getDb();
  const ann = req.body;
  if (!ann.id) {
    ann.id = `ann-${Date.now().toString(36)}`;
    ann.date = ann.date || 'October 2026';
    db.announcements.unshift(ann);
  } else {
    const idx = db.announcements.findIndex(a => a.id === ann.id);
    if (idx !== -1) {
      db.announcements[idx] = { ...db.announcements[idx], ...ann };
    } else {
      db.announcements.unshift(ann);
    }
  }
  saveDb(db);
  res.json({ success: true, announcements: db.announcements });
});

// Admin Announcement Delete
app.delete('/api/admin/announcements/:id', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = getDb();
  db.announcements = db.announcements.filter(a => a.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, announcements: db.announcements });
});

// Admin Portfolio Create / Edit
app.post('/api/admin/portfolio', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = getDb();
  const item = req.body;
  if (!item.id) {
    item.id = `port-${Date.now().toString(36)}`;
    db.portfolio.unshift(item);
  } else {
    const idx = db.portfolio.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      db.portfolio[idx] = { ...db.portfolio[idx], ...item };
    } else {
      db.portfolio.unshift(item);
    }
  }
  saveDb(db);
  res.json({ success: true, portfolio: db.portfolio });
});

// Admin Portfolio Delete
app.delete('/api/admin/portfolio/:id', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const db = getDb();
  db.portfolio = db.portfolio.filter(p => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, portfolio: db.portfolio });
});

// Admin Update Submission Status
app.post('/api/admin/submission-status', (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { type, id, status } = req.body;
  const db = getDb();
  if (type === 'serviceRequest') {
    const item = db.submissions.serviceRequests.find(s => s.id === id);
    if (item) item.status = status;
  } else if (type === 'trainingRegistration') {
    const item = db.submissions.trainingRegistrations.find(s => s.id === id);
    if (item) item.status = status;
  } else if (type === 'contactMessage') {
    const item = db.submissions.contactMessages.find(s => s.id === id);
    if (item) item.status = status;
  }
  saveDb(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// VITE INTEGRATION / STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Hogtech Int’l Ventures server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
