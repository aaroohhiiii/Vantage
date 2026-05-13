# Vantage

**AI Spend Optimization Platform** - Stop overpaying for AI tools with the "Science of Savings" audit engine designed for high-growth engineering teams.

Vantage helps startups and engineering teams analyze their AI tool stack, identify redundant subscriptions, and find optimization opportunities. Get personalized recommendations in 60 seconds with our advanced audit engine powered by real-time pricing data and AI insights.

##  Who It's For

- **Startups** (5-50 employees) looking to optimize SaaS costs
- **Engineering teams** using multiple AI development tools
- **Finance leaders** needing visibility into AI tool spending
- **DevOps managers** managing tool subscriptions and licenses

##  Screenshots

### Homepage & Audit Flow

*Landing page with audit CTA and real-time savings calculator*

<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 49 42 PM" src="https://github.com/user-attachments/assets/b08298ff-e7a1-4ae0-bf8a-8112b253f793" />

<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 46 39 PM" src="https://github.com/user-attachments/assets/98c2d74c-a0c4-4eb4-978e-c075244caeca" />
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 47 44 PM" src="https://github.com/user-attachments/assets/d1e658ef-a01c-41c9-853f-99c25034cab2" />
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 47 54 PM" src="https://github.com/user-attachments/assets/d4e7afb1-9e02-4c20-91da-0a4a56ea1ecd" />

### Audit Results Dashboard
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 48 19 PM" src="https://github.com/user-attachments/assets/e040b509-f7a6-402c-a196-8a7e5e36fac8" />
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 48 46 PM" src="https://github.com/user-attachments/assets/bd27b084-c69d-4f9d-8929-f67666c18527" />

*Comprehensive analysis with tool-specific insights and recommendations*

## Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Supabase account (for database)
- Groq API key (for AI summaries)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aaroohhiiii/Vantage.git
cd Prune
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials.

4. **Set up Supabase database**
```bash
# Run the schema setup in Supabase SQL Editor
# Copy contents from: supabase/schema.sql
```

5. **Run the development server**
```bash
npm run dev
```

##  Key Features

- **Science of Savings Engine**: Multi-vector auditing covering redundancy mapping, benchmarking, and tier optimization.
- **90-Second Audit**: Complete AI stack analysis in under 2 minutes.
- **Real-Time Pricing**: Up-to-date pricing data verified weekly against official sources.
- **AI-Powered Insights**: Strategic consultant-grade recommendations using Llama 3.3.
- **Engineered Dashboard**: Professional, high-contrast visual identity with bold `#111` borders and 35px headers.
- **Enterprise Security**: Row-level security, anonymous processing, and no PII exposure.

## ⚙️ Architecture

```
├── app/                    # Next.js app router & API routes
├── components/            # React components
│   ├── AuditResults/      # Engineered results dashboard
│   ├── SpendForm/         # Intelligent input flow
│   └── ui/                # Custom design system components
├── lib/                   # Core business logic
│   ├── auditEngineV2.ts   # Main audit algorithm
│   ├── auditHelpers.ts    # Benchmarking & overlap utilities
│   └── aiSummary.ts      # Strategic AI-powered insights
└── supabase/             # Database schema
```

## 🔧 Technical Decisions

### 1. **Next.js 14 App Router**
**Decision**: Used App Router for better route organization and streaming capabilities.
**Why**: Enables superior performance for the data-heavy audit results page and cleaner API organization.

### 2. **Supabase & PostgreSQL**
**Decision**: Chose Supabase for managed database and row-level security.
**Why**: Provides enterprise-grade data isolation for public audit results vs private lead capture data.

### 3. **Groq Llama 3.3 Inference**
**Decision**: Used Groq for ultra-low latency AI strategic insights.
**Why**: 10x faster inference speed ensuring the entire audit flow remains sub-60 seconds.

### 4. **Handcrafted "Engineered" UI**
**Decision**: Custom Vanilla CSS system with bold `#111` borders.
**Why**: Replaces generic component libraries with a unique, authoritative visual identity that builds executive trust.

## 📊 Data Sources

- **Pricing Data**: Verified weekly against official vendor documentation (OpenAI, Anthropic, etc.).
- **Benchmarking**: Based on industry-standard cost-per-seat metrics for varying team sizes.
- **AI Insights**: Context-aware strategic justifications generated via Llama 3.3.

##  Development

### Running Tests
```bash
npm run test          # Run Vitest suite
```

### Linting
```bash
npm run lint          # Run ESLint check
```

## 📈 Performance

- **Audit Speed**: <60 seconds for complex stacks.
- **Lighthouse Score**: 95+ for performance and SEO.
- **Database**: Optimized PostgreSQL indexing for sub-100ms response times.

##  Security

- **Session-Based Privacy**: Anonymous processing ensures no PII is stored until requested.
- **Row Level Security**: Enforced data isolation for all database transactions.
- **Verified Citations**: Every savings recommendation cites its official pricing source.

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Support

- **Issues**: [GitHub Issues](https://github.com/aaroohhiiii/Prune/issues)

##  Deployed URL

**Live Demo**: [vantagecredex.vercel.app](https://vantagecredex.vercel.app/)

---

**Built with ❤️ for the AI-powered development community**
