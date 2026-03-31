import { Page, Locator, expect } from '@playwright/test';

/**
 * Meeting preference options for appointment booking.
 */
export enum MeetingPreference {
  IN_PERSON = 'Meet in Person',
  VIRTUAL = 'Virtual',
  PHONE_CALL = 'Meet via Phone Call'
}

/**
 * Meeting preference page for selecting how the appointment will be conducted.
 * Handles in-person, virtual, and phone meeting preferences.
 */
export class MeetingPreferencePage {
  private page: Page;

  /**
   * Initialize the meeting preference page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the meeting preference page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForMeetingPreferencePage(timeout: number = 30000): Promise<void> {
    // First, check for the page title "Select a Meeting Preference"
    await expect(this.page.getByText("Select a Meeting Preference")).toBeVisible({
      timeout,
    }).catch(() => {
      // Fallback: if title not found, check for meeting preference buttons
      return this.page.waitForSelector('[data-testid="meeting-preference"], button:has-text("Meet in Person"), button:has-text("Virtual")', {
        timeout,
        state: 'visible',
      });
    });
  }

  /**
   * Select a meeting preference.
   * @param preference - Meeting preference from MeetingPreference enum
   * @returns Promise resolving when preference is selected
   */
  async selectMeetingPreference(preference: MeetingPreference): Promise<void> {
    await this.waitForMeetingPreferencePage();
    
    const preferenceButton = this.page.getByRole('button', { name: preference });
    await expect(preferenceButton).toBeVisible();
    await preferenceButton.click();
  }

  /**
   * Get all available meeting preferences.
   * @returns Promise resolving to array of available preference names
   */
  async getAvailableMeetingPreferences(): Promise<string[]> {
    await this.waitForMeetingPreferencePage();
    
    const preferenceButtons = this.page.getByRole('button', { name: /Meet*/, exact: false });
    const preferences: string[] = [];
    
    const count = await preferenceButtons.count();
    for (let i = 0; i < count; i++) {
      const text = await preferenceButtons.nth(i).textContent();
      if (text) {
        preferences.push(text.trim());
      }
    }
    
    return preferences;
  }

  /**
   * Select in-person meeting preference.
   * @returns Promise resolving when preference is selected
   */
  async selectInPerson(): Promise<void> {
    await this.selectMeetingPreference(MeetingPreference.IN_PERSON);
  }

  /**
   * Select virtual meeting preference.
   * @returns Promise resolving when preference is selected
   */
  async selectVirtual(): Promise<void> {
    await this.selectMeetingPreference(MeetingPreference.VIRTUAL);
  }

  /**
   * Select phone meeting preference.
   * @returns Promise resolving when preference is selected
   */
  async selectPhone(): Promise<void> {
    await this.selectMeetingPreference(MeetingPreference.PHONE_CALL);
  }

  /**
   * Check if a specific meeting preference is available.
   * @param preference - Meeting preference to check
   * @returns Promise resolving to true if preference is available
   */
  async isMeetingPreferenceAvailable(preference: MeetingPreference): Promise<boolean> {
    try {
      const preferenceButton = this.page.getByRole('button', { name: preference });
      return await preferenceButton.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify that the meeting preference page is properly loaded.
   * @returns Promise resolving to true if page is loaded correctly
   */
  async verifyMeetingPreferencePageLoaded(): Promise<boolean> {
    try {
      await this.waitForMeetingPreferencePage(10000);
      const preferences = await this.getAvailableMeetingPreferences();
      return preferences.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if meeting preferences are skipped (not shown).
   * @returns Promise resolving to true if meeting preferences are skipped
   */
  async isMeetingPreferenceSkipped(): Promise<boolean> {
    const timeout = 5000;
    await this.page.waitForTimeout(timeout);
    try {
      // If "Select a Date and Time" is visible but "Select a Meeting Preference" is not, they're skipped
      const calendarVisible = await this.page.getByText("Select a Date and Time").isVisible({ timeout });
      const preferencesVisible = await this.page.getByText("Select a Meeting Preference").isVisible({ timeout });
      
      return calendarVisible && !preferencesVisible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for meeting preference selection to complete and next step to load.
   * @param timeout - Maximum time to wait
   */
  async waitForMeetingPreferenceSelectionComplete(timeout: number = 30000): Promise<void> {
    // Wait for "Select a Date and Time" text to appear
    await this.page.waitForSelector('text=Select a Date and Time', {
      timeout,
      state: 'visible',
    });
  }
}
