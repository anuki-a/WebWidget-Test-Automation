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

/**
 * OAC-20018: Verify Appointment Checklist Display Based on Selected P/S and Configuration
 * 
 * Test Case: Verify confirmation checklist link visibility and content follows service-specific checklist config.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Checklist on confirmation enabled
 * - Checklist items configured for service
 * - Test data provisioned through checklistsOfAppointmentsData fixture
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service with checklist configuration
 * 3. Continue to booking flow
 * 4. Complete booking for service configured with checklist
 * 5. Verify checklist link appears on confirmation page
 * 6. Click checklist link on confirmation page
 * 7. Verify popup shows checklist items
 * 8. Verify checklist content matches expected popup content
 * 
 * Expected Results:
 * - Checklist visibility and content depends on service + configuration
 * - Checklist link appears for services with checklist configuration
 * - Popup displays correct checklist items
 * - Checklist content matches expected configuration
 */
test.describe('Appointment Checklist Display - OAC-20018', () => {

  let adminService: AdminService;

  test.beforeEach(async ({ request }) => {
    adminService = new AdminService(new ApiClient(request));
  });

  test('Verify checklist display for service with checklist configuration', { tag: ['@functional', '@checklist'] }, async ({ 
    page, 
    checklistsOfAppointmentsData 
  }) => {
    // Extract test data from fixture
    const [bookingData, expectedChecklists] = checklistsOfAppointmentsData;
    
    // Initialize page objects
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Complete booking flow
    await page.goto(process.env.BASE_URL!);

    // Wait for page to be fully loaded with retry logic
    await expect(async () => {
      await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 30000 });
    
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);

    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);

    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    // Wait for confirmation page
    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected values
    bookingData.dateTime.time = selectedDateTime.time;
    bookingData.dateTime.date = selectedDateTime.date;
    bookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    // Verify booking details first
    const bookingVerified = await confirmationPage.verifyBooking(bookingData);
    expect(bookingVerified).toBe(true);

    // Verify checklist link appears on confirmation
    const checklistLinkVisible = await confirmationPage.isChecklistLinkVisible();
    expect(checklistLinkVisible).toBe(true);

    // Verify complete checklist flow functionality
    const checklistFlowSuccessful = await confirmationPage.verifyChecklistFlow(expectedChecklists);
    expect(checklistFlowSuccessful).toBe(true);
  });

  test.afterEach(async ({}, testInfo) => {
  // Only triggers after the checklist display verification test
  if (testInfo.title.includes('Verify checklist display for service with checklist configuration')) {
    console.log('Running Teardown: Disabling Appointment Checklist...');
    
    try {
      // Using the dynamic method to flip only the Checklist setting to false
      const response = await adminService.updateConfigSetting({ 
        ShowCheckListInWidget: false 
      });
      
      // Log warning if the reset failed to help with debugging flaky teardowns
      if (response.status() !== 200) {
        console.error('Teardown Warning: Failed to reset ShowCheckListInWidget to false.');
      }
    } catch (error) {
      console.error('Teardown Error during Admin Settings reset:', error);
    }
  }
});

// below test is working, but should implement configuration switch from test suite to use this test.

  // test('OAC-20018-B Verify checklist not displayed when checklist configuration is disabled', { tag: ['@functional', '@checklist'] }, async ({ 
  //   page, 
  //   checklistsOfAppointmentsData 
  // }) => {
  //   // Extract test data from fixture
  //   const [bookingData] = checklistsOfAppointmentsData;
    
  //   // Initialize page objects
  //   const servicePage = new ServicePage(page);
  //   const locationPage = new LocationPage(page);
  //   const meetingPreferencePage = new MeetingPreferencePage(page);
  //   const dateTimePage = new DateTimePage(page);
  //   const personalDetailsPage = new PersonalDetailsPage(page);
  //   const confirmationPage = new ConfirmationPage(page);

  //   // Complete booking flow
  //   await page.goto(process.env.BASE_URL!);

  //   // Wait for page to be fully loaded with retry logic
  //   await expect(async () => {
  //     await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
  //   }).toPass({ timeout: 30000 });
    
  //   await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

  //   const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);

  //   await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

  //   await meetingPreferencePage.selectInPerson();

  //   const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);

  //   await personalDetailsPage.fillDetails(bookingData.customer);
  //   await personalDetailsPage.submit();

  //   // Wait for confirmation page
  //   await confirmationPage.waitForConfirmationPage();
    
  //   // Update booking data with actual selected values
  //   bookingData.dateTime.time = selectedDateTime.time;
  //   bookingData.dateTime.date = selectedDateTime.date;
  //   bookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
  //   // Verify booking details first
  //   const bookingVerified = await confirmationPage.verifyBooking(bookingData);
  //   expect(bookingVerified).toBe(true);

  //   // Verify checklist link is NOT visible when checklist configuration is disabled
  //   const checklistLinkVisible = await confirmationPage.isChecklistLinkVisible();
  //   expect(checklistLinkVisible).toBe(false);
  // });
});
