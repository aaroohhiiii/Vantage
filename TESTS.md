# Audit Engine Validation (TESTS.md)

This document records the current test suite for the Vantage Audit Engine V2, focusing on capability mapping, overlap scoring, and recommendation accuracy.

## Core Audit Tests (`tests/auditEngineV2.test.ts`)

The following tests validate the "Science of Savings" logic across various stack configurations:

### 1. High Overlap Detection
- **Scenario**: User has both ChatGPT Pro and Claude Pro ($20/mo each).
- **Validation**: The engine correctly identifies that one tool is redundant. It assigns a maximum **Overlap Score of 0.95** to the redundant tool and recommends its removal.
- **Goal**: Prevent paying twice for the same LLM capability set.

### 2. Category Conflict Resolution
- **Scenario**: User has both Cursor Pro ($20/mo) and GitHub Copilot ($10/mo) for coding.
- **Validation**: The engine identifies a "Category Conflict: Multiple IDE tools detected."
- **Recommendation**: It marks GitHub Copilot as the **Primary Consolidation Opportunity** (as it was processed second and overlaps with the primary IDE).
- **Goal**: Ensure the user only maintains one primary tool per category.

### 3. Marginal Utility Scoring
- **Scenario**: User has Cursor Pro and ChatGPT Pro.
- **Validation**: The engine recognizes that an IDE (Cursor) and a Chat tool (ChatGPT) belong to different categories.
- **Outcome**: Both tools receive an **Overlap Score below 0.7** and are recommended to be **kept**, as their marginal utility remains high for a mixed use case.
- **Goal**: Avoid over-aggressive consolidation that would remove unique tool value.

### 4. Large Team Handling
- **Scenario**: Team size of 50 using Cursor and GitHub Copilot.
- **Validation**: The engine disables "forced redundancy" logic for large teams, recognizing that different sub-teams might require different tools.
- **Outcome**: The Overlap Score is calculated naturally based on capabilities rather than being forced to 0.95.
- **Goal**: Maintain flexibility for enterprise-scale auditing.

### 5. Data Quality & Edge Cases
- **Scenario**: Empty tools array.
- **Validation**: The engine returns a clean, empty results array with $0 total savings and no crashes.
- **Goal**: Ensure system stability under all input conditions.

## Running Tests

To verify these audit rules locally, run the Vitest suite:

```bash
npm run test
```

Current Status: **7/7 Passed**
   ✓ runAudit V2 > detects high overlap between ChatGPT Pro and Claude Pro
   ✓ runAudit V2 > recommends removing redundant tool in the same category
   ✓ runAudit V2 > scores marginal utility correctly for low-overlap stack
   ✓ runAudit V2 > identifies primary consolidation opportunity in an overlapping stack
   ✓ runAudit V2 > provides specific rationale for category conflict
   ✓ runAudit V2 > handles empty tools array
   ✓ runAudit V2 > calculates overlap correctly for large teams
