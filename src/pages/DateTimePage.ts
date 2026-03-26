import { Page, Locator, expect } from '@playwright/test';
import { CalendarComponent } from '../components/CalendarComponent';
import { TimeSlotComponent } from '../components/TimeSlotComponent';
import { DateUtils, FormattedDate } from '../utils/dateUtils';
import { DateTimeData } from '@/types/bookingTypes';

/**
 * Date and time page for selecting appointment date and time.
 * Combines CalendarComponent and TimeSlotComponent for complete date/time selection.
 */
export class DateTimePage {
  private page: Page;
  private calendarComponent: CalendarComponent;
  private timeSlotComponent: TimeSlotComponent;

  /**
   * Initialize the date time page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    this.calendarComponent = new CalendarComponent(page);
    this.timeSlotComponent = new TimeSlotComponent(page);
  }

  /**
   * Wait for the date time page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForDateTimePage(timeout: number = 30000): Promise<void> {
    await expect(this.page.getByText("Select a Date and Time")).toBeVisible({ timeout });
  }

  /**
   * Select a specific date and time.
   * @param date - Date to select
   * @param timeString - Time string to select (e.g., "6:15 AM")
   * @returns Promise resolving to the selected date and time
   */
  async selectDateAndTime(date: Date, timeString: string): Promise<{ date: Date; time: string }> {
    await this.waitForDateTimePage();
    
    // Select date
    await this.calendarComponent.selectDate(date);
    
    // Select time slot
    await this.timeSlotComponent.selectTimeSlot(timeString);
    
    return {
      date,
      time: timeString,
    };
  }

  /**
   * Select today's date and first available time slot.
   * @returns Promise resolving to the selected date and time
   */
  async selectDayAndFirstAvailableTime(dateTime: DateTimeData): Promise<{ date: Date; time: string; formattedDate: string }> {
    await this.waitForDateTimePage();
    const day = dateTime.date || DateUtils.getToday();
    // 1. Trigger the click
    await this.calendarComponent.selectDay(day);

    // 3. Select first available time slot
    const selectedTime = await this.timeSlotComponent.selectFirstAvailableSlot();

    return {
      date: day,
      time: selectedTime,
      formattedDate: DateUtils.formatDateForUI(day).fullDateString,
    };
  }

  /**
   * Select a future date and first available time slot.
   * @param daysAhead - Number of days ahead to select
   * @returns Promise resolving to the selected date and time
   */
  async selectFutureDateAndFirstAvailableTime(daysAhead: number): Promise<{ date: Date; time: string }> {
    await this.waitForDateTimePage();
    
    // Select future date
    const futureDate = DateUtils.getFutureDate(daysAhead);
    await this.calendarComponent.selectFutureDate(daysAhead);
    
    // Select first available time slot
    const selectedTime = await this.timeSlotComponent.selectFirstAvailableSlot();
    
    return {
      date: futureDate,
      time: selectedTime,
    };
  }

  /**
   * Select date and time within a specific time range.
   * @param date - Date to select
   * @param startHours - Start hour in 24-hour format
   * @param startMinutes - Start minutes
   * @param endHours - End hour in 24-hour format
   * @param endMinutes - End minutes
   * @returns Promise resolving to the selected date and time
   */
  async selectDateAndTimeInRange(
    date: Date,
    startHours: number,
    startMinutes: number,
    endHours: number,
    endMinutes: number
  ): Promise<{ date: Date; time: string } | null> {
    await this.waitForDateTimePage();
    
    // Select date
    await this.calendarComponent.selectDate(date);
    
    // Select time slot in range
    const selectedSlot = await this.timeSlotComponent.selectTimeSlotInRange(
      startHours,
      startMinutes,
      endHours,
      endMinutes
    );
    
    if (!selectedSlot) {
      return null;
    }
    
    return {
      date,
      time: selectedSlot.time,
    };
  }

  /**
   * Get the currently selected date and time.
   * @returns Promise resolving to the selected date and time or null
   */
  async getSelectedDateTime(): Promise<{ date: Date | null; time: string | null }> {
    const selectedDate = await this.calendarComponent.getSelectedDate();
    const selectedTime = await this.timeSlotComponent.getSelectedTimeSlot();
    
    return {
      date: selectedDate,
      time: selectedTime,
    };
  }

  /**
   * Get all available time slots for the selected date.
   * @returns Promise resolving to array of available time slots
   */
  async getAvailableTimeSlots(): Promise<any[]> {
    return await this.timeSlotComponent.getAvailableTimeSlots();
  }

  /**
   * Check if a specific date is available for selection.
   * @param date - Date to check
   * @returns Promise resolving to true if date is available
   */
  async isDateAvailable(date: Date): Promise<boolean> {
    const isDisabled = await this.calendarComponent.isDateDisabled(date);
    return !isDisabled;
  }

  /**
   * Find the next available date and time slot.
   * @param maxDaysToSearch - Maximum number of days to search ahead
   * @returns Promise resolving to the next available date and time or null
   */
  async selectNextAvailableDateTime(maxDaysToSearch: number = 30): Promise<{ date: Date; time: string } | null> {
    await this.waitForDateTimePage();
    
    // Find first available date
    const availableDate = await this.calendarComponent.selectFirstAvailableDate(maxDaysToSearch);
    
    if (!availableDate) {
      return null;
    }
    
    // Select first available time slot for that date
    const selectedTime = await this.timeSlotComponent.selectFirstAvailableSlot();
    
    return {
      date: availableDate,
      time: selectedTime,
    };
  }

  /**
   * Verify that the date time page is properly loaded.
   * @returns Promise resolving to true if page is loaded correctly
   */
  async verifyDateTimePageLoaded(): Promise<boolean> {
    try {
      await this.waitForDateTimePage(10000);
      const timeSlotsLoaded = await this.timeSlotComponent.verifyTimeSlotsLoaded(10000);
      return timeSlotsLoaded;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for date time selection to complete and next step to load.
   * @param timeout - Maximum time to wait
   */
  async waitForDateTimeSelectionComplete(timeout: number = 30000): Promise<void> {
    // Wait for personal details form to appear
    await this.page.waitForSelector('[data-testid="personal-details"], input[name="firstName"], input:has-text("First Name")', {
      timeout,
      state: 'visible',
    });
  }

  /**
   * Get access to the calendar component for advanced operations.
   * @returns CalendarComponent instance
   */
  getCalendar(): CalendarComponent {
    return this.calendarComponent;
  }

  /**
   * Get access to the time slot component for advanced operations.
   * @returns TimeSlotComponent instance
   */
  getTimeSlot(): TimeSlotComponent {
    return this.timeSlotComponent;
  }

  /**
   * Submit the date and time selection to proceed to next step.
   * @returns Promise resolving when submission is complete
   */
  async submit(): Promise<void> {
    // Look for a continue/next button after date/time selection
    const continueButton = this.page.getByRole('button', { name: 'Continue' })
      .or(this.page.getByRole('button', { name: 'Next' }))
      .or(this.page.getByRole('button', { name: 'Select Time' }))
      .or(this.page.locator('button[type="submit"]'))
      .first();
    
    await expect(continueButton).toBeVisible({ timeout: 10000 });
    await continueButton.click();
  }
}
