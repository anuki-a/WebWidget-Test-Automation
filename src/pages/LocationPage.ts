import { Page, Locator, expect } from '@playwright/test';

/**
 * Location page for selecting appointment locations.
 * Handles location selection after service selection in the booking flow.
 */
export class LocationPage {
  private page: Page;

  /**
   * Initialize the location page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the location page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForLocationPage(timeout: number = 30000): Promise<void> {
    // Wait for location buttons to be visible
    await this.page.waitForSelector('[data-testid="location"], .location, button:has-text("2093")', {
      timeout,
      state: 'visible',
    }).catch(() => {
      // Fallback: wait for any button with location indicators
      return this.page.waitForSelector('button:has-text("McKinney"), button:has-text("Dallas")', {
        timeout,
        state: 'visible',
      });
    });
  }

  /**
   * Select a location by name.
   * @param locationName - Name of the location to select
   * @returns Promise resolving when location is selected
   */
  async selectLocation(locationName: string): Promise<void> {
    await this.waitForLocationPage();
    
    const locationButton = this.page.getByRole('button', { name: locationName });
    await expect(locationButton).toBeVisible();
    await locationButton.click();
  }

  /**
   * Get all available locations.
   * @returns Promise resolving to array of location names
   */
  async getAvailableLocations(): Promise<string[]> {
    await this.waitForLocationPage();
    
    const locationButtons = this.page.locator('button').filter({ hasText: /^(McKinney|Dallas|Plano|Frisco|Allen)/ });
    const locations: string[] = [];
    
    const count = await locationButtons.count();
    for (let i = 0; i < count; i++) {
      const text = await locationButtons.nth(i).textContent();
      if (text) {
        locations.push(text.trim());
      }
    }
    
    return locations;
  }

  /**
   * Select the first available location.
   * @returns Promise resolving to the selected location name
   */
  async selectFirstAvailableLocation(): Promise<string> {
    const locations = await this.getAvailableLocations();
    
    if (locations.length === 0) {
      throw new Error('No available locations found');
    }
    
    const firstLocation = locations[0];
    if (!firstLocation) {
      throw new Error('First location is undefined');
    }
    
    await this.selectLocation(firstLocation);
    
    return firstLocation;
  }

  /**
   * Check if a specific location is available.
   * @param locationName - Location name to check
   * @returns Promise resolving to true if location is available
   */
  async isLocationAvailable(locationName: string): Promise<boolean> {
    try {
      const locationButton = this.page.getByRole('button', { name: locationName });
      return await locationButton.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify that the location page is properly loaded.
   * @returns Promise resolving to true if page is loaded correctly
   */
  async verifyLocationPageLoaded(): Promise<boolean> {
    try {
      await this.waitForLocationPage(10000);
      const locations = await this.getAvailableLocations();
      return locations.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Search for a location using code and select it by name.
   * @param locationCode - Location code to search for (e.g., "72052")
   * @param locationName - Location name to select (e.g., "CUSO")
   * @returns Promise resolving to the selected location name
   */
  async searchAndSelectLocation(locationCode: string, locationName: string): Promise<string> {
    
    // Get the search textbox
    const searchBox = this.page.getByRole("textbox", {
      name: "Enter city and state, or ZIP",
    });
    const mileText = this.page.getByText("mile");

    // Wait for search box to be visible
    await expect(searchBox).toBeVisible();
    await expect(mileText.first()).toBeVisible({ timeout: 10000 });

    // Clear any existing text and enter location code
    await searchBox.clear();
    await searchBox.fill(locationCode);
    await searchBox.press('Enter');
    
    // Wait for search results to load
    await this.page.waitForTimeout(1000);
    
    // Find the location button with the specified name
    const locationButton = this.page.getByRole('button', { name: locationName });
    
    // Wait for the button to be visible
    await expect(locationButton).toBeVisible({ timeout: 5000 }).catch(() => {
      throw new Error(`Location "${locationName}" not found after searching for code "${locationCode}"`);
    });
    
    // Click the location button
    await locationButton.click();
    
    return locationName;
  }

  /**
   * Wait for location selection to complete and next step to load.
   * @param timeout - Maximum time to wait
   */
  async waitForLocationSelectionComplete(timeout: number = 30000): Promise<void> {
    // Wait for either meeting preference page or next step to appear
    await this.page.waitForSelector('[data-testid="meeting-preference"], button:has-text("Meet in Person"), button:has-text("Virtual")', {
      timeout,
      state: 'visible',
    }).catch(() => {
      // Fallback: wait for calendar or date picker
      return this.page.waitForSelector('[data-testid="calendar"], .calendar, [data-testid="date-picker"]', {
        timeout,
        state: 'visible',
      });
    });
  }
}
