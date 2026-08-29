export type RoleName = 
  | 'Super Admin' 
  | 'Hospital Admin' 
  | 'Doctor' 
  | 'Nurse' 
  | 'Receptionist' 
  | 'Pharmacist' 
  | 'Lab Technician' 
  | 'Accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  avatar?: string;
  departmentId?: string;
  phone?: string;
  status: 'active' | 'inactive';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headDoctorId?: string;
  headDoctorName?: string;
  doctorCount: number;
  appointmentCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Patient {
  id: string; // Patient ID e.g. PAT-1001
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  identificationNumber: string;
  allergies: string[];
  medicalHistory: string;
  existingConditions: string[];
  registrationDate: string;
  profilePhoto?: string;
  status: 'active' | 'deactivated';
  vitals?: Record<string, any>;
}

export interface Doctor {
  id: string; // DOC-101
  name: string;
  email: string;
  phone: string;
  specialization: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  status: 'active' | 'on_leave' | 'inactive';
  profilePhoto?: string;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  availableHours: { start: string; end: string };
}

export type AppointmentStatus = 
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked In'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export type AppointmentType = 'Consultation' | 'Follow-up' | 'Emergency' | 'Routine Checkup';

export interface Appointment {
  id: string; // APT-2026-001
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: AppointmentType;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface OPDConsultation {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  vitals: {
    bloodPressure: string;
    pulseRate: string;
    temperature: string;
    weight: string;
    height: string;
    spo2: string;
  };
  symptoms: string[];
  diagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  prescriptionItems: {
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  labTestsRequested: string[];
  followUpDate?: string;
  billingAmount: number;
  billingStatus: 'Pending' | 'Paid' | 'Waived';
  status: 'Draft' | 'Completed';
}

export interface Room {
  id: string;
  roomNumber: string;
  roomType: 'General Ward' | 'Semi Private' | 'Private' | 'ICU' | 'Emergency' | 'Isolation';
  departmentId: string;
  departmentName: string;
  floor: string;
  status: 'Available' | 'Full' | 'Maintenance';
}

export interface Bed {
  id: string; // BED-101-A
  bedNumber: string;
  roomId: string;
  roomNumber: string;
  roomType: Room['roomType'];
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  patientId?: string;
  patientName?: string;
}

export type AdmissionStatus = 'Admitted' | 'Under Treatment' | 'Ready for Discharge' | 'Discharged';

export interface IPDAdmission {
  id: string; // ADM-2026-001
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  admissionDate: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: string;
  diagnosis: string;
  admissionNotes: string;
  status: AdmissionStatus;
  dischargeDate?: string;
  dischargeSummary?: string;
}

export type EmergencyPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type EmergencyStatus = 'Waiting' | 'Under Treatment' | 'Transferred' | 'Discharged';

export interface EmergencyCase {
  id: string; // EMG-9001
  patientId?: string;
  patientName: string;
  arrivalTime: string;
  priority: EmergencyPriority;
  condition: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  departmentId: string;
  departmentName: string;
  status: EmergencyStatus;
  notes: string;
}

export interface Prescription {
  id: string; // RX-2026-8801
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  date: string;
  notes?: string;
  items: {
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
}

export interface Medicine {
  id: string; // MED-1001
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStockLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
}

export interface StockLog {
  id: string;
  medicineId: string;
  medicineName: string;
  type: 'Stock In' | 'Stock Out';
  quantity: number;
  reason: string;
  date: string;
}

export interface LabTest {
  id: string; // LAB-101
  name: string;
  category: string;
  price: number;
  description: string;
  referenceRange: string;
}

export type LabOrderStatus = 'Requested' | 'Sample Collected' | 'Processing' | 'Completed' | 'Verified';

export interface LabOrder {
  id: string; // LOR-2026-001
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testId: string;
  testName: string;
  price: number;
  orderDate: string;
  status: LabOrderStatus;
  sampleCollectedAt?: string;
  resultValue?: string;
  referenceRange?: string;
  technicianName?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer' | 'Insurance' | 'Other';
export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  serviceCategory: 'Consultation' | 'Laboratory' | 'Pharmacy' | 'Room' | 'Admission' | 'Procedures' | 'Other';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentRecord {
  id: string; // PAY-8001
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes?: string;
}

export interface Invoice {
  id: string; // INV-2026-001
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number; // In dollars
  taxRate: number; // e.g. 5%
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface StaffMember {
  id: string; // EMP-101
  name: string;
  departmentId: string;
  departmentName: string;
  position: string;
  phone: string;
  email: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Deactivated';
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: string; // ATT-1001
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
}

export interface HospitalSettings {
  hospitalName: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  registrationNumber: string;
  currency: string; // e.g. USD ($)
  dateFormat: string;
  timeFormat: string;
  appointmentSlotDuration: number; // in minutes
  enableLowStockAlerts: boolean;
  enableExpiryAlerts: boolean;
}

export interface UserAccount {
  id: string; // USR-101
  name: string;
  email: string;
  role: RoleName;
  status: 'Active' | 'Deactivated';
  createdAt: string;
  lastLogin?: string;
}

export interface AuditLogRecord {
  id: string; // AUD-9001
  user: string;
  userRole: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  metadata?: string;
}

export interface CheckInToken {
  id: string; // TKN-101
  tokenNumber: string; // A-001
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  checkInTime: string;
  queuePosition: number;
  status: 'Waiting' | 'Checked In' | 'In Consultation' | 'Completed' | 'Cancelled';
}

export interface PatientTimelineEvent {
  id: string;
  patientId: string;
  timestamp: string;
  eventType: 'Registration' | 'Appointment' | 'Check-in' | 'Consultation' | 'Prescription' | 'Lab Test' | 'Admission' | 'Room Assignment' | 'Payment' | 'Discharge';
  staffName: string;
  title: string;
  description: string;
}

export interface PatientDocument {
  id: string; // DOC-801
  patientId: string;
  title: string;
  documentType: 'Medical History' | 'Lab Report' | 'ID Proof' | 'Referral Letter' | 'Discharge Slip';
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  city: string;
  status: 'Active' | 'Inactive';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
  category?: 'Appointments' | 'Patients' | 'Laboratory' | 'Pharmacy' | 'Admissions' | 'Billing' | 'System';
  priority?: 'High' | 'Medium' | 'Low';
}
