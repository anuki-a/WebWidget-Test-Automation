import { test, expect } from '@playwright/test';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { test as bookingTest } from '../../src/fixtures/bookingFixture';
import { BookingData } from '../../src/types/bookingTypes';

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
  let locationPage: LocationPage;
  let meetingPreferencePage: MeetingPreferencePage;
  let dateTimePage: DateTimePage;
  let personalDetailsPage: PersonalDetailsPage;
  let confirmationPage: ConfirmationPage;
  let languageSwitcher: LanguageSwitcher;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    servicePage = new ServicePage(page);
    locationPage = new LocationPage(page);
    meetingPreferencePage = new MeetingPreferencePage(page);
    dateTimePage = new DateTimePage(page);
    personalDetailsPage = new PersonalDetailsPage(page);
    confirmationPage = new ConfirmationPage(page);
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
    }

    // Verify page heading in Spanish
    const spanishHeading = page.getByRole('heading', { name: 'Elige un servicio' });
    await expect(spanishHeading).toBeVisible();

    // Verify footer in Spanish
    const spanishFooter = page.getByText('Desarrollado por FMSI');
    await expect(spanishFooter).toBeVisible();
  });

  bookingTest('should verify Spanish translations across all booking flow pages', async ({ 
    page, 
    spanishTranslationsBookingData 
  }) => {
    // Switch to Spanish first
    await languageSwitcher.switchToSpanish();
    
    // Define expected Spanish headings for each page
    const expectedSpanishHeadings = {
      service: 'Elige un servicio',
      location: 'Escoge un lugar',
      meetingPreference: 'Elija una preferencia de reunión',
      dateTime: 'Elige una fecha y hora',
      personalDetails: 'Detalles personales',
      confirmation: 'tu cita ha sido programada' // Partial match for confirmation page
    };

    // 1. Verify Service page heading
    const serviceHeading = page.getByRole('heading', { name: expectedSpanishHeadings.service });
    await expect(serviceHeading).toBeVisible();

    // Select a service to proceed using the service flow method
    const selectedService = await servicePage.selectServiceFlow(
      spanishTranslationsBookingData.service.category, 
      spanishTranslationsBookingData.service.name,
      true,
      false // Don't handle dialog automatically, we'll handle it manually in Spanish
    );
    
    // Handle Spanish skip appointment dialog if it appears
    await servicePage.handleSpanishSkipAppointmentDialog(true);

    // 2. Verify Location page heading
    const locationHeading = page.getByRole('heading', { name: expectedSpanishHeadings.location });
    await expect(locationHeading).toBeVisible();

    // Select first available location to proceed
    await locationPage.searchAndSelectLocationSpanish(spanishTranslationsBookingData.location.code, spanishTranslationsBookingData.location.name);

    // 3. Verify Meeting Preference page heading
    const meetingPreferenceHeading = page.getByRole('heading', { name: expectedSpanishHeadings.meetingPreference });
    await expect(meetingPreferenceHeading).toBeVisible();

    // Select in-person meeting to proceed (use Spanish method)
    await meetingPreferencePage.selectInPersonSpanish();

    // 4. Verify Date & Time page heading
    await dateTimePage.waitForDateTimePageSpanish();
    const dateTimeHeading = page.getByRole('heading', { name: expectedSpanishHeadings.dateTime });
    await expect(dateTimeHeading).toBeVisible();

    // Select a date and time to proceed (use Spanish method)
    const selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTimeSpanish(spanishTranslationsBookingData.dateTime);

    // 5. Verify Personal Details page heading
    const personalDetailsHeading = page.getByRole('heading', { name: expectedSpanishHeadings.personalDetails });
    await expect(personalDetailsHeading).toBeVisible();

    // Fill personal details to proceed using fixture data (use Spanish methods)
    await personalDetailsPage.fillFirstNameSpanish(spanishTranslationsBookingData.customer.firstName);
    await personalDetailsPage.fillLastNameSpanish(spanishTranslationsBookingData.customer.lastName);
    await personalDetailsPage.fillEmailSpanish(spanishTranslationsBookingData.customer.email);
    await personalDetailsPage.fillPhoneSpanish(spanishTranslationsBookingData.customer.phone);
    await personalDetailsPage.submitSpanish();

    // 6. Verify Confirmation page heading (partial match since it includes the user's name)
    const confirmationHeading = page.getByRole('heading', { name: expectedSpanishHeadings.confirmation });
    await expect(confirmationHeading).toBeVisible();
  });

 
});
