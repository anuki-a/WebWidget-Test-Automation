# Playwright Automation Suite - Planning

## 1. Objective

Build a scalable **Playwright + TypeScript** automation framework to validate appointment booking workflows using a **hybrid approach (UI + API setup)**.

---

## 2. Scope

### In Scope

- End-to-End booking flows
- Appointment lifecycle (Create, Edit, Cancel)
- Config-driven behaviors (MP, Skip, Holidays, Validation rules)
- Localization (Spanish)
- URL parameter behavior
- API-driven test setup

### Out of Scope (Initial Phase)

- Performance testing
- Visual testing
- Mobile-specific testing

---

## 3. Tech Stack

- Playwright Test Runner
- TypeScript
- Node.js
- Playwright `APIRequest` (preferred for API calls)
- `dotenv` (environment configs)

---

## 4. Folder Structure & Responsibilities

```
├── playwright.config.ts
├── src/
│ ├── api/
│ ├── pages/
│ ├── components/
│ ├── fixtures/
│ └── utils/
├── tests/
│ ├── auth.setup.ts
│ └── widget/
└── data/
```

### 4.1 src/api/

**Purpose:** Handle all backend interactions (setup + validation)  
**Examples:** `ProvisioningClient.ts`, `AppointmentClient.ts`, `ConfigClient.ts`  
**Responsibilities:**

- Create services, locations, holidays
- Create/edit/cancel appointments
- Validate data in Admin Portal

### 4.2 src/pages/

**Purpose:** Represent full pages in the widget  
**Examples:** `ServicePage.ts`, `LocationPage.ts`, `MeetingPreferencePage.ts`, `DateTimePage.ts`, `PersonalDetailsPage.ts`, `ConfirmationPage.ts`  
**Rules:**

- Only UI interactions
- No test logic
- No assertions (except small guards if needed)

### 4.3 src/components/

**Purpose:** Reusable UI components shared across pages  
**Examples:** `CalendarComponent.ts`, `TimeSlotComponent.ts`, `SkipPopup.ts`, `Header.ts`  
**Why important:**

- Tests heavily reuse date picker, slot selection, popups

### 4.4 src/fixtures/

**Purpose:** Combine API setup + UI context  
**Examples:** `baseFixture.ts`, `bookingFixture.ts`  
**Responsibilities:**

- Setup test data via API
- Provide ready-to-use objects:
  - `serviceId`
  - `locationId`
  - `appointment data`

### 4.5 src/utils/

**Purpose:** Helpers and test data builders  
**Examples:** `testDataBuilder.ts`, `dateUtils.ts`, `randomGenerator.ts`

### 4.6 tests/

- `auth.setup.ts`: Handles login/session setup, stores `storageState`
- `widget/`: Contains all test specs  
  Examples:
  - `OAC-20001_BookAppointment.spec.ts`
  - `OAC-20002_EditAppointment.spec.ts`

### 4.7 data/

**Purpose:** Store static JSON and test schemas  
**Examples:** `testcases_refined.json`

---

## 5. Core Architecture

### 5.1 Flow Pattern (IMPORTANT)

Instead of putting logic in tests: Test → Page + Component → API + Fixture

- ❌ NO separate "flows" folder
- ✅ Flows implemented inside **fixtures** or **helper functions**

---

## 6. Test Strategy

### Before All (Global)

- Enable widget
- Create base services
- Create locations
- Setup availability (using API)

### Before Each Test

- Configure test-specific data:
  - Meeting preferences
  - Validation rules
  - Holidays
- Create appointment if needed

---

## 7. Mapping Your Testcases

From JSON → Reusable actions → Implementation
| Action | Page/Component |
|--------|----------------|
| Select service | ServicePage |
| Select location | LocationPage |
| Select meeting preference | MeetingPreferencePage |
| Select date/time | CalendarComponent |
| Enter personal details | PersonalDetailsPage |
| Verify confirmation | ConfirmationPage |

---

## 8. Reusability Strategy

- **Reuse via:**
  - Components (calendar, popup)
  - API clients
  - Fixtures (test setup)
- **Avoid:**
  - ❌ Copy-paste test steps
  - ❌ Hardcoded data

---

## 9. Naming Conventions

- Test file: `OAC-20001_BookAppointment.spec.ts`
- Page: `ServicePage.ts`
- Component: `CalendarComponent.ts`
- API: `ProvisioningClient.ts`

---

## 10. Future Enhancements

- Add tagging (smoke/regression)
- CI/CD integration
- Parallel test optimization
- Allure reporting
- Visual testing (optional)

---

## 11. Key Design Rule

**Always follow:**  
Test → Fixture → Page/Component → API/Utils
**Do NOT:**  
Test → Locator (❌)
