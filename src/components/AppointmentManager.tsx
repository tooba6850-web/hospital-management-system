import React, { useState, useEffect } from 'react';
import type { Appointment, Patient, Doctor, Department, AppointmentStatus, AppointmentType, HospitalSettings } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Plus,
  Search,
  AlertCircle,
  Stethoscope
} from 'lucide-react';

interface AppointmentManagerProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  departments: Department[];
  settings?: HospitalSettings;
  onSaveAppointment: (apt: any) => { success: boolean; error?: string };
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onNavigateToOPD?: (apt: Appointment) => void;
  isCreateOpenInitially?: boolean;
  autoOpenNewModal?: boolean;
  onCloseAutoOpenNewModal?: () => void;
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({
  appointments,
  patients,
  doctors,
  departments: _departments,
  settings: _settings,
  onSaveAppointment,
  onUpdateStatus,
  onNavigateToOPD,
  isCreateOpenInitially = false,
  autoOpenNewModal,
  onCloseAutoOpenNewModal: _onCloseAutoOpenNewModal,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');

  const [isModalOpen, setIsModalOpen] = useState(isCreateOpenInitially || !!autoOpenNewModal);

  useEffect(() => {
    if (autoOpenNewModal) {
      setIsModalOpen(true);
    }
  }, [autoOpenNewModal]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [doctorFilter, setDoctorFilter] = useState<string>('All');

  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<AppointmentType>('Consultation');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const openNewModal = () => {
    setErrorMessage('');
    setPatientId(patients[0]?.id || '');
    setDoctorId(doctors[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00');
    setType('Consultation');
    setReason('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);

    if (!patient || !doctor) {
      setErrorMessage('Please select a valid patient and doctor.');
      return;
    }

    const res = onSaveAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      departmentId: doctor.departmentId,
      departmentName: doctor.departmentName,
      date,
      time,
      type,
      reason,
      notes,
      status: 'Scheduled',
    });

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setErrorMessage(res.error || 'Failed to book appointment.');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesDoctor = doctorFilter === 'All' || a.doctorId === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Appointments & Scheduling</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book consultations, track patient check-ins, and manage doctor calendars.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button variant="teal" onClick={openNewModal} icon={<Plus className="w-4 h-4" />}>
            Book Appointment
          </Button>
        </div>
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
              placeholder="Search by Patient, Doctor, or Appointment ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-medblue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            {['Scheduled', 'Confirmed', 'Checked In', 'Completed', 'Cancelled', 'No Show'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* LIST VIEW */}
      {viewMode === 'list' ? (
        <Card headerBorder={false} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Appointment Info</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Assigned Doctor</th>
                  <th className="py-3.5 px-4">Date & Slot</th>
                  <th className="py-3.5 px-4">Type & Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No appointments matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-medblue-600">
                        {apt.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-navy-900">{apt.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{apt.patientPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{apt.doctorName}</p>
                        <p className="text-[10px] text-slate-400">{apt.departmentName}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        <div>{apt.date}</div>
                        <div className="text-[10px] text-medblue-600 font-semibold">{apt.time}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" size="sm">{apt.type}</Badge>
                        <p className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">{apt.reason}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            apt.status === 'Checked In'
                              ? 'teal'
                              : apt.status === 'Completed'
                              ? 'success'
                              : apt.status === 'Confirmed'
                              ? 'info'
                              : apt.status === 'Cancelled'
                              ? 'danger'
                              : 'warning'
                          }
                          dot
                        >
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {apt.status === 'Scheduled' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onUpdateStatus(apt.id, 'Confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <Button
                            variant="teal"
                            size="sm"
                            onClick={() => onUpdateStatus(apt.id, 'Checked In')}
                          >
                            Check In
                          </Button>
                        )}
                        {apt.status === 'Checked In' && onNavigateToOPD && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Stethoscope className="w-3.5 h-3.5" />}
                            onClick={() => onNavigateToOPD(apt)}
                          >
                            Consult
                          </Button>
                        )}
                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 text-[10px] font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* CALENDAR VIEW */
        <Card title="Appointment Schedule Grid" subtitle="Visual day & week timeline">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarView('day')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  calendarView === 'day' ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  calendarView === 'week' ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView('month')}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  calendarView === 'month' ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Month
              </button>
            </div>
            <span className="text-xs font-bold text-slate-700">August 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 py-2 border-b border-slate-200">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>
          <div className="grid grid-cols-7 gap-2 min-h-[300px] pt-2">
            {[...Array(28)].map((_, i) => {
              const dayNum = i + 1;
              const dayStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayApts = filteredAppointments.filter((a) => a.date === dayStr);

              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between ${
                    dayApts.length > 0 ? 'bg-medblue-50/30 border-medblue-200' : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400">{dayNum}</span>
                  <div className="space-y-1 my-1">
                    {dayApts.map((a) => (
                      <div
                        key={a.id}
                        className="p-1 rounded bg-white border border-slate-200 shadow-2xs text-[9px] truncate font-medium text-navy-900"
                      >
                        {a.time} - {a.patientName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Consultation Appointment"
        subtitle="Automatic backend conflict check prevents double booking doctor slots."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id}) — {p.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} ({d.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label="Time Slot" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Appointment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <Input label="Reason for Visit" value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="e.g. Chest discomfort, headache" />
          <Input label="Additional Notes (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Patient requested morning slot" />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Confirm & Book Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
