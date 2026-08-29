import React, { useState } from 'react';
import type { StaffMember, AttendanceRecord, Department, AttendanceStatus } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  UserCog,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  UserX,
  Building,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

interface StaffManagerProps {
  staff: StaffMember[];
  attendance: AttendanceRecord[];
  departments: Department[];
  onSaveStaff: (s: any) => void;
  onDeactivateStaff: (id: string) => void;
  onRecordAttendance: (att: any) => void;
}

export const StaffManager: React.FC<StaffManagerProps> = ({
  staff,
  attendance,
  departments,
  onSaveStaff,
  onDeactivateStaff,
  onRecordAttendance,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'attendance'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isAttModalOpen, setIsAttModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form State — Staff
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State — Attendance
  const [selectedEmpId, setSelectedEmpId] = useState(staff[0]?.id || '');
  const [attStatus, setAttStatus] = useState<AttendanceStatus>('Present');
  const [checkIn, setCheckIn] = useState('08:00 AM');
  const [checkOut, setCheckOut] = useState('04:30 PM');

  const openNewStaffModal = () => {
    setEditingStaff(null);
    setName('');
    setDepartmentId(departments[0]?.id || '');
    setPosition('');
    setPhone('');
    setEmail('');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setIsStaffModalOpen(true);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === departmentId);
    onSaveStaff({
      id: editingStaff ? editingStaff.id : undefined,
      name,
      departmentId,
      departmentName: dept ? dept.name : 'General',
      position,
      phone,
      email,
      joiningDate,
      status: 'Active',
    });
    setIsStaffModalOpen(false);
  };

  const handleAttSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = staff.find((s) => s.id === selectedEmpId);
    if (!emp) return;

    onRecordAttendance({
      employeeId: emp.id,
      employeeName: emp.name,
      departmentName: emp.departmentName,
      date: new Date().toISOString().split('T')[0],
      checkIn: attStatus === 'Absent' ? undefined : checkIn,
      checkOut: attStatus === 'Absent' ? undefined : checkOut,
      status: attStatus,
    });
    setIsAttModalOpen(false);
  };

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Hospital Staff & Duty Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage medical staff profiles, duty positions, shift attendance, and check-in logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveSubTab('roster')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'roster' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Staff Roster
            </button>
            <button
              onClick={() => setActiveSubTab('attendance')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'attendance' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Duty Attendance
            </button>
          </div>
          <Button variant="teal" onClick={openNewStaffModal} icon={<Plus className="w-4 h-4" />}>
            Add Staff Member
          </Button>
        </div>
      </div>

      {activeSubTab === 'roster' ? (
        <>
          {/* Filter Bar */}
          <Card className="py-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff by Employee ID, Name, or Position..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-tealbrand-500"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Staff Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((emp) => (
              <Card key={emp.id} className="hover:border-slate-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-navy-900">{emp.name}</h3>
                        <p className="text-xs text-tealbrand-700 font-medium">{emp.position}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.id}</span>
                      </div>
                    </div>
                    <Badge variant={emp.status === 'Active' ? 'success' : 'secondary'} dot>
                      {emp.status}
                    </Badge>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p><strong>Department:</strong> {emp.departmentName}</p>
                    <p><strong>Phone:</strong> {emp.phone}</p>
                    <p><strong>Email:</strong> {emp.email}</p>
                    <p><strong>Joined:</strong> {emp.joiningDate}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setEditingStaff(emp);
                      setName(emp.name);
                      setDepartmentId(emp.departmentId);
                      setPosition(emp.position);
                      setPhone(emp.phone);
                      setEmail(emp.email);
                      setJoiningDate(emp.joiningDate);
                      setIsStaffModalOpen(true);
                    }}
                    className="text-medblue-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Profile
                  </button>

                  <button
                    onClick={() => onDeactivateStaff(emp.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                    title="Deactivate Employee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Attendance Log View */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Today's Duty Check-in Logs</h2>
            <Button variant="secondary" size="sm" onClick={() => setIsAttModalOpen(true)} icon={<Clock className="w-4 h-4" />}>
              Record Duty Attendance
            </Button>
          </div>

          <Card headerBorder={false} className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Check In</th>
                    <th className="py-3.5 px-4">Check Out</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-navy-900">{att.employeeName}</td>
                      <td className="py-3 px-4 text-slate-700">{att.departmentName}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{att.date}</td>
                      <td className="py-3 px-4 font-mono font-medium text-emerald-700">{att.checkIn || '—'}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">{att.checkOut || '—'}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            att.status === 'Present'
                              ? 'success'
                              : att.status === 'Late'
                              ? 'warning'
                              : 'danger'
                          }
                          dot
                        >
                          {att.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title={editingStaff ? `Edit — ${editingStaff.name}` : 'Register Staff Member'} maxWidth="lg">
        <form onSubmit={handleStaffSubmit} className="space-y-4">
          <Input label="Employee Full Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Clara Oswald" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Duty Position / Title" value={position} onChange={(e) => setPosition(e.target.value)} required placeholder="e.g. Head Nurse" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Input label="Joining Date" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} required />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsStaffModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Staff Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Attendance Modal */}
      <Modal isOpen={isAttModalOpen} onClose={() => setIsAttModalOpen(false)} title="Record Shift Attendance" maxWidth="md">
        <form onSubmit={handleAttSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.position} — {s.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Attendance Status</label>
            <select
              value={attStatus}
              onChange={(e) => setAttStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-bold"
            >
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          {attStatus !== 'Absent' && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Check In Time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="08:00 AM" />
              <Input label="Check Out Time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="04:30 PM" />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAttModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Log Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
