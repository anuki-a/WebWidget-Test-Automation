import { test, expect } from '@playwright/test';
import { ServicePage } from '../../src/pages/ServicePage';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';

/**
 * OAC-20017: Verify Widget Spanish Language Translations Load Properly
 * 
 * This test verifies Spanish localization is loaded and displayed across widget pages.
 * Test Steps:
 * 1. Open widget default language (English)
 * 2. Change language to Spanish from top bar dropdown
 * 3. Check navigation bar for Spanish text on the 6 labels
 */
test.describe('OAC-20017: Spanish Language Translations', () => {
  let servicePage: ServicePage;
  let languageSwitcher: LanguageSwitcher;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    servicePage = new ServicePage(page);
    languageSwitcher = new LanguageSwitcher(page);

    // Navigate to widget URL
    await page.goto(process.env.BASE_URL || 'https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=user_a_0001');
    
    // Wait for service page to load
    await servicePage.waitForServicePage();
  });

  test('should verify Spanish navigation labels individually', async ({ page }) => {
    // Switch to Spanish first
    await languageSwitcher.switchToSpanish();
    
    // Verify each navigation label individually with detailed assertions
    const expectedSpanishLabels = [
      { name: 'Servicio', english: 'Service' },
      { name: 'Sitio', english: 'Location' },
      { name: 'Preferencia de reunión', english: 'Meeting Preference' },
      { name: 'Fecha y hora', english: 'Date and Time' },
      { name: 'Detalles personales', english: 'Personal Details' },
      { name: 'Confirmación', english: 'Confirmation' }
    ];

    for (const label of expectedSpanishLabels) {
      const element = page.getByRole('link', { name: label.name });
      await expect(element).toBeVisible();
      console.log(`Verified Spanish label: "${label.name}" (English: "${label.english}")`);
    }

    // Verify page heading in Spanish
    const spanishHeading = page.getByRole('heading', { name: 'Elige un servicio' });
    await expect(spanishHeading).toBeVisible();
    console.log('Verified Spanish page heading: "Elige un servicio"');

    // Verify footer in Spanish
    const spanishFooter = page.getByText('Desarrollado por FMSI');
    await expect(spanishFooter).toBeVisible();
    console.log('Verified Spanish footer: "Desarrollado por FMSI"');
  });

 
});
