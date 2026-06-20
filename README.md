# AI Startup–Investor Platform

An AI-powered platform that connects startups with investors through intelligent matching, structured onboarding, profile management, and analytics.

The platform helps startups showcase their business, funding requirements, traction, and team while enabling investors to discover opportunities that align with their investment thesis, industry focus, and risk appetite.

---

## Overview

Finding the right investor is one of the biggest challenges for startups, while investors often struggle to identify relevant opportunities from a large pool of companies.

This platform streamlines that process by providing:

* Startup onboarding and profile management
* Investor onboarding and profile management
* AI-driven startup-investor matching
* Personalized dashboards
* Profile completion tracking
* Recommendation and discovery systems
* Secure authentication and authorization

---

## Key Features

### Startup Features

* Startup registration and authentication
* Guided onboarding workflow
* Startup profile management
* Company information management
* Funding requirement tracking
* Industry and category classification
* Team and founder information
* Dashboard with relevant insights
* Profile completion tracking

### Investor Features

* Investor registration and authentication
* Guided onboarding workflow
* Investor profile management
* Investment thesis configuration
* Preferred industries and sectors
* Investment stage preferences
* Geographic preferences
* Dashboard and opportunity discovery

### AI Matching Engine

* Startup-investor compatibility scoring
* Industry-based recommendations
* Stage-based matching
* Intelligent ranking system
* Personalized opportunity discovery
* Future support for machine learning recommendations

### Profile Management

* Editable profiles
* Validation and error handling
* Secure updates
* Completion percentage calculation
* Missing information detection
* Progress tracking

### Security & Authentication

* Supabase Authentication
* Protected routes
* Session management
* Secure API endpoints
* Row Level Security (RLS)
* Role-based access controls

---

## Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Server-side TypeScript

### Database

* PostgreSQL (Supabase)

### Authentication

* Supabase Auth

### Hosting & Deployment

* Vercel

### Development Tools

* Git
* GitHub
* PNPM

---

## Project Structure

```text
app/
├── api/
│   ├── dashboard/
│   ├── profile/
│   ├── profiles/
│   ├── notifications/
│   └── startups/
│
├── auth/
├── startup/
│   ├── onboarding/
│   ├── dashboard/
│   └── profile/
│
├── investor/
│   ├── onboarding/
│   ├── dashboard/
│   └── profile/
│
└── profile/

components/
hooks/
lib/
db/
scripts/
public/
styles/
```

---

## Database Architecture

The platform uses Supabase PostgreSQL as the primary database.

Core entities include:

* Profiles
* Startups
* Investors
* Matches
* Notifications

Database migrations are located in:

```text
db/migrations/
```

Ensure all migrations are executed before running the application.

---

## Environment Variables

Create a file named:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Important

Never commit:

```text
.env
.env.local
.env.production.local
.env.development.local
```

Only commit:

```text
.env.local.example
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd v0-ai-startup-investor-platform
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create:

```text
.env.local
```

and add the required Supabase credentials.

### Run Database Migrations

Execute all SQL files inside:

```text
db/migrations/
```

using the Supabase SQL Editor.

### Start Development Server

```bash
pnpm dev
```

Application will be available at:

```text
http://localhost:3000
```

---

## Authentication Flow

### Startup Flow

```text
Signup
   ↓
Startup Onboarding
   ↓
Dashboard
   ↓
Profile Management
   ↓
AI Matching
```

### Investor Flow

```text
Signup
   ↓
Investor Onboarding
   ↓
Dashboard
   ↓
Profile Management
   ↓
Startup Discovery
```

---

## API Endpoints

### Profile

```text
/api/profile
/api/profile/completion
/api/profiles
```

### Dashboard

```text
/api/dashboard/startup
/api/dashboard/investor
```

### Matching

```text
/api/match
```

### Predictions

```text
/api/predict
```

### Notifications

```text
/api/notifications
```

---

## Security

This project follows several security best practices:

* Environment variables are excluded from version control
* Supabase Row Level Security (RLS)
* Protected API routes
* Secure session management
* Authentication-based data access
* Server-side validation

---

## Deployment

### Deploying to Vercel

1. Push repository to GitHub
2. Import repository into Vercel
3. Add all environment variables
4. Deploy

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## Future Enhancements

### Matching Improvements

* Machine learning recommendations
* Dynamic compatibility scoring
* Personalized discovery feeds

### Communication

* Startup-investor messaging
* Meeting scheduling
* Collaboration tools

### Analytics

* Startup analytics dashboard
* Investor analytics dashboard
* Portfolio insights

### Funding Management

* Deal pipeline tracking
* Due diligence workflows
* Investment history

---

## Development Notes

Before deployment:

* Verify all database migrations are applied
* Verify authentication flow
* Verify onboarding workflows
* Verify profile management
* Verify dashboard functionality
* Verify API routes
* Verify environment variables

---

## License

This project is currently maintained as a private application.

All rights reserved.
