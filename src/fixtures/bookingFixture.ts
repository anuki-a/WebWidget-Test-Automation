import { test as base } from '@playwright/test';
import { BookingData } from '../types/bookingTypes';
import { TestDataBuilder } from '../utils/testDataBuilder';
import { DateUtils } from '../utils/dateUtils';
import { MeetingPreference } from '@/pages/MeetingPreferencePage';

export const test = base.extend<{ 
  bookingData: BookingData;
  cancelPathBookingData: BookingData;
  editBookingData: BookingData;
}>({
  bookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const today = DateUtils.getToday();
    const formattedDate = DateUtils.formatDateForUI(today);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

        const rawName1 = 'Estate Accounts  75 Mins';
    const cleanName1 = "Estate Accounts";

    // Create complete booking data
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

        const data2: BookingData = {
      service: {
        category: 'Estate Accounts',
        name: rawName1,
        displayName: cleanName1,
        duration: 75
      },
      location: {
        code: '75002',
        name: 'Allen 404 E Stacy Rd. Allen,',
        confirmationName: 'Allen'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };
    await use(data);
  },

  cancelPathBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 1)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  editBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder for edit scenario
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data for edit scenario (use today to ensure availability)
    const today = DateUtils.getToday();
    const formattedDate = DateUtils.formatDateForUI(today);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create booking data specifically for edit scenario
    // Using different location to avoid conflicts with other fixtures
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM', // Original time for edit scenario
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  }
});
