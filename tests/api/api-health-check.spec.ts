import { test, expect } from '@playwright/test';
import { ProvisioningClient } from '../../src/api/ProvisioningClient';

test.describe('API Health Checks', () => {
  let provisioningClient: ProvisioningClient;
  const baseUrl = process.env.API_BASE_URL || 'https://ac-qa.fmsidev.us';

  test.beforeAll(async () => {
    provisioningClient = await ProvisioningClient.create(baseUrl);
  });

  test.afterAll(async () => {
    await provisioningClient.dispose();
  });

  test('ProvisioningClient - Create Service Category', async () => {
    const categoryData = {
      name: 'Test Category',
      code: 'TEST-CAT-001',
      description: 'Test category for API verification',
      isActive: true
    };

    try {
      const result = await provisioningClient.createServiceCategory(categoryData);
      console.log('✅ Service Category Created:', result);
      expect(result).toBeDefined();
      expect(result.name).toBe(categoryData.name);
    } catch (error) {
      console.error('❌ Service Category Creation Failed:', error);
      throw error;
    }
  });

  test('ProvisioningClient - Create Service', async () => {
    const serviceData = {
      name: 'Test Service',
      code: 'TEST-SVC-001',
      description: 'Test service for API verification',
      serviceCategoryId: 1, // Assuming category ID 1 exists
      duration: 30,
      isActive: true
    };

    try {
      const result = await provisioningClient.createService(serviceData);
      console.log('✅ Service Created:', result);
      expect(result).toBeDefined();
      expect(result.name).toBe(serviceData.name);
    } catch (error) {
      console.error('❌ Service Creation Failed:', error);
      throw error;
    }
  });

  test('ProvisioningClient - Create Location', async () => {
    const locationData = {
      name: 'Test Location',
      code: 'TEST-LOC-001',
      address: '123 Test Street',
      isActive: true
    };

    try {
      const result = await provisioningClient.createLocation(locationData);
      console.log('✅ Location Created:', result);
      expect(result).toBeDefined();
      expect(result.name).toBe(locationData.name);
    } catch (error) {
      console.error('❌ Location Creation Failed:', error);
      throw error;
    }
  });
});
