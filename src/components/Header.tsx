import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  LogOut, 
  Menu,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Command
} from 'lucide-react';
import type { RoleName, NotificationItem } from '../types';
import type { NavItemKey } from './Sidebar';

interface HeaderProps {
  currentTab: NavItemKey;
  onOpenMobileMenu?: () => void;
  onOpenGlobalSearch: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenGlobalSearch,
  notifications,
  onOpenNotifications,
}) => {
  const { user, currentRole, switchRole, logout } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: { role: RoleName; label: string }[] = [
    { role: 'Super Admin', label: 'Super Administrator' },
    { role: 'Hospital Admin', label: 'Hospital Administrator' },
    { role: 'Doctor', label: 'Doctor / Physician' },
    { role: 'Nurse', label: 'Nurse' },
    { role: 'Receptionist', label: 'Receptionist' },
    { role: 'Pharmacist', label: 'Pharmacist' },
    { role: 'Lab Technician', label: 'Lab Technician' },
    { role: 'Accountant', label: 'Billing Accountant' },
  ];

  const getBreadcrumbTitle = (tab: NavItemKey) => {
    const titles: Record<NavItemKey, { title: string; category: string }> = {
      dashboard: { title: 'Dashboard Overview', category: 'Core' },
      command_center: { title: 'Hospital Command Center', category: 'Core' },
      doctor_workspace: { title: 'Doctor Workspace', category: 'Clinical' },
      nurse_workspace: { title: 'Nurse Workspace', category: 'Clinical' },
      queue: { title: 'Patient Check-in Queue', category: 'Core' },
      patients: { title: 'Patient Directory & EHR', category: 'Clinical' },
      doctors: { title: 'Physicians & Specialists', category: 'Clinical' },
      departments: { title: 'Hospital Departments', category: 'Clinical' },
      appointments: { title: 'Appointments Calendar', category: 'Clinical' },
      opd: { title: 'OPD Consultations', category: 'Clinical' },
      emergency: { title: 'Emergency Room (ER 24/7)', category: 'Clinical' },
      admissions: { title: 'Inpatient / Ward Admissions', category: 'Clinical' },
      rooms_beds: { title: 'Rooms & Bed Occupancy', category: 'Clinical' },
      prescriptions: { title: 'Prescriptions & e-Rx', category: 'Clinical' },
      pharmacy: { title: 'Pharmacy & Stock Inventory', category: 'Pharmacy & Lab' },
      laboratory: { title: 'Laboratory Diagnostics', category: 'Pharmacy & Lab' },
      billing: { title: 'Billing & Cashier Management', category: 'Finance' },
      staff: { title: 'Staff Roster & Attendance', category: 'Administration' },
      reports: { title: 'Analytics & Executive Reports', category: 'Administration' },
      blog: { title: 'Health Blog & Clinical Bulletins', category: 'Knowledge & Blog' },
      notifications: { title: 'System Notifications', category: 'Core' },
      settings: { title: 'Hospital Configuration & Settings', category: 'Administration' },
    };
    return titles[tab] || { title: 'Dashboard', category: 'Hospital' };
  };

  const breadcrumb = getBreadcrumbTitle(currentTab);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left section: Mobile menu toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">{breadcrumb.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-navy-900">{breadcrumb.title}</span>
        </div>
      </div>

      {/* Center: Global Command Search Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 rounded-xl text-xs text-slate-500 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-medblue-600 transition-colors" />
            <span>Search patients, doctors, rx, billing...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-300 rounded-md shadow-2xs">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right section: Role switcher + Notifications + User Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">Role:</span>
            <strong className="text-navy-900">{currentRole}</strong>
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-modal-in">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Role Context
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 ${
                    currentRole === r.role ? 'text-tealbrand-700 font-bold bg-tealbrand-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{r.label}</span>
                  {currentRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-tealbrand-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Button with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-navy-900 rounded-xl hover:bg-slate-100 transition-colors"
          title="Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity pl-1"
          >
            <div className="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-medblue-500/30">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-modal-in">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-navy-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-medblue-50 text-medblue-700 font-semibold text-[10px] rounded">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert(`Profile settings for ${user?.name}`);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                User Profile
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

