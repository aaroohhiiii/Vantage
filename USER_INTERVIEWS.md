## User Interview 1: 
**Participant:** Saumitra Chaubey (Intern @Credex)
**Company Stage:** Early stage startup
**Date:** May 12, 2026

**Key Quotes on Design:**
- "This looks very AI generated... that's the immediate feel I get. The gradient is too much. It's not looking professional at all."
- "The texts are not visible. You can't read what's on there. There's no transparency on how things are calculated."
- "It doesn't feel like an ENGINEERED PLATFORM rather generated."

**Key Quotes on Value:**
- "As an engineer, I need to understand HOW the numbers are calculated. Not just 'you save $500.' Show me the math."
- "You're using black everywhere—it's not professional. Make it cleaner, simpler. White backgrounds, readable text."
- "Try to increase transparency of calculation. That's the key thing. I need to trust this."

**Most Surprising Thing They Said:**
"It doesn't feel engineered because the UI gives away that it was generated." 
This signals that for engineering leaders, **visual design directly signals trustworthiness.** A gradient suggests "low-effort AI generated," whereas white/clean/high-contrast suggests "engineers built this."

**What it Changed About the Design:**
- **Eliminated Gradients:** Switched to #FFFFFF backgrounds with high-contrast text to signal "professional tool."
- **Calculation Transparency:** Implemented the "Methodology Section" and "Math" callouts in recommendations.
- **Engine Logic:** Moved away from "black-box" summaries toward rule-based justifications.


---
## User Interview 2:
**Participant:** Karthik Sarma (SDE Intern @OmnisageAI)
**Company Stage:** Startup
**Date:** May 12, 2026

**Key Quotes:**
- "It feels like there is too much 'designing' happening. I feel it should be simpler; the UI needs to signal that it's legit, not just flashy."
- "The audit engine logic itself is fine and detailed, but the UI needs work to look more professional and less like a prototype."
- "Adding a formal login or a more structured access method would make it feel more like a real enterprise tool."

**Most Surprising Thing They Said:**
"The UI needs to signal that it's legit, not just flashy." 
This reinforced the idea that for technical users, **heavy styling can actually reduce trust.** They equate "simple and clean" with "engineered and reliable," whereas "too much designing" can feel like a cover for thin logic.

**What it Changed About the Design:**
- **Simplified the Hero Section:** Reduced the visual noise and neon effects in favor of high-contrast data visualization.
- **Enhanced Professionalism:** Focused on the "detailed work on the UI" by aligning everything to a strict grid and using professional typography.
- **Trust Signals:** Emphasized the "Verified Pricing" and "Methodology" sections to provide the "legit" signal he was looking for without requiring a full login wall.

---
## User Interview 3:
**Participant:** Varun Mantri (Engineer @Swiggy)
**Company Stage:** MNC
**Date:** May 13, 2026

**Key Quotes:**
- "The feedback provided by the engine is very detailed."
- "The depth of the analysis is good enough for a 7 day project."

**Most Surprising Thing They Said:**
"The feedback is detailed." 
Coming from an engineer at a large-scale MNC like Swiggy, this was a strong validation of our **Engine V3 upgrade.** It confirmed that the granular data and specific justifications we added are not "too much," but rather meet the expectations of professionals used to working with high-complexity systems.

**What it Changed About the Design:**


## Summary of Project Impact

The user interview phase served as the primary catalyst for the **Dual Upgrade** of the Vantage platform. By listening to engineering leaders and peers, the project pivoted from a "SaaS Prototype" to a "Consultant-Grade Tool."

### 1. UI Upgrade: From "AI-Generated" to "Engineered"
- **The Shift:** Removed all neon gradients, heavy shadows, and low-contrast backgrounds.
- **The Result:** Implemented a high-contrast, white-background UI with professional "IDE" typography (Geist/Inter). This shift directly addressed the "trust gap" identified in Interview 1, where flashy design was perceived as a lack of engineering depth.

### 2. Engine Upgrade: From "Black Box" to "Engine V3"
- **The Shift:** Abandoned the Jaccard Similarity model in favor of the **Containment Scoring Model** (intersection / tool_capabilities).
- **The Result:** The engine now prioritizes "Functional Redundancy" and provides a full math breakdown for every recommendation.

