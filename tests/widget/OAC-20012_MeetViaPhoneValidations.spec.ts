import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { TestDataBuilder } from '../../src/utils/testDataBuilder';
import { DateUtils } from '../../src/utils/dateUtils';
import { MeetingPreference } from '../../src/pages/MeetingPreferencePage';
import { expect } from '@playwright/test';

/**
 * OAC-20012: Personal Details Validations Based on Selected Meeting Preference
 * 
 * Test Case: Verify PD validations adapt by meeting preference (phone mandatory for phone MP)
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
 * 4. Select phone meeting preference
 * 5. Select date and time slot
 * 6. Attempt to submit without phone number - expect validation error
 * 7. Fill phone number and submit successfully
 * 8. Verify booking confirmation displays entered phone number
 * 
 * Expected Results:
 * - Phone field becomes mandatory when phone meeting preference is selected
 * - Validation error displayed when phone number is missing
 * - Booking completes successfully with phone number
 * - Confirmation page displays the entered phone number
 */

test.describe('Personal Details Validations - OAC-20012', () => {
  test('Verify phone validation for phone meeting preference', { tag: ['@functional', '@validation'] }, async ({ page, multipleMPBookingData: bookingData }) => {
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

    // Step 2: Select active service, expecting navigation to the Location page
    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);
    expect(selectedService).toContain(bookingData.service.displayName);

    // Step 3: Select available location, expecting navigation to the Meeting Preference page
    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    // Navigate to meeting preference selection
    await meetingPreferencePage.waitForMeetingPreferencePage();
    
    // Check URL contains "meeting-preference"
    expect(page.url()).toContain('meeting-preference');
    
    // Verify multiple meeting preference options are displayed
    const availablePreferences = await meetingPreferencePage.getAvailableMeetingPreferences();
    expect(availablePreferences.length).toBeGreaterThan(1);
    
    // Verify phone meeting preference is available
    const isPhonePreferenceAvailable = await meetingPreferencePage.isMeetingPreferenceAvailable(MeetingPreference.PHONE_CALL);
    expect(isPhonePreferenceAvailable).toBe(true);

    // Step 10: Select phone meeting preference, expecting the phone field to become mandatory
    await meetingPreferencePage.selectPhone();
    await meetingPreferencePage.waitForMeetingPreferenceSelectionComplete();

    // Step 5: Select date and time slot
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);
    
    // Step 11: Attempt to submit without a phone number under phone meeting preference
    await personalDetailsPage.waitForPersonalDetailsPage();
    
    // Fill customer details but leave phone empty
    await personalDetailsPage.fillFirstName(bookingData.customer.firstName);
    await personalDetailsPage.fillLastName(bookingData.customer.lastName);
    await personalDetailsPage.fillEmail(bookingData.customer.email);
    
    // Ensure phone field is empty
    await personalDetailsPage.phoneInput.fill('');
    
    // Attempt to submit - should fail with phone validation error
    await personalDetailsPage.submit();
    
    // Step 11 (continued): Expect "Phone required validation error displayed"
    const phoneValidationErrors = await personalDetailsPage.getPhoneValidationErrorsComprehensive();
    expect(phoneValidationErrors.length).toBeGreaterThan(0);
    expect(phoneValidationErrors.some(error => 
      error.toLowerCase().includes('required') || error.toLowerCase().includes('phone')
    )).toBe(true);

    // Step 12: Add a phone number and submit successfully
    await personalDetailsPage.fillPhone(bookingData.customer.phone);
    
    // Verify form is properly filled
    const isFormValid = await personalDetailsPage.validateFormFilled({
      firstName: bookingData.customer.firstName,
      lastName: bookingData.customer.lastName,
      email: bookingData.customer.email,
      phone: bookingData.customer.phone
    });
    expect(isFormValid).toBe(true);
    
    // Submit the form
    await personalDetailsPage.submit();
    await personalDetailsPage.waitForSubmissionComplete();

    // Step 12 (continued): Expect the booking to complete and the entered phone number to be displayed in the confirmation
    await confirmationPage.waitForConfirmationPage();
    
    // Verify booking confirmation details
    const confirmationDetails = await confirmationPage.getConfirmationDetails();
    
    // Step 12 (final): Verify the entered phone number is displayed in the confirmation
    // Note: Confirmation page displays phone in either (xxx) xxx-xxxx or xxxxxxxxxx format
    const enteredPhoneDigits = bookingData.customer.phone.replace(/\D/g, '');
    const confirmationPhoneDigits = confirmationDetails.customerPhone?.replace(/\D/g, '') || '';
    
    // Debug logging if phone is not found
    if (!confirmationDetails.customerPhone) {
      console.log('Phone not found in confirmation. Available details:', confirmationDetails);
    }
    
    expect(confirmationPhoneDigits).toBe(enteredPhoneDigits);
    
    // Verify meeting preference is set to phone
    expect(confirmationDetails.meetingPreference).toBe(MeetingPreference.PHONE_CALL);
    
    // Verify phone appointment message is displayed
    const isPhoneAppointmentMessageDisplayed = await confirmationPage.verifyPhoneAppointmentMessageDisplayed();
    expect(isPhoneAppointmentMessageDisplayed).toBe(true);
    
  });
});
