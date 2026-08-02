/**
 * Single source of truth for site copy and navigation.
 * Editing this file is enough to re-word most of the site.
 */

export const brand = {
  name: 'Adsmith',
  tagline: 'Forged for Growth',
  promise: 'Precision marketing, masterfully built.',
  email: 'hello@adsmith.agency',
  phone: '+1 (555) 014 2280',
  location: 'Working remotely with clients across 9 time zones',
}

export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Why Adsmith', href: '#why' },
  { label: 'Process', href: '#process' },
  { label: 'WhatsApp AI', href: '#whatsapp' },
]

export const heroStats = [
  { value: '$40M+', label: 'Ad spend under management' },
  { value: '4.7x', label: 'Median blended ROAS' },
  { value: '60k+', label: 'WhatsApp chats handled monthly' },
  { value: '11', label: 'Industries served' },
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
      'An intelligent agent that answers every WhatsApp message in seconds, qualifies the lead, takes the order and books the appointment. Available around the clock.',
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
      'Facebook and Instagram campaigns engineered around creative testing and profitable scale.',
    chips: ['Creative Testing', 'CAPI Tracking', 'Retargeting', 'Analytics'],
  },
  {
    id: 'google-ads',
    icon: 'search',
    name: 'Google Ads',
    summary: 'Structured to capture demand at the exact moment buying intent appears.',
    chips: ['Search', 'Performance Max', 'Shopping', 'Display'],
  },
  {
    id: 'tiktok-ads',
    icon: 'video',
    name: 'TikTok Ads',
    summary: 'Native creative that stops the scroll, paired with disciplined media buying.',
    chips: ['UGC', 'Spark Ads', 'Hook Testing', 'Creators'],
  },
  {
    id: 'social',
    icon: 'social',
    name: 'Social Media',
    summary: 'An editorial content engine that keeps your brand as premium as the product.',
    chips: ['Content', 'Reels', 'Strategy', 'Branding'],
  },
  {
    id: 'gmb',
    icon: 'pin',
    name: 'Google Business Profile',
    summary: 'Local visibility done properly, from listings and reviews to map pack rankings.',
    chips: ['Listings', 'Reviews', 'Local SEO', 'Maps'],
  },
  {
    id: 'web',
    icon: 'web',
    name: 'Website Development',
    summary:
      'Fast, elegant sites and landing pages built to load instantly, rank well and turn traffic into booked business.',
    chips: ['Landing Pages', 'CRO', 'Headless', 'Core Web Vitals'],
    size: 'wide',
  },
]

export const industries = [
  {
    id: 'restaurants',
    name: 'Restaurants',
    line: 'Fill quiet covers, launch new menus and turn first time diners into regulars.',
    metric: '38% more weekday covers',
    points: ['Reservation campaigns', 'Menu launch creative', 'Review engine'],
  },
  {
    id: 'cafes',
    name: 'Cafés',
    line: 'Own your neighbourhood on Maps and build a loyal morning rush that shows up daily.',
    metric: '2.4x map pack views',
    points: ['Local search dominance', 'Loyalty campaigns', 'Daily content'],
  },
  {
    id: 'hotels',
    name: 'Hotels',
    line: 'Drive direct bookings and reduce OTA dependency with demand capture led by your brand.',
    metric: '31% less OTA reliance',
    points: ['Direct booking funnels', 'Seasonal offers', 'Concierge AI replies'],
  },
  {
    id: 'local',
    name: 'Local Businesses',
    line: 'Show up first in your area, then convert the calls and visits without lifting a finger.',
    metric: '3.1x qualified calls',
    points: ['Targeted local ads', 'Call tracking', 'Profile management'],
  },
  {
    id: 'service',
    name: 'Service Businesses',
    line: 'A predictable pipeline of booked appointments, qualified and followed up automatically.',
    metric: '54% faster lead response',
    points: ['Lead campaigns', 'Instant speed to lead', 'CRM sync'],
  },
  {
    id: 'sme',
    name: 'Premium SMEs',
    line: 'Enterprise grade marketing systems, sized and priced for a lean, ambitious team.',
    metric: '6 hrs saved weekly',
    points: ['Full funnel strategy', 'Reporting dashboards', 'AI support desk'],
  },
]

export const pillars = [
  {
    number: '01',
    title: 'Precision',
    body: 'Every campaign starts with clean measurement. No vanity metrics and no guesswork. Decisions are made against contribution margin and cost per booked outcome.',
  },
  {
    number: '02',
    title: 'AI first',
    body: 'If a conversation repeats, an agent should handle it. Our WhatsApp AI answers, qualifies and books around the clock, so your team only touches the work that needs a human.',
  },
  {
    number: '03',
    title: 'Global standards',
    body: 'The craft standard we hold is international: brand systems, creative and analytics built to hold up next to companies ten times your size.',
  },
  {
    number: '04',
    title: 'Proven systems',
    body: 'We do not reinvent the wheel per client. Account structures and creative frameworks that have already been proven get deployed on day one, then tuned to your market.',
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Audit and Blueprint',
    body: 'We pull apart your existing accounts, tracking, funnel and competitors, then hand you a written growth blueprint. It is yours whether we work together or not.',
    duration: 'Week 1',
  },
  {
    step: '02',
    title: 'Forge',
    body: 'Tracking is rebuilt, account structures are laid out, creative goes into production and your WhatsApp AI agent is trained on your menu, services and tone.',
    duration: 'Weeks 2 to 3',
  },
  {
    step: '03',
    title: 'Launch and Learn',
    body: 'Campaigns go live with a structured testing roadmap. Weekly reviews focus on the two or three levers that actually move the number.',
    duration: 'Weeks 4 to 6',
  },
  {
    step: '04',
    title: 'Scale and Systemise',
    body: 'Winners get more budget, losers get cut, and every repeatable conversation gets handed to the agent so growth does not cost you headcount.',
    duration: 'Ongoing',
  },
]

export const testimonials = [
  {
    quote:
      'We went from guessing at our marketing to knowing exactly what a booked table costs us. Three months in, weekday covers are up and the reporting finally makes sense.',
    name: 'Placeholder Name',
    role: 'Owner',
    company: 'Restaurant Group · Placeholder',
  },
  {
    quote:
      'The WhatsApp agent alone paid for the retainer. Enquiries get answered in under a minute now, and nothing falls through the cracks on a busy weekend.',
    name: 'Placeholder Name',
    role: 'Director of Operations',
    company: 'Boutique Hotel · Placeholder',
  },
  {
    quote:
      'Adsmith is the first agency that felt like part of the team. Sharp strategy, beautiful creative, and they never hide behind a dashboard.',
    name: 'Placeholder Name',
    role: 'Founder',
    company: 'Premium SME · Placeholder',
  },
]

export const clientLogos = [
  'NORTHGATE',
  'MAISON & CO',
  'HARBOUR ROW',
  'ATELIER 9',
  'VERDE CAFÉ',
  'THE BRASS LAMP',
  'KINDRED HOTELS',
  'STONEBRIDGE',
]

/* ------------------------------------------------------- WhatsApp AI Agent */

export const whatsapp = {
  heading: 'Close your call center. Let AI handle your WhatsApp.',
  subheading:
    'Automate customer support, order taking, lead qualification, appointment booking, FAQs and sales, all through an intelligent WhatsApp AI Agent available 24/7.',
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

/** Scripted exchange used by the phone mockup in the WhatsApp section. */
export const whatsappThread = [
  { from: 'them', text: 'Hi, do you have a table for 4 tonight at 8?', time: '19:02' },
  { from: 'us', text: 'We do. Would you like the terrace or the main room?', time: '19:02' },
  { from: 'them', text: 'Terrace please. One guest is vegan.', time: '19:03' },
  {
    from: 'us',
    text: 'Booked, terrace at 20:00 for 4. Vegan menu noted. See you tonight.',
    time: '19:03',
  },
]

export const faqs = [
  {
    q: 'What does a typical engagement look like?',
    a: 'Most clients start with a paid growth blueprint, then move onto a monthly retainer covering media buying, creative and the WhatsApp AI agent. The minimum initial term is three months, which is long enough to prove the system works.',
  },
  {
    q: 'Do you work with businesses outside your listed industries?',
    a: 'Often, yes. Our systems suit any business with a clear offer and a real margin. If we are not the right fit, we will say so on the first call.',
  },
  {
    q: 'Who owns the accounts and the AI agent?',
    a: 'You do, always. Ad accounts, pixels, your WhatsApp Business number, the agent knowledge base and all documentation are yours, set up under your ownership from day one.',
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
    ],
  },
]
