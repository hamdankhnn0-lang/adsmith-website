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
  { label: 'Automation', href: '#automation' },
]

export const heroStats = [
  { value: '$40M+', label: 'Ad spend under management' },
  { value: '4.7x', label: 'Median blended ROAS' },
  { value: '180+', label: 'Automations shipped' },
  { value: '11', label: 'Industries served' },
]

/**
 * `size` drives the bento grid: 'lg' is a 2×2 hero tile, 'wide' spans the full
 * row, everything else is a single cell. `icon` maps to a Lucide component in
 * Services.jsx.
 */
export const services = [
  {
    id: 'automation',
    icon: 'workflow',
    name: 'n8n & AI Automation',
    summary:
      'Custom n8n workflows and AI agents that handle the follow up, the reporting and the admin your team no longer should.',
    chips: ['n8n Workflows', 'AI Agents', 'CRM Sync', 'Reporting'],
    size: 'lg',
    featured: true,
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
    summary:
      'Structured to capture demand at the exact moment buying intent appears.',
    chips: ['Search', 'Performance Max', 'Shopping', 'Display'],
  },
  {
    id: 'tiktok-ads',
    icon: 'video',
    name: 'TikTok Ads',
    summary:
      'Native creative that stops the scroll, paired with disciplined media buying.',
    chips: ['UGC', 'Spark Ads', 'Hook Testing', 'Creators'],
  },
  {
    id: 'social',
    icon: 'social',
    name: 'Social Media',
    summary:
      'An editorial content engine that keeps your brand as premium as the product.',
    chips: ['Content', 'Reels', 'Strategy', 'Branding'],
  },
  {
    id: 'gmb',
    icon: 'pin',
    name: 'Google Business Profile',
    summary:
      'Local visibility done properly, from listings and reviews to map pack rankings.',
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
    points: ['Local search dominance', 'Loyalty automations', 'Daily content'],
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
    points: ['Lead campaigns', 'Instant speed to lead', 'CRM automation'],
  },
  {
    id: 'sme',
    name: 'Premium SMEs',
    line: 'Enterprise grade marketing systems, sized and priced for a lean, ambitious team.',
    metric: '6 hrs saved weekly',
    points: ['Full funnel strategy', 'Reporting dashboards', 'Ops automation'],
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
    title: 'Automation first',
    body: 'If a task repeats, we automate it. n8n workflows and AI agents remove the manual drag from lead handling, reporting and follow up before it ever reaches your team.',
  },
  {
    number: '03',
    title: 'Global Standards',
    body: 'The craft standard we hold is international: brand systems, creative and analytics built to hold up next to companies ten times your size.',
  },
  {
    number: '04',
    title: 'Proven Systems',
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
    body: 'Tracking is rebuilt, account structures are laid out, creative goes into production and the first automations are wired into your CRM.',
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
    title: 'Scale & Systemise',
    body: 'Winners get more budget, losers get cut, and every repeatable process gets handed to an automation so growth does not cost you headcount.',
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
      'The automation work alone paid for the retainer. Enquiries get answered in under a minute now, and nothing falls through the cracks on a busy weekend.',
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

export const automationCapabilities = [
  {
    title: 'Speed to lead agents',
    body: 'Every enquiry answered in under 60 seconds, qualified by AI and routed to the right person with full context attached.',
  },
  {
    title: 'Reporting on autopilot',
    body: 'Ad platforms, CRM and POS data stitched into one weekly report that lands in your inbox before Monday standup.',
  },
  {
    title: 'Review and reputation loops',
    body: 'Follow up sequences that ask happy customers for reviews and quietly route unhappy ones to your team first.',
  },
  {
    title: 'Content operations',
    body: 'Briefs, drafts, approvals and scheduling moving through one pipeline, with AI drafting the first 80%.',
  },
]

export const automationFlow = [
  { label: 'Trigger', caption: 'New lead, booking or review' },
  { label: 'Enrich', caption: 'AI qualifies and adds context' },
  { label: 'Route', caption: 'CRM, inbox or WhatsApp' },
  { label: 'Report', caption: 'Dashboard updates instantly' },
]

export const faqs = [
  {
    q: 'What does a typical engagement look like?',
    a: 'Most clients start with a paid growth blueprint, then move onto a monthly retainer covering media buying, creative and automation. The minimum initial term is three months, which is long enough to prove the system works.',
  },
  {
    q: 'Do you work with businesses outside your listed industries?',
    a: 'Often, yes. Our systems suit any business with a clear offer and a real margin. If we are not the right fit, we will say so on the first call.',
  },
  {
    q: 'Who owns the accounts and automations?',
    a: 'You do, always. Ad accounts, pixels, n8n instances and documentation are yours, set up under your ownership from day one.',
  },
]

export const footerColumns = [
  {
    heading: 'Services',
    links: [
      { label: 'Meta Ads', href: '#services' },
      { label: 'Google Ads', href: '#services' },
      { label: 'TikTok Ads', href: '#services' },
      { label: 'Social Media', href: '#services' },
      { label: 'Google Business Profile', href: '#services' },
      { label: 'Website Development', href: '#services' },
      { label: 'n8n & AI Automation', href: '#automation' },
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
