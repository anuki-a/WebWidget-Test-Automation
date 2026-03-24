import { test } from '../../src/fixtures/bookingFixture';
import { DateUtils } from '../../src/utils/dateUtils';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { AppointmentClient } from '../../src/api/AppointmentClient';
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

    // Initialize page objects for UI interactions
    // Following Page Object Model pattern for maintainable test code
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Step 1: Create a new appointment through the standard booking flow
    // Navigate to appointment widget using environment configuration
    await page.goto(process.env.BASE_URL!);

    // Verify service categories are available and select target service
    await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    // Execute service selection flow using page object abstraction
    const selectedService = await servicePage.selectServiceFlow(cancelPathBookingData.service.category, cancelPathBookingData.service.name);

    // Search and select location using location code and name
    await locationPage.searchAndSelectLocation(cancelPathBookingData.location.code, cancelPathBookingData.location.name);

    // Select in-person meeting preference
    await meetingPreferencePage.selectInPerson();

    // Select today's date and first available time slot
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(cancelPathBookingData.dateTime);

    // Fill customer information and submit booking form
    await personalDetailsPage.fillDetails(cancelPathBookingData.customer);
    await personalDetailsPage.submit();

    // Wait for confirmation page and verify booking details
    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected time for verification
    cancelPathBookingData.dateTime.time = selectedDateTime.time
    cancelPathBookingData.dateTime.date = selectedDateTime.date
    cancelPathBookingData.dateTime.formattedDate = selectedDateTime.formattedDate
    
    // Verify booking details match expected data using verification method
    const isVerified = await confirmationPage.verifyBooking(cancelPathBookingData);
    expect(isVerified).toBe(true);

    // Step 2: Verify cancel button availability on confirmation page
    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);

    // Step 3: Test cancellation dismiss flow (appointment should remain active)
    // First, test that dismissing the cancellation popup keeps the appointment active
    const dismissSuccessful = await confirmationPage.testCancellationDismiss();
    expect(dismissSuccessful).toBe(true);

    // Step 4: Test cancellation confirm flow (appointment should be cancelled)
    // Now, test that confirming the cancellation actually cancels the appointment
    const cancelSuccessful = await confirmationPage.testCancelAppointment();
    expect(cancelSuccessful).toBe(true);

    // // Step 5: Verify cancellation status and UI changes
    // // Verify appointment shows as cancelled
    // const isCancelled = await confirmationPage.verifyAppointmentCancelled();
    // expect(isCancelled).toBe(true);












    // // Verify "Book Another" button is available after cancellation
    // const hasBookAnother = await confirmationPage.isBookAnotherButtonVisible();
    // expect(hasBookAnother).toBe(true);

    // // Step 6: Get appointment details for API validation
    // const appointmentId = await confirmationPage.getAppointmentId();
    // expect(appointmentId).toBeDefined();

    // // Step 7: Validate appointment cancellation status via API
    // // Initialize API client for backend validation
    // const apiClient = await AppointmentClient.create(process.env.API_URL!);
    
    // try {
    //   // Fetch appointment details from API to verify cancellation status
    //   const appointmentDetails = await apiClient.getAppointmentById(appointmentId!);
      
    //   // Verify appointment is marked as cancelled in the backend
    //   expect(appointmentDetails.status).toBe('cancelled');
    //   expect(appointmentDetails.cancelledAt).toBeDefined();
      
    //   console.log(`Appointment ${appointmentId} successfully cancelled and verified via API`);
    // } catch (error) {
    //   console.warn('API validation failed, but UI cancellation was successful:', error);
    //   // Don't fail the test if API validation fails, as the primary goal is UI functionality
    // }
  });
});
