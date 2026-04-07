import { Page, Locator, expect } from '@playwright/test';
import { staffAvailabilityData } from '../types/bookingTypes';

/**
 * Staff component for handling staff preference selection and availability.
 * Provides methods to interact with staff dropdown and verify availability.
 */
export class StaffComponent {
  private page: Page;

  /**
   * Initialize the staff component.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Select a specific staff member from the dropdown.
   * @param staffName - Name of the staff member to select
   * @returns Promise resolving when staff is selected
   */
  async selectStaff(staffName: string): Promise<void> {
    await expect(this.page.getByLabel('Staff Preference')).toBeVisible({ timeout: 10000 });
    await this.page.getByLabel('Staff Preference').selectOption({ label: staffName });
  }

  /**
   * Get all available staff options from the dropdown.
   * @returns Promise resolving to array of staff names
   */
  async getAllStaffOptions(): Promise<string[]> {
    // Wait for staff dropdown to be visible
    const staffDropdown = this.page.getByLabel('Staff Preference');
    await expect(staffDropdown).toBeVisible({ timeout: 10000 });
    
    // Click the dropdown to open options
    await staffDropdown.click();
    
    // Wait a moment for options to load/refresh
    await this.page.waitForTimeout(1000);
    
    // Get all options
    const options = await staffDropdown.getByRole('option').allInnerTexts();
    
    // Close dropdown by clicking elsewhere
    await this.page.keyboard.press('Escape');
    
    return options;
  }

  /**
   * Get the currently selected staff preference.
   * @returns Promise resolving to the selected staff name or "All"
   */
  async getCurrentSelection(): Promise<string> {
    const dropdown = this.page.getByLabel('Staff Preference');
    await expect(dropdown).toBeVisible({ timeout: 10000 });
    
    const selectedText = await dropdown.inputValue();
    const result = selectedText || 'All';
    return result;
  }

  /**
   * Verify that "All" is the default selection.
   * @returns Promise resolving to true if "All" is selected
   */
  async verifyAllIsDefault(): Promise<boolean> {
    const currentSelection = await this.getCurrentSelection();
    return currentSelection === '0: undefined' || currentSelection === 'ALL'; // '0: undefined' is the actual value for "All" selection
  }

  /**
   * Wait for staff dropdown to be loaded and interactive.
   * @param timeout - Maximum time to wait
   */
  async waitForStaffDropdown(timeout: number = 30000): Promise<void> {
    await expect(this.page.getByLabel('Staff Preference')).toBeVisible({ timeout });
  }

  /**
   * Check if a specific staff member is available in the dropdown.
   * @param staffName - Name of the staff member to check
   * @returns Promise resolving to true if staff is available
   */
  async isStaffAvailable(staffName: string): Promise<boolean> {
    const allOptions = await this.getAllStaffOptions();
    return allOptions.includes(staffName);
  }

  /**
   * Calculate available time slots based on staff availability and service duration.
   * @param staffData - Array of staff availability data
   * @param duration - Service duration in minutes
   * @param selectedStaff - Selected staff name or "All" for combined availability
   * @returns Object with enabled and disabled time slots
   */
  calculateTimeSlotAvailability(
    staffData: staffAvailabilityData[], 
    duration: number, 
    selectedStaff?: string
  ): { enabled: string[], disabled: string[] } {
    const enabled: string[] = [];
    const disabled: string[] = [];
    
    // Time slots from 8:00 AM to 6:00 PM in 30-minute intervals
    const timeSlots = this.generateTimeSlots('8:00 AM', '6:00 PM', 30);
    
    if (selectedStaff === 'All' || !selectedStaff) {
      // Combined availability for all staff
      const combinedPeriods = this.combineAvailabilityPeriods(staffData, duration);
      
      timeSlots.forEach(slot => {
        const isCovered = combinedPeriods.some(period => 
          this.isTimeInRange(slot, period.start, period.end)
        );
        
        if (isCovered) {
          enabled.push(slot);
        } else {
          disabled.push(slot);
        }
      });
    } else {
      // Individual staff availability
      const staffMember = staffData.find(staff => staff.staffName === selectedStaff);
      
      if (staffMember) {
        const lastSlot = this.calculateLastAvailableSlot(staffMember.availabilityEnd, duration);
        
        timeSlots.forEach(slot => {
          if (this.isTimeInRange(slot, staffMember.availabilityStart, lastSlot)) {
            enabled.push(slot);
          } else {
            disabled.push(slot);
          }
        });
      }
    }
    
    return { enabled, disabled };
  }

  /**
   * Generate time slots between start and end times at specified intervals.
   * @param startTime - Start time (e.g., "8:00 AM")
   * @param endTime - End time (e.g., "6:00 PM")
   * @param intervalMinutes - Interval in minutes
   * @returns Array of time strings
   */
  private generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
    const slots: string[] = [];
    let currentTime = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    
    while (currentTime < end) {
      slots.push(this.formatTime(currentTime));
      currentTime += intervalMinutes;
    }
    
    return slots;
  }

  /**
   * Parse time string to minutes since midnight.
   * @param timeString - Time string (e.g., "9:00 AM")
   * @returns Minutes since midnight
   */
  private parseTime(timeString: string): number {
    const parts = timeString.split(' ');
    const time = parts[0] || '0:0';
    const period = parts[1] || 'AM';
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr || '0', 10);
    const minutes = parseInt(minutesStr || '0', 10);
    
    let totalMinutes = hours * 60 + minutes;
    if (period === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === 'AM' && hours === 12) {
      totalMinutes -= 12 * 60;
    }
    
    return totalMinutes;
  }

  /**
   * Format minutes since midnight to time string.
   * @param minutes - Minutes since midnight
   * @returns Formatted time string (e.g., "9:00 AM")
   */
  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Check if a time is within the specified range.
   * @param time - Time to check
   * @param startTime - Start time
   * @param endTime - End time
   * @returns True if time is in range
   */
  private isTimeInRange(time: string, startTime: string, endTime: string): boolean {
    const timeMinutes = this.parseTime(time);
    const startMinutes = this.parseTime(startTime);
    const endMinutes = this.parseTime(endTime);
    
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  }

  /**
   * Calculate the last available time slot based on service duration.
   * @param endTime - Staff availability end time
   * @param duration - Service duration in minutes
   * @returns Last available time slot
   */
  private calculateLastAvailableSlot(endTime: string, duration: number): string {
    const endMinutes = this.parseTime(endTime);
    const lastSlotMinutes = endMinutes - duration;
    return this.formatTime(lastSlotMinutes);
  }

  /**
   * Combine availability periods for all staff.
   * @param staffData - Array of staff availability data
   * @param duration - Service duration in minutes
   * @returns Array of combined availability periods
   */
  private combineAvailabilityPeriods(staffData: staffAvailabilityData[], duration: number): Array<{start: string, end: string}> {
    const periods: Array<{start: string, end: string}> = [];
    
    staffData.forEach(staff => {
      const lastSlot = this.calculateLastAvailableSlot(staff.availabilityEnd, duration);
      periods.push({
        start: staff.availabilityStart,
        end: lastSlot
      });
    });
    
    return periods;
  }

  /**
   * Summarize available slots for display or verification.
   * @param staffData - Array of staff availability data
   * @param duration - Service duration in minutes
   * @param selectedStaff - Selected staff name or "All"
   * @returns Summary object with availability information
   */
  summarizeAvailableSlots(
    staffData: staffAvailabilityData[], 
    duration: number, 
    selectedStaff?: string
  ): { 
    totalSlots: number;
    enabledSlots: string[];
    disabledSlots: string[];
    coveragePeriods: Array<{staff: string, start: string, end: string}>;
  } {
    const availability = this.calculateTimeSlotAvailability(staffData, duration, selectedStaff);
    
    const coveragePeriods = staffData.map(staff => ({
      staff: staff.staffName,
      start: staff.availabilityStart,
      end: this.calculateLastAvailableSlot(staff.availabilityEnd, duration)
    }));
    
    return {
      totalSlots: availability.enabled.length + availability.disabled.length,
      enabledSlots: availability.enabled,
      disabledSlots: availability.disabled,
      coveragePeriods
    };
  }
}
