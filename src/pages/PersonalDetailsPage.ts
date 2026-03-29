import { Page, Locator, expect } from '@playwright/test';
import { CustomerData } from '../utils/testDataBuilder';

/**
 * Personal details page for entering customer information.
 * Handles form filling and submission for customer details.
 */
export class PersonalDetailsPage {
  private page: Page;
  
  // Reusable locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly bookAppointmentButton: Locator;
  readonly personalDetailsHeading: Locator;

  /**
   * Initialize the personal details page.
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.firstNameInput = page.getByRole("textbox", { name: "First Name *" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name *" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.phoneInput = page.getByRole("textbox", { name: "Phone No." });
    this.bookAppointmentButton = page.getByRole("button", {
      name: "Book My Appointment",
    });
    this.personalDetailsHeading = page.getByRole("heading", {
      name: "Personal Details",
    });
  }

  /**
   * Wait for the personal details page to be loaded and visible.
   * @param timeout - Maximum time to wait
   */
  async waitForPersonalDetailsPage(timeout: number = 30000): Promise<void> {
    // Wait for personal details heading to be visible
    await expect(this.personalDetailsHeading).toBeVisible({ timeout });
  }

  /**
   * Fill customer details in the form.
   * @param customerData - Customer information to fill
   * @returns Promise resolving when form is filled
   */
  async fillDetails(customerData: CustomerData): Promise<void> {
    await this.waitForPersonalDetailsPage();
    
    // Fill first name
    await this.fillFirstName(customerData.firstName);
    
    // Fill last name
    await this.fillLastName(customerData.lastName);
    
    // Fill email (optional)
    if (customerData.email) {
      await this.fillEmail(customerData.email);
    }
    
    // Fill phone (optional)
    if (customerData.phone) {
      await this.fillPhone(customerData.phone);
    }
  }

  /**
   * Fill first name field.
   * @param firstName - First name to fill
   */
  async fillFirstName(firstName: string): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Fill last name field.
   * @param lastName - Last name to fill
   */
  async fillLastName(lastName: string): Promise<void> {
    await expect(this.lastNameInput).toBeVisible();
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fill email field.
   * @param email - Email to fill
   */
  async fillEmail(email: string): Promise<void> {
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(email);
    }
  }

  /**
   * Fill phone field.
   * @param phone - Phone number to fill
   */
  async fillPhone(phone: string): Promise<void> {
    if (await this.phoneInput.isVisible()) {
      await this.phoneInput.fill(phone);
    }
  }

  /**
   * Submit the booking form.
   * @returns Promise resolving when form is submitted
   */
  async submit(): Promise<void> {
    await expect(this.bookAppointmentButton).toBeVisible();
    await this.bookAppointmentButton.click();
  }

  /**
   * Fill details and submit in one operation.
   * @param customerData - Customer information to fill and submit
   * @returns Promise resolving when form is submitted
   */
  async fillAndSubmit(customerData: CustomerData): Promise<void> {
    await this.fillDetails(customerData);
    await this.submit();
  }

  /**
   * Get the current value of the first name field.
   * @returns Promise resolving to the first name value
   */
  async getFirstName(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  /**
   * Get the current value of the last name field.
   * @returns Promise resolving to the last name value
   */
  async getLastName(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  /**
   * Get the current value of the email field.
   * @returns Promise resolving to the email value
   */
  async getEmail(): Promise<string> {
    if (await this.emailInput.isVisible()) {
      return await this.emailInput.inputValue();
    }
    return '';
  }

  /**
   * Get the current value of the phone field.
   * @returns Promise resolving to the phone value
   */
  async getPhone(): Promise<string> {
    if (await this.phoneInput.isVisible()) {
      return await this.phoneInput.inputValue();
    }
    return '';
  }

  /**
   * Check if the form is properly filled.
   * @param customerData - Customer data to validate against
   * @returns Promise resolving to true if form is correctly filled
   */
  async validateFormFilled(customerData: CustomerData): Promise<boolean> {
    try {
      const currentFirstName = await this.getFirstName();
      const currentLastName = await this.getLastName();
      const currentEmail = await this.getEmail();
      const currentPhone = await this.getPhone();
      
      return currentFirstName === customerData.firstName &&
             currentLastName === customerData.lastName &&
             (!customerData.email || currentEmail === customerData.email) &&
             (!customerData.phone || currentPhone === customerData.phone);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify that the personal details page is properly loaded.
   * @returns Promise resolving to true if page is loaded correctly
   */
  async verifyPersonalDetailsPageLoaded(): Promise<boolean> {
    try {
      await this.waitForPersonalDetailsPage(10000);
      return await this.firstNameInput.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for form submission to complete and confirmation page to load.
   * @param timeout - Maximum time to wait
   */
  async waitForSubmissionComplete(timeout: number = 220000): Promise<void> {
    // Wait for confirmation page elements to appear
    await this.page.waitForSelector('text=/.*appointment has been scheduled/', {
      timeout,
      state: 'visible',
    });
  }

  /**
   * Check if there are any validation errors on the form.
   * @returns Promise resolving to array of error messages
   */
  async getEmailValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    // Check specifically for "Email is invalid" text anywhere on the page
    try {
      const emailInvalidText = this.page.locator('text=Email is invalid');
      if (await emailInvalidText.isVisible()) {
        errors.push("Email is invalid");
      }
    } catch (error) {
      // Continue if check fails
    }
    
    return errors;
  }

  /**
   * Check for email validation errors using comprehensive selectors.
   * @returns Promise resolving to array of email validation error messages
   */
  async getEmailValidationErrorsComprehensive(): Promise<string[]> {
    const errors: string[] = [];
    
    const emailErrorSelectors = [
      'text=Email is required',
      'text=Email is invalid', 
      'text=Please enter a valid email',
      'text=Valid email required',
      'text=Email address is required',
      '[data-testid="email-error"]',
      '.email-error',
      '.error-message[data-field="email"]',
      '[aria-label*="email error"]',
      '.validation-error:has-text("email")',
      'span.error:has-text("Email")',
      '.field-error:has-text("Email")'
    ];
    
    for (const selector of emailErrorSelectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible({ timeout: 1000 })) {
          const text = await element.textContent();
          if (text && text.trim()) {
            errors.push(text.trim());
            break; // Stop after finding first error
          }
        }
      } catch (error) {
        // Continue if selector not found
      }
    }
    
    return errors;
  }

  /**
   * Check for phone validation errors using comprehensive selectors.
   * @returns Promise resolving to array of phone validation error messages
   */
  async getPhoneValidationErrorsComprehensive(): Promise<string[]> {
    const errors: string[] = [];
    
    const phoneErrorSelectors = [
      'text=Phone is required',
      'text=Phone is invalid',
      'text=Please enter a valid phone number', 
      'text=Phone No. is required',
      'text=Phone No. is invalid',
      'text=Valid phone required',
      '[data-testid="phone-error"]',
      '.phone-error',
      '.error-message[data-field="phone"]',
      '[aria-label*="phone error"]',
      '.validation-error:has-text("phone")',
      'span.error:has-text("Phone")',
      '.field-error:has-text("Phone")'
    ];
    
    for (const selector of phoneErrorSelectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible({ timeout: 1000 })) {
          const text = await element.textContent();
          if (text && text.trim()) {
            errors.push(text.trim());
            break; // Stop after finding first error
          }
        }
      } catch (error) {
        // Continue if selector not found
      }
    }
    
    return errors;
  }

  /**
   * Check if the submit button is enabled.
   * @returns Promise resolving to true if submit button is enabled
   */
  async isSubmitEnabled(): Promise<boolean> {
    try {
      // First check if button is visible
      const isVisible = await this.bookAppointmentButton.isVisible({ timeout: 5000 });
      if (!isVisible) {
        return false; // Button not visible means it's not enabled
      }
      
      // Check if button is disabled
      const isDisabled = await this.bookAppointmentButton.isDisabled();
      return !isDisabled;
    } catch (error) {
      // If any error occurs, assume button is not enabled
      return false;
    }
  }

  /**
   * Scenario: Leave both email, phone number blank and click 'book appointment'
   * Expected: Submission not allowed. validation messages shown 'Email is required','Phone.No is required'
   */
  async validateBlankEmailPhoneFields(customerData: CustomerData): Promise<{emailErrors: string[], phoneErrors: string[]}> {
    // Fill only name fields, leave email and phone blank
    await this.fillFirstName(customerData.firstName);
    await this.fillLastName(customerData.lastName);
    
    // Clear email and phone fields
    await this.emailInput.fill('');
    await this.phoneInput.fill('');
    
    // Try to submit
    await this.submit();
    
    // Get validation errors
    const emailErrors = await this.getEmailValidationErrorsComprehensive();
    const phoneErrors = await this.getPhoneValidationErrorsComprehensive();
    
    return { emailErrors, phoneErrors };
  }

  /**
   * Scenario: Invalid email and valid phone and click 'book appointment'
   * Expected: Email format blocked
   */
  async validateInvalidEmailFormat(customerData: CustomerData, invalidEmail: string): Promise<string[]> {
    // Fill name fields
    await this.fillFirstName(customerData.firstName);
    await this.fillLastName(customerData.lastName);
    
    // Fill invalid email and valid phone
    await this.fillEmail(invalidEmail);
    await this.fillPhone(customerData.phone || '555-123-4567');
    
    // Try to submit
    await this.submit();
    
    // Get email validation errors
    return await this.getEmailValidationErrorsComprehensive();
  }

  /**
   * Scenario: Invalid phone and valid email and click 'book appointment'
   * Expected: Phone format blocked
   */
  async validateInvalidPhoneFormat(customerData: CustomerData, invalidPhone: string): Promise<string[]> {
    // Fill name fields
    await this.fillFirstName(customerData.firstName);
    await this.fillLastName(customerData.lastName);
    
    // Fill valid email and invalid phone
    await this.fillEmail(customerData.email || 'test@example.com');
    await this.fillPhone(invalidPhone);
    
    // Try to submit
    await this.submit();
    
    // Get phone validation errors
    return await this.getPhoneValidationErrorsComprehensive();
  }

  /**
   * Scenario: Provide valid value for email and click 'book appointment'
   * Expected: Submission not allowed. validation messages shown 'Phone.No is required'
   */
  async validateValidEmailMissingPhone(customerData: CustomerData): Promise<string[]> {
    // Fill name fields and valid email
    await this.fillFirstName(customerData.firstName);
    await this.fillLastName(customerData.lastName);
    await this.fillEmail(customerData.email);
    
    // Clear phone field
    await this.phoneInput.fill('');
    
    // Try to submit
    await this.submit();
    
    // Get phone validation errors
    return await this.getPhoneValidationErrorsComprehensive();
  }

  /**
   * Scenario: Provide valid value for phone and click 'book appointment'
   * Expected: Submission not allowed. validation messages shown 'Email is required'
   */
  async validateValidPhoneMissingEmail(customerData: CustomerData): Promise<string[]> {
    // Fill name fields and valid phone
    await this.fillFirstName(customerData.firstName);
    await this.fillLastName(customerData.lastName);
    await this.fillPhone(customerData.phone);
    
    // Clear email field
    await this.emailInput.fill('');
    
    // Try to submit
    await this.submit();
    
    // Get email validation errors
    return await this.getEmailValidationErrorsComprehensive();
  }

  /**
   * Scenario: Provide valid values and click 'book appointment'
   * Expected: Submission allowed, Navigated to Confirmation Page
   */
  async submitWithValidDetails(customerData: CustomerData): Promise<void> {
    // Fill all fields with valid data
    await this.fillFirstName(customerData.firstName);
    await this.fillLastName(customerData.lastName);
    await this.fillEmail(customerData.email);
    await this.fillPhone(customerData.phone);
    
    // Verify form is properly filled
    const isFormValid = await this.validateFormFilled(customerData);
    if (!isFormValid) {
      throw new Error('Form validation failed - some fields are not properly filled');
    }
    
    // Verify submit button is enabled
    const isSubmitEnabled = await this.isSubmitEnabled();
    if (!isSubmitEnabled) {
      throw new Error('Submit button is not enabled');
    }
    
    // Submit the form
    await this.submit();
    
    // Wait for navigation to confirmation page
    await this.waitForSubmissionComplete();
  }
}
