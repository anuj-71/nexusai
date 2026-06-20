// Expanded seed script for NexusAI - 50 startups + 25 investors
// Usage: node scripts/seed-expanded.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 25 Investors with comprehensive data
const investors = [
  { name: 'Horizon Ventures', focus: 'B2B SaaS', stage: 'Seed/Series A', min: 250k, max: 2m, sectors: ['SaaS', 'Enterprise'], location: 'SF' },
  { name: 'Spark Capital', focus: 'FinTech', stage: 'Series B/C', min: 500k, max: 5m, sectors: ['FinTech', 'Payments'], location: 'NYC' },
  { name: 'Quantum Ventures', focus: 'AI/ML', stage: 'Seed/A', min: 300k, max: 3m, sectors: ['AI', 'ML'], location: 'Boston' },
  { name: 'Green Growth Partners', focus: 'CleanTech', stage: 'Series A/B', min: 400k, max: 4m, sectors: ['CleanTech', 'Energy'], location: 'Austin' },
  { name: 'Health Innovations Fund', focus: 'HealthTech', stage: 'Series B/C', min: 500k, max: 6m, sectors: ['HealthTech', 'Medical'], location: 'SF' },
  { name: 'Social Impact Ventures', focus: 'EdTech', stage: 'Seed/A', min: 200k, max: 1.5m, sectors: ['EdTech', 'Social'], location: 'Seattle' },
  { name: 'Commerce Accelerators', focus: 'E-Commerce', stage: 'Seed/A/B', min: 300k, max: 2.5m, sectors: ['E-Commerce', 'Retail'], location: 'LA' },
  { name: 'Crypto Ventures', focus: 'Web3', stage: 'Seed/A', min: 250k, max: 2m, sectors: ['Web3', 'Crypto'], location: 'Miami' },
  { name: 'Cybersecurity Partners', focus: 'Security', stage: 'Series A/B', min: 400k, max: 3.5m, sectors: ['Cybersecurity'], location: 'DC' },
  { name: 'Logistics Innovation Fund', focus: 'Supply Chain', stage: 'Series A/B', min: 350k, max: 3m, sectors: ['Logistics'], location: 'Chicago' },
  { name: 'EdTech Ventures', focus: 'Learning', stage: 'Seed/A', min: 250k, max: 2m, sectors: ['EdTech', 'Skills'], location: 'Denver' },
  { name: 'AgriTech Fund', focus: 'Agriculture', stage: 'Series A/B', min: 300k, max: 2.5m, sectors: ['AgriTech', 'Food'], location: 'Des Moines' },
  { name: 'Travel Tech Ventures', focus: 'Travel', stage: 'Series A/B/C', min: 400k, max: 3.5m, sectors: ['Travel', 'Hospitality'], location: 'Portland' },
  { name: 'Sports Innovation Capital', focus: 'Sports', stage: 'Seed/A', min: 300k, max: 2.5m, sectors: ['Sports', 'Fitness'], location: 'Phoenix' },
  { name: 'Manufacturing Tech', focus: 'Industrial', stage: 'Series B/C', min: 500k, max: 4m, sectors: ['Manufacturing'], location: 'Detroit' },
  { name: 'HR Tech Ventures', focus: 'Workforce', stage: 'Seed/A/B', min: 250k, max: 2m, sectors: ['HR Tech', 'Talent'], location: 'Austin' },
  { name: 'Real Estate Tech Fund', focus: 'PropTech', stage: 'Series A/B', min: 350k, max: 3m, sectors: ['PropTech', 'Construction'], location: 'SF' },
  { name: 'Marketing Tech Partners', focus: 'MarTech', stage: 'Series A/B', min: 300k, max: 2.5m, sectors: ['MarTech', 'Advertising'], location: 'NYC' },
  { name: 'Legal Tech Ventures', focus: 'LegalTech', stage: 'Seed/A', min: 250k, max: 2m, sectors: ['LegalTech', 'Compliance'], location: 'Boston' },
  { name: 'API Economy Fund', focus: 'Infrastructure', stage: 'Seed/A/B', min: 300k, max: 2.5m, sectors: ['Infrastructure', 'DevTools'], location: 'SF' },
  { name: 'Gaming & Entertainment', focus: 'Gaming', stage: 'Seed/A', min: 250k, max: 2m, sectors: ['Gaming', 'Media'], location: 'LA' },
  { name: 'Quantum Computing Fund', focus: 'Quantum', stage: 'Series A/B', min: 400k, max: 3.5m, sectors: ['Quantum', 'Physics'], location: 'Boston' },
  { name: 'Robotics & Automation', focus: 'Robotics', stage: 'Series A/B/C', min: 500k, max: 4m, sectors: ['Robotics', 'Hardware'], location: 'Pittsburgh' },
  { name: 'Audio & Voice Tech', focus: 'Voice AI', stage: 'Seed/A', min: 250k, max: 2m, sectors: ['Audio', 'Voice', 'AI'], location: 'SF' },
  { name: 'Venture Studio', focus: 'Multi-sector', stage: 'Seed/A/B', min: 300k, max: 3m, sectors: ['SaaS', 'AI', 'Hardware'], location: 'SF' },
];

// 50 Startups with rich data
const startups = [
  { name: 'TechFlow AI', desc: 'Enterprise AI automation', stage: 'Series A', raised: 1.2m, team: 12, sector: 'AI', fundGoal: 3m },
  { name: 'DataViz Inc', desc: 'Real-time data visualization', stage: 'Series A', raised: 800k, team: 8, sector: 'SaaS', fundGoal: 2m },
  { name: 'PayStream', desc: 'Real-time payments API', stage: 'Series B', raised: 5m, team: 35, sector: 'FinTech', fundGoal: 10m },
  { name: 'MoneyFlow', desc: 'Personal finance automation', stage: 'Seed', raised: 200k, team: 4, sector: 'FinTech', fundGoal: 1.5m },
  { name: 'NeuralNets AI', desc: 'Deep learning platform', stage: 'Series A', raised: 1.5m, team: 14, sector: 'AI', fundGoal: 4m },
  { name: 'SolarFlow Inc', desc: 'Solar energy optimization', stage: 'Series A', raised: 900k, team: 10, sector: 'CleanTech', fundGoal: 2.5m },
  { name: 'MediConnect', desc: 'Telehealth platform', stage: 'Series B', raised: 4m, team: 28, sector: 'HealthTech', fundGoal: 8m },
  { name: 'LearnHub', desc: 'Online skill marketplace', stage: 'Seed', raised: 300k, team: 5, sector: 'EdTech', fundGoal: 1.2m },
  { name: 'ShopFlow', desc: 'E-commerce automation', stage: 'Series A', raised: 1.1m, team: 11, sector: 'E-Commerce', fundGoal: 2.5m },
  { name: 'TokenFlow', desc: 'Blockchain wallet', stage: 'Seed', raised: 400k, team: 6, sector: 'Web3', fundGoal: 1.8m },
  { name: 'SecureVault', desc: 'Enterprise security', stage: 'Series A', raised: 1.3m, team: 13, sector: 'Cybersecurity', fundGoal: 3.5m },
  { name: 'LogisticFlow', desc: 'Supply chain tracking', stage: 'Series A', raised: 950k, team: 9, sector: 'Logistics', fundGoal: 2.2m },
  { name: 'CourseFlow', desc: 'Course creation platform', stage: 'Seed', raised: 250k, team: 4, sector: 'EdTech', fundGoal: 1.5m },
  { name: 'FarmFlow', desc: 'Agricultural IoT', stage: 'Series A', raised: 800k, team: 8, sector: 'AgriTech', fundGoal: 2m },
  { name: 'JourneyFlow', desc: 'Travel planning AI', stage: 'Series A', raised: 1.1m, team: 11, sector: 'Travel', fundGoal: 2.8m },
  { name: 'FitFlow', desc: 'Fitness analytics', stage: 'Seed', raised: 180k, team: 3, sector: 'Sports', fundGoal: 1m },
  { name: 'ManufactureFlow', desc: 'Production optimization', stage: 'Series B', raised: 4.5m, team: 32, sector: 'Manufacturing', fundGoal: 9m },
  { name: 'TalentFlow', desc: 'HR automation platform', stage: 'Series A', raised: 1m, team: 10, sector: 'HR Tech', fundGoal: 2.5m },
  { name: 'PropertyFlow', desc: 'Real estate analytics', stage: 'Series A', raised: 900k, team: 9, sector: 'PropTech', fundGoal: 2.3m },
  { name: 'MarketFlow', desc: 'Marketing automation', stage: 'Series A', raised: 1.2m, team: 12, sector: 'MarTech', fundGoal: 3m },
  { name: 'LegalFlow', desc: 'Document automation', stage: 'Seed', raised: 220k, team: 3, sector: 'LegalTech', fundGoal: 1.2m },
  { name: 'APIFlow', desc: 'API infrastructure', stage: 'Series A', raised: 1.4m, team: 14, sector: 'Infrastructure', fundGoal: 3.5m },
  { name: 'GameFlow', desc: 'Game development platform', stage: 'Seed', raised: 350k, team: 5, sector: 'Gaming', fundGoal: 1.8m },
  { name: 'QuantumFlow', desc: 'Quantum computing as service', stage: 'Series A', raised: 1.6m, team: 15, sector: 'Quantum', fundGoal: 4.5m },
  { name: 'RobotFlow', desc: 'Robotics control software', stage: 'Series A', raised: 1.3m, team: 13, sector: 'Robotics', fundGoal: 3.8m },
  { name: 'AudioFlow', desc: 'Voice AI platform', stage: 'Seed', raised: 280k, team: 4, sector: 'Voice', fundGoal: 1.5m },
  { name: 'CloudScale', desc: 'Auto-scaling infrastructure', stage: 'Series A', raised: 1.1m, team: 11, sector: 'Infrastructure', fundGoal: 3m },
  { name: 'BioDecode', desc: 'Genomics analysis', stage: 'Series A', raised: 1.8m, team: 16, sector: 'BioTech', fundGoal: 5m },
  { name: 'WeatherAI', desc: 'Predictive weather AI', stage: 'Seed', raised: 150k, team: 3, sector: 'AI', fundGoal: 1m },
  { name: 'BlockChain Pro', desc: 'Enterprise blockchain', stage: 'Series A', raised: 1.2m, team: 12, sector: 'Web3', fundGoal: 3.5m },
  { name: 'VisionX', desc: 'Computer vision API', stage: 'Series A', raised: 1.5m, team: 14, sector: 'AI', fundGoal: 4m },
  { name: 'StreamSync', desc: 'Live streaming platform', stage: 'Seed', raised: 200k, team: 4, sector: 'Media', fundGoal: 1.3m },
  { name: 'EcoTrack', desc: 'Carbon footprint tracking', stage: 'Seed', raised: 190k, team: 3, sector: 'CleanTech', fundGoal: 1.1m },
  { name: 'DroneDelivery', desc: 'Autonomous delivery', stage: 'Series A', raised: 2.1m, team: 18, sector: 'Logistics', fundGoal: 6m },
  { name: 'HealthPredict', desc: 'Predictive health analytics', stage: 'Series A', raised: 1.4m, team: 13, sector: 'HealthTech', fundGoal: 3.8m },
  { name: 'CyberShield', desc: 'AI security monitoring', stage: 'Series A', raised: 1.1m, team: 11, sector: 'Cybersecurity', fundGoal: 3.2m },
  { name: 'RetailAI', desc: 'Retail analytics AI', stage: 'Series A', raised: 1.3m, team: 12, sector: 'Retail', fundGoal: 3.5m },
  { name: 'WorkspaceFlow', desc: 'Productivity suite', stage: 'Series A', raised: 1.6m, team: 15, sector: 'SaaS', fundGoal: 4.5m },
  { name: 'PaymentFlow', desc: 'Payment processing', stage: 'Series A', raised: 1.2m, team: 12, sector: 'FinTech', fundGoal: 3.5m },
  { name: 'MetaverseStudio', desc: 'Metaverse building tools', stage: 'Seed', raised: 400k, team: 7, sector: 'Gaming', fundGoal: 2.5m },
  { name: 'CloudVault', desc: 'Secure cloud storage', stage: 'Series A', raised: 1m, team: 10, sector: 'Infrastructure', fundGoal: 3m },
  { name: 'NetworkOptim', desc: 'Network optimization', stage: 'Series A', raised: 1.3m, team: 13, sector: 'Infrastructure', fundGoal: 3.8m },
  { name: 'SustainHub', desc: 'Sustainability consulting', stage: 'Seed', raised: 160k, team: 3, sector: 'CleanTech', fundGoal: 1m },
  { name: 'InsuranceAI', desc: 'Insurance automation', stage: 'Series A', raised: 1.4m, team: 13, sector: 'FinTech', fundGoal: 4m },
  { name: 'ProcureFlow', desc: 'Procurement automation', stage: 'Series A', raised: 1.1m, team: 11, sector: 'Enterprise', fundGoal: 3.2m },
  { name: 'EventFlow', desc: 'Event management platform', stage: 'Seed', raised: 210k, team: 4, sector: 'SaaS', fundGoal: 1.4m },
  { name: 'ContentAI', desc: 'AI content generation', stage: 'Series A', raised: 1.5m, team: 14, sector: 'AI', fundGoal: 4.2m },
];

async function seedData() {
  console.log('Starting seed process...');
  
  try {
    // Insert investors
    console.log(`Inserting ${investors.length} investors...`);
    for (let i = 0; i < investors.length; i++) {
      const inv = investors[i];
      const id = `investor-${i + 1}`;
      
      const { error } = await supabase
        .from('investor_profiles')
        .insert({
          user_id: id,
          firm_name: inv.name,
          firm_description: `Focused on ${inv.focus.toLowerCase()} investments`,
          investment_focus: inv.focus,
          min_investment: inv.min * 1000,
          max_investment: inv.max * 1000,
          preferred_sectors: inv.sectors,
          preferred_stages: inv.stage.split('/'),
          portfolio_companies: [],
          website_url: inv.name.toLowerCase().replace(/\s/g, '') + '.com',
          location: inv.location,
          completion_percentage: 85 + Math.floor(Math.random() * 15),
        });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`Error inserting investor ${inv.name}:`, error);
      } else {
        console.log(`✓ ${inv.name}`);
      }
    }
    
    // Insert startups
    console.log(`\nInserting ${startups.length} startups...`);
    for (let i = 0; i < startups.length; i++) {
      const startup = startups[i];
      const id = `startup-${i + 1}`;
      
      const { error } = await supabase
        .from('startup_profiles')
        .insert({
          user_id: id,
          company_name: startup.name,
          company_tagline: startup.desc,
          company_description: `${startup.desc}. Currently at ${startup.stage} with $${startup.raised}k raised.`,
          industry: startup.sector,
          founding_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1).toISOString(),
          team_size: startup.team,
          funding_stage: startup.stage,
          raised_amount: startup.raised * 1000,
          target_raise: startup.fundGoal * 1000,
          website_url: startup.name.toLowerCase().replace(/\s/g, '') + '.com',
          location: ['SF', 'NYC', 'Boston', 'Austin', 'Seattle'][Math.floor(Math.random() * 5)],
          completion_percentage: 80 + Math.floor(Math.random() * 20),
          target_investors: startups[i].sector === 'AI' ? 50000 : 100000,
        });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`Error inserting startup ${startup.name}:`, error);
      } else {
        console.log(`✓ ${startup.name}`);
      }
    }
    
    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

seedData();
