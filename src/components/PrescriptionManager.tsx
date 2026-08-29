import React, { useState } from 'react';
import type { Prescription, Patient, Doctor, Medicine } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { FileText, Plus, Trash2, Printer, Search, Stethoscope } from 'lucide-react';

interface PrescriptionManagerProps {
  prescriptions: Prescription[];
  patients: Patient[];
  doctors: Doctor[];
  medicines?: Medicine[];
  onSavePrescription: (rx: any) => void;
}

export const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  prescriptions,
  patients,
  doctors,
  medicines: _medicines,
  onSavePrescription,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printableRx, setPrintableRx] = useState<Prescription | null>(null);

  // Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<
    { medicineName: string; dosage: string; frequency: string; duration: string; instructions: string }[]
  >([
    { medicineName: 'Paracetamol 500mg', dosage: '1 Tablet', frequency: 'Three times daily', duration: '5 Days', instructions: 'After meals' }
  ]);

  const addRxItem = () => {
    setItems([...items, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeRxItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateRxItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);

    if (!patient || !doctor) return;

    onSavePrescription({
      patientId: patient.id,
      patientName: patient.fullName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      diagnosis,
      date: new Date().toISOString().split('T')[0],
      notes,
      items: items.filter((i) => i.medicineName.trim()),
    });

    setIsModalOpen(false);
  };

  const filteredPrescriptions = prescriptions.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handlePrint = (rx: Prescription) => {
    setPrintableRx(rx);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Clinical Prescriptions (Rx)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulate multi-drug prescriptions, print physical Rx slips, and manage patient drug histories.
          </p>
        </div>
        <Button variant="teal" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Issue New Prescription
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="py-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Prescription ID, Patient Name, or Prescribing Doctor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-medblue-500"
          />
        </div>
      </Card>

      {/* Prescriptions List */}
      <Card headerBorder={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Rx ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Prescribing Doctor</th>
                <th className="py-3.5 px-4">Diagnosis</th>
                <th className="py-3.5 px-4">Medications Count</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Print Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No prescription records found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-medblue-600">{rx.id}</td>
                    <td className="py-3 px-4 font-semibold text-navy-900">{rx.patientName}</td>
                    <td className="py-3 px-4 text-slate-700">{rx.doctorName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="teal" size="sm">{rx.diagnosis}</Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {rx.items.length} Drug(s)
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{rx.date}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Printer className="w-3.5 h-3.5" />}
                        onClick={() => handlePrint(rx)}
                      >
                        Print Rx Slip
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Prescription Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Clinical Prescription" maxWidth="4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Patient</label>
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Prescribing Doctor</label>
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

          <Input label="Clinical Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required placeholder="e.g. Acute Bronchitis" />

          {/* Rx Items Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Prescribed Drugs list</h4>
              <Button type="button" variant="outline" size="sm" onClick={addRxItem} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Medication
              </Button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 items-end">
                <Input label="Medicine" value={item.medicineName} onChange={(e) => updateRxItem(idx, 'medicineName', e.target.value)} placeholder="e.g. Amoxicillin 500mg" />
                <Input label="Dosage" value={item.dosage} onChange={(e) => updateRxItem(idx, 'dosage', e.target.value)} placeholder="1 Capsule" />
                <Input label="Frequency" value={item.frequency} onChange={(e) => updateRxItem(idx, 'frequency', e.target.value)} placeholder="Every 8 Hours" />
                <Input label="Duration" value={item.duration} onChange={(e) => updateRxItem(idx, 'duration', e.target.value)} placeholder="7 Days" />
                <div className="flex items-center gap-2">
                  <Input label="Instructions" value={item.instructions} onChange={(e) => updateRxItem(idx, 'instructions', e.target.value)} placeholder="With meal" />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeRxItem(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Input label="Doctor's Advice / Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Complete full course of antibiotics." />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save & Finalize Prescription
            </Button>
          </div>
        </form>
      </Modal>

      {/* Hidden Printable Rx Slip Layout */}
      {printableRx && (
        <div className="fixed -left-[9999px] top-0 print:left-0 print:top-0 print:w-full print:bg-white print:p-8 text-slate-900 font-sans print:block">
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AURA HEALTH CLINIC</h1>
              <p className="text-xs text-slate-600">Enterprise Medical Center • Phone: +1 (555) 019-2831</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">{printableRx.id}</p>
              <p>Date: {printableRx.date}</p>
            </div>
          </div>

          <div className="my-6 grid grid-cols-2 text-xs border-b border-slate-200 pb-4">
            <div>
              <p><strong>Patient Name:</strong> {printableRx.patientName}</p>
              <p><strong>Patient ID:</strong> {printableRx.patientId}</p>
            </div>
            <div>
              <p><strong>Prescribing Physician:</strong> {printableRx.doctorName}</p>
              <p><strong>Diagnosis:</strong> {printableRx.diagnosis}</p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-base font-bold underline mb-3">Prescribed Rx Medications</h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-400">
                  <th className="py-2">Medicine Name</th>
                  <th className="py-2">Dosage</th>
                  <th className="py-2">Frequency</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {printableRx.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="py-2 font-bold">{item.medicineName}</td>
                    <td className="py-2">{item.dosage}</td>
                    <td className="py-2">{item.frequency}</td>
                    <td className="py-2">{item.duration}</td>
                    <td className="py-2">{item.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {printableRx.notes && (
            <div className="my-4 text-xs italic">
              <strong>Notes:</strong> {printableRx.notes}
            </div>
          )}

          <div className="mt-16 pt-4 border-t border-slate-300 flex justify-between text-xs">
            <span>Doctor Signature: ______________________</span>
            <span>Hospital Seal</span>
          </div>
        </div>
      )}
    </div>
  );
};
