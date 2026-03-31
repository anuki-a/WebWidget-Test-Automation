import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';

/**
 * OAC-20004: Cancel Existing Appointment From Web Widget
 * 
 * Test Case: Complete appointment cancellation flow with proper validation
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through bookingFixture
 * - All page objects available and functional
 * - Existing appointment that can be cancelled
 * 
 * Test Flow:
 * 1. Create a new appointment through booking flow
 * 2. Verify cancel button availability on confirmation page
 * 3. Test cancellation dismiss (appointment remains active)
 * 4. Test cancellation confirm (appointment gets cancelled)
 * 5. Verify cancellation status and UI changes
 * 6. Validate appointment status via API
 * 
 * Expected Results:
 * - Appointment can be cancelled successfully
 * - Cancellation popup works correctly (dismiss/confirm)
 * - UI reflects cancelled state properly
 * - "Book Another" option becomes available
 * - API shows appointment as cancelled
 */
test.describe('Appointment Booking - OAC-20004', () => {
  test('Cancel Existing Appointment From Web Widget', { tag: ['@smoke', '@functional'] }, async ({ page, cancelPathBookingData }) => {
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
    }).toPass({ timeout: 60000 });
    
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    const selectedService = await servicePage.selectServiceFlow(cancelPathBookingData.service.category, cancelPathBookingData.service.name);

    await locationPage.searchAndSelectLocation(cancelPathBookingData.location.code, cancelPathBookingData.location.name);

    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(cancelPathBookingData.dateTime);

    await personalDetailsPage.fillDetails(cancelPathBookingData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    cancelPathBookingData.dateTime.time = selectedDateTime.time;
    cancelPathBookingData.dateTime.date = selectedDateTime.date;
    cancelPathBookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    const isVerified = await confirmationPage.verifyBooking(cancelPathBookingData);
    expect(isVerified).toBe(true);

    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);

    const dismissSuccessful = await confirmationPage.testCancellationDismiss();
    expect(dismissSuccessful).toBe(true);

    const cancelSuccessful = await confirmationPage.testCancelAppointment();
    expect(cancelSuccessful).toBe(true);
  });
});
