# METRICS.md

## North Star Metric: Audits Completed per Week

### Why this metric?
An audit completed means the user saw value. Unlike signups or page views, a completion indicates that a potential B2B lead has invested time into the product and received a personalized value proposition. For a tool used occasionally (not daily), DAU is a vanity metric; **Value Delivery Frequency** is the true indicator of product-market fit.

---

## 3 Core Input Metrics

### 1. Audit Start Rate
*   **Definition:** (Visitors who begin Step 1) / (Total Unique Visitors)
*   **Target:** >40%
*   **Insight:** If this is below 25%, the landing page copy isn't creating enough urgency or the "No Login" value prop isn't clear enough.

### 2. Audit Completion Rate
*   **Definition:** (Step 3 Submitted) / (Step 1 Started)
*   **Target:** >60%
*   **Insight:** If this falls below 40%, the form is either too long, the UI is confusing, or the questions are perceived as too intrusive for a "free" tool.

### 3. Email Capture Rate
*   **Definition:** (Emails Submitted) / (Audits Completed)
*   **Target:** >25%
*   **Insight:** This is our primary lead-gen metric. Below 15% means the results page isn't compelling enough to "earn" the user's email, or the incentive for the report (PDF/Updates) is weak.

---

## Initial Instrumentation Plan
We use a simple event log in Supabase (`analytics_events`) to track:
1.  **`page_view_landing`**: Top-of-funnel baseline.
2.  **`audit_start`**: User selected their first tool.
3.  **`audit_submitted`**: User reached the finish line.
4.  **`results_viewed`**: User saw their savings report.
5.  **`email_capture_submitted`**: Successful lead generation.
6.  **`credex_cta_clicked`**: High-intent handoff to our monetization partner.

---

## The Pivot Trigger
If the **Email Capture Rate** stays below 15% after 500 completed audits, we will trigger a design pivot.

**Pivot Options:**
-   **Benchmark Data:** Add "Companies your size typically spend $X" to create FOMO.
-   **Visual Urgency:** Make the "Annual Waste" number significantly larger and more prominent.
-   **Social Proof on Results:** Add testimonials specifically about the accuracy of the savings found.
