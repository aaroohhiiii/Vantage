## METRICS.md

**North Star Metric: Audits completed per week**

Why this and not signups or page views:
An audit completed means the user saw value. Signups can be gamed. 
Page views don't indicate intent. Completion = value delivered = 
a potential lead warmed. This is a B2B lead-gen tool used occasionally, 
not a daily-use app — DAU is a vanity metric here.

**3 Input Metrics:**

1. Audit start rate (visitors who begin Step 1 / total visitors)
   Target: >40%. Below 25% means the landing page isn't converting.

2. Audit completion rate (Step 3 submitted / Step 1 started)
   Target: >60%. Below 40% means the form is too long or confusing.

3. Email capture rate (emails submitted / audits completed)
   Target: >25%. Below 15% means the results aren't compelling enough 
   to earn the lead, or the value prop of capturing isn't clear.

**What to instrument first:**
- Page view on landing page
- Step 1 started (tool selected)
- Step 2 completed (spend entered)
- Step 3 submitted (audit run)
- Results page viewed
- Email capture submitted
- Share button clicked
- Credex CTA clicked

Use Vercel Analytics (free) or a simple event log table in Supabase.

**Pivot trigger:**
If email capture rate stays below 15% after 500 audits: 
the results page isn't creating enough urgency or perceived value. 
Pivot: add benchmark data ("companies your size spend $X on average"), 
improve the visual design of savings numbers, or add social proof.
