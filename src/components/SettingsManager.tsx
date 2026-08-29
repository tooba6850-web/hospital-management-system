import React, { useState } from 'react';
import type { HospitalSettings, UserAccount, AuditLogRecord, RoleName } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Settings,
  Users,
  Shield,
  Building,
  Save,
  Plus,
  Lock,
  Search,
  CheckCircle2,
  Bell,
  Palette,
  Server
} from 'lucide-react';

interface SettingsManagerProps {
  settings: HospitalSettings;
  users: UserAccount[];
  auditLogs: AuditLogRecord[];
  onSaveSettings: (s: HospitalSettings) => void;
  onSaveUser: (u: any) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  users,
  auditLogs,
  onSaveSettings,
  onSaveUser,
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'users' | 'roles' | 'notifications' | 'appearance' | 'audit'>('branding');

  // Form State — Hospital Branding & Config
  const [hospitalName, setHospitalName] = useState(settings.hospitalName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [registrationNumber, setRegistrationNumber] = useState(settings.registrationNumber);
  const [currency, setCurrency] = useState(settings.currency);
  const [slotDuration, setSlotDuration] = useState(settings.appointmentSlotDuration);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Form State — User Management
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<RoleName>('Doctor');

  const [auditSearch, setAuditSearch] = useState('');

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      hospitalName,
      address,
      phone,
      email,
      website,
      registrationNumber,
      currency,
      appointmentSlotDuration: Number(slotDuration),
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      name: userName,
      email: userEmail,
      role: userRole,
      status: 'Active',
    });
    setIsUserModalOpen(false);
    setUserName('');
    setUserEmail('');
  };

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.entityId.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const sidebarTabs = [
    { key: 'branding', label: 'Hospital Profile', icon: <Building className="w-4 h-4" /> },
    { key: 'users', label: 'Users & Staff Accounts', icon: <Users className="w-4 h-4" /> },
    { key: 'roles', label: 'Roles & Permissions', icon: <Lock className="w-4 h-4" /> },
    { key: 'notifications', label: 'Notification Triggers', icon: <Bell className="w-4 h-4" /> },
    { key: 'appearance', label: 'Appearance & UI', icon: <Palette className="w-4 h-4" /> },
    { key: 'audit', label: 'Security Audit Logs', icon: <Shield className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 tracking-tight">Enterprise Settings & System Administration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage clinical identity, staff accounts, RBAC permissions, notifications, and security audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2 space-y-1">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-medblue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Main Settings Panel */}
        <div className="lg:col-span-3">
          {activeTab === 'branding' && (
            <Card title="Hospital Profile & Branding" subtitle="Displayed across e-prescriptions, clinical reports, and invoices">
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                {isSavedAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Hospital settings & branding updated successfully.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Hospital Official Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />
                  <Input label="Medical Registration Number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} required />
                  <Input label="Hospital Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  <Input label="Contact Telephone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <Input label="Contact Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Input label="Official Website" value={website} onChange={(e) => setWebsite(e.target.value)} required />
                  <Input label="Currency Symbol" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
                  <Input label="Appointment Slot Duration (Minutes)" type="number" value={slotDuration} onChange={(e) => setSlotDuration(Number(e.target.value))} required />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button variant="teal" type="submit" icon={<Save className="w-4 h-4" />}>
                    Save Settings
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Staff Accounts & Users</h3>
                <Button variant="teal" size="sm" onClick={() => setIsUserModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                  Create User Account
                </Button>
              </div>

              <Card headerBorder={false} className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">User ID</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Assigned Role</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-semibold text-medblue-600">{u.id}</td>
                          <td className="py-3 px-4 font-semibold text-navy-900">{u.name}</td>
                          <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                          <td className="py-3 px-4 font-bold text-tealbrand-700">{u.role}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono">{u.createdAt}</td>
                          <td className="py-3 px-4">
                            <Badge variant={u.status === 'Active' ? 'success' : 'secondary'} dot>
                              {u.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'roles' && (
            <Card title="Role-Based Access Control (RBAC)" subtitle="Pre-configured enterprise clinical role permissions">
              <div className="space-y-3 text-xs">
                {[
                  { role: 'Admin', desc: 'Full administrative access across hospital settings, users, EHR, and finance.' },
                  { role: 'Doctor / Physician', desc: 'Access to Doctor Workspace, e-Prescriptions, OPD Consultations, and Patient EHR.' },
                  { role: 'Nurse', desc: 'Access to Nurse Workspace, Vitals recording, Ward admissions, and Bed management.' },
                  { role: 'Receptionist', desc: 'Access to Patient Check-in Queue, Patient Registration, and Appointment Booking.' },
                  { role: 'Pharmacist', desc: 'Access to Pharmacy inventory stock management and e-Rx dispensing.' },
                  { role: 'Lab Technician', desc: 'Access to Laboratory Diagnostics order processing and test result entry.' },
                  { role: 'Billing Accountant', desc: 'Access to Financial Cashier, Invoicing, and Payment Collection.' },
                ].map((r) => (
                  <div key={r.role} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-navy-900">{r.role}</h4>
                      <p className="text-slate-500 mt-0.5">{r.desc}</p>
                    </div>
                    <Badge variant="teal" size="sm">Active RBAC Policy</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Hospital Notification Triggers" subtitle="Configure automated alert preferences">
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <div>
                    <strong className="text-navy-900 block">Critical Lab Result Alerts</strong>
                    <span className="text-slate-500">Notify attending physician immediately on abnormal panic lab values.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-medblue-600 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <div>
                    <strong className="text-navy-900 block">Pharmacy Low-Stock Warning</strong>
                    <span className="text-slate-500">Alert pharmacist when medicine stock drops below minimum reorder threshold.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-medblue-600 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <div>
                    <strong className="text-navy-900 block">Patient Appointment SMS Reminders</strong>
                    <span className="text-slate-500">Send automatic appointment reminders 24 hours prior to scheduled visit.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-medblue-600 rounded" />
                </label>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card title="Appearance & Branding Themes" subtitle="Tailor visual contrast and UI density">
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-navy-900 mb-2">Color Palette Theme</h4>
                  <div className="flex gap-3">
                    <div className="p-3 border-2 border-medblue-600 rounded-xl bg-slate-50 text-center w-36 font-semibold text-navy-900">
                      Medical Navy & Teal (Default)
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900 mb-2">Interface Density</h4>
                  <p className="text-slate-500">Optimized for high-throughput clinical workflows.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <Card className="py-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search audit trail by User, Action, or Entity ID..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-tealbrand-500"
                  />
                </div>
              </Card>

              <Card headerBorder={false} className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Audit ID</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Entity</th>
                        <th className="py-3 px-4">Metadata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-500">{log.id}</td>
                          <td className="py-3 px-4 font-mono text-slate-400">{log.timestamp}</td>
                          <td className="py-3 px-4 font-semibold text-navy-900">
                            {log.user}
                            <span className="text-[10px] text-slate-400 block font-normal">{log.userRole}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-tealbrand-700">{log.action}</td>
                          <td className="py-3 px-4 font-mono">
                            {log.entity} <span className="text-slate-400">({log.entityId})</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 italic">{log.metadata || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add User Account Modal */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Create User Account">
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <Input label="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          <Input label="Email Address" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Assign Role</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-bold"
            >
              {['Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Accountant'].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Create User Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

