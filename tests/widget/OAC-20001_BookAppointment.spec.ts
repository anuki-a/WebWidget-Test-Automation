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

    let adminService: AdminService;
  
    test.beforeEach(async ({ request }) => {
      adminService = new AdminService(new ApiClient(request));
    });
    
  test('Complete booking with valid customer details', { tag: ['@smoke', '@functional'] }, async ({ page, bookingData }) => {
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

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);

    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    bookingData.dateTime.time = selectedDateTime.time;
    bookingData.dateTime.date = selectedDateTime.date;
    bookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    const isVerified = await confirmationPage.verifyBooking(bookingData);
    expect(isVerified).toBe(true);

    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });

  /**
   * OAC-20009-A: Personal Details Validation for Phone/Email Optional Configurations
   * 
   * Test Case: Verify email/phone optional behavior based on Admin Portal widget settings
   * 
   * Prerequisites:
   * - Widget accessible via BASE_URL environment variable
   * - Test data provisioned through personalDetailsMandatory fixture
   * - Email/Phone fields configured as optional in Admin Portal
   * - IMPORTANT : Tenant-wide widget settings configured
   *                  - Require customer email for appointments = unchecked
   *                  - Require customer phone for appointments = unchecked
   * 
   * Test Flow:
   * 1. Navigate to appointment widget
   * 2. Select service category and specific service
   * 3. Search and select location
   * 4. Choose meeting preference (in-person)
   * 5. Select date and time slot
   * 6. Leave both email and phone fields blank
   * 7. Submit the booking form
   * 8. Verify booking confirmation
   * 
   * Expected Results:
   * - Email/Phone rules should be enforced based on Admin Portal configuration
   * - Validation combinations should work correctly
   * - Booking should be successfully created when email/phone are optional
   */
  test('OAC-20009-A Personal Details Validation - Optional Configurations', { tag: ['@validation', '@optional-fields'] }, async ({ page, personalDetailsMandatory }) => {
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

    const selectedService = await servicePage.selectServiceFlow(personalDetailsMandatory.service.category, personalDetailsMandatory.service.name);

    await locationPage.searchAndSelectLocation(personalDetailsMandatory.location.code, personalDetailsMandatory.location.name);

    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(personalDetailsMandatory.dateTime);

    // Fill only mandatory fields (first name, last name), leave email and phone blank
    await personalDetailsPage.fillFirstName(personalDetailsMandatory.customer.firstName);
    await personalDetailsPage.fillLastName(personalDetailsMandatory.customer.lastName);
    
    // Verify email and phone fields are visible but optional
    await expect(personalDetailsPage.emailInput).toBeVisible();
    await expect(personalDetailsPage.phoneInput).toBeVisible();
    
    // Ensure email and phone fields are empty
    await personalDetailsPage.emailInput.fill('');
    await personalDetailsPage.phoneInput.fill('');
    
    // Submit the form - should succeed when email/phone are optional
    await personalDetailsPage.submit();
    
    // Wait for any validation errors to appear
    await page.waitForTimeout(2000);
    
    // Check for email validation errors using comprehensive method
    const emailErrors = await personalDetailsPage.getEmailValidationErrorsComprehensive();
    
    // Check for phone validation errors using comprehensive method  
    const phoneErrors = await personalDetailsPage.getPhoneValidationErrorsComprehensive();
    
    // Log email validation errors if found
    if (emailErrors.length > 0) {
      for (const error of emailErrors) {
        console.log('Email validation error found:', error);
        console.log('Possible configuration issue: check AC admin portal >> Administration >> Widget settings >> Email Required checkbox should be unchecked');
      }
    }
    
    // Log phone validation errors if found
    if (phoneErrors.length > 0) {
      for (const error of phoneErrors) {
        console.log('Phone validation error found:', error);
        console.log('Possible configuration issue: check AC admin portal >> Administration >> Widget settings >> Phone Required checkbox should be unchecked');
      }
    }
      // Verify successful booking
      await confirmationPage.waitForConfirmationPage();
    
  });

  /**
   * OAC-20018-B: Verify Checklist Not Displayed When Checklist Configuration is Disabled
   * 
   * Test Case: Verify checklist link is not visible on confirmation page when checklist configuration is disabled
   * 
   * Prerequisites:
   * - Widget accessible via BASE_URL environment variable
   * - Test data provisioned through bookingData fixture
   * - Checklist is already configured for specific Location in a specific Service
   * - Checklist configuration disabled in Admin Portal (Tenentwide config)
   * - IMPORTANT: Tenant-wide widget settings configured
   *               - Show checklist on confirmation page = unchecked/disabled
   * 
   * Test Flow:
   * 1. Navigate to appointment widget
   * 2. Select service category and specific service
   * 3. Search and select location
   * 4. Choose meeting preference (in-person)
   * 5. Select date and time slot
   * 6. Fill customer details and submit
   * 7. Verify booking confirmation
   * 8. Verify checklist link is NOT visible
   * 
   * Expected Results:
   * - Booking should be successfully created
   * - Confirmation page should display booking details
   * - Checklist link should NOT be visible when checklist configuration is disabled
   * - User should not see any checklist-related UI elements
   */
  test('OAC-20018-B Verify checklist not displayed when checklist configuration is disabled', { tag: ['@functional', '@checklist'] }, async ({ 
    page, 
    bookingData 
  }) => {
    // Extract test data from fixture
    const [bookingDataItem] = [bookingData];
    
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

    const selectedService = await servicePage.selectServiceFlow(bookingDataItem.service.category, bookingDataItem.service.name);

    await locationPage.searchAndSelectLocation(bookingDataItem.location.code, bookingDataItem.location.name);

    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingDataItem.dateTime);

    await personalDetailsPage.fillDetails(bookingDataItem.customer);
    await personalDetailsPage.submit();

    // Wait for confirmation page
    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected values
    bookingDataItem.dateTime.time = selectedDateTime.time;
    bookingDataItem.dateTime.date = selectedDateTime.date;
    bookingDataItem.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    // Verify booking details first
    const bookingVerified = await confirmationPage.verifyBooking(bookingDataItem);
    expect(bookingVerified).toBe(true);

    // Verify checklist link is NOT visible when checklist configuration is disabled
    const checklistLinkVisible = await confirmationPage.isChecklistLinkVisible();
    
    // Log warning if checklist is visible when it should be disabled
    if (checklistLinkVisible) {
      console.log('Checklist link is visible when it should be disabled');
      console.log('Possible configuration issue: check AC admin portal >> Administration >> Widget settings >> Show Appointment Checklist in Confirmation page checkbox should be unchecked');
    }

    expect(checklistLinkVisible).toBe(false);
  }); 
  
  
  

  test.afterEach(async ({}, testInfo) => {
  if (testInfo.title.includes('Personal Details Validation - Optional Configurations')) {
    try {
      // Clean and descriptive: Only update what you need
      const response = await adminService.updateConfigSetting({ 
        RequireCustomerEmail: true, 
        RequireCustomerPhone: true 
      });
      
      if (response.status() !== 200) console.error('Teardown Warning: Fail');
    } catch (error) {
      console.error('Teardown Error:', error);
    }
  }
});
});
