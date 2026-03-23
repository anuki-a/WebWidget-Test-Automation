import { ApiClient } from './apiClient';

/**
 * Interface for appointment data creation.
 */
export interface AppointmentData {
  serviceId: number;
  locationId: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  scheduledDateTime: string;
  meetingPreference: 'inPerson' | 'virtual' | 'phone';
  requireSpanishSpeaker?: boolean;
  staffId?: number;
  notes?: string;
}

/**
 * Interface for appointment status update.
 */
export interface AppointmentStatusUpdate {
  status: 'scheduled' | 'cancelled' | 'completed' | 'no-show';
  reason?: string;
  updatedBy?: string;
}

/**
 * Client for appointment API operations including CRUD operations and status management.
 * Extends the base ApiClient with domain-specific methods for appointment lifecycle management.
 */
export class AppointmentClient extends ApiClient {
  /**
   * Get appointment by confirmation number.
   * @param confirmationNumber - The appointment confirmation number
   * @returns Promise resolving to appointment details
   */
  async getAppointmentById(confirmationNumber: string): Promise<any> {
    return this.get(`/api/v1/appointment/${confirmationNumber}`);
  }

  /**
   * Create a new appointment.
   * @param appointmentData - Appointment creation data
   * @param allowOverlappedAppts - Whether to allow overlapping appointments
   * @returns Promise resolving to the created appointment
   */
  async createAppointment(appointmentData: AppointmentData, allowOverlappedAppts: boolean = false): Promise<any> {
    return this.post('/api/v1/appointment', appointmentData, {
      allowOverlappedAppts,
    });
  }

  /**
   * Update an existing appointment.
   * @param confirmationNumber - The appointment confirmation number
   * @param appointmentData - Updated appointment data
   * @param allowOverlappedAppts - Whether to allow overlapping appointments
   * @returns Promise resolving to the updated appointment
   */
  async updateAppointment(confirmationNumber: string, appointmentData: Partial<AppointmentData>, allowOverlappedAppts: boolean = false): Promise<any> {
    return this.put(`/api/v1/appointment/${confirmationNumber}`, appointmentData, {
      allowOverlappedAppts,
    });
  }

  /**
   * Update appointment status.
   * @param confirmationNumber - The appointment confirmation number
   * @param statusUpdate - Status update data
   * @returns Promise resolving to the update result
   */
  async updateAppointmentStatus(confirmationNumber: string, statusUpdate: AppointmentStatusUpdate): Promise<any> {
    return this.put(`/api/v1/appointment/${confirmationNumber}/status/${statusUpdate.status}`, {
      confirmationNumber,
      ...statusUpdate,
    });
  }

  /**
   * Cancel an appointment.
   * @param confirmationNumber - The appointment confirmation number
   * @param reason - Cancellation reason
   * @returns Promise resolving to the cancellation result
   */
  async cancelAppointment(confirmationNumber: string, reason?: string): Promise<any> {
    return this.updateAppointmentStatus(confirmationNumber, {
      status: 'cancelled',
      reason,
    });
  }

  /**
   * Get services associated with an appointment.
   * @param confirmationNumber - The appointment confirmation number
   * @returns Promise resolving to appointment services
   */
  async getAppointmentServices(confirmationNumber: string): Promise<any> {
    return this.get(`/api/v1/appointment/${confirmationNumber}/services`);
  }

  /**
   * Check appointment availability for a specific service and location.
   * @param locationCode - Location code
   * @param serviceCode - Service code
   * @param startDateLocal - Start date in local time
   * @param endDateLocal - End date in local time
   * @param requireSpanishSpeaker - Whether Spanish speaker is required
   * @returns Promise resolving to availability information
   */
  async checkAvailability(
    locationCode: string,
    serviceCode: string,
    startDateLocal: string,
    endDateLocal: string,
    requireSpanishSpeaker: boolean = false
  ): Promise<any> {
    return this.get('/api/Booking/v3/availability/location/{locationCode}/service/{serviceCode}/startDateLocal/{startDateLocal}/endDateLocal/{endDateLocal}/firstAvailableDate', {
      locationCode,
      serviceCode,
      startDateLocal,
      endDateLocal,
      requireSpanishSpeaker,
    });
  }

  /**
   * Batch availability lookup for multiple services/locations.
   * @param availabilityRequest - Batch availability request data
   * @returns Promise resolving to batch availability results
   */
  async batchAvailabilityLookup(availabilityRequest: any): Promise<any> {
    return this.post('/api/Booking/v3/BatchAvailabilityLookup', availabilityRequest);
  }

  /**
   * Validate appointment data before creation.
   * @param appointmentData - Appointment data to validate
   * @returns Promise resolving to validation result
   */
  async validateAppointmentData(appointmentData: AppointmentData): Promise<any> {
    return this.post('/api/v1/appointment/validate', appointmentData);
  }

  /**
   * Get appointment history for a customer.
   * @param customerEmail - Customer email address
   * @param customerPhone - Customer phone number
   * @returns Promise resolving to appointment history
   */
  async getAppointmentHistory(customerEmail?: string, customerPhone?: string): Promise<any> {
    const params: any = {};
    if (customerEmail) params.email = customerEmail;
    if (customerPhone) params.phone = customerPhone;

    return this.get('/api/v1/appointment/history', params);
  }

  /**
   * Search appointments by criteria.
   * @param searchCriteria - Search criteria
   * @returns Promise resolving to search results
   */
  async searchAppointments(searchCriteria: {
    serviceId?: number;
    locationId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    customerEmail?: string;
  }): Promise<any> {
    return this.get('/api/v1/appointment/search', searchCriteria);
  }

  /**
   * Static factory method to create an AppointmentClient instance.
   * @param baseUrl - The base URL for API requests
   * @param options - Optional configuration for request context
   * @returns Promise resolving to AppointmentClient instance
   */
  static override async create(baseUrl: string, options?: { extraHTTPHeaders?: Record<string, string> }): Promise<AppointmentClient> {
    const client = await ApiClient.create(baseUrl, options) as AppointmentClient;
    return client;
  }
}
