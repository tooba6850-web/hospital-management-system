import type { RoleName } from '../types';

export type Permission = 
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_patients'
  | 'view_patients'
  | 'manage_doctors'
  | 'view_doctors'
  | 'manage_departments'
  | 'view_departments'
  | 'manage_appointments'
  | 'view_appointments'
  | 'manage_opd'
  | 'view_opd'
  | 'manage_billing'
  | 'manage_pharmacy'
  | 'manage_lab'
  | 'view_reports'
  | 'manage_settings';

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  'Super Admin': [
    'view_dashboard', 'manage_users', 'manage_patients', 'view_patients', 
    'manage_doctors', 'view_doctors', 'manage_departments', 'view_departments', 
    'manage_appointments', 'view_appointments', 'manage_opd', 'view_opd', 
    'manage_billing', 'manage_pharmacy', 'manage_lab', 'view_reports', 'manage_settings'
  ],
  'Hospital Admin': [
    'view_dashboard', 'manage_patients', 'view_patients', 'manage_doctors', 
    'view_doctors', 'manage_departments', 'view_departments', 'manage_appointments', 
    'view_appointments', 'manage_opd', 'view_opd', 'manage_billing', 'manage_pharmacy', 
    'manage_lab', 'view_reports', 'manage_settings'
  ],
  'Doctor': [
    'view_dashboard', 'view_patients', 'manage_patients', 'view_doctors', 
    'view_departments', 'view_appointments', 'manage_appointments', 'manage_opd', 
    'view_opd', 'view_reports'
  ],
  'Nurse': [
    'view_dashboard', 'view_patients', 'manage_patients', 'view_doctors', 
    'view_departments', 'view_appointments', 'manage_appointments', 'view_opd'
  ],
  'Receptionist': [
    'view_dashboard', 'manage_patients', 'view_patients', 'view_doctors', 
    'view_departments', 'manage_appointments', 'view_appointments', 'view_opd'
  ],
  'Pharmacist': [
    'view_dashboard', 'view_patients', 'manage_pharmacy', 'view_opd'
  ],
  'Lab Technician': [
    'view_dashboard', 'view_patients', 'manage_lab', 'view_opd'
  ],
  'Accountant': [
    'view_dashboard', 'manage_billing', 'view_reports'
  ]
};

export const hasPermission = (role: RoleName, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};
