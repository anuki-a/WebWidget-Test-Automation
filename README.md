# Web Widget Test Suite - Playwright Automation Framework

## Overview

This is a comprehensive Playwright + TypeScript test automation framework for testing the **Web Widget** customer-facing application and its integration with the **AC Admin Portal**.

## Architecture

The framework follows a hybrid approach combining UI automation with API-driven test setup for maximum reliability and speed.

### Key Components

- **Web Widget**: Customer-facing appointment booking application (public)
- **AC Admin Portal**: Internal administration application (private)
- **API Layer**: Handles test data setup and validation
- **UI Layer**: Page Object Model with reusable components

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

- **Core Flows**: Create, Edit, Cancel appointments
- **Configuration**: Meeting preferences, validation rules, holidays
- **Localization**: Spanish language support
- **Advanced Features**: URL parameters, staff selection, checklists

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

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npx playwright test tests/widget/OAC-20001_BookAppointment.spec.ts
```

### Run with UI Mode (for debugging)
```bash
npx playwright test --ui
```

### Run with HTML Report
```bash
npx playwright test --reporter=html
```

## Development Workflow

### Adding New Tests

1. Create test file in `tests/widget/` following naming convention: `OAC-XXXXX_TestName.spec.ts`
2. Use existing fixtures for test setup
3. Leverage page objects and components
4. Add API validation where applicable

### Debugging Tips

- Use Playwright Inspector: `npx playwright test --debug`
- Check HTML reports for detailed failure information
- Use `page.pause()` in tests for manual debugging
- Enable trace viewer for deep analysis: `npx playwright test --trace on`

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BASE_URL` | Widget application URL | Yes |
| `API_URL` | Backend API URL | Yes |
| `ADMIN_USERNAME` | AC Admin Portal username | Yes |
| `ADMIN_PASSWORD` | AC Admin Portal password | Yes |
| `TEST_ENVIRONMENT` | Test environment identifier | No |

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

## Contributing

1. Follow existing code patterns and naming conventions
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

[Insert your license information here]
