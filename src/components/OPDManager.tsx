import React, { useState } from 'react';
import type { OPDConsultation, Patient, Doctor, Appointment, Medicine, LabTest } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Stethoscope,
  Plus,
  Trash2,
  FileText,
  Activity,
  CheckCircle2,
  UserCheck,
  Calendar,
  Pill,
  FlaskConical,
  DollarSign
} from 'lucide-react';

interface OPDManagerProps {
  consultations?: OPDConsultation[];
  opdConsultations?: OPDConsultation[];
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicines?: Medicine[];
  labTests?: LabTest[];
  activeAppointmentForConsult?: Appointment | null;
  activeConsultAppointment?: Appointment | null;
  onClearActiveConsultAppointment?: () => void;
  onSaveConsultation?: (opd: any) => void;
  onSaveOPDConsultation?: (opd: any) => void;
  onSavePrescription?: (rx: any) => void;
  onCreateLabOrder?: (lab: any) => void;
}

export const OPDManager: React.FC<OPDManagerProps> = ({
  consultations,
  opdConsultations,
  patients,
  doctors,
  appointments,
  activeAppointmentForConsult,
  activeConsultAppointment,
  onSaveConsultation,
  onSaveOPDConsultation,
}) => {
  const activeConsults = consultations || opdConsultations || [];
  const activeApt = activeConsultAppointment || activeAppointmentForConsult;
  const saveConsultFn = onSaveOPDConsultation || onSaveConsultation || (() => {});

  const [isModalOpen, setIsModalOpen] = useState(!!activeApt);
  const [viewConsultation, setViewConsultation] = useState<OPDConsultation | null>(null);

  // Form state for consultation
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(activeApt?.id || '');
  const [patientId, setPatientId] = useState(activeApt?.patientId || patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(activeApt?.doctorId || doctors[0]?.id || '');
  
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('72 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [weight, setWeight] = useState('70 kg');
  const [height, setHeight] = useState('170 cm');
  const [spo2, setSpo2] = useState('98%');

  const [symptomsInput, setSymptomsInput] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [labTestsInput, setLabTestsInput] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [billingAmount, setBillingAmount] = useState(150);

  // Rx Items state
  const [prescriptions, setPrescriptions] = useState<
    { medicineName: string; dosage: string; frequency: string; duration: string; instructions: string }[]
  >([
    { medicineName: 'Paracetamol 500mg', dosage: '1 Tablet', frequency: 'Three times daily', duration: '5 Days', instructions: 'After meals' }
  ]);

  const addPrescriptionItem = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescriptionItem = (index: number, field: string, value: string) => {
    const updated = [...prescriptions];
    (updated[index] as any)[field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);

    saveConsultFn({
      appointmentId: selectedAppointmentId || undefined,
      patientId,
      patientName: patient ? patient.fullName : 'Unknown Patient',
      doctorId,
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      date: new Date().toISOString().split('T')[0],
      vitals: {
        bloodPressure: bp,
        pulseRate: pulse,
        temperature: temp,
        weight,
        height,
        spo2
      },
      symptoms: symptomsInput.split(',').map((s) => s.trim()).filter(Boolean),
      diagnosis,
      clinicalNotes,
      treatmentPlan,
      prescriptionItems: prescriptions.filter((p) => p.medicineName.trim()),
      labTestsRequested: labTestsInput.split(',').map((l) => l.trim()).filter(Boolean),
      followUpDate: followUpDate || undefined,
      billingAmount: Number(billingAmount),
      billingStatus: 'Paid',
      status: 'Completed',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Outpatient Department (OPD) Consultations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full clinical consultation workflow: Check-in → Vitals → Diagnosis → Rx & Lab Orders.
          </p>
        </div>
        <Button
          variant="teal"
          onClick={() => {
            setSelectedAppointmentId('');
            setPatientId(patients[0]?.id || '');
            setDoctorId(doctors[0]?.id || '');
            setSymptomsInput('Headache, Fatigue');
            setDiagnosis('Tension Type Headache');
            setClinicalNotes('Patient presented with mild temporal pressure.');
            setTreatmentPlan('Rest, hydration, and prescribed analgesics.');
            setLabTestsInput('Complete Blood Count (CBC)');
            setIsModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          New OPD Encounter
        </Button>
      </div>

      {/* OPD Records List */}
      <Card headerBorder={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Encounter ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Attending Doctor</th>
                <th className="py-3.5 px-4">Primary Diagnosis</th>
                <th className="py-3.5 px-4">Prescribed Medicines</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {activeConsults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No consultation encounters completed yet.
                  </td>
                </tr>
              ) : (
                activeConsults.map((opd) => (
                  <tr key={opd.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-tealbrand-700">
                      {opd.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-900">{opd.patientName}</td>
                    <td className="py-3 px-4 text-slate-700">{opd.doctorName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="teal" size="sm">{opd.diagnosis}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {opd.prescriptionItems.length} Medication(s)
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{opd.date}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewConsultation(opd)}
                      >
                        View Record
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New OPD Encounter Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Doctor OPD Clinical Encounter"
        subtitle="Record vitals, diagnosis, prescriptions, and lab test orders."
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Doctor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 1: Vital Signs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-medblue-600" /> Patient Vitals Assessment
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <Input label="BP" value={bp} onChange={(e) => setBp(e.target.value)} />
              <Input label="Pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} />
              <Input label="Temp" value={temp} onChange={(e) => setTemp(e.target.value)} />
              <Input label="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <Input label="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
              <Input label="SpO2" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
            </div>
          </div>

          {/* Section 2: Clinical Findings & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Reported Symptoms (Comma separated)"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="e.g. Chest tightness, Shortness of breath"
            />
            <Input
              label="Clinical Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              placeholder="e.g. Essential Hypertension"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Clinical Examination Notes</label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
                placeholder="Physical examination observations..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Treatment Plan & Advice</label>
              <textarea
                rows={3}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
                placeholder="Dietary changes, exercise, follow-up advice..."
              />
            </div>
          </div>

          {/* Section 3: Prescription Builder */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-tealbrand-600" /> Prescribed Medications (Rx)
              </h4>
              <Button type="button" variant="outline" size="sm" onClick={addPrescriptionItem} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Drug
              </Button>
            </div>

            {prescriptions.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 items-end">
                <Input label="Medicine Name" value={item.medicineName} onChange={(e) => updatePrescriptionItem(idx, 'medicineName', e.target.value)} placeholder="e.g. Amlodipine 5mg" />
                <Input label="Dosage" value={item.dosage} onChange={(e) => updatePrescriptionItem(idx, 'dosage', e.target.value)} placeholder="1 Tablet" />
                <Input label="Frequency" value={item.frequency} onChange={(e) => updatePrescriptionItem(idx, 'frequency', e.target.value)} placeholder="Once Daily" />
                <Input label="Duration" value={item.duration} onChange={(e) => updatePrescriptionItem(idx, 'duration', e.target.value)} placeholder="30 Days" />
                <div className="flex items-center gap-2">
                  <Input label="Instructions" value={item.instructions} onChange={(e) => updatePrescriptionItem(idx, 'instructions', e.target.value)} placeholder="After food" />
                  {prescriptions.length > 1 && (
                    <button type="button" onClick={() => removePrescriptionItem(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Section 4: Lab Orders & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <Input label="Lab Tests Requested" value={labTestsInput} onChange={(e) => setLabTestsInput(e.target.value)} placeholder="e.g. ECG, Lipid Profile" />
            <Input label="Follow-up Date" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            <Input label="Consultation Fee ($)" type="number" value={billingAmount} onChange={(e) => setBillingAmount(Number(e.target.value))} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit" icon={<CheckCircle2 className="w-4 h-4" />}>
              Save & Complete OPD Encounter
            </Button>
          </div>
        </form>
      </Modal>

      {/* OPD Record Detail View Modal */}
      {viewConsultation && (
        <Modal
          isOpen={!!viewConsultation}
          onClose={() => setViewConsultation(null)}
          title={`Clinical Rx & OPD Summary — ${viewConsultation.id}`}
          subtitle={`Patient: ${viewConsultation.patientName} • Doctor: ${viewConsultation.doctorName}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3">
              <div><span className="text-slate-400 font-semibold uppercase text-[10px]">BP:</span> <p className="font-bold">{viewConsultation.vitals.bloodPressure}</p></div>
              <div><span className="text-slate-400 font-semibold uppercase text-[10px]">Pulse:</span> <p className="font-bold">{viewConsultation.vitals.pulseRate}</p></div>
              <div><span className="text-slate-400 font-semibold uppercase text-[10px]">Temp:</span> <p className="font-bold">{viewConsultation.vitals.temperature}</p></div>
              <div><span className="text-slate-400 font-semibold uppercase text-[10px]">Diagnosis:</span> <p className="font-bold text-medblue-700">{viewConsultation.diagnosis}</p></div>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 border-b border-slate-100 pb-2 text-sm">Prescribed Medications</h4>
              <div className="mt-2 divide-y divide-slate-100">
                {viewConsultation.prescriptionItems.map((med, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy-900">{med.medicineName}</p>
                      <p className="text-[11px] text-slate-500">{med.frequency} • {med.duration} ({med.instructions})</p>
                    </div>
                    <Badge variant="teal" size="sm">{med.dosage}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {viewConsultation.labTestsRequested.length > 0 && (
              <div>
                <h4 className="font-bold text-navy-900 border-b border-slate-100 pb-2 text-sm">Lab Orders</h4>
                <div className="mt-2 flex gap-2">
                  {viewConsultation.labTestsRequested.map((t, idx) => (
                    <Badge key={idx} variant="info">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
