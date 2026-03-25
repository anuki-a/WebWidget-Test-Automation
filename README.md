# Web Widget Test Suite - Playwright Automation Framework

## Overview

This is a comprehensive Playwright + TypeScript test automation framework for testing the **Web Widget** customer-facing application and its integration with the **AC Admin Portal**.

## Architecture

The framework follows a hybrid approach combining UI automation with API-driven test setup for maximum reliability and speed.

### Current Implementation Status

#### ✅ **Completed Components**

- **API Layer** (4 files): Full backend integration with authentication
  - `apiClient.ts`: Base API wrapper using Playwright request
  - `ProvisioningClient.ts`: Service/Location/Availability setup
  - `ConfigClient.ts`: Widget configuration management
  - `AppointmentClient.ts`: Appointment CRUD operations

- **Pages** (6 files): Complete Page Object Model
  - `ServicePage.ts`: Service selection and category navigation
  - `LocationPage.ts`: Location search and selection
  - `MeetingPreferencePage.ts`: Meeting type preferences
  - `DateTimePage.ts`: Date/time selection with calendar integration
  - `PersonalDetailsPage.ts`: Customer information forms
  - `ConfirmationPage.ts`: Booking verification and cancellation

- **Components** (2 files): Reusable UI elements
  - `CalendarComponent.ts`: Date picker with availability validation
  - `TimeSlotComponent.ts`: Time slot selection with async loading

- **Fixtures** (1 file): Test data generation
  - `bookingFixture.ts`: Dynamic booking data with customer generation

- **Utilities** (2 files): Helper functions
  - `testDataBuilder.ts`: Customer data generation
  - `dateUtils.ts`: Date formatting and calculation

- **Types** (1 file): TypeScript definitions
  - `bookingTypes.ts`: Complete type definitions for booking data

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
│   │   ├── ProvisioningClient.ts # Service/Location setup
│   │   ├── ConfigClient.ts      # Widget configuration
│   │   └── AppointmentClient.ts # Appointment operations
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
│   │   └── SkipPopup.ts
│   ├── fixtures/                # Test data setup and context
│   │   ├── baseFixture.ts
│   │   └── bookingFixture.ts
│   └── utils/                   # Helper utilities
│       ├── testDataBuilder.ts
│       ├── dateUtils.ts
│       └── randomGenerator.ts
├── tests/
│   ├── auth.setup.ts            # Authentication setup
│   └── widget/                  # Test specifications
│       ├── OAC-20001_BookAppointment.spec.ts
│       └── ...
└── data/                        # Static test data
    └── testcases_refined.json
```

## Test Coverage

The framework covers the complete appointment booking lifecycle:

### ✅ **Implemented Tests (2/20)**

- **Core Flows**:
  - ✅ OAC-20001: Create Appointment (end-to-end)
  - ✅ OAC-20004: Cancel Appointment (full flow with validation)
- **Framework Verification**: Basic connectivity and page load tests
- **API Health Check**: Backend connectivity validation

### 🔄 **Planned Coverage (18 remaining)**

- **Core Flows**: Edit appointments, Non-editable validation
- **Configuration**: Meeting preferences, validation rules, holidays
- **Localization**: Spanish language support
- **Advanced Features**: URL parameters, staff selection, checklists
- **Multi-booking**: Book another, Book after cancel
- **Skip Behavior**: Skip confirmation flows
- **Validation Rules**: Email/phone validation
- **Calendar & Availability**: Holiday restrictions, timeslot availability

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
# Book Appointment test
npx playwright test tests/widget/OAC-20001_BookAppointment.spec.ts

# Cancel Appointment test
npx playwright test tests/widget/OAC-20004_CancelAppointment.spec.ts

# Framework verification
npx playwright test tests/verification/framework-check.spec.ts

# API health check
npx playwright test tests/api/api-health-check.spec.ts
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

### ✅ **Completed (March 25, 2026)**

- **Phase 1 Foundation**: 100% complete
- **Framework Architecture**: Hybrid API + UI approach working
- **Core Components**: All pages, components, and API clients functional
- **Test Implementation**: 2 end-to-end tests passing
- **Build System**: TypeScript compilation and Playwright configuration stable

### 🔄 **In Progress**

- **Phase 2 Expansion**: Adding remaining 18 test cases
- **API Layer Enhancement**: Additional configuration endpoints
- **Component Expansion**: Skip popups, language switcher, checklist components

### 📋 **Next Development Priorities**

1. **OAC-20002**: Edit Appointment functionality
2. **Validation Rules**: Email/phone validation components
3. **Meeting Preferences**: Multi-preference configuration
4. **Calendar Enhancements**: Holiday restrictions and past date validation
5. **Localization**: Spanish language support

### 📊 **Project Metrics**

- **Source Files**: 16 TypeScript files implemented
- **Test Files**: 5 tests created (2 functional, 1 verification, 1 API health check)
- **Coverage**: 10% of target test cases (2/20)
- **Framework Readiness**: 100% - Ready for rapid test case development

---

## Contributing

1. Follow existing code patterns and naming conventions
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass before submitting
5. Use the established architecture: `Test → Fixture → Page → Component → API`

## License

[Insert your license information here]
