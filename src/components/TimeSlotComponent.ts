import { Page, Locator, expect } from '@playwright/test';
import { DateUtils } from '../utils/dateUtils';

/**
 * Interface for available time slot information.
 */
export interface TimeSlot {
  time: string;
  hours: number;
  minutes: number;
  isAvailable: boolean;
  element?: Locator;
}

/**
 * Time slot component for selecting appointment times.
 * Provides methods to find and select available time slots with proper waiting.
 */
export class TimeSlotComponent {
  private page: Page;

  /**
   * Initialize the time slot component.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Select the first available time slot.
   * @param timeout - Maximum time to wait for time slots to load
   * @returns Promise resolving to the selected time string
   */
  async selectFirstAvailableSlot(timeout: number = 120000): Promise<string> {
    let selectedTime = '';
    
    // Use async retry pattern from the happy path test
    await expect(async () => {
      // First try to find explicitly available slots
      let availableTimeLocator = this.page
        .locator('div, span, a, button') // Check all common clickable tags
        .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ }) // Matches exact time format like "6:15 AM"
        .filter({ hasNot: this.page.locator('.disabled, [disabled], .grayed-out, .unavailable') }) // Exclude typical disabled classes
        .first();
      
      // If no explicitly available slots found, try any time slot that's clickable
      const count = await availableTimeLocator.count();
      if (count === 0) {
        availableTimeLocator = this.page
          .locator('div, span, a, button') // Check all common clickable tags
          .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ }) // Matches exact time format like "6:15 AM"
          .first();
      }
      
      await expect(availableTimeLocator).toBeVisible({ timeout: 5000 });
      selectedTime = (await availableTimeLocator.innerText()).trim();
      await availableTimeLocator.click();
    }).toPass({ 
      timeout: timeout, // Total time to keep trying (2 minute)
    });

    return selectedTime;
  }

  /**
   * Get all available time slots for the current date.
   * @param timeout - Maximum time to wait for time slots to load
   * @returns Promise resolving to array of available time slots
   */
  async getAvailableTimeSlots(timeout: number = 30000): Promise<TimeSlot[]> {
    await this.waitForTimeSlots(timeout);
    
    const timeSlots: TimeSlot[] = [];
    
    // Find all elements with time format
    const timeElements = this.page
      .locator('div, span, a, button')
      .filter({ hasText: /^(?:\d{1,2}:\d{2}\s(?:AM|PM))$/ });
    
    const count = await timeElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = timeElements.nth(i);
      const timeText = await element.textContent();
      
      if (timeText) {
        const isDisabled = await this.isTimeSlotDisabled(element);
        const parsedTime = DateUtils.parseTimeString(timeText.trim());
        
        timeSlots.push({
          time: timeText.trim(),
          hours: parsedTime.hours,
          minutes: parsedTime.minutes,
          isAvailable: !isDisabled,
          element,
        });
      }
    }
    
    return timeSlots;
  }

  /**
   * Select a specific time slot by time string.
   * @param timeString - Time string to select (e.g., "6:15 AM")
   * @param timeout - Maximum time to wait
   * @returns Promise resolving when time slot is selected
   */
  async selectTimeSlot(timeString: string, timeout: number = 30000): Promise<void> {
    await this.waitForTimeSlots(timeout);
    
    const timeElement = this.page
      .locator('div, span, a, button')
      .filter({ hasText: timeString })
      .first();
    
    if (await timeElement.isVisible()) {
      await timeElement.click();
    } else {
      throw new Error(`Time slot "${timeString}" not found or not visible`);
    }
  }

  /**
   * Select a time slot by hour and minute.
   * @param hours - Hours in 24-hour format
   * @param minutes - Minutes
   * @param timeout - Maximum time to wait
   * @returns Promise resolving when time slot is selected
   */
  async selectTimeSlotByTime(hours: number, minutes: number, timeout: number = 30000): Promise<void> {
    const timeString = DateUtils.formatTime(hours, minutes);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    const displayTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    
    await this.selectTimeSlot(displayTime, timeout);
  }

  /**
   * Check if a time slot is disabled.
   * @param timeElement - Element representing the time slot
   * @returns Promise resolving to true if time slot is disabled
   */
  async isTimeSlotDisabled(timeElement: Locator): Promise<boolean> {
    try {
      const classes = await timeElement.getAttribute('class') || '';
      const ariaDisabled = await timeElement.getAttribute('aria-disabled');
      const disabled = await timeElement.isDisabled();
      
      return disabled || 
             ariaDisabled === 'true' ||
             classes.includes('disabled') || 
             classes.includes('unavailable') ||
             classes.includes('grayed-out');
    } catch (error) {
      return true; // Assume disabled if we can't check
    }
  }

  /**
   * Wait for time slots to be visible and loaded.
   * @param timeout - Maximum time to wait
   * @returns Promise resolving when time slots are loaded
   */
  async waitForTimeSlots(timeout: number = 30000): Promise<void> {
    // Wait for any time slot element to be visible
    await this.page.waitForSelector('text=/\\d{1,2}:\\d{2}\\s*(AM|PM)/i', {
      timeout,
      state: 'visible',
    });
  }

  /**
   * Get the currently selected time slot.
   * @returns Promise resolving to the selected time string or null
   */
  async getSelectedTimeSlot(): Promise<string | null> {
    try {
      const selectedElement = this.page.locator('.selected, [aria-selected="true"], .active').first();
      
      if (await selectedElement.isVisible()) {
        return await selectedElement.textContent();
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find the next available time slot after a specific time.
   * @param afterHours - Hours in 24-hour format
   * @param afterMinutes - Minutes
   * @returns Promise resolving to the next available time slot or null
   */
  async findNextAvailableSlot(afterHours: number, afterMinutes: number): Promise<TimeSlot | null> {
    const availableSlots = await this.getAvailableTimeSlots();
    
    // Filter for slots after the specified time
    const laterSlots = availableSlots.filter(slot => 
      slot.isAvailable && 
      (slot.hours > afterHours || 
       (slot.hours === afterHours && slot.minutes > afterMinutes))
    );
    
    // Sort by time and return the first one
    laterSlots.sort((a, b) => {
      if (a.hours !== b.hours) return a.hours - b.hours;
      return a.minutes - b.minutes;
    });
    
    return laterSlots.length > 0 ? laterSlots[0]! : null;
  }

  /**
   * Select a time slot within a specific time range.
   * @param startHours - Start hour in 24-hour format
   * @param startMinutes - Start minutes
   * @param endHours - End hour in 24-hour format
   * @param endMinutes - End minutes
   * @returns Promise resolving to the selected time slot or null if none available
   */
  async selectTimeSlotInRange(
    startHours: number, 
    startMinutes: number, 
    endHours: number, 
    endMinutes: number
  ): Promise<TimeSlot | null> {
    const availableSlots = await this.getAvailableTimeSlots();
    
    // Find slots within the time range
    const slotsInRange = availableSlots.filter(slot => 
      slot.isAvailable &&
      ((slot.hours > startHours || (slot.hours === startHours && slot.minutes >= startMinutes)) &&
       (slot.hours < endHours || (slot.hours === endHours && slot.minutes <= endMinutes)))
    );
    
    if (slotsInRange.length === 0) {
      return null;
    }
    
    // Select the first available slot in range
    const selectedSlot = slotsInRange[0];
    if (selectedSlot?.element) {
      await selectedSlot.element.click();
    }
    
    return selectedSlot || null;
  }

  /**
   * Verify that time slots are loaded and interactive.
   * @param timeout - Maximum time to wait
   * @returns Promise resolving to true if time slots are properly loaded
   */
  async verifyTimeSlotsLoaded(timeout: number = 30000): Promise<boolean> {
    try {
      await this.waitForTimeSlots(timeout);
      const slots = await this.getAvailableTimeSlots();
      return slots.length > 0;
    } catch (error) {
      return false;
    }
  }
}
