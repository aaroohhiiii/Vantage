# Vantage

**AI Spend Optimization Platform** - Stop overspending on AI tools with intelligent audit and recommendations for engineering teams.

Vantage helps startups and engineering teams analyze their AI tool stack, identify redundant subscriptions, and find optimization opportunities. Get personalized recommendations in 90 seconds with our advanced audit engine powered by real-time pricing data and AI insights.

##  Who It's For

- **Startups** (5-50 employees) looking to optimize SaaS costs
- **Engineering teams** using multiple AI development tools
- **Finance leaders** needing visibility into AI tool spending
- **DevOps managers** managing tool subscriptions and licenses

##  Screenshots

### Homepage & Audit Flow
![Homepage](https://via.placeholder.com/800x400/1a1a1a/00C853?text=Vantage+Homepage)
*Landing page with audit CTA and real-time savings calculator*


<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 46 39 PM" src="https://github.com/user-attachments/assets/98c2d74c-a0c4-4eb4-978e-c07c7d31c165" />
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 47 44 PM" src="https://github.com/user-attachments/assets/d1e658ef-a01c-41c9-853f-99c25034cab2" />
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 47 54 PM" src="https://github.com/user-attachments/assets/d4e7afb1-9e02-4c20-91da-0a4a56ea1ecd" />



### Audit Results Dashboard
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 48 19 PM" src="https://github.com/user-attachments/assets/e040b509-f7a6-402c-a196-8a7e5e36fac8" />
<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 48 46 PM" src="https://github.com/user-attachments/assets/bd27b084-c69d-4f9d-8929-f67666c18527" />


*Comprehensive analysis with tool-specific insights and recommendations*



## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- Groq API key (for AI summaries)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/vantage.git
cd vantage
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
GROQ_API_KEY=your_groq_api_key

# Optional: Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Optional: Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

4. **Set up Supabase database**
```bash
# Run the schema setup in Supabase SQL Editor
# Copy contents from: supabase/schema.sql
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

#### Manual Deployment
```bash
npm run build
npm start
```

##  Key Features

- **90-Second Audit**: Complete AI stack analysis in under 2 minutes
- **Real-Time Pricing**: Up-to-date pricing data from official sources
- **AI-Powered Insights**: Personalized recommendations using Llama 3.3
- **Tool Coverage**: Supports 8+ major AI tools (Cursor, Copilot, Claude, ChatGPT, etc.)
- **Savings Calculator**: Shows monthly and annual savings opportunities
- **Enterprise Security**: Row-level security, no PII exposure
- **Shareable Reports**: Export and share audit results with team

## ⚙️ Architecture

```
├── app/                    # Next.js app router
│   ├── audit/             # Audit flow pages
│   └── api/               # API endpoints
├── components/            # React components
│   ├── AuditResults/      # Results page components
│   ├── SpendForm/         # Audit form components
│   └── ui/                # Reusable UI components
├── lib/                   # Core business logic
│   ├── auditEngineV2.ts   # Main audit algorithm
│   ├── pricingData.ts     # Tool pricing database
│   └── aiSummary.ts      # AI-powered insights
└── supabase/             # Database schema
```

## 🔧 Technical Decisions

### 1. **Next.js 14 App Router vs Pages Router**
**Decision**: Used App Router for better route organization and streaming capabilities
**Why**: Enables better code splitting, server components, and improved performance for the audit results page

### 2. **Supabase vs Traditional Database**
**Decision**: Chose Supabase for managed PostgreSQL with built-in auth
**Why**: Faster setup, automatic scaling, and excellent TypeScript support. Row-level security perfect for public audit reads vs private lead data

### 3. **Groq Llama 3.3 vs OpenAI GPT-4**
**Decision**: Used Groq for AI summaries and insights
**Why**: 10x faster inference speed, lower cost, and sufficient quality for tool recommendations. Critical for keeping audit under 90 seconds

### 4. **Client-Side Pricing Calculations vs Server-Side**
**Decision**: Pricing logic runs in the browser during audit
**Why**: Faster user experience, no server load for calculations, and pricing data is non-sensitive. Server only validates and stores results

### 5. **Tailwind CSS vs CSS-in-JS**
**Decision**: Used Tailwind for styling system
**Why**: Consistent design system, better performance, and easier maintenance. shadcn/ui components provide solid foundation without heavy bundle size

## 📊 Data Sources

- **Pricing Data**: Manually verified from official vendor websites (updated monthly)
- **Tool Capabilities**: Researched from product documentation and user reviews
- **Market Analysis**: Based on industry benchmarks and competitive analysis
- **AI Insights**: Generated using Llama 3.3 with structured prompts

##  Development

### Running Tests
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Linting
```bash
npm run lint          # Run ESLint
```

### Database Migrations
```bash
# Apply new schema changes in Supabase SQL Editor
# See: supabase/schema.sql
```

## 📈 Performance

- **Audit Speed**: <90 seconds for typical 5-tool stacks
- **Page Load**: <2s initial load, <500ms subsequent
- **Bundle Size**: ~450KB gzipped
- **Database**: Optimized indexes for sub-100ms query times

##  Security

- **Row Level Security**: Public audit reads, private lead data
- **No PII Exposure**: Audit results contain no personal information
- **Rate Limiting**: Upstash Redis prevents abuse
- **Input Validation**: Comprehensive validation on all user inputs
- **HTTPS Only**: Enforced in production

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Support

- **Issues**: [GitHub Issues](https://github.com/your-username/vantage/issues)


##  Deployed URL

**Live Demo**: [https://vantage-theta-eosin.vercel.app/](vantagecredex.vercel.app/<img width="1703" height="980" alt="Screenshot 2026-05-13 at 5 46 05 PM" src="https://github.com/user-attachments/assets/cd48e880-ce9e-48df-ae07-57c3b1dcab8e" />
)

*Note: This is a demo deployment. For production use, deploy with your own Supabase instance and API keys.*

---

**Built with ❤️ for the AI-powered development community**
