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

  // Locators for confirmation page elements
  readonly confirmationHeading: Locator;
  readonly confirmationNumber: Locator;
  readonly confirmationNumberValue: Locator;
  readonly dateTimeSection: Locator;
  readonly editDateTimeLink: Locator;
  readonly locationName: Locator;
  readonly editLocationLink: Locator;
  readonly locationAddress: Locator;
  readonly addToOutlookLink: Locator;
  readonly addToGoogleLink: Locator;
  readonly addToiCalLink: Locator;
  readonly requestedServiceSection: Locator;
  readonly serviceName: Locator;
  readonly serviceDuration: Locator;
  readonly editServiceLink: Locator;
  readonly meetingPreferenceSection: Locator;
  readonly meetingPreferenceValue: Locator;
  readonly editMeetingPreferenceLink: Locator;
  readonly staffPreferenceSection: Locator;
  readonly staffName: Locator;
  readonly editStaffLink: Locator;
  readonly personalDetailsSection: Locator;
  readonly customerName: Locator;
  readonly customerEmail: Locator;
  readonly customerPhone: Locator;
  readonly editPersonalDetailsLink: Locator;
  readonly cancelButton: Locator;
  readonly bookAnotherButton: Locator;
  readonly inPersonAppointmentNote: Locator;
  readonly phoneAppointmentNote: Locator;
  readonly nonEditableMessage: Locator;
  readonly disabledCancelButton: Locator;
  readonly cancellationPopupText: Locator;
  readonly dismissPopupButton: Locator;
  readonly confirmPopupButton: Locator;
  readonly cancellationConfirmationMessage: Locator;
  readonly cancelledIndicators: Locator[];

  /**
   * Initialize the confirmation page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Initialize all locators
    this.confirmationHeading = this.page.getByRole('heading', { name: /.*appointment has been scheduled/ });
    this.confirmationNumber = this.page.locator('text=/Appointment Confirmation #/i');
    this.confirmationNumberValue = this.page.locator('text=/\\w+\\d+/i').first();
    this.dateTimeSection = this.page.locator('text=/\\w+day,\\s+\\w+\\s+\\d{1,2},\\s+\\d{4}\\s+at\\s+\\d{1,2}:\\d{2}\\s*(AM|PM)/i');
    this.editDateTimeLink = this.page.getByRole('link', { name: 'Edit Date and Time' });
    this.locationName = this.page.locator('strong').first();
    this.editLocationLink = this.page.getByRole('link', { name: 'Edit Location' });
    this.locationAddress = this.page.locator('text=/\\d+\\s+.*\\s+.*,\\s+.*\\s+\\d{5}/i');
    this.addToOutlookLink = this.page.getByText('Add to Outlook');
    this.addToGoogleLink = this.page.getByText('Add to Google');
    this.addToiCalLink = this.page.getByText('Add to iCal');
    this.requestedServiceSection = this.page.locator('text=/Requested Service/i');
    this.serviceName = this.page.locator('text=/Update Personal Account/i');
    this.serviceDuration = this.page.locator('text=/\\d+\\s+Mins/i');
    this.editServiceLink = this.page.getByRole('link', { name: 'Edit Requested Service' });
    this.meetingPreferenceSection = this.page.locator('text=/Meeting Preference/i');
    this.meetingPreferenceValue = this.page.locator('text=/Meet in Person|Meet via Phone Call/i');
    this.editMeetingPreferenceLink = this.page.getByRole('link', { name: 'Edit Requested Meeting Preference' });
    this.staffPreferenceSection = this.page.locator('text=/Staff Preference/i');
    this.staffName = this.page.locator('text=/Brandon Knowles|Christine Cashatt|Myrtle Nash|Quantasia Jasper/i');
    this.editStaffLink = this.page.getByRole('link', { name: 'Edit Staff Requested' });
    this.personalDetailsSection = this.page.locator('text=/Personal Details/i').last();
    this.customerName = this.personalDetailsSection.locator('text=/\\w+\\s+\\w+/i').first();
    this.customerEmail = this.personalDetailsSection.locator('text=/\\w+@\\w+\\.\\w+/i');
    this.customerPhone = this.page.locator('text=/\\(\\d{3}\\)\\s+\\d{3}-\\d{4}|\\d{10}/i');
    this.editPersonalDetailsLink = this.page.getByRole('link', { name: 'Edit Personal Details' });
    this.cancelButton = this.page.getByRole('button', { name: 'Cancel Appointment' });
    this.bookAnotherButton = this.page.getByRole('button', { name: 'Book Another' });
    this.inPersonAppointmentNote = this.page.getByText('This is an in-person appointment. We will see you at the location specified above.');
    this.phoneAppointmentNote = this.page.getByText('This is a phone appointment. A staff member will call you at the number specified above.');
    this.nonEditableMessage = this.page.getByText('This appointment cannot be changed or cancelled.');
    this.disabledCancelButton = this.page.getByRole('button', { name: 'Cancel Appointment' });
    this.cancellationPopupText = this.page.locator('text=Appointment Cancellation');
    this.dismissPopupButton = this.page.getByRole('button', { name: 'No' })
      .or(this.page.getByRole('button', { name: 'Cancel' }))
      .or(this.page.getByRole('button', { name: 'Dismiss' }))
      .or(this.page.locator('[data-testid="cancel-dismiss"]'));
    this.confirmPopupButton = this.page.getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Confirm' }))
      .or(this.page.getByRole('button', { name: 'Cancel Appointment' }))
      .or(this.page.locator('[data-testid="cancel-confirm"]'));
    this.cancellationConfirmationMessage = this.page.getByText(/This appointment has been cancelled. Do you want to book another?/i);
    this.cancelledIndicators = [
      this.page.getByText(/appointment.*cancel|cancel.*appointment/i),
      this.page.getByText(/cancelled|canceled/i),
      this.page.locator('[data-testid="appointment-cancelled"]'),
      this.page.locator('.cancelled-appointment')
    ];
  }

  /**
   * Wait for the confirmation page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForConfirmationPage(timeout: number = 220000): Promise<void> {
    // Wait for confirmation heading with retry logic
    await expect(async () => {
      await expect(this.confirmationHeading)
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
      const text = await this.confirmationNumberValue.textContent();
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
      if (await this.serviceName.isVisible()) {
        const text = await this.serviceName.textContent();
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
      if (await this.locationName.isVisible()) {
        return await this.locationName.textContent() || undefined;
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
      if (await this.dateTimeSection.isVisible()) {
        return await this.dateTimeSection.textContent() || undefined;
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
      // First ensure the personal details section is visible
      if (await this.personalDetailsSection.isVisible({ timeout: 5000 })) {
        // Try to get the customer name from the personal details section
        const nameElement = this.customerName;
        if (await nameElement.isVisible({ timeout: 3000 })) {
          const nameText = await nameElement.textContent();
          return nameText || undefined;
        }
      }
    } catch (error) {
      // Log error for debugging but don't throw
      console.warn('Could not find customer name in confirmation page:', error);
    }
    return undefined;
  }

  /**
   * Get the customer email from confirmation.
   * @returns Promise resolving to customer email or undefined
   */
  async getCustomerEmail(): Promise<string | undefined> {
    try {
      if (await this.personalDetailsSection.isVisible({ timeout: 5000 })) {
        if (await this.customerEmail.isVisible({ timeout: 3000 })) {
          return await this.customerEmail.textContent() || undefined;
        }
      }
    } catch (error) {
      console.warn('Could not find customer email in confirmation page:', error);
    }
    return undefined;
  }

  /**
   * Get the customer phone from confirmation.
   * @returns Promise resolving to customer phone or undefined
   */
  async getCustomerPhone(): Promise<string | undefined> {
    try {
      // Try to find phone number anywhere on the page
      if (await this.customerPhone.isVisible({ timeout: 5000 })) {
        return await this.customerPhone.textContent() || undefined;
      }
    } catch (error) {
      console.warn('Could not find customer phone in confirmation page:', error);
    }
    return undefined;
  }

  /**
   * Get the meeting preference from confirmation.
   * @returns Promise resolving to meeting preference or undefined
   */
  async getMeetingPreference(): Promise<string | undefined> {
    try {
      if (await this.meetingPreferenceValue.isVisible()) {
        return await this.meetingPreferenceValue.textContent() || undefined;
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
    return await this.cancelButton.isVisible();
  }

  /**
   * Click the cancel appointment button if available.
   * @returns Promise resolving when cancel button is clicked
   */
  async clickCancelButton(): Promise<void> {
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
  }

  /**
   * Handle cancellation popup by dismissing (clicking No/Cancel).
   * @returns Promise resolving when popup is dismissed
   */
  async dismissCancellationPopup(): Promise<void> {
    // Verify cancellation popup appeared
    await expect(this.cancellationPopupText).toBeVisible({ timeout: 1000 });
    
    await expect(this.dismissPopupButton).toBeVisible({ timeout: 10000 });
    await this.dismissPopupButton.click();
  }

  /**
   * Handle cancellation popup by confirming (clicking Yes/Confirm).
   * @returns Promise resolving when cancellation is confirmed
   */
  async confirmCancellationPopup(): Promise<void> {
    await expect(this.confirmPopupButton).toBeVisible({ timeout: 10000 });
    await this.confirmPopupButton.click();
  }

  /**
   * Wait for cancellation confirmation message to appear.
   * @param timeout - Maximum time to wait
   * @returns Promise resolving when cancellation confirmation is visible
   */
  async waitForCancellationConfirmation(timeout: number = 30000): Promise<void> {
    await expect(this.cancellationConfirmationMessage).toBeVisible({ timeout });
  }

  /**
   * Verify that appointment is marked as cancelled on the page.
   * @returns Promise resolving to true if cancellation is confirmed
   */
  async verifyAppointmentCancelled(): Promise<boolean> {
    try {
      for (const indicator of this.cancelledIndicators) {
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
    return await this.bookAnotherButton.isVisible().catch(() => false); // Don't fail if not found
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
      return await this.confirmationHeading.isVisible();
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

  /**
   * Click the edit date and time link to modify appointment date/time.
   * @returns Promise resolving when edit link is clicked
   */
  async clickEditDateTime(): Promise<void> {
    await expect(this.editDateTimeLink).toBeVisible();
    await this.editDateTimeLink.click();
  }

  /**
   * Click the edit personal details link to modify customer information.
   * @returns Promise resolving when edit link is clicked
   */
  async clickEditPersonalDetails(): Promise<void> {
    await expect(this.editPersonalDetailsLink).toBeVisible();
    await this.editPersonalDetailsLink.click();
  }

  /**
   * Check if all edit links are visible on the confirmation page.
   * @returns Promise resolving to true if edit links are visible
   */
  async areEditLinksVisible(): Promise<boolean> {
    try {
      const dateTimeEditVisible = await this.editDateTimeLink.isVisible().catch(() => false);
      const personalDetailsEditVisible = await this.editPersonalDetailsLink.isVisible().catch(() => false);
      const locationEditVisible = await this.editLocationLink.isVisible().catch(() => false);
      const serviceEditVisible = await this.editServiceLink.isVisible().catch(() => false);
      
      return dateTimeEditVisible && personalDetailsEditVisible && locationEditVisible && serviceEditVisible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click the Book Another button to start a new booking flow.
   * @returns Promise resolving when Book Another button is clicked
   */
  async clickBookAnother(): Promise<void> {
    await expect(this.bookAnotherButton).toBeVisible();
    await this.bookAnotherButton.click();
  }

  /**
   * Verify that the appointment is in non-editable state.
   * Checks for non-editable message, disabled cancel button, and absence of edit links.
   * @returns Promise resolving to true if appointment is non-editable
   */
  async verifyNonEditableState(): Promise<boolean> {
    try {
      // Check for non-editable message
      const nonEditableMessageVisible = await this.nonEditableMessage.isVisible().catch(() => false);
      
      // Check that cancel button is disabled
      const cancelButtonDisabled = await this.disabledCancelButton.isDisabled().catch(() => false);
      
      // Check that edit links are NOT visible
      const editDateTimeVisible = await this.editDateTimeLink.isVisible().catch(() => false);
      const editLocationVisible = await this.editLocationLink.isVisible().catch(() => false);
      const editServiceVisible = await this.editServiceLink.isVisible().catch(() => false);
      const editPersonalDetailsVisible = await this.editPersonalDetailsLink.isVisible().catch(() => false);
      const editMeetingPreferenceVisible = await this.editMeetingPreferenceLink.isVisible().catch(() => false);
      const editStaffVisible = await this.editStaffLink.isVisible().catch(() => false);
      
      // Verify non-editable conditions
      const hasNonEditableMessage = nonEditableMessageVisible;
      const isCancelDisabled = cancelButtonDisabled;
      const noEditLinksVisible = !editDateTimeVisible && !editLocationVisible && 
                                !editServiceVisible && !editPersonalDetailsVisible && 
                                !editMeetingPreferenceVisible && !editStaffVisible;
      
      return hasNonEditableMessage && isCancelDisabled && noEditLinksVisible;
    } catch (error) {
      // Return false if verification fails
      return false;
    }
  }

  /**
   * Verify that all edit controls are not visible/accessible.
   * @returns Promise resolving to true if no edit controls are visible
   */
  async verifyNoEditControlsVisible(): Promise<boolean> {
    try {
      const editLinksVisible = await this.areEditLinksVisible();
      return !editLinksVisible; // Should be false for non-editable appointment
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify that cancel button is disabled.
   * @returns Promise resolving to true if cancel button is disabled
   */
  async verifyCancelButtonDisabled(): Promise<boolean> {
    try {
      return await this.disabledCancelButton.isDisabled();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify that the phone appointment message is displayed.
   * @returns Promise resolving to true if phone appointment message is visible
   */
  async verifyPhoneAppointmentMessageDisplayed(): Promise<boolean> {
    try {
      return await this.phoneAppointmentNote.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify that non-editable message is displayed.
   * @returns Promise resolving to true if message is visible
   */
  async verifyNonEditableMessageDisplayed(): Promise<boolean> {
    try {
      return await this.nonEditableMessage.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Attempt to interact with edit controls (should fail for non-editable appointments).
   * @returns Promise resolving to true if interactions fail as expected
   */
  async verifyEditControlsNotInteractive(): Promise<boolean> {
    try {
      // Try to click edit links - they should not be visible or clickable
      const editDateTimeClickable = await this.editDateTimeLink.isVisible().then(async (visible) => {
        if (!visible) return false;
        try {
          await this.editDateTimeLink.click({ timeout: 1000 });
          return true;
        } catch {
          return false;
        }
      }).catch(() => false);

      const cancelClickable = await this.disabledCancelButton.isEnabled().then(async (enabled) => {
        if (!enabled) return false;
        try {
          await this.disabledCancelButton.click({ timeout: 1000 });
          return true;
        } catch {
          return false;
        }
      }).catch(() => false);

      // For non-editable appointment, these should not be interactive
      return !editDateTimeClickable && !cancelClickable;
    } catch (error) {
      return false;
    }
  }
}
