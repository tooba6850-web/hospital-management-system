import type { 
  Department, 
  Doctor, 
  Patient, 
  Appointment, 
  OPDConsultation, 
  User,
  Room,
  Bed,
  IPDAdmission,
  EmergencyCase,
  Prescription,
  Medicine,
  StockLog,
  LabTest,
  LabOrder,
  Invoice,
  PaymentRecord,
  StaffMember,
  AttendanceRecord,
  NotificationItem,
  HospitalSettings,
  UserAccount,
  AuditLogRecord,
  CheckInToken,
  PatientTimelineEvent,
  PatientDocument,
  BranchInfo
} from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'USR-1', name: 'Dr. Arthur Pendelton', email: 'admin@hospital.com', role: 'Super Admin', status: 'active' },
  { id: 'USR-2', name: 'Sarah Jenkins', email: 'hadmin@hospital.com', role: 'Hospital Admin', status: 'active' },
  { id: 'USR-3', name: 'Dr. Robert Chen', email: 'robert.chen@hospital.com', role: 'Doctor', departmentId: 'DEP-CARDIO', status: 'active' },
  { id: 'USR-4', name: 'Nurse Clara Oswald', email: 'clara@hospital.com', role: 'Nurse', status: 'active' },
  { id: 'USR-5', name: 'James Miller', email: 'reception@hospital.com', role: 'Receptionist', status: 'active' },
  { id: 'USR-6', name: 'Elena Rostova', email: 'pharma@hospital.com', role: 'Pharmacist', status: 'active' },
  { id: 'USR-7', name: 'Marcus Vance', email: 'lab@hospital.com', role: 'Lab Technician', status: 'active' },
  { id: 'USR-8', name: 'David Sterling', email: 'accounts@hospital.com', role: 'Accountant', status: 'active' },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP-CARDIO', name: 'Cardiology', code: 'CARD', description: 'Heart and cardiovascular system care', headDoctorId: 'DOC-101', headDoctorName: 'Dr. Robert Chen', doctorCount: 4, appointmentCount: 18, status: 'active', createdAt: '2025-01-10' },
  { id: 'DEP-NEURO', name: 'Neurology', code: 'NEUR', description: 'Brain, spinal cord, and nervous disorder management', headDoctorId: 'DOC-102', headDoctorName: 'Dr. Emily Watson', doctorCount: 3, appointmentCount: 12, status: 'active', createdAt: '2025-01-12' },
  { id: 'DEP-PED', name: 'Pediatrics', code: 'PEDI', description: 'Child and adolescent medical services', headDoctorId: 'DOC-103', headDoctorName: 'Dr. Michael Chang', doctorCount: 5, appointmentCount: 24, status: 'active', createdAt: '2025-01-15' },
  { id: 'DEP-ORTHO', name: 'Orthopedics', code: 'ORTH', description: 'Bone, joint, and musculoskeletal care', headDoctorId: 'DOC-104', headDoctorName: 'Dr. Sophia Martinez', doctorCount: 3, appointmentCount: 9, status: 'active', createdAt: '2025-01-18' },
  { id: 'DEP-EMERG', name: 'Emergency Medicine', code: 'EMRG', description: '24/7 Acute critical care & trauma handling', headDoctorId: 'DOC-105', headDoctorName: 'Dr. James Wilson', doctorCount: 6, appointmentCount: 30, status: 'active', createdAt: '2025-01-01' },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-101',
    name: 'Dr. Robert Chen',
    email: 'robert.chen@hospital.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Interventional Cardiology',
    departmentId: 'DEP-CARDIO',
    departmentName: 'Cardiology',
    qualification: 'MD, FACC, Board Certified',
    experienceYears: 14,
    consultationFee: 150,
    status: 'active',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableHours: { start: '09:00', end: '17:00' }
  },
  {
    id: 'DOC-102',
    name: 'Dr. Emily Watson',
    email: 'emily.watson@hospital.com',
    phone: '+1 (555) 345-6789',
    specialization: 'Clinical Neurology',
    departmentId: 'DEP-NEURO',
    departmentName: 'Neurology',
    qualification: 'MD, PhD Neuroscience',
    experienceYears: 11,
    consultationFee: 180,
    status: 'active',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableHours: { start: '10:00', end: '16:00' }
  },
  {
    id: 'DOC-103',
    name: 'Dr. Michael Chang',
    email: 'michael.chang@hospital.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Pediatric Care & Allergy',
    departmentId: 'DEP-PED',
    departmentName: 'Pediatrics',
    qualification: 'MD Pediatrics, FAAP',
    experienceYears: 8,
    consultationFee: 120,
    status: 'active',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    availableHours: { start: '08:30', end: '15:30' }
  },
  {
    id: 'DOC-104',
    name: 'Dr. Sophia Martinez',
    email: 'sophia.martinez@hospital.com',
    phone: '+1 (555) 567-8901',
    specialization: 'Orthopedic Surgery',
    departmentId: 'DEP-ORTHO',
    departmentName: 'Orthopedics',
    qualification: 'MS Ortho, FRCS',
    experienceYears: 16,
    consultationFee: 200,
    status: 'active',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableHours: { start: '09:00', end: '14:00' }
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-1001',
    fullName: 'Eleanor Vance',
    gender: 'Female',
    dob: '1988-04-12',
    bloodGroup: 'O+',
    phone: '+1 (555) 890-1234',
    email: 'eleanor.vance@example.com',
    address: '742 Evergreen Terrace, Springfield, IL',
    emergencyContact: { name: 'Thomas Vance', relationship: 'Spouse', phone: '+1 (555) 890-5678' },
    identificationNumber: 'SSN-9982-114',
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: 'Mild Hypertension diagnosed in 2021. Appendectomy in 2018.',
    existingConditions: ['Hypertension'],
    registrationDate: '2025-11-10',
    status: 'active'
  },
  {
    id: 'PAT-1002',
    fullName: 'Marcus Aurelius Brody',
    gender: 'Male',
    dob: '1975-09-28',
    bloodGroup: 'A+',
    phone: '+1 (555) 789-0123',
    email: 'marcus.brody@example.com',
    address: '124 Conch Street, Bikini Bottom',
    emergencyContact: { name: 'Marion Brody', relationship: 'Sister', phone: '+1 (555) 789-4321' },
    identificationNumber: 'SSN-3312-887',
    allergies: ['Sulfa drugs'],
    medicalHistory: 'Type 2 Diabetes Mellitus managed with Metformin.',
    existingConditions: ['Type 2 Diabetes'],
    registrationDate: '2026-01-05',
    status: 'active'
  },
  {
    id: 'PAT-1003',
    fullName: 'Hannah Abbott',
    gender: 'Female',
    dob: '1995-12-03',
    bloodGroup: 'B-',
    phone: '+1 (555) 678-9012',
    email: 'hannah.a@example.com',
    address: '42 Wallaby Way, Sydney',
    emergencyContact: { name: 'Neville Longbottom', relationship: 'Friend', phone: '+1 (555) 678-3344' },
    identificationNumber: 'SSN-4411-902',
    allergies: ['None known'],
    medicalHistory: 'Regular checkups. No chronic illnesses reported.',
    existingConditions: [],
    registrationDate: '2026-02-01',
    status: 'active'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-2026-001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 890-1234',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Robert Chen',
    departmentId: 'DEP-CARDIO',
    departmentName: 'Cardiology',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00',
    type: 'Consultation',
    reason: 'Routine BP checkup and chest tightness evaluation',
    notes: 'Patient reports slight dizziness in the mornings.',
    status: 'Checked In',
    createdAt: '2026-08-15'
  },
  {
    id: 'APT-2026-002',
    patientId: 'PAT-1002',
    patientName: 'Marcus Aurelius Brody',
    patientPhone: '+1 (555) 789-0123',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Emily Watson',
    departmentId: 'DEP-NEURO',
    departmentName: 'Neurology',
    date: new Date().toISOString().split('T')[0], // Today
    time: '11:30',
    type: 'Follow-up',
    reason: 'Migraine follow-up examination',
    notes: 'Checking response to prescribed prophylaxis.',
    status: 'Confirmed',
    createdAt: '2026-08-16'
  },
  {
    id: 'APT-2026-003',
    patientId: 'PAT-1003',
    patientName: 'Hannah Abbott',
    patientPhone: '+1 (555) 678-9012',
    doctorId: 'DOC-103',
    doctorName: 'Dr. Michael Chang',
    departmentId: 'DEP-PED',
    departmentName: 'Pediatrics',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '09:30',
    type: 'Routine Checkup',
    reason: 'Annual health checkup',
    status: 'Scheduled',
    createdAt: '2026-08-17'
  }
];

export const INITIAL_OPD_CONSULTATIONS: OPDConsultation[] = [
  {
    id: 'OPD-9001',
    appointmentId: 'APT-2026-001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Robert Chen',
    date: new Date().toISOString().split('T')[0],
    vitals: {
      bloodPressure: '138/88 mmHg',
      pulseRate: '78 bpm',
      temperature: '98.6 °F',
      weight: '68 kg',
      height: '165 cm',
      spo2: '99%'
    },
    symptoms: ['Mild chest tightness', 'Occasional morning fatigue'],
    diagnosis: 'Stage 1 Essential Hypertension',
    clinicalNotes: 'Cardiovascular sound dual without murmurs. Lungs clear to auscultation.',
    treatmentPlan: 'Lifestyle modifications, low sodium diet, and continue antihypertensive regimen.',
    prescriptionItems: [
      { medicineName: 'Amlodipine 5mg', dosage: '1 Tablet', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'Take after breakfast' },
      { medicineName: 'Atorvastatin 10mg', dosage: '1 Tablet', frequency: 'Once Daily (Night)', duration: '30 Days', instructions: 'Take before sleep' }
    ],
    labTestsRequested: ['Lipid Profile', 'ECG (12-Lead)'],
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    billingAmount: 150,
    billingStatus: 'Paid',
    status: 'Completed'
  }
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'RM-101', roomNumber: '101-W', roomType: 'General Ward', departmentId: 'DEP-CARDIO', departmentName: 'Cardiology', floor: '1st Floor', status: 'Available' },
  { id: 'RM-102', roomNumber: '102-ICU', roomType: 'ICU', departmentId: 'DEP-EMERG', departmentName: 'Emergency Medicine', floor: '1st Floor', status: 'Available' },
  { id: 'RM-201', roomNumber: '201-P', roomType: 'Private', departmentId: 'DEP-NEURO', departmentName: 'Neurology', floor: '2nd Floor', status: 'Available' },
  { id: 'RM-202', roomNumber: '202-SP', roomType: 'Semi Private', departmentId: 'DEP-PED', departmentName: 'Pediatrics', floor: '2nd Floor', status: 'Available' },
  { id: 'RM-301', roomNumber: '301-ISO', roomType: 'Isolation', departmentId: 'DEP-ORTHO', departmentName: 'Orthopedics', floor: '3rd Floor', status: 'Available' },
];

export const INITIAL_BEDS: Bed[] = [
  { id: 'BED-101-A', bedNumber: '101-A', roomId: 'RM-101', roomNumber: '101-W', roomType: 'General Ward', status: 'Occupied', patientId: 'PAT-1001', patientName: 'Eleanor Vance' },
  { id: 'BED-101-B', bedNumber: '101-B', roomId: 'RM-101', roomNumber: '101-W', roomType: 'General Ward', status: 'Available' },
  { id: 'BED-102-A', bedNumber: 'ICU-01', roomId: 'RM-102', roomNumber: '102-ICU', roomType: 'ICU', status: 'Occupied', patientId: 'PAT-1002', patientName: 'Marcus Aurelius Brody' },
  { id: 'BED-102-B', bedNumber: 'ICU-02', roomId: 'RM-102', roomNumber: '102-ICU', roomType: 'ICU', status: 'Available' },
  { id: 'BED-201-A', bedNumber: '201-P-1', roomId: 'RM-201', roomNumber: '201-P', roomType: 'Private', status: 'Available' },
  { id: 'BED-202-A', bedNumber: '202-SP-1', roomId: 'RM-202', roomNumber: '202-SP', roomType: 'Semi Private', status: 'Available' },
  { id: 'BED-202-B', bedNumber: '202-SP-2', roomId: 'RM-202', roomNumber: '202-SP', roomType: 'Semi Private', status: 'Maintenance' },
  { id: 'BED-301-A', bedNumber: 'ISO-01', roomId: 'RM-301', roomNumber: '301-ISO', roomType: 'Isolation', status: 'Available' },
];

export const INITIAL_ADMISSIONS: IPDAdmission[] = [
  {
    id: 'ADM-2026-001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Robert Chen',
    departmentId: 'DEP-CARDIO',
    departmentName: 'Cardiology',
    admissionDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    roomId: 'RM-101',
    roomNumber: '101-W',
    bedId: 'BED-101-A',
    bedNumber: '101-A',
    diagnosis: 'Acute Coronary Syndrome evaluation',
    admissionNotes: 'Admitted for 42-hour continuous cardiac telemetry observation and IV hydration.',
    status: 'Under Treatment'
  },
  {
    id: 'ADM-2026-002',
    patientId: 'PAT-1002',
    patientName: 'Marcus Aurelius Brody',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Emily Watson',
    departmentId: 'DEP-NEURO',
    departmentName: 'Neurology',
    admissionDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    roomId: 'RM-102',
    roomNumber: '102-ICU',
    bedId: 'BED-102-A',
    bedNumber: 'ICU-01',
    diagnosis: 'Severe Migraine with neurological deficit',
    admissionNotes: 'Transferred from Emergency for intensive neurological monitoring.',
    status: 'Admitted'
  }
];

export const INITIAL_EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'EMG-9001',
    patientId: 'PAT-1002',
    patientName: 'Marcus Aurelius Brody',
    arrivalTime: '14:20',
    priority: 'Critical',
    condition: 'Acute disorientation & severe unilateral headache',
    assignedDoctorId: 'DOC-102',
    assignedDoctorName: 'Dr. Emily Watson',
    departmentId: 'DEP-EMERG',
    departmentName: 'Emergency Medicine',
    status: 'Under Treatment',
    notes: 'Vitals stabilized upon arrival. IV Line established.'
  },
  {
    id: 'EMG-9002',
    patientName: 'Johnathan Doe (Trauma)',
    arrivalTime: '15:45',
    priority: 'High',
    condition: 'Right forearm laceration from industrial site',
    assignedDoctorId: 'DOC-104',
    assignedDoctorName: 'Dr. Sophia Martinez',
    departmentId: 'DEP-EMERG',
    departmentName: 'Emergency Medicine',
    status: 'Waiting',
    notes: 'Direct compression bandage applied. Tetanus toxoid booster administered.'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-2026-8801',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Robert Chen',
    diagnosis: 'Essential Hypertension',
    date: new Date().toISOString().split('T')[0],
    notes: 'Take medications strictly with food to avoid gastric irritation.',
    items: [
      { medicineName: 'Amlodipine 5mg', dosage: '1 Tablet', frequency: 'Once Daily', duration: '30 Days', instructions: 'After breakfast' },
      { medicineName: 'Atorvastatin 10mg', dosage: '1 Tablet', frequency: 'Once Daily', duration: '30 Days', instructions: 'Before sleep' }
    ]
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'MED-1001',
    name: 'Amlodipine Besylate 5mg',
    genericName: 'Amlodipine',
    category: 'Cardiovascular',
    manufacturer: 'Pfizer Inc.',
    batchNumber: 'BATCH-2026-A1',
    expiryDate: '2027-08-30',
    purchasePrice: 0.40,
    sellingPrice: 1.20,
    stockQuantity: 450,
    minimumStockLevel: 50,
    status: 'In Stock'
  },
  {
    id: 'MED-1002',
    name: 'Metformin HCl 500mg',
    genericName: 'Metformin',
    category: 'Endocrinology',
    manufacturer: 'Novartis',
    batchNumber: 'BATCH-2026-N4',
    expiryDate: '2026-11-15',
    purchasePrice: 0.25,
    sellingPrice: 0.85,
    stockQuantity: 12,
    minimumStockLevel: 30,
    status: 'Low Stock'
  },
  {
    id: 'MED-1003',
    name: 'Amoxicillin 500mg Trihydrate',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    manufacturer: 'GlaxoSmithKline',
    batchNumber: 'BATCH-2025-X9',
    expiryDate: '2025-12-01', // Expired
    purchasePrice: 0.60,
    sellingPrice: 1.80,
    stockQuantity: 100,
    minimumStockLevel: 40,
    status: 'Expired'
  },
  {
    id: 'MED-1004',
    name: 'Atorvastatin Calcium 10mg',
    genericName: 'Atorvastatin',
    category: 'Cardiovascular',
    manufacturer: 'Sanofi',
    batchNumber: 'BATCH-2026-S2',
    expiryDate: '2028-01-20',
    purchasePrice: 0.80,
    sellingPrice: 2.50,
    stockQuantity: 0,
    minimumStockLevel: 25,
    status: 'Out of Stock'
  }
];

export const INITIAL_STOCK_LOGS: StockLog[] = [
  { id: 'LOG-1', medicineId: 'MED-1001', medicineName: 'Amlodipine Besylate 5mg', type: 'Stock In', quantity: 500, reason: 'Initial procurement inventory batch', date: new Date().toISOString().split('T')[0] },
  { id: 'LOG-2', medicineId: 'MED-1002', medicineName: 'Metformin HCl 500mg', type: 'Stock Out', quantity: 88, reason: 'Dispensed to OPD Pharmacy Counter', date: new Date().toISOString().split('T')[0] }
];

export const INITIAL_LAB_TESTS: LabTest[] = [
  { id: 'LAB-101', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 45, description: 'Evaluation of RBC, WBC, Platelets, and Hemoglobin concentration.', referenceRange: 'WBC: 4.5-11.0 k/uL, RBC: 4.2-5.4 M/uL, Hgb: 12.0-16.0 g/dL' },
  { id: 'LAB-102', name: 'Lipid Profile Panel', category: 'Biochemistry', price: 65, description: 'Measures Total Cholesterol, HDL, LDL, and Triglycerides.', referenceRange: 'Total Chol: <200 mg/dL, HDL: >40 mg/dL, LDL: <100 mg/dL' },
  { id: 'LAB-103', name: '12-Lead Electrocardiogram (ECG)', category: 'Cardiology', price: 80, description: 'Electrical activity recording of cardiac sinus rhythm.', referenceRange: 'Normal Sinus Rhythm 60-100 bpm' },
  { id: 'LAB-104', name: 'Glycated Hemoglobin (HbA1c)', category: 'Endocrinology', price: 55, description: 'Average blood sugar levels over the past 3 months.', referenceRange: 'Normal: <5.7%, Prediabetes: 5.7-6.4%, Diabetes: >=6.5%' }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'LOR-2026-001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Robert Chen',
    testId: 'LAB-102',
    testName: 'Lipid Profile Panel',
    price: 65,
    orderDate: new Date().toISOString().split('T')[0],
    status: 'Verified',
    sampleCollectedAt: '09:15 AM',
    resultValue: 'Total Chol: 185 mg/dL, HDL: 52 mg/dL, LDL: 98 mg/dL',
    referenceRange: 'Total Chol: <200 mg/dL, HDL: >40 mg/dL, LDL: <100 mg/dL',
    technicianName: 'Marcus Vance',
    verifiedBy: 'Dr. Arthur Pendelton',
    verifiedAt: new Date().toISOString().split('T')[0],
    notes: 'Lipid profile within normal physiological limits.'
  },
  {
    id: 'LOR-2026-002',
    patientId: 'PAT-1002',
    patientName: 'Marcus Aurelius Brody',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Emily Watson',
    testId: 'LAB-101',
    testName: 'Complete Blood Count (CBC)',
    price: 45,
    orderDate: new Date().toISOString().split('T')[0],
    status: 'Processing',
    sampleCollectedAt: '10:30 AM',
    technicianName: 'Marcus Vance',
    referenceRange: 'WBC: 4.5-11.0 k/uL, RBC: 4.2-5.4 M/uL, Hgb: 12.0-16.0 g/dL'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    patientId: 'PAT-1001',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 890-1234',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    items: [
      { id: 'ITM-1', serviceCategory: 'Consultation', description: 'Cardiology OPD Consultation Fee (Dr. Robert Chen)', quantity: 1, unitPrice: 150, total: 150 },
      { id: 'ITM-2', serviceCategory: 'Laboratory', description: 'Lipid Profile Panel Test', quantity: 1, unitPrice: 65, total: 65 },
      { id: 'ITM-3', serviceCategory: 'Pharmacy', description: 'Amlodipine Besylate 5mg (30 Tablets)', quantity: 1, unitPrice: 36, total: 36 }
    ],
    subtotal: 251,
    discount: 11,
    taxRate: 5,
    taxAmount: 12,
    grandTotal: 252,
    paidAmount: 252,
    balanceAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    notes: 'Thank you for choosing Aura Health.'
  },
  {
    id: 'INV-2026-002',
    patientId: 'PAT-1002',
    patientName: 'Marcus Aurelius Brody',
    patientPhone: '+1 (555) 789-0123',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    items: [
      { id: 'ITM-10', serviceCategory: 'Admission', description: 'ICU Ward Daily Charge (2 Days)', quantity: 2, unitPrice: 350, total: 700 },
      { id: 'ITM-11', serviceCategory: 'Laboratory', description: 'Complete Blood Count (CBC)', quantity: 1, unitPrice: 45, total: 45 }
    ],
    subtotal: 745,
    discount: 45,
    taxRate: 5,
    taxAmount: 35,
    grandTotal: 735,
    paidAmount: 300,
    balanceAmount: 435,
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Cash',
    notes: 'Initial deposit paid. Remaining balance due within 7 days.'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: 'PAY-8001', invoiceId: 'INV-2026-001', amount: 252, paymentMethod: 'Card', paymentDate: new Date().toISOString().split('T')[0], notes: 'Full settlement via Visa' },
  { id: 'PAY-8002', invoiceId: 'INV-2026-002', amount: 300, paymentMethod: 'Cash', paymentDate: new Date().toISOString().split('T')[0], notes: 'Deposit payment' }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'EMP-101', name: 'Nurse Clara Oswald', departmentId: 'DEP-CARDIO', departmentName: 'Cardiology', position: 'Head Cardiac Nurse', phone: '+1 (555) 321-7788', email: 'clara@hospital.com', joiningDate: '2024-03-15', status: 'Active' },
  { id: 'EMP-102', name: 'James Miller', departmentId: 'DEP-EMERG', departmentName: 'Emergency Medicine', position: 'Senior Medical Receptionist', phone: '+1 (555) 432-8899', email: 'reception@hospital.com', joiningDate: '2023-11-01', status: 'Active' },
  { id: 'EMP-103', name: 'Elena Rostova', departmentId: 'DEP-CARDIO', departmentName: 'Cardiology', position: 'Chief Pharmacist', phone: '+1 (555) 543-9900', email: 'pharma@hospital.com', joiningDate: '2024-01-10', status: 'Active' },
  { id: 'EMP-104', name: 'Marcus Vance', departmentId: 'DEP-NEURO', departmentName: 'Neurology', position: 'Senior Lab Technologist', phone: '+1 (555) 654-0011', email: 'lab@hospital.com', joiningDate: '2023-08-20', status: 'Active' },
  { id: 'EMP-105', name: 'David Sterling', departmentId: 'DEP-EMERG', departmentName: 'Emergency Medicine', position: 'Senior Billing Accountant', phone: '+1 (555) 765-1122', email: 'accounts@hospital.com', joiningDate: '2024-05-02', status: 'Active' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'ATT-1001', employeeId: 'EMP-101', employeeName: 'Nurse Clara Oswald', departmentName: 'Cardiology', date: new Date().toISOString().split('T')[0], checkIn: '07:55 AM', checkOut: '04:00 PM', status: 'Present' },
  { id: 'ATT-1002', employeeId: 'EMP-102', employeeName: 'James Miller', departmentName: 'Emergency Medicine', date: new Date().toISOString().split('T')[0], checkIn: '08:12 AM', checkOut: '04:30 PM', status: 'Late' },
  { id: 'ATT-1003', employeeId: 'EMP-103', employeeName: 'Elena Rostova', departmentName: 'Cardiology', date: new Date().toISOString().split('T')[0], checkIn: '08:00 AM', status: 'Present' },
  { id: 'ATT-1004', employeeId: 'EMP-104', employeeName: 'Marcus Vance', departmentName: 'Neurology', date: new Date().toISOString().split('T')[0], status: 'Leave' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'NOTIF-1', title: 'Low Stock Warning', message: 'Metformin HCl 500mg has reached low stock threshold (12 Units remaining).', timestamp: '10 minutes ago', read: false, type: 'warning' },
  { id: 'NOTIF-2', title: 'New IPD Admission', message: 'Eleanor Vance admitted to Room 101-W (Bed 101-A).', timestamp: '1 hour ago', read: false, type: 'info' },
  { id: 'NOTIF-3', title: 'Lab Report Verified', message: 'Lipid Profile Panel for Eleanor Vance has been verified by Dr. Arthur Pendelton.', timestamp: '2 hours ago', read: true, type: 'success' },
  { id: 'NOTIF-4', title: 'Pending Settlement', message: 'Invoice INV-2026-002 has an outstanding balance of $435.00 due.', timestamp: '3 hours ago', read: false, type: 'alert' }
];

export const INITIAL_SETTINGS: HospitalSettings = {
  hospitalName: 'AURA HEALTH CENTRAL HOSPITAL',
  logoUrl: '',
  address: '100 Healthcare Boulevard, Suite 400, Medical District',
  phone: '+1 (555) 019-9944',
  email: 'info@aurahealth.com',
  website: 'www.aurahealth.com',
  registrationNumber: 'MED-REG-2026-88910',
  currency: 'USD ($)',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '12 Hours (AM/PM)',
  appointmentSlotDuration: 30,
  enableLowStockAlerts: true,
  enableExpiryAlerts: true,
};

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  { id: 'USR-101', name: 'System Admin', email: 'admin@hospital.com', role: 'Super Admin', status: 'Active', createdAt: '2024-01-01', lastLogin: 'Just now' },
  { id: 'USR-102', name: 'Dr. Robert Chen', email: 'doctor@hospital.com', role: 'Doctor', status: 'Active', createdAt: '2024-02-15', lastLogin: '2 hours ago' },
  { id: 'USR-103', name: 'Clara Oswald', email: 'nurse@hospital.com', role: 'Nurse', status: 'Active', createdAt: '2024-03-01', lastLogin: '1 day ago' },
  { id: 'USR-104', name: 'David Sterling', email: 'accounts@hospital.com', role: 'Accountant', status: 'Active', createdAt: '2024-05-10', lastLogin: '3 hours ago' }
];

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  { id: 'AUD-9001', user: 'System Admin', userRole: 'Super Admin', action: 'User Permission Role Updated', entity: 'RBAC', entityId: 'ROLE-DOC', timestamp: '2026-08-18 09:15:22', metadata: 'Granted IPD Admission override rights to Doctor role.' },
  { id: 'AUD-9002', user: 'David Sterling', userRole: 'Accountant', action: 'Payment Recorded', entity: 'Invoice', entityId: 'INV-2026-001', timestamp: '2026-08-18 10:30:11', metadata: 'Collected $252.00 settlement via Card.' },
  { id: 'AUD-9003', user: 'Dr. Robert Chen', userRole: 'Doctor', action: 'OPD Consultation Saved', entity: 'Consultation', entityId: 'OPD-1001', timestamp: '2026-08-18 11:45:00', metadata: 'Diagnosed Essential Hypertension for PAT-1001.' }
];

export const INITIAL_TOKENS: CheckInToken[] = [
  { id: 'TKN-101', tokenNumber: 'A-001', patientId: 'PAT-1001', patientName: 'Eleanor Vance', doctorId: 'DOC-101', doctorName: 'Dr. Robert Chen', departmentName: 'Cardiology', checkInTime: '08:30 AM', queuePosition: 1, status: 'In Consultation' },
  { id: 'TKN-102', tokenNumber: 'A-002', patientId: 'PAT-1002', patientName: 'Marcus Aurelius Brody', doctorId: 'DOC-102', doctorName: 'Dr. Emily Watson', departmentName: 'Neurology', checkInTime: '09:00 AM', queuePosition: 2, status: 'Checked In' },
  { id: 'TKN-103', tokenNumber: 'A-003', patientId: 'PAT-1003', patientName: 'Sophia Lin', doctorId: 'DOC-101', doctorName: 'Dr. Robert Chen', departmentName: 'Cardiology', checkInTime: '09:15 AM', queuePosition: 3, status: 'Waiting' }
];

export const INITIAL_TIMELINES: PatientTimelineEvent[] = [
  { id: 'TL-1', patientId: 'PAT-1001', timestamp: '2026-08-18 08:30 AM', eventType: 'Check-in', staffName: 'James Miller', title: 'Reception Patient Check-in', description: 'Assigned Token A-001 for Cardiology OPD Consultation.' },
  { id: 'TL-2', patientId: 'PAT-1001', timestamp: '2026-08-18 09:00 AM', eventType: 'Consultation', staffName: 'Dr. Robert Chen', title: 'OPD Clinical Assessment Completed', description: 'Vitals: 130/85 mmHg, Pulse 74. Diagnosed Stage 1 Hypertension.' },
  { id: 'TL-3', patientId: 'PAT-1001', timestamp: '2026-08-18 09:15 AM', eventType: 'Prescription', staffName: 'Dr. Robert Chen', title: 'Rx Prescribed', description: 'Prescribed Amlodipine 5mg QD and Metformin 500mg BID.' },
  { id: 'TL-4', patientId: 'PAT-1001', timestamp: '2026-08-18 09:30 AM', eventType: 'Lab Test', staffName: 'Marcus Vance', title: 'Lipid Profile Specimen Verified', description: 'Total Cholesterol 185 mg/dL. Verified by Pathologist.' },
  { id: 'TL-5', patientId: 'PAT-1001', timestamp: '2026-08-18 10:15 AM', eventType: 'Payment', staffName: 'David Sterling', title: 'Invoice INV-2026-001 Paid', description: 'Full settlement of $252.00 via Credit Card.' }
];

export const INITIAL_DOCUMENTS: PatientDocument[] = [
  { id: 'DOC-801', patientId: 'PAT-1001', title: 'Cardiac ECG Examination Report.pdf', documentType: 'Lab Report', fileUrl: '#', fileSize: '1.4 MB', uploadedAt: '2026-08-18', uploadedBy: 'Dr. Robert Chen' },
  { id: 'DOC-802', patientId: 'PAT-1001', title: 'Patient National Identification Card.png', documentType: 'ID Proof', fileUrl: '#', fileSize: '850 KB', uploadedAt: '2026-08-10', uploadedBy: 'James Miller' }
];

export const INITIAL_BRANCHES: BranchInfo[] = [
  { id: 'BR-101', name: 'Aura Central Medical Campus (Main)', code: 'MAIN-01', city: 'Metropolis', status: 'Active' },
  { id: 'BR-102', name: 'Aura North Specialty Clinic', code: 'NORTH-02', city: 'North District', status: 'Active' }
];
