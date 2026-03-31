import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';
import { DateUtils } from '../../src/utils/dateUtils';
import { TestDataBuilder } from '../../src/utils/testDataBuilder';

/**
 * OAC-20005: Book Another After Successful Booking (Desktop, Functional)
 * 
 * Test Case: Verify 'Book Another' retains personal details and allows a second booking with different service/date/time
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through bookingFixture
 * - All page objects available and functional
 * - Personal details persistence enabled in widget
 * 
 * Test Flow:
 * 1. Create first appointment and capture details
 * 2. Click Book Another button
 * 3. Select different service, date, and time for second booking
 * 4. Verify personal details are pre-filled on personal details page
 * 5. Submit second booking and verify confirmation
 * 6. Validate personal details consistency across both appointments
 * 
 * Expected Results:
 * - Book Another flow works correctly
 * - Personal details persisted across multiple bookings
 * - Second booking succeeds with retained details
 */
test.describe('Appointment Booking - OAC-20005', () => {
  test('Book Another retains personal details and allows second booking', { tag: ['@functional', '@smoke'] }, async ({ page, secondBookingData, secondServiceData }) => {
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

    // Step 1: Create first appointment
    const selectedService = await servicePage.selectServiceFlow(secondBookingData.service.category, secondBookingData.service.name);
    await locationPage.searchAndSelectLocation(secondBookingData.location.code, secondBookingData.location.name);
    await meetingPreferencePage.selectInPerson();
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(secondBookingData.dateTime);
    
    // Fill and submit personal details for first appointment
    await personalDetailsPage.fillDetails(secondBookingData.customer);
    await personalDetailsPage.submit();

    // Wait for confirmation and verify first booking
    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected values
    secondBookingData.dateTime.time = selectedDateTime.time;
    secondBookingData.dateTime.date = selectedDateTime.date;
    secondBookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    // Step 2: Capture first appointment details
    const firstConfirmationDetails = await confirmationPage.getConfirmationDetails();
    const isFirstBookingVerified = await confirmationPage.verifyBooking(secondBookingData);
    expect(isFirstBookingVerified).toBe(true);

    // Verify Book Another button is visible
    await expect(confirmationPage.bookAnotherButton).toBeVisible();

    // Step 3: Click Book Another to start second booking
    await confirmationPage.clickBookAnother();

    // Verify we're back at service selection page
    await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 30000 });

    // Step 4: Select different service for second booking
    const secondSelectedService = await servicePage.selectServiceFlow(secondServiceData.category, secondServiceData.name);

    // Use same location (as per typical Book Another behavior)
    await locationPage.searchAndSelectLocation(secondBookingData.location.code, secondBookingData.location.name);
    await meetingPreferencePage.selectInPerson();

    // Step 5: Select different date/time for second booking
    const businessDayAftertomorrow = DateUtils.addBusinessDays(DateUtils.getToday(), 2);
    const newDayFormatted = DateUtils.formatDateForUI(businessDayAftertomorrow);
    const secondDateTimeData = {
      date: businessDayAftertomorrow,
      formattedDate: newDayFormatted.fullDateString,
      time: '2:00 PM' // Different time from first booking
    };
    
    const secondSelectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(secondDateTimeData);

    // Step 6: Check personal details page - should be pre-filled
    await personalDetailsPage.waitForPersonalDetailsPage();

    // Step 7: Verify all details are retained correctly
    const preFilledFirstName = await personalDetailsPage.getFirstName();
    const preFilledLastName = await personalDetailsPage.getLastName();
    const preFilledEmail = await personalDetailsPage.getEmail();
    const preFilledPhone = await personalDetailsPage.getPhone();

    // Verify personal details match first booking
    expect(preFilledFirstName).toBe(secondBookingData.customer.firstName);
    expect(preFilledLastName).toBe(secondBookingData.customer.lastName);
    expect(preFilledEmail).toBe(secondBookingData.customer.email);
    expect(preFilledPhone).toBe(secondBookingData.customer.phone);

    // Step 8: Submit second booking
    await personalDetailsPage.submit();

    // Step 9: Verify second confirmation
    await confirmationPage.waitForConfirmationPage();
    
    // Create second booking data for verification
    const secondBookingVerificationData = { ...secondBookingData };
    secondBookingVerificationData.service = secondServiceData;
    secondBookingVerificationData.dateTime = {
      date: secondSelectedDateTime.date,
      formattedDate: secondSelectedDateTime.formattedDate,
      time: secondSelectedDateTime.time
    };

    // Verify second booking details
    const isSecondBookingVerified = await confirmationPage.verifyBooking(secondBookingVerificationData);
    expect(isSecondBookingVerified).toBe(true);

  });
});
