# Web Widget Test Suite - Playwright Automation Framework

## Overview

This is a comprehensive Playwright + TypeScript test automation framework for testing the **Web Widget** customer-facing application and its integration with the **AC Admin Portal**.

## Architecture

The framework follows a hybrid approach combining UI automation with API-driven test setup for maximum reliability and speed.

## Important

It is good to prevent parallely run Webwidget Tests. AC configurations are switched in between the tests, and also those configurations need more than 5 minutes to reflect in webwidget. Therefore sequential running will be most suitable for the test suite.

Recommending to keep 2 locations for automation testing (better separate those locations from using in other manual testing purposes):
- Location 1: For testing basic functionality (creation, cancellation, rescheduling)
- Location 2: For testing appointment Availability, appointment Time Slots, spanish translations, select staff preference related tests 


### Current Implementation Status

#### ✅ **Completed Components**

- **API Layer** (5 files): Full backend integration with authentication
  - `apiClient.ts`: Base API wrapper using Playwright request
  - `AdminService.ts`: Admin portal operations and configuration
  - `AppointmentService.ts`: Appointment CRUD operations
  - `AuthService.ts`: Authentication and session management
  - `ProductService.ts`: Product and service management

- **Pages** (6 files): Complete Page Object Model
  - `ServicePage.ts`: Service selection and category navigation
  - `LocationPage.ts`: Location search and selection
  - `MeetingPreferencePage.ts`: Meeting type preferences
  - `DateTimePage.ts`: Date/time selection with calendar integration
  - `PersonalDetailsPage.ts`: Customer information forms
  - `ConfirmationPage.ts`: Booking verification and cancellation

- **Components** (4 files): Reusable UI elements
  - `CalendarComponent.ts`: Date picker with availability validation
  - `TimeSlotComponent.ts`: Time slot selection with async loading
  - `LanguageSwitcher.ts`: Language selection and Spanish localization
  - `StaffComponent.ts`: Staff selection and Spanish speaker requests

- **Fixtures** (1 file): Test data generation
  - `bookingFixture.ts`: Dynamic booking data with customer generation

- **Utilities** (2 files): Helper functions
  - `testDataBuilder.ts`: Customer data generation
  - `dateUtils.ts`: Date formatting and calculation

- **Types** (1 file): TypeScript definitions
  - `bookingTypes.ts`: Complete type definitions for booking data

- **Data** (2 files): Static data and translations
  - `testcases_refined.json`: Test case specifications
  - `spanishTranslations.ts`: Spanish language translations

## Tech Stack

- **Playwright**: Test runner and browser automation
- **TypeScript**: Type-safe development
- **Node.js**: Runtime environment
- **dotenv**: Environment configuration management

## Project Structure

```
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
├── .env                         # Environment variables
├── src/
│   ├── api/                     # API clients for backend operations
│   │   ├── apiClient.ts         # Base API wrapper
│   │   ├── AdminService.ts      # Admin portal operations
│   │   ├── AppointmentService.ts # Appointment CRUD
│   │   ├── AuthService.ts       # Authentication
│   │   └── ProductService.ts    # Product management
│   ├── pages/                   # Page Object Models
│   │   ├── ServicePage.ts
│   │   ├── LocationPage.ts
│   │   ├── MeetingPreferencePage.ts
│   │   ├── DateTimePage.ts
│   │   ├── PersonalDetailsPage.ts
│   │   └── ConfirmationPage.ts
│   ├── components/              # Reusable UI components
│   │   ├── CalendarComponent.ts
│   │   ├── TimeSlotComponent.ts
│   │   ├── LanguageSwitcher.ts
│   │   └── StaffComponent.ts
│   ├── fixtures/                # Test data setup and context
│   │   └── bookingFixture.ts
│   ├── utils/                   # Helper utilities
│   │   ├── testDataBuilder.ts
│   │   └── dateUtils.ts
│   ├── types/                   # TypeScript definitions
│   │   └── bookingTypes.ts
│   └── data/                    # Static data and translations
│       ├── testcases_refined.json
│       └── spanishTranslations.ts
└── tests/
    ├── auth.setup.ts            # Authentication setup
    ├── global.teardown.ts       # Global cleanup
    ├── api/                     # API tests
    └── widget/                  # Test specifications (20 tests)
        ├── OAC-20001_BookAppointment.spec.ts
        ├── OAC-20002_EditAppointment.spec.ts
        └── ... (18 more tests)
```

## Test Coverage

The framework covers the complete appointment booking lifecycle:

### ✅ **Implemented Tests (20/20) - 100% Complete**

#### **Core Flows (4 tests)**
- ✅ OAC-20001: Book Appointment (end-to-end booking flow)
- ✅ OAC-20002: Edit Appointment (modify date/time and personal details)
- ✅ OAC-20003: Non-Editable Appointment (validation of non-editable state)
- ✅ OAC-20004: Cancel Appointment (full cancellation flow)

#### **Multi-Booking Flows (2 tests)**
- ✅ OAC-20005: Book Another (book second appointment after first)
- ✅ OAC-20006: Cancel and Book Another (cancellation + rebooking)

#### **Skip Behavior (2 tests)**
- ✅ OAC-20007: Skip Enabled - Redirect (skip appointment with Yes)
- ✅ OAC-20008: Skip Enabled - Continue (skip appointment with No)

#### **Validation & Configuration (4 tests)**
- ✅ OAC-20009: Personal Details Configuration (email/phone validation)
- ✅ OAC-20010: Single Meeting Preference (skip MP page)
- ✅ OAC-20011: Multiple Meeting Preferences (multi-option selection)
- ✅ OAC-20012: Meet Via Phone Validations (phone-specific validation)

#### **Calendar & Availability (4 tests)**
- ✅ OAC-20013: Partial Holiday Behavior (partial day restrictions)
- ✅ OAC-20014: Full Holiday Behavior (full day restrictions)
- ✅ OAC-20015: Past Date Selection (past date validation)
- ✅ OAC-20016: Time Slot Availability Handling (slot availability logic)

#### **Localization & Advanced Features (4 tests)**
- ✅ OAC-20017: Spanish Translations (Spanish language support)
- ✅ OAC-20018: Checklist Behaviour (checklist functionality)
- ✅ OAC-20019: URL Parameters (loc and svc parameter handling)
- ✅ OAC-20020: Staff Selection & Spanish Speaker (manual staff selection)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Access to AC Admin Portal for API setup

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment template:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:

   ```env
   # Widget Configuration
   BASE_URL=https://your-widget-url.com
   API_URL=https://your-api-url.com

   # AC Admin Portal Credentials
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-admin-password

   # Test Configuration
   TEST_ENVIRONMENT=qa
   ```

5. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### ✅ **Working Tests**

#### Run All Implemented Tests

```bash
npm test
```

#### Run Specific Test

```bash
# Run all widget tests
npx playwright test tests/widget/

# Run specific test by number
npx playwright test tests/widget/OAC-20001_BookAppointment.spec.ts
npx playwright test tests/widget/OAC-20017_SpanishTranslations.spec.ts

# Run tests by category (using grep)
npx playwright test --grep "@functional"
npx playwright test --grep "@validation"
npx playwright test --grep "@localization"
```

#### Run with UI Mode (for debugging)

```bash
npx playwright test --ui
```

#### Run with HTML Report

```bash
npx playwright test --reporter=html
```

#### Run Specific Browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

## Development Workflow

### ✅ **Current Implementation**

#### Adding New Tests

1. Create test file in `tests/widget/` following naming convention: `OAC-XXXXX_TestName.spec.ts`
2. Use existing fixtures for test setup:
   ```typescript
   import { test } from "../src/fixtures/bookingFixture";
   ```
3. Leverage page objects and components:
   ```typescript
   const servicePage = new ServicePage(page);
   const locationPage = new LocationPage(page);
   ```
4. Add API validation where applicable

#### Test Data Management

- **Dynamic Generation**: All test data created at runtime via `TestDataBuilder`
- **Fixtures**: Reusable test setup through `bookingFixture.ts`
- **No Hardcoded Data**: Customer names, dates, and locations generated programmatically

#### Architecture Pattern

Follow the established flow: `Test → Fixture → Page → Component → API`

- ❌ NO direct locators in tests
- ✅ Use page objects for all UI interactions
- ✅ Use API clients for backend operations
- ✅ Use components for reusable UI elements

### Debugging Tips

- Use Playwright Inspector: `npx playwright test --debug`
- Check HTML reports for detailed failure information
- Use `page.pause()` in tests for manual debugging
- Enable trace viewer for deep analysis: `npx playwright test --trace on`

## Configuration

### Environment Variables

| Variable           | Description                 | Required |
| ------------------ | --------------------------- | -------- |
| `BASE_URL`         | Widget application URL      | Yes      |
| `API_URL`          | Backend API URL             | Yes      |
| `ADMIN_USERNAME`   | AC Admin Portal username    | Yes      |
| `ADMIN_PASSWORD`   | AC Admin Portal password    | Yes      |
| `TEST_ENVIRONMENT` | Test environment identifier | No       |

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Timeout**: 30 seconds default
- **Retries**: 2 attempts on failure
- **Workers**: Parallel execution enabled
- **Browser**: Chromium (configurable)

## Test Data Management

- **Dynamic Generation**: Test data created at runtime via API
- **Fixtures**: Reusable test setup configurations
- **No Hardcoded Data**: All test data generated programmatically

## Best Practices

1. **API-First Setup**: Use APIs for test data creation
2. **Page Object Model**: Separate UI logic from test logic
3. **Component Reuse**: Share UI components across pages
4. **Smart Waits**: Use Playwright's built-in waiting mechanisms
5. **Clean Teardown**: Ensure tests clean up after execution

## Troubleshooting

### Common Issues

1. **Authentication Failures**: Check admin credentials in `.env`
2. **Browser Launch Issues**: Run `npx playwright install`
3. **API Timeouts**: Verify API URL and network connectivity
4. **Test Data Conflicts**: Ensure proper test isolation

### Getting Help

- Check test logs in `test-results/` directory
- Review HTML reports for detailed error messages
- Consult project documentation in `docs/` folder

## Current Status & Next Steps

### ✅ **Completed (April 2026)**

- **Phase 1 Foundation**: 100% complete (March 2026)
- **Phase 2 Test Implementation**: 100% complete (April 2026)
- **Framework Architecture**: Hybrid API + UI approach fully operational
- **All Components**: 5 API services, 6 pages, 4 components, fixtures, and utilities
- **Test Coverage**: 20/20 test cases implemented and passing
- **Localization**: Spanish language support fully integrated
- **Advanced Features**: URL parameters, staff selection, holiday handling
- **Build System**: TypeScript compilation and Playwright configuration stable

### � **Next Development Priorities (Phase 3)**

1. **Stability & Hardening**: Reduce test flakiness, optimize waits
2. **CI/CD Integration**: Setup pipeline for automated test execution
3. **Reporting**: Enhance HTML reports, integrate Allure reporting
4. **Performance**: Optimize test runtime, enable safe parallel execution
5. **Documentation**: Add troubleshooting guides, onboarding materials

### 📊 **Project Metrics**

- **Source Files**: 20 TypeScript files implemented
- **Test Files**: 20 functional tests + 3 supporting tests
- **Coverage**: 100% of target test cases (20/20)
- **Framework Status**: Production-ready - All phases complete
- **Code Quality**: TypeScript strict mode, comprehensive JSDoc documentation
- **Test Execution**: Sequential execution recommended (config-dependent tests)

---

## Contributing

1. Follow existing code patterns and naming conventions
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass before submitting
5. Use the established architecture: `Test → Fixture → Page → Component → API`

## License

[Insert your license information here]
