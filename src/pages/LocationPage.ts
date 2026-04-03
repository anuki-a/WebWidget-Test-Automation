import { Page, Locator, expect } from '@playwright/test';

/**
 * Location page for selecting appointment locations.
 * Handles location selection after service selection in the booking flow.
 */
export class LocationPage {
  private page: Page;

  // Locators for location page elements
  readonly searchTextBox: Locator;
  readonly locationsDropdown: Locator;
  readonly distanceSlider: Locator;
  readonly locationButtons: Locator;
  readonly mapRegion: Locator;
  readonly locationList: Locator;

  // Spanish locators
  readonly searchTextBoxSpanish: Locator;
  readonly locationsDropdownSpanish: Locator;

  /**
   * Initialize the location page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.searchTextBox = page.getByRole('textbox', { name: 'Enter city and state, or ZIP Code' });
    this.locationsDropdown = page.getByRole('combobox', { name: 'Locations' });
    this.distanceSlider = page.getByRole('slider');
    this.locationButtons = page.locator('button').filter({ hasText: /\b(TX|Texas)\b|\b\d{5}\b/ });
    this.mapRegion = page.getByRole('region', { name: 'map' });
    this.locationList = page.locator('[data-testid="location-list"], .location-list');

    // Initialize Spanish locators
    this.searchTextBoxSpanish = page.getByRole('textbox', { name: 'Ingrese ciudad y estado, o código postal' });
    this.locationsDropdownSpanish = page.getByRole('combobox', { name: 'Sitios' });
  }

  /**
   * Wait for the location page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForLocationPage(timeout: number = 30000): Promise<void> {
    try {
      // First wait for any network activity to settle
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        // Ignore networkidle timeout and continue
      });
      
      // Wait for location buttons to be visible
      await expect(this.locationButtons.first()).toBeVisible({
        timeout,
      }).catch(() => {
        // Fallback 1: wait for search textbox as indicator of page load
        return expect(this.searchTextBox).toBeVisible({ timeout });
      }).catch(() => {
        // Fallback 2: wait for the location page header
        return this.page.getByRole('heading', { name: 'Select a Location' }).waitFor({ state: 'visible', timeout: 10000 });
      }).catch(() => {
        // Fallback 3: wait for any location-related text
        return this.page.getByText('Select a Location').waitFor({ state: 'visible', timeout: 10000 });
      });
    } catch (error) {
      // If all waits fail, throw a descriptive error
      throw new Error(`Location page failed to load within ${timeout}ms. Last error: ${error}`);
    }
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
    
    // Use a more reliable selector for location buttons
    const locationButtons = this.page.locator('button').filter({ hasText: /\b(TX|Texas)\b|\b\d{5}\b/ });
    const locations: string[] = [];
    
    const count = await locationButtons.count();
    for (let i = 0; i < count; i++) {
      const text = await locationButtons.nth(i).textContent();
      if (text) {
        // Extract just the location name (first line before the address)
        const locationName = text.split('\n')[0]?.trim();
        if (locationName && !locations.includes(locationName)) {
          locations.push(locationName);
        }
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
    
    // Use the search textbox locator
    const mileText = this.page.getByText("mile");

    // Wait for search box to be visible
    await expect(this.searchTextBox).toBeVisible();
    await expect(mileText.first()).toBeVisible({ timeout: 10000 });

    // Clear any existing text and enter location code
    await this.searchTextBox.clear();
    await this.searchTextBox.fill(locationCode);
    await this.searchTextBox.press('Enter');
    
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
   * Search for a location using code and select it by name (Spanish version).
   * @param locationCode - Location code to search for (e.g., "72052")
   * @param locationName - Location name to select (e.g., "CUSO")
   * @returns Promise resolving to the selected location name
   */
  async searchAndSelectLocationSpanish(locationCode: string, locationName: string): Promise<string> {
    
    // Use the Spanish search textbox locator
    const mileText = this.page.getByText("milla");

    // Wait for search box to be visible
    await expect(this.searchTextBoxSpanish).toBeVisible();
    await expect(mileText.first()).toBeVisible({ timeout: 10000 });

    // Clear any existing text and enter location code
    await this.searchTextBoxSpanish.clear();
    await this.searchTextBoxSpanish.fill(locationCode);
    await this.searchTextBoxSpanish.press('Enter');
    
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

  /**
   * Wait for location selection to complete and next step to load (Spanish version).
   * @param timeout - Maximum time to wait
   */
  async waitForLocationSelectionCompleteSpanish(timeout: number = 30000): Promise<void> {
    // Wait for either meeting preference page or next step to appear in Spanish
    await this.page.waitForSelector('[data-testid="meeting-preference"], button:has-text("Conocer en persona"), button:has-text("Virtual")', {
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

  /**
   * Set the number of locations to display.
   * @param count - Number of locations to display (5, 10, 15, 25, or 50)
   */
  async setLocationsCount(count: number): Promise<void> {
    await expect(this.locationsDropdown).toBeVisible();
    await this.locationsDropdown.selectOption(count.toString());
  }

  /**
   * Set the number of locations to display (Spanish version).
   * @param count - Number of locations to display (5, 10, 15, 25, or 50)
   */
  async setLocationsCountSpanish(count: number): Promise<void> {
    await expect(this.locationsDropdownSpanish).toBeVisible();
    await this.locationsDropdownSpanish.selectOption(`${count} Sitios`);
  }

  /**
   * Set the distance radius for location search.
   * @param miles - Distance in miles (1-100)
   */
  async setDistanceRadius(miles: number): Promise<void> {
    await expect(this.distanceSlider).toBeVisible();
    await this.distanceSlider.fill(miles.toString());
  }

  /**
   * Get the current distance radius value.
   * @returns Promise resolving to the current distance in miles
   */
  async getDistanceRadius(): Promise<number> {
    await expect(this.distanceSlider).toBeVisible();
    const value = await this.distanceSlider.inputValue();
    return parseInt(value, 10);
  }

  /**
   * Check if the map is visible.
   * @returns Promise resolving to true if map is visible
   */
  async isMapVisible(): Promise<boolean> {
    return await this.mapRegion.isVisible();
  }

  /**
   * Select a location by its index in the list.
   * @param index - Zero-based index of the location to select
   * @returns Promise resolving to the selected location name
   */
  async selectLocationByIndex(index: number): Promise<string> {
    await this.waitForLocationPage();
    
    const count = await this.locationButtons.count();
    if (index >= count) {
      throw new Error(`Index ${index} is out of range. Only ${count} locations available.`);
    }
    
    const locationButton = this.locationButtons.nth(index);
    const locationName = await locationButton.textContent();
    
    if (!locationName) {
      throw new Error(`Location at index ${index} has no text content.`);
    }
    
    await locationButton.click();
    return locationName.trim();
  }
}
