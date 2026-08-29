import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Calendar,
  Stethoscope,
  Bed,
  Siren,
  Pill,
  FlaskConical,
  FileText,
  CreditCard,
  UserCog,
  BarChart3,
  Settings,
  Ticket,
  Activity,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X
} from 'lucide-react';
import { Badge } from './common/Badge';

export type NavItemKey =
  | 'dashboard'
  | 'command_center'
  | 'doctor_workspace'
  | 'nurse_workspace'
  | 'queue'
  | 'patients'
  | 'doctors'
  | 'departments'
  | 'appointments'
  | 'opd'
  | 'emergency'
  | 'admissions'
  | 'pharmacy'
  | 'laboratory'
  | 'prescriptions'
  | 'billing'
  | 'rooms_beds'
  | 'staff'
  | 'reports'
  | 'blog'
  | 'notifications'
  | 'settings';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (key: NavItemKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavGroup {
  category: string;
  items: {
    key: NavItemKey;
    label: string;
    icon: React.ReactNode;
    permission?: Parameters<ReturnType<typeof useAuth>['can']>[0];
    implemented: boolean;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  isCollapsed: externalCollapsed,
  onToggleCollapse: externalToggleCollapse,
}) => {
  const { can, user } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = externalToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const navGroups: NavGroup[] = [
    {
      category: 'CORE',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, permission: 'view_dashboard', implemented: true },
        { key: 'command_center', label: 'Command Center', icon: <Activity className="w-4 h-4" />, implemented: true, badge: 'HQ' },
        { key: 'queue', label: 'Check-in Queue', icon: <Ticket className="w-4 h-4" />, implemented: true, badge: 'Tokens' },
      ],
    },
    {
      category: 'CLINICAL',
      items: [
        { key: 'doctor_workspace', label: 'Doctor Workspace', icon: <Stethoscope className="w-4 h-4" />, implemented: true, badge: 'MD' },
        { key: 'nurse_workspace', label: 'Nurse Workspace', icon: <HeartPulse className="w-4 h-4" />, implemented: true, badge: 'RN' },
        { key: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" />, permission: 'view_patients', implemented: true },
        { key: 'doctors', label: 'Doctors', icon: <UserCheck className="w-4 h-4" />, permission: 'view_doctors', implemented: true },
        { key: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" />, permission: 'view_departments', implemented: true },
        { key: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" />, permission: 'view_appointments', implemented: true },
        { key: 'opd', label: 'OPD Consultations', icon: <Stethoscope className="w-4 h-4" />, permission: 'view_opd', implemented: true },
        { key: 'emergency', label: 'Emergency', icon: <Siren className="w-4 h-4" />, implemented: true, badge: 'ER 24/7' },
        { key: 'admissions', label: 'Inpatient / Ward', icon: <Bed className="w-4 h-4" />, implemented: true },
        { key: 'rooms_beds', label: 'Rooms & Beds', icon: <Bed className="w-4 h-4" />, implemented: true },
        { key: 'prescriptions', label: 'Prescriptions (Rx)', icon: <FileText className="w-4 h-4" />, implemented: true },
      ],
    },
    {
      category: 'PHARMACY & LAB',
      items: [
        { key: 'pharmacy', label: 'Pharmacy & Stock', icon: <Pill className="w-4 h-4" />, implemented: true },
        { key: 'laboratory', label: 'Laboratory Diagnostics', icon: <FlaskConical className="w-4 h-4" />, implemented: true },
      ],
    },
    {
      category: 'FINANCE',
      items: [
        { key: 'billing', label: 'Billing & Cashier', icon: <CreditCard className="w-4 h-4" />, implemented: true },
      ],
    },
    {
      category: 'KNOWLEDGE & BLOG',
      items: [
        { key: 'blog', label: 'Health Blog & Bulletins', icon: <BookOpen className="w-4 h-4" />, implemented: true, badge: 'New' },
      ],
    },
    {
      category: 'ADMINISTRATION',
      items: [
        { key: 'staff', label: 'Staff Roster', icon: <UserCog className="w-4 h-4" />, implemented: true },
        { key: 'reports', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" />, implemented: true },
        { key: 'settings', label: 'Hospital Settings', icon: <Settings className="w-4 h-4" />, implemented: true },
      ],
    },
  ];

  const renderContent = (collapsed: boolean) => (
    <div className={`flex flex-col h-full bg-navy-900 text-slate-300 border-r border-navy-800 transition-all duration-200 select-none ${collapsed ? 'w-18' : 'w-64'}`}>
      {/* Top Header Branding */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-navy-800 bg-navy-900/60 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-medblue-600 via-medblue-500 to-tealbrand-500 flex items-center justify-center shadow-md shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <span className="font-bold text-white tracking-tight text-sm block leading-tight">AURA HEALTH</span>
              <span className="text-[10px] text-tealbrand-400 font-medium tracking-wide block truncate">Hospital Management System</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-medblue-600 to-tealbrand-500 flex items-center justify-center shadow-md">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <button onClick={onCloseMobile} className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => !item.permission || can(item.permission));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.category} className="space-y-1">
              {!collapsed && (
                <div className="px-3 mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {group.category}
                </div>
              )}
              {visibleItems.map((item) => {
                const isActive = currentTab === item.key;

                return (
                  <button
                    key={item.key}
                    title={collapsed ? `${item.label} (${group.category})` : undefined}
                    onClick={() => {
                      onSelectTab(item.key);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center ${collapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'} text-xs font-medium rounded-lg transition-all relative group ${
                      isActive
                        ? 'bg-medblue-600 text-white shadow-md shadow-medblue-600/25 font-semibold'
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <Badge variant="teal" size="sm">
                        {item.badge}
                      </Badge>
                    )}

                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-navy-950 text-white text-xs font-medium rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer & Desktop Collapse Toggle */}
      <div className="p-3 border-t border-navy-800 bg-navy-950/70 text-xs shrink-0 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.role || 'Staff'}</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors mx-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {renderContent(isCollapsed)}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative flex-1 max-w-xs w-full bg-navy-900 z-10">
            {renderContent(false)}
          </div>
        </div>
      )}
    </>
  );
};

