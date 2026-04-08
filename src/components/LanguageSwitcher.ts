import { Page, Locator, expect } from '@playwright/test';

/**
 * Language switcher component for handling widget language changes.
 * Provides methods to switch languages and verify language-specific text.
 */
export class LanguageSwitcher {
  private page: Page;

  // Language selector locators
  languageSelector: Locator;
  englishOption: Locator;
  spanishOption: Locator;

  // Navigation bar locators for verification
  serviceNavigation: Locator;
  locationNavigation: Locator;
  meetingPreferenceNavigation: Locator;
  dateTimeNavigation: Locator;
  personalDetailsNavigation: Locator;
  confirmationNavigation: Locator;

  // Page heading locator
  pageHeading: Locator;

  // Footer locator
  poweredByFMSI: Locator;

  /**
   * Initialize the language switcher component.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize language selector locators
    this.languageSelector = this.page.locator('select[aria-label="Select Language"]');
    this.englishOption = this.page.getByRole('option', { name: 'English' });
    this.spanishOption = this.page.getByRole('option', { name: 'Spanish' });

    // Initialize navigation bar locators (English)
    this.serviceNavigation = this.page.getByRole('link', { name: 'Service' });
    this.locationNavigation = this.page.getByRole('link', { name: 'Location' });
    this.meetingPreferenceNavigation = this.page.getByRole('link', { name: 'Meeting Preference' });
    this.dateTimeNavigation = this.page.getByRole('link', { name: 'Date and Time' });
    this.personalDetailsNavigation = this.page.getByRole('link', { name: 'Personal Details' });
    this.confirmationNavigation = this.page.getByRole('link', { name: 'Confirmation' });

    // Initialize page heading locator
    this.pageHeading = this.page.getByRole('heading', { name: 'Select a Service' });

    // Initialize footer locator
    this.poweredByFMSI = this.page.getByText('Powered by FMSI');
  }

  /**
   * Switch language to Spanish.
   * @returns Promise resolving when language is switched to Spanish
   */
  async switchToSpanish(): Promise<void> {
    await expect(this.languageSelector).toBeVisible();
    await this.languageSelector.selectOption('Spanish');
    
    // Wait for language change to take effect
    await this.page.waitForTimeout(1000);
  }

  /**
   * Switch language to English.
   * @returns Promise resolving when language is switched to English
   */
  async switchToEnglish(): Promise<void> {
    await expect(this.languageSelector).toBeVisible();
    await this.languageSelector.selectOption('English');
    
    // Wait for language change to take effect
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get the currently selected language option.
   * @returns Promise resolving to the selected language text
   */
  async getCurrentLanguage(): Promise<string> {
    const selectedOption = this.languageSelector.locator('option[selected]');
    return await selectedOption.textContent() || '';
  }

  /**
   * Verify Spanish navigation labels are displayed.
   * @returns Promise resolving to true if all Spanish labels are visible
   */
  async verifySpanishNavigationLabels(): Promise<boolean> {
    try {
      // Spanish navigation labels
      const spanishLabels = {
        service: 'Servicio',
        location: 'Sitio',
        meetingPreference: 'Preferencia de reunión',
        dateTime: 'Fecha y hora',
        personalDetails: 'Detalles personales',
        confirmation: 'Confirmación'
      };

      // Verify each Spanish label is visible
      for (const [key, spanishText] of Object.entries(spanishLabels)) {
        const element = this.page.getByRole('link', { name: spanishText });
        await expect(element).toBeVisible({ timeout: 5000 });
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify English navigation labels are displayed.
   * @returns Promise resolving to true if all English labels are visible
   */
  async verifyEnglishNavigationLabels(): Promise<boolean> {
    try {
      // Verify each English label is visible
      await expect(this.serviceNavigation).toBeVisible({ timeout: 5000 });
      await expect(this.locationNavigation).toBeVisible({ timeout: 5000 });
      await expect(this.meetingPreferenceNavigation).toBeVisible({ timeout: 5000 });
      await expect(this.dateTimeNavigation).toBeVisible({ timeout: 5000 });
      await expect(this.personalDetailsNavigation).toBeVisible({ timeout: 5000 });
      await expect(this.confirmationNavigation).toBeVisible({ timeout: 5000 });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify Spanish page heading is displayed.
   * @returns Promise resolving to true if Spanish heading is visible
   */
  async verifySpanishPageHeading(): Promise<boolean> {
    try {
      const spanishHeading = this.page.getByRole('heading', { name: 'Elige un servicio' });
      await expect(spanishHeading).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify English page heading is displayed.
   * @returns Promise resolving to true if English heading is visible
   */
  async verifyEnglishPageHeading(): Promise<boolean> {
    try {
      await expect(this.pageHeading).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify Spanish footer text is displayed.
   * @returns Promise resolving to true if Spanish footer is visible
   */
  async verifySpanishFooter(): Promise<boolean> {
    try {
      const spanishFooter = this.page.getByText('Desarrollado por FMSI');
      await expect(spanishFooter).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify English footer text is displayed.
   * @returns Promise resolving to true if English footer is visible
   */
  async verifyEnglishFooter(): Promise<boolean> {
    try {
      await expect(this.poweredByFMSI).toBeVisible({ timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all Spanish navigation label texts.
   * @returns Promise resolving to array of Spanish label texts
   */
  async getSpanishNavigationLabels(): Promise<string[]> {
    const labels = [
      'Servicio',
      'Sitio', 
      'Preferencia de reunión',
      'Fecha y hora',
      'Detalles personales',
      'Confirmación'
    ];

    const visibleLabels: string[] = [];
    
    for (const label of labels) {
      const element = this.page.getByRole('link', { name: label });
      if (await element.isVisible()) {
        visibleLabels.push(label);
      }
    }

    return visibleLabels;
  }

  /**
   * Get all English navigation label texts.
   * @returns Promise resolving to array of English label texts
   */
  async getEnglishNavigationLabels(): Promise<string[]> {
    const labels = [
      'Service',
      'Location',
      'Meeting Preference', 
      'Date and Time',
      'Personal Details',
      'Confirmation'
    ];

    const visibleLabels: string[] = [];
    
    for (const label of labels) {
      const element = this.page.getByRole('link', { name: label });
      if (await element.isVisible()) {
        visibleLabels.push(label);
      }
    }

    return visibleLabels;
  }

  /**
   * Complete verification of Spanish language UI.
   * @returns Promise resolving to true if all Spanish elements are properly displayed
   */
  async verifyCompleteSpanishUI(): Promise<boolean> {
    try {
      const isSpanishSelected = (await this.getCurrentLanguage()).includes('Español');
      const hasSpanishNavigation = await this.verifySpanishNavigationLabels();
      const hasSpanishHeading = await this.verifySpanishPageHeading();
      const hasSpanishFooter = await this.verifySpanishFooter();

      return isSpanishSelected && hasSpanishNavigation && hasSpanishHeading && hasSpanishFooter;
    } catch (error) {
      return false;
    }
  }

  /**
   * Complete verification of English language UI.
   * @returns Promise resolving to true if all English elements are properly displayed
   */
  async verifyCompleteEnglishUI(): Promise<boolean> {
    try {
      const isEnglishSelected = (await this.getCurrentLanguage()).includes('English');
      const hasEnglishNavigation = await this.verifyEnglishNavigationLabels();
      const hasEnglishHeading = await this.verifyEnglishPageHeading();
      const hasEnglishFooter = await this.verifyEnglishFooter();

      return isEnglishSelected && hasEnglishNavigation && hasEnglishHeading && hasEnglishFooter;
    } catch (error) {
      return false;
    }
  }
}
