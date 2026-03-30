import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { expect } from '@playwright/test';
import { AdminService } from '@/api/AdminService';
import { ApiClient } from '@/api/apiClient';
import { ConfirmationPage } from '@/pages/ConfirmationPage';

/**
 * OAC-20010: Select P/S Without Multiple Meeting Preference Enabled (Meeting Preference Page Skipped)
 * 
 * Test Case: Verify Meeting Preference page is skipped for services without multiple meeting preference option.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through singleMeetingPreferenceBookingData fixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service category and specific service (without Meeting Preference choices)
 * 3. Search and select location
 * 4. Verify Meeting Preference page is skipped
 * 5. Continue to date/time selection
 * 6. Complete booking
 * 7. Verify confirmation
 * 
 * Expected Results:
 * - Meeting Preference page is skipped
 * - Flow continues directly to date/time selection
 * - Appointment created successfully
 */
test.describe('Single Meeting Preference - OAC-20010', () => {
  let adminService: AdminService;

  test.beforeEach(async ({ request }) => {
    adminService = new AdminService(new ApiClient(request));
  });
  
  
  test('Select P/S Without Multiple Meeting Preference Enabled - Meeting Preference Page Skipped', { tag: ['@meeting-preference', '@skip-behavior'] }, async ({ page, singleMeetingPreferenceBookingData }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Step 1: Open web widget URL
    await page.goto(process.env.BASE_URL!);

    // Wait for page to be fully loaded with retry logic
    await expect(async () => {
      await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 30000 });
    
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    // Step 2: Select service without Meeting Preference options
    const selectedServiceName = await servicePage.selectServiceFlow(singleMeetingPreferenceBookingData.service.category, singleMeetingPreferenceBookingData.service.name);

    // Step 3: Select available location
    await locationPage.searchAndSelectLocation(singleMeetingPreferenceBookingData.location.code, singleMeetingPreferenceBookingData.location.name);

    // Step 4: Verify Meeting Preference page is skipped and flow continues to date/time
    // The key assertion - meeting preferences should be skipped
    const isMeetingPreferenceSkipped = await meetingPreferencePage.isMeetingPreferenceSkipped();
    expect(isMeetingPreferenceSkipped).toBe(true);

    // Verify we're directly on the date/time page
    await dateTimePage.waitForDateTimePage();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(singleMeetingPreferenceBookingData.dateTime);

    await personalDetailsPage.fillDetails(singleMeetingPreferenceBookingData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    singleMeetingPreferenceBookingData.dateTime.time = selectedDateTime.time;
    singleMeetingPreferenceBookingData.dateTime.date = selectedDateTime.date;
    singleMeetingPreferenceBookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    const isVerified = await confirmationPage.verifyBooking(singleMeetingPreferenceBookingData);
    expect(isVerified).toBe(true);

    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);

    // Verify appointment was created with the expected meeting preference from fixture
    if (singleMeetingPreferenceBookingData.meetingPreference.displayName) {
      const preferenceElement = page.getByText(singleMeetingPreferenceBookingData.meetingPreference.displayName, { exact: false }).first();
      await expect(preferenceElement).toBeVisible();
    }
  });
});
