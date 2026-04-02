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

### 🔹 Step 9: API Validation ✅ COMPLETED

- [x] Fetch appointment via API
- [x] Validate:
  - [x] serviceId
  - [x] locationId
  - [x] customer details

### 🔹 Step 10: Stabilization ✅ COMPLETED

- [x] Fix waits (avoid hard waits)
- [x] Stabilize selectors
- [x] Handle async slot loading

### ✅ Phase 1 Exit Criteria ✅ MET

- [x] OAC-20001 passes end-to-end
- [x] API setup works reliably
- [x] No hardcoded test data
- [x] Reusable components created
- [x] Clean separation: Test → Fixture → Pages → Components → API

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

- [x] OAC-20002 → Edit Appointment ✅ IMPLEMENTED
- [x] OAC-20003 → Non-editable validation ✅ IMPLEMENTED
- [x] OAC-20004 → Cancel Appointment ✅ IMPLEMENTED

#### Multi-booking

- [x] OAC-20005 → Book Another ✅ IMPLEMENTED
- [x] OAC-20006 → Book after cancel ✅ IMPLEMENTED

#### Skip behavior

- [x] OAC-20007 → Skip Yes → redirect ✅ IMPLEMENTED
- [x] OAC-20008 → Skip No → continue ✅ IMPLEMENTED

#### Validation rules

- [ ] OAC-20009 → Email/Phone validation

#### Meeting preference

- [x] OAC-20010 → No MP ✅ IMPLEMENTED
- [ ] OAC-20011 → Multi MP
- [ ] OAC-20012 → MP-based validation

#### Calendar & availability

- [ ] OAC-20013 → Partial holiday
- [ ] OAC-20014 → Full holiday
- [ ] OAC-20015 → Past date restriction
- [ ] OAC-20016 → Timeslot availability

#### Localization & UI behavior

- [x] OAC-20017 → Spanish localization ✅ IMPLEMENTED
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

### Phase 1 Progress: ✅ 10/10 tasks completed

### Phase 2 Progress: 🔄 6/20 tasks completed

### Overall Progress: 🔄 15/30 tasks completed

**Current Focus:** Phase 2 - Functional Coverage Expansion

---

## 📝 Discovered During Work

### OAC-20010 Single Meeting Preference Skip Implementation - March 30, 2026

✅ **Single Meeting Preference Skip Functionality Complete**

- Implemented comprehensive test for verifying Meeting Preference page is skipped for services without multiple meeting preference options
- Used `singleMeetingPreferenceBookingData` fixture which provides:
  - Service: "Notary  30 Mins Notary" (configured without Meeting Preference choices)
  - Location: "Northcliffe 22015 N IH 35" with code "78154"
  - Virtual meeting preference (default for single preference service)
  - Customer data and date/time for next business day at 10:00 AM
- Test covers complete flow from service selection to confirmation:
  - Step 1: Navigate to widget and select service without meeting preference options ✓
  - Step 2: Search and select location ✓
  - Step 3: Verify Meeting Preference page is skipped using `isMeetingPreferenceSkipped()` method ✓
  - Step 4: Confirm direct navigation to date/time page ✓
  - Step 5: Select date and time from fixture data ✓
  - Step 6: Fill personal details and submit booking ✓
  - Step 7: Verify confirmation page with appointment details ✓
  - Step 8: Validate no Meeting Preference selection step appeared in flow ✓
- Key validation points:
  - `isMeetingPreferenceSkipped()` returns true (calendar visible, preferences not visible) ✓
  - Direct transition from location selection to date/time selection ✓
  - "Select a Meeting Preference" title never appears ✓
  - Appointment created with virtual meeting preference (default) ✓
  - All confirmation details displayed correctly ✓
- Follows project architecture: Test → Fixture → Page → Component → UI
- Uses existing page objects and methods with proper TypeScript typing
- All assertions handle optional properties safely with null checks

### OAC-20008 Skip Appointment Continue Booking Implementation - March 27, 2026

✅ **Skip Appointment Continue Booking Functionality Complete**

- Implemented comprehensive test for skip appointment continue booking flow using existing ServicePage locators and components
- Used `skipEnabledBookingData` fixture to create booking data with skip-enabled service ("Update Personal Account")
- Enhanced ServicePage with `clickSkipWaitNoButton()` method for clicking "No, continue with scheduling an appointment" button
- Test follows complete standard booking flow after declining skip appointment:
  - Step 1: Select service with appointment skip enabled ✓
  - Step 2: Verify skip popup message displays correctly ✓
  - Step 3: Choose 'No' on the skip popup ✓
  - Step 4: Verify standard booking flow continues ✓
  - Step 5: Continue booking - Location selection ✓
  - Step 6: Continue booking - Meeting preference ✓
  - Step 7: Continue booking - Date and time selection ✓
  - Step 8: Continue booking - Personal details ✓
  - Step 9: Complete booking - Wait for confirmation ✓
  - Step 10: Verify confirmation ✓
- Reuses all existing page objects and methods from OAC-20001 happy path booking:
  - LocationPage: `searchAndSelectLocation()` and `waitForLocationPage()`
  - MeetingPreferencePage: `selectInPerson()`
  - DateTimePage: `selectDayAndFirstAvailableTime()`
  - PersonalDetailsPage: `fillDetails()` and `submit()`
  - ConfirmationPage: `waitForConfirmationPage()`, `verifyBooking()`, and `isCancelButtonVisible()`
- Validates expected results:
  - Skip popup displays configured message ✓
  - No option continues standard booking flow ✓
  - Booking completes successfully after declining skip ✓
  - Cancel button available on confirmation page ✓
- TypeScript compilation passes without errors
- Test follows project conventions with proper JSDoc documentation and page object usage

### OAC-20007 Skip Appointment Redirect Implementation - March 27, 2026

✅ **Skip Appointment Redirect Functionality Complete**

- Implemented comprehensive test for skip appointment popup redirect using MCP tools for locator discovery
- Used `skipEnabledBookingData` fixture to create booking data with skip-enabled service ("Update Personal Account")
- Enhanced ServicePage with new skip popup handling methods:
  - `getSkipAppointmentDialog()` - Get dialog element if visible
  - `verifySkipPopup(serviceName)` - Verify popup message and buttons are displayed correctly
  - `clickSkipWaitYesButton()` - Click "Yes, Skip the wait" button
- Used MCP Playwright tools to navigate live application and capture actual skip popup locators:
  - Navigated to widget URL and loaded service selection page
  - Selected "Personal Accounts" category and "Update Personal Account" service
  - Captured skip popup dialog elements:
    - Dialog title: "Update Personal Account"
    - Message: "Good news! You can apply online right now, skipping the wait, in just a few minutes."
    - Buttons: "No, continue with scheduling an appointment" and "Yes, Skip the wait"
- Test covers all UI steps from test case specification:
  - Step 1: Select service with appointment skip enabled ✓
  - Step 2: Verify skip popup message displays correctly ✓
  - Step 3: Choose Yes on skip popup ✓
  - Step 4: Verify redirect URL matches configuration ✓
  - Step 5: Verify widget flow terminated ✓
- Validates expected results:
  - Skip popup displays configured message ✓
  - Yes option redirects to correct external URL ✓
  - Widget booking flow terminates after redirect ✓
- Includes comprehensive redirect verification:
  - Waits for navigation away from widget domain
  - Verifies URL no longer contains widget domain
  - Tests back navigation to ensure flow termination
  - Confirms fresh widget session starts over
- TypeScript compilation passes without errors
- Test follows project conventions with proper JSDoc documentation and page object usage

### OAC-20003 Non-Editable Appointment Validation Implementation - March 27, 2026

✅ **Non-Editable Appointment Functionality Complete**

- Implemented comprehensive test for non-editable appointment validation using MCP tools for locator discovery
- Used `notAllowedEditCancelData` fixture to create appointment with non-editable characteristics
- Enhanced ConfirmationPage with new locators and methods:
  - `nonEditableMessage` - Locator for "This appointment cannot be changed or cancelled" message
  - `disabledCancelButton` - Locator for disabled cancel button
  - `verifyNonEditableState()` - Comprehensive verification of non-editable state
  - `verifyNoEditControlsVisible()` - Confirms no edit links are visible
  - `verifyCancelButtonDisabled()` - Verifies cancel button is disabled
  - `verifyNonEditableMessageDisplayed()` - Checks for non-editable message
  - `verifyEditControlsNotInteractive()` - Attempts interactions (should fail)
- Used MCP Playwright tools to navigate live application and capture actual locators:
  - Navigated through complete booking flow: Service → Location → Meeting Preference → Date/Time → Personal Details
  - Captured confirmation page elements for non-editable scenario
  - Identified key differences from normal confirmation page:
    - No edit links visible (Edit Date/Time, Edit Location, Edit Service, etc.)
    - Cancel button present but disabled
    - "This appointment cannot be changed or cancelled" message displayed
- Test covers all UI steps from test case specification:
  - Step 1: Appointment Confirmation Page displayed ✓
  - Step 2: Check edit controls/buttons not visible ✓
  - Step 3: Check Cancel button disabled ✓
  - Step 4: Check non-editable message displayed ✓
  - Step 5: Attempt to interact with controls (should fail) ✓
- Validates expected results:
  - No editable buttons visible ✓
  - No cancellation button clickable ✓
  - Non-editable flow enforced ✓
- Test passes successfully (34.8s execution time) with comprehensive assertions

### OAC-20006 Book Another From Cancellation Page Implementation - March 26, 2026

✅ **Cancellation + Book Another Functionality Complete**

- Enhanced OAC-20006 test to include complete cancellation flow before Book Another functionality
- Updated test case to match specification from `testcases_refined.json`:
  - Step 1: Create first appointment and capture details
  - Step 2: Verify cancel button availability
  - Step 3: Click Cancel and confirm cancellation
  - Step 4: Verify cancellation messages and Book Another shown
  - Step 5: Click Book Another to start new booking
  - Steps 6-13: Complete Book Another flow with personal details retention
- Utilized existing ConfirmationPage methods:
  - `testCancelAppointment()` - Complete cancellation flow with confirmation
  - `waitForCancellationConfirmation()` - Wait for cancellation confirmation message
  - `verifyAppointmentCancelled()` - Verify appointment is marked as cancelled
- Added comprehensive verification for personal details consistency across both appointments
- Ensured Book Another button appears after successful cancellation
- Validated that customer data persists correctly through cancellation and rebooking process
- Test now covers the complete user journey: booking → cancellation → rebooking with data retention

### OAC-20005 Book Another Implementation - March 26, 2026

✅ **Book Another Functionality Complete**

- Implemented comprehensive test for Book Another flow after successful booking
- Added `clickBookAnother()` method to ConfirmationPage for navigation
- Created complete test scenario covering:
  - First appointment booking with standard flow
  - Book Another button functionality and navigation
  - Second booking with different service (Estate Accounts), date (tomorrow), and time (2:00 PM)
  - Personal details persistence verification across bookings
  - Confirmation details validation for both appointments
- Utilizes existing PersonalDetailsPage methods (`getFirstName()`, `getLastName()`, `getEmail()`, `getPhone()`) for pre-filled data verification
- Ensures customer data consistency while allowing service/date/time changes
- Validates Book Another button availability after second booking

### OAC-20002 Edit Appointment Implementation - March 26, 2026

✅ **Edit Functionality Complete**

- Created comprehensive test for editing existing appointments from widget
- Added edit functionality to ConfirmationPage:
  - `clickEditDateTime()` - Navigate to edit date/time
  - `clickEditPersonalDetails()` - Navigate to edit customer info
  - `areEditLinksVisible()` - Verify edit controls are available
- Enhanced DateTimePage with `submit()` method for edit flow
- Implemented two test scenarios:
  - **Happy Path Edit**: Complete edit flow with date/time and personal details changes

### Phase 1 Completion - March 25, 2026

✅ **Framework Foundation Complete**

- All core components implemented and functional
- API layer fully operational with authentication
- Page Object Model structure established
- Reusable components (Calendar, TimeSlot) working
- Test data generation via fixtures operational
- Two end-to-end tests passing:
  - OAC-20001: Book Appointment (full flow)
  - OAC-20004: Cancel Appointment (full flow)
- Build system and TypeScript configuration stable

🔧 **Technical Achievements**

- Hybrid API + UI approach working seamlessly
- Dynamic test data generation (no hardcoded values)
- Proper separation of concerns maintained
- Framework ready for additional test case implementation

📁 **Current Project Structure**

- 16 TypeScript source files implemented
- 5 test files created (2 functional, 1 verification, 1 API health check)
- Complete fixture system with booking data generation
- All planned pages and components are functional

---

## 🛠 Infrastructure Setup

### MCP Server Integration - March 25, 2026

✅ **Playwright MCP Server Installed**

- Installed `@executeautomation/playwright-mcp-server` globally
- Created `.windsurf/windsurf.config.json` with Playwright MCP configuration
- MCP server provides browser automation capabilities via Model Context Protocol
- Configuration includes:
  - Command: `npx @executeautomation/playwright-mcp-server`
  - Environment: `PLAYWRIGHT_BROWSER=chromium`
- Ready for AI-assisted browser automation and testing workflows

### OAC-20017 Spanish Language Translations Implementation - April 2, 2026

✅ **Spanish Localization Functionality Complete**

- Implemented comprehensive test for verifying Spanish language translations load properly across widget pages
- Created new `LanguageSwitcher.ts` component with complete language switching functionality:
  - `switchToSpanish()` - Change language to Spanish from dropdown
  - `switchToEnglish()` - Change language back to English
  - `verifySpanishNavigationLabels()` - Verify all 6 Spanish navigation labels
  - `verifyEnglishNavigationLabels()` - Verify all 6 English navigation labels
  - `verifySpanishPageHeading()` - Verify "Elige un servicio" heading
  - `verifyEnglishPageHeading()` - Verify "Select a Service" heading
  - `verifySpanishFooter()` - Verify "Desarrollado por FMSI" footer
  - `verifyEnglishFooter()` - Verify "Powered by FMSI" footer
  - `getSpanishNavigationLabels()` - Get all Spanish label texts
  - `getEnglishNavigationLabels()` - Get all English label texts
  - `verifyCompleteSpanishUI()` - Comprehensive Spanish UI verification
  - `verifyCompleteEnglishUI()` - Comprehensive English UI verification
- Used MCP Playwright tools to discover actual locators by navigating live widget:
  - Language selector: `select[aria-label="Select Language"]`
  - Spanish navigation labels: "Servicio", "Sitio", "Preferencia de reunión", "Fecha y hora", "Detalles personales", "Confirmación"
  - Spanish page heading: "Elige un servicio"
  - Spanish footer: "Desarrollado por FMSI"
- Created comprehensive test suite `OAC-20017_SpanishTranslations.spec.ts` with three test scenarios:
  - **Main Test**: Complete end-to-end Spanish translation verification following test case steps
  - **Individual Labels Test**: Detailed verification of each Spanish navigation label
  - **Language Selector Test**: Language switching functionality validation
- Test covers all UI steps from test case specification:
  - Step 1: Open widget default language (English) ✓
  - Step 2: Change language to Spanish from top bar dropdown ✓
  - Step 3: Check navigation bar for Spanish text on the 6 labels ✓
- Validates expected results:
  - Spanish translation works end-to-end ✓
  - All 6 navigation labels translated correctly ✓
  - Page heading and footer translated properly ✓
  - Language selector functionality works correctly ✓
  - Language switching back to English works ✓
- Follows project architecture: Test → Component → UI
- Uses proper TypeScript typing and JSDoc documentation
- Test includes comprehensive assertions and console logging for debugging
- All locators verified against live widget application using MCP tools
