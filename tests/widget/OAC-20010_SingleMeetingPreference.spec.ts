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
import { ProductService } from '@/api/ProductService';
import { DateUtils } from '@/utils/dateUtils';

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

  test.beforeEach(async ({ request, singleMeetingPreferenceBookingData }) => {
    adminService = new AdminService(new ApiClient(request));
    
    // Setup environment for OAC-20010
    console.log('Running Setup for OAC-20010: configuring product preferences...');
    
    try {
      const apiClient = new ApiClient(request);
      const productService = new ProductService(apiClient);
      
      const clientId = 54;
      const productId = 392; 
      const targetLocationId = 26;

      // 1. GET current data
      const getResponse = await productService.getProductById(clientId, productId);
      expect(getResponse.ok()).toBeTruthy();
      const rawData = await getResponse.json();
      const serviceEntity = Array.isArray(rawData) ? rawData[0] : rawData;

      const { meetingPreference } = singleMeetingPreferenceBookingData;

      // 2. CLEAN and CONSTRUCT the payload
      // We use destructuring to strip out OData metadata and Navigation Properties
      const { 
        $id, $type,           // Metadata from OData/Breeze
        Location, Service1,   // Navigation properties (The 500 Error Culprits)
        Service2, ServiceCategory, 
        ServiceType, User, 
        User1, UserServices, 
        AppointmentServiceRequests,
        entityAspect: oldAspect, // We will replace this entirely
        ...cleanEntity         // Everything else (the actual DB columns)
      } = serviceEntity;

      const modifiedService = {
        ...cleanEntity,
        FkLocationId: targetLocationId,
        AllowInPersonAppointments: meetingPreference.type === 'in-person',  
        AllowPhoneAppointments: meetingPreference.type === 'phone',
        AllowVirtualAppointments: meetingPreference.type === 'virtual',
        
        // Reconstruct a clean entityAspect
        entityAspect: {
          entityTypeName: "Service:#Oac.Model.Data.ClientData",
          defaultResourceName: "Services",
          entityState: "Modified",
          originalValuesMap: {
            // As you noted, manage the true/false logic via fixtures
            AllowPhoneAppointments: serviceEntity.AllowPhoneAppointments,
            AllowInPersonAppointments: serviceEntity.AllowInPersonAppointments,
            AllowVirtualAppointments: serviceEntity.AllowVirtualAppointments
          }
        }
      };

      // 3. POST back
      const saveOptions = {
        tag: `${clientId},false,${targetLocationId}`
      };

      console.log('Modified Service:', JSON.stringify(modifiedService, null, 2));
      console.log('Save Options:', JSON.stringify(saveOptions, null, 2));
      const saveResponse = await productService.saveService([modifiedService], saveOptions);

      if (!saveResponse.ok()) {
        console.error(`Setup Error - Status: ${saveResponse.status()}`);
        console.error(`Setup Error - Body: ${await saveResponse.text()}`);
        throw new Error('Failed to setup OAC-20010 environment');
      }
    } catch (error) {
      console.error('Setup Error:', error);
      throw error;
    }
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


  test.afterEach(async ({ request, partialHolidayHandlingData }, testInfo) => {
    if (testInfo.title.includes('Select P/S Without Multiple Meeting Preference Enabled - Meeting Preference Page Skipped')) {
      try {
    console.log('Running Teardown inorder to prepare for OAC-20013 : Insert Partial Holiday...');
    const apiClient = new ApiClient(request);
  const adminService = new AdminService(apiClient);

  // Get date and time data from fixture
  const holidayDate = partialHolidayHandlingData.partialHolidayDateTime.date;
  const startTimeString = partialHolidayHandlingData.partialHolidayDateTime.startTime;
  const endTimeString = partialHolidayHandlingData.partialHolidayDateTime.endTime;
  
  // Set Date to midnight UTC (as per curl)
  const midnightDate = new Date(holidayDate);
  midnightDate.setUTCHours(0, 0, 0, 0);

  // Parse time strings from fixture and convert to UTC dates
  const startParsedTime = DateUtils.parseTimeString(startTimeString);
  const startTime = new Date(holidayDate);
  startTime.setUTCHours(startParsedTime.hours, startParsedTime.minutes, 0, 0);

  const endParsedTime = DateUtils.parseTimeString(endTimeString);
  const endTime = new Date(holidayDate);
  endTime.setUTCHours(endParsedTime.hours, endParsedTime.minutes, 0, 0);

  const holidayData = {
    HolidayId: -610, // Matching curl ID
    FkHolidayParentId: null,
    FkLocationId: 1,
    HolidayName: "Auto Half Holiday",
    HolidayCode: "X",
    Date: midnightDate.toISOString(),
    StartTime: startTime.toISOString(),
    EndTime: endTime.toISOString(),
    IsAllDay: false, // Changed to false for partial holiday
    OptIn: true,
    CreatedBy: 0,
    CreatedDate: "1899-12-31T18:40:28.000Z",
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
    __unmapped: {
      DayOfWeek: "",
      Start: "",
      End: "",
      Inherited: "Inherited",
      OptInStatus: true,
      HolidayDate: midnightDate.toISOString()
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
