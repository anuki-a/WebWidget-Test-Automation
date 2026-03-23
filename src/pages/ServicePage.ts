import { Page, Locator, expect } from '@playwright/test';

/**
 * Service page for selecting service categories and specific services.
 * Handles the initial service selection step in the appointment booking flow.
 */
export class ServicePage {
  private page: Page;

  /**
   * Initialize the service page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the service page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForServicePage(timeout: number = 30000): Promise<void> {
    // Wait for service categories to be visible
    await this.page.waitForSelector('[data-testid="service-category"], .service-category', {
      timeout,
      state: 'visible',
    }).catch(() => {
      // Fallback: wait for any button with service category names
      return this.page.waitForSelector('button:has-text("Personal Accounts"), button:has-text("Business Services")', {
        timeout,
        state: 'visible',
      });
    });
  }

  /**
   * Select a service category by name.
   * @param categoryName - Name of the service category to select
   * @returns Promise resolving when category is selected
   */
  async selectServiceCategory(categoryName: string): Promise<void> {
    const categoryButton = this.page.getByRole('button', { name: categoryName });
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();
  }

  /**
   * Select a specific service by name.
   * @param serviceName - Name of the service to select
   * @returns Promise resolving when service is selected
   */
  async selectService(serviceName: string): Promise<void> {
    // Look for service as a link or button
    const serviceLink = this.page.getByRole('link', { name: serviceName });
    await expect(serviceLink.first()).toBeVisible();
    await serviceLink.first().click();
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
   * Get all available service categories.
   * @returns Promise resolving to array of category names
   */
  async getAvailableServiceCategories(): Promise<string[]> {
    await this.waitForServicePage();
    
    const categoryButtons = this.page.locator('button').filter({ hasText: /^(Personal|Business|Mortgage|Investment|Insurance)/ });
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
    await this.page.waitForSelector('[data-testid="service"], .service, a[href*="service"]', {
      timeout: 10000,
      state: 'visible',
    }).catch(() => {
      // Fallback: wait for any links with time indicators
      return this.page.waitForSelector('a:has-text("")', {
        timeout: 10000,
        state: 'visible',
      });
    });

    const serviceLinks = this.page.locator('a').filter({ hasText: /\d+\s*minutes?|\d+\s*min/ });
    const services: string[] = [];
    
    const count = await serviceLinks.count();
    for (let i = 0; i < count; i++) {
      const text = await serviceLinks.nth(i).textContent();
      if (text) {
        // Extract service name (remove time indicator)
        const serviceName = text.replace(/\s*\s*\d+\s*minutes?/i, '').trim();
        if (serviceName) {
          services.push(serviceName);
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
   * @returns Promise resolving to the selected service name
   */
  async selectServiceFlow(
    categoryName: string, 
    serviceName?: string,
    continueWithScheduling: boolean = true
  ): Promise<string> {
    // Select service category
    await this.selectServiceCategory(categoryName);
    
    // Select specific service or first available
    const selectedService = serviceName || await this.selectFirstAvailableService();
    await this.selectService(selectedService);
    
    // Handle online application dialog if it appears
    await this.handleSkipAppointmentDialog(continueWithScheduling);

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
      const categoryButton = this.page.getByRole('button', { name: categoryName });
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
      const serviceElement = this.page.getByRole('link', { name: serviceName })
        .or(this.page.getByRole('button', { name: serviceName }));
      
      return await serviceElement.first().isVisible();
    } catch (error) {
      return false;
    }
  }
}
