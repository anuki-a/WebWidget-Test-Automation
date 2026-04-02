import { Page, Locator } from '@playwright/test';
import { DateUtils, FormattedDate } from '../utils/dateUtils';

/**
 * Calendar component for date selection in the appointment widget.
 * Provides methods to select dates with proper waiting and validation.
 */
export class CalendarComponent {
  private page: Page;

  /**
   * Initialize the calendar component.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Select a specific date in the calendar.
   * @param date - Date to select
   * @returns Promise resolving when date is selected
   */
  async selectDate(date: Date): Promise<void> {
    const formattedDate = DateUtils.formatDateForUI(date);
    
    // Click on the date picker label (e.g., "Mar 5,")
    await this.page.getByLabel(formattedDate.datePickerLabel).getByRole('link', { 
      name: formattedDate.dayNumber.toString(), 
      exact: true 
    }).click();
    await this.page.waitForTimeout(10000);
  }

  /**
   * Select a specific date in the calendar (Spanish version).
   * @param date - Date to select
   * @returns Promise resolving when date is selected
   */
  async selectDateSpanish(date: Date): Promise<void> {
    const formattedDate = DateUtils.formatDateForUISpanish(date);
    // Click on the date picker label (e.g., "3 de abr. de 2026")
    await this.page.getByLabel(formattedDate.datePickerLabel, { exact: true }).getByRole('link', { 
      name: formattedDate.dayNumber.toString(), 
      exact: true 
    }).click();
  }

  /**
   * Select a given date (alias for selectDate method).
   * @param day - Date to select
   * @returns Promise resolving when date is selected
   */
  async selectDay(day: Date): Promise<void> {
    await this.selectDate(day);
  }

  /**
   * Select a future date by number of days ahead.
   * @param daysAhead - Number of days ahead to select
   * @returns Promise resolving when future date is selected
   */
  async selectFutureDate(daysAhead: number): Promise<void> {
    const futureDate = DateUtils.getFutureDate(daysAhead);
    await this.selectDate(futureDate);
  }

  /**
   * Get the currently selected date from the calendar.
   * @returns Promise resolving to the selected date
   */
  async getSelectedDate(): Promise<Date | null> {
    try {
      // Look for the selected date indicator (could be a class or attribute)
      const selectedDateElement = this.page.locator('.selected, [aria-selected="true"]').first();
      
      if (await selectedDateElement.isVisible()) {
        const dateText = await selectedDateElement.textContent();
        if (dateText) {
          const dayNumber = parseInt(dateText.trim());
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          
          return new Date(currentYear, currentMonth, dayNumber);
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Wait for the calendar to be visible and interactive.
   * @param timeout - Maximum time to wait
   * @returns Promise resolving when calendar is ready
   */
  async waitForCalendar(timeout: number = 10000): Promise<void> {
    // Try specific selectors first, then fallback
    await this.page.waitForSelector('[data-testid="calendar"], .calendar, .date-picker', {
      timeout,
      state: 'visible',
    }).catch(() => {
      return this.page.waitForSelector('[role="grid"], [role="table"]', {
        timeout,
        state: 'visible',
      });
    });
  }

  /**
   * Check if a specific date is disabled (past dates, holidays, etc.).
   * @param date - Date to check
   * @returns Promise resolving to true if date is disabled
   */
  async isDateDisabled(date: Date): Promise<boolean> {
    const formattedDate = DateUtils.formatDateForUI(date);
    
    try {
      const dateElement = this.page.getByLabel(formattedDate.datePickerLabel).getByRole('link', { 
        name: formattedDate.dayNumber.toString(), 
        exact: true 
      });
      
      // Check if element exists first
      const isVisible = await dateElement.isVisible();
      
      if (!isVisible) {
        return true; // Date not found in calendar, likely disabled/past
      }
      
      // Check if element is enabled - this is the key check for past dates
      const isEnabled = await dateElement.isEnabled();
      
      // Get additional attributes for debugging
      const classes = await dateElement.getAttribute('class') || '';
      const ariaDisabled = await dateElement.getAttribute('aria-disabled');
      const tabIndex = await dateElement.getAttribute('tabindex');
      
      // The primary check is whether the element is enabled
      // Past dates are visible but not enabled
      const isDisabled = !isEnabled || 
                        classes.includes('disabled') || 
                        classes.includes('past') || 
                        classes.includes('unavailable') ||
                        ariaDisabled === 'true' ||
                        tabIndex === '-1';
      
      return isDisabled;
    } catch (error) {
      return true; // Assume disabled if not found
    }
  }

  /**
   * Navigate to the next month in the calendar.
   * @returns Promise resolving when navigation is complete
   */
  async navigateToNextMonth(): Promise<void> {
    await this.page.getByRole('button', { name: /next|>/i }).click();
  }

  /**
   * Navigate to the previous month in the calendar.
   * @returns Promise resolving when navigation is complete
   */
  async navigateToPreviousMonth(): Promise<void> {
    await this.page.getByRole('button', { name: /previous|</i }).click();
  }

  /**
   * Get the currently displayed month and year.
   * @returns Promise resolving to month and year string
   */
  async getCurrentMonthYear(): Promise<string> {
    try {
      // Try to find the calendar header with month/year
      const monthYearElement = this.page.locator('.calendar-header, .month-year, [data-testid="month-year"]').first();
      
      if (await monthYearElement.isVisible()) {
        return await monthYearElement.textContent() || '';
      }

      // Try to find any element containing month and year
      const monthYearPattern = this.page.locator('text=/(January|February|March|April|May|June|July|August|September|October|November|December) \\d{4}/i').first();
      
      if (await monthYearPattern.isVisible()) {
        return await monthYearPattern.textContent() || '';
      }

      // Fallback: check the navigation buttons to infer current month
      const prevButton = this.page.getByRole('button', { name: /Go to \w+ \d{4}/i }).first();
      if (await prevButton.isVisible()) {
        const prevButtonText = await prevButton.textContent();
        return prevButtonText || '';
      }

      // Final fallback: try the original month element approach
      const monthElement = this.page.locator('text=/^(January|February|March|April|May|June|July|August|September|October|November|December)/i').first();
      
      if (await monthElement.isVisible()) {
        return await monthElement.textContent() || '';
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Select a date with retry logic for dynamic loading.
   * @param date - Date to select
   * @param maxRetries - Maximum number of retries
   * @param retryDelay - Delay between retries in milliseconds
   * @returns Promise resolving when date is selected
   */
  async selectDateWithRetry(date: Date, maxRetries: number = 3, retryDelay: number = 1000): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.selectDate(date);
        
        // Verify selection worked
        const selected = await this.getSelectedDate();
        if (selected && selected.toDateString() === date.toDateString()) {
          return; // Success
        }
        
        if (attempt < maxRetries) {
          await this.page.waitForTimeout(retryDelay);
        }
      } catch (error) {
        if (attempt === maxRetries) {
          throw error; // Final attempt failed
        }
        await this.page.waitForTimeout(retryDelay);
      }
    }
    
    throw new Error(`Failed to select date after ${maxRetries} attempts: ${date.toDateString()}`);
  }

  /**
   * Find and select the first available date from today.
   * @param maxDaysToSearch - Maximum number of days to search ahead
   * @returns Promise resolving to the selected date or null if no available date found
   */
  async selectFirstAvailableDate(maxDaysToSearch: number = 30): Promise<Date | null> {
    for (let daysAhead = 0; daysAhead <= maxDaysToSearch; daysAhead++) {
      const testDate = DateUtils.getFutureDate(daysAhead);
      
      const isDisabled = await this.isDateDisabled(testDate);
      if (!isDisabled) {
        await this.selectDate(testDate);
        return testDate; // Found available date
      }
    }
    
    return null; // No dates available
  }
}
