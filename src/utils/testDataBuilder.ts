/**
 * Interface for customer data used in tests.
 */
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Interface for service category test data.
 */
export interface ServiceCategoryData {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

/**
 * Interface for service test data.
 */
export interface ServiceData {
  name: string;
  code: string;
  description?: string;
  duration: number;
  isActive: boolean;
}

/**
 * Interface for location test data.
 */
export interface LocationData {
  name: string;
  code: string;
  address?: string;
  isActive: boolean;
}

/**
 * Utility class for generating test data for automation tests.
 * Provides methods to create realistic, randomized test data while maintaining consistency.
 */
export class TestDataBuilder {
  private static readonly FIRST_NAMES = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
    'James', 'Mary', 'William', 'Patricia', 'Richard', 'Jennifer', 'Joseph', 'Linda'
  ];

  private static readonly LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson'
  ];

  private static readonly SERVICE_CATEGORIES = [
    { name: 'Personal Accounts', code: 'PERSONAL' },
    { name: 'Business Services', code: 'BUSINESS' },
    { name: 'Mortgage Services', code: 'MORTGAGE' },
    { name: 'Investment Services', code: 'INVESTMENT' },
    { name: 'Insurance Services', code: 'INSURANCE' }
  ];

  private static readonly SERVICES = [
    { name: 'Update Personal Account', code: 'UPDATE_PERSONAL', duration: 60 },
    { name: 'Open New Account', code: 'OPEN_ACCOUNT', duration: 45 },
    { name: 'Account Review', code: 'ACCOUNT_REVIEW', duration: 30 },
    { name: 'Loan Application', code: 'LOAN_APP', duration: 90 },
    { name: 'Investment Consultation', code: 'INVEST_CONSULT', duration: 60 }
  ];

  private static readonly LOCATIONS = [
    { name: 'McKinney 2093 N. Central', code: 'MCKINNEY_CENTRAL' },
    { name: 'Dallas Main Branch', code: 'DALLAS_MAIN' },
    { name: 'Plano Legacy Branch', code: 'PLANO_LEGACY' },
    { name: 'Frisco Starwood', code: 'FRISCO_STAR' },
    { name: 'Allen Watters Creek', code: 'ALLEN_CREEK' }
  ];

  /**
   * Generate a random customer with realistic data.
   * @param seed - Optional seed for reproducible random data
   * @returns Customer data object
   */
  static generateCustomer(seed?: number): CustomerData {
    const random = seed ? this.seededRandom(seed) : Math.random;
    
    const firstName = this.getRandomElement(this.FIRST_NAMES, () => random());
    const lastName = this.getRandomElement(this.LAST_NAMES, () => random());
    const email = this.generateEmail(firstName, lastName, () => random());
    const phone = this.generatePhone(() => random());

    return {
      firstName,
      lastName,
      email,
      phone,
    };
  }

  /**
   * Generate a service category for testing.
   * @param index - Index for deterministic selection
   * @returns Service category data
   */
  static generateServiceCategory(index: number = 0): ServiceCategoryData {
    const category = this.SERVICE_CATEGORIES[index % this.SERVICE_CATEGORIES.length];
    if (!category) {
      throw new Error(`Service category not found at index ${index}`);
    }
    
    return {
      name: category.name,
      code: `${category.code}_${Date.now()}`,
      description: `Test service category for ${category.name}`,
      isActive: true,
    };
  }

  /**
   * Generate a service for testing.
   * @param index - Index for deterministic selection
   * @param categoryId - Service category ID to associate with
   * @returns Service data
   */
  static generateService(index: number = 0, categoryId?: number): ServiceData {
    const service = this.SERVICES[index % this.SERVICES.length];
    if (!service) {
      throw new Error(`Service not found at index ${index}`);
    }
    
    return {
      name: service.name,
      code: `${service.code}_${Date.now()}`,
      description: `Test service for ${service.name}`,
      duration: service.duration,
      isActive: true,
    };
  }

  /**
   * Generate a location for testing.
   * @param index - Index for deterministic selection
   * @returns Location data
   */
  static generateLocation(index: number = 0): LocationData {
    const location = this.LOCATIONS[index % this.LOCATIONS.length];
    if (!location) {
      throw new Error(`Location not found at index ${index}`);
    }
    
    return {
      name: location.name,
      code: `${location.code}_${Date.now()}`,
      address: `${location.name} Address, Test City, TX 75070`,
      isActive: true,
    };
  }

  /**
   * Generate multiple customers for batch testing.
   * @param count - Number of customers to generate
   * @param seed - Optional seed for reproducible data
   * @returns Array of customer data
   */
  static generateCustomers(count: number, seed?: number): CustomerData[] {
    const customers: CustomerData[] = [];
    for (let i = 0; i < count; i++) {
      customers.push(this.generateCustomer(seed ? seed + i : undefined));
    }
    return customers;
  }

  /**
   * Generate a specific customer with known values for consistent testing.
   * @param type - Type of customer to generate (valid, invalid, edge cases)
   * @returns Customer data object
   */
  static generateSpecificCustomer(type: 'valid' | 'invalid-email' | 'invalid-phone' | 'edge-case'): CustomerData {
    switch (type) {
      case 'valid':
        return {
          firstName: 'Ronha',
          lastName: 'Smith',
          email: 'ronha.smith@example.com',
          phone: '512-555-9876',
        };
      case 'invalid-email':
        return {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '512-555-1234',
        };
      case 'invalid-phone':
        return {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phone: '123',
        };
      case 'edge-case':
        return {
          firstName: 'A',
          lastName: 'B',
          email: 'a.b@x.co',
          phone: '1-2-3-4-5',
        };
      default:
        return this.generateCustomer();
    }
  }

  /**
   * Generate email address from name components.
   * @param firstName - First name
   * @param lastName - Last name
   * @param random - Random function for variation
   * @returns Email address string
   */
  private static generateEmail(firstName: string, lastName: string, random: () => number): string {
    const domains = ['example.com', 'test.org', 'demo.net'];
    const domain = this.getRandomElement(domains, random);
    const variations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      `${firstName[0]?.toLowerCase() || ''}${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}.${lastName[0]?.toLowerCase() || ''}`,
    ];
    const email = this.getRandomElement(variations, random);
    return `${email}@${domain}`;
  }

  /**
   * Generate phone number in US format.
   * @param random - Random function for variation
   * @returns Phone number string
   */
  private static generatePhone(random: () => number): string {
    const areaCode = Math.floor(random() * 900) + 100;
    const prefix = Math.floor(random() * 900) + 100;
    const lineNumber = Math.floor(random() * 9000) + 1000;
    return `${areaCode}-${prefix}-${lineNumber}`;
  }

  /**
   * Get random element from array.
   * @param array - Array to select from
   * @param random - Random function
   * @returns Random element
   */
  private static getRandomElement<T>(array: T[], random: () => number): T {
    const element = array[Math.floor(random() * array.length)];
    if (element === undefined) {
      throw new Error('Array is empty or element selection failed');
    }
    return element;
  }

  /**
   * Seeded random number generator for reproducible test data.
   * @param seed - Seed value
   * @returns Random function
   */
  private static seededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }
}
