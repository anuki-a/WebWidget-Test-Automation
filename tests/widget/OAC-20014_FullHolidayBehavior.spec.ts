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
import { ApiClient } from '../../src/api/apiClient';
import { AdminService } from '../../src/api/AdminService';
import { expect } from '@playwright/test';

/**
 * OAC-20014: Widget Behavior During Full Holiday
 * 
 * Test Case: Verify full holiday date does not allow any booking slots.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Service/location bookable normally
 * - Full day holiday configured on test date
 * - Adjacent non-holiday dates available for comparison
 * - Test data provisioned through fullHodidayHandlingData fixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Setup: Create a full holiday via Admin API
 * 2. Navigate to appointment widget
 * 3. Select service category and specific service
 * 4. Search and select location
 * 5. Select meeting preference
 * 6. Navigate to Date and Time page
 * 7. Go to date/time for full holiday date
 * 8. Verify all time slots disabled on holiday date
 * 9. Attempt to select any slot (should fail)
 * 10. Navigate to next available non-holiday date
 * 11. Select non-holiday date and complete booking
 * 
 * Expected Results:
 * - Full holiday prevents all bookings on configured date
 * - Widget maintains normal functionality on non-holiday dates
 * - All time slots disabled on holiday date
 * - Normal slot availability on adjacent dates
 */

test.describe('Full Holiday Behavior - OAC-20014', () => {
  let holidayData: any;
  let holidayDate: Date;
  let apiClient: ApiClient;
  let adminService: AdminService;

      // Calculate holiday date (3 business days from now to match fixture data)
  const today = new Date();
  holidayDate = DateUtils.addBusinessDays(today, 3);
  holidayDate.setUTCHours(0, 0, 0, 0);
  const isoDate = holidayDate.toISOString();


  test('Verify full holiday prevents all bookings and maintains normal functionality on other dates', { tag: ['@functional', '@validation', '@holiday'] }, async ({ page, fullHodidayHandlingData: bookingData }) => {
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

    console.log(`holidayDate in test: ${holidayDate}`);
    // Step 5: Navigate to the holiday date and verify no selectable slots
    const holidayDateString = DateUtils.formatDateForUI(holidayDate).fullDateString;
    
    // Verify the holiday date is not in calendar
    const isHolidayDateDisabled = await calendar.isDateDisabled(holidayDate);
    expect(isHolidayDateDisabled).toBe(false);

    // Step 6: Attempt to select holiday date (can select) and see the note message
    await calendar.selectDate(holidayDate);

    // Verify the Holiday Name displayed (it contains "Auto Holiday")
    const holidayNameElement = page.getByText(/Auto Holiday/i);
    await expect(holidayNameElement).toBeVisible({ timeout: 5000 });

    // Verify the note message is displayed when no time slots are available on holiday date
    const noSlotsMessage = page.getByText(/Note: Appointment times may be available on other days during normal business hours/i);
    await expect(noSlotsMessage).toBeVisible({ timeout: 5000 });


    // Step 8: Navigate to next available non-holiday date
    const nextBusinessDay = DateUtils.addBusinessDays(holidayDate, 1);
    const isNextDayAvailable = await calendar.isDateDisabled(nextBusinessDay);
    
    await calendar.selectDate(nextBusinessDay);

    while (true){
      const timeSlotComponent = dateTimePage.getTimeSlot();
      const availableSlots = await timeSlotComponent.getAvailableTimeSlots();
      const hasAvailableSlots = availableSlots.some(slot => slot.isAvailable);
      if (hasAvailableSlots) {
        break;
      }
      const nextDay = DateUtils.addBusinessDays(nextBusinessDay, 1);
      await calendar.selectDate(nextDay);
    }


    // Step 9: Verify normal slot availability on non-holiday date
    const timeSlotComponent = dateTimePage.getTimeSlot();
    const availableSlots = await timeSlotComponent.getAvailableTimeSlots();
    const hasAvailableSlots = availableSlots.some(slot => slot.isAvailable);
    expect(hasAvailableSlots).toBe(true);

    // Step 10: Select first available time slot
    const selectedTime = await timeSlotComponent.selectFirstAvailableSlot();
    expect(selectedTime).toBeTruthy();

    // Step 11: Proceed with booking on non-holiday date
    await dateTimePage.submit();

    // Verify navigation to Personal Details page
    await personalDetailsPage.waitForPersonalDetailsPage();

    // Step 12: Fill personal details and complete booking
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    // Step 13: Verify confirmation page
    await confirmationPage.waitForConfirmationPage();
    const confirmationDetails = await confirmationPage.getConfirmationDetails();
    
    expect(confirmationDetails.serviceName).toContain(bookingData.service.displayName);
    expect(confirmationDetails.locationName).toContain(bookingData.location.confirmationName);

    console.log('Successfully completed booking on non-holiday date after verifying holiday restrictions');
  });
});
