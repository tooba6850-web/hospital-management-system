import React, { useState } from 'react';
import type { Doctor, Patient, Appointment, OPDConsultation, LabOrder, Medicine, Prescription } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import {
  Stethoscope,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  FlaskConical,
  Plus,
  Play
} from 'lucide-react';

interface DoctorWorkspaceProps {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  consultations?: OPDConsultation[];
  opdConsultations?: OPDConsultation[];
  prescriptions?: Prescription[];
  labOrders: LabOrder[];
  medicines?: Medicine[];
  onNavigateToOPD?: (apt: Appointment) => void;
  onSaveConsultation: (consultData: any) => void;
  onCreateLabOrder: (labData: any) => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({
  doctors,
  patients,
  appointments,
  consultations,
  opdConsultations,
  labOrders,
  medicines = [],
  onSaveConsultation,
  onCreateLabOrder,
}) => {
  const _activeConsultations = consultations || opdConsultations || [];
  const currentDoctor = doctors[0] || { id: 'DOC-101', name: 'Dr. Robert Chen', specialization: 'Cardiology' };

  const doctorAppointments = appointments.filter((a) => a.doctorId === currentDoctor.id);
  const waitingAppointments = doctorAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'Scheduled');
  const completedAppointments = doctorAppointments.filter((a) => a.status === 'Completed');

  const [selectedApt, setSelectedApt] = useState<Appointment | null>(waitingAppointments[0] || null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // Workflow Form State
  const [vitalsBp, setVitalsBp] = useState('120/80 mmHg');
  const [vitalsHr, setVitalsHr] = useState('72 bpm');
  const [vitalsTemp, setVitalsTemp] = useState('98.6 °F');
  const [symptoms, setSymptoms] = useState('Chest tightness, mild fatigue');
  const [diagnosis, setDiagnosis] = useState('Stage 1 Primary Essential Hypertension');
  const [rxMedicine, setRxMedicine] = useState(medicines[0]?.name || 'Amlodipine Besylate 5mg');
  const [rxDosage, setRxDosage] = useState('1 Tablet Daily (Morning)');
  const [followUpDate, setFollowUpDate] = useState('2026-08-25');
  const [notes, setNotes] = useState('Patient advised low-sodium diet and exercise.');

  const handleStartConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;

    onSaveConsultation({
      appointmentId: selectedApt.id,
      patientId: selectedApt.patientId,
      patientName: selectedApt.patientName,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      vitals: {
        bloodPressure: vitalsBp,
        pulseRate: vitalsHr,
        temperature: vitalsTemp,
      },
      symptoms,
      diagnosis,
      prescriptionItems: [
        {
          medicineName: rxMedicine,
          dosage: rxDosage,
          durationDays: 14,
          instructions: 'Take after meals',
        },
      ],
      followUpDate,
      clinicalNotes: notes,
    });

    setIsConsultModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Physician Clinical Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated workspace for {currentDoctor.name} ({currentDoctor.specialization}). Manage OPD consultations, symptoms, vitals, Rx prescriptions, and lab orders.
          </p>
        </div>
        <Badge variant="teal" size="md">
          {waitingAppointments.length} Waiting Patients Today
        </Badge>
      </div>

      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Today</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-0.5">{doctorAppointments.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-medblue-50 text-medblue-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/60 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">In Queue / Waiting</p>
              <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{waitingAppointments.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Completed Today</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-0.5">{completedAppointments.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-purple-50/60 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Lab Reports Verified</p>
              <h3 className="text-2xl font-bold text-purple-900 mt-0.5">
                {labOrders.filter((l) => l.doctorId === currentDoctor.id && l.status === 'Verified').length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Waiting Queue + Action Consultation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Queue List (1 Col) */}
        <Card title="Today's Patient Consultation Queue" subtitle="Click patient to initiate OPD consultation">
          <div className="space-y-3">
            {waitingAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No waiting patients in queue.</p>
            ) : (
              waitingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => setSelectedApt(apt)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedApt?.id === apt.id
                      ? 'bg-tealbrand-50/60 border-tealbrand-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-900">{apt.patientName}</span>
                    <span className="font-mono text-slate-400">{apt.time}</span>
                  </div>
                  <p className="text-slate-500 mt-1">Type: {apt.type} • ID: {apt.patientId}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Selected Patient Workflow Action Card (2 Cols) */}
        <div className="lg:col-span-2">
          {selectedApt ? (
            <Card title={`Active Patient — ${selectedApt.patientName}`} subtitle={`Appointment ID: ${selectedApt.id} • Scheduled: ${selectedApt.time}`}>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400 block">Patient ID</span><strong>{selectedApt.patientId}</strong></div>
                  <div><span className="text-slate-400 block">Chief Complaint</span><strong>{selectedApt.reason || 'General Routine Consultation'}</strong></div>
                  <div><span className="text-slate-400 block">Appointment Type</span><Badge variant="teal" size="sm">{selectedApt.type}</Badge></div>
                </div>

                <div className="pt-2">
                  <Button variant="teal" icon={<Play className="w-4 h-4" />} onClick={() => setIsConsultModalOpen(true)}>
                    Initiate Clinical Consultation Workflow
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12 text-slate-400">
              <Stethoscope className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Select a waiting patient from the queue list to begin consultation.
            </Card>
          )}
        </div>
      </div>

      {/* Structured Clinical Consultation Modal */}
      {selectedApt && (
        <Modal isOpen={isConsultModalOpen} onClose={() => setIsConsultModalOpen(false)} title={`OPD Clinical Assessment — ${selectedApt.patientName}`} maxWidth="4xl">
          <form onSubmit={handleStartConsultationSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Input label="Blood Pressure" value={vitalsBp} onChange={(e) => setVitalsBp(e.target.value)} required placeholder="120/80 mmHg" />
              <Input label="Pulse Rate" value={vitalsHr} onChange={(e) => setVitalsHr(e.target.value)} required placeholder="72 bpm" />
              <Input label="Temperature" value={vitalsTemp} onChange={(e) => setVitalsTemp(e.target.value)} required placeholder="98.6 °F" />
            </div>

            <Input label="Presented Symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required placeholder="e.g. Fever, persistent cough" />
            <Input label="Clinical Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required placeholder="e.g. Acute Bronchitis" />

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Prescribe Pharmaceutical Drug (Rx)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Drug</label>
                  <select
                    value={rxMedicine}
                    onChange={(e) => setRxMedicine(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
                  >
                    {medicines.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.stockQuantity} in stock)
                      </option>
                    ))}
                  </select>
                </div>
                <Input label="Dosage Schedule" value={rxDosage} onChange={(e) => setRxDosage(e.target.value)} placeholder="e.g. 1 Tab BID x 7 days" />
              </div>
            </div>

            <Input label="Recommended Follow-Up Date" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            <Input label="Physician Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Rest, increase fluid intake." />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsConsultModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Save & Complete Consultation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
