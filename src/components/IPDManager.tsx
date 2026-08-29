import React, { useState } from 'react';
import type { IPDAdmission, Patient, Doctor, Department, Room, Bed, AdmissionStatus } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Bed as BedIcon,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  Clock,
  LogOut
} from 'lucide-react';

interface IPDManagerProps {
  admissions: IPDAdmission[];
  patients: Patient[];
  doctors: Doctor[];
  departments: Department[];
  rooms: Room[];
  beds: Bed[];
  onCreateAdmission: (adm: any) => void;
  onUpdateStatus?: (id: string, status: AdmissionStatus, dischargeSummary?: string) => void;
  onUpdateAdmissionStatus?: (id: string, status: AdmissionStatus, dischargeSummary?: string) => void;
}

export const IPDManager: React.FC<IPDManagerProps> = ({
  admissions,
  patients,
  doctors,
  departments,
  rooms,
  beds,
  onCreateAdmission,
  onUpdateStatus,
  onUpdateAdmissionStatus,
}) => {
  const updateStatusFn = onUpdateAdmissionStatus || onUpdateStatus;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [admissionNotes, setAdmissionNotes] = useState('');

  // Discharge Modal State
  const [dischargeAdmission, setDischargeAdmission] = useState<IPDAdmission | null>(null);
  const [dischargeSummaryInput, setDischargeSummaryInput] = useState('');

  // Filter available beds strictly
  const availableBeds = beds.filter((b) => b.status === 'Available');

  const openNewModal = () => {
    setPatientId(patients[0]?.id || '');
    setDoctorId(doctors[0]?.id || '');
    setDepartmentId(departments[0]?.id || '');
    setSelectedBedId(availableBeds[0]?.id || '');
    setDiagnosis('');
    setAdmissionNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);
    const dept = departments.find((d) => d.id === departmentId);
    const bed = beds.find((b) => b.id === selectedBedId);

    if (!patient || !doctor || !dept || !bed) {
      alert('Please complete all selection fields including an available bed.');
      return;
    }

    onCreateAdmission({
      patientId: patient.id,
      patientName: patient.fullName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      departmentId: dept.id,
      departmentName: dept.name,
      admissionDate: new Date().toISOString().split('T')[0],
      roomId: bed.roomId,
      roomNumber: bed.roomNumber,
      bedId: bed.id,
      bedNumber: bed.bedNumber,
      diagnosis,
      admissionNotes,
    });

    setIsModalOpen(false);
  };

  const handleConfirmDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (dischargeAdmission) {
      updateStatusFn?.(dischargeAdmission.id, 'Discharged', dischargeSummaryInput);
      setDischargeAdmission(null);
    }
  };

  const filteredAdmissions = admissions.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Inpatient Department (IPD) Admissions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage patient ward admissions, bed allocations, clinical treatment tracking, and discharge summaries.
          </p>
        </div>
        <Button variant="teal" onClick={openNewModal} icon={<Plus className="w-4 h-4" />}>
          Admit New Inpatient
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="py-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Admission ID, Patient Name, or Attending Doctor..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-medblue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Admission Statuses</option>
            {['Admitted', 'Under Treatment', 'Ready for Discharge', 'Discharged'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Admissions Data Table */}
      <Card headerBorder={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Admission ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Room & Bed</th>
                <th className="py-3.5 px-4">Attending Doctor</th>
                <th className="py-3.5 px-4">Admission Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Discharge Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No active or historical inpatient admissions found.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-medblue-600">{adm.id}</td>
                    <td className="py-3 px-4 font-semibold text-navy-900">
                      <div>{adm.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{adm.patientId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="teal" size="sm">
                        Room {adm.roomNumber} • Bed {adm.bedNumber}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{adm.doctorName}</div>
                      <div className="text-[10px] text-slate-400">{adm.departmentName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{adm.admissionDate}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          adm.status === 'Discharged'
                            ? 'secondary'
                            : adm.status === 'Ready for Discharge'
                            ? 'warning'
                            : 'teal'
                        }
                        dot
                      >
                        {adm.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {adm.status !== 'Discharged' && (
                        <>
                          {adm.status === 'Admitted' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => updateStatusFn?.(adm.id, 'Under Treatment')}
                            >
                              Start Treatment
                            </Button>
                          )}
                          {adm.status === 'Under Treatment' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatusFn?.(adm.id, 'Ready for Discharge')}
                            >
                              Ready for Discharge
                            </Button>
                          )}
                          <Button
                            variant="teal"
                            size="sm"
                            icon={<LogOut className="w-3.5 h-3.5" />}
                            onClick={() => {
                              setDischargeAdmission(adm);
                              setDischargeSummaryInput(
                                `Patient discharged in stable condition following recovery from ${adm.diagnosis}.`
                              );
                            }}
                          >
                            Discharge & Release Bed
                          </Button>
                        </>
                      )}
                      {adm.status === 'Discharged' && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          Discharged on {adm.dischargeDate}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New IPD Admission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Patient Ward Admission"
        subtitle="Only available unassigned beds are presented to ensure zero bed collisions."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Attending Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Assign Bed (Available Only)
              </label>
              {availableBeds.length === 0 ? (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  No beds currently available. Release or add beds first.
                </div>
              ) : (
                <select
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-medium"
                >
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      Bed {b.bedNumber} — Room {b.roomNumber} ({b.roomType})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <Input label="Primary Diagnosis for Admission" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required placeholder="e.g. Pneumonia evaluation" />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Admission Clinical Notes</label>
            <textarea
              rows={3}
              value={admissionNotes}
              onChange={(e) => setAdmissionNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
              placeholder="Treatment goals, isolation instructions, telemetry setup..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit" disabled={availableBeds.length === 0}>
              Confirm Inpatient Admission
            </Button>
          </div>
        </form>
      </Modal>

      {/* Discharge Summary Modal */}
      {dischargeAdmission && (
        <Modal
          isOpen={!!dischargeAdmission}
          onClose={() => setDischargeAdmission(null)}
          title={`Discharge Patient — ${dischargeAdmission.patientName}`}
          subtitle={`Releasing Bed ${dischargeAdmission.bedNumber} (Room ${dischargeAdmission.roomNumber}) back to Available status.`}
          maxWidth="lg"
        >
          <form onSubmit={handleConfirmDischarge} className="space-y-4">
            <div className="p-3 bg-tealbrand-50 border border-tealbrand-200 rounded-lg text-xs text-tealbrand-900 font-medium">
              Confirming discharge will immediately set the patient status to Discharged and automatically make Bed {dischargeAdmission.bedNumber} available for new admissions.
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Discharge Clinical Summary
              </label>
              <textarea
                rows={4}
                value={dischargeSummaryInput}
                onChange={(e) => setDischargeSummaryInput(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
                placeholder="Summary of inpatient stay, medications on discharge, follow-up instructions..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setDischargeAdmission(null)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Execute Discharge & Release Bed
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
