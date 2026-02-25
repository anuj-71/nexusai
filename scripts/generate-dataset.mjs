// Replicates the Python generate-startup-id script logic in Node.js
// Generates 1500 startups with the same fields and distributions

import { writeFileSync } from "fs";

const NUM_STARTUPS = 1500;

const sectors = ["AI", "FinTech", "Healthcare", "EdTech", "E-commerce", "Cybersecurity"];

const stages = {
  Idea: { funding_min: 5000, funding_max: 25000, team_min: 1, team_max: 3, user_min: 0, user_max: 100 },
  Prototype: { funding_min: 25000, funding_max: 100000, team_min: 2, team_max: 5, user_min: 50, user_max: 500 },
  Seed: { funding_min: 100000, funding_max: 500000, team_min: 4, team_max: 10, user_min: 500, user_max: 5000 },
  "Series A": { funding_min: 500000, funding_max: 5000000, team_min: 10, team_max: 50, user_min: 5000, user_max: 50000 },
  "Series B": { funding_min: 5000000, funding_max: 20000000, team_min: 50, team_max: 200, user_min: 50000, user_max: 500000 },
};

const businessModels = ["SaaS", "Marketplace", "Subscription", "B2B", "B2C"];
const locations = ["India", "USA", "UK", "Germany", "Canada"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStartupId(num) {
  return "ST" + num.toString(16).toUpperCase().padStart(6, "0");
}

const data = [];

for (let i = 1; i <= NUM_STARTUPS; i++) {
  const startupId = generateStartupId(i);
  const stage = randChoice(Object.keys(stages));
  const s = stages[stage];

  const fundingNeeded = randInt(s.funding_min, s.funding_max);
  const teamSize = randInt(s.team_min, s.team_max);
  const userCount = randInt(s.user_min, s.user_max);
  const revenue = userCount * randInt(10, 50);
  const growthRate = randInt(20, 300);
  const valuation = revenue * randInt(5, 15);
  const fundingRaised = Math.floor(fundingNeeded * (0.2 + Math.random() * 0.6));
  const burnRate = teamSize * randInt(1000, 3000);
  const runwayMonths = burnRate > 0 ? Math.floor(fundingRaised / burnRate) : 0;

  const tractionScore = Math.min(
    100,
    Math.floor(
      (revenue / 1000000) * 40 +
      (growthRate / 300) * 30 +
      (userCount / 500000) * 30
    )
  );

  // created_at between 1 year and 2 years ago
  const daysAgo = randInt(365, 730);
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  data.push({
    id: startupId,
    name: `Startup_${startupId}`,
    sector: randChoice(sectors),
    stage,
    business_model: randChoice(businessModels),
    funding_needed: fundingNeeded,
    funding_raised: fundingRaised,
    valuation,
    team_size: teamSize,
    revenue,
    growth_rate: growthRate,
    burn_rate: burnRate,
    runway_months: runwayMonths,
    user_count: userCount,
    traction_score: tractionScore,
    location: randChoice(locations),
    created_at: createdAt.toISOString().replace("T", " ").slice(0, 19),
  });
}

// Write as JSON to lib/startup-dataset.json
writeFileSync(
  "/vercel/share/v0-project/lib/startup-dataset.json",
  JSON.stringify(data, null, 2)
);

console.log(`Generated ${data.length} startups successfully.`);
console.log("Sample:", JSON.stringify(data[0], null, 2));
