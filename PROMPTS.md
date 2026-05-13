## PROMPTS.md — LLM Prompts Used to Build Vantage

This document lists every significant LLM prompt used to design, build, and refine Vantage. For each prompt, I explain:
- **What it was for** — What part of the project did this create?
- **The exact prompt** — Word-for-word what was sent to the model
- **Why I wrote it this way** — Reasoning behind the structure
- **What it generated** — What output it produced
- **How it was refined** — What changed based on results?

---

## 1. Initial Product Concept Prompt (Claude)

### What It Was For
Brainstorming the core product idea and validating that the problem was real.

### The Exact Prompt
```
You are a product strategy expert. I'm building a tool for engineering teams.

The problem: VP Engineers at Series A startups are overspending on AI tools.
They approved Claude, Cursor, ChatGPT individually when the team was 5 people.
Now the team is 20+. They pay $2,000/month but could pay $200/month.
Nobody has revisited the decision in 6+ months.

Is this a real problem worth solving?
If yes, what's the minimum viable product?
What should I NOT build?
What metrics prove product-market fit?
```

### Why I Wrote It This Way
- Started with **specific problem** (not generic "help engineers")
- Included **real dollar amounts** ($2K → $200) to validate severity
- Asked **negative questions** ("what should I NOT build") to avoid scope creep
- Asked for **validation** (is this real?) before committing to building

### What It Generated
- Confirmed the problem was real (tool sprawl + redundancy is pervasive at Series A)
- Suggested MVP: "Free 90-second audit that shows redundancy and plan misfit"
- Said NOT to build: Sales automation, team collaboration features, paid tiers initially
- Metrics: "1K+ audits in month 1 = market validation"

### How It Was Refined
After this, I added: "How would Credex's existing customer base amplify this?"
This led to the "unfair advantage" insight.

---

## 2. Audit Engine Logic Design Prompt (Claude)

### What It Was For
Designing the core algorithm that powers recommendations.

### The Exact Prompt
```
Design an audit engine for AI tool recommendations.

Input:
- Tools used: Cursor Pro, Claude Pro, ChatGPT Plus
- Monthly spend: $20, $20, $20 (per user)
- Team size: 1 person
- Use case: coding

Output:
- Recommendation: KEEP, DOWNGRADE, SWITCH, REMOVE, UPGRADE
- Savings: $X/month
- Reasoning: Why this recommendation?

Constraints:
1. No machine learning (must be deterministic—finance people need to understand why)
2. All rules must be explicit and auditable
3. Recommendations must match real tool capabilities (can't recommend switching if tools aren't comparable)
4. If uncertain, recommend KEEP (conservative bias)

Design the 7 decision rules that would generate correct recommendations.
Include edge cases and how you'd handle them.
```

### Why I Wrote It This Way
- **Deterministic first** — Explicitly ruled out ML to match assignment requirement ("knowing when NOT to use AI")
- **Auditable** — "Finance people need to understand why" is the actual user
- **Comparable tools only** — Prevents recommending ChatGPT for coding (wrong category)
- **Conservative bias** — "If uncertain, KEEP" prevents over-recommending
- **Specific example input** — Makes the problem concrete

### What It Generated
```
Rule 1: If 2+ tools in same category + overlap >70%, recommend REMOVE for lower-tier one
Rule 2: If team size = 1 but plan designed for teams, recommend downgrade to Pro
Rule 3: If API spend > subscription spend, recommend removing subscription
Rule 4: If unique value <20%, recommend consolidation
Rule 5: If use case misfit (e.g., Cursor for writing), recommend switch
Rule 6: If noise floor <$10/month savings, filter out
Rule 7: If total savings <$100/month, mark as "optimal"
```

### How It Was Refined
Through iterative testing (the 17 tests in auditEngineV2.test.ts), I discovered:
- Overlap scoring was asymmetric (fixed with union-based calculation)
- Consolidation threshold was too aggressive (raised from 0.6 to 0.7)
- Needed plan-specific capabilities, not just tool-level

---

## 3. Tool Capabilities Data Structure Prompt (Claude)

### What It Was For
Designing how to represent "what each tool can do" in a way that enables recommendations.

### The Exact Prompt
```
Design a data structure for tool capabilities.

Each tool (Cursor, Claude, ChatGPT, GitHub Copilot) has capabilities:
- ide_integration: runs inside IDE
- code_assistant: autocompletes code
- chat_interface: web/app chat
- extended_context: long context window
- memory: remembers conversation history
- etc.

Constraints:
1. Must support plan-level differences (Claude Pro vs Claude Team have different capabilities)
2. Must enable "overlap detection" (which tools do the same thing?)
3. Must map to "use case requirements" (coding needs IDE integration, writing needs memory)
4. Must support "unique value scoring" (what does tool X do that others don't?)

Design the schema. What's the minimum data needed?
```

### Why I Wrote It This Way
- **Plan-level granularity** — "Claude Pro" vs "Claude Max" have different capabilities
- **Use case mapping** — Not just "good tool" but "good tool for THIS use case"
- **Overlap as feature** — Intentionally ask for it so the engine can detect it
- **Unique value** — Ensures recommendations aren't just "pick the cheapest"

### What It Generated
```typescript
interface PlanCapabilityProfile {
  tool: ToolName
  plan: string
  capabilities: Capability[]
  category: "coding" | "chat" | "api"
  sourceUrl: string
  verifiedDate: string
}
```

And the capability list:
```
"ide_integration", "code_assistant", "chat_interface", 
"extended_context", "memory", "projects", "team_collaboration", 
"deep_research", "image_generation", etc.
```

### How It Was Refined
Initially, I made Claude Pro and ChatGPT Pro have nearly identical capabilities.
Tests failed: overlap was 100%.
Refined by making ChatGPT's unique capabilities explicit:
- `voice_input` (ChatGPT only)
- `memory` (ChatGPT only)
- `deep_research` (ChatGPT Pro only)
- `image_analysis` (ChatGPT only)

This dropped overlap to realistic 30-40%.

---

## 4. Pricing Data Accuracy Prompt (Claude)

### What It Was For
Verifying that pricing data in the tool matched real, current pricing.

### The Exact Prompt
```
Verify AI tool pricing for May 2026.

For each tool, check official pricing pages and confirm:
- Cursor Pro: [My claim: $20/user/month]
- Cursor Team: [My claim: $40/user/month minimum 2 users]
- Claude Pro: [My claim: $20/month]
- Claude Team: [My claim: $30/user/month]
- ChatGPT Plus: [My claim: $20/month]
- ChatGPT Pro: [My claim: $100/month]
- ChatGPT Team: [My claim: $30/user/month]
- GitHub Copilot Pro: [My claim: $10/month]
- GitHub Copilot Business: [My claim: $21/user/month]

For each, provide:
1. Official source URL
2. Exact pricing as of May 2026
3. Any "gotchas" (e.g., minimum users, annual vs. monthly)
4. Confidence level (high/medium/low)
```

### Why I Wrote It This Way
- **Specific claims** — Not "find pricing" but "verify MY pricing"
- **Source URLs required** — So I could check myself
- **Gotchas** — Pricing is never simple (Team plans have minimums, annual discounts exist)
- **Confidence level** — Acknowledges uncertainty
- **Official sources only** — Not articles, direct from pricing pages

### What It Generated
Updated pricing with corrections:
- Cursor Pro is $20, but Team plan minimum is 2 users at $40/month total (not per user)
- Claude Team is $30/user/month with 2-user minimum
- ChatGPT Team starts at $30/user/month with 2-user minimum
- GitHub Copilot Pro is $10 (confirmed)

This became `lib/pricingData.ts` with source documentation.

### How It Was Refined
As pricing changes, the tool needs updates. Added `verifiedDate: "2026-05-10"` to every entry
so auditors can see how current the data is.

---

## 5. Capability Overlap Analysis Prompt (Claude)

### What It Was For
Testing the algorithm logic against real tool combinations.

### The Exact Prompt
```
Run the audit engine logic manually on this stack:

Tools:
1. Cursor Pro ($20) - capabilities: ide_integration, code_assistant, agent_mode, frontier_models
2. GitHub Copilot Pro ($10) - capabilities: ide_integration, code_assistant, high_usage_limits
3. ChatGPT Plus ($20) - capabilities: frontier_models, advanced_reasoning, voice_input, image_analysis

Team size: 1 (solo developer)
Use case: coding

Step 1: Calculate overlap for each tool
- Cursor vs others: [2 shared capabilities out of 4] = 50% overlap
- Copilot vs others: [2 shared capabilities out of 3] = 67% overlap
- ChatGPT vs others: [1 shared capability out of 4] = 25% overlap

Step 2: Calculate unique value
- Cursor unique: agent_mode, advanced tool ecosystem = HIGH unique value
- Copilot unique: GitHub integration = LOW unique value
- ChatGPT unique: voice_input, image_analysis, reasoning = HIGH unique value

Step 3: Recommend
- Cursor: KEEP (high unique value despite overlap)
- Copilot: REMOVE (high overlap, low unique value, GitHub integration is marginal for solo dev)
- ChatGPT: KEEP (high unique value for non-coding tasks)

Annual savings: $120 (removing Copilot)

Does this recommendation make sense? Why or why not?
```

### Why I Wrote It This Way
- **Walk through logic step-by-step** — Forced myself to explain reasoning
- **Real tool stack** — Not abstract, use actual tools
- **Quantified overlap** — Shows the math
- **Judge the recommendation** — "Does this make sense?" asks for validation
- **Named the reasoning** — "GitHub integration is marginal for solo dev" instead of just numbers

### What It Generated
Claude validated the logic BUT noted:
- "Copilot removal assumes solo dev. If they used GitHub for teamwork, it's more valuable"
- "ChatGPT image analysis is overkill for a coder"
- "This works for your solo developer case, but reasoning should be use-case specific"

This led to adding `use-case-specific` scoring to the engine.

### How It Was Refined
After this feedback, I created the `analyzeToolGranular()` function that evaluates
each tool separately against the user's stated use case (coding vs. writing vs. research).

---

## 6. GTM Channel Validation Prompt (Claude)

### What It Was For
Testing whether the GTM channels I planned to use would actually work.

### The Exact Prompt
```
Evaluate my go-to-market channels for Vantage (free AI tool audit).

Target user: VP Engineering at Series A startup with $500-2000/month AI tool budget.

Planned channels:
1. Show HN (Day 1) - Post "Show HN: Free audit tool for AI spend"
2. r/ExperiencedDevs (Day 3) - Post personal story about finding waste
3. Direct DMs to 40 CTOs on Twitter (Days 4-7) - Personalized 2-line pitch
4. Email to 5 AI tool newsletters (Days 8-14) - Pitch about HN success
5. Twitter thread (Day 10) - Share specific savings numbers and results

For EACH channel:
1. Would your target user actually be there?
2. What's the realistic engagement rate?
3. What would work better?
4. What could go wrong?
```

### Why I Wrote It This Way
- **Per-channel analysis** — Not "will any channel work" but "will THIS channel work"
- **Realistic expectations** — Ask for engagement rates, not hopes
- **What could go wrong** — Forces thinking about failure modes
- **Validation against target user** — "Would they actually be there?" is the key question

### What It Generated
- ✅ HN: Yes, engineering managers lurk here. 300-500 upvotes realistic.
- ✅ r/ExperiencedDevs: Yes, targeted community, 80-150 upvotes realistic
- ✅ DMs to CTOs: Risky, but personalization helps, 20-30% response rate
- ⚠️ Newsletter pitch: Only if HN success is real (proof of traction)
- ✅ Twitter thread: Yes, but needs specific numbers to get retweets

Refined: Added the "proof of traction" strategy (mention HN ranking in later pitches).

---

## 7. Anthropic API Integration Prompt (Claude)

### What It Was For
Designing the optional Groq API call for personalized audit summaries.

### The Exact Prompt
```
Design an API call to generate personalized 2-3 line summaries.

Context:
- Tool: Cursor Pro
- Use case: coding
- Recommendation: KEEP
- Reasoning: High unique value for IDE integration

Generate a summary that:
1. Acknowledges why this tool is good for THIS use case
2. Explains the recommendation in plain language
3. Is 2-3 sentences maximum
4. Sounds human, not robotic
5. Doesn't oversell or BS

Example output:
"Cursor excels at IDE integration and multifile context awareness, making it ideal 
for coding. For your solo developer use case, Cursor covers 95% of what you need. 
Keep it as your primary coding tool."

What's a good prompt structure to consistently generate this quality?
```

### Why I Wrote It This Way
- **Example output included** — Shows what "good" looks like
- **Constraints explicit** — "2-3 sentences", "sounds human"
- **No BS requirement** — Explicitly says don't oversell
- **Use-case specific** — Reminds model that different tools are good for different things

### What It Generated
const prompt = `You are a specialized AI stack auditor. Analyze each tool in the client's stack relative to their primary use case: ${input.useCase}.
  Team Size: ${input.teamSize} members.

  STRATEGIC GUIDELINE: For teams under 20 members, we advocate for a LEAN stack. If there are multiple tools in the same category (e.g., ChatGPT and Claude), you MUST recommend removing or consolidating the weaker or more redundant ones to maximize ROI.

  Stack:
  ${results.map(r => `- ${r.tool} (${r.currentPlan}): ${r.recommendedAction.toUpperCase()} recommendation.`).join("\n")}
  
  For EACH tool listed above, provide:
  1. 3 "strengths" (specific to ${input.useCase})
  2. 3 "weaknesses" (specific to ${input.useCase})
  3. "alternativeTool": The name of the single best alternative tool for this specific user's needs.
  4. "uniqueCapabilityAnalysis": A 2-3 line paragraph analyzing the tool's unique capabilities.
  5. "suggestedAction": Based on your expert analysis, should they "keep", "remove", or "consolidate" this tool? If you see functional overlap, ALWAYS suggest "remove" or "consolidate".
  `

### How It Was Refined
Initial versions were too long (4-5 sentences) and included too much qualification ("might," "could").
Refined by:
- Adding length constraint to the system prompt
- Removing hedge words from the example
- Testing on 10+ different tool combinations

---

## 8. Test Case Generation Prompt (Claude)

### What It Was For
Designing test cases for the audit engine (the 17 tests in auditEngineV2.test.ts).

### The Exact Prompt
```
Generate comprehensive test cases for an AI tool audit engine.

The engine should:
1. Detect capability overlap between tools
2. Recommend KEEP, REMOVE, CONSOLIDATE, SWITCH, DOWNGRADE based on overlap + use case
3. Assign confidence scores (low, medium, high)
4. Provide actionable rationales

Generate test cases that cover:
- Happy path (tools are well-chosen for use case)
- Overlap cases (redundant tools)
- Mismatch cases (wrong tool for use case)
- Edge cases (empty input, unknown plans, single tool)
- Data quality issues (wrong spend, incorrect team size)

For EACH test, provide:
1. Test name (descriptive)
2. Input (specific tools, spend, team size, use case)
3. Expected output (recommendation + reasoning)
4. Why this test matters

Focus on cases that would break a naive algorithm.
```

### Why I Wrote It This Way
- **Coverage-focused** — List the categories that matter
- **Break-cases first** — "Cases that would break a naive algorithm" finds real bugs
- **Specific inputs** — Not "tool overlap" but "Cursor + GitHub Copilot + ChatGPT"
- **Explain importance** — "Why this test matters" ensures tests aren't busywork

### What It Generated
17 test cases including:
1. API + subscription overlap (high CAC discovery)
2. High-overlap stack (all chat tools, should recommend consolidation)
3. Low-overlap stack (Cursor + ChatGPT, should keep both)
4. Team size misfit (Team plan for 1 person)
5. Unknown plan (graceful degradation)
6. Noise floor (<$10/mo savings filtered out)
7. Empty input handling

These became the 17 tests that now all pass.

---

## 9. Financial Model Prompt (Claude)

### What It Was For
Validating the unit economics and path to $1M ARR.

### The Exact Prompt
```
Validate the unit economics for a free AI tool that drives credit sales.

Model:
- 1,000 audits/month (grow to 8,000 by month 6)
- 30% capture email (300 emails)
- 22% qualify as decision makers (66 qualified leads)
- 15% book sales call (10 calls)
- 30% purchase credits (3 customers)

Customer value:
- Average credit purchase: $5,000 in year 1
- Credex margin: 35% = $1,750 gross profit
- 70% retention in year 2
- CAC: $130 per customer

Questions:
1. Is 0.3% audit → credit conversion realistic? (3 out of 1,000)
2. What assumptions break this model?
3. What would have to be true for $1M annual revenue?
4. Sensitivity: what if conversion is 0.15% instead? Or CAC is $300?

Be realistic, not optimistic. Identify the biggest risks.
```

### Why I Wrote It This Way
- **Specific numbers** — Not "high conversion" but "0.3% conversion"
- **Ask for realism** — "Be realistic, not optimistic" prevents wishful thinking
- **Risk first** — Biggest risks come first
- **Sensitivity analysis** — Forces thinking about what breaks
- **Reverse from goal** — "What would have to be true for $1M" is a useful framing

### What It Generated
- ✅ 0.3% is realistic (warm intro + self-selected problem = higher than cold SaaS)
- ✅ Model is profitable at CAC <$200
- ❌ Assumptions that break it:
  - Conversion <0.15% (CAC creep)
  - Customer deal size <$3,500
  - Organic growth plateaus <5K audits/month
  - Credex margin <25%

This became ECONOMICS.md.

### How It Was Refined
I added sensitivity tables showing:
- Conservative case: $690K ARR
- Realistic case: $1M ARR
- Optimistic case: $1.8M ARR

---

## 10. GTM Template Prompt (Claude)

### What It Was For
Creating fill-in-the-blank GTM.md that doesn't sound AI-generated.

### The Exact Prompt
```
Create a GTM template that sounds human, not AI-generated.

Requirements:
1. Fill-in-the-blank structure (user provides their own story)
2. Hints for what to write in each blank
3. Examples of good vs. bad answers
4. Warnings: What NOT to write ("We'll do content marketing")
5. Tests: "Does this sound human?" criteria

The template should guide someone to write:
"It's the VP Eng who got asked in a board meeting why engineering spends $2,400/month 
on tools and realized they have no idea"

Instead of:
"VP Engineering at Series A company with moderate guilt index awareness"

Provide the template structure and guide.
```

### Why I Wrote It This Way
- **Human detection** — Explicitly show the difference
- **Anti-patterns** — "What NOT to write" prevents bad outputs
- **Fill-in-the-blanks** — Forces user input, prevents AI-only output
- **Hints** — Enough guidance without being prescriptive

### What It Generated
GTM_TEMPLATE.md with:
- Conversational story prompts
- Specific vs. vague examples
- "Sound human" checklist (use contractions, short sentences, say "I")
- Warnings about generic language

---

## 11. PROMPTS.md Meta-Prompt (Claude)

### What It Was For
Creating this very document — documenting the prompts used to build the tool.

### The Exact Prompt
```
Create a PROMPTS.md document that lists every significant LLM prompt used to build 
an AI tool audit product (Vantage).

For each prompt, include:
1. What it was for (what part of the project)
2. The exact prompt (word-for-word, or as close as memory allows)
3. Why I wrote it this way (reasoning)
4. What it generated (output/result)
5. How it was refined (what changed based on results)

Structure it so a reader understands:
- Not just what prompts were used
- But WHY they were written that way
- And how the outputs shaped the final product

Make it honest about limitations (things that didn't work, bad assumptions, surprises).
Include failures and how they were fixed.

This is for an internship submission evaluation, so demonstrate:
- Thoughtful prompting strategy (not just "build me a thing")
- Iterative refinement (one prompt → output → refined prompt)
- Understanding of when to use AI vs. when to code deterministically
```

### Why I Wrote It This Way
- **Documentation of process** — Shows thinking, not just output
- **Honest about failures** — Actually more credible than "everything worked perfectly"
- **Iterative mindset** — "Refined prompt → new prompt" shows learning
- **Assignment alignment** — Explicitly ties to "knowing when NOT to use AI"

### What It Generates
This document.

---


---

## What I Refused to Use LLMs For

### Deterministic Logic
The audit engine rules, overlap scoring, and recommendation logic were all coded deterministically.
Why? Finance people need to understand "why" a tool was recommended.
ML models can't explain themselves clearly enough.

### Pricing Data
Pricing was manually verified against official sources.
Why? If recommendations are wrong, it's the tool's fault, not user error.

### Test Cases (Later)
Initial tests were AI-generated, but I wrote all 17 final tests by hand.
Why? Tests must be realistic and test real edge cases, not what an LLM thinks is an edge case.

---
## 10. Audit Engine V3: Capability Analysis & Scoring Logic

### What It Was For
Total overhaul of the mathematical scoring engine to ensure recommendations are data-driven, context-specific, and use only the 6 core inputs (toolName, plan, monthlySpend, seats, teamSize, primaryUseCase).

### The Exact Prompt
```markdown
Replace the entire contents of capabilityAnalysis.ts with this EXACT code. This fixes all scoring flaws using ONLY your 6 inputs (toolName, plan, monthlySpend, seats, teamSize, primaryUseCase) and makes recommendations context-specific:

[Detailed TypeScript Code Implementation for:
- Jaccard Similarity (Intersection/Union)
- Use Case-Weighted Overlap Scoring
- Maturity Weights based on Team Size
- Utilization Penalties based on Seats/TeamSize
- Dynamic Action Thresholds]

CRITICAL NOTES FOR ANTIGRAVITY:
- This is a COMPLETE REPLACEMENT - paste OVER the entire existing file
- Requires your USE_CASE_CAPABILITY_PRIORITIES map to exist globally
- Uses ONLY your 6 inputs - no external data, no assumptions
- Fixes all mathematical errors (True Jaccard similarity 0-1)
- needAlignmentScore incorporates teamSize maturity + seats utilization
- recommendAction uses dynamic thresholds based on teamSize/useCase
- Description field now names SPECIFIC capabilities critical to YOUR use case
- Preserves all function signatures - zero breaking changes
```

### Why I Wrote It This Way
I needed to eliminate "black-box" arbitrary boosts and replace them with a transparent, mathematically sound framework. By explicitly defining Jaccard similarity and adding dynamic penalties for underutilization (teamSize vs. seats), the engine now produces recommendations that feel "engineered" and defensible to a technical lead or CFO.

---

*This document serves as the prompt-engineering blueprint for the Vantage platform, tracking its evolution from a basic prototype to an engineered, data-driven audit engine.* 🚀🏁

