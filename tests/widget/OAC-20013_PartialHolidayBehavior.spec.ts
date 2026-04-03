import { TimeSlot } from '../../src/components/TimeSlotComponent';
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
 * OAC-20013: Widget Behavior During Partial Holiday
 * 
 * Test Case: Verify partial holiday date blocks only specific slot ranges while allowing non-holiday slots.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Service/location bookable normally
 * - Partial holiday configured: 10:00-12:00 on test date
 * - Normal availability outside holiday hours confirmed
 * - Holiday setup verified via AC Portal
 * - Admin Portal access available
 * - Valid personal details available
 * - Test data provisioned through partialHolidayHandlingData fixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service category and specific service
 * 3. Search and select location
 * 4. Select meeting preference
 * 5. Navigate to Date and Time page
 * 6. Go to date/time for partial holiday date
 * 7. Verify slots before 01:00 PM available (early morning slots selectable)
 * 8. Verify slots 01:00 PM - 03:00 AM disabled (holiday time range blocked)
 * 9. Verify slots after 03:00 AM available (afternoon slots selectable)
 * 10. Verify holiday-blocked slots by clicking on them (blocked slots unavailable)
 * 11. Verify allowed slots (allowed slots available)
 * 12. Select available slot and proceed (can complete booking)
 * 13. Verify confirmation (shows selected non-holiday slot)
 * 
 * Expected Results:
 * - Partial holiday blocks only configured time range
 * - Widget allows booking outside holiday hours
 * - Early morning slots (before 01:00 PM) are available
 * - Holiday time slots (01:00 PM - 03:00 AM) are disabled
 * - Afternoon slots (after 03:00 AM) are available
 * - Booking can be completed for non-holiday slots
 */

test.describe('Partial Holiday Behavior - OAC-20013', () => {


  test('Verify partial holiday blocks specific time ranges while allowing booking outside holiday hours', { tag: ['@functional', '@validation', '@holiday'] }, async ({ page, partialHolidayHandlingData: bookingData }) => {
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

    console.log(`Partial holiday date in test: ${bookingData.partialHolidayDateTime.date}`);
    console.log(`Holiday time range: ${bookingData.partialHolidayDateTime.startTime} - ${bookingData.partialHolidayDateTime.endTime}`);
    
    // Step 5: Navigate to the partial holiday date
    const holidayDateString = bookingData.partialHolidayDateTime.formattedDate;
    
    // Select the partial holiday date
    await calendar.selectDate(bookingData.partialHolidayDateTime.date);

    // Step 6: Get all available time slots and analyze them
    const timeSlotComponent = dateTimePage.getTimeSlot();
    const allSlots = await timeSlotComponent.getAvailableTimeSlots();
    
    // Parse holiday time range for comparison
    const holidayStartTime = bookingData.partialHolidayDateTime.startTime; // "01:00 PM"
    const holidayEndTime = bookingData.partialHolidayDateTime.endTime; // "03:00 AM" (next day)
    
    // Convert times to comparable format (24-hour)
    const convertTo24Hour = (timeStr: string): number => {
      const parts = timeStr.split(' ');
      if (parts.length < 2) return 0;
      const time = parts[0] as string;
      const period = parts[1] as string;
      if (!time || !period) return 0;
      const timeParts = time.split(':');
      if (timeParts.length < 2) return 0;
      const hours = parseInt(timeParts[0] as string);
      const minutes = parseInt(timeParts[1] as string);
      if (period === 'PM' && hours !== 12) return hours + 12;
      if (period === 'AM' && hours === 12) return 0;
      return hours || 0;
    };
    
    const holidayStartHour = convertTo24Hour(holidayStartTime);
    const holidayEndHour = convertTo24Hour(holidayEndTime);
    
    console.log(`Holiday blocked hours: ${holidayStartHour}:00 - ${holidayEndHour}:00`);

    // Step 7: Verify slots before 01:00 PM are available (early morning slots)
    const earlyMorningSlots = allSlots.filter((slot: TimeSlot) => {
      const slotHour = convertTo24Hour(slot.time);
      return slotHour < holidayStartHour && slot.isAvailable;
    });
    
    console.log(`Found ${earlyMorningSlots.length} available early morning slots before ${holidayStartTime}`);
    expect(earlyMorningSlots.length).toBeGreaterThan(0);

    // Step 8: Verify slots during holiday time (01:00 PM - 03:00 AM) are disabled
    const holidaySlots = allSlots.filter((slot: TimeSlot) => {
      const slotHour = convertTo24Hour(slot.time);
      // Handle overnight case (e.g., 01:00 PM to 03:00 AM next day)
      if (holidayStartHour > holidayEndHour) {
        // Holiday spans midnight
        return slotHour >= holidayStartHour || slotHour < holidayEndHour;
      } else {
        // Holiday within same day
        return slotHour >= holidayStartHour && slotHour < holidayEndHour;
      }
    });
    
    const disabledHolidaySlots = holidaySlots.filter((slot: TimeSlot) => !slot.isAvailable);
    console.log(`Found ${disabledHolidaySlots.length} disabled slots during holiday time range`);
    console.log(`Holiday slots: ${holidaySlots.map((s: TimeSlot) => s.time).join(', ')}`);
    
    // At least some slots during holiday time should be disabled
    expect(disabledHolidaySlots.length).toBeGreaterThan(0);

    // Main Logic Check : check HolidaySlots are disabled
    // Loop through each holiday slot and verify it's disabled
    console.log('Verifying each holiday slot is disabled...');
    for (const holidaySlot of holidaySlots) {
      if (holidaySlot.element) {
        const isDisabled = await timeSlotComponent.isTimeSlotDisabled(holidaySlot.element);
        console.log(`Holiday slot ${holidaySlot.time} is disabled: ${isDisabled}`);
        expect(isDisabled).toBe(true);
      } else {
        console.log(`Warning: Holiday slot ${holidaySlot.time} has no element reference`);
      }
    }

    // Step 9: Verify slots after 03:00 AM are available (afternoon slots)
    const afternoonSlots = allSlots.filter((slot: TimeSlot) => {
      const slotHour = convertTo24Hour(slot.time);
      // For overnight holiday, after 03:00 AM means after the end time
      if (holidayStartHour > holidayEndHour) {
        return slotHour >= holidayEndHour && slotHour < holidayStartHour && slot.isAvailable;
      } else {
        return slotHour >= holidayEndHour && slot.isAvailable;
      }
    });
    
    console.log(`Found ${afternoonSlots.length} available afternoon slots after ${holidayEndTime}`);
    expect(afternoonSlots.length).toBeGreaterThan(0);

    // Wait a moment for UI to stabilize before selecting available slot
    await page.waitForTimeout(500);
    console.log("before to select selectFirstAvailableSlot");

    const selectedTime = await timeSlotComponent.selectFirstAvailableSlot();
    console.log("after to select selectFirstAvailableSlot");
    expect(selectedTime).toBeTruthy();

      // Step 11: Proceed with booking on non-holiday date
    await dateTimePage.submit();

    console.log("submit after to select selectFirstAvailableSlot");
    // Verify navigation to Personal Details page
    await personalDetailsPage.waitForPersonalDetailsPage();

    // Step 13: Fill personal details and complete booking
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    // Step 14: Verify confirmation page shows selected non-holiday slot
    await confirmationPage.waitForConfirmationPage();
    const confirmationDetails = await confirmationPage.getConfirmationDetails();
    
    expect(confirmationDetails.serviceName).toContain(bookingData.service.displayName);
    expect(confirmationDetails.locationName).toContain(bookingData.location.confirmationName);
    
    // Verify the confirmed time is not during the holiday period
    const confirmedDateTime = confirmationDetails.dateTime;
    if (confirmedDateTime) {
      // Extract time from the date-time string
      const timeMatch = confirmedDateTime.match(/(\d{1,2}:\d{2}\s*(AM|PM))/i);
      if (timeMatch) {
        const confirmedTimeHour = convertTo24Hour(timeMatch[1]!);
        const isConfirmedTimeDuringHoliday = holidayStartHour > holidayEndHour 
          ? (confirmedTimeHour >= holidayStartHour || confirmedTimeHour < holidayEndHour)
          : (confirmedTimeHour >= holidayStartHour && confirmedTimeHour < holidayEndHour);
        
        expect(isConfirmedTimeDuringHoliday).toBe(false);
      }
    }

    console.log(`Successfully completed booking for non-holiday slot: ${confirmationDetails.dateTime || 'undefined'}`);
    console.log('Partial holiday behavior verified - specific time range blocked while allowing bookings outside holiday hours');
  });

  
});
