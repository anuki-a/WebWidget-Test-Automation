import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { TestDataBuilder } from '../../src/utils/testDataBuilder';
import { DateUtils } from '../../src/utils/dateUtils';
import { MeetingPreference } from '../../src/pages/MeetingPreferencePage';
import { expect } from '@playwright/test';
import { AdminService } from '@/api/AdminService';
import { ApiClient } from '@/api/apiClient';

/**
 * OAC-20015: Verify Past Dates Cannot Be Selected
 * 
 * Test Case: Ensure widget disallows selecting past calendar dates for appointments.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through pastDateBookingData fixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service category and specific service
 * 3. Search and select location
 * 4. Select meeting preference
 * 5. Navigate to Date and Time page
 * 6. Attempt to select past date - should be disabled
 * 7. Verify cannot proceed with past date selection
 * 8. Select current/future date and continue successfully
 * 
 * Expected Results:
 * - Past dates are disabled/unselectable in calendar
 * - Cannot proceed to next step with past date
 * - Current/future dates work normally
 */

test.describe('Past Date Selection Validation - OAC-20015', () => {

  let adminService: AdminService;
    
  test.beforeEach(async ({ request }) => {
    adminService = new AdminService(new ApiClient(request));
  });

  test('Verify past dates cannot be selected for appointments', { tag: ['@functional', '@validation', '@date'] }, async ({ page, pastDateBookingData: bookingData }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await page.goto(process.env.BASE_URL!);

    // Wait for page to be fully loaded with retry logic
    await expect(async () => {
      await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 30000 });
    
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    // Step 1: Select active service, expecting navigation to the Location page
    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);
    expect(selectedService).toContain(bookingData.service.displayName);

    // Step 2: Select available location, expecting navigation to the Meeting Preference page
    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    // Step 3: Select meeting preference, expecting navigation to the Date and Time page
    await meetingPreferencePage.waitForMeetingPreferencePage();
    
    // Check URL contains "meeting-preference"
    expect(page.url()).toContain('meeting-preference');
    
    // Select in-person meeting preference to proceed to date/time selection
    await meetingPreferencePage.selectMeetingPreference(MeetingPreference.IN_PERSON);

    // Step 4: Wait for Date and Time page to load
    await dateTimePage.waitForDateTimePage();
    
    // Verify calendar is displayed
    const calendar = dateTimePage.getCalendar();
    await calendar.waitForCalendar();

    // Step 5: Attempt to select past dates and verify they are disabled
    const yesterday = DateUtils.getFutureDate(-1); // Yesterday
    const lastWeek = DateUtils.getFutureDate(-7); // Last week
    
    // Verify past dates are disabled in current month view
    const isYesterdayDisabled = await dateTimePage.isDateDisabled(yesterday);
    const isLastWeekDisabled = await dateTimePage.isDateDisabled(lastWeek);
    
    // Verify past dates are disabled (not enabled for interaction)
    expect(isYesterdayDisabled).toBe(true);
    expect(isLastWeekDisabled).toBe(true);

    // Step 6: Attempt to proceed without selecting a valid date
    // Try to click continue button (should be disabled or not proceed)
    const continueButton = page.getByRole('button', { name: 'Continue' })
      .or(page.getByRole('button', { name: 'Next' }))
      .or(page.getByRole('button', { name: 'Select Time' }));

    // Verify continue button is disabled when no valid date/time selected
    if (await continueButton.isVisible()) {
      const isDisabled = await continueButton.isDisabled();
      expect(isDisabled).toBe(true);
    }

    // Step 7: Select current/future date and continue normally
    const today = DateUtils.getToday();
    const isTodayAvailable = await calendar.isDateDisabled(today);
    
    // If today is not available, select next available date
    let selectedDate = today;
    if (isTodayAvailable) {
      const nextAvailableDate = await calendar.selectFirstAvailableDate(7);
      expect(nextAvailableDate).not.toBeNull();
      selectedDate = nextAvailableDate!;
    } else {
      await calendar.selectDate(today);
    }

    // Verify the date is selectable (not disabled)
    const isSelectedDateDisabled = await calendar.isDateDisabled(selectedDate);
    expect(isSelectedDateDisabled).toBe(false);

    // Select first available time slot
    const timeSlot = dateTimePage.getTimeSlot();
    const selectedTime = await timeSlot.selectFirstAvailableSlot();
    expect(selectedTime).toBeTruthy();

    // Step 8: Proceed with valid date/time selection
    await dateTimePage.submit();

    // Verify navigation to Personal Details page
    await personalDetailsPage.waitForPersonalDetailsPage();
  });

  test.afterEach(async ({}, testInfo) => {
  // Only triggers after the "Verify past dates cannot be selected for appointments" test
  if (testInfo.title.includes('Verify past dates cannot be selected for appointments')) {
    console.log('Running Teardown: Enabling Appointment Checklist...');
    
    try {
      // Using the dynamic method to flip only the Checklist setting
      const response = await adminService.updateConfigSetting({ 
        ShowCheckListInWidget: true 
      });
      
      // Log warning if the reset failed without failing the test itself
      if (response.status() !== 200) {
        console.error('Teardown Warning: Failed to reset ShowCheckListInWidget to true.');
      }
    } catch (error) {
      console.error('Teardown Error:', error);
    }
  }
});
});
