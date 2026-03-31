import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { TestDataBuilder } from '../../src/utils/testDataBuilder';
import { DateUtils } from '../../src/utils/dateUtils';
import { expect } from '@playwright/test';

/**
 * OAC-20002: Edit Existing Appointment Test
 * 
 * Test Case: Complete appointment editing flow with valid modifications
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through editBookingData fixture
 * - All page objects available and functional
 * - Initial booking created successfully (precondition)
 * 
 * Test Flow:
 * 1. Create initial appointment (precondition setup)
 * 2. Verify edit links are available on confirmation page
 * 3. Click edit date/time - navigate to DateTime page in edit mode
 * 4. Change date/time to new slot and submit
 * 5. Click edit personal details - navigate to Personal Details page
 * 6. Update customer information and submit
 * 7. Verify updated confirmation displays all changes
 * 8. Validate edit links and cancel button remain available
 * 
 * Expected Results:
 * - Edit links visible and functional on confirmation page
 * - Date/time changes accepted and reflected
 * - Personal details updates accepted and reflected
 * - Confirmation page shows updated booking information
 * - Edit functionality remains available after successful edits
 * - Cancel button remains accessible throughout
 */

test.describe('Appointment Editing - OAC-20002', () => {
  test('Edit existing appointment from widget', { tag: ['@functional', '@edit'] }, async ({ page, editBookingData }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Step 0: Complete happy path booking first (precondition)
    await page.goto(process.env.BASE_URL!);

    // Check what page we're actually on - could be service or location page
    await page.waitForTimeout(2000); // Wait for page to settle
    
    // Try to detect if we're on service page first
    const servicePageVisible = await page.getByRole('button', { name: 'Personal Accounts' }).isVisible().catch(() => false);
    
    if (servicePageVisible) {
      // We're on service page, proceed with normal flow
      await servicePage.selectServiceFlow(editBookingData.service.category, editBookingData.service.name);
      await locationPage.searchAndSelectLocation(editBookingData.location.code, editBookingData.location.name);
    } else {
      // We might be on location page or need to handle service selection differently
      // Wait for either location page or service page to be fully loaded
      await expect(async () => {
        const locationVisible = await page.getByText('Select Location').isVisible().catch(() => false);
        const serviceVisible = await page.getByRole('button', { name: 'Personal Accounts' }).isVisible().catch(() => false);
        return locationVisible || serviceVisible;
      }).toPass({ timeout: 30000 });

      // Check again if service page is available
      const servicePageAvailable = await page.getByRole('button', { name: 'Personal Accounts' }).isVisible().catch(() => false);
      
      if (servicePageAvailable) {
        await servicePage.selectServiceFlow(editBookingData.service.category, editBookingData.service.name);
      }
      
      // Proceed to location selection
      await locationPage.searchAndSelectLocation(editBookingData.location.code, editBookingData.location.name);
    }

    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(editBookingData.dateTime);

    await personalDetailsPage.fillDetails(editBookingData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    editBookingData.dateTime.time = selectedDateTime.time;
    editBookingData.dateTime.date = selectedDateTime.date;
    editBookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    const isVerified = await confirmationPage.verifyBooking(editBookingData);
    expect(isVerified).toBe(true);

    // Step 1: Verify Appointment Confirmation Page displays Clickable Edit buttons
    const editLinksVisible = await confirmationPage.areEditLinksVisible();
    expect(editLinksVisible).toBe(true);

    // Step 2: Click edit date/time - Appointment loads in edit context
    await confirmationPage.clickEditDateTime();
    
    // Verify we're back on DateTime page in edit mode
    await dateTimePage.waitForDateTimePage();
    
    // Step 3: Change date/time - New slot accepted
    // Generate a new date/time for the edit
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 2);
    const newFormattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const newDateTime = await dateTimePage.selectDayAndFirstAvailableTime({
      date: nextBusinessDay,
      formattedDate: newFormattedDate.fullDateString,
      time: '2:00 PM' // Different time from original
    });
    
    // Submit the date/time change
    await dateTimePage.submit();
    
    // Wait for confirmation page to reload with updated details
    await confirmationPage.waitForConfirmationPage();
    
    // Step 4: Update personal details - Values accepted by validation
    await confirmationPage.clickEditPersonalDetails();
    
    // Verify we're back on Personal Details page in edit mode
    await personalDetailsPage.waitForPersonalDetailsPage();
    
    // Generate new customer details for editing
    const newCustomer = TestDataBuilder.generateCustomer();
    const updatedCustomer = {
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      email: newCustomer.email,
      phone: newCustomer.phone
    };
    
    // Fill updated details
    await personalDetailsPage.fillDetails(updatedCustomer);
    await personalDetailsPage.submit();
    
    // Step 5: Submit edits - Navigate to Confirmation page
    await confirmationPage.waitForConfirmationPage();
    
    // Step 6: Verify updated confirmation - Updated values shown
    // Update booking data with new values for verification
    const updatedBookingData = { ...editBookingData };
    updatedBookingData.customer = updatedCustomer;
    updatedBookingData.dateTime.date = newDateTime.date;
    updatedBookingData.dateTime.time = newDateTime.time;
    updatedBookingData.dateTime.formattedDate = newDateTime.formattedDate;
    
    // Verify the updated details are displayed
    const isUpdatedVerified = await confirmationPage.verifyBooking(updatedBookingData);
    expect(isUpdatedVerified).toBe(true);
    
    // Verify edit links are still visible after successful edit
    const editLinksStillVisible = await confirmationPage.areEditLinksVisible();
    expect(editLinksStillVisible).toBe(true);
    
    // Verify cancel button is still available
    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });

});
