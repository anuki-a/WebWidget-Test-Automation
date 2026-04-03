import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';
import { urlCodes } from '../../src/types/bookingTypes';

/**
 * OAC-20019: Verify URL Parameters `loc` and `svc` in Widget
 * 
 * Test Case: Verify that the widget correctly skips service/location pages when `loc` and `svc` 
 * URL query parameters are provided, and that the selections persist. Also checks for graceful 
 * handling of invalid parameters.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Test data provisioned through urlCodeHandlingData fixture
 * - Valid locCode and svcCode available in test data
 * 
 * Test Flow:
 * 1. Navigate with both valid loc and svc parameters
 * 2. Verify service and location pages are skipped
 * 3. Navigate with only valid loc parameter
 * 4. Verify only location page is skipped
 * 5. Navigate with only valid svc parameter
 * 6. Verify only service page is skipped
 * 7. Navigate with invalid parameters
 * 8. Verify graceful handling and fallback to normal flow
 * 
 * Expected Results:
 * - Valid loc parameter skips location selection page
 * - Valid svc parameter skips service selection page
 * - Both parameters skip both pages and go directly to meeting preference
 * - Invalid parameters fall back to normal flow gracefully
 * - Selected values persist throughout the booking process
 */
test.describe('URL Parameters Handling - OAC-20019', () => {

  test('Navigate with both valid loc and svc parameters - skip both pages', { tag: ['@smoke', '@url-parameters'] }, async ({ page, urlCodeHandlingData }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // Construct URL with both loc and svc parameters
    const baseUrl = process.env.BASE_URL!;
    const urlWithParams = `${baseUrl}&${urlCodes.LOCATION_URL_CODE}=${urlCodeHandlingData.location.locCode}&${urlCodes.SERVICE_URL_CODE}=${urlCodeHandlingData.service.svcCode}`;
    console.log('URL with params:', urlWithParams);
    await page.goto(urlWithParams);

    // Should go directly to meeting preference page (both service and location pages skipped)
    await meetingPreferencePage.waitForMeetingPreferencePage();
    
    // Verify we're on meeting preference page and not service/location pages
    await expect(page.getByText('Select a Meeting Preference')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Meet in Person' })).toBeVisible();
    
    // Verify service and location pages are not displayed
    await expect(servicePage.pageHeading).not.toBeVisible();
    await expect(page.getByText('Select a Location')).not.toBeVisible();

    // Continue with booking flow to verify selections persist
    await meetingPreferencePage.selectInPerson();

    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(urlCodeHandlingData.dateTime);

    await personalDetailsPage.fillDetails(urlCodeHandlingData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    // Update booking data with actual selected date/time
    urlCodeHandlingData.dateTime.time = selectedDateTime.time;
    urlCodeHandlingData.dateTime.date = selectedDateTime.date;
    urlCodeHandlingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    // Verify booking contains the pre-selected service and location from URL parameters
    const isVerified = await confirmationPage.verifyBooking(urlCodeHandlingData);
    expect(isVerified).toBe(true);
  });

  test('Navigate with only valid loc parameter - skip location page only', { tag: ['@functional', '@url-parameters'] }, async ({ page, urlCodeHandlingData }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);

    // Construct URL with only loc parameter
    const baseUrl = process.env.BASE_URL!;
    const urlWithParams = `${baseUrl}&${urlCodes.LOCATION_URL_CODE}=${urlCodeHandlingData.location.locCode}`;
    console.log('URL with params:', urlWithParams);
    
    await page.goto(urlWithParams);

    // Should go to service page (location page skipped)
    await servicePage.waitForServicePage();
    
    // Verify we're on service page and location page is not displayed
    await expect(servicePage.pageHeading).toBeVisible();

    // Select service to continue flow
    await servicePage.selectServiceFlow(urlCodeHandlingData.service.category, urlCodeHandlingData.service.name);

    // Should go directly to meeting preference page
    await meetingPreferencePage.waitForMeetingPreferencePage();

    // Verify we're NOT in location page(Location Page Skipped) 
    await expect(page.getByText('Select a Location')).not.toBeVisible();
   
    // Should go directly to meeting preference page
    await expect(page.getByText('Select a Meeting Preference')).toBeVisible();
  });

  test('Navigate with only valid svc parameter - skip service page only', { tag: ['@functional', '@url-parameters'] }, async ({ page, urlCodeHandlingData }) => {
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);

    // Construct URL with only svc parameter
    const baseUrl = process.env.BASE_URL!;
    const urlWithParams = `${baseUrl}&${urlCodes.SERVICE_URL_CODE}=${urlCodeHandlingData.service.svcCode}`;
    console.log('URL with params:', urlWithParams);
    await page.goto(urlWithParams);

    // Should go to location page (service page skipped)
    await locationPage.waitForLocationPage();
    
    // Verify we're on location page and service page is not displayed
    await expect(page.getByText('Select a Location')).toBeVisible();
    await expect(servicePage.pageHeading).not.toBeVisible();

    // Select location to continue flow
    await locationPage.searchAndSelectLocation(urlCodeHandlingData.location.code, urlCodeHandlingData.location.name);

    // Should go directly to meeting preference page (service already selected)
    await meetingPreferencePage.waitForMeetingPreferencePage();
    await expect(page.getByText('Select a Meeting Preference')).toBeVisible();
  });
});
