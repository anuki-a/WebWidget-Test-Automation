import { test } from '@playwright/test';
import { request } from '@playwright/test';
import dotenv from 'dotenv';
import { ApiClient } from '../src/api/apiClient';
import { AdminService } from '../src/api/AdminService';
import { AppointmentService } from '../src/api/AppointmentService';
import { distinctLocations } from '../src/fixtures/bookingFixture';

// Load environment variables
dotenv.config();

/**
 * Clean up appointments in specified locations if enabled via environment variable
 * @param apiRequestContext - Playwright request context for API calls
 */
async function cleanupAppointments(apiRequestContext: any) {
  // Debug: Show environment variable value
  console.log('DEBUG: DELETE_APPOINTMENTS_ON_TEARDOWN =', process.env.DELETE_APPOINTMENTS_ON_TEARDOWN);
  
  // Check if appointment deletion is enabled via environment variable
  const deleteAppointments = process.env.DELETE_APPOINTMENTS_ON_TEARDOWN === 'true';
  
  console.log('DEBUG: deleteAppointments =', deleteAppointments);
  
  if (!deleteAppointments) {
    console.log('Appointment deletion is disabled via DELETE_APPOINTMENTS_ON_TEARDOWN=false');
    return;
  }
  
  console.log('Starting appointment cleanup...');
  
  try {
    const apiClient = new ApiClient(apiRequestContext);
    const appointmentService = new AppointmentService(apiClient);
    
    // Get location codes from distinctLocations
    const targetLocationCodes = distinctLocations.map(location => location.locCode).filter((code): code is string => code !== undefined);
    console.log('Target location codes:', targetLocationCodes);
    
    // Get date range: today to 4 business days
    const { firstDate, lastDate } = appointmentService.getDateRangeForQuery();
    console.log('Date range:', { firstDate, lastDate });
    
    // 1. Get all appointments for the date range
    console.log('Fetching all appointments...');
    const allAppointmentsResponse = await appointmentService.getAllAppointments(
      54, 1, firstDate, lastDate, -1
    );
    
    if (!allAppointmentsResponse.ok()) {
      console.log('Failed to fetch appointments - skipping cleanup');
      return;
    }
    
    const allAppointments = await allAppointmentsResponse.json();
    console.log(`Found ${allAppointments.length} total appointments`);
    
    if (allAppointments.length === 0) {
      console.log('No appointments found in the specified date range. Nothing to delete.');
      return;
    }
    
    // 2. Filter appointments by target locations
    console.log('Filtering appointments by location...');
    const filteredAppointments = appointmentService.filterAppointmentsByLocation(
      allAppointments, targetLocationCodes
    );
    
    // Log appointment counts by location
    let totalAppointmentsToDelete = 0;
    Object.entries(filteredAppointments).forEach(([locationCode, appointments]) => {
      const locationName = distinctLocations.find(loc => loc.locCode === locationCode)?.confirmationName || locationCode;
      console.log(`${locationName} (${locationCode}): ${appointments.length} appointments`);
      totalAppointmentsToDelete += appointments.length;
    });
    
    if (totalAppointmentsToDelete === 0) {
      console.log('No appointments found in target locations. Nothing to delete.');
      return;
    }
    
    // 3. Get appointment IDs for detailed data
    const appointmentIds: number[] = [];
    Object.values(filteredAppointments).forEach(appointments => {
      appointments.forEach(appointment => {
        if (appointment.AppointmentId) {
          appointmentIds.push(appointment.AppointmentId);
        }
      });
    });
    
    console.log(`Getting detailed data for ${appointmentIds.length} appointments...`);
    const detailedAppointmentsResponse = await appointmentService.getAppointmentsByIds(appointmentIds);
    
    if (!detailedAppointmentsResponse.ok()) {
      console.log('Failed to get detailed appointment data - skipping deletion');
      return;
    }
    
    const detailedAppointments = await detailedAppointmentsResponse.json();
    console.log(`Retrieved ${detailedAppointments.length} detailed appointment records`);
    
    // 4. Bulk delete appointments
    console.log('Deleting appointments...');
    const deleteResponse = await appointmentService.bulkDeleteAppointments(detailedAppointments);
    
    if (!deleteResponse.ok()) {
      console.log('Failed to delete appointments');
      return;
    }
    
    const deleteResult = await deleteResponse.json();
    console.log('Deletion response:', deleteResult);
    
    // 5. Verify deletion success and log results
    console.log('\n=== DELETION SUMMARY ===');
    Object.entries(filteredAppointments).forEach(([locationCode, appointments]) => {
      const locationName = distinctLocations.find(loc => loc.locCode === locationCode)?.confirmationName || locationCode;
      console.log(`${locationName} (${locationCode}): ${appointments.length} appointments deleted`);
    });
    console.log(`Total appointments deleted: ${totalAppointmentsToDelete}`);
    console.log('========================\n');
    
  } catch (error) {
    console.error('Error during appointment cleanup:', error);
  }
}

/**
 * Global teardown function to clean up holidays after test suite completion
 * This runs automatically after all tests finish
 */
async function globalTeardown() {
  console.log('=== GLOBAL TEARDOWN STARTED ===');
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
    
    // Appointment deletion cleanup (controlled by environment variable)
    await cleanupAppointments(apiRequestContext);
    
    // Clean up request context
    await apiRequestContext.dispose();
    
  } catch (error) {
    console.log(`Global teardown failed: ${error} - continuing without cleanup`);
  }
}

export default globalTeardown;
