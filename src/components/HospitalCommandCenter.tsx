import React, { useState, useEffect } from 'react';
import type { Patient, Doctor, Appointment, Medicine, Invoice, LabOrder, CheckInToken, IPDAdmission, Room, Bed, EmergencyCase } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import {
  Building2,
  Users,
  UserCheck,
  Calendar,
  Bed as BedIcon,
  DollarSign,
  Pill,
  FlaskConical,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface HospitalCommandCenterProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  admissions: IPDAdmission[];
  emergencyCases?: EmergencyCase[];
  rooms: Room[];
  beds: Bed[];
  invoices: Invoice[];
  medicines: Medicine[];
  labOrders: LabOrder[];
  tokens: CheckInToken[];
  onNavigate: (tab: any) => void;
}

export const HospitalCommandCenter: React.FC<HospitalCommandCenterProps> = ({
  patients,
  doctors,
  appointments,
  admissions,
  rooms,
  beds,
  invoices,
  medicines,
  labOrders,
  tokens,
  onNavigate,
}) => {
  const activeAdmissions = admissions.filter((a) => a.status === 'Admitted').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const pendingBalance = invoices.reduce((sum, i) => sum + i.balanceAmount, 0);

  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  const pendingLabCount = labOrders.filter((l) => l.status === 'Requested' || l.status === 'Processing').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Hospital Executive Command Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hospital-wide operational metrics, bed occupancy, clinical volume, financial collection, and system alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md">
            Node-01 Connected • Live System Metrics
          </Badge>
        </div>
      </div>

      {/* Grid Row 1: Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total EHR Patients</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-0.5">{patients.length}</h3>
              <p className="text-[10px] text-tealbrand-700 font-semibold mt-1">Active registrations</p>
            </div>
            <div className="p-2.5 rounded-xl bg-medblue-50 text-medblue-700">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Total Collections</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-0.5">${totalRevenue.toFixed(2)}</h3>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">${pendingBalance.toFixed(2)} Pending</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50/60 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Bed Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-purple-900 mt-0.5">
                {Math.round((occupiedBeds / Math.max(1, beds.length)) * 100)}%
              </h3>
              <p className="text-[10px] text-purple-700 font-semibold mt-1">{availableBeds} Beds Available</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <BedIcon className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-amber-50/60 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Critical Inventory Alerts</p>
              <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{lowStockCount}</h3>
              <p className="text-[10px] text-amber-700 font-semibold mt-1">Low/Out of stock items</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Grid Row 2: Real-time Operational Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Appointments & Queue (2 Cols) */}
        <div className="lg:col-span-2">
          <Card title="Live Patient Encounter Stream" subtitle="Appointments, Reception Check-ins & OPD Consultations">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Physician</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {appointments.slice(0, 5).map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-navy-900">{apt.patientName}</td>
                      <td className="py-3 px-4 text-slate-700">{apt.doctorName}</td>
                      <td className="py-3 px-4 text-tealbrand-700 font-medium">{apt.departmentName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{apt.time}</td>
                      <td className="py-3 px-4">
                        <Badge variant={apt.status === 'Completed' ? 'success' : 'warning'} dot>
                          {apt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Activity Stream (1 Col) */}
        <div>
          <Card title="Live Hospital Activity Stream" subtitle="Real-time audit events">
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-900">OPD Consultation Completed</p>
                  <p className="text-[10px] text-slate-500">Dr. Robert Chen • Eleanor Vance</p>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">10m ago</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-900">Invoice INV-2026-001 Paid</p>
                  <p className="text-[10px] text-slate-500">David Sterling • $252.00</p>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">30m ago</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy-900">Lab Order LOR-2026-001 Verified</p>
                  <p className="text-[10px] text-slate-500">Marcus Vance • Lipid Profile</p>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">1h ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
