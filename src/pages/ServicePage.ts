import { Page, Locator, expect } from '@playwright/test';

/**
 * Service page for selecting service categories and specific services.
 * Handles the initial service selection step in the appointment booking flow.
 */
export class ServicePage {
  private page: Page;

  // Header locators
  languageSelector: Locator;
  closeButton: Locator;
  poweredByFMSI: Locator;

  // Progress navigation locators
  serviceStep: Locator;
  locationStep: Locator;
  meetingPreferenceStep: Locator;
  dateTimeStep: Locator;
  personalDetailsStep: Locator;
  confirmationStep: Locator;

  // Main content locators
  pageHeading: Locator;
  serviceCategoriesContainer: Locator;

  // Service category buttons
  personalAccountsButton: Locator;
  businessAccountsButton: Locator;
  estateAccountsButton: Locator;
  speakWithDepartmentButton: Locator;
  notaryServicesButton: Locator;
  safeDepositButton: Locator;
  otherFinancialNeedsButton: Locator;

  // Dynamic service category locators
  serviceCategoryButtons: Locator;
  expandedCategory: Locator;

  // Personal Accounts services
  updatePersonalAccountLink: Locator;
  updatePersonalAccountWithSpanishSpeakerLink: Locator;

  // Business and Specialized Accounts services
  updateBusinessAccountLink: Locator;
  updateBusinessAccountWithSpanishSpeakerLink: Locator;

  // Estate Accounts services
  estateAccountsLink: Locator;

  // Speak with a Department services
  fraudRwGEditLink: Locator;
  iraAccountLink: Locator;

  // Notary and Medallion Services
  notaryServiceLink: Locator;

  // Safe Deposit services
  safeDepositAccessLink: Locator;

  // Other Financial Needs services
  onlineBankingAssistanceLink: Locator;


  /**
   * Initialize the service page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize header locators
    this.languageSelector = this.page.locator('select[aria-label="Select Language"]');
    this.closeButton = this.page.getByRole('button', { name: 'close' });
    this.poweredByFMSI = this.page.getByText('Powered by FMSI');

    // Initialize progress navigation locators
    this.serviceStep = this.page.getByRole('link', { name: 'Service' });
    this.locationStep = this.page.getByRole('link', { name: 'Location' });
    this.meetingPreferenceStep = this.page.getByRole('link', { name: 'Meeting Preference' });
    this.dateTimeStep = this.page.getByRole('link', { name: 'Date and Time' });
    this.personalDetailsStep = this.page.getByRole('link', { name: 'Personal Details' });
    this.confirmationStep = this.page.getByRole('link', { name: 'Confirmation' });

    // Initialize main content locators
    this.pageHeading = this.page.getByRole('heading', { name: 'Select a Service' });
    this.serviceCategoriesContainer = this.page.locator('div').filter({ has: this.page.getByRole('heading', { name: 'Select a Service' }) }).locator('div').nth(1);

    // Initialize service category buttons
    this.personalAccountsButton = this.page.getByRole('button', { name: 'Personal Accounts' });
    this.businessAccountsButton = this.page.getByRole('button', { name: 'Business and Specialized Accounts' });
    this.estateAccountsButton = this.page.getByRole('button', { name: 'Estate Accounts' });
    this.speakWithDepartmentButton = this.page.getByRole('button', { name: 'Speak with a Department' });
    this.notaryServicesButton = this.page.getByRole('button', { name: 'Notary and Medallion Services' });
    this.safeDepositButton = this.page.getByRole('button', { name: 'Safe Deposit' });
    this.otherFinancialNeedsButton = this.page.getByRole('button', { name: 'Other Financial Needs' });

    // Initialize dynamic service category locators
    this.serviceCategoryButtons = this.page.locator('button').filter({ hasText: /^(Personal|Business|Estate|Speak|Notary|Safe|Other)/ });
    this.expandedCategory = this.page.locator('button[expanded][active]');

    // Initialize Personal Accounts services
    this.updatePersonalAccountLink = this.page.getByRole('link', { name: 'Update Personal Account' });
    this.updatePersonalAccountWithSpanishSpeakerLink = this.page.getByRole('link', { name: 'Update Personal Account with Spanish Speaker' });

    // Initialize Business and Specialized Accounts services
    this.updateBusinessAccountLink = this.page.getByRole('link', { name: 'Update Business Account' });
    this.updateBusinessAccountWithSpanishSpeakerLink = this.page.getByRole('link', { name: 'Update Business Account with Spanish Speaker' });

    // Initialize Estate Accounts services
    this.estateAccountsLink = this.page.getByRole('link', { name: 'Estate Accounts' });

    // Initialize Speak with a Department services
    this.fraudRwGEditLink = this.page.getByRole('link', { name: 'Fraud RwG Edit' });
    this.iraAccountLink = this.page.getByRole('link', { name: 'IRA (Individual Retirement Account)' });

    // Initialize Notary and Medallion Services
    this.notaryServiceLink = this.page.getByRole('link', { name: 'Notary' });

    // Initialize Safe Deposit services
    this.safeDepositAccessLink = this.page.getByRole('link', { name: 'Safe Deposit Access' });

    // Initialize Other Financial Needs services
    this.onlineBankingAssistanceLink = this.page.getByRole('link', { name: 'Online Banking Assistance' });


  }

  /**
   * Wait for the service page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForServicePage(timeout: number = 30000): Promise<void> {
    // Wait for service categories to be visible using defined locators
    await this.serviceCategoryButtons.first().waitFor({ state: 'visible', timeout }).catch(() => {
      // Fallback: wait for page heading
      return this.pageHeading.waitFor({ state: 'visible', timeout });
    });
  }

  /**
   * Select a service category by name.
   * @param categoryName - Name of the service category to select
   * @returns Promise resolving when category is selected
   */
  async selectServiceCategory(categoryName: string): Promise<void> {
    let categoryButton;
    
    // Use specific category buttons when possible
    switch (categoryName) {
      case 'Personal Accounts':
        categoryButton = this.personalAccountsButton;
        break;
      case 'Business and Specialized Accounts':
        categoryButton = this.businessAccountsButton;
        break;
      case 'Estate Accounts':
        categoryButton = this.estateAccountsButton;
        break;
      case 'Speak with a Department':
        categoryButton = this.speakWithDepartmentButton;
        break;
      case 'Notary and Medallion Services':
        categoryButton = this.notaryServicesButton;
        break;
      case 'Safe Deposit':
        categoryButton = this.safeDepositButton;
        break;
      case 'Other Financial Needs':
        categoryButton = this.otherFinancialNeedsButton;
        break;
      default:
        categoryButton = this.page.getByRole('button', { name: categoryName });
    }
    
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();
  }

  /**
   * Select a specific service by name.
   * @param serviceName - Name of the service to select
   * @returns Promise resolving when service is selected
   */
  async selectService(serviceName: string): Promise<void> {
    let serviceLink;
    
    // Use specific service locators when possible
    switch (serviceName) {
      case 'Update Personal Account':
        serviceLink = this.updatePersonalAccountLink;
        break;
      case 'Update Personal Account with Spanish Speaker':
        serviceLink = this.updatePersonalAccountWithSpanishSpeakerLink;
        break;
      case 'Update Business Account':
        serviceLink = this.updateBusinessAccountLink;
        break;
      case 'Update Business Account with Spanish Speaker':
        serviceLink = this.updateBusinessAccountWithSpanishSpeakerLink;
        break;
      case 'Estate Accounts':
        serviceLink = this.estateAccountsLink;
        break;
      case 'Fraud RwG Edit':
        serviceLink = this.fraudRwGEditLink;
        break;
      case 'IRA (Individual Retirement Account)':
        serviceLink = this.iraAccountLink;
        break;
      case 'Notary':
        serviceLink = this.notaryServiceLink;
        break;
      case 'Safe Deposit Access':
        serviceLink = this.safeDepositAccessLink;
        break;
      case 'Online Banking Assistance':
        serviceLink = this.onlineBankingAssistanceLink;
        break;
      default:
        serviceLink = this.page.getByRole('link', { name: serviceName });
    }
    
    await expect(serviceLink).toBeVisible();
    await serviceLink.click();
  }

  /**
   * Handle the online application dialog if it appears.
   * @param continueWithScheduling - Whether to continue with scheduling (true) or handle online application
   * @returns Promise resolving when dialog is handled
   */
  async handleSkipAppointmentDialog(continueWithScheduling: boolean = true): Promise<void> {
      // Wait for the dialog to appear (timeout is short since it may not appear)
      const dialogText = "skipping the wait";
      const dialog = this.page.getByText(dialogText, { exact: false });

      await dialog.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
        // We catch the error internally so the test doesn't fail if it's missing
      });

      const dialogButton = continueWithScheduling 
        ? this.page.getByRole('button', { name: 'NO, CONTINUE WITH SCHEDULING AN APPOINTMENT' })
        : this.page.getByRole('button', { name: 'YES, SKIP THE WAIT' });

      if (await dialog.isVisible()) {
        await dialogButton.click();
      }
  }

  /**
   * Handle the Spanish online application dialog if it appears.
   * @param continueWithScheduling - Whether to continue with scheduling (true) or handle online application
   * @returns Promise resolving when dialog is handled
   */
  async handleSpanishSkipAppointmentDialog(continueWithScheduling: boolean = true): Promise<void> {
      // Wait for the Spanish dialog to appear (timeout is short since it may not appear)
      const spanishDialogText = "¡Buenas Noticias! Usted puede aplicar en linea ahora, saltando la espera";
      const dialog = this.page.getByText(spanishDialogText, { exact: false });

      await dialog.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
        // We catch the error internally so the test doesn't fail if it's missing
      });

      const dialogButton = continueWithScheduling 
        ? this.page.getByRole('button', { name: 'No, continuar con la planificación de una cita' })
        : this.page.getByRole('button', { name: 'Sí, omitir la espera' });

      if (await dialog.isVisible()) {
        await dialogButton.click();
      }
  }

  /**
   * Get the skip appointment dialog element.
   * @returns Promise resolving to the dialog locator or null if not visible
   */
  async getSkipAppointmentDialog(): Promise<Locator | null> {
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      return dialog;
    }
    return null;
  }

  /**
   * Verify skip popup message and buttons.
   * @param serviceName - Service name expected in dialog title
   * @returns Promise resolving to true if popup is properly displayed
   */
  async verifySkipPopup(serviceName: string): Promise<boolean> {
    const dialog = await this.getSkipAppointmentDialog();
    if (!dialog) return false;

    try {
      // Verify dialog title
      await expect(dialog.getByRole('heading', { name: serviceName })).toBeVisible();
      
      // Verify popup message
      const message = this.page.getByText('Good news! You can apply online right now, skipping the wait, in just a few minutes.');
      await expect(message).toBeVisible();
      
      // Verify both buttons
      const noButton = this.page.getByRole('button', { name: 'No, continue with scheduling an appointment' });
      const yesButton = this.page.getByRole('button', { name: 'Yes, Skip the wait' });
      await expect(noButton).toBeVisible();
      await expect(yesButton).toBeVisible();
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click "Yes, Skip the wait" button on skip popup.
   * @returns Promise resolving when button is clicked
   */
  async clickSkipWaitYesButton(): Promise<void> {
    const yesButton = this.page.getByRole('button', { name: 'Yes, Skip the wait' });
    await expect(yesButton).toBeVisible();
    await yesButton.click();
  }

  /**
   * Click "No, continue with scheduling an appointment" button on skip popup.
   * @returns Promise resolving when button is clicked
   */
  async clickSkipWaitNoButton(): Promise<void> {
    const noButton = this.page.getByRole('button', { name: 'No, continue with scheduling an appointment' });
    await expect(noButton).toBeVisible();
    await noButton.click();
  }

  /**
   * Get all available service categories.
   * @returns Promise resolving to array of category names
   */
  async getAvailableServiceCategories(): Promise<string[]> {
    await this.waitForServicePage();
    
    // Use the defined serviceCategoryButtons locator
    const categoryButtons = this.serviceCategoryButtons;
    const categories: string[] = [];
    
    const count = await categoryButtons.count();
    for (let i = 0; i < count; i++) {
      const text = await categoryButtons.nth(i).textContent();
      if (text) {
        categories.push(text.trim());
      }
    }
    
    return categories;
  }

  /**
   * Get all available services within the selected category.
   * @returns Promise resolving to array of service names
   */
  async getAvailableServices(): Promise<string[]> {
    // Wait for services to load after category selection
    await this.expandedCategory.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      // Fallback: wait for any service links to be visible
      return this.page.locator('a[href="javascript:void(0)"]').first().waitFor({ state: 'visible', timeout: 10000 });
    });

    // Get visible service links within expanded categories
    const jsVoidLinks = this.page.locator('a[href="javascript:void(0)"]');
    const services: string[] = [];
    
    const count = await jsVoidLinks.count();
    for (let i = 0; i < count; i++) {
      const link = jsVoidLinks.nth(i);
      const isVisible = await link.isVisible();
      
      if (isVisible) {
        const text = await link.textContent();
        if (text) {
          // Extract service name (remove time indicator)
          const serviceName = text.replace(/\d+\s*Mins.*/, '').trim();
          if (serviceName) {
            services.push(serviceName);
          }
        }
      }
    }
    
    return services;
  }

  /**
   * Select the first available service.
   * @returns Promise resolving to the selected service name
   */
  async selectFirstAvailableService(): Promise<string> {
    const services = await this.getAvailableServices();
    
    if (services.length === 0) {
      throw new Error('No available services found');
    }
    
    const firstService = services[0];
    if (!firstService) {
      throw new Error('First service is undefined');
    }
    
    await this.selectService(firstService);
    
    return firstService;
  }

  /**
   * Complete the service selection flow.
   * @param categoryName - Service category name
   * @param serviceName - Specific service name (optional, will select first if not provided)
   * @param continueWithScheduling - Whether to continue with scheduling when online application dialog appears
   * @param handleSkipDialog - Whether to automatically handle the skip appointment dialog (default: true)
   * @returns Promise resolving to the selected service name
   */
  async selectServiceFlow(
    categoryName: string, 
    serviceName?: string,
    continueWithScheduling: boolean = true,
    handleSkipDialog: boolean = true
  ): Promise<string> {
    // Select service category
    await this.selectServiceCategory(categoryName);
    
    // Select specific service or first available
    const selectedService = serviceName || await this.selectFirstAvailableService();
    await this.selectService(selectedService);
    
    // Handle online application dialog if it appears and handling is enabled
    if (handleSkipDialog) {
      await this.handleSkipAppointmentDialog(continueWithScheduling);
    }

    return selectedService;
  }

  /**
   * Verify that the service page is properly loaded.
   * @returns Promise resolving to true if page is loaded correctly
   */
  async verifyServicePageLoaded(): Promise<boolean> {
    try {
      await this.waitForServicePage(10000);
      const categories = await this.getAvailableServiceCategories();
      return categories.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a specific service category is available.
   * @param categoryName - Category name to check
   * @returns Promise resolving to true if category is available
   */
  async isServiceCategoryAvailable(categoryName: string): Promise<boolean> {
    try {
      let categoryButton;
      
      // Use specific category buttons when possible
      switch (categoryName) {
        case 'Personal Accounts':
          categoryButton = this.personalAccountsButton;
          break;
        case 'Business and Specialized Accounts':
          categoryButton = this.businessAccountsButton;
          break;
        case 'Estate Accounts':
          categoryButton = this.estateAccountsButton;
          break;
        case 'Speak with a Department':
          categoryButton = this.speakWithDepartmentButton;
          break;
        case 'Notary and Medallion Services':
          categoryButton = this.notaryServicesButton;
          break;
        case 'Safe Deposit':
          categoryButton = this.safeDepositButton;
          break;
        case 'Other Financial Needs':
          categoryButton = this.otherFinancialNeedsButton;
          break;
        default:
          categoryButton = this.page.getByRole('button', { name: categoryName });
      }
      
      return await categoryButton.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a specific service is available.
   * @param serviceName - Service name to check
   * @returns Promise resolving to true if service is available
   */
  async isServiceAvailable(serviceName: string): Promise<boolean> {
    try {
      let serviceLink;
      
      // Use specific service locators when possible
      switch (serviceName) {
        case 'Update Personal Account':
          serviceLink = this.updatePersonalAccountLink;
          break;
        case 'Update Personal Account with Spanish Speaker':
          serviceLink = this.updatePersonalAccountWithSpanishSpeakerLink;
          break;
        case 'Update Business Account':
          serviceLink = this.updateBusinessAccountLink;
          break;
        case 'Update Business Account with Spanish Speaker':
          serviceLink = this.updateBusinessAccountWithSpanishSpeakerLink;
          break;
        case 'Estate Accounts':
          serviceLink = this.estateAccountsLink;
          break;
        case 'Fraud RwG Edit':
          serviceLink = this.fraudRwGEditLink;
          break;
        case 'IRA (Individual Retirement Account)':
          serviceLink = this.iraAccountLink;
          break;
        case 'Notary':
          serviceLink = this.notaryServiceLink;
          break;
        case 'Safe Deposit Access':
          serviceLink = this.safeDepositAccessLink;
          break;
        case 'Online Banking Assistance':
          serviceLink = this.onlineBankingAssistanceLink;
          break;
        default:
          serviceLink = this.page.getByRole('link', { name: serviceName });
      }
      
      return await serviceLink.isVisible();
    } catch (error) {
      return false;
    }
  }
}
