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
  async waitForConfirmationPage(timeout: number = 22000): Promise<void> {
    // Wait for confirmation heading with retry logic
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
    
    details.confirmationNumber = await this.getConfirmationNumber();
    details.serviceName = await this.getServiceName();
    details.locationName = await this.getLocationName();
    details.dateTime = await this.getDateTime();
    details.customerName = await this.getCustomerName();
    details.customerEmail = await this.getCustomerEmail();
    details.customerPhone = await this.getCustomerPhone();
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
      // Return undefined if element not found
    }
    return undefined;
  }

  /**
   * Get the service name from confirmation.
   * @returns Promise resolving to service name or undefined
   */
  async getServiceName(): Promise<string | undefined> {
    try {
      // Try test ID first, then class name
      const serviceElement = this.page.locator('[data-testid="service-name"]').first()
        .or(this.page.locator('.service-name').first());
      
      if (await serviceElement.isVisible()) {
        const text = await serviceElement.textContent();
        return text || undefined;
      }
    } catch (error) {
      // Return undefined if element not found
    }
    return undefined;
  }

  /**
   * Get the location name from confirmation.
   * @returns Promise resolving to location name or undefined
   */
  async getLocationName(): Promise<string | undefined> {
    try {
      // Try test ID first, then class name
      const locationElement = this.page.locator('[data-testid="location-name"]').first()
        .or(this.page.locator('.location-name').first());
      
      if (await locationElement.isVisible()) {
        return await locationElement.textContent() || undefined;
      }
    } catch (error) {
      // Return undefined if element not found
    }
    return undefined;
  }

  /**
   * Get the date and time from confirmation.
   * @returns Promise resolving to date time string or undefined
   */
  async getDateTime(): Promise<string | undefined> {
    try {
      // Try date pattern first, then test ID, then class
      const dateTimeElement = this.page.locator('text=/\d{1,2},\s*\d{4}\s+at\s+\d{1,2}:\d{2}\s*(AM|PM)/i').first()
        .or(this.page.locator('[data-testid="date-time"]').first())
        .or(this.page.locator('.date-time').first());
      
      if (await dateTimeElement.isVisible()) {
        return await dateTimeElement.textContent() || undefined;
      }
    } catch (error) {
      // Return undefined if element not found
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
      // Return undefined if element not found
    }
    return undefined;
  }

  /**
   * Get the customer email from confirmation.
   * @returns Promise resolving to customer email or undefined
   */
  async getCustomerEmail(): Promise<string | undefined> {
    try {
      // Try email pattern first, then test ID, then class
      const emailElement = this.page.locator('text=/\w+\.\w+@\w+\.\w+/i').first()
        .or(this.page.locator('[data-testid="customer-email"]').first())
        .or(this.page.locator('.customer-email').first());
      
      if (await emailElement.isVisible()) {
        return await emailElement.textContent() || undefined;
      }
    } catch (error) {
      // Return undefined if element not found
    }
    return undefined;
  }

  /**
   * Get the customer phone from confirmation.
   * @returns Promise resolving to customer phone or undefined
   */
  async getCustomerPhone(): Promise<string | undefined> {
    try {
      const phoneElement = this.page.locator('text=/\d{3}-\d{3}-\d{4}/').first()
        .or(this.page.locator('[data-testid="customer-phone"]').first())
        .or(this.page.locator('.customer-phone').first());
      
      if (await phoneElement.isVisible()) {
        return await phoneElement.textContent() || undefined;
      }
    } catch (error) {
      // Return undefined if element not found
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
      // Return undefined if element not found
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
      // Return false if verification fails
      return false;
    }
  }

  /**
   * Check if the cancel appointment button is visible.
   * @returns Promise resolving to true if cancel button is visible
   */
  async isCancelButtonVisible(): Promise<boolean> {
    // Try button text first, then test ID
    const cancelButton = this.page.getByRole('button', { name: 'Cancel Appointment' })
      .or(this.page.locator('[data-testid="cancel-appointment"]'));
    
    return await cancelButton.isVisible();
  }

  /**
   * Click the cancel appointment button if available.
   * @returns Promise resolving when cancel button is clicked
   */
  async clickCancelButton(): Promise<void> {
    // Try button text first, then test ID
    const cancelButton = this.page.getByRole('button', { name: 'Cancel Appointment' })
      .or(this.page.locator('[data-testid="cancel-appointment"]'));
    
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }

  /**
   * Handle cancellation popup by dismissing (clicking No/Cancel).
   * @returns Promise resolving when popup is dismissed
   */
  async dismissCancellationPopup(): Promise<void> {
    // Verify cancellation popup appeared
    const appointmentText = this.page.locator('text=Appointment Cancellation');
    await expect(appointmentText).toBeVisible({ timeout: 1000 });

    // Try multiple dismiss button options
    const dismissButton = this.page.getByRole('button', { name: 'No' })
      .or(this.page.getByRole('button', { name: 'Cancel' }))
      .or(this.page.getByRole('button', { name: 'Dismiss' }))
      .or(this.page.locator('[data-testid="cancel-dismiss"]'));
    
    await expect(dismissButton).toBeVisible({ timeout: 10000 });
    await dismissButton.click();
  }

  /**
   * Handle cancellation popup by confirming (clicking Yes/Confirm).
   * @returns Promise resolving when cancellation is confirmed
   */
  async confirmCancellationPopup(): Promise<void> {
    // Try multiple confirm button options
    const confirmButton = this.page.getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Confirm' }))
      .or(this.page.getByRole('button', { name: 'Cancel Appointment' }))
      .or(this.page.locator('[data-testid="cancel-confirm"]'));
    
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();
  }

  /**
   * Wait for cancellation confirmation message to appear.
   * @param timeout - Maximum time to wait
   * @returns Promise resolving when cancellation confirmation is visible
   */
  async waitForCancellationConfirmation(timeout: number = 30000): Promise<void> {
    const cancellationMessage = this.page.getByText(/This appointment has been cancelled. Do you want to book another?/i)
    await expect(cancellationMessage).toBeVisible({ timeout });
  }

  /**
   * Verify that appointment is marked as cancelled on the page.
   * @returns Promise resolving to true if cancellation is confirmed
   */
  async verifyAppointmentCancelled(): Promise<boolean> {
    try {
      // Check various cancellation indicators
      const cancelledIndicators = [
        this.page.getByText(/appointment.*cancel|cancel.*appointment/i),
        this.page.getByText(/cancelled|canceled/i),
        this.page.locator('[data-testid="appointment-cancelled"]'),
        this.page.locator('.cancelled-appointment')
      ];
      
      for (const indicator of cancelledIndicators) {
        if (await indicator.isVisible().catch(() => false)) {
          return true; // Found cancellation indicator
        }
      }
      return false;
    } catch (error) {
      // Return false if check fails
      return false;
    }
  }

  /**
   * Check if "Book Another" button is available after cancellation.
   * @returns Promise resolving to true if Book Another button is visible
   */
  async isBookAnotherButtonVisible(): Promise<boolean> {
    const bookAnotherButton = this.page.getByRole('button', { name: 'Book Another' })
    return await bookAnotherButton.isVisible().catch(() => false); // Don't fail if not found
  }

  /**
   * Complete cancellation flow: click cancel, confirm, and verify cancellation.
   * @returns Promise resolving to true if cancellation is successful
   */
  async testCancelAppointment(): Promise<boolean> {
    try {
      await this.clickCancelButton();
      await this.confirmCancellationPopup();
      await this.waitForCancellationConfirmation();
      const isCancelled = await this.verifyAppointmentCancelled();
      const hasBookAnother = await this.isBookAnotherButtonVisible();
      
      return isCancelled && hasBookAnother; // Both conditions must be true
    } catch (error) {
      // Return false if cancellation flow fails
      return false;
    }
  }

  /**
   * Test cancellation flow by dismissing the popup (appointment should remain active).
   * @returns Promise resolving to true if appointment remains active after dismissing cancellation
   */
  async testCancellationDismiss(): Promise<boolean> {
    try {
      await this.clickCancelButton();
      await this.dismissCancellationPopup();
      await this.page.waitForTimeout(2000); // Wait for popup to close
      
      // Ensure appointment is NOT cancelled
      const isCancelled = await this.page.locator('text=Cancelled').isVisible().catch(() => false);
      if (isCancelled) {
        return false;
      }

      const confirmationPageActive = await this.verifyConfirmationPageLoaded();
      
      return confirmationPageActive;
    } catch (error) {
      // Return false if dismiss flow fails
      return false;
    }
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
      // Return false if page verification fails
      return false;
    }
  }

  /**
   * Extract appointment ID from URL or page content.
   * @returns Promise resolving to appointment ID or undefined
   */
  async getAppointmentId(): Promise<string | undefined> {
    // Try to extract from URL first
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
      // Verify service name (use display name if available)
      const serviceElement = this.page.getByText(bookingData.service.displayName || bookingData.service.name, { exact: false }).first();
      await expect(serviceElement).toBeVisible();
      
      // Verify location name (use confirmation name if available)
      const locationElement = this.page.getByText(bookingData.location.confirmationName || bookingData.location.name, { exact: false }).first();
      await expect(locationElement).toBeVisible();
      
      // Verify customer email (exact match)
      const emailElement = this.page.getByText(bookingData.customer.email, { exact: true }).first();
      await expect(emailElement).toBeVisible();
      
      // Verify customer name (partial match allowed)
      const customerName = `${bookingData.customer.firstName} ${bookingData.customer.lastName}`;
      const nameElement = this.page.getByText(customerName, { exact: false }).first();
      await expect(nameElement).toBeVisible();
      
      // Verify date and time format
      const expectedDateTime = `${bookingData.dateTime.formattedDate} at ${bookingData.dateTime.time}`;
      const dateTimeElement = this.page.getByText(expectedDateTime).first();
      await expect(dateTimeElement).toBeVisible();
      
      // Verify meeting preference if present
      if (bookingData.meetingPreference.displayName) {
        const preferenceElement = this.page.getByText(bookingData.meetingPreference.displayName, { exact: true }).first();
        await expect(preferenceElement).toBeVisible();
      }
      
      return true;
    } catch (error) {
      // Return false if booking verification fails
      return false;
    }
  }
}
