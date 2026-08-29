import React, { useState } from 'react';
import type { Patient, Doctor, CheckInToken } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Ticket,
  Plus,
  Tv,
  Clock,
  UserCheck,
  Search,
  CheckCircle2
} from 'lucide-react';

interface QueueManagerProps {
  tokens: CheckInToken[];
  patients: Patient[];
  doctors: Doctor[];
  onGenerateToken: (patientId: string, doctorId: string) => CheckInToken;
  onUpdateTokenStatus: (id: string, status: CheckInToken['status']) => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  tokens,
  patients,
  doctors,
  onGenerateToken,
  onUpdateTokenStatus,
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isTvDisplayOpen, setIsTvDisplayOpen] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');

  const waitingTokens = tokens.filter((t) => t.status === 'Checked In' || t.status === 'Waiting');
  const currentConsultingToken = tokens.find((t) => t.status === 'In Consultation');

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateToken(selectedPatientId, selectedDoctorId);
    setIsTokenModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Smart Patient Check-in & Queue Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue token numbers, display waiting queue positions, and broadcast live reception TV display.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsTvDisplayOpen(true)} icon={<Tv className="w-4 h-4" />}>
            Open TV Display Screen
          </Button>
          <Button variant="teal" onClick={() => setIsTokenModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Issue Check-in Token
          </Button>
        </div>
      </div>

      {/* Main Grid: Queue Table + Currently Calling Token Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Queue Table (2 Cols) */}
        <div className="lg:col-span-2">
          <Card title="Active Reception Queue" subtitle="List of checked-in patients waiting for consultation">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Token #</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Assigned Physician</th>
                    <th className="py-3 px-4">Check-in Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tokens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No tokens issued today.
                      </td>
                    </tr>
                  ) : (
                    tokens.map((tkn) => (
                      <tr key={tkn.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-tealbrand-700 text-sm">{tkn.tokenNumber}</td>
                        <td className="py-3 px-4 font-semibold text-navy-900">{tkn.patientName}</td>
                        <td className="py-3 px-4 text-slate-700">{tkn.doctorName}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{tkn.checkInTime}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              tkn.status === 'In Consultation'
                                ? 'teal'
                                : tkn.status === 'Checked In'
                                ? 'warning'
                                : tkn.status === 'Completed'
                                ? 'success'
                                : 'secondary'
                            }
                            dot
                          >
                            {tkn.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          {tkn.status === 'Checked In' && (
                            <Button
                              variant="teal"
                              size="sm"
                              onClick={() => onUpdateTokenStatus(tkn.id, 'In Consultation')}
                            >
                              Call Patient
                            </Button>
                          )}
                          {tkn.status === 'In Consultation' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onUpdateTokenStatus(tkn.id, 'Completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Current Call Panel (1 Col) */}
        <div>
          <Card title="Current Token Call" className="text-center py-6">
            {currentConsultingToken ? (
              <div className="space-y-3">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-tealbrand-600 to-medblue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg animate-pulse">
                  {currentConsultingToken.tokenNumber}
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900">{currentConsultingToken.patientName}</h3>
                  <p className="text-xs text-tealbrand-700 font-semibold">{currentConsultingToken.doctorName}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{currentConsultingToken.departmentName}</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-slate-400 text-xs">
                <Ticket className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                No patient currently in consultation room.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Issue Token Modal */}
      <Modal isOpen={isTokenModalOpen} onClose={() => setIsTokenModalOpen(false)} title="Issue Reception Queue Token">
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Assigned Physician</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsTokenModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Generate Token
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reception TV Display Fullscreen Modal */}
      <Modal isOpen={isTvDisplayOpen} onClose={() => setIsTvDisplayOpen(false)} title="Live Reception TV Queue Display" maxWidth="4xl">
        <div className="bg-navy-950 text-white p-8 rounded-2xl space-y-8 text-center border border-navy-800 shadow-2xl">
          <div className="border-b border-navy-800 pb-4">
            <h2 className="text-2xl font-bold tracking-wide text-white">AURA HEALTH CENTRAL RECEPTION QUEUE</h2>
            <p className="text-xs text-tealbrand-400 font-mono mt-1">Live Consultation Status Board</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navy-900/80 p-6 rounded-xl border border-tealbrand-500/30">
              <span className="text-xs font-bold uppercase tracking-widest text-tealbrand-400 block mb-2">NOW CONSULTING</span>
              <div className="text-5xl font-black text-white font-mono my-3 tracking-wider">
                {currentConsultingToken ? currentConsultingToken.tokenNumber : '—'}
              </div>
              <p className="text-sm font-semibold text-slate-200">{currentConsultingToken?.patientName || 'Waiting for call'}</p>
              <p className="text-xs text-slate-400">{currentConsultingToken?.doctorName}</p>
            </div>

            <div className="bg-navy-900/80 p-6 rounded-xl border border-navy-700">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">NEXT IN QUEUE</span>
              <div className="text-5xl font-black text-slate-300 font-mono my-3 tracking-wider">
                {waitingTokens[0] ? waitingTokens[0].tokenNumber : '—'}
              </div>
              <p className="text-sm font-semibold text-slate-300">{waitingTokens[0]?.patientName || 'Queue empty'}</p>
              <p className="text-xs text-slate-400">{waitingTokens[0]?.doctorName}</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono pt-4 border-t border-navy-800 flex justify-between">
            <span>Total Waiting: {waitingTokens.length} Patients</span>
            <span>Please take your seat until your token number is called</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
