# Testing

## 1. Introduction
The testing phase evaluates the functionality and reliability of the
Tuition Class Management System. Testing is conducted after the
implementation of the minimal working prototype to verify that the
system meets the specified functional and non-functional requirements.
All test cases are executed in a controlled environment using sample
tuition class data.

## 2. Test Cases
The following test cases were designed to validate key system functions.

| Test Case ID | Description | Expected Result | Actual Result | Status |
|-------------|------------|----------------|---------------|--------|
| TC1 | Register a student with valid details | Student record is created successfully | Student record created | Pass |
| TC2 | Register a student with empty required fields | System displays validation error | Error message displayed | Pass |
| TC3 | Create a tuition class with valid details | Class is created successfully | Class created | Pass |
| TC4 | Enroll a student into a class | Student is enrolled in the selected class | Enrollment successful | Pass |
| TC5 | Mark attendance for a class session | Attendance is saved correctly | Attendance saved | Pass |
| TC6 | Mark attendance without selecting a class | System displays an error message | Error displayed | Pass |

## 3. Test Results
All core functionalities of the Tuition Class Management System operated
as expected during testing. The system successfully handled student
registration, class creation, enrollment, and attendance recording.
Minor usability issues were observed but did not prevent normal system
operation.

## 4. Bug List
The following issues were identified during testing:

- Input validation is missing for student phone number format
- Error messages could be improved to be more user-friendly
- No confirmation message is shown after successful attendance marking

These issues are considered minor and do not affect the core
functionality of the system.

## 5. Conclusion
Based on the test results, the Tuition Class Management System meets the
specified requirements and is considered acceptable as a minimal working
prototype for the Waterfall SDLC assignment.
