import React, { useState } from 'react';
import type { Department, Doctor } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { Building2, Plus, Users, Calendar, Edit, Check } from 'lucide-react';

interface DepartmentManagerProps {
  departments: Department[];
  doctors?: Doctor[];
  onSaveDepartment: (dept: any) => void;
}

export const DepartmentManager: React.FC<DepartmentManagerProps> = ({
  departments,
  doctors: _doctors,
  onSaveDepartment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const openNewModal = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDepartment({
      id: editingDept ? editingDept.id : undefined,
      name,
      code,
      description,
      status: 'active',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Hospital Departments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage clinical departments, capacity metrics, and departmental leadership.
          </p>
        </div>
        <Button variant="teal" onClick={openNewModal} icon={<Plus className="w-4 h-4" />}>
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-medblue-50 text-medblue-700 flex items-center justify-center font-bold text-sm">
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-900">{dept.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{dept.id}</p>
                  </div>
                </div>
                <Badge variant={dept.status === 'active' ? 'success' : 'secondary'} dot>
                  {dept.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-2">
                  <Users className="w-4 h-4 text-medblue-600" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Doctors</p>
                    <p className="font-bold text-navy-900">{dept.doctorCount}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-tealbrand-600" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Visits</p>
                    <p className="font-bold text-navy-900">{dept.appointmentCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Head: {dept.headDoctorName || 'Unassigned'}</span>
              <button
                onClick={() => {
                  setEditingDept(dept);
                  setName(dept.name);
                  setCode(dept.code);
                  setDescription(dept.description);
                  setIsModalOpen(true);
                }}
                className="text-medblue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? `Edit — ${editingDept.name}` : 'Create Clinical Department'}
        subtitle="Specify code, name and operational parameters."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Department Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Neurology" />
          <Input label="Department Code" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="e.g. NEUR" maxLength={5} />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-medblue-500"
              placeholder="Operational scope of this department..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
