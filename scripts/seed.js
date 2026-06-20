// Seed script for NexusAI
// Usage: node scripts/seed.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const investorData = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    firm_name: 'Horizon Ventures',
    firm_description: 'Early-stage VC focused on B2B SaaS',
    investment_focus: 'Enterprise software and marketplaces',
    min_investment: 250000,
    max_investment: 2000000,
    preferred_sectors: ['SaaS', 'Enterprise', 'B2B'],
    preferred_stages: ['Seed', 'Series A'],
    portfolio_companies: ['TechFlow AI', 'DataViz Inc'],
    website_url: 'horizonventures.com',
    location: 'San Francisco, CA',
    completion_percentage: 85,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    firm_name: 'Spark Capital',
    firm_description: 'Growth-stage venture fund',
    investment_focus: 'Consumer technology and fintech',
    min_investment: 500000,
    max_investment: 5000000,
    preferred_sectors: ['FinTech', 'Consumer', 'Payments'],
    preferred_stages: ['Series B', 'Series C'],
    portfolio_companies: ['PayStream', 'MoneyFlow'],
    website_url: 'sparkcapital.com',
    location: 'New York, NY',
    completion_percentage: 90,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    firm_name: 'Quantum Ventures',
    firm_description: 'Deep tech and AI focused',
    investment_focus: 'Artificial intelligence and machine learning',
    min_investment: 300000,
    max_investment: 3000000,
    preferred_sectors: ['AI', 'ML', 'Deep Tech'],
    preferred_stages: ['Seed', 'Series A', 'Series B'],
    portfolio_companies: ['NeuralNets AI'],
    website_url: 'quantumventures.com',
    location: 'Boston, MA',
    completion_percentage: 88,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    firm_name: 'Green Growth Partners',
    firm_description: 'Sustainability and climate tech',
    investment_focus: 'Clean energy and green tech',
    min_investment: 400000,
    max_investment: 4000000,
    preferred_sectors: ['CleanTech', 'Energy', 'Sustainability'],
    preferred_stages: ['Series A', 'Series B'],
    portfolio_companies: ['SolarFlow Inc'],
    website_url: 'greengrowth.com',
    location: 'Austin, TX',
    completion_percentage: 82,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    firm_name: 'Health Innovations Fund',
    firm_description: 'Healthcare technology',
    investment_focus: 'Medical devices and health tech',
    min_investment: 500000,
    max_investment: 6000000,
    preferred_sectors: ['HealthTech', 'Medical', 'BioTech'],
    preferred_stages: ['Series B', 'Series C'],
    portfolio_companies: ['MediConnect'],
    website_url: 'healthinnovations.com',
    location: 'San Francisco, CA',
    completion_percentage: 87,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    firm_name: 'Social Impact Ventures',
    firm_description: 'Mission-driven companies',
    investment_focus: 'Education, social impact, community',
    min_investment: 200000,
    max_investment: 1500000,
    preferred_sectors: ['EdTech', 'Social Impact', 'Community'],
    preferred_stages: ['Seed', 'Series A'],
    portfolio_companies: ['LearnHub'],
    website_url: 'socialimpact.com',
    location: 'Seattle, WA',
    completion_percentage: 79,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    firm_name: 'Commerce Accelerators',
    firm_description: 'E-commerce and retail tech',
    investment_focus: 'E-commerce and marketplace',
    min_investment: 300000,
    max_investment: 2500000,
    preferred_sectors: ['E-Commerce', 'Retail', 'Marketplace'],
    preferred_stages: ['Seed', 'Series A', 'Series B'],
    portfolio_companies: ['ShopFlow'],
    website_url: 'commerceaccel.com',
    location: 'Los Angeles, CA',
    completion_percentage: 83,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    firm_name: 'Crypto Ventures',
    firm_description: 'Blockchain and Web3',
    investment_focus: 'Cryptocurrency and blockchain',
    min_investment: 250000,
    max_investment: 2000000,
    preferred_sectors: ['Web3', 'Crypto', 'Blockchain'],
    preferred_stages: ['Seed', 'Series A'],
    portfolio_companies: ['TokenFlow'],
    website_url: 'cryptoventures.com',
    location: 'Miami, FL',
    completion_percentage: 76,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    firm_name: 'Cybersecurity Partners',
    firm_description: 'Security and infrastructure',
    investment_focus: 'Cybersecurity and enterprise security',
    min_investment: 400000,
    max_investment: 3500000,
    preferred_sectors: ['Cybersecurity', 'Security', 'Enterprise'],
    preferred_stages: ['Series A', 'Series B'],
    portfolio_companies: ['SecureVault'],
    website_url: 'cybersecpartners.com',
    location: 'Washington, DC',
    completion_percentage: 84,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    firm_name: 'Logistics Innovation Fund',
    firm_description: 'Supply chain and logistics',
    investment_focus: 'Supply chain and logistics',
    min_investment: 350000,
    max_investment: 3000000,
    preferred_sectors: ['Logistics', 'Supply Chain', 'Transportation'],
    preferred_stages: ['Series A', 'Series B'],
    portfolio_companies: ['LogisticFlow'],
    website_url: 'logisticsinnovation.com',
    location: 'Chicago, IL',
    completion_percentage: 81,
  },
];

const startupData = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    company_name: 'TechFlow AI',
    company_tagline: 'Enterprise AI automation platform',
    company_description: 'Building AI-powered workflow automation for enterprises',
    industry: 'AI',
    stage: 'Series A',
    funding_goal: 5000000,
    current_funding: 1200000,
    website_url: 'techflowai.com',
    logo_url: 'https://via.placeholder.com/200?text=TechFlow',
    team_size: 18,
    founded_year: 2022,
    location: 'San Francisco, CA',
    completion_percentage: 92,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    company_name: 'DataViz Inc',
    company_tagline: 'Real-time analytics dashboards',
    company_description: 'Modern data visualization platform for business intelligence',
    industry: 'SaaS',
    stage: 'Series A',
    funding_goal: 4000000,
    current_funding: 800000,
    website_url: 'datavizinc.com',
    logo_url: 'https://via.placeholder.com/200?text=DataViz',
    team_size: 12,
    founded_year: 2021,
    location: 'New York, NY',
    completion_percentage: 88,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    company_name: 'PayStream',
    company_tagline: 'Payment processing reimagined',
    company_description: 'Next-generation payment processing for startups',
    industry: 'FinTech',
    stage: 'Series B',
    funding_goal: 15000000,
    current_funding: 5000000,
    website_url: 'paystream.io',
    logo_url: 'https://via.placeholder.com/200?text=PayStream',
    team_size: 45,
    founded_year: 2019,
    location: 'San Francisco, CA',
    completion_percentage: 95,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    company_name: 'MoneyFlow',
    company_tagline: 'Personal finance AI',
    company_description: 'AI-powered personal finance management app',
    industry: 'FinTech',
    stage: 'Series A',
    funding_goal: 3000000,
    current_funding: 600000,
    website_url: 'moneyflow.app',
    logo_url: 'https://via.placeholder.com/200?text=MoneyFlow',
    team_size: 10,
    founded_year: 2023,
    location: 'Austin, TX',
    completion_percentage: 85,
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440005',
    company_name: 'NeuralNets AI',
    company_tagline: 'Deep learning platform',
    company_description: 'Infrastructure for training deep neural networks at scale',
    industry: 'AI',
    stage: 'Seed',
    funding_goal: 2000000,
    current_funding: 500000,
    website_url: 'neuralnets.ai',
    logo_url: 'https://via.placeholder.com/200?text=NeuralNets',
    team_size: 8,
    founded_year: 2023,
    location: 'Boston, MA',
    completion_percentage: 78,
  },
];

async function seed() {
  try {
    console.log('Starting seed process...');

    // Seed investors
    console.log('Inserting investor profiles...');
    const { error: investorError } = await supabase
      .from('investor_profiles')
      .insert(investorData);

    if (investorError) {
      console.error('Error seeding investors:', investorError);
    } else {
      console.log(`✓ Inserted ${investorData.length} investor profiles`);
    }

    // Seed startups
    console.log('Inserting startup profiles...');
    const { error: startupError } = await supabase
      .from('startup_profiles')
      .insert(startupData);

    if (startupError) {
      console.error('Error seeding startups:', startupError);
    } else {
      console.log(`✓ Inserted ${startupData.length} startup profiles`);
    }

    console.log('Seed process complete!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
