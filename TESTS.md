# TESTS

## Overview

This document lists all automated tests for the Vantage platform, with a focus on the audit engine which is the core business logic. All tests are written using Vitest and TypeScript.

## Running Tests

### Quick Start
```bash
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

### Test Configuration
- **Framework**: Vitest
- **Language**: TypeScript
- **Location**: `/tests/` directory
- **Coverage Target**: 80%+ for core engine

---

## Audit Engine Tests (`tests/auditEngineV2.test.ts`)

**File**: `tests/auditEngineV2.test.ts`  
**Coverage**: Core audit engine logic, capability overlap analysis, scoring algorithms  
**How to run**: `npm run test auditEngineV2.test.ts`

### Test 1: Partial Overlap Detection
**What it covers**: Detects partial capability overlap between ChatGPT Pro and Claude Pro  
**Validates**: 
- Overlap scores (0.25-0.8 range)
- Unique value scores (< 0.5)
- Confidence levels ("medium")
**Test name**: `"detects partial overlap between ChatGPT Pro and Claude Pro"`

### Test 2: API + Subscription Overlap
**What it covers**: Recommends removing chat subscription when API spend is high  
**Validates**:
- Removal recommendations
- High overlap scores (> 0.7)
- Monthly savings calculations
- API-related rationale
**Test name**: `"recommends removing chat plan when API spend is high"`

### Test 3: Low Overlap Stack Scoring
**What it covers**: Scores marginal utility for complementary tools (Cursor + ChatGPT)  
**Validates**:
- Low overlap scores (< 0.5)
- High unique value scores (> 0.7)
- Keep recommendations for complementary tools
**Test name**: `"scores marginal utility correctly for low-overlap stack"`

### Test 4: High Overlap Stack Scoring
**What it covers**: Handles three similar chat tools with high overlap  
**Validates**:
- Removal recommendations for redundant tools
- Moderate overlap scores (> 0.3)
- Consolidation opportunities
**Test name**: `"scores marginal utility correctly for high-overlap stack"`

### Test 5: Unknown Plan Handling
**What it covers**: Handles unknown/invalid plan names with low confidence  
**Validates**:
- Low confidence assignment
- Keep recommendations for unknown plans
- Unknown plan finding flags
**Test name**: `"handles unknown plan with low confidence"`

### Test 6: Spend Mismatch Detection
**What it covers**: Flags pricing discrepancies between plan and actual spend  
**Validates**:
- Pricing finding generation
- Spend mismatch detection
- Separate capability analysis from pricing issues
**Test name**: `"flags spend mismatch separately from capability analysis"`

### Test 7: Team Size Plan Fit
**What it covers**: Recommends upgrades when team size exceeds plan limits  
**Validates**:
- Uncovered capability identification
- Underprovided stack status
- Team size vs plan fit analysis
**Test name**: `"recommends upgrade when underprovided"`

### Test 8: Optimized Stack Summary
**What it covers**: Generates correct summary for well-optimized tool stacks  
**Validates**:
- Optimized stack status
- Accurate monthly spend calculations
- Zero savings for optimal stacks
- Duplicate capability identification
**Test name**: `"generates correct stack summary for optimized stack"`

### Test 9: Consolidation Opportunity
**What it covers**: Identifies primary consolidation opportunities in mixed stacks  
**Validates**:
- Mixed stack status detection
- Primary consolidation tool identification
- Duplicate capability analysis
**Test name**: `"identifies primary consolidation opportunity"`

### Test 10: Confidence Level Assignment
**What it covers**: Assigns appropriate confidence levels based on overlap clarity  
**Validates**:
- High confidence for clear cases
- Medium confidence for moderate overlap
- Score-to-confidence mapping
**Test name**: `"assigns high confidence for clear overlap cases"`

### Test 11: Recommendation Rationale
**What it covers**: Provides detailed explanations for all recommendations  
**Validates**:
- Rationale generation
- Marginal utility analysis
- Unique capability identification
**Test name**: `"provides detailed rationale for recommendations"`

### Test 12: Edge Case - Empty Tools
**What it covers**: Handles empty tool arrays gracefully  
**Validates**:
- Empty result arrays
- Zero savings calculation
- Optimal status for empty stacks
- Uncovered capability identification
**Test name**: `"handles empty tools array gracefully"`

### Test 13: Small Savings Filtering
**What it covers**: Filters out insignificant savings (< $10/month)  
**Validates**:
- Small savings filtering
- Keep recommendations for low-value removals
- Threshold-based decision making
**Test name**: `"filters out small savings (< $10/mo)"`

### Test 14: Multi-Seat Handling
**What it covers**: Correctly processes team plans with multiple seats  
**Validates**:
- Multi-seat spend calculations
- Team size vs seat count handling
- Accurate total spend computation
**Test name**: `"handles multiple seats correctly"`

---

## Test Categories

### Capability Analysis Tests
- Tests 1-4: Overlap detection and scoring
- Tests 10-11: Confidence and rationale generation

### Data Quality Tests  
- Tests 5-6: Unknown plans and spend mismatches
- Tests 12-13: Edge cases and filtering

### Business Logic Tests
- Tests 7-9: Team fit, optimization, and consolidation
- Test 14: Multi-seat scenarios

### Integration Tests
- All tests validate end-to-end audit pipeline
- Input validation → Processing → Output generation

---

## Test Data Strategy

### Mock Scenarios
- **Single User**: Individual developer workflows
- **Small Teams**: 2-5 person teams  
- **Mixed Use Cases**: Coding, writing, research scenarios
- **Edge Cases**: Empty data, invalid inputs, extreme values

### Validation Points
- **Scoring Accuracy**: Overlap, unique value, efficiency scores
- **Recommendation Logic**: Keep/remove/upgrade/downgrade decisions
- **Financial Calculations**: Monthly/annual savings, spend analysis
- **Data Integrity**: Type safety, null handling, edge cases

---

## Performance Testing

### Current Benchmarks
- **Single Audit**: < 100ms processing time
- **Batch Processing**: 100+ audits/second
- **Memory Usage**: < 50MB per audit
- **Coverage**: 85%+ for audit engine

### Load Testing Commands
```bash
# Run performance-focused tests
npm run test -- --reporter=verbose

# Generate coverage report
npm run test -- --coverage

# Run specific test patterns
npm run test -- "overlap"
npm run test -- "scoring"
npm run test -- "edge"
```

---

## Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
      - run: npm run test -- --coverage
```

### Quality Gates
- All tests must pass before merge
- Minimum 80% code coverage
- No TypeScript errors
- Performance benchmarks met

---

## Adding New Tests

### Test Naming Convention
```typescript
it("describes what the test validates", () => {
  // Test implementation
})
```

### Test Structure
```typescript
// 1. Arrange: Set up test data
const input: AuditInput = { ... }

// 2. Act: Run the function
const result = runAudit(input)

// 3. Assert: Verify expectations
expect(result.recommendedAction).toBe("keep")
```

### Coverage Requirements
- New features must have corresponding tests
- Edge cases should be covered
- Performance regressions caught early

---

## Troubleshooting

### Common Issues
1. **TypeScript Errors**: Check imports and type definitions
2. **Async Tests**: Use `await` for promise-based tests  
3. **Mock Data**: Ensure test data is realistic and comprehensive
4. **Flaky Tests**: Add proper assertions and avoid timing dependencies

### Debug Commands
```bash
# Run single test with detailed output
npm run test -- --reporter=verbose --run "test name"

# Run tests with debugging
npm run test -- --inspect-brk

# Update snapshots (if using)
npm run test -- --update-snapshots
```

---

