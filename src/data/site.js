/**
 * Single source of truth for site copy and navigation.
 * Editing this file is enough to re-word most of the site.
 */

export const brand = {
  name: 'Adsmith',
  tagline: 'Build. Market. Automate.',
  promise: 'Precision marketing, masterfully built.',
  email: 'adsmithsolutions@gmail.com',
  domain: 'adsmithsolutions.com',
  city: 'Peshawar',
  country: 'Pakistan',
  location: 'Based in Peshawar. Working with businesses across Pakistan and beyond.',
}

/** Both numbers are WhatsApp, so both link to chat rather than a dialler. */
export const phones = [
  { display: '+92 370 190 9372', wa: '923701909372' },
  { display: '+92 325 655 5185', wa: '923256555185' },
]

export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Why Adsmith', href: '#why' },
  { label: 'Process', href: '#process' },
  { label: 'WhatsApp AI', href: '#whatsapp' },
]

/**
 * Facts, not metrics. We do not have volume numbers worth publishing yet, so
 * these state what is true today rather than inventing a track record.
 */
export const heroStats = [
  { value: '24/7', label: 'Your WhatsApp agent never sleeps' },
  { value: '7', label: 'Services under one roof' },
  { value: 'Pakistan wide', label: 'Working nationwide from Peshawar' },
  { value: 'Free', label: 'Growth audit before you commit' },
]

/**
 * `size` drives the bento grid: 'lg' is a 2x2 hero tile, 'wide' spans the full
 * row, everything else is a single cell. `icon` maps to a Lucide component in
 * Services.jsx.
 */
export const services = [
  {
    id: 'whatsapp-ai',
    icon: 'whatsapp',
    name: 'WhatsApp AI Agent',
    summary:
      'It answers every message in seconds, takes the order, qualifies the lead and books the appointment. Day and night, without a person on the other end.',
    chips: ['24/7 Replies', 'Lead Qualification', 'CRM Integration', 'Multi language'],
    size: 'lg',
    featured: true,
    href: '#whatsapp',
  },
  {
    id: 'meta-ads',
    icon: 'meta',
    name: 'Meta Ads',
    summary:
      'Facebook and Instagram campaigns built around creative that gets tested properly and spend that stays profitable.',
    chips: ['Creative Testing', 'CAPI Tracking', 'Retargeting', 'Analytics'],
  },
  {
    id: 'google-ads',
    icon: 'search',
    name: 'Google Ads',
    summary: 'Catch people at the exact moment they are looking to buy what you sell.',
    chips: ['Search', 'Performance Max', 'Shopping', 'Display'],
  },
  {
    id: 'tiktok-ads',
    icon: 'video',
    name: 'TikTok Ads',
    summary: 'Creative that stops the scroll, backed by media buying that stays disciplined.',
    chips: ['UGC', 'Spark Ads', 'Hook Testing', 'Creators'],
  },
  {
    id: 'social',
    icon: 'social',
    name: 'Social Media',
    summary: 'A steady stream of content that makes your brand look as good as your product.',
    chips: ['Content', 'Reels', 'Strategy', 'Branding'],
  },
  {
    id: 'gmb',
    icon: 'pin',
    name: 'Google Business Profile',
    summary: 'Get found on Maps. Listings, reviews and the local rankings that bring people in.',
    chips: ['Listings', 'Reviews', 'Local SEO', 'Maps'],
  },
  {
    id: 'web',
    icon: 'web',
    name: 'Website Development',
    summary:
      'Sites and landing pages that load fast, rank well and turn visitors into orders. We also take over the hosting headaches.',
    chips: ['Landing Pages', 'CRO', 'Hosting', 'Core Web Vitals'],
    size: 'wide',
  },
]

/**
 * `metric` is a real result only where we have one. Everywhere else it names
 * the job to be done, so nothing on this page is a number we cannot back up.
 */
export const industries = [
  {
    id: 'restaurants',
    name: 'Restaurants',
    line: 'Fill the quiet nights, push the new menu, and turn a first order into a regular one.',
    metric: '70+ orders a day for PizzaBox',
    proven: true,
    points: ['Order campaigns', 'Menu launch creative', 'WhatsApp ordering'],
  },
  {
    id: 'cafes',
    name: 'Cafés',
    line: 'Own your corner of the map and build a morning rush that shows up without being asked.',
    metric: 'Local search and loyalty',
    points: ['Maps visibility', 'Loyalty campaigns', 'Daily content'],
  },
  {
    id: 'hotels',
    name: 'Hotels',
    line: 'Take bookings directly instead of handing a cut to the booking sites every time.',
    metric: 'Direct bookings',
    points: ['Booking funnels', 'Seasonal offers', 'Concierge AI replies'],
  },
  {
    id: 'local',
    name: 'Local Businesses',
    line: 'Show up first in your area, then let the agent handle the calls and messages that follow.',
    metric: 'Found first, locally',
    points: ['Targeted local ads', 'Call tracking', 'Profile management'],
  },
  {
    id: 'service',
    name: 'Service Businesses',
    line: 'A steady queue of booked appointments, qualified and followed up before you get to them.',
    metric: 'Booked appointments',
    points: ['Lead campaigns', 'Instant replies', 'CRM sync'],
  },
  {
    id: 'sme',
    name: 'Premium SMEs',
    line: 'The kind of marketing setup bigger companies run, sized for a team that has to stay lean.',
    metric: 'Built to scale',
    points: ['Full funnel strategy', 'Reporting dashboards', 'AI support desk'],
  },
]

export const pillars = [
  {
    number: '01',
    title: 'Precision',
    body: 'We start by making sure the numbers are right. No vanity metrics. Every decision comes back to what an order actually costs you and what it is worth.',
  },
  {
    number: '02',
    title: 'AI first',
    body: 'If the same conversation happens fifty times a day, a person should not be having it. The agent answers, qualifies and books. Your team handles what needs a human.',
  },
  {
    number: '03',
    title: 'One team',
    body: 'Ads, website, hosting, content and the agent all sit with us. When something breaks at eleven at night, you make one call, not four.',
  },
  {
    number: '04',
    title: 'Proven systems',
    body: 'We do not start from scratch on every client. What already works gets deployed in week one, then tuned to your market.',
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Audit and Blueprint',
    body: 'We go through your accounts, your tracking, your funnel and your competitors. You get a written plan at the end of it, whether you hire us or not.',
    duration: 'Week 1',
  },
  {
    step: '02',
    title: 'Forge',
    body: 'Tracking gets rebuilt. Campaigns get structured. Creative goes into production and your WhatsApp agent learns your menu, your services and how you talk.',
    duration: 'Weeks 2 to 3',
  },
  {
    step: '03',
    title: 'Launch and Learn',
    body: 'Campaigns go live with a testing plan behind them. Every week we look at the two or three things actually moving the number and ignore the rest.',
    duration: 'Weeks 4 to 6',
  },
  {
    step: '04',
    title: 'Scale and Systemise',
    body: 'Winners get more budget. Losers get cut. Anything repetitive gets handed to the agent, so growing does not mean hiring.',
    duration: 'Ongoing',
  },
]

/** One real client, quoted with permission. Attributed by role, not by name. */
export const testimonial = {
  quote:
    'We are very happy with the work Adsmith has done for us, and with the time and attention they give our business.',
  role: 'Owner',
  company: 'PizzaBox',
}

/** Results from the PizzaBox engagement. Every figure here is real. */
export const proofStats = [
  { value: '70+', label: 'Orders a day driven by ads' },
  { value: 'PKR 2 crore', label: 'In sales from PKR 5 lac of ad spend' },
  { value: '1 year', label: 'Working together and still going' },
]

export const client = {
  name: 'PizzaBox',
  descriptor: 'one of the leading restaurant chains in Peshawar',
  scale: '1000+ orders a day',
}

/* ------------------------------------------------------- WhatsApp AI Agent */

export const whatsapp = {
  heading: 'Close your call center. Let AI handle your WhatsApp.',
  subheading:
    'Support, orders, lead qualification, appointment booking, FAQs and sales. All of it handled on WhatsApp by an agent that works every hour of every day.',
  cta: 'Book a free WhatsApp AI demo',
}

export const whatsappFeatures = [
  { icon: 'zap', label: '24/7 Instant Replies' },
  { icon: 'sparkles', label: 'Human like AI Conversations' },
  { icon: 'filter', label: 'Lead Qualification' },
  { icon: 'utensils', label: 'Restaurant Ordering' },
  { icon: 'calendar', label: 'Appointment Booking' },
  { icon: 'contact', label: 'CRM Integration' },
  { icon: 'sheet', label: 'Google Sheets Integration' },
  { icon: 'plug', label: 'Meta Integration' },
  { icon: 'languages', label: 'Multi language Support' },
  { icon: 'handoff', label: 'Smart Escalation to Human' },
  { icon: 'chart', label: 'Analytics Dashboard' },
  { icon: 'book', label: 'Custom AI Knowledge Base' },
]

export const whatsappBenefits = [
  'Reduce support costs',
  'Never miss a customer',
  'Respond instantly',
  'Increase conversions',
  'Save hundreds of staff hours',
  'Scale without hiring',
]

/** Scripted exchange used by the phone mockup. Written to match a real order. */
export const whatsappThread = [
  { from: 'them', text: 'Do you deliver to Hayatabad? Want 2 large pepperoni', time: '20:14' },
  { from: 'us', text: 'We do. 2 large pepperoni is PKR 3,400. Any drinks with that?', time: '20:14' },
  { from: 'them', text: 'Add 2 cokes. Cash on delivery', time: '20:15' },
  {
    from: 'us',
    text: 'Order confirmed, PKR 3,700. Rider reaches you in about 35 minutes.',
    time: '20:15',
  },
]

export const faqs = [
  {
    q: 'How do you charge?',
    a: 'Most clients start with a paid growth blueprint. After that it is a monthly retainer covering the media buying, the creative and the agent. Minimum three months to start, because anything shorter does not give the system time to prove itself.',
  },
  {
    q: 'Do you only work with restaurants?',
    a: 'No. Restaurants are where we have the deepest results, but the same setup works for any business with a clear offer and real margin. If we are not the right fit for you, we will tell you on the first call.',
  },
  {
    q: 'Who owns the accounts and the AI agent?',
    a: 'You do. Ad accounts, pixels, your WhatsApp Business number, the knowledge base the agent is trained on, all of it is set up in your name from day one. If we ever part ways, you keep everything.',
  },
]

export const footerColumns = [
  {
    heading: 'Services',
    links: [
      { label: 'WhatsApp AI Agent', href: '#whatsapp' },
      { label: 'Meta Ads', href: '#services' },
      { label: 'Google Ads', href: '#services' },
      { label: 'TikTok Ads', href: '#services' },
      { label: 'Social Media', href: '#services' },
      { label: 'Google Business Profile', href: '#services' },
      { label: 'Website Development', href: '#services' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Restaurants', href: '#industries' },
      { label: 'Cafés', href: '#industries' },
      { label: 'Hotels', href: '#industries' },
      { label: 'Local Businesses', href: '#industries' },
      { label: 'Service Businesses', href: '#industries' },
      { label: 'Premium SMEs', href: '#industries' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Why Adsmith', href: '#why' },
      { label: 'Process', href: '#process' },
      { label: 'Results', href: '#proof' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: '/privacy.html' },
      { label: 'Terms of Service', href: '/terms.html' },
    ],
  },
]
