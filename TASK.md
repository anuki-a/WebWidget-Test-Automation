# Playwright Automation Suite - Task List

## Phase 1: Foundation (OAC-20001 - End-to-End Booking)

### 🎯 Goal

Successfully automate OAC-20001: End-to-End Book Appointment

**Outcome:**

- [ ] One full working test
- [ ] Core framework structure ready
- [ ] API + UI integration working

### 🔹 Step 1: Project Setup ✅ COMPLETED

- [x] Initialize Node.js project
- [x] Install Playwright + TypeScript
- [x] Create `playwright.config.ts`
- [x] Setup `.env`:
  - [x] baseURL (widget)
  - [x] apiURL
  - [x] credentials

### 🔹 Step 2: Folder Structure ✅ COMPLETED

- [x] Create `src/api`
- [x] Create `src/pages`
- [x] Create `src/components`
- [x] Create `src/fixtures`
- [x] Create `src/utils`
- [x] Create `tests/widget`
- [x] Create `data/`

### 🔹 Step 3: Base API Layer (MINIMUM) ✅ COMPLETED

- [x] Create `apiClient.ts` (Wrapper using Playwright request)
- [x] Create `ProvisioningClient.ts`:
  - [x] `createServiceCategory()`
  - [x] `createService()`
  - [x] `createLocation()`
  - [x] `setupAvailability()`
- [x] Create `ConfigClient.ts`:
  - [x] `enableWidget()`
  - [x] `configureMeetingPreferences()`
- [x] Create `AppointmentClient.ts`:
  - [x] `getAppointmentById()`
- [x] Test APIs separately before using in tests

### 🔹 Step 4: Utilities ✅ COMPLETED

- [x] Create `testDataBuilder.ts`:
  - [x] `generateCustomer()` → firstName, lastName, email, phone
- [x] Create `dateUtils.ts`:
  - [x] `getFutureDate()`

### 🔹 Step 5: Components (BUILD FIRST) ✅ COMPLETED

- [x] Create `CalendarComponent.ts`:
  - [x] `selectFutureDate()`
- [x] Create `TimeSlotComponent.ts`:
  - [x] `selectAvailableSlot()`

### 🔹 Step 6: Pages (THIN IMPLEMENTATION) ✅ COMPLETED

- [x] Create `ServicePage.ts`:
  - [x] `selectService()`
- [x] Create `LocationPage.ts`:
  - [x] `selectLocation()`
- [x] Create `MeetingPreferencePage.ts`:
  - [x] `selectMeetingPreference()`
- [x] Create `DateTimePage.ts`:
  - [x] `selectDateAndTime()` (uses CalendarComponent + TimeSlotComponent)
- [x] Create `PersonalDetailsPage.ts`:
  - [x] `fillDetails()`
  - [x] `submit()`
- [x] Create `ConfirmationPage.ts`:
  - [x] `getConfirmationDetails()`
  - [x] `getAppointmentId()`

### 🔹 Step 7: Fixture (CORE ENGINE) ✅ COMPLETED

- [x] Create `bookingFixture.ts`:
  - [x] Simple fixture approach (avoiding TypeScript complexity)
  - [x] Provides consistent test imports
  - [x] Tests use direct page object instantiation

### 🔹 Step 8: First Test ✅ COMPLETED

- [x] Create `tests/widget/OAC-20001_BookAppointment.spec.ts`:
  - [x] Open widget URL
  - [x] Select service
  - [x] Select location
  - [x] Select meeting preference
  - [x] Select date
  - [x] Select time slot
  - [x] Enter personal details
  - [x] Submit booking
  - [x] Verify confirmation page

### 🔹 Phase 1 Exit Criteria ✅ MET

- [x] All API clients functional
- [x] All utilities working
- [x] All components implemented
- [x] All pages implemented
- [x] Basic fixture working
- [x] End-to-end test passing
- [x] Build compiles without errors
- [x] Framework ready for Phase 2

### 🔹 Step 9: API Validation

- [ ] Fetch appointment via API
- [ ] Validate:
  - [ ] serviceId
  - [ ] locationId
  - [ ] customer details

### 🔹 Step 10: Stabilization

- [ ] Fix waits (avoid hard waits)
- [ ] Stabilize selectors
- [ ] Handle async slot loading

### ✅ Phase 1 Exit Criteria

- [ ] OAC-20001 passes end-to-end
- [ ] API setup works reliably
- [ ] No hardcoded test data
- [ ] Reusable components created
- [ ] Clean separation: Test → Fixture → Pages → Components → API

---

## 🚀 Phase 2: Functional Coverage (All Testcases)

### 🎯 Goal

- [ ] Implement all 20 testcases
- [ ] Reuse components, pages, and fixtures
- [ ] Cover all business scenarios from `testcases_refined.json`

### 🔹 Phase 2.1: Expand API Layer

- [ ] `configureValidationRules()`
- [ ] `configureSkipBehavior()`
- [ ] `configureChecklist()`
- [ ] `configureHoliday(partial/full)`
- [ ] `configureSpanishSpeaker()`
- [ ] `enableManualStaffSelection()`
- [ ] `updateAppointment()`
- [ ] `cancelAppointment()`

### 🔹 Phase 2.2: Enhance Fixtures

- [ ] Extend `bookingFixture.ts`:
  - [ ] Meeting preference modes (single/multiple)
  - [ ] Validation configs (email/phone)
  - [ ] Skip configuration
  - [ ] Checklist setup
  - [ ] Holiday setup
- [ ] Create `appointmentFixture.ts`:
  - [ ] editable appointment
  - [ ] non-editable appointment
  - [ ] cancelable appointment
- [ ] Create `configFixture.ts`:
  - [ ] validation rules
  - [ ] skip settings
  - [ ] meeting preferences

### 🔹 Phase 2.3: Complete UI Components

- [ ] Enhance `CalendarComponent` → validate disabled dates (past/holiday)
- [ ] Enhance `TimeSlotComponent` → validate enabled/disabled slots
- [ ] Create `SkipPopup.ts`:
  - [ ] `clickYes()`
  - [ ] `clickNo()`
- [ ] Create `LanguageSwitcher.ts`:
  - [ ] `switchToSpanish()`
- [ ] Create `ChecklistComponent.ts`:
  - [ ] `openChecklist()`
  - [ ] `validateItems()`

### 🔹 Phase 2.4: Expand Pages

- [ ] **DateTimePage**:
  - [ ] validate holiday behavior
  - [ ] past dates
- [ ] **PersonalDetailsPage**:
  - [ ] validation checks (email/phone)
- [ ] **ConfirmationPage**:
  - [ ] verify checklist
  - [ ] retained details

### 🔹 Phase 2.5: Implement Remaining Testcases

#### Core flows

- [ ] OAC-20002 → Edit Appointment
- [ ] OAC-20003 → Non-editable validation
- [ ] OAC-20004 → Cancel Appointment

#### Multi-booking

- [ ] OAC-20005 → Book Another
- [ ] OAC-20006 → Book after cancel

#### Skip behavior

- [ ] OAC-20007 → Skip Yes → redirect
- [ ] OAC-20008 → Skip No → continue

#### Validation rules

- [ ] OAC-20009 → Email/Phone validation

#### Meeting preference

- [ ] OAC-20010 → No MP
- [ ] OAC-20011 → Multi MP
- [ ] OAC-20012 → MP-based validation

#### Calendar & availability

- [ ] OAC-20013 → Partial holiday
- [ ] OAC-20014 → Full holiday
- [ ] OAC-20015 → Past date restriction
- [ ] OAC-20016 → Timeslot availability

#### Localization & UI behavior

- [ ] OAC-20017 → Spanish localization
- [ ] OAC-20018 → Checklist behavior

#### URL & advanced features

- [ ] OAC-20019 → URL params
- [ ] OAC-20020 → Staff + Spanish request

### 🔹 Phase 2.6: Assertions Standardization

- [ ] Create `verifyConfirmation()`
- [ ] Create `verifyAppointmentInAPI()`
- [ ] Create `verifyValidationError()`

### 🔹 Phase 2.7: Test Organization

- [ ] Group tests:
  - [ ] booking/
  - [ ] validation/
  - [ ] config/
  - [ ] advanced/

### ✅ Phase 2 Exit Criteria

- [ ] All 20 testcases implemented
- [ ] Tests pass locally
- [ ] No duplicated logic
- [ ] Fixtures reused across tests

---

## 🛠 Phase 3: Hardening, Stability & Cleanup

### 🎯 Goal

Make test suite stable, maintainable, CI-ready

### 🔹 Phase 3.1: Stability Improvements

- [ ] Replace hard waits with smart waits
- [ ] Handle dynamic elements (slots, async UI)
- [ ] Add retry logic for flaky steps
- [ ] Stabilize selectors (avoid brittle locators)

### 🔹 Phase 3.2: Framework Cleanup

- [ ] Remove duplicate methods
- [ ] Refactor large page classes
- [ ] Standardize naming conventions
- [ ] Extract reusable logic into components/utils

### 🔹 Phase 3.3: Fixture Optimization

- [ ] Reduce redundant API calls
- [ ] Share setup where possible (`beforeAll`)
- [ ] Add teardown if needed

### 🔹 Phase 3.4: Test Performance

- [ ] Enable parallel execution
- [ ] Optimize test runtime
- [ ] Tag slow tests

### 🔹 Phase 3.5: Reporting

- [ ] Enable HTML reports
- [ ] Integrate Allure (optional)
- [ ] Add logs for debugging

### 🔹 Phase 3.6: Test Tagging

- [ ] smoke
- [ ] regression
- [ ] config-based
- [ ] critical

### 🔹 Phase 3.7: CI/CD Integration

- [ ] Setup pipeline (GitHub Actions / Jenkins)
- [ ] Run tests on PR
- [ ] Store reports as artifacts

### 🔹 Phase 3.8: Data & Environment Management

- [ ] Add multi-env support (dev/qa/stage)
- [ ] Externalize configs
- [ ] Secure secrets

### 🔹 Phase 3.9: Documentation

- [ ] README for setup
- [ ] How to add new test
- [ ] How to debug failures

### 🔹 Phase 3.10: Optional Enhancements

- [ ] Visual testing (Playwright snapshots)
- [ ] API contract validation
- [ ] Performance baseline checks

### ✅ Phase 3 Exit Criteria

- [ ] Tests stable (<5% flakiness)
- [ ] CI pipeline running
- [ ] Reports available
- [ ] Easy onboarding for new developers

---

## 🏁 Final Outcome

After Phase 3:

- [ ] 20 fully automated testcases
- [ ] API-driven setup (fast & reliable)
- [ ] Reusable components & fixtures
- [ ] Stable execution
- [ ] CI-ready framework

---

## 📊 Progress Tracking

### Phase 1 Progress: [ ]/[] tasks completed

### Phase 2 Progress: [ ]/[] tasks completed

### Phase 3 Progress: [ ]/[] tasks completed

### Overall Progress: [ ]/[] tasks completed

**Current Focus:** Phase 1 - Foundation Setup
