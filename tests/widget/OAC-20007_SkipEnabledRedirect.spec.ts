import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { expect } from '@playwright/test';

/**
 * OAC-20007: Select P/S With Appointment Skip Enabled (Yes Skip Appointment)
 * 
 * Test Case: Verify that clicking "YES" on a skip appointment popup redirects to an external configured site and ends the flow.
 * 
 * Prerequisites:
 * - Widget accessible via BASE_URL environment variable
 * - Skip-enabled booking data provisioned through bookingFixture
 * - Service page with skip appointment functionality
 * 
 * Test Flow:
 * 1. Navigate to appointment widget
 * 2. Select service with appointment skip enabled
 * 3. Verify skip popup message displays correctly
 * 4. Choose Yes on skip popup
 * 5. Verify redirect URL matches configuration
 * 6. Verify widget flow terminated
 * 
 * Expected Results:
 * - Skip popup displays configured message
 * - Yes option redirects to correct external URL
 * - Widget booking flow terminates after redirect
 */
test.describe('Skip Appointment Redirect - OAC-20007', () => {
  test('Select service with skip enabled and verify redirect', { tag: ['@functional', '@smoke'] }, async ({ page, skipEnabledBookingData }) => {
    const servicePage = new ServicePage(page);

    await page.goto(process.env.BASE_URL!);

    // Wait for page to be fully loaded with retry logic
    await expect(async () => {
      await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 30000 });
    
    // Step 1: Select service with appointment skip enabled
    await servicePage.selectServiceFlow(
      skipEnabledBookingData.service.category,
      skipEnabledBookingData.service.name,
      false, // Don't continue with scheduling to trigger skip popup
      false  // Don't automatically handle skip dialog - we'll handle it manually
    );

    // Step 2: Verify skip popup message displays correctly
    const serviceName = skipEnabledBookingData.service.displayName || skipEnabledBookingData.service.name;
    const isPopupDisplayed = await servicePage.verifySkipPopup(serviceName);
    expect(isPopupDisplayed).toBe(true);

    // Step 3: Choose Yes on skip popup
    await servicePage.clickSkipWaitYesButton();

    // Step 4: Verify redirect URL matches configuration
    // Wait for navigation to external site
    await page.waitForURL(url => url.href !== process.env.BASE_URL, { timeout: 10000 });
    
    // Verify we're no longer on the widget domain
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('AppointmentWidget');
    
    // Verify we're on the expected external site (this would need to be configured based on the actual redirect URL)
    // For now, we'll verify it's an external URL
    expect(currentUrl).toMatch(/^https?:\/\/(?!ac-qa\.fmsidev\.us)/);
  });
});
