import { ApiClient } from './apiClient';

/**
 * Interface for service category creation request.
 */
export interface ServiceCategoryRequest {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

/**
 * Interface for service creation request.
 */
export interface ServiceRequest {
  name: string;
  code: string;
  description?: string;
  serviceCategoryId: number;
  duration: number;
  isActive: boolean;
}

/**
 * Interface for location creation request.
 */
export interface LocationRequest {
  name: string;
  code: string;
  address?: string;
  isActive: boolean;
}

/**
 * Interface for user availability setup request.
 */
export interface UserAvailabilityRequest {
  userCode: string;
  locationCode: string;
  serviceCode: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

/**
 * Client for provisioning API operations including services, locations, and availability setup.
 * Extends the base ApiClient with domain-specific methods for test data setup.
 */
export class ProvisioningClient extends ApiClient {
  /**
   * Create a new service category.
   * @param categoryData - Service category details
   * @returns Promise resolving to the created service category
   */
  async createServiceCategory(categoryData: ServiceCategoryRequest): Promise<any> {
    const provisioningRequest = {
      clientId: 1, // Default client ID - should be configurable
      data: [categoryData],
    };

    return this.post('/api/provisioning/ProvisionServiceCategories', provisioningRequest);
  }

  /**
   * Create a new service.
   * @param serviceData - Service details
   * @returns Promise resolving to the created service
   */
  async createService(serviceData: ServiceRequest): Promise<any> {
    const provisioningRequest = {
      clientId: 1, // Default client ID - should be configurable
      data: [serviceData],
    };

    return this.post('/api/provisioning/ProvisionServices', provisioningRequest);
  }

  /**
   * Create a new location.
   * @param locationData - Location details
   * @returns Promise resolving to the created location
   */
  async createLocation(locationData: LocationRequest): Promise<any> {
    const provisioningRequest = {
      clientId: 1, // Default client ID - should be configurable
      data: [locationData],
    };

    return this.post('/api/provisioning/ProvisionLocations', provisioningRequest);
  }

  /**
   * Setup user availability for a service at a location.
   * @param availabilityData - User availability details
   * @returns Promise resolving to the created availability
   */
  async setupUserAvailability(availabilityData: UserAvailabilityRequest): Promise<any> {
    const provisioningRequest = {
      clientId: 1, // Default client ID - should be configurable
      data: [availabilityData],
    };

    return this.post('/api/provisioning/ProvisionUserAvailability', provisioningRequest);
  }

  /**
   * Setup location hours of operation.
   * @param locationCode - Location code
   * @param hoursData - Hours of operation data
   * @returns Promise resolving to the setup result
   */
  async setupLocationHours(locationCode: string, hoursData: any): Promise<any> {
    const provisioningRequest = {
      clientId: 1, // Default client ID - should be configurable
      data: [{
        locationCode,
        ...hoursData,
      }],
    };

    return this.post('/api/provisioning/ProvisionLocationHoursOfOperation', provisioningRequest);
  }

  /**
   * Create holidays for a location.
   * @param holidaysData - Array of holiday data
   * @returns Promise resolving to the created holidays
   */
  async createHolidays(holidaysData: any[]): Promise<any> {
    const provisioningRequest = {
      clientId: 1, // Default client ID - should be configurable
      data: holidaysData,
    };

    return this.post('/api/provisioning/ProvisionHolidays', provisioningRequest);
  }

  /**
   * Create a complete test setup with service category, service, location, and availability.
   * @param setupData - Complete setup data
   * @returns Promise resolving to all created entities
   */
  async createCompleteSetup(setupData: {
    serviceCategory: ServiceCategoryRequest;
    service: ServiceRequest;
    location: LocationRequest;
    availability: UserAvailabilityRequest;
  }): Promise<{
    serviceCategory: any;
    service: any;
    location: any;
    availability: any;
  }> {
    const serviceCategory = await this.createServiceCategory(setupData.serviceCategory);
    
    // Update service with the created service category ID
    const serviceWithCategory = {
      ...setupData.service,
      serviceCategoryId: serviceCategory.id,
    };
    const service = await this.createService(serviceWithCategory);
    
    const location = await this.createLocation(setupData.location);
    
    // Update availability with created service and location codes
    const availabilityWithEntities = {
      ...setupData.availability,
      serviceCode: service.code,
      locationCode: location.code,
    };
    const availability = await this.setupUserAvailability(availabilityWithEntities);

    return {
      serviceCategory,
      service,
      location,
      availability,
    };
  }

  /**
   * Static factory method to create a ProvisioningClient instance.
   * @param baseUrl - The base URL for API requests
   * @param options - Optional configuration for request context
   * @returns Promise resolving to ProvisioningClient instance
   */
  static override async create(baseUrl: string, options?: { extraHTTPHeaders?: Record<string, string> }): Promise<ProvisioningClient> {
    const apiClient = await ApiClient.create(baseUrl, options);
    const client = Object.assign(new ProvisioningClient(baseUrl), apiClient);
    return client;
  }
}
