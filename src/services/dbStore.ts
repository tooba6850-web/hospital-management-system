import type { Department, Doctor, Patient, Appointment, OPDConsultation, Room, Bed, IPDAdmission, EmergencyCase, Prescription, Medicine, StockLog, LabTest, LabOrder, Invoice, InvoiceItem, PaymentRecord, PaymentMethod, StaffMember, AttendanceRecord, NotificationItem, HospitalSettings, UserAccount, AuditLogRecord, CheckInToken, PatientTimelineEvent, PatientDocument, BranchInfo } from '../types';
import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_OPD_CONSULTATIONS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_ADMISSIONS,
  INITIAL_EMERGENCY_CASES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICINES,
  INITIAL_STOCK_LOGS,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_ORDERS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_STAFF,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TOKENS,
  INITIAL_TIMELINES,
  INITIAL_DOCUMENTS,
  INITIAL_BRANCHES
} from '../data/initialData';

const KEYS = {
  DEPARTMENTS: 'hms_departments_v1',
  DOCTORS: 'hms_doctors_v1',
  PATIENTS: 'hms_patients_v1',
  APPOINTMENTS: 'hms_appointments_v1',
  OPD: 'hms_opd_v1',
  ROOMS: 'hms_rooms_v1',
  BEDS: 'hms_beds_v1',
  ADMISSIONS: 'hms_admissions_v1',
  EMERGENCY: 'hms_emergency_v1',
  PRESCRIPTIONS: 'hms_prescriptions_v1',
  MEDICINES: 'hms_medicines_v1',
  STOCK_LOGS: 'hms_stock_logs_v1',
  LAB_TESTS: 'hms_lab_tests_v1',
  LAB_ORDERS: 'hms_lab_orders_v1',
  INVOICES: 'hms_invoices_v1',
  PAYMENTS: 'hms_payments_v1',
  STAFF: 'hms_staff_v1',
  ATTENDANCE: 'hms_attendance_v1',
  NOTIFICATIONS: 'hms_notifications_v1',
  SETTINGS: 'hms_settings_v1',
  USERS: 'hms_users_v1',
  AUDIT_LOGS: 'hms_audit_logs_v1',
  TOKENS: 'hms_tokens_v1',
  TIMELINES: 'hms_timelines_v1',
  DOCUMENTS: 'hms_documents_v1',
  BRANCHES: 'hms_branches_v1',
};

class DataStoreService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.DEPARTMENTS)) {
      localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    }
    if (!localStorage.getItem(KEYS.DOCTORS)) {
      localStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    }
    if (!localStorage.getItem(KEYS.PATIENTS)) {
      localStorage.setItem(KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    }
    if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(KEYS.OPD)) {
      localStorage.setItem(KEYS.OPD, JSON.stringify(INITIAL_OPD_CONSULTATIONS));
    }
    if (!localStorage.getItem(KEYS.ROOMS)) {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    }
    if (!localStorage.getItem(KEYS.BEDS)) {
      localStorage.setItem(KEYS.BEDS, JSON.stringify(INITIAL_BEDS));
    }
    if (!localStorage.getItem(KEYS.ADMISSIONS)) {
      localStorage.setItem(KEYS.ADMISSIONS, JSON.stringify(INITIAL_ADMISSIONS));
    }
    if (!localStorage.getItem(KEYS.EMERGENCY)) {
      localStorage.setItem(KEYS.EMERGENCY, JSON.stringify(INITIAL_EMERGENCY_CASES));
    }
    if (!localStorage.getItem(KEYS.PRESCRIPTIONS)) {
      localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    }
    if (!localStorage.getItem(KEYS.MEDICINES)) {
      localStorage.setItem(KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    }
    if (!localStorage.getItem(KEYS.STOCK_LOGS)) {
      localStorage.setItem(KEYS.STOCK_LOGS, JSON.stringify(INITIAL_STOCK_LOGS));
    }
    if (!localStorage.getItem(KEYS.LAB_TESTS)) {
      localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(INITIAL_LAB_TESTS));
    }
    if (!localStorage.getItem(KEYS.LAB_ORDERS)) {
      localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(INITIAL_LAB_ORDERS));
    }
    if (!localStorage.getItem(KEYS.INVOICES)) {
      localStorage.setItem(KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    }
    if (!localStorage.getItem(KEYS.PAYMENTS)) {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    }
    if (!localStorage.getItem(KEYS.STAFF)) {
      localStorage.setItem(KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USER_ACCOUNTS));
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(KEYS.TOKENS)) {
      localStorage.setItem(KEYS.TOKENS, JSON.stringify(INITIAL_TOKENS));
    }
    if (!localStorage.getItem(KEYS.TIMELINES)) {
      localStorage.setItem(KEYS.TIMELINES, JSON.stringify(INITIAL_TIMELINES));
    }
    if (!localStorage.getItem(KEYS.DOCUMENTS)) {
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    }
    if (!localStorage.getItem(KEYS.BRANCHES)) {
      localStorage.setItem(KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
    }
  }

  // --- Patients ---
  getPatients(): Patient[] {
    return JSON.parse(localStorage.getItem(KEYS.PATIENTS) || '[]');
  }

  getPatientById(id: string): Patient | undefined {
    return this.getPatients().find(p => p.id === id);
  }

  savePatient(patientData: Omit<Patient, 'id' | 'registrationDate' | 'status'> & { id?: string }): Patient {
    const patients = this.getPatients();
    if (patientData.id) {
      const index = patients.findIndex(p => p.id === patientData.id);
      if (index !== -1) {
        patients[index] = { ...patients[index], ...patientData };
        localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
        return patients[index];
      }
    }
    const nextNum = patients.length + 1001;
    const newPatient: Patient = {
      ...patientData,
      id: `PAT-${nextNum}`,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    patients.unshift(newPatient);
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  }

  deactivatePatient(id: string): void {
    const patients = this.getPatients().map(p => p.id === id ? { ...p, status: 'deactivated' as const } : p);
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
  }

  updatePatientVitals(patientId: string, vitals: any): void {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patientId);
    if (index !== -1) {
      patients[index] = { ...patients[index], vitals: { ...(patients[index] as any).vitals, ...vitals } };
      localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    }
  }

  // --- Doctors ---
  getDoctors(): Doctor[] {
    return JSON.parse(localStorage.getItem(KEYS.DOCTORS) || '[]');
  }

  saveDoctor(doctorData: Omit<Doctor, 'id'> & { id?: string }): Doctor {
    const doctors = this.getDoctors();
    const depts = this.getDepartments();
    const dept = depts.find(d => d.id === doctorData.departmentId);
    const departmentName = dept ? dept.name : doctorData.departmentName || 'General';

    if (doctorData.id) {
      const idx = doctors.findIndex(d => d.id === doctorData.id);
      if (idx !== -1) {
        doctors[idx] = { ...doctors[idx], ...doctorData, departmentName };
        localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
        this.recalculateDepartmentCounts();
        return doctors[idx];
      }
    }

    const nextNum = doctors.length + 101;
    const newDoctor: Doctor = {
      ...doctorData,
      id: `DOC-${nextNum}`,
      departmentName
    };
    doctors.unshift(newDoctor);
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
    this.recalculateDepartmentCounts();
    return newDoctor;
  }

  // --- Departments ---
  getDepartments(): Department[] {
    return JSON.parse(localStorage.getItem(KEYS.DEPARTMENTS) || '[]');
  }

  saveDepartment(deptData: Omit<Department, 'id' | 'doctorCount' | 'appointmentCount' | 'createdAt'> & { id?: string }): Department {
    const depts = this.getDepartments();
    if (deptData.id) {
      const idx = depts.findIndex(d => d.id === deptData.id);
      if (idx !== -1) {
        depts[idx] = { ...depts[idx], ...deptData };
        localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(depts));
        return depts[idx];
      }
    }
    const newDept: Department = {
      ...deptData,
      id: `DEP-${deptData.code.toUpperCase()}`,
      doctorCount: 0,
      appointmentCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    depts.unshift(newDept);
    localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(depts));
    return newDept;
  }

  // --- Appointments ---
  getAppointments(): Appointment[] {
    return JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]');
  }

  checkAppointmentConflict(doctorId: string, date: string, time: string, excludeId?: string): boolean {
    const appointments = this.getAppointments();
    return appointments.some(a => 
      a.doctorId === doctorId && 
      a.date === date && 
      a.time === time && 
      a.status !== 'Cancelled' && 
      a.id !== excludeId
    );
  }

  saveAppointment(aptData: Omit<Appointment, 'id' | 'createdAt'> & { id?: string }): { success: boolean; appointment?: Appointment; error?: string } {
    if (this.checkAppointmentConflict(aptData.doctorId, aptData.date, aptData.time, aptData.id)) {
      return { success: false, error: 'Doctor has a conflicting appointment at the selected date and time.' };
    }

    const appointments = this.getAppointments();
    if (aptData.id) {
      const idx = appointments.findIndex(a => a.id === aptData.id);
      if (idx !== -1) {
        appointments[idx] = { ...appointments[idx], ...aptData };
        localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
        this.recalculateDepartmentCounts();
        return { success: true, appointment: appointments[idx] };
      }
    }

    const newApt: Appointment = {
      ...aptData,
      id: `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    appointments.unshift(newApt);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
    this.recalculateDepartmentCounts();
    return { success: true, appointment: newApt };
  }

  updateAppointmentStatus(id: string, status: Appointment['status']): void {
    const appointments = this.getAppointments().map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  // --- OPD Consultations ---
  getOPDConsultations(): OPDConsultation[] {
    return JSON.parse(localStorage.getItem(KEYS.OPD) || '[]');
  }

  saveOPDConsultation(opdData: Omit<OPDConsultation, 'id'> & { id?: string }): OPDConsultation {
    const opds = this.getOPDConsultations();
    if (opdData.id) {
      const idx = opds.findIndex(o => o.id === opdData.id);
      if (idx !== -1) {
        opds[idx] = { ...opds[idx], ...opdData };
        localStorage.setItem(KEYS.OPD, JSON.stringify(opds));
        return opds[idx];
      }
    }
    const newOPD: OPDConsultation = {
      ...opdData,
      id: `OPD-${Math.floor(9000 + Math.random() * 1000)}`
    };
    opds.unshift(newOPD);
    localStorage.setItem(KEYS.OPD, JSON.stringify(opds));

    if (opdData.appointmentId) {
      this.updateAppointmentStatus(opdData.appointmentId, 'Completed');
    }
    return newOPD;
  }

  // --- Rooms & Beds ---
  getRooms(): Room[] {
    return JSON.parse(localStorage.getItem(KEYS.ROOMS) || '[]');
  }

  saveRoom(roomData: Omit<Room, 'id' | 'status'> & { id?: string }): Room {
    const rooms = this.getRooms();
    if (roomData.id) {
      const idx = rooms.findIndex(r => r.id === roomData.id);
      if (idx !== -1) {
        rooms[idx] = { ...rooms[idx], ...roomData };
        localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
        return rooms[idx];
      }
    }
    const newRoom: Room = {
      ...roomData,
      id: `RM-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Available'
    };
    rooms.unshift(newRoom);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    return newRoom;
  }

  getBeds(): Bed[] {
    return JSON.parse(localStorage.getItem(KEYS.BEDS) || '[]');
  }

  saveBed(bedData: Omit<Bed, 'id'> & { id?: string }): Bed {
    const beds = this.getBeds();
    if (bedData.id) {
      const idx = beds.findIndex(b => b.id === bedData.id);
      if (idx !== -1) {
        beds[idx] = { ...beds[idx], ...bedData };
        localStorage.setItem(KEYS.BEDS, JSON.stringify(beds));
        return beds[idx];
      }
    }
    const newBed: Bed = {
      ...bedData,
      id: `BED-${Math.floor(100 + Math.random() * 900)}`
    };
    beds.unshift(newBed);
    localStorage.setItem(KEYS.BEDS, JSON.stringify(beds));
    return newBed;
  }

  updateBedStatus(bedId: string, status: Bed['status'], patientId?: string, patientName?: string): void {
    const beds = this.getBeds().map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status,
          patientId: status === 'Occupied' ? patientId : undefined,
          patientName: status === 'Occupied' ? patientName : undefined
        };
      }
      return b;
    });
    localStorage.setItem(KEYS.BEDS, JSON.stringify(beds));
  }

  // --- IPD Admissions ---
  getAdmissions(): IPDAdmission[] {
    return JSON.parse(localStorage.getItem(KEYS.ADMISSIONS) || '[]');
  }

  createAdmission(admData: Omit<IPDAdmission, 'id' | 'status'>): IPDAdmission {
    const admissions = this.getAdmissions();
    const newAdm: IPDAdmission = {
      ...admData,
      id: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Admitted'
    };
    admissions.unshift(newAdm);
    localStorage.setItem(KEYS.ADMISSIONS, JSON.stringify(admissions));

    // Automatically mark assigned bed as Occupied
    this.updateBedStatus(admData.bedId, 'Occupied', admData.patientId, admData.patientName);

    return newAdm;
  }

  updateAdmissionStatus(id: string, status: IPDAdmission['status'], dischargeSummary?: string): void {
    const admissions = this.getAdmissions();
    const idx = admissions.findIndex(a => a.id === id);
    if (idx !== -1) {
      const adm = admissions[idx];
      adm.status = status;
      if (status === 'Discharged') {
        adm.dischargeDate = new Date().toISOString().split('T')[0];
        if (dischargeSummary) adm.dischargeSummary = dischargeSummary;
        // Release the assigned bed automatically
        this.updateBedStatus(adm.bedId, 'Available');
      }
      localStorage.setItem(KEYS.ADMISSIONS, JSON.stringify(admissions));
    }
  }

  // --- Emergency Cases ---
  getEmergencyCases(): EmergencyCase[] {
    return JSON.parse(localStorage.getItem(KEYS.EMERGENCY) || '[]');
  }

  saveEmergencyCase(caseData: Omit<EmergencyCase, 'id'> & { id?: string }): EmergencyCase {
    const cases = this.getEmergencyCases();
    if (caseData.id) {
      const idx = cases.findIndex(c => c.id === caseData.id);
      if (idx !== -1) {
        cases[idx] = { ...cases[idx], ...caseData };
        localStorage.setItem(KEYS.EMERGENCY, JSON.stringify(cases));
        return cases[idx];
      }
    }
    const newCase: EmergencyCase = {
      ...caseData,
      id: `EMG-${Math.floor(9000 + Math.random() * 1000)}`
    };
    cases.unshift(newCase);
    localStorage.setItem(KEYS.EMERGENCY, JSON.stringify(cases));
    return newCase;
  }

  updateEmergencyStatus(id: string, status: EmergencyCase['status']): void {
    const cases = this.getEmergencyCases().map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(KEYS.EMERGENCY, JSON.stringify(cases));
  }

  // --- Prescriptions ---
  getPrescriptions(): Prescription[] {
    return JSON.parse(localStorage.getItem(KEYS.PRESCRIPTIONS) || '[]');
  }

  savePrescription(rxData: Omit<Prescription, 'id'> & { id?: string }): Prescription {
    const rxs = this.getPrescriptions();
    if (rxData.id) {
      const idx = rxs.findIndex(r => r.id === rxData.id);
      if (idx !== -1) {
        rxs[idx] = { ...rxs[idx], ...rxData };
        localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(rxs));
        return rxs[idx];
      }
    }
    const newRx: Prescription = {
      ...rxData,
      id: `RX-2026-${Math.floor(8000 + Math.random() * 1000)}`
    };
    rxs.unshift(newRx);
    localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(rxs));
    return newRx;
  }

  // --- Pharmacy & Stock Control ---
  getMedicines(): Medicine[] {
    return JSON.parse(localStorage.getItem(KEYS.MEDICINES) || '[]');
  }

  saveMedicine(medData: Omit<Medicine, 'id' | 'status'> & { id?: string }): Medicine {
    const meds = this.getMedicines();
    const today = new Date().toISOString().split('T')[0];
    
    let status: Medicine['status'] = 'In Stock';
    if (medData.expiryDate < today) {
      status = 'Expired';
    } else if (medData.stockQuantity <= 0) {
      status = 'Out of Stock';
    } else if (medData.stockQuantity <= medData.minimumStockLevel) {
      status = 'Low Stock';
    }

    if (medData.id) {
      const idx = meds.findIndex(m => m.id === medData.id);
      if (idx !== -1) {
        meds[idx] = { ...meds[idx], ...medData, status };
        localStorage.setItem(KEYS.MEDICINES, JSON.stringify(meds));
        return meds[idx];
      }
    }
    const newMed: Medicine = {
      ...medData,
      id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      status
    };
    meds.unshift(newMed);
    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(meds));
    return newMed;
  }

  adjustMedicineStock(medicineId: string, type: 'Stock In' | 'Stock Out', qty: number, reason: string): { success: boolean; error?: string } {
    const meds = this.getMedicines();
    const idx = meds.findIndex(m => m.id === medicineId);
    if (idx === -1) return { success: false, error: 'Medicine record not found.' };

    const med = meds[idx];
    if (type === 'Stock Out' && med.stockQuantity < qty) {
      return { success: false, error: `Insufficient stock quantity. Available: ${med.stockQuantity}` };
    }

    const newQty = type === 'Stock In' ? med.stockQuantity + qty : med.stockQuantity - qty;
    med.stockQuantity = newQty;

    const today = new Date().toISOString().split('T')[0];
    if (med.expiryDate < today) {
      med.status = 'Expired';
    } else if (newQty <= 0) {
      med.status = 'Out of Stock';
    } else if (newQty <= med.minimumStockLevel) {
      med.status = 'Low Stock';
    } else {
      med.status = 'In Stock';
    }

    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(meds));

    // Record Stock Activity Log
    const logs: StockLog[] = JSON.parse(localStorage.getItem(KEYS.STOCK_LOGS) || '[]');
    logs.unshift({
      id: `LOG-${Date.now()}`,
      medicineId: med.id,
      medicineName: med.name,
      type,
      quantity: qty,
      reason,
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem(KEYS.STOCK_LOGS, JSON.stringify(logs));

    return { success: true };
  }

  getStockLogs(): StockLog[] {
    return JSON.parse(localStorage.getItem(KEYS.STOCK_LOGS) || '[]');
  }

  // --- Laboratory ---
  getLabTests(): LabTest[] {
    return JSON.parse(localStorage.getItem(KEYS.LAB_TESTS) || '[]');
  }

  saveLabTest(testData: Omit<LabTest, 'id'> & { id?: string }): LabTest {
    const tests = this.getLabTests();
    if (testData.id) {
      const idx = tests.findIndex(t => t.id === testData.id);
      if (idx !== -1) {
        tests[idx] = { ...tests[idx], ...testData };
        localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(tests));
        return tests[idx];
      }
    }
    const newTest: LabTest = {
      ...testData,
      id: `LAB-${Math.floor(100 + Math.random() * 900)}`
    };
    tests.unshift(newTest);
    localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(tests));
    return newTest;
  }

  getLabOrders(): LabOrder[] {
    return JSON.parse(localStorage.getItem(KEYS.LAB_ORDERS) || '[]');
  }

  createLabOrder(orderData: Omit<LabOrder, 'id' | 'status' | 'orderDate'>): LabOrder {
    const orders = this.getLabOrders();
    const newOrder: LabOrder = {
      ...orderData,
      id: `LOR-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Requested'
    };
    orders.unshift(newOrder);
    localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  updateLabOrderStatus(
    id: string, 
    status: LabOrder['status'], 
    payload?: { 
      sampleCollectedAt?: string; 
      resultValue?: string; 
      technicianName?: string; 
      verifiedBy?: string; 
      notes?: string; 
    }
  ): void {
    const orders = this.getLabOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      const ord = orders[idx];
      ord.status = status;
      if (payload?.sampleCollectedAt) ord.sampleCollectedAt = payload.sampleCollectedAt;
      if (payload?.resultValue) ord.resultValue = payload.resultValue;
      if (payload?.technicianName) ord.technicianName = payload.technicianName;
      if (payload?.notes) ord.notes = payload.notes;

      if (status === 'Verified') {
        ord.verifiedBy = payload?.verifiedBy || 'Dr. Arthur Pendelton';
        ord.verifiedAt = new Date().toISOString().split('T')[0];
      }
      localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(orders));
    }
  }

  // --- Billing, Invoices & Payments ---
  getInvoices(): Invoice[] {
    return JSON.parse(localStorage.getItem(KEYS.INVOICES) || '[]');
  }

  getPayments(): PaymentRecord[] {
    return JSON.parse(localStorage.getItem(KEYS.PAYMENTS) || '[]');
  }

  // Mandatory Backend Financial Recalculation Engine
  saveInvoice(invoiceData: {
    id?: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    items: Omit<InvoiceItem, 'total'>[];
    discount: number;
    taxRate: number;
    notes?: string;
  }): Invoice {
    const invoices = this.getInvoices();

    // 1. Recalculate line item totals
    const itemsWithTotals: InvoiceItem[] = invoiceData.items.map((item, idx) => ({
      ...item,
      id: item.id || `ITM-${Date.now()}-${idx}`,
      total: Number((item.quantity * item.unitPrice).toFixed(2))
    }));

    // 2. Recalculate Subtotal
    const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);

    // 3. Apply Discount & Tax Rate
    const discount = Math.min(invoiceData.discount || 0, subtotal);
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const taxAmount = Number(((taxableSubtotal * (invoiceData.taxRate || 0)) / 100).toFixed(2));

    // 4. Calculate Grand Total
    const grandTotal = Number((taxableSubtotal + taxAmount).toFixed(2));

    // Preserve payment history if updating
    let paidAmount = 0;
    let existingMethod: PaymentMethod | undefined = undefined;

    if (invoiceData.id) {
      const existing = invoices.find(inv => inv.id === invoiceData.id);
      if (existing) {
        paidAmount = existing.paidAmount;
        existingMethod = existing.paymentMethod;
      }
    }

    const balanceAmount = Number(Math.max(0, grandTotal - paidAmount).toFixed(2));
    let paymentStatus: Invoice['paymentStatus'] = 'Pending';
    if (paidAmount >= grandTotal && grandTotal > 0) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'Partially Paid';
    }

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const invoiceObj: Invoice = {
      id: invoiceData.id || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: invoiceData.patientId,
      patientName: invoiceData.patientName,
      patientPhone: invoiceData.patientPhone,
      date: today,
      dueDate,
      items: itemsWithTotals,
      subtotal,
      discount,
      taxRate: invoiceData.taxRate || 0,
      taxAmount,
      grandTotal,
      paidAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod: existingMethod,
      notes: invoiceData.notes
    };

    if (invoiceData.id) {
      const idx = invoices.findIndex(i => i.id === invoiceData.id);
      if (idx !== -1) {
        invoices[idx] = invoiceObj;
        localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
        return invoiceObj;
      }
    }

    invoices.unshift(invoiceObj);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
    return invoiceObj;
  }

  recordPayment(invoiceId: string, amount: number, method: PaymentMethod, notes?: string): { success: boolean; invoice?: Invoice; error?: string } {
    const invoices = this.getInvoices();
    const idx = invoices.findIndex(i => i.id === invoiceId);
    if (idx === -1) return { success: false, error: 'Invoice record not found.' };

    const inv = invoices[idx];
    if (amount <= 0) return { success: false, error: 'Payment amount must be greater than zero.' };

    const newPaidAmount = Number((inv.paidAmount + amount).toFixed(2));
    if (newPaidAmount > inv.grandTotal) {
      return { success: false, error: `Payment amount ($${amount}) exceeds remaining balance ($${inv.balanceAmount}).` };
    }

    inv.paidAmount = newPaidAmount;
    inv.balanceAmount = Number(Math.max(0, inv.grandTotal - newPaidAmount).toFixed(2));
    inv.paymentMethod = method;

    if (inv.balanceAmount === 0) {
      inv.paymentStatus = 'Paid';
    } else {
      inv.paymentStatus = 'Partially Paid';
    }

    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // Record Payment Transaction Log
    const payments: PaymentRecord[] = this.getPayments();
    payments.unshift({
      id: `PAY-${Math.floor(8000 + Math.random() * 1000)}`,
      invoiceId: inv.id,
      amount,
      paymentMethod: method,
      paymentDate: new Date().toISOString().split('T')[0],
      notes
    });
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));

    return { success: true, invoice: inv };
  }

  // --- Staff & Attendance ---
  getStaff(): StaffMember[] {
    return JSON.parse(localStorage.getItem(KEYS.STAFF) || '[]');
  }

  saveStaff(staffData: Omit<StaffMember, 'id'> & { id?: string }): StaffMember {
    const staff = this.getStaff();
    const depts = this.getDepartments();
    const dept = depts.find(d => d.id === staffData.departmentId);
    const departmentName = dept ? dept.name : staffData.departmentName || 'General';

    if (staffData.id) {
      const idx = staff.findIndex(s => s.id === staffData.id);
      if (idx !== -1) {
        staff[idx] = { ...staff[idx], ...staffData, departmentName };
        localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
        return staff[idx];
      }
    }

    const newStaff: StaffMember = {
      ...staffData,
      id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      departmentName
    };
    staff.unshift(newStaff);
    localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
    return newStaff;
  }

  deactivateStaff(id: string): void {
    const staff = this.getStaff().map(s => s.id === id ? { ...s, status: 'Deactivated' as const } : s);
    localStorage.setItem(KEYS.STAFF, JSON.stringify(staff));
  }

  getAttendance(): AttendanceRecord[] {
    return JSON.parse(localStorage.getItem(KEYS.ATTENDANCE) || '[]');
  }

  recordAttendance(recData: Omit<AttendanceRecord, 'id'> & { id?: string }): AttendanceRecord {
    const records = this.getAttendance();
    if (recData.id) {
      const idx = records.findIndex(r => r.id === recData.id);
      if (idx !== -1) {
        records[idx] = { ...records[idx], ...recData };
        localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
        return records[idx];
      }
    }
    const newRec: AttendanceRecord = {
      ...recData,
      id: `ATT-${Math.floor(1000 + Math.random() * 9000)}`
    };
    records.unshift(newRec);
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
    return newRec;
  }

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
  }

  markNotificationAsRead(id?: string): void {
    const notifs = this.getNotifications().map(n => {
      if (!id || n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // --- Hospital Settings ---
  getSettings(): HospitalSettings {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(INITIAL_SETTINGS));
  }

  saveSettings(settings: HospitalSettings): HospitalSettings {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    this.recordAuditLog('System Admin', 'Admin', 'Updated Hospital Branding & Settings', 'Settings', 'CFG-01', 'Updated hospital contact & currency');
    return settings;
  }

  // --- Users & Access Control ---
  getUsers(): UserAccount[] {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  }

  saveUser(userData: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }): UserAccount {
    const users = this.getUsers();
    if (userData.id) {
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...userData };
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
        this.recordAuditLog('System Admin', 'Admin', 'Updated User Profile', 'UserAccount', users[idx].id, `Assigned role ${userData.role}`);
        return users[idx];
      }
    }
    const newUser: UserAccount = {
      ...userData,
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.unshift(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.recordAuditLog('System Admin', 'Admin', 'Created User Account', 'UserAccount', newUser.id, `User ${newUser.name} created with role ${newUser.role}`);
    return newUser;
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLogRecord[] {
    return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
  }

  recordAuditLog(user: string, userRole: string, action: string, entity: string, entityId: string, metadata?: string): void {
    const logs: AuditLogRecord[] = this.getAuditLogs();
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    logs.unshift({
      id: `AUD-${Math.floor(9000 + Math.random() * 1000)}`,
      user,
      userRole,
      action,
      entity,
      entityId,
      timestamp,
      metadata
    });
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  // --- Queue Tokens ---
  getTokens(): CheckInToken[] {
    return JSON.parse(localStorage.getItem(KEYS.TOKENS) || '[]');
  }

  generateToken(patientId: string, doctorId: string): CheckInToken {
    const tokens = this.getTokens();
    const patients = this.getPatients();
    const doctors = this.getDoctors();

    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);

    const count = tokens.length + 1;
    const tokenNumber = `A-${count < 10 ? '00' : count < 100 ? '0' : ''}${count}`;

    const newToken: CheckInToken = {
      id: `TKN-${Math.floor(100 + Math.random() * 900)}`,
      tokenNumber,
      patientId,
      patientName: patient ? patient.fullName : 'Unknown Patient',
      doctorId,
      doctorName: doctor ? doctor.name : 'Unassigned',
      departmentName: doctor ? doctor.specialization : 'General',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queuePosition: tokens.filter(t => t.status === 'Waiting' || t.status === 'Checked In').length + 1,
      status: 'Checked In'
    };

    tokens.unshift(newToken);
    localStorage.setItem(KEYS.TOKENS, JSON.stringify(tokens));

    this.addTimelineEvent(patientId, 'Check-in', 'James Miller', `Token ${tokenNumber} Issued`, `Issued queue token for consultation.`);
    this.recordAuditLog('Receptionist', 'Reception', 'Generated Queue Token', 'CheckInToken', newToken.tokenNumber, `Token ${newToken.tokenNumber} for ${newToken.patientName}`);

    return newToken;
  }

  updateTokenStatus(id: string, status: CheckInToken['status']): void {
    const tokens = this.getTokens();
    const idx = tokens.findIndex(t => t.id === id);
    if (idx !== -1) {
      tokens[idx].status = status;
      localStorage.setItem(KEYS.TOKENS, JSON.stringify(tokens));
    }
  }

  // --- Patient Timeline ---
  getTimeline(patientId: string): PatientTimelineEvent[] {
    const events: PatientTimelineEvent[] = JSON.parse(localStorage.getItem(KEYS.TIMELINES) || '[]');
    return events.filter(e => e.patientId === patientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addTimelineEvent(patientId: string, eventType: PatientTimelineEvent['eventType'], staffName: string, title: string, description: string): PatientTimelineEvent {
    const events: PatientTimelineEvent[] = JSON.parse(localStorage.getItem(KEYS.TIMELINES) || '[]');
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newEvt: PatientTimelineEvent = {
      id: `TL-${Date.now()}`,
      patientId,
      timestamp,
      eventType,
      staffName,
      title,
      description
    };
    events.unshift(newEvt);
    localStorage.setItem(KEYS.TIMELINES, JSON.stringify(events));
    return newEvt;
  }

  // --- Patient Documents ---
  getDocuments(patientId: string): PatientDocument[] {
    const docs: PatientDocument[] = JSON.parse(localStorage.getItem(KEYS.DOCUMENTS) || '[]');
    return docs.filter(d => d.patientId === patientId);
  }

  saveDocument(docData: Omit<PatientDocument, 'id' | 'uploadedAt'>): PatientDocument {
    const docs: PatientDocument[] = JSON.parse(localStorage.getItem(KEYS.DOCUMENTS) || '[]');
    const newDoc: PatientDocument = {
      ...docData,
      id: `DOC-${Math.floor(800 + Math.random() * 200)}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    docs.unshift(newDoc);
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
    return newDoc;
  }

  // --- Multi-Branch Infrastructure ---
  getBranches(): BranchInfo[] {
    return JSON.parse(localStorage.getItem(KEYS.BRANCHES) || '[]');
  }

  private recalculateDepartmentCounts() {
    const depts = this.getDepartments();
    const doctors = this.getDoctors();
    const appointments = this.getAppointments();

    const updated = depts.map(d => {
      const doctorCount = doctors.filter(doc => doc.departmentId === d.id && doc.status === 'active').length;
      const appointmentCount = appointments.filter(apt => apt.departmentId === d.id).length;
      return { ...d, doctorCount, appointmentCount };
    });

    localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(updated));
  }
}

export const dbStore = new DataStoreService();
