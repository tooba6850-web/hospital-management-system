import React, { useState } from 'react';
import type { Room, Bed, Department } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { Bed as BedIcon, Building, Plus, CheckCircle2, AlertOctagon, Wrench, User } from 'lucide-react';

interface RoomBedManagerProps {
  rooms: Room[];
  beds: Bed[];
  departments: Department[];
  onSaveRoom: (room: any) => void;
  onSaveBed: (bed: any) => void;
  onUpdateBedStatus: (bedId: string, status: Bed['status']) => void;
}

export const RoomBedManager: React.FC<RoomBedManagerProps> = ({
  rooms,
  beds,
  departments,
  onSaveRoom,
  onSaveBed,
  onUpdateBedStatus,
}) => {
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('All');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);

  // New Room Form
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState<Room['roomType']>('General Ward');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [floor, setFloor] = useState('1st Floor');

  // New Bed Form
  const [bedNumber, setBedNumber] = useState('');
  const [targetRoomId, setTargetRoomId] = useState(rooms[0]?.id || '');

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === departmentId);
    onSaveRoom({
      roomNumber,
      roomType,
      departmentId,
      departmentName: dept ? dept.name : 'General',
      floor,
    });
    setIsRoomModalOpen(false);
  };

  const handleBedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find((r) => r.id === targetRoomId);
    if (!room) return;

    onSaveBed({
      bedNumber,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      status: 'Available',
    });
    setIsBedModalOpen(false);
  };

  // Stats calculation
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const maintenanceBeds = beds.filter((b) => b.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Room & Bed Occupancy Architecture</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual ward occupancy matrix, maintenance tracking, and physical room management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsRoomModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Room
          </Button>
          <Button variant="teal" size="sm" onClick={() => setIsBedModalOpen(true)} icon={<BedIcon className="w-4 h-4" />}>
            Add Bed
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Beds</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-0.5">{totalBeds}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
              <BedIcon className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-emerald-50/50 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Available</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-0.5">{availableBeds}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-medblue-50/50 border border-medblue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-medblue-700 uppercase tracking-wider">Occupied</p>
              <h3 className="text-2xl font-bold text-medblue-900 mt-0.5">{occupiedBeds}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-medblue-100 text-medblue-700">
              <User className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/50 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Maintenance</p>
              <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{maintenanceBeds}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Bed Grid grouped by Rooms */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Visual Bed Occupancy Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const roomBeds = beds.filter((b) => b.roomId === room.id);

            return (
              <Card key={room.id} className="hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Room {room.roomNumber}</h3>
                    <p className="text-xs text-slate-500">
                      {room.roomType} • <span className="text-slate-400">{room.floor}</span>
                    </p>
                  </div>
                  <Badge variant="teal" size="sm">
                    {room.departmentName}
                  </Badge>
                </div>

                {/* Beds in this room */}
                <div className="grid grid-cols-2 gap-2">
                  {roomBeds.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic col-span-2 py-2">No beds created for this room.</p>
                  ) : (
                    roomBeds.map((bed) => (
                      <div
                        key={bed.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          bed.status === 'Occupied'
                            ? 'bg-medblue-50/70 border-medblue-300 text-medblue-950'
                            : bed.status === 'Available'
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50/70 border-amber-300 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono">{bed.bedNumber}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              bed.status === 'Occupied'
                                ? 'bg-medblue-600'
                                : bed.status === 'Available'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                          />
                        </div>

                        <div className="mt-2 text-[11px]">
                          {bed.status === 'Occupied' ? (
                            <p className="font-semibold truncate" title={bed.patientName}>
                              👤 {bed.patientName}
                            </p>
                          ) : (
                            <span className="font-medium opacity-80">{bed.status}</span>
                          )}
                        </div>

                        {/* Quick Toggle for Maintenance */}
                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-end">
                          {bed.status === 'Available' && (
                            <button
                              onClick={() => onUpdateBedStatus(bed.id, 'Maintenance')}
                              className="text-[9px] font-semibold text-slate-500 hover:text-amber-700"
                            >
                              Mark Maintenance
                            </button>
                          )}
                          {bed.status === 'Maintenance' && (
                            <button
                              onClick={() => onUpdateBedStatus(bed.id, 'Available')}
                              className="text-[9px] font-semibold text-emerald-700 hover:underline"
                            >
                              Make Available
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Room Modal */}
      <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title="Register Physical Room">
        <form onSubmit={handleRoomSubmit} className="space-y-4">
          <Input label="Room Number / Identifier" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required placeholder="e.g. 401-ICU" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {['General Ward', 'Semi Private', 'Private', 'ICU', 'Emergency', 'Isolation'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
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
          <Input label="Floor Location" value={floor} onChange={(e) => setFloor(e.target.value)} required placeholder="e.g. 4th Floor" />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsRoomModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Room
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Bed Modal */}
      <Modal isOpen={isBedModalOpen} onClose={() => setIsBedModalOpen(false)} title="Add Bed Unit">
        <form onSubmit={handleBedSubmit} className="space-y-4">
          <Input label="Bed Number / Label" value={bedNumber} onChange={(e) => setBedNumber(e.target.value)} required placeholder="e.g. 101-C" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Assign to Room</label>
            <select
              value={targetRoomId}
              onChange={(e) => setTargetRoomId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-medium"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} ({r.roomType} — {r.floor})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsBedModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Bed Unit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
