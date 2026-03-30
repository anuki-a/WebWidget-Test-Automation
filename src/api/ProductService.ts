import { ApiClient } from './apiClient';

/**
 * Service to handle product-related API calls.
 */
export class ProductService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Fetches product details by Client ID and Product ID.
   * Path: /OacWeb/oac/client/ServiceByIdOnly
   * * @param clientId - The unique identifier for the client (e.g., 54)
   * @param productId - The unique identifier for the product (e.g., 1108)
   */
  async getProductById(clientId: string | number, productId: string | number) {
    const endpoint = '/OacWeb/oac/client/ServiceByIdOnly';
    
    const params = {
      clientId: clientId.toString(),
      serviceId: productId.toString(),
    };

    // We use the 'get' method from ApiClient which automatically 
    // appends baseURL and default headers.
    const response = await this.client.get(endpoint, params);
    
    return response;
  }

  /**
   * Updates an existing service using the SaveService endpoint, with optional override for DisableAppointmentCancellationOrUpdate.
   * Path: /OacWeb/oac/client/SaveService
   * @param serviceData - The service entity data to update.
   * @param saveOptions - The save options including tag information.
   * @param disableCancellation - Optional override for DisableAppointmentCancellationOrUpdate field.
   * @returns Promise resolving to the API response.
   */
  async UpdateServiceDisableAppointmentCancellationOrUpdate(serviceData: any, saveOptions: any, disableCancellation?: boolean) {
    const endpoint = '/OacWeb/oac/client/SaveService';
    
    // Create a deep copy to avoid mutating the original data
    const modifiedServiceData = JSON.parse(JSON.stringify(serviceData));
    
    // Override DisableAppointmentCancellationOrUpdate if provided
    if (disableCancellation !== undefined) {
      modifiedServiceData.DisableAppointmentCancellationOrUpdate = disableCancellation;
      
      // Also update the originalValuesMap to reflect the change
      if (modifiedServiceData.entityAspect && modifiedServiceData.entityAspect.originalValuesMap) {
        modifiedServiceData.entityAspect.originalValuesMap.DisableAppointmentCancellationOrUpdate = !disableCancellation;
      }
    }
    
    const requestBody = {
      entities: [modifiedServiceData],
      saveOptions: saveOptions
    };

    const response = await this.client.post(endpoint, requestBody);
    
    return response;
  }

    /**
   * Saves or updates a service entity.
   * Path: /OacWeb/oac/client/SaveService
   * @param entities - Array of service objects to save.
   * @param saveOptions - Save options (e.g., tag containing clientId, flag, locationId).
   */
  async saveService(entities: any[], saveOptions: any) {
    const endpoint = '/OacWeb/oac/client/SaveService';
    
    const requestBody = {
      entities: entities,
      saveOptions: saveOptions
    };
    return await this.client.post(endpoint, requestBody);
  }

}