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
 * OAC-20001: End-to-End Book Appointment Test
 * 
 * Test Case: Complete booking with valid customer details (Happy Path)
 * 
 * Steps:
 * 1. Navigate to appointment widget
 * 2. Select service category and service
 * 3. Select location
 * 4. Select meeting preference
 * 5. Select date and time
 * 6. Fill customer details
 * 7. Submit booking
 * 8. Verify confirmation page
 */
test.describe('Appointment Booking - OAC-20001', () => {
  test('Complete booking with valid customer details', { tag: ['@smoke', '@functional'] }, async ({ page, bookingData }) => {
    // Monitor API calls
    // const apiCalls: any[] = [];
    
    // page.on('request', request => {
    //   if (request.url().includes('/api/') || request.url().includes('/OacWeb/')) {
    //     console.log(`🌐 API Request: ${request.method()} ${request.url()}`);
    //     apiCalls.push({ url: request.url(), method: request.method() });
    //   }
    // });

    // page.on('response', async response => {
    //   if (response.url().includes('/api/') || response.url().includes('/OacWeb/')) {
    //     const status = response.status();
    //     console.log(`📡 API Response: ${status} ${response.url()}`);
    //     if (status >= 400) {
    //       console.error(`❌ API Error: ${status} ${response.url()}`);
    //     }
    //   }
    // });
    // Create page objects
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Step 1: Navigate to the service widget
    await page.goto(process.env.BASE_URL!);

    // Step 2: Verify service categories are visible and select service
    await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    // Select service category and service using page object
    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);

    // Step 3: Select location using page object
    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    // Step 4: Select meeting preference using page object
    await meetingPreferencePage.selectInPerson();

    // Step 5: Select date and time using page objects
    const selectedDateTime = await dateTimePage.selectTodayAndFirstAvailableTime();
    const selectedTime = selectedDateTime.time;

    // Step 6: Fill customer details using page object
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    // Step 7: Verify confirmation page with booking details using verifyBooking method
    await confirmationPage.waitForConfirmationPage();
    
    bookingData.dateTime.time = selectedTime
    // Use the new verifyBooking method for exact verification
    const isVerified = await confirmationPage.verifyBooking(bookingData);
    expect(isVerified).toBe(true);

    // Verify cancel button is present
    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });
});
