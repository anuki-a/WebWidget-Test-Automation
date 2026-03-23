/**
 * Interface for date range information.
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Interface for formatted date strings used in UI interactions.
 */
export interface FormattedDate {
  shortMonth: string;
  dayNumber: number;
  datePickerLabel: string;
  fullDateString: string;
  isoString: string;
}

/**
 * Utility class for date operations in automation tests.
 * Provides methods for date calculations, formatting, and timezone handling.
 */
export class DateUtils {
  /**
   * Get a future date from today by specified number of days.
   * @param daysAhead - Number of days to add to today
   * @returns Future date object
   */
  static getFutureDate(daysAhead: number = 0): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date;
  }

  /**
   * Get today's date at midnight.
   * @returns Today's date at midnight
   */
  static getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Get a date range for availability lookups.
   * @param startDate - Starting date
   * @param daysRange - Number of days to include in range
   * @returns Date range object
   */
  static getDateRange(startDate: Date, daysRange: number = 7): DateRange {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysRange);
    
    return {
      startDate,
      endDate,
    };
  }

  /**
   * Format date for UI interactions based on the happy path test pattern.
   * @param date - Date to format
   * @returns Formatted date object with various string representations
   */
  static formatDateForUI(date: Date): FormattedDate {
    // For Clicking: "Mar 5," and "5"
    const shortMonth = date.toLocaleString('default', { month: 'short' });
    const dayNum = date.getDate();
    const datePickerLabel = `${shortMonth} ${dayNum},`;

    // For Assertion: "Thursday, March 5, 2026"
    const fullDateString = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // ISO string for API calls
    const isoString = date.toISOString();

    return {
      shortMonth,
      dayNumber: dayNum,
      datePickerLabel,
      fullDateString,
      isoString,
    };
  }

  /**
   * Get today's date formatted for UI interactions.
   * @returns Formatted date object for today
   */
  static getTodayFormatted(): FormattedDate {
    return this.formatDateForUI(this.getToday());
  }

  /**
   * Get a future date formatted for UI interactions.
   * @param daysAhead - Number of days ahead
   * @returns Formatted date object for future date
   */
  static getFutureDateFormatted(daysAhead: number): FormattedDate {
    const futureDate = this.getFutureDate(daysAhead);
    return this.formatDateForUI(futureDate);
  }

  /**
   * Format time for API calls (HH:MM format).
   * @param hours - Hours (24-hour format)
   * @param minutes - Minutes
   * @returns Time string in HH:MM format
   */
  static formatTime(hours: number, minutes: number = 0): string {
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}`;
  }

  /**
   * Combine date and time for API calls.
   * @param date - Date object
   * @param hours - Hours (24-hour format)
   * @param minutes - Minutes
   * @returns ISO string with combined date and time
   */
  static combineDateTime(date: Date, hours: number, minutes: number = 0): string {
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
  }

  /**
   * Parse time string from UI (e.g., "6:15 AM") to 24-hour format.
   * @param timeString - Time string from UI
   * @returns Object with hours and minutes in 24-hour format
   */
  static parseTimeString(timeString: string): { hours: number; minutes: number } {
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    let hours = parseInt(match[1]!);
    const minutes = parseInt(match[2]!);
    const period = match[3]!.toUpperCase();

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  }

  /**
   * Check if a date is a weekend.
   * @param date - Date to check
   * @returns True if date is Saturday or Sunday
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  /**
   * Check if a date is in the past.
   * @param date - Date to check
   * @returns True if date is before today
   */
  static isPast(date: Date): boolean {
    const today = this.getToday();
    return date < today;
  }

  /**
   * Get the next available business day (excluding weekends).
   * @param startDate - Date to start from
   * @param excludeWeekends - Whether to exclude weekends
   * @returns Next business day
   */
  static getNextBusinessDay(startDate: Date = new Date(), excludeWeekends: boolean = true): Date {
    let nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);

    if (excludeWeekends) {
      while (this.isWeekend(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1);
      }
    }

    return nextDay;
  }

  /**
   * Get date string in YYYY-MM-DD format for API calls.
   * @param date - Date to format
   * @returns Date string in YYYY-MM-DD format
   */
  static toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Add business days to a date (excluding weekends).
   * @param date - Starting date
   * @param businessDays - Number of business days to add
   * @returns Date with business days added
   */
  static addBusinessDays(date: Date, businessDays: number): Date {
    const result = new Date(date);
    let daysAdded = 0;

    while (daysAdded < businessDays) {
      result.setDate(result.getDate() + 1);
      if (!this.isWeekend(result)) {
        daysAdded++;
      }
    }

    return result;
  }
}
