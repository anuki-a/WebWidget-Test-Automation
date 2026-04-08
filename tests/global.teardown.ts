import { test } from '@playwright/test';
import { request } from '@playwright/test';
import { ApiClient } from '../src/api/apiClient';
import { AdminService } from '../src/api/AdminService';

/**
 * Global teardown function to clean up holidays after test suite completion
 * This runs automatically after all tests finish
 */
async function globalTeardown() {
  console.log('Starting global holiday cleanup...');
  
  try {
    // Create API client and admin service with proper request context
    const apiRequestContext = await request.newContext();
    const apiClient = new ApiClient(apiRequestContext);
    const adminService = new AdminService(apiClient);

    const year = 2026;
    const clientId = 54;
    const locationId = 1;
    const targetHolidayPattern = /^Auto Holiday \d{4}-\d{2}-\d{2}$/;
    const targetPartialHolidayName = "Auto Half Holiday";

    // Clean up full holidays
    try {
      console.log('Cleaning up full holidays...');
      const getResponse = await adminService.getAllHolidays(year, clientId, locationId);
      
      if (getResponse.ok()) {
        const holidays = await getResponse.json();
        
        if (Array.isArray(holidays) && holidays.length > 0) {
          const holidaysToDelete = holidays[0].Location.Holidays.filter((h: any) => {
            return h.HolidayName && targetHolidayPattern.test(h.HolidayName);
          });

          if (holidaysToDelete.length > 0) {
            console.log(`Found ${holidaysToDelete.length} full holidays to cleanup`);
            
            let deletedCount = 0;
            for (const holiday of holidaysToDelete) {
              try {
                const deleteResponse = await adminService.deleteHoliday(holiday, clientId);
                if (deleteResponse.ok()) {
                  console.log(`Successfully deleted full holiday: ${holiday.HolidayName}`);
                  deletedCount++;
                }
              } catch (error) {
                console.log(`Error deleting full holiday ${holiday.HolidayName}: ${error}`);
              }
            }
            console.log(`Full holiday cleanup completed: ${deletedCount}/${holidaysToDelete.length} deleted`);
          } else {
            console.log('No auto-generated full holidays found to cleanup');
          }
        }
      }
    } catch (error) {
      console.log(`Error during full holiday cleanup: ${error}`);
    }

    // Clean up partial holidays
    try {
      console.log('Cleaning up partial holidays...');
      const getResponse = await adminService.getAllHolidays(year, clientId, locationId);
      
      if (getResponse.ok()) {
        const holidays = await getResponse.json();
        
        if (Array.isArray(holidays) && holidays.length > 0) {
          const holidayToDelete = holidays[0].Location.Holidays.find((h: any) => {
            return h.HolidayName && h.HolidayName === targetPartialHolidayName;
          });

          if (holidayToDelete) {
            try {
              const deleteResponse = await adminService.deleteHoliday(holidayToDelete, clientId);
              if (deleteResponse.ok()) {
                console.log(`Successfully deleted partial holiday: ${targetPartialHolidayName}`);
              }
            } catch (error) {
              console.log(`Error deleting partial holiday ${targetPartialHolidayName}: ${error}`);
            }
          } else {
            console.log(`Partial holiday "${targetPartialHolidayName}" not found - no cleanup needed`);
          }
        }
      }
    } catch (error) {
      console.log(`Error during partial holiday cleanup: ${error}`);
    }

    console.log('Global holiday cleanup completed');
    
    // Clean up request context
    await apiRequestContext.dispose();
    
  } catch (error) {
    console.log(`Global teardown failed: ${error} - continuing without cleanup`);
  }
}

export default globalTeardown;
