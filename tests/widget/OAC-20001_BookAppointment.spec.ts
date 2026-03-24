import { test } from '../../src/fixtures/bookingFixture';
import { DateUtils } from '../../src/utils/dateUtils';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';

/**
 * OAC-20001: End-to-End Appointment Booking Test
 * 
 * Test Case: Complete booking flow with valid customer details (Happy Path)
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through bookingFixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service category and specific service
 * 3. Search and select location
 * 4. Choose meeting preference (in-person)
 * 5. Select date and time slot
 * 6. Fill customer details and submit
 * 7. Verify booking confirmation
 * 8. Validate cancel button availability
 * 
 * Expected Results:
 * - Booking successfully created
 * - Confirmation page displays correct details
 * - All booking data matches input
 * - User can cancel booking if needed
 */
test.describe('Appointment Booking - OAC-20001', () => {
  test('Complete booking with valid customer details', { tag: ['@smoke', '@functional'] }, async ({ page, bookingData }) => {

    // Initialize page objects for UI interactions
    // Following Page Object Model pattern for maintainable test code
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Navigate to appointment widget using environment configuration
    await page.goto(process.env.BASE_URL!);

    // Verify service categories are available and select target service
    await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    // Execute service selection flow using page object abstraction
    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);

    // Search and select location using location code and name
    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    // Select in-person meeting preference
    await meetingPreferencePage.selectInPerson();

    // Select today's date and first available time slot
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);

    // Fill customer information and submit booking form
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    // Wait for confirmation page and verify booking details
    await confirmationPage.waitForConfirmationPage();
    
    bookingData.dateTime.time = selectedDateTime.time
    bookingData.dateTime.date = selectedDateTime.date
    bookingData.dateTime.formattedDate = selectedDateTime.formattedDate
    // Update booking data with actual selected time for verification
    const isVerified = await confirmationPage.verifyBooking(bookingData);
    expect(isVerified).toBe(true);

    // Verify booking details match expected data using verification method
    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });
});
