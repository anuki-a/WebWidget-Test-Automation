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
    await this.page.waitForSelector('text=/.*appointment has been scheduled/, [data-testid="confirmation"]', {
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
}
