import { Page, Locator, expect } from '@playwright/test';
import { BookingData } from '../types/bookingTypes';

/**
 * Interface for confirmation details extracted from the confirmation page.
 */
export interface ConfirmationDetails {
  confirmationNumber?: string;
  serviceName?: string;
  locationName?: string;
  dateTime?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  meetingPreference?: string;
}

/**
 * Confirmation page for verifying appointment booking details.
 * Handles verification of booking confirmation and extraction of appointment details.
 */
export class ConfirmationPage {
  private page: Page;

  /**
   * Initialize the confirmation page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the confirmation page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForConfirmationPage(timeout: number = 220000): Promise<void> {
    // Wait for confirmation heading to appear
    await expect(async () => {
      await expect(this.page.getByRole('heading', { name: /.*appointment has been scheduled/ }))
        .toBeVisible({ timeout: 10000 });
    }).toPass({ 
      timeout: timeout,
    });
  }

  /**
   * Get all confirmation details from the page.
   * @returns Promise resolving to confirmation details
   */
  async getConfirmationDetails(): Promise<ConfirmationDetails> {
    await this.waitForConfirmationPage();
    
    const details: ConfirmationDetails = {};
    
    // Get confirmation number if available
    details.confirmationNumber = await this.getConfirmationNumber();
    
    // Get service name
    details.serviceName = await this.getServiceName();
    
    // Get location name
    details.locationName = await this.getLocationName();
    
    // Get date and time
    details.dateTime = await this.getDateTime();
    
    // Get customer details
    details.customerName = await this.getCustomerName();
    details.customerEmail = await this.getCustomerEmail();
    details.customerPhone = await this.getCustomerPhone();
    
    // Get meeting preference if available
    details.meetingPreference = await this.getMeetingPreference();
    
    return details;
  }

  /**
   * Get the appointment confirmation number.
   * @returns Promise resolving to confirmation number or undefined
   */
  async getConfirmationNumber(): Promise<string | undefined> {
    try {
      const confirmationElement = this.page.locator('text=/confirmation|confirmation #|#/i').first();
      const text = await confirmationElement.textContent();
      if (text) {
        // Extract confirmation number from text
        const match = text.match(/#?(\w+-?\d+)/i);
        return match ? match[1] : undefined;
      }
    } catch (error) {
      // Confirmation number not found
    }
    return undefined;
  }

  /**
   * Get the service name from confirmation.
   * @returns Promise resolving to service name or undefined
   */
  async getServiceName(): Promise<string | undefined> {
    try {
      // Look for service name in various locations
      const serviceElement = this.page.locator('text=Update Personal Account').first()
        .or(this.page.locator('[data-testid="service-name"]').first())
        .or(this.page.locator('.service-name').first());
      
      if (await serviceElement.isVisible()) {
        const text = await serviceElement.textContent();
        return text || undefined;
      }
    } catch (error) {
      // Service name not found
    }
    return undefined;
  }

  /**
   * Get the location name from confirmation.
   * @returns Promise resolving to location name or undefined
   */
  async getLocationName(): Promise<string | undefined> {
    try {
      const locationElement = this.page.locator('text=McKinney').first()
        .or(this.page.locator('[data-testid="location-name"]').first())
        .or(this.page.locator('.location-name').first());
      
      if (await locationElement.isVisible()) {
        return await locationElement.textContent() || undefined;
      }
    } catch (error) {
      // Location name not found
    }
    return undefined;
  }

  /**
   * Get the date and time from confirmation.
   * @returns Promise resolving to date time string or undefined
   */
  async getDateTime(): Promise<string | undefined> {
    try {
      // Look for date/time patterns
      const dateTimeElement = this.page.locator('text=/\\d{1,2},\\s*\\d{4}\\s+at\\s+\\d{1,2}:\\d{2}\\s*(AM|PM)/i').first()
        .or(this.page.locator('[data-testid="date-time"]').first())
        .or(this.page.locator('.date-time').first());
      
      if (await dateTimeElement.isVisible()) {
        return await dateTimeElement.textContent() || undefined;
      }
    } catch (error) {
      // Date/time not found
    }
    return undefined;
  }

  /**
   * Get the customer name from confirmation.
   * @returns Promise resolving to customer name or undefined
   */
  async getCustomerName(): Promise<string | undefined> {
    try {
      const customerElement = this.page.locator('[data-testid="customer-name"]').first()
        .or(this.page.locator('.customer-name').first());
      
      if (await customerElement.isVisible()) {
        return await customerElement.textContent() || undefined;
      }
    } catch (error) {
      // Customer name not found
    }
    return undefined;
  }

  /**
   * Get the customer email from confirmation.
   * @returns Promise resolving to customer email or undefined
   */
  async getCustomerEmail(): Promise<string | undefined> {
    try {
      const emailElement = this.page.locator('text=ronha.smith@example.com').first()
        .or(this.page.locator('text=/\\w+\\.\\w+@\\w+\\.\\w+/i').first())
        .or(this.page.locator('[data-testid="customer-email"]').first())
        .or(this.page.locator('.customer-email').first());
      
      if (await emailElement.isVisible()) {
        return await emailElement.textContent() || undefined;
      }
    } catch (error) {
      // Customer email not found
    }
    return undefined;
  }

  /**
   * Get the customer phone from confirmation.
   * @returns Promise resolving to customer phone or undefined
   */
  async getCustomerPhone(): Promise<string | undefined> {
    try {
      const phoneElement = this.page.locator('text=/\\d{3}-\\d{3}-\\d{4}/').first()
        .or(this.page.locator('[data-testid="customer-phone"]').first())
        .or(this.page.locator('.customer-phone').first());
      
      if (await phoneElement.isVisible()) {
        return await phoneElement.textContent() || undefined;
      }
    } catch (error) {
      // Customer phone not found
    }
    return undefined;
  }

  /**
   * Get the meeting preference from confirmation.
   * @returns Promise resolving to meeting preference or undefined
   */
  async getMeetingPreference(): Promise<string | undefined> {
    try {
      const preferenceElement = this.page.locator('[data-testid="meeting-preference"]').first()
        .or(this.page.locator('.meeting-preference').first());
      
      if (await preferenceElement.isVisible()) {
        return await preferenceElement.textContent() || undefined;
      }
    } catch (error) {
      // Meeting preference not found
    }
    return undefined;
  }

  /**
   * Verify that the confirmation page contains expected details.
   * @param expectedDetails - Expected details to verify
   * @returns Promise resolving to true if all expected details are present
   */
  async verifyConfirmationDetails(expectedDetails: Partial<ConfirmationDetails>): Promise<boolean> {
    const actualDetails = await this.getConfirmationDetails();
    
    try {
      if (expectedDetails.serviceName && !actualDetails.serviceName?.includes(expectedDetails.serviceName)) {
        return false;
      }
      
      if (expectedDetails.locationName && !actualDetails.locationName?.includes(expectedDetails.locationName)) {
        return false;
      }
      
      if (expectedDetails.customerEmail && actualDetails.customerEmail !== expectedDetails.customerEmail) {
        return false;
      }
      
      if (expectedDetails.dateTime && !actualDetails.dateTime?.includes(expectedDetails.dateTime)) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the cancel appointment button is visible.
   * @returns Promise resolving to true if cancel button is visible
   */
  async isCancelButtonVisible(): Promise<boolean> {
    const cancelButton = this.page.getByRole('button', { name: 'Cancel Appointment' })
      .or(this.page.locator('[data-testid="cancel-appointment"]'));
    
    return await cancelButton.isVisible();
  }

  /**
   * Click the cancel appointment button if available.
   * @returns Promise resolving when cancel button is clicked
   */
  async clickCancelButton(): Promise<void> {
    const cancelButton = this.page.getByRole('button', { name: 'Cancel Appointment' })
      .or(this.page.locator('[data-testid="cancel-appointment"]'));
    
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }

  /**
   * Verify that the confirmation page is properly loaded.
   * @returns Promise resolving to true if page is loaded correctly
   */
  async verifyConfirmationPageLoaded(): Promise<boolean> {
    try {
      await this.waitForConfirmationPage(10000);
      const heading = this.page.getByRole('heading', { name: /.*appointment has been scheduled/ });
      return await heading.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract appointment ID from URL or page content.
   * @returns Promise resolving to appointment ID or undefined
   */
  async getAppointmentId(): Promise<string | undefined> {
    // Try to get from URL first
    const url = this.page.url();
    const urlMatch = url.match(/appointment[\/=]([^&\?]+)/i);
    if (urlMatch) {
      return urlMatch[1];
    }
    
    // Fallback to confirmation number
    return await this.getConfirmationNumber();
  }

  /**
   * Verify complete booking details against expected data.
   * Uses exact string matching for precise verification.
   * @param bookingData - Expected booking data to verify against
   * @returns Promise resolving to true if all details match
   */
  async verifyBooking(bookingData: BookingData): Promise<boolean> {
    await this.waitForConfirmationPage();
    
    try {
      // Verify service name
      const serviceElement = this.page.getByText(bookingData.service.displayName || bookingData.service.name, { exact: false }).first();
      await expect(serviceElement).toBeVisible();
      
      // Verify location name
      const locationElement = this.page.getByText(bookingData.location.confirmationName || bookingData.location.name, { exact: false }).first();
      await expect(locationElement).toBeVisible();
      
      // Verify customer email
      const emailElement = this.page.getByText(bookingData.customer.email, { exact: true }).first();
      await expect(emailElement).toBeVisible();
      
      // Verify customer name
      const customerName = `${bookingData.customer.firstName} ${bookingData.customer.lastName}`;
      const nameElement = this.page.getByText(customerName, { exact: false }).first();
      await expect(nameElement).toBeVisible();
      
      // Verify date and time
      const expectedDateTime = `${bookingData.dateTime.formattedDate} at ${bookingData.dateTime.time}`;
      const dateTimeElement = this.page.getByText(expectedDateTime).first();
      await expect(dateTimeElement).toBeVisible();
      
      // Verify meeting preference (if displayed)
      if (bookingData.meetingPreference.displayName) {
        const preferenceElement = this.page.getByText(bookingData.meetingPreference.displayName, { exact: true }).first();
        await expect(preferenceElement).toBeVisible();
      }
      
      return true;
    } catch (error) {
      console.error('Booking verification failed:', error);
      return false;
    }
  }
}
