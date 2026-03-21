# Setup Dependency Table

Based on analysis of test specifications and API documentation, here are the recommended API-based setup strategies to replace UI preconditions.

| Setup                           | API                                                          | Scope        |
| ------------------------------- | ------------------------------------------------------------ | ------------ |
| enable widget                   | PUT api/System/GetApplicationConfigs                         | before suite |
| create service category         | POST api/provisioning/ProvisionServiceCategories             | before suite |
| create base services            | POST api/provisioning/ProvisionServices                      | before suite |
| create locations                | POST api/provisioning/ProvisionLocations                     | before suite |
| configure staff availability    | POST api/provisioning/ProvisionUserAvailability              | before suite |
| create appointment type         | POST api/provisioning/ProvisionServices                      | per test     |
| configure schedule              | POST api/provisioning/ProvisionLocationHoursOfOperation      | per suite    |
| set up partial holiday          | POST api/provisioning/ProvisionHolidays                      | per test     |
| set up full holiday             | POST api/provisioning/ProvisionHolidays                      | per test     |
| configure meeting preferences   | POST api/client/SaveService                                  | per test     |
| enable appointment skip         | POST api/client/SaveService                                  | per test     |
| configure checklist             | POST api/client/SaveService                                  | per test     |
| set widget validation rules     | POST api/System/SaveChanges                                  | per test     |
| create editable appointment     | POST api/v1/appointment                                      | per test     |
| create non-editable appointment | POST api/v1/appointment + PUT api/v1/appointment/{id}/status | per test     |
| create cancelable appointment   | POST api/v1/appointment                                      | per test     |
| configure spanish speaker       | POST api/provisioning/ProvisionSkills                        | per test     |
| enable manual staff selection   | POST api/client/SaveLocationSettings                         | per test     |

## Detailed API Setup Requirements

### Before Suite Setup

**Enable Widget**

- **API**: PUT api/System/GetApplicationConfigs
- **Request Body**: ApplicationConfiguration object with widget settings
- **Required Parameters**: clientId, widget enabled flag

**Create Service Category**

- **API**: POST api/provisioning/ProvisionServiceCategories
- **Request Body**: ProvisioningRequest<ACServiceCategoryProvisionModel>
- **Required Parameters**: categoryCode, categoryName, clientId

**Create Base Services**

- **API**: POST api/provisioning/ProvisionServices
- **Request Body**: ProvisioningRequest<ACServiceProvisionModel>
- **Required Parameters**: serviceCode, serviceName, serviceCategoryId, duration

**Create Locations**

- **API**: POST api/provisioning/ProvisionLocations
- **Request Body**: ProvisioningRequest<ACLocationProvisionModel>
- **Required Parameters**: locationCode, locationName, clientId, timeZone

**Configure Staff Availability**

- **API**: POST api/provisioning/ProvisionUserAvailability
- **Request Body**: ProvisioningRequest<ACUserAvailabilityProvisionModel>
- **Required Parameters**: userId, locationId, availability windows, meetingPreferences

### Per Test Setup

**Configure Meeting Preferences**

- **API**: POST api/client/SaveService
- **Request Body**: Service configuration with meeting preference settings
- **Required Parameters**: serviceId, meetingPreferenceMode (single/multiple), availablePreferences

**Set Up Partial Holiday**

- **API**: POST api/provisioning/ProvisionHolidays
- **Request Body**: ProvisioningRequest<ACHolidayProvisionModel>
- **Required Parameters**: locationId, date, startTime, endTime, holidayType (partial)

**Set Up Full Holiday**

- **API**: POST api/provisioning/ProvisionHolidays
- **Request Body**: ProvisioningRequest<ACHolidayProvisionModel>
- **Required Parameters**: locationId, date, holidayType (full), allDay=true

**Create Editable Appointment**

- **API**: POST api/v1/appointment
- **Request Body**: AppointmentDataDto with editable=true
- **Required Parameters**: serviceId, locationId, customerDetails, appointmentTime, editable=true

**Create Non-Editable Appointment**

- **API**: POST api/v1/appointment + PUT api/v1/appointment/{confirmationNumber}/status
- **Request Body**: AppointmentDataDto followed by status update
- **Required Parameters**: appointment details, status update to non-editable

**Configure Widget Validation Rules**

- **API**: POST api/System/SaveChanges
- **Request Body**: JObject with widget validation configuration
- **Required Parameters**: emailRequired, phoneRequired, validationOverrides

## Test Case Mapping

**OAC-20001**: Base services, locations, widget config (before suite)
**OAC-20002**: Create editable appointment (per test)
**OAC-20003**: Create non-editable appointment (per test)  
**OAC-20004**: Create cancelable appointment (per test)
**OAC-20005/20006**: Multiple services setup (before suite)
**OAC-20007/2008**: Configure appointment skip (per test)
**OAC-20009**: Configure widget validation rules (per test)
**OAC-20010/20011**: Configure meeting preferences (per test)
**OAC-20012**: Configure MP-specific validations (per test)
**OAC-20013/20014**: Set up holidays (per test)
**OAC-20016**: Configure staff availability (before suite)
**OAC-20017**: Configure language settings (before suite)
**OAC-20018**: Configure checklist (per test)
**OAC-20019**: Base services/locations (before suite)
**OAC-20020**: Configure spanish speaker, manual staff (per test)
