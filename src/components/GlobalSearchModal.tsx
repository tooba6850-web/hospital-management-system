import React, { useState, useEffect } from 'react';
import { Search, X, Users, UserCheck, Calendar, Pill, FileText, FlaskConical, ArrowRight } from 'lucide-react';
import type { Patient, Doctor, Appointment, Medicine, Invoice, LabTest } from '../types';
import type { NavItemKey } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicines: Medicine[];
  invoices: Invoice[];
  labTests: LabTest[];
  onSelectResult: (targetTab: NavItemKey) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  doctors,
  appointments,
  medicines,
  invoices,
  labTests,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredPatients = q ? patients.filter(p => p.fullName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone?.includes(q)).slice(0, 3) : [];
  const filteredDoctors = q ? doctors.filter(d => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.departmentName.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredAppointments = q ? appointments.filter(a => a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredMedicines = q ? medicines.filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredInvoices = q ? invoices.filter(i => i.id.toLowerCase().includes(q) || i.patientName.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredLabTests = q ? labTests.filter(t => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)).slice(0, 3) : [];

  const totalResults = filteredPatients.length + filteredDoctors.length + filteredAppointments.length + filteredMedicines.length + filteredInvoices.length + filteredLabTests.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-modal-in z-10">
        {/* Search input bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-medblue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, doctors, appointments, rx stock, invoices..."
            className="w-full bg-transparent text-sm text-navy-900 placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300 shrink-0">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">Type to search across all hospital resources...</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] text-slate-500">
                <span className="bg-slate-100 px-2.5 py-1 rounded-full">Patients</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full">Doctors</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full">Appointments</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full">Medicines</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full">Invoices</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching hospital records found for "<strong className="text-navy-900">{query}</strong>".
            </div>
          ) : (
            <>
              {filteredPatients.length > 0 && (
                <div>
                  <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-medblue-500" /> Patients
                  </div>
                  <div className="space-y-1">
                    {filteredPatients.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectResult('patients');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-medblue-600">{p.fullName}</p>
                          <p className="text-[11px] text-slate-500">ID: {p.id} • Phone: {p.phone} • Blood Group: {p.bloodGroup}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-medblue-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredDoctors.length > 0 && (
                <div>
                  <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-tealbrand-500" /> Doctors
                  </div>
                  <div className="space-y-1">
                    {filteredDoctors.map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onSelectResult('doctors');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-tealbrand-600">{d.name}</p>
                          <p className="text-[11px] text-slate-500">{d.specialization} • Dept: {d.departmentName}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-tealbrand-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredAppointments.length > 0 && (
                <div>
                  <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" /> Appointments
                  </div>
                  <div className="space-y-1">
                    {filteredAppointments.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onSelectResult('appointments');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-sky-600">{a.patientName} with {a.doctorName}</p>
                          <p className="text-[11px] text-slate-500">ID: {a.id} • Date: {a.date} • Status: {a.status}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredMedicines.length > 0 && (
                <div>
                  <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-500" /> Medicines & Stock
                  </div>
                  <div className="space-y-1">
                    {filteredMedicines.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onSelectResult('pharmacy');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-emerald-600">{m.name} ({m.id})</p>
                          <p className="text-[11px] text-slate-500">{m.category} • In Stock: {m.stockQuantity} units • ${m.sellingPrice}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredInvoices.length > 0 && (
                <div>
                  <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" /> Billing Invoices
                  </div>
                  <div className="space-y-1">
                    {filteredInvoices.map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          onSelectResult('billing');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-navy-900 group-hover:text-indigo-600">{inv.id} - {inv.patientName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">${inv.grandTotal.toFixed(2)} • Status: {inv.paymentStatus}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer command tips */}
        <div className="p-3 bg-slate-100/70 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between px-4">
          <span>Press <strong>Ctrl + K</strong> anytime to trigger global search</span>
          <span className="font-medium text-slate-600">Aura Health Engine</span>
        </div>
      </div>
    </div>
  );
};
