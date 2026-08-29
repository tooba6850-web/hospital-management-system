import React, { useState } from 'react';
import type { Doctor, Department } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Search,
  Plus,
  Stethoscope,
  Phone,
  Mail,
  Clock,
  Calendar,
  CheckCircle,
  Building,
  DollarSign
} from 'lucide-react';

interface DoctorManagerProps {
  doctors: Doctor[];
  departments: Department[];
  onSaveDoctor: (doc: any) => void;
}

export const DoctorManager: React.FC<DoctorManagerProps> = ({
  doctors,
  departments,
  onSaveDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [consultationFee, setConsultationFee] = useState(150);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const openNewModal = () => {
    setEditingDoctor(null);
    setName('');
    setEmail('');
    setPhone('');
    setSpecialization('');
    setDepartmentId(departments[0]?.id || '');
    setQualification('');
    setExperienceYears(5);
    setConsultationFee(150);
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setStartTime('09:00');
    setEndTime('17:00');
    setIsModalOpen(true);
  };

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDoctor({
      id: editingDoctor ? editingDoctor.id : undefined,
      name,
      email,
      phone,
      specialization,
      departmentId,
      qualification,
      experienceYears: Number(experienceYears),
      consultationFee: Number(consultationFee),
      status: 'active',
      availableDays: selectedDays,
      availableHours: { start: startTime, end: endTime },
    });
    setIsModalOpen(false);
  };

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || d.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Medical Staff & Doctors</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage medical specialists, consultation fees, and duty schedules.
          </p>
        </div>
        <Button variant="teal" onClick={openNewModal} icon={<Plus className="w-4 h-4" />}>
          Add New Doctor
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
              placeholder="Search doctor by name or specialization..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-medblue-500"
            />
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id} className="hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-medblue-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-900">{doc.name}</h3>
                    <p className="text-xs text-medblue-600 font-medium">{doc.specialization}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.id}</span>
                  </div>
                </div>
                <Badge variant={doc.status === 'active' ? 'success' : 'warning'} dot>
                  {doc.status}
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-800">{doc.departmentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Qualifications:</span>
                  <span className="font-medium text-slate-700">{doc.qualification}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-medium text-slate-700">{doc.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-bold text-tealbrand-700">${doc.consultationFee}</span>
                </div>
              </div>

              {/* Duty Schedule Pill */}
              <div className="mt-4 p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Availability:
                  </span>
                  <span>
                    {doc.availableHours.start} - {doc.availableHours.end}
                  </span>
                </div>
                <div className="flex gap-1 pt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                    const isAvailable = doc.availableDays.includes(day);
                    return (
                      <span
                        key={day}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isAvailable ? 'bg-medblue-100 text-medblue-800 font-bold' : 'bg-slate-200/50 text-slate-400'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingDoctor(doc);
                  setName(doc.name);
                  setEmail(doc.email);
                  setPhone(doc.phone);
                  setSpecialization(doc.specialization);
                  setDepartmentId(doc.departmentId);
                  setQualification(doc.qualification);
                  setExperienceYears(doc.experienceYears);
                  setConsultationFee(doc.consultationFee);
                  setSelectedDays(doc.availableDays);
                  setStartTime(doc.availableHours.start);
                  setEndTime(doc.availableHours.end);
                  setIsModalOpen(true);
                }}
              >
                Edit Doctor Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Create/Edit Doctor */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? `Edit — ${editingDoctor.name}` : 'Register New Medical Doctor'}
        subtitle="Configure doctor credentials and clinical schedule."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Doctor Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Dr. John Doe" />
            <Input label="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required placeholder="e.g. Cardiology" />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Qualifications" value={qualification} onChange={(e) => setQualification(e.target.value)} required placeholder="MD, Board Certified" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Years of Experience" type="number" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} required />
            <Input label="Consultation Fee ($)" type="number" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} required />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Clinical Days</label>
            <div className="flex gap-2 flex-wrap">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDays.includes(day)
                      ? 'bg-medblue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Duty Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Input label="Duty End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Doctor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
