import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/apiClient';
import { ProductService } from '../../src/api/ProductService';
import serviceData from '../../src/data/services.json';
import { AdminService } from '@/api/AdminService';

test('Verify service details via API setup', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);

  const response = await productService.getProductById(54, 1108);
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  console.log(data);
});


test.describe('Admin System Settings Data Setup', () => {
  let adminService: AdminService;

  test.beforeEach(async ({ request }) => {
    const apiClient = new ApiClient(request);
    adminService = new AdminService(apiClient);
  });

  test('should enable email and phone requirements', async () => {
    const response = await adminService.updateContactRequirements(true, true);
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    // Validate the response contains the updated values
    const config = body.Entities[0];
    expect(config.RequireCustomerEmail).toBe(true);
    expect(config.RequireCustomerPhone).toBe(true);
  });

  test('should disable email and phone requirements', async () => {
    const response = await adminService.updateContactRequirements(false, false);
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    const config = body.Entities[0];
    expect(config.RequireCustomerEmail).toBe(false);
    expect(config.RequireCustomerPhone).toBe(false);
  });
});


// // guessing that these created a data issue in some survices. therefore keeping them commented.
// test('Update service via API- DisableAppointmentCancellationOrUpdate=false', async ({ request }) => {
//   const apiClient = new ApiClient(request);
//   const productService = new ProductService(apiClient);

//   // Test with disableCancellation set to false (overriding the JSON default of true)
//   const response = await productService.UpdateService(
//     serviceData.updatePersonalAccount.serviceData, 
//     serviceData.updatePersonalAccount.saveOptions,
//     false // Override DisableAppointmentCancellationOrUpdate to false
//   );
  
//   expect(response.ok()).toBeTruthy();
//   const data = await response.json();
  
//   console.log('Service updated successfully:', data);
// });

// test('Update service via API- DisableAppointmentCancellationOrUpdate=true', async ({ request }) => {
//   const apiClient = new ApiClient(request);
//   const productService = new ProductService(apiClient);

//   // Test with disableCancellation set to true (overriding the JSON default of true)
//   const response = await productService.UpdateService(
//     serviceData.updatePersonalAccount.serviceData, 
//     serviceData.updatePersonalAccount.saveOptions,
//     true // Override DisableAppointmentCancellationOrUpdate to true
//   );
  
//   expect(response.ok()).toBeTruthy();
//   const data = await response.json();
  
//   console.log('Service updated successfully:', data);
// });