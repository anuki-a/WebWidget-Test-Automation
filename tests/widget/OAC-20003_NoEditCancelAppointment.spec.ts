import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';

/**
 * OAC-20003: Attempt Edit on Non-Editable Appointment (Desktop, Functional)
 * 
 * Test Case: Verify non-editable/cancel-disabled appointment shows proper disabled UI and no actions
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through notAllowedEditCancelData fixture
 * - All page objects available and functional
 * 
 * Test Flow:
 * 1. Complete happy path booking flow
 * 2. Verify confirmation page displayed
 * 3. Check edit controls/buttons not visible
 * 4. Check cancel button disabled
 * 5. Check non-editable message displayed
 * 6. Attempt to interact with controls (should fail)
 * 
 * Expected Results:
 * - No editable buttons visible
 * - No cancellation button clickable
 * - Non-editable flow enforced
 */
test.describe('Appointment Booking - OAC-20003', () => {
  test('Verify non-editable appointment shows proper disabled UI and no actions', { tag: ['@functional', '@non-editable'] }, async ({ page, notAllowedEditCancelData }) => {
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

    const selectedService = await servicePage.selectServiceFlow(notAllowedEditCancelData.service.category, notAllowedEditCancelData.service.name);

    await locationPage.searchAndSelectLocation(notAllowedEditCancelData.location.code, notAllowedEditCancelData.location.name);

    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(notAllowedEditCancelData.dateTime);

    await personalDetailsPage.fillDetails(notAllowedEditCancelData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected values
    notAllowedEditCancelData.dateTime.time = selectedDateTime.time;
    notAllowedEditCancelData.dateTime.date = selectedDateTime.date;
    notAllowedEditCancelData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    // Step 1: Appointment Confirmation Page displayed
    await expect(confirmationPage.confirmationHeading).toBeVisible();
    
    // Step 2: Check edit controls/buttons not visible
    const noEditControls = await confirmationPage.verifyNoEditControlsVisible();
    expect(noEditControls).toBe(true);
    
    // Step 3: Check Cancel button disabled
    const cancelDisabled = await confirmationPage.verifyCancelButtonDisabled();
    expect(cancelDisabled).toBe(true);
    
    // Step 4: Check non-editable message displayed
    const nonEditableMessageDisplayed = await confirmationPage.verifyNonEditableMessageDisplayed();
    expect(nonEditableMessageDisplayed).toBe(true);
    
    // Step 5: Attempt to interact with controls (should fail)
    const controlsNotInteractive = await confirmationPage.verifyEditControlsNotInteractive();
    expect(controlsNotInteractive).toBe(true);
    
    // Additional comprehensive verification
    const isNonEditableState = await confirmationPage.verifyNonEditableState();
    expect(isNonEditableState).toBe(true);
  });
});
