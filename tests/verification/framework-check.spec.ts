import { test, expect } from '@playwright/test';

test.describe('Framework Verification', () => {
  test('Basic Playwright Test - Page Load', async ({ page }) => {
    console.log('🚀 Starting framework verification...');
    
    // Navigate to the widget URL
    await page.goto('https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=54745768');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Verify we're on the right page by checking for service categories
    const personalAccountsButton = page.getByRole('button', { name: 'Personal Accounts' });
    const speakWithDepartmentButton = page.getByRole('button', { name: 'Speak with a Department' });
    
    console.log('🔍 Looking for service category buttons...');
    
    // Verify service categories are visible
    await expect(personalAccountsButton).toBeVisible({ timeout: 10000 });
    await expect(speakWithDepartmentButton).toBeVisible({ timeout: 10000 });
    
    console.log('✅ Service categories found!');
    console.log(`✅ Personal Accounts button visible: ${await personalAccountsButton.isVisible()}`);
    console.log(`✅ Speak with a Department button visible: ${await speakWithDepartmentButton.isVisible()}`);
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/framework-verification.png' });
    console.log('📸 Screenshot saved to test-results/framework-verification.png');
  });

  test('API Client Test - Basic Request', async ({ request }) => {
    console.log('🌐 Testing API client...');
    
    // Test a simple API call to verify connectivity
    const response = await request.get('https://ac-qa.fmsidev.us/OacWeb/api/health');
    
    console.log(`📡 API Response status: ${response.status()}`);
    
    // We don't care about the specific response, just that we can connect
    expect(response.status()).toBeLessThan(500);
    
    console.log('✅ API connectivity verified!');
  });
});
