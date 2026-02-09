# Change Request

## 1. Change Description
This change request proposes the addition of an SMS notification feature
to the Tuition Management System. The feature would automatically send
SMS messages to parents or students after attendance is marked for a
tuition class session. The message would inform whether the student was
present or absent on a given day.

The objective of this change is to improve communication between the
tuition institute and parents and to ensure timely awareness of student
attendance.

This requirement was introduced after the completion and approval of the
Requirements Analysis and System Design phases.

## 2. Impact Analysis
The introduction of SMS notifications would impact the system in several
ways:

- Integration with a third-party SMS gateway would be required
- Additional database fields would be needed to store parent or student
  contact numbers
- System design documents would require updates to reflect the new
  functionality
- Additional development and testing effort would be necessary
- The project timeline would be extended beyond the originally planned
  schedule

## 3. Risk Analysis
Implementing this change introduces the following risks:

- Increased system complexity for a small-scale tuition management system
- Dependence on external SMS service providers, which may affect system reliability
- Additional operational costs associated with sending SMS messages
- Risk of project delays due to integration and testing challenges
- Privacy concerns related to handling and storing contact information

## 4. Decision
After careful evaluation, the change request is **rejected**. The decision
is based on limited development time, academic project constraints, and
the need to strictly follow the traditional Waterfall SDLC, where late
requirement changes are not encouraged.

The SMS notification feature may be considered as a future enhancement
to the Tuition Management System outside the scope of the current project.
