import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { expect } from '@playwright/test';
import { AdminService } from '@/api/AdminService';
import { ApiClient } from '@/api/apiClient';

/**
 * OAC-20009-B: Personal Details Validation for Phone/Email Mandatory Configurations
 * 
 * Test Case: Verify email/phone required behavior based on Admin Portal widget settings
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through personalDetailsMandatory fixture
 * - All page objects available and functional
 * 
 * Test Flow (Steps 1-6 implemented):
 * 1. Navigate to appointment widget
 * 2. Select service category and specific service
 * 3. Search and select location
 * 4. Choose meeting preference (in-person)
 * 5. Select date and time slot
 * 6. Navigate to Personal Details page
 * 
 * Expected Results:
 * - Successfully reach Personal Details page
 * - All booking data properly selected and confirmed
 */
test.describe('Personal Details Validation - OAC-20009-B', () => {
  let adminService: AdminService;

  test.beforeEach(async ({ request }) => {
    adminService = new AdminService(new ApiClient(request));
  });
  
  
  test('Navigate to Personal Details page with mandatory email/phone config', { tag: ['@validation', '@mandatory'] }, async ({ page, personalDetailsMandatory }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);

    // Step 1: Open web widget URL
    await page.goto(process.env.BASE_URL!);

    // Wait for page to be fully loaded with retry logic
    await expect(async () => {
      await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 30000 });
    
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    // Step 2: Select active service
    const selectedService = await servicePage.selectServiceFlow(personalDetailsMandatory.service.category, personalDetailsMandatory.service.name);

    // Step 3: Select available location
    await locationPage.searchAndSelectLocation(personalDetailsMandatory.location.code, personalDetailsMandatory.location.name);

    // Step 4: Select meeting preference
    await meetingPreferencePage.selectInPerson();

    // Step 5: Select available future date and time slot
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(personalDetailsMandatory.dateTime);

    // Step 6: Select time slot and proceed - should navigate to Personal Details page
    await personalDetailsPage.waitForPersonalDetailsPage();
    
    // Verify we've successfully reached the Personal Details page
    await expect(personalDetailsPage.personalDetailsHeading).toBeVisible();
    await expect(personalDetailsPage.firstNameInput).toBeVisible();
    await expect(personalDetailsPage.lastNameInput).toBeVisible();
    await expect(personalDetailsPage.emailInput).toBeVisible();
    await expect(personalDetailsPage.phoneInput).toBeVisible();
    await expect(personalDetailsPage.bookAppointmentButton).toBeVisible();

    console.log('Successfully navigated to Personal Details page');
    console.log('Selected service:', selectedService);
    console.log('Selected date/time:', selectedDateTime);
    console.log('Location:', personalDetailsMandatory.location.name);
    console.log('Meeting preference:', personalDetailsMandatory.meetingPreference.displayName);
    
    // Step 7: Leave both email, phone number blank and click 'book appointment'
    // Expected: Submission not allowed. validation messages shown 'Email is required','Phone.No is required'
    const blankFieldsResult = await personalDetailsPage.validateBlankEmailPhoneFields(personalDetailsMandatory.customer);
    
    console.log('Step 7 - Blank fields validation:');
    console.log('Email errors:', blankFieldsResult.emailErrors);
    console.log('Phone errors:', blankFieldsResult.phoneErrors);
    
    // Verify both email and phone are required
    expect(blankFieldsResult.emailErrors.some(error => error.toLowerCase().includes('required') || error.toLowerCase().includes('email'))).toBeTruthy();
    expect(blankFieldsResult.phoneErrors.some(error => error.toLowerCase().includes('required') || error.toLowerCase().includes('phone'))).toBeTruthy();
    
    // Step 8: Invalid email and valid phone and click 'book appointment'
    // Expected: Email format blocked
    const invalidEmailErrors = await personalDetailsPage.validateInvalidEmailFormat(personalDetailsMandatory.customer, 'invalid-email-format');
    
    console.log('Step 8 - Invalid email validation:', invalidEmailErrors);
    
    // Verify email format is blocked
    expect(invalidEmailErrors.some(error => 
      error.toLowerCase().includes('invalid') || 
      error.toLowerCase().includes('valid') || 
      error.toLowerCase().includes('format')
    )).toBeTruthy();
    
    // Step 9: Invalid phone and valid email and click 'book appointment'
    // Expected: Phone format blocked
    const invalidPhoneErrors = await personalDetailsPage.validateInvalidPhoneFormat(personalDetailsMandatory.customer, 'invalid-phone-format');
    
    console.log('Step 9 - Invalid phone validation:', invalidPhoneErrors);
    
    // Verify phone format is blocked
    expect(invalidPhoneErrors.some(error => 
      error.toLowerCase().includes('invalid') || 
      error.toLowerCase().includes('valid') || 
      error.toLowerCase().includes('format')
    )).toBeTruthy();
    
    // Step 10: Provide valid value for email and click 'book appointment'
    // Expected: Submission not allowed. validation messages shown 'Phone.No is required'
    const phoneRequiredErrors = await personalDetailsPage.validateValidEmailMissingPhone(personalDetailsMandatory.customer);
    
    console.log('Step 10 - Phone required validation:', phoneRequiredErrors);
    
    // Verify phone is still required
    expect(phoneRequiredErrors.some(error => 
      error.toLowerCase().includes('required') || 
      error.toLowerCase().includes('phone')
    )).toBeTruthy();
    
    // Step 11: Provide valid value for phone and click 'book appointment'
    // Expected: Submission not allowed. validation messages shown 'Email is required'
    const emailRequiredErrors = await personalDetailsPage.validateValidPhoneMissingEmail(personalDetailsMandatory.customer);
    
    console.log('Step 11 - Email required validation:', emailRequiredErrors);
    
    // Verify email is still required
    expect(emailRequiredErrors.some(error => 
      error.toLowerCase().includes('required') || 
      error.toLowerCase().includes('email')
    )).toBeTruthy();
    
    // Step 12: Provide valid values and click 'book appointment'
    // Expected: Submission allowed, Navigated to Confirmation Page
    await personalDetailsPage.submitWithValidDetails(personalDetailsMandatory.customer);
    
    console.log('Step 12 - Successful submission with valid email and phone');
    console.log('All validation scenarios completed successfully!');
  });


  test.afterEach(async ({}, testInfo) => {
  if (testInfo.title.includes('Navigate to Personal Details page')) {
    try {
      // Works for any field! Example: turning off SMS and requirements
      await adminService.updateConfigSetting({ 
        RequireCustomerEmail: false, 
        RequireCustomerPhone: false,
        SmsEnabled: false 
      });
    } catch (error) {
      console.error('Teardown Error:', error);
    }
  }
});
});
