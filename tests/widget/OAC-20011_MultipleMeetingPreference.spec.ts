import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { TestDataBuilder } from '../../src/utils/testDataBuilder';
import { DateUtils } from '../../src/utils/dateUtils';
import { ApiClient } from '../../src/api/apiClient';
import { AdminService } from '../../src/api/AdminService';
import { expect } from '@playwright/test';
/**
 * OAC-20011: Multiple Meeting Preference Test
 * 
 * Test Case: Complete booking flow with multiple meeting preference options
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through multipleMPBookingData fixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service category and specific service
 * 3. Search and select location
 * 4. Verify multiple meeting preference options are displayed
 * 5. Select in-person meeting preference
 * 6. Select date and time slot
 * 7. Fill customer details and submit
 * 8. Verify booking confirmation with meeting preference
 * 9. Validate cancel button availability
 * 
 * Expected Results:
 * - Multiple meeting preference options displayed
 * - In-person preference selectable
 * - Booking successfully created with correct preference
 * - Confirmation page displays correct meeting preference
 * - All booking data matches input
 * - User can cancel booking if needed
 */

test.describe('Multiple Meeting Preference - OAC-20011', () => {


  test('Complete booking with multiple meeting preference options', { tag: ['@smoke', '@functional'] }, async ({ page, multipleMPBookingData: bookingData }) => {
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

    // Navigate to meeting preference selection
    await meetingPreferencePage.waitForMeetingPreferencePage();
    
    // Check URL contains "meeting-preference"
    expect(page.url()).toContain('meeting-preference');
    
    // Verify more than one meeting preference options are displayed
    const availablePreferences = await meetingPreferencePage.getAvailableMeetingPreferences();
    expect(availablePreferences.length).toBeGreaterThan(1);
    
    // Select in-person meeting preference
    await meetingPreferencePage.selectInPerson();
    await meetingPreferencePage.waitForMeetingPreferenceSelectionComplete();

    // Continue with the rest of the booking flow
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);
    
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();
    
    // Verify booking confirmation
    await confirmationPage.waitForConfirmationPage();
    const confirmationDetails = await confirmationPage.getConfirmationDetails();
    
    // Verify booking details displayed meeting preference correctly
    expect(confirmationDetails.meetingPreference).toBe(bookingData.meetingPreference.displayName);
    
    // Verify cancel button is available
    await expect(confirmationPage.cancelButton).toBeVisible();
    
  });


  test.afterEach(async ({ request }, testInfo) => {
    if (testInfo.title.includes('Complete booking with multiple meeting preference options')) {
      try {
    console.log('Running Teardown inorder to prepare for OAC-20014 : Insert Full Holiday...');
    // 1. Calculate dynamic date (matching the original midnight format)
    const apiClient = new ApiClient(request);
    const adminService = new AdminService(apiClient);

    // 1. Calculate dynamic date (matching the original midnight format)
    const today = new Date();
    const futureDate = DateUtils.addBusinessDays(today, 3);
    futureDate.setUTCHours(0, 0, 0, 0);
    const isoDate = futureDate.toISOString();

  // 2. Full payload including the "__unmapped" block which is often required by Breeze/OData
  const holidayData = {
    HolidayId: -88,
    FkHolidayParentId: null,
    FkLocationId: 1,
    HolidayName: `Auto Holiday ${isoDate.split('T')[0]}`,
    HolidayCode: "X",
    Date: isoDate,
    StartTime: isoDate,
    EndTime: isoDate,
    IsAllDay: true,
    OptIn: true,
    CreatedBy: 0,
    CreatedDate: "1899-12-31T18:40:28.000Z", // Original placeholder from your Postman
    ChangedBy: null,
    ChangedDate: null,
    InheritedStatus: "I",
    ActiveStatus: 1,
    IsBlackout: false,
    OptInSubLocations: false,
    CCHolidayId: null,
    HolidayDisplayName: null,
    HolidayNameSpanish: null,
    HolidayDisplayNameSpanish: null,
    // CRITICAL: The server likely throws a NullReferenceException if this block is missing
    __unmapped: {
      DayOfWeek: "",
      Start: "",
      End: "",
      Inherited: "Inherited",
      OptInStatus: true,
      HolidayDate: new Date().toISOString() // Current timestamp 
    },
    entityAspect: {
      entityTypeName: "Holiday:#Oac.Model.Data.ClientData",
      defaultResourceName: "Holidays",
      entityState: "Added",
      originalValuesMap: {},
      autoGeneratedKey: {
        propertyName: "HolidayId",
        autoGeneratedKeyType: "Identity"
      }
    }
  };

  const options = { tag: "54,1" };

  const response = await adminService.saveHoliday(holidayData, options);

  // Validation
  expect(response.ok()).toBeTruthy();

      } catch (error) {
        console.error('Teardown Error:', error);
      }
    }
  });


  

});
