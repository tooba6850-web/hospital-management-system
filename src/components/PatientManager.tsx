import React, { useState, useEffect } from 'react';
import type { Patient, Doctor, Appointment, IPDAdmission, EmergencyCase, Prescription } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { PatientProfileModal } from './PatientProfileModal';
import {
  Search,
  Plus,
  Edit,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface PatientManagerProps {
  patients: Patient[];
  doctors?: Doctor[];
  appointments?: Appointment[];
  admissions?: IPDAdmission[];
  emergencyCases?: EmergencyCase[];
  prescriptions?: Prescription[];
  onSavePatient: (p: any) => void;
  onDeactivatePatient?: (id: string) => void;
  isCreateOpenInitially?: boolean;
  autoOpenNewModal?: boolean;
  onCloseAutoOpenNewModal?: () => void;
}

export const PatientManager: React.FC<PatientManagerProps> = ({
  patients,
  admissions,
  emergencyCases,
  prescriptions,
  onSavePatient,
  onDeactivatePatient: _onDeactivatePatient,
  isCreateOpenInitially = false,
  autoOpenNewModal,
  onCloseAutoOpenNewModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedBlood, setSelectedBlood] = useState<string>('All');
  const [selectedPatientForView, setSelectedPatientForView] = useState<Patient | null>(null);
  const [selected360Patient, setSelected360Patient] = useState<Patient | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(isCreateOpenInitially || !!autoOpenNewModal);
  const [activeTabProfile, setActiveTabProfile] = useState<'overview' | 'history' | 'appointments' | 'billing'>('overview');

  useEffect(() => {
    if (autoOpenNewModal) {
      setIsModalOpen(true);
    }
  }, [autoOpenNewModal]);

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1990-01-01');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [existingConditions, setExistingConditions] = useState('');

  const openNewModal = () => {
    setEditingPatient(null);
    setFullName('');
    setGender('Male');
    setDob('1990-01-01');
    setBloodGroup('O+');
    setPhone('');
    setEmail('');
    setAddress('');
    setEmergencyName('');
    setEmergencyPhone('');
    setIdentificationNumber('');
    setAllergies('');
    setMedicalHistory('');
    setExistingConditions('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Patient) => {
    setEditingPatient(p);
    setFullName(p.fullName);
    setGender(p.gender);
    setDob(p.dob);
    setBloodGroup(p.bloodGroup);
    setPhone(p.phone);
    setEmail(p.email);
    setAddress(p.address);
    setEmergencyName(p.emergencyContact.name);
    setEmergencyPhone(p.emergencyContact.phone);
    setIdentificationNumber(p.identificationNumber);
    setAllergies(p.allergies.join(', '));
    setMedicalHistory(p.medicalHistory);
    setExistingConditions(p.existingConditions.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePatient({
      id: editingPatient ? editingPatient.id : undefined,
      fullName,
      gender,
      dob,
      bloodGroup,
      phone,
      email,
      address,
      emergencyContact: { name: emergencyName, relationship: 'Contact', phone: emergencyPhone },
      identificationNumber,
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      medicalHistory,
      existingConditions: existingConditions.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setIsModalOpen(false);
  };

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    const matchesBlood = selectedBlood === 'All' || p.bloodGroup === selectedBlood;
    return matchesSearch && matchesGender && matchesBlood;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Patient Database & Profiles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive clinical electronic health records (EHR) and admissions.
          </p>
        </div>
        <Button variant="teal" onClick={openNewModal} icon={<Plus className="w-4 h-4" />}>
          Register New Patient
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="py-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient ID, Name, or Phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-medblue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={selectedBlood}
              onChange={(e) => setSelectedBlood(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
            >
              <option value="All">All Blood Types</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Patients Data Table */}
      <Card headerBorder={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Patient ID / Name</th>
                <th className="py-3.5 px-4">Gender & DOB</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Emergency Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No patient records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-xs">
                          {p.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-navy-900">{p.fullName}</p>
                          <span className="text-[10px] text-medblue-600 font-medium">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{p.gender}</div>
                      <div className="text-[10px] text-slate-400">{p.dob}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="teal" size="sm">
                        {p.bloodGroup}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono">{p.phone}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{p.emergencyContact.name}</div>
                      <div className="text-[10px] text-slate-400">{p.emergencyContact.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={p.status === 'active' ? 'success' : 'danger'} dot>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Button
                        variant="teal"
                        size="sm"
                        onClick={() => setSelected360Patient(p)}
                      >
                        360° EHR Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedPatientForView(p)}
                      >
                        Quick EHR
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit className="w-3.5 h-3.5" />}
                        onClick={() => openEditModal(p)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Patient Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? `Edit Patient — ${editingPatient.id}` : 'Register New Patient'}
        subtitle="Complete all fields according to hospital registration protocols."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Gov Identification / SSN" value={identificationNumber} onChange={(e) => setIdentificationNumber(e.target.value)} />
            <Input label="Residential Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <Input label="Emergency Contact Name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} required />
            <Input label="Emergency Contact Phone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} required />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <Input label="Known Allergies (Comma separated)" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Peanuts" />
            <Input label="Existing Medical Conditions (Comma separated)" value={existingConditions} onChange={(e) => setExistingConditions(e.target.value)} placeholder="e.g. Hypertension, Asthma" />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Past Medical History & Notes
              </label>
              <textarea
                rows={2}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
                placeholder="Include past surgical procedures, hospitalizations..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              {editingPatient ? 'Save Changes' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Patient Profile View Modal */}
      {selectedPatientForView && (
        <Modal
          isOpen={!!selectedPatientForView}
          onClose={() => setSelectedPatientForView(null)}
          title={`Clinical Record — ${selectedPatientForView.fullName}`}
          subtitle={`ID: ${selectedPatientForView.id} • Registered ${selectedPatientForView.registrationDate}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-semibold gap-6">
              {(['overview', 'history', 'admissions', 'emergency', 'prescriptions'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabProfile(tab as any)}
                  className={`pb-2.5 capitalize transition-colors border-b-2 ${
                    activeTabProfile === (tab as any)
                      ? 'border-medblue-600 text-medblue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTabProfile === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Demographics</p>
                  <p><strong>DOB:</strong> {selectedPatientForView.dob}</p>
                  <p><strong>Gender:</strong> {selectedPatientForView.gender}</p>
                  <p><strong>Blood Group:</strong> <Badge variant="teal">{selectedPatientForView.bloodGroup}</Badge></p>
                  <p><strong>Gov ID:</strong> {selectedPatientForView.identificationNumber || 'N/A'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Contact Info</p>
                  <p><strong>Phone:</strong> {selectedPatientForView.phone}</p>
                  <p><strong>Email:</strong> {selectedPatientForView.email || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedPatientForView.address}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Emergency Contact</p>
                  <p><strong>Name:</strong> {selectedPatientForView.emergencyContact.name}</p>
                  <p><strong>Phone:</strong> {selectedPatientForView.emergencyContact.phone}</p>
                </div>
              </div>
            )}

            {activeTabProfile === 'history' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Known Allergies
                  </h4>
                  <p className="text-amber-800 mt-1">
                    {selectedPatientForView.allergies.length > 0
                      ? selectedPatientForView.allergies.join(', ')
                      : 'No drug or food allergies recorded.'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-bold text-slate-800">Medical History Notes</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {selectedPatientForView.medicalHistory || 'No past clinical records on file.'}
                  </p>
                </div>
              </div>
            )}

            {(activeTabProfile as string) === 'admissions' && (
              <div className="space-y-2 text-xs">
                {admissions?.filter((a) => a.patientId === selectedPatientForView.id).length === 0 ? (
                  <p className="text-slate-400 py-4 text-center">No inpatient admissions recorded for this patient.</p>
                ) : (
                  admissions
                    ?.filter((a) => a.patientId === selectedPatientForView.id)
                    .map((adm) => (
                      <div key={adm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-navy-900">{adm.id} — Room {adm.roomNumber} (Bed {adm.bedNumber})</p>
                          <p className="text-slate-500">Diagnosis: {adm.diagnosis}</p>
                          <p className="text-[10px] text-slate-400">Admitted on: {adm.admissionDate} • Doctor: {adm.doctorName}</p>
                        </div>
                        <Badge variant="teal" dot>{adm.status}</Badge>
                      </div>
                    ))
                )}
              </div>
            )}

            {(activeTabProfile as string) === 'emergency' && (
              <div className="space-y-2 text-xs">
                {emergencyCases?.filter((e) => e.patientId === selectedPatientForView.id || e.patientName === selectedPatientForView.fullName).length === 0 ? (
                  <p className="text-slate-400 py-4 text-center">No emergency ER visits recorded.</p>
                ) : (
                  emergencyCases
                    ?.filter((e) => e.patientId === selectedPatientForView.id || e.patientName === selectedPatientForView.fullName)
                    .map((ec) => (
                      <div key={ec.id} className="p-3 bg-rose-50/40 rounded-xl border border-rose-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-rose-900">{ec.id} — Priority {ec.priority}</p>
                          <p className="text-slate-600">Condition: {ec.condition}</p>
                          <p className="text-[10px] text-slate-400">Arrived at: {ec.arrivalTime}</p>
                        </div>
                        <Badge variant="danger">{ec.status}</Badge>
                      </div>
                    ))
                )}
              </div>
            )}

            {(activeTabProfile as string) === 'prescriptions' && (
              <div className="space-y-2 text-xs">
                {prescriptions?.filter((r) => r.patientId === selectedPatientForView.id).length === 0 ? (
                  <p className="text-slate-400 py-4 text-center">No active prescriptions on file.</p>
                ) : (
                  prescriptions
                    ?.filter((r) => r.patientId === selectedPatientForView.id)
                    .map((rx) => (
                      <div key={rx.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-medblue-700">{rx.id} — {rx.diagnosis}</span>
                          <span className="text-[10px] text-slate-400">{rx.date}</span>
                        </div>
                        <div className="space-y-1">
                          {rx.items.map((it, i) => (
                            <p key={i} className="text-slate-700 font-medium">
                              💊 {it.medicineName} ({it.dosage}) — {it.frequency} for {it.duration}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
      {/* 360° EHR Profile Modal */}
      <PatientProfileModal
        patient={selected360Patient}
        isOpen={Boolean(selected360Patient)}
        onClose={() => setSelected360Patient(null)}
      />
    </div>
  );
};
