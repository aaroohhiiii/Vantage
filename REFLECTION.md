# REFLECTION

## 1. The Hardest Bug
The efficiency score was stuck at 75 no matter what I put in. It was annoying because the executive summary ended up being super generic. I thought it was a hydration issue at first, but after logging everything in `auditEngineV2.ts`, I realized the thresholds were just too tight. It was treating moderate overlap as "optimized" and skipping the savings logic. I fixed it by switching to a more granular scoring model and lowering the sensitivity floor. Now it actually "sees" the waste and gives a dynamic score.

## 2. Mid-Week Reversal
I flipped our scoring logic mid-week. I was using Jaccard Similarity, but it wasn't penalizing redundancy enough. It treated small, specialized tools as "different" even if all their features were already in a bigger suite. I switched to Containment scoring (`intersection / tool_capabilities`). Now, if a tool's value is just a subset of another tool, it gets flagged as redundant. It shifted the platform from just "comparing features" to actually finding waste.

## 3. Week 2 Roadmap
If I had more time, I'd build a CSV uploader for enterprise seats. Right now it's great for small teams, but bigger companies have hundreds of seats to map. I'd also add a "One-Click PDF" button. CFOs usually want a static report they can bring to meetings, not just a dashboard. Finally, I'd set up a proper price tracker to keep the vendor data updated automatically.

## 4. Design Pivot
I decided to scrap the standard component library look late in the project. Shadcn and Tailwind are fine, but they look like every other SaaS prototype. I went with a custom Vanilla CSS system—thick black borders, 35px uppercase headers, and a lot of white space. It feels more "engineered" and professional, which is better for a finance tool.

## 5. Using AI
I used Antigravity and Cursor for most of the UI work. Claude helped with the engine structure and types. Llama 3.3 (via Groq) handles the audit summaries because it's fast (sub-500ms). One "AI failure" I hit was that the models kept trying to give me generic SaaS designs. I had to do a lot of manual refinement to get the custom, high-contrast look I wanted. I didn't trust AI for the raw pricing math either—I kept that grounded in our own verified data.

## 6. Ratings
- **Discipline: 9/10** — Kept the DevLog updated and stuck to a tests-first approach.
- **Code Quality: 8/10** — Refactored the audit engine into a solid pipeline.
- **Design Sense: 9/10** — Happy with the pivot to the custom visual system.
- **Problem Solving: 8/10** — Fixed some nasty build crashes.
- **Product Thinking: 9/10** — Kept the focus on "CFO-ready" output.
