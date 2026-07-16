Build a complete enterprise-grade Hospital Management System (HMS) / Hospital ERP as a modern web application.

System Architecture:

* Multi-tenant SaaS architecture.
* One Super Admin can manage multiple hospitals.
* Each hospital has its own data isolation.
* Role-Based Access Control (RBAC).
* Audit logging for all critical actions.
* Responsive design for desktop, tablet, and mobile.

Roles:

1. Super Admin

* Create and manage hospitals.
* Enable/disable modules per hospital.
* Manage subscriptions and plans.
* Manage SMS/WhatsApp settings.
* Manage feature permissions.
* View global analytics.
* Audit logs.
* Backup and restore management.

2. Hospital Admin

* Manage doctors.
* Manage staff.
* Manage departments.
* Manage receptionists/FDO.
* Manage inventory.
* Manage pharmacy.
* Manage laboratory.
* Manage wards and rooms.
* Manage attendance and payroll.
* Manage billing and finance.
* View hospital dashboards and reports.

3. Front Desk Officer (FDO) / Receptionist

* Register patients.
* Search existing patients.
* Generate tokens.
* Manage appointments.
* Handle emergency registrations.
* Print prescriptions.
* Print invoices.
* Update patient contact details.
* Upload reports received from labs.
* Send SMS notifications.

4. Doctor

* View assigned patients.
* View complete patient history.
* View previous prescriptions.
* View previous lab reports.
* Add diagnosis.
* Add clinical notes.
* Prescribe medicines.
* Recommend laboratory tests.
* Recommend radiology tests.
* Schedule follow-up visits.
* Admit patients.
* Discharge patients.
* Generate medical certificates.

5. Nurse

* Record vitals.
* Monitor admitted patients.
* Record medication administration.
* Maintain nursing notes.

6. Lab Staff

* View ordered tests.
* Update test status.
* Upload reports.
* Mark reports completed.

7. Pharmacy Staff

* View prescriptions.
* Dispense medicines.
* Manage pharmacy sales.
* Update stock automatically.

Patient Management:

Patient Registration:

* Name.
* Gender.
* Date of Birth.
* Auto Age Calculation.
* Phone Number.
* CNIC / National ID.
* Address.
* Blood Group.
* Guardian Information.

Child Logic:

* If age is below 18 years.
* Automatically classify as Child.
* Hide CNIC requirement.
* Show Guardian fields.
* Guardian CNIC required.

Patient History:

* Complete visit history.
* Prescriptions history.
* Lab reports history.
* Admission history.
* Allergies.
* Chronic diseases.
* Emergency contacts.

Emergency Department Workflow:

Emergency Registration should be extremely fast.

Required fields:

* Patient Name.
* Approximate Age.
* Gender.
* Emergency Reason (optional).

Generate Emergency ID instantly.

Immediately notify Emergency Department.

Emergency Doctor Dashboard:

* Real-time emergency alerts.
* Live patient queue.
* Status tracking.

Later complete patient profile:

* CNIC.
* Phone.
* Address.
* Guardian information.

OPD Workflow:

Patient arrives.
Reception searches patient.

If patient already exists:

* Create new visit.

If patient does not exist:

* Create new patient profile.

Generate Token.

Automatically:

* Notify patient via SMS.
* Notify assigned doctor.

Token Queue System:

* Waiting.
* Called.
* In Consultation.
* Completed.
* Follow-Up.
* No Show.

Doctor Consultation Workflow:

Doctor opens patient record.

Doctor can:

* View history.
* Add diagnosis.
* Add notes.
* Prescribe medicines.
* Request tests.
* Request radiology.
* Schedule follow-up.
* Admit patient.
* Complete consultation.

Prescription Module:

Doctor writes:

* Medicines.
* Dosage.
* Duration.
* Instructions.

Reception can print prescription.

Pharmacy receives prescription automatically.

Laboratory Workflow:

Doctor orders tests.

Examples:

* CBC.
* LFT.
* KFT.
* Blood Sugar.
* X-Ray.
* CT Scan.
* MRI.

Lab receives order instantly.

Lab can:

* Accept order.
* Process sample.
* Upload report.
* Mark completed.

Same Day Follow-Up Logic:

If tests are completed on the same day:

* No additional consultation fee.
* Generate Follow-Up Token.
* Return patient to doctor.
* Doctor reviews reports.

Admission (IPD) Workflow:

Doctor clicks Admit.

Assign:

* Ward.
* Room.
* Bed.

Admission record includes:

* Admission Date.
* Diagnosis.
* Attending Doctor.
* Nursing Notes.
* Procedures.
* Medicines.

Discharge Workflow:

Doctor creates discharge summary.

Generate:

* Final Diagnosis.
* Treatment Summary.
* Prescriptions.
* Follow-Up Instructions.
* Final Invoice.

Billing Module:

Support:

* Consultation Charges.
* Emergency Charges.
* Lab Charges.
* Pharmacy Charges.
* Room Charges.
* Procedure Charges.

Generate:

* Invoices.
* Receipts.
* Refunds.

Inventory Management:

Manage:

* Medicines.
* Equipment.
* Medical Supplies.
* Consumables.

Features:

* Purchase Orders.
* Suppliers.
* Stock Tracking.
* Low Stock Alerts.
* Expiry Alerts.
* Stock Transfers.

Pharmacy Management:

* Medicine Inventory.
* Prescription Sales.
* OTC Sales.
* Batch Tracking.
* Expiry Tracking.

Attendance & HR Module:

Manage:

* Doctors.
* Nurses.
* Receptionists.
* Lab Staff.
* Pharmacy Staff.

Features:

* Attendance.
* Leave Requests.
* Payroll.
* Shift Management.

Communication Module:

SMS Notifications:

* Registration confirmation.
* Token generation.
* Appointment reminders.
* Test ordered.
* Report ready.
* Follow-up reminders.

WhatsApp Integration:

* Prescriptions.
* Reports.
* Invoices.
* Appointment reminders.

Patient Portal:

Patient Login.

Can view:

* Appointments.
* Prescriptions.
* Reports.
* Bills.
* Medical History.

Doctor Portal:

Can view:

* Today's Queue.
* Appointments.
* Patient History.
* Reports.

Dashboard & Analytics:

Hospital Admin Dashboard:

* Total Patients.
* Daily Visits.
* Revenue.
* Admissions.
* Discharges.
* Pending Bills.
* Inventory Alerts.

Doctor Dashboard:

* Today's Appointments.
* Pending Reports.
* Follow-Ups.

Reception Dashboard:

* Waiting Queue.
* Emergency Queue.
* Active Tokens.

Security:

* JWT Authentication.
* Refresh Tokens.
* Role Permissions.
* Activity Logs.
* Audit Trails.
* Data Encryption.

Reports:

* Daily Revenue.
* Monthly Revenue.
* Patient Reports.
* Doctor Performance.
* Lab Reports.
* Inventory Reports.
* Attendance Reports.

Technology Requirements:

Frontend:

* React.
* Tailwind CSS.
* Responsive UI.
* Modern dashboard.

Backend:

* Node.js.
* Express.js.

Database:

* MongoDB.

Additional Requirements:

* Clean architecture.
* Scalable folder structure.
* Reusable components.
* REST APIs.
* Real-time notifications using Socket.IO.
* Print support for prescriptions, invoices, and reports.
* Professional hospital-grade UI and UX.
