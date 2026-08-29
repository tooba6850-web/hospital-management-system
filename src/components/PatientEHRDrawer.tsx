import React from 'react';
import type { Patient } from '../types';

interface PatientEHRDrawerProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientEHRDrawer: React.FC<PatientEHRDrawerProps> = ({ patient, isOpen, onClose }) => {
  if (!patient || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-base font-bold text-navy-900">EHR Quick Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
            &times;
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="font-bold text-navy-900 text-sm block">{patient.fullName}</span>
            <span className="text-slate-500 font-mono">ID: {patient.id} • {patient.gender} • Blood Group: {patient.bloodGroup}</span>
          </div>

          <div>
            <strong className="text-slate-500 block uppercase text-[10px]">Contact Info:</strong>
            <p className="text-slate-800">{patient.phone} • {patient.email}</p>
          </div>

          <div>
            <strong className="text-slate-500 block uppercase text-[10px]">Known Allergies:</strong>
            <p className="text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">{patient.allergies || 'None'}</p>
          </div>

          <div>
            <strong className="text-slate-500 block uppercase text-[10px]">Medical History:</strong>
            <p className="text-slate-700 bg-slate-50 p-2 rounded border">{patient.medicalHistory || 'None recorded'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
