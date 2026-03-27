import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';

/**
 * OAC-20008: Select P/S With Appointment Skip Enabled (No Skip Appointment)
 * 
 * Test Case: Verify that clicking "NO" on a skip appointment popup continues standard booking flow.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Skip-enabled booking data provisioned through bookingFixture
 * - Service page with skip appointment functionality
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service with appointment skip enabled
 * 3. Verify skip popup message displays correctly
 * 4. Choose No on skip popup
 * 5. Verify standard booking flow continues
 * 6. Continue booking
 * 7. Complete booking
 * 8. Verify confirmation
 * 
 * Expected Results:
 * - Skip popup displays configured message
 * - No option continues standard booking flow
 * - Booking completes successfully after declining skip
 */
test.describe('Skip Appointment Continue Booking - OAC-20008', () => {
  test('Select service with skip enabled and continue standard booking', { tag: ['@functional', '@smoke'] }, async ({ page, skipEnabledBookingData }) => {
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
    
    // Step 1: Select service with appointment skip enabled
    await servicePage.selectServiceFlow(
      skipEnabledBookingData.service.category,
      skipEnabledBookingData.service.name,
      false, // Don't continue with scheduling to trigger skip popup
      false  // Don't automatically handle skip dialog - we'll handle it manually
    );

    // Step 2: Verify skip popup message displays correctly
    const serviceName = skipEnabledBookingData.service.displayName || skipEnabledBookingData.service.name;
    const isPopupDisplayed = await servicePage.verifySkipPopup(serviceName);
    expect(isPopupDisplayed).toBe(true);

    // Step 3: Choose 'No' on the skip popup
    await servicePage.clickSkipWaitNoButton();

    // Step 4: Verify standard booking flow continues
    // Should be on Location page after declining skip
    await locationPage.waitForLocationPage();

    // Step 5: Continue booking - Location selection
    await locationPage.searchAndSelectLocation(
      skipEnabledBookingData.location.code,
      skipEnabledBookingData.location.name
    );

    // Step 6: Continue booking - Meeting preference
    await meetingPreferencePage.selectInPerson();

    // Step 7: Continue booking - Date and time selection
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(skipEnabledBookingData.dateTime);

    // Step 8: Continue booking - Personal details
    await personalDetailsPage.fillDetails(skipEnabledBookingData.customer);
    await personalDetailsPage.submit();

    // Step 9: Complete booking - Wait for confirmation
    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected time
    skipEnabledBookingData.dateTime.time = selectedDateTime.time;
    skipEnabledBookingData.dateTime.date = selectedDateTime.date;
    skipEnabledBookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    // Step 10: Verify confirmation
    const isVerified = await confirmationPage.verifyBooking(skipEnabledBookingData);
    expect(isVerified).toBe(true);

    // Verify cancel button is available on confirmation page
    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });
});
