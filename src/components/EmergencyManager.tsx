import React, { useState } from 'react';
import type { EmergencyCase, Patient, Doctor, Department, EmergencyPriority, EmergencyStatus, Bed } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { Siren, Plus, Search, AlertCircle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyManagerProps {
  emergencyCases: EmergencyCase[];
  patients: Patient[];
  doctors: Doctor[];
  departments: Department[];
  beds?: Bed[];
  onSaveEmergencyCase: (caseData: any) => void;
  onUpdateStatus?: (id: string, status: EmergencyStatus) => void;
  onUpdateEmergencyStatus?: (id: string, status: EmergencyStatus) => void;
}

export const EmergencyManager: React.FC<EmergencyManagerProps> = ({
  emergencyCases,
  patients,
  doctors,
  departments,
  beds: _beds,
  onSaveEmergencyCase,
  onUpdateStatus,
  onUpdateEmergencyStatus,
}) => {
  const updateStatusFn = onUpdateEmergencyStatus || onUpdateStatus;
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [arrivalTime, setArrivalTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [priority, setPriority] = useState<EmergencyPriority>('High');
  const [condition, setCondition] = useState('');
  const [assignedDoctorId, setAssignedDoctorId] = useState(doctors[0]?.id || '');
  const [notes, setNotes] = useState('');

  const openNewModal = () => {
    setPatientName('');
    setSelectedPatientId('');
    setArrivalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setPriority('High');
    setCondition('');
    setAssignedDoctorId(doctors[0]?.id || '');
    setNotes('');
    setIsModalOpen(true);
  };

  const handlePatientSelect = (pId: string) => {
    setSelectedPatientId(pId);
    if (pId) {
      const p = patients.find((pat) => pat.id === pId);
      if (p) setPatientName(p.fullName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === assignedDoctorId);
    const emergDept = departments.find((d) => d.code === 'EMRG') || departments[0];

    onSaveEmergencyCase({
      patientId: selectedPatientId || undefined,
      patientName: patientName || 'Unregistered Trauma Patient',
      arrivalTime,
      priority,
      condition,
      assignedDoctorId: doc?.id,
      assignedDoctorName: doc?.name,
      departmentId: emergDept.id,
      departmentName: emergDept.name,
      status: 'Waiting',
      notes,
    });

    setIsModalOpen(false);
  };

  const filteredCases = emergencyCases.filter((c) => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-0.5 rounded-full border border-rose-500/30 font-bold uppercase tracking-wider flex items-center gap-1">
              <Siren className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> 24/7 Trauma Unit
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Emergency Department (ER Triage)</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Triage arriving acute trauma cases, assign priority levels, and initiate rapid clinical resuscitation.
          </p>
        </div>
        <Button variant="danger" size="md" onClick={openNewModal} icon={<Plus className="w-4 h-4" />}>
          Register Emergency Case
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
              placeholder="Search by Emergency ID, Patient Name, or Acute Condition..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Priorities</option>
            {['Critical', 'High', 'Medium', 'Low'].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* ER Triage Board / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((ec) => (
          <Card
            key={ec.id}
            className={`border-l-4 transition-all ${
              ec.priority === 'Critical'
                ? 'border-l-rose-600 bg-rose-50/20'
                : ec.priority === 'High'
                ? 'border-l-amber-500 bg-amber-50/20'
                : 'border-l-medblue-500 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-rose-700">{ec.id}</span>
                  <Badge
                    variant={
                      ec.priority === 'Critical'
                        ? 'danger'
                        : ec.priority === 'High'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    {ec.priority} Priority
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-navy-900 mt-1">{ec.patientName}</h3>
              </div>
              <Badge variant={ec.status === 'Under Treatment' ? 'teal' : 'secondary'} dot>
                {ec.status}
              </Badge>
            </div>

            <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p className="font-semibold text-slate-800">
                <span className="text-slate-400">Condition:</span> {ec.condition}
              </p>
              <div className="flex items-center justify-between text-slate-500">
                <span>Arrival: <strong className="text-slate-700">{ec.arrivalTime}</strong></span>
                <span>Doctor: <strong className="text-slate-700">{ec.assignedDoctorName || 'Unassigned'}</strong></span>
              </div>
              {ec.notes && <p className="text-[11px] text-slate-500 italic mt-1">{ec.notes}</p>}
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              {ec.status === 'Waiting' && (
                <Button variant="teal" size="sm" onClick={() => updateStatusFn?.(ec.id, 'Under Treatment')}>
                  Start Resuscitation
                </Button>
              )}
              {ec.status === 'Under Treatment' && (
                <>
                  <Button variant="outline" size="sm" onClick={() => updateStatusFn?.(ec.id, 'Transferred')}>
                    Transfer to IPD Ward
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => updateStatusFn?.(ec.id, 'Discharged')}>
                    Discharge ER
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* New Emergency Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Emergency Triage Case" maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Link Existing Patient (Optional)</label>
            <select
              value={selectedPatientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              <option value="">-- Unregistered / Unknown Trauma Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <Input label="Patient Name / Trauma Tag" value={patientName} onChange={(e) => setPatientName(e.target.value)} required placeholder="e.g. Johnathan Doe (Trauma Tag #12)" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Priority Triage Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-bold"
              >
                <option value="Critical">Critical (Immediate Code Red)</option>
                <option value="High">High (Urgent Assessment)</option>
                <option value="Medium">Medium (Semi-Urgent)</option>
                <option value="Low">Low (Non-Urgent)</option>
              </select>
            </div>

            <Input label="Arrival Time" type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} required />
          </div>

          <Input label="Acute Condition / Symptoms" value={condition} onChange={(e) => setCondition(e.target.value)} required placeholder="e.g. Severe laceration, chest injury..." />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Assigned ER Physician</label>
            <select
              value={assignedDoctorId}
              onChange={(e) => setAssignedDoctorId(e.target.value)}
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Triage Clinical Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Vitals upon arrival, direct pressure applied, paramedic notes..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Save Emergency Case
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
