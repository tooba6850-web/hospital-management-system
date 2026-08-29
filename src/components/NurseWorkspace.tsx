import React, { useState } from 'react';
import type { IPDAdmission, Room, Bed, EmergencyCase, Patient } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import {
  Bed as BedIcon,
  HeartPulse,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Activity,
  CheckSquare
} from 'lucide-react';

interface NurseWorkspaceProps {
  patients?: Patient[];
  admissions: IPDAdmission[];
  rooms: Room[];
  beds: Bed[];
  emergencyCases: EmergencyCase[];
  onUpdateBedStatus: (bedId: string, status: Bed['status']) => void;
  onUpdateVitals?: (patientId: string, vitals: any) => void;
}

export const NurseWorkspace: React.FC<NurseWorkspaceProps> = ({
  patients = [],
  admissions,
  rooms,
  beds,
  emergencyCases,
  onUpdateBedStatus,
  onUpdateVitals,
}) => {
  const activeAdmissions = admissions.filter((a) => a.status === 'Admitted' || a.status === 'Under Treatment');

  const [tasks, setTasks] = useState<{ id: string; title: string; patientName: string; room: string; status: 'Pending' | 'Completed' }[]>([
    { id: 'TSK-1', title: 'Administer Morning Rx Antibiotics', patientName: 'Eleanor Vance', room: 'Room 101-W', status: 'Pending' },
    { id: 'TSK-2', title: 'Check & Record Post-Op Vitals', patientName: 'Marcus Brody', room: 'ICU Bed 201', status: 'Completed' },
    { id: 'TSK-3', title: 'Prepare Ward Discharge Paperwork', patientName: 'Sophia Lin', room: 'Room 104-B', status: 'Pending' },
  ]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPatient, setTaskPatient] = useState('Eleanor Vance');
  const [taskRoom, setTaskRoom] = useState('Room 101-W');

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t)));
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTasks([
      ...tasks,
      {
        id: `TSK-${Date.now()}`,
        title: taskTitle,
        patientName: taskPatient,
        room: taskRoom,
        status: 'Pending',
      },
    ]);
    setIsTaskModalOpen(false);
    setTaskTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Nurse Inpatient & Care Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor ward admissions, bed occupancy heatmap, vital signs logging, and clinical task execution.
          </p>
        </div>
        <Button variant="teal" onClick={() => setIsTaskModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Add Nursing Task
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Ward Admissions</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-0.5">{activeAdmissions.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-medblue-50 text-medblue-700">
              <BedIcon className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/60 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Nursing Tasks</p>
              <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{tasks.filter((t) => t.status === 'Pending').length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-rose-50/60 border border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">24/7 ER Critical Cases</p>
              <h3 className="text-2xl font-bold text-rose-900 mt-0.5">
                {emergencyCases.filter((e) => e.priority === 'Critical' && e.status !== 'Discharged').length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Available Beds</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-0.5">
                {beds.filter((b) => b.status === 'Available').length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Nursing Tasks List + Inpatient Bed Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Nursing Checklist (1 Col) */}
        <Card title="Shift Nursing Checklist" subtitle="Toggle task status upon clinical execution">
          <div className="space-y-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleToggleTask(t.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  t.status === 'Completed' ? 'bg-emerald-50/40 border-emerald-200 line-through opacity-70' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <p className="font-bold text-navy-900">{t.title}</p>
                  <p className="text-[10px] text-slate-500">{t.patientName} • {t.room}</p>
                </div>
                <CheckSquare className={`w-5 h-5 ${t.status === 'Completed' ? 'text-emerald-600' : 'text-slate-300'}`} />
              </div>
            ))}
          </div>
        </Card>

        {/* Visual Ward Bed Occupancy Heatmap (2 Cols) */}
        <div className="lg:col-span-2">
          <Card title="Visual Ward Bed Heatmap Matrix" subtitle="Live real-time bed availability locking">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {beds.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    b.status === 'Occupied'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : b.status === 'Available'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : b.status === 'Reserved'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <BedIcon className="w-5 h-5 mx-auto mb-1 opacity-80" />
                  <span className="font-bold text-xs block">{b.bedNumber}</span>
                  <span className="text-[10px] block opacity-75">{b.roomNumber}</span>
                  <Badge
                    variant={
                      b.status === 'Occupied'
                        ? 'danger'
                        : b.status === 'Available'
                        ? 'success'
                        : 'warning'
                    }
                    size="sm"
                    className="mt-1.5"
                  >
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create Nursing Task">
        <form onSubmit={handleAddTaskSubmit} className="space-y-4">
          <Input label="Task Description" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required placeholder="e.g. Check blood glucose level" />
          <Input label="Patient Name" value={taskPatient} onChange={(e) => setTaskPatient(e.target.value)} required />
          <Input label="Room / Ward" value={taskRoom} onChange={(e) => setTaskRoom(e.target.value)} required />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
