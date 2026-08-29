import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar, type NavItemKey } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PatientManager } from './components/PatientManager';
import { DoctorManager } from './components/DoctorManager';
import { DepartmentManager } from './components/DepartmentManager';
import { AppointmentManager } from './components/AppointmentManager';
import { OPDManager } from './components/OPDManager';
import { IPDManager } from './components/IPDManager';
import { RoomBedManager } from './components/RoomBedManager';
import { EmergencyManager } from './components/EmergencyManager';
import { PrescriptionManager } from './components/PrescriptionManager';
import { PharmacyManager } from './components/PharmacyManager';
import { LaboratoryManager } from './components/LaboratoryManager';
import { BillingManager } from './components/BillingManager';
import { StaffManager } from './components/StaffManager';
import { ReportCenter } from './components/ReportCenter';
import { SettingsManager } from './components/SettingsManager';
import { DoctorWorkspace } from './components/DoctorWorkspace';
import { NurseWorkspace } from './components/NurseWorkspace';
import { QueueManager } from './components/QueueManager';
import { HospitalCommandCenter } from './components/HospitalCommandCenter';
import { ErrorPage } from './components/ErrorPage';

import { dbStore } from './services/dbStore';
import type { 
  Patient, 
  Doctor, 
  Department, 
  Appointment, 
  OPDConsultation, 
  AppointmentStatus,
  Room,
  Bed,
  IPDAdmission,
  AdmissionStatus,
  EmergencyCase,
  EmergencyStatus,
  Prescription,
  Medicine,
  StockLog,
  LabTest,
  LabOrder,
  Invoice,
  PaymentRecord,
  PaymentMethod,
  StaffMember,
  AttendanceRecord,
  NotificationItem,
  HospitalSettings,
  UserAccount,
  AuditLogRecord,
  CheckInToken
} from './types';

import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { HealthBlogManager } from './components/HealthBlogManager';

const MainLayout: React.FC = () => {
  const { isAuthenticated, can, currentRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavItemKey>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Role-based Personalized Default Dashboard Redirect
  useEffect(() => {
    if (currentRole === 'Doctor') {
      setCurrentTab('doctor_workspace');
    } else if (currentRole === 'Nurse') {
      setCurrentTab('nurse_workspace');
    } else if (currentRole === 'Receptionist') {
      setCurrentTab('queue');
    } else if (currentRole === 'Pharmacist') {
      setCurrentTab('pharmacy');
    } else if (currentRole === 'Lab Technician') {
      setCurrentTab('laboratory');
    } else if (currentRole === 'Accountant') {
      setCurrentTab('billing');
    } else if (currentRole === 'Super Admin' || currentRole === 'Hospital Admin') {
      setCurrentTab('command_center');
    }
  }, [currentRole]);

  // State loaded from dbStore
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [opdConsultations, setOpdConsultations] = useState<OPDConsultation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [admissions, setAdmissions] = useState<IPDAdmission[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<HospitalSettings>(dbStore.getSettings());
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [tokens, setTokens] = useState<CheckInToken[]>([]);

  // Modals / Trigger states
  const [openNewPatientModal, setOpenNewPatientModal] = useState(false);
  const [openNewAppointmentModal, setOpenNewAppointmentModal] = useState(false);
  const [activeConsultAppointment, setActiveConsultAppointment] = useState<Appointment | null>(null);

  const refreshData = () => {
    setPatients(dbStore.getPatients());
    setDoctors(dbStore.getDoctors());
    setDepartments(dbStore.getDepartments());
    setAppointments(dbStore.getAppointments());
    setOpdConsultations(dbStore.getOPDConsultations());
    setRooms(dbStore.getRooms());
    setBeds(dbStore.getBeds());
    setAdmissions(dbStore.getAdmissions());
    setEmergencyCases(dbStore.getEmergencyCases());
    setPrescriptions(dbStore.getPrescriptions());
    setMedicines(dbStore.getMedicines());
    setStockLogs(dbStore.getStockLogs());
    setLabTests(dbStore.getLabTests());
    setLabOrders(dbStore.getLabOrders());
    setInvoices(dbStore.getInvoices());
    setPayments(dbStore.getPayments());
    setStaff(dbStore.getStaff());
    setAttendance(dbStore.getAttendance());
    setNotifications(dbStore.getNotifications());
    setSettings(dbStore.getSettings());
    setUsers(dbStore.getUsers());
    setAuditLogs(dbStore.getAuditLogs());
    setTokens(dbStore.getTokens());
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Handlers
  const handleSavePatient = (pData: any) => {
    dbStore.savePatient(pData);
    refreshData();
  };

  const handleDeactivatePatient = (id: string) => {
    dbStore.deactivatePatient(id);
    refreshData();
  };

  const handleSaveDoctor = (dData: any) => {
    dbStore.saveDoctor(dData);
    refreshData();
  };

  const handleSaveDepartment = (deptData: any) => {
    dbStore.saveDepartment(deptData);
    refreshData();
  };

  const handleSaveAppointment = (aptData: any) => {
    const res = dbStore.saveAppointment(aptData);
    if (res.success) refreshData();
    return res;
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    dbStore.updateAppointmentStatus(id, status);
    refreshData();
  };

  const handleSaveOPDConsultation = (opdData: any) => {
    dbStore.saveOPDConsultation(opdData);
    refreshData();
  };

  const handleNavigateToOPD = (apt: Appointment) => {
    setActiveConsultAppointment(apt);
    setCurrentTab('opd');
  };

  const handleCreateAdmission = (admData: any) => {
    dbStore.createAdmission(admData);
    refreshData();
  };

  const handleUpdateAdmissionStatus = (id: string, status: AdmissionStatus, summary?: string) => {
    dbStore.updateAdmissionStatus(id, status, summary);
    refreshData();
  };

  const handleSaveRoom = (roomData: any) => {
    dbStore.saveRoom(roomData);
    refreshData();
  };

  const handleSaveBed = (bedData: any) => {
    dbStore.saveBed(bedData);
    refreshData();
  };

  const handleUpdateBedStatus = (bedId: string, status: Bed['status']) => {
    dbStore.updateBedStatus(bedId, status);
    refreshData();
  };

  const handleSaveEmergencyCase = (caseData: any) => {
    dbStore.saveEmergencyCase(caseData);
    refreshData();
  };

  const handleUpdateEmergencyStatus = (id: string, status: EmergencyStatus) => {
    dbStore.updateEmergencyStatus(id, status);
    refreshData();
  };

  const handleSavePrescription = (rxData: any) => {
    dbStore.savePrescription(rxData);
    refreshData();
  };

  const handleSaveMedicine = (medData: any) => {
    dbStore.saveMedicine(medData);
    refreshData();
  };

  const handleAdjustStock = (medicineId: string, type: 'Stock In' | 'Stock Out', qty: number, reason: string) => {
    const res = dbStore.adjustMedicineStock(medicineId, type, qty, reason);
    if (res.success) refreshData();
    return res;
  };

  const handleCreateLabOrder = (orderData: any) => {
    dbStore.createLabOrder(orderData);
    refreshData();
  };

  const handleUpdateLabOrderStatus = (id: string, status: LabOrder['status'], payload?: any) => {
    dbStore.updateLabOrderStatus(id, status, payload);
    refreshData();
  };

  const handleSaveInvoice = (invData: any) => {
    const inv = dbStore.saveInvoice(invData);
    refreshData();
    return inv;
  };

  const handleRecordPayment = (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => {
    const res = dbStore.recordPayment(invoiceId, amount, method, notes);
    if (res.success) refreshData();
    return res;
  };

  const handleSaveStaff = (staffData: any) => {
    dbStore.saveStaff(staffData);
    refreshData();
  };

  const handleDeactivateStaff = (id: string) => {
    dbStore.deactivateStaff(id);
    refreshData();
  };

  const handleRecordAttendance = (attData: any) => {
    dbStore.recordAttendance(attData);
    refreshData();
  };

  const handleMarkNotificationAsRead = (id?: string) => {
    dbStore.markNotificationAsRead(id);
    refreshData();
  };

  const handleSaveSettings = (sData: HospitalSettings) => {
    dbStore.saveSettings(sData);
    refreshData();
  };

  const handleSaveUser = (uData: any) => {
    dbStore.saveUser(uData);
    refreshData();
  };

  // Unique Feature Handlers
  const handleGenerateToken = (patientId: string, doctorId: string) => {
    const tkn = dbStore.generateToken(patientId, doctorId);
    refreshData();
    return tkn;
  };

  const handleUpdateTokenStatus = (id: string, status: CheckInToken['status']) => {
    dbStore.updateTokenStatus(id, status);
    refreshData();
  };

  // Render tab content
  const renderMainContent = () => {
    switch (currentTab) {
      case 'dashboard':
        if (!can('view_dashboard')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <Dashboard
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            onNavigate={setCurrentTab}
            onOpenNewPatient={() => {
              setCurrentTab('patients');
              setOpenNewPatientModal(true);
            }}
            onOpenNewAppointment={() => {
              setCurrentTab('appointments');
              setOpenNewAppointmentModal(true);
            }}
          />
        );

      case 'command_center':
        return (
          <HospitalCommandCenter
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            admissions={admissions}
            emergencyCases={emergencyCases}
            beds={beds}
            invoices={invoices}
            rooms={rooms}
            medicines={medicines}
            labOrders={labOrders}
            tokens={tokens}
            onNavigate={setCurrentTab}
          />
        );

      case 'doctor_workspace':
        return (
          <DoctorWorkspace
            doctors={doctors}
            appointments={appointments}
            patients={patients}
            opdConsultations={opdConsultations}
            prescriptions={prescriptions}
            labOrders={labOrders}
            onNavigateToOPD={handleNavigateToOPD}
            onSaveConsultation={handleSaveOPDConsultation}
            onCreateLabOrder={handleCreateLabOrder}
          />
        );

      case 'nurse_workspace':
        return (
          <NurseWorkspace
            patients={patients}
            admissions={admissions}
            rooms={rooms}
            beds={beds}
            emergencyCases={emergencyCases}
            onUpdateBedStatus={handleUpdateBedStatus}
            onUpdateVitals={(patientId, vitals) => {
              dbStore.updatePatientVitals(patientId, vitals);
              refreshData();
            }}
          />
        );

      case 'queue':
        return (
          <QueueManager
            tokens={tokens}
            patients={patients}
            doctors={doctors}
            onGenerateToken={handleGenerateToken}
            onUpdateTokenStatus={handleUpdateTokenStatus}
          />
        );

      case 'patients':
        if (!can('view_patients')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <PatientManager
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            admissions={admissions}
            emergencyCases={emergencyCases}
            prescriptions={prescriptions}
            onSavePatient={handleSavePatient}
            onDeactivatePatient={handleDeactivatePatient}
            autoOpenNewModal={openNewPatientModal}
            onCloseAutoOpenNewModal={() => setOpenNewPatientModal(false)}
          />
        );

      case 'doctors':
        if (!can('view_doctors')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <DoctorManager
            doctors={doctors}
            departments={departments}
            onSaveDoctor={handleSaveDoctor}
          />
        );

      case 'departments':
        if (!can('view_departments')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <DepartmentManager
            departments={departments}
            doctors={doctors}
            onSaveDepartment={handleSaveDepartment}
          />
        );

      case 'appointments':
        if (!can('view_appointments')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <AppointmentManager
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            departments={departments}
            settings={settings}
            onSaveAppointment={handleSaveAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onNavigateToOPD={handleNavigateToOPD}
            autoOpenNewModal={openNewAppointmentModal}
            onCloseAutoOpenNewModal={() => setOpenNewAppointmentModal(false)}
          />
        );

      case 'opd':
        if (!can('view_opd')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <OPDManager
            opdConsultations={opdConsultations}
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            medicines={medicines}
            labTests={labTests}
            activeConsultAppointment={activeConsultAppointment}
            onClearActiveConsultAppointment={() => setActiveConsultAppointment(null)}
            onSaveOPDConsultation={handleSaveOPDConsultation}
            onSavePrescription={handleSavePrescription}
            onCreateLabOrder={handleCreateLabOrder}
          />
        );

      case 'admissions':
        return (
          <IPDManager
            admissions={admissions}
            patients={patients}
            doctors={doctors}
            departments={departments}
            rooms={rooms}
            beds={beds}
            onCreateAdmission={handleCreateAdmission}
            onUpdateAdmissionStatus={handleUpdateAdmissionStatus}
          />
        );

      case 'rooms_beds':
        return (
          <RoomBedManager
            rooms={rooms}
            beds={beds}
            departments={departments}
            onSaveRoom={handleSaveRoom}
            onSaveBed={handleSaveBed}
            onUpdateBedStatus={handleUpdateBedStatus}
          />
        );

      case 'emergency':
        return (
          <EmergencyManager
            emergencyCases={emergencyCases}
            patients={patients}
            doctors={doctors}
            departments={departments}
            beds={beds}
            onSaveEmergencyCase={handleSaveEmergencyCase}
            onUpdateEmergencyStatus={handleUpdateEmergencyStatus}
          />
        );

      case 'prescriptions':
        return (
          <PrescriptionManager
            prescriptions={prescriptions}
            patients={patients}
            doctors={doctors}
            medicines={medicines}
            onSavePrescription={handleSavePrescription}
          />
        );

      case 'pharmacy':
        return (
          <PharmacyManager
            medicines={medicines}
            stockLogs={stockLogs}
            prescriptions={prescriptions}
            onSaveMedicine={handleSaveMedicine}
            onAdjustStock={handleAdjustStock}
          />
        );

      case 'laboratory':
        return (
          <LaboratoryManager
            labTests={labTests}
            labOrders={labOrders}
            patients={patients}
            doctors={doctors}
            onCreateLabOrder={handleCreateLabOrder}
            onUpdateLabOrderStatus={handleUpdateLabOrderStatus}
          />
        );

      case 'billing':
        return (
          <BillingManager
            invoices={invoices}
            payments={payments}
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            admissions={admissions}
            prescriptions={prescriptions}
            labOrders={labOrders}
            medicines={medicines}
            settings={settings}
            onSaveInvoice={handleSaveInvoice}
            onRecordPayment={handleRecordPayment}
          />
        );

      case 'staff':
        return (
          <StaffManager
            staff={staff}
            attendance={attendance}
            departments={departments}
            onSaveStaff={handleSaveStaff}
            onDeactivateStaff={handleDeactivateStaff}
            onRecordAttendance={handleRecordAttendance}
          />
        );

      case 'reports':
        return (
          <ReportCenter
            patients={patients}
            doctors={doctors}
            departments={departments}
            appointments={appointments}
            admissions={admissions}
            invoices={invoices}
            medicines={medicines}
            labOrders={labOrders}
            attendance={attendance}
          />
        );

      case 'blog':
        return <HealthBlogManager />;

      case 'settings':
        if (!can('manage_users')) return <ErrorPage code="403" onGoHome={() => setCurrentTab('dashboard')} />;
        return (
          <SettingsManager
            settings={settings}
            users={users}
            auditLogs={auditLogs}
            onSaveSettings={handleSaveSettings}
            onSaveUser={handleSaveUser}
          />
        );

      default:
        return <ErrorPage code="404" onGoHome={() => setCurrentTab('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setOpenNewPatientModal(false);
          setOpenNewAppointmentModal(false);
          setCurrentTab(tab);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          notifications={notifications}
          onOpenNotifications={() => setIsNotifModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-modal-in">
          {renderMainContent()}
        </main>
      </div>

      {/* Global Command Search Palette */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        patients={patients}
        doctors={doctors}
        appointments={appointments}
        medicines={medicines}
        invoices={invoices}
        labTests={labTests}
        onSelectResult={(tab) => setCurrentTab(tab)}
      />

      {/* Notification Center */}
      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
