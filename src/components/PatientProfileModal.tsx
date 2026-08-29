import React, { useState, useEffect } from 'react';
import type { Patient, CheckInToken, PatientTimelineEvent, PatientDocument } from '../types';
import { dbStore } from '../services/dbStore';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import {
  QrCode,
  Clock,
  FileText,
  Calendar,
  Activity,
  Plus,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Pill,
  FlaskConical,
  CreditCard,
  User,
  Shield,
  Upload
} from 'lucide-react';

interface PatientProfileModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'qr'>('overview');
  const [timelineEvents, setTimelineEvents] = useState<PatientTimelineEvent[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);

  // Document Upload Form State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<PatientDocument['documentType']>('Lab Report');

  useEffect(() => {
    if (patient) {
      setTimelineEvents(dbStore.getTimeline(patient.id));
      setDocuments(dbStore.getDocuments(patient.id));
    }
  }, [patient]);

  if (!patient || !isOpen) return null;

  const reloadPatientData = () => {
    setTimelineEvents(dbStore.getTimeline(patient.id));
    setDocuments(dbStore.getDocuments(patient.id));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dbStore.saveDocument({
      patientId: patient.id,
      title: docTitle,
      documentType: docType,
      fileUrl: '#',
      fileSize: '1.2 MB',
      uploadedBy: 'Clinical Staff',
    });
    setIsDocModalOpen(false);
    setDocTitle('');
    reloadPatientData();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`360° EHR Profile — ${patient.fullName}`} maxWidth="4xl">
      <div className="space-y-6">
        {/* Patient Header Banner */}
        <div className="p-4 bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-tealbrand-500 text-white font-bold text-xl flex items-center justify-center border-2 border-white/20 shadow-md">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{patient.fullName}</h2>
                <Badge variant="teal" size="sm">{patient.bloodGroup}</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                ID: {patient.id} • DOB: {patient.dob} • Gender: {patient.gender}
              </p>
              <p className="text-xs text-slate-300 font-mono">Phone: {patient.phone} • Email: {patient.email}</p>
            </div>
          </div>

          <div className="flex bg-white/10 p-1 rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'overview' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'timeline' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'documents' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-200'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'qr' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-200'
              }`}
            >
              QR Pass
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Card title="Medical Background & Alerts">
              <div className="space-y-2">
                <div>
                  <strong className="text-slate-500 uppercase tracking-wider text-[10px] block">Known Allergies:</strong>
                  <p className="font-semibold text-rose-600 bg-rose-50 p-2 rounded border border-rose-200 mt-0.5">
                    {Array.isArray(patient.allergies) ? patient.allergies.join(', ') : (patient.allergies || 'No known drug allergies reported.')}
                  </p>
                </div>
                <div>
                  <strong className="text-slate-500 uppercase tracking-wider text-[10px] block">Medical History:</strong>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded border mt-0.5">
                    {patient.medicalHistory || 'No prior chronic conditions recorded.'}
                  </p>
                </div>
                <div>
                  <strong className="text-slate-500 uppercase tracking-wider text-[10px] block">Emergency Contact:</strong>
                  <p className="text-slate-800 font-medium mt-0.5">
                    {typeof patient.emergencyContact === 'object' && patient.emergencyContact
                      ? `${patient.emergencyContact.name} (${patient.emergencyContact.relationship}) - ${patient.emergencyContact.phone}`
                      : String(patient.emergencyContact || 'None')}
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Identification & Demographics">
              <div className="space-y-2 text-slate-700">
                <p><strong>National ID / Passport:</strong> <span className="font-mono">{patient.identificationNumber}</span></p>
                <p><strong>Residential Address:</strong> {patient.address}</p>
                <p><strong>EHR Registration Date:</strong> <span className="font-mono">{patient.registrationDate}</span></p>
                <p><strong>Status:</strong> <Badge variant="success" dot>Active Record</Badge></p>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Chronological Timeline */}
        {activeTab === 'timeline' && (
          <Card title="Chronological Clinical Care Timeline" subtitle="Full audit history of patient encounters">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No events logged in patient timeline.</p>
              ) : (
                timelineEvents.map((evt) => (
                  <div key={evt.id} className="relative group">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-tealbrand-500 ring-4 ring-white" />
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy-900">{evt.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{evt.description}</p>
                      <p className="text-[10px] text-tealbrand-700 font-semibold pt-1">Staff: {evt.staffName}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Tab 3: Patient Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">Uploaded Patient Clinical Documents</h4>
              <Button variant="teal" size="sm" onClick={() => setIsDocModalOpen(true)} icon={<Upload className="w-3.5 h-3.5" />}>
                Upload Document
              </Button>
            </div>

            <Card headerBorder={false} className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Document Title</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Uploaded Date</th>
                      <th className="py-3 px-4">Uploaded By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No documents uploaded yet.
                        </td>
                      </tr>
                    ) : (
                      documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-navy-900">{doc.title}</td>
                          <td className="py-3 px-4"><Badge variant="teal" size="sm">{doc.documentType}</Badge></td>
                          <td className="py-3 px-4 font-mono text-slate-500">{doc.fileSize}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono">{doc.uploadedAt}</td>
                          <td className="py-3 px-4 text-slate-600">{doc.uploadedBy}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: Secure QR Profile Pass */}
        {activeTab === 'qr' && (
          <Card className="text-center py-8 space-y-4">
            <div className="w-36 h-36 mx-auto bg-white p-3 border-2 border-navy-900 rounded-xl shadow-md flex items-center justify-center">
              <QrCode className="w-28 h-28 text-navy-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Patient Digital Health Pass</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Scan to instantly authenticate patient identity at reception or triage desk without exposing clinical health records.
              </p>
              <p className="text-[10px] text-tealbrand-700 font-mono font-bold mt-2">
                ENC-PASS-{patient.id}-2026
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Document Upload Modal */}
      <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title="Upload Patient Document" maxWidth="md">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input label="Document Title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} required placeholder="e.g. Brain MRI Scan Report" />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {['Medical History', 'Lab Report', 'ID Proof', 'Referral Letter', 'Discharge Slip'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">Click or drag file to attach clinical document</p>
            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsDocModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Document
            </Button>
          </div>
        </form>
      </Modal>
    </Modal>
  );
};
