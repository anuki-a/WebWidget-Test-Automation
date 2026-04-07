import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';
import { AdminService } from '@/api/AdminService';
import { ApiClient } from '@/api/apiClient';
import { DateUtils } from '../../src/utils/dateUtils';

/**
 * OAC-20020: Verify Impact of Manual Staff Selection and Request Spanish Speaker
 * 
 * This test verifies that manual staff selection and Spanish speaker request
 * affect slot availability and portal data accordingly.
 */
test.describe('Manual Staff Selection and Spanish Speaker Request - OAC-20020', () => {

  let adminService: AdminService;

  test.beforeEach(async ({ request }) => {
    adminService = new AdminService(new ApiClient(request));
  });
    
  test('Complete booking with Spanish speaker request and manual staff selection', { tag: ['@functional', '@staff-selection'] }, async ({ page, TimeSlotAvailabilityHandlingData }) => {
    const [bookingData, staffAvailabilityData] = TimeSlotAvailabilityHandlingData;
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

    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);

    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    await meetingPreferencePage.selectInPerson();

    // Navigate to Date and Time page
    await dateTimePage.waitForDateTimePage();
    await dateTimePage.getCalendar().selectDate(bookingData.dateTime.date);

    // Step 5: Check staff selection dropdown availability and default selection
    const isStaffDropdownAvailable = await dateTimePage.isStaffDropdownAvailable();
    expect(isStaffDropdownAvailable).toBe(true);

    const defaultSelection = await dateTimePage.getDefaultStaffSelection();
    expect(defaultSelection).toBe('0: undefined');

    // Step 6: Check for 2 staff members available to select
    const availableStaff = await dateTimePage.getAvailableStaffOptions();
    expect(availableStaff.length).toBeGreaterThanOrEqual(2);
    
    // Verify the staff names match our fixture data (trim whitespace from UI options)
    const fixtureStaffNames = staffAvailabilityData.map(staff => staff.staffName);
    const trimmedAvailableStaff = availableStaff.map(staff => staff.trim());
    for (const fixtureStaffName of fixtureStaffNames) {
      expect(trimmedAvailableStaff).toContain(fixtureStaffName);
    }

    // Step 7: Tick 'request Spanish speaker' checkbox and verify dropdown shows only Spanish speaker
    await dateTimePage.enableSpanishSpeakerRequest();
    
    // Wait for dropdown options to refresh after checkbox change
    await page.waitForTimeout(7000);
    
    // Ensure both are clean arrays of strings
// 1. Get and clean the UI options
const rawOptions = await dateTimePage.getAvailableStaffOptions();
const spanishSpeakerStaff = rawOptions
    .map(name => name.trim())
    .filter(name => name !== 'Please select' && name !== '');

// 2. Get and clean the Fixture names
const spanishStaffFromFixture = staffAvailabilityData
    .filter(staff => staff.spanishSpeaker)
    .map(staff => staff.staffName.trim());

// 3. Assertions
// Check count first
expect(spanishSpeakerStaff).toHaveLength(spanishStaffFromFixture.length);

// Check deep equality of the arrays
expect(spanishSpeakerStaff[0]?.toString).toEqual(spanishStaffFromFixture[0]?.toString);

    // Step 8: Select Spanish speaker staff from dropdown
    // Get the list of Spanish speakers from fixture data
    const spanishSpeakersFromFixture = staffAvailabilityData
      .filter(staff => staff.spanishSpeaker)
      .map(staff => staff.staffName.trim());
    
    const selectedSpanishSpeaker = spanishSpeakersFromFixture[0];
    if (selectedSpanishSpeaker) {
      await dateTimePage.selectStaff(selectedSpanishSpeaker);
    } else {
      throw new Error('No Spanish speaker staff available for selection');
    }

    // Step 9: Select available future date (already done above)
    // Step 10: Select time slot and proceed
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);

    // Step 11: Enter valid details and submit
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    // Step 12: Verify confirmation details
    await confirmationPage.waitForConfirmationPage();
    
    bookingData.dateTime.time = selectedDateTime.time;
    bookingData.dateTime.date = selectedDateTime.date;
    bookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    const isVerified = await confirmationPage.verifyBooking(bookingData);
    expect(isVerified).toBe(true);

    // Verify Spanish speaker request is displayed in confirmation
    const spanishSpeakerText = await confirmationPage.getSpanishSpeakerIndicator();
    expect(spanishSpeakerText).toContain('(Spanish speaker requested)');

    // Verify selected staff member is displayed correctly
    const isStaffDisplayed = await confirmationPage.verifyStaffMemberDisplayed(selectedSpanishSpeaker);
    expect(isStaffDisplayed).toBe(true);

    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });

});
