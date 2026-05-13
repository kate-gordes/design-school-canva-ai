# Testing Guide

This project includes automated testing with GitHub Actions for pull requests, including linting, building, and end-to-end testing with Playwright.

## Automated PR Checks

Every pull request automatically runs:

1. **Linting** - ESLint checks for code quality (errors fail, warnings allowed)
2. **Formatting** - Prettier checks for code formatting (enforced)
3. **Build** - Verifies the project builds without errors
4. **E2E Tests** - Playwright tests in Chrome only

## Running Tests Locally

### Prerequisites

Install dependencies:

```bash
npm install
```

Install Playwright browsers (first time only):

```bash
npx playwright install
```

### Linting and Formatting

```bash
# Run ESLint (strict - warnings cause failure)
npm run lint

# Run ESLint (allows warnings, fails on errors only)
npm run lint:check

# Check Prettier formatting
npm run format:check

# Auto-fix Prettier formatting
npm run format
```

### Building

```bash
# Build the project
npm run build

# Build and preview
npm run preview
```

### End-to-End Tests

```bash
# Run all tests (development mode - uses dev server)
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests visually (single browser, slow, for watching)
npm run test:e2e:visual

# Run CI tests (uses production build)
npm run test:e2e:ci
```

**Note**:

- `test:e2e`, `test:e2e:ui`, `test:e2e:headed` use the development configuration (fast dev server)
- `test:e2e:visual` is perfect for watching tests run slowly in a single browser window
- `test:e2e:ci` uses the production configuration for GitHub Actions

### Test Files

- `tests/e2e/app.spec.ts` - Main application testing (navigation, routing, basic functionality)
- `tests/e2e/editor.spec.ts` - Editor page specific tests
- `tests/e2e/ui-interactions.spec.ts` - UI component interactions, forms, responsive design

## What Gets Tested

### Core Functionality

- ✅ Page loading and rendering
- ✅ Navigation between pages
- ✅ Direct route access
- ✅ Mobile responsiveness
- ✅ No JavaScript console errors

### User Interactions

- ✅ Button clicks and hover states
- ✅ Form inputs and interactions
- ✅ Modal/popup functionality
- ✅ Keyboard navigation
- ✅ Desktop UI interactions

### Browser Compatibility

- ✅ Chrome/Chromium (primary testing browser)

### Accessibility

- ✅ Basic ARIA attributes
- ✅ Keyboard navigation
- ✅ Focus management

## Debugging Failed Tests

If tests fail, you can:

1. **View test reports**: Check the GitHub Actions artifacts for detailed reports
2. **Run locally**: Use `npm run test:e2e:ui` for interactive debugging
3. **View screenshots**: Failed tests automatically capture screenshots
4. **Check console errors**: Tests validate that no critical JavaScript errors occur

## Test Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- Multiple browser testing
- Screenshot and video capture on failure
- Retry logic for flaky tests
- CI-optimized settings

## Adding New Tests

To add new tests:

1. Create new `.spec.ts` files in `tests/e2e/`
2. Follow the existing patterns for page object interactions
3. Use descriptive test names and group related tests in `describe` blocks
4. Include both positive and negative test cases
5. Test responsive behavior for important features

## CI/CD Integration

The GitHub Actions workflow (`/.github/workflows/pr-checks.yml`) ensures:

- All checks must pass before merging
- Tests run on multiple browsers
- Build artifacts are preserved for debugging
- Proper timeout and retry handling
- Clear success/failure reporting
