import React from 'react';
import { Card } from './common/Card';
import { Badge } from './common/Badge';
import { Button } from './common/Button';
import type { Patient, Appointment, Doctor } from '../types';
import {
  Users,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Plus
} from 'lucide-react';

interface DashboardProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  onNavigate: (tab: any) => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  doctors,
  appointments,
  onNavigate,
  onOpenNewPatient,
  onOpenNewAppointment,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const activePatientsCount = patients.filter((p) => p.status === 'active').length;
  const availableDoctorsCount = doctors.filter((d) => d.status === 'active').length;
  const completedTodayCount = todayAppointments.filter((a) => a.status === 'Completed').length;

  const stats = [
    {
      title: 'Total Patients Registered',
      value: activePatientsCount,
      change: '+12% this month',
      icon: <Users className="w-5 h-5 text-medblue-600" />,
      bg: 'bg-medblue-50',
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      change: `${todayAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'Checked In').length} pending`,
      icon: <Calendar className="w-5 h-5 text-tealbrand-600" />,
      bg: 'bg-tealbrand-50',
    },
    {
      title: 'Available Doctors',
      value: availableDoctorsCount,
      change: 'Active on duty',
      icon: <UserCheck className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      title: 'Completed Consultations',
      value: completedTodayCount,
      change: 'Today',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-medblue-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-tealbrand-500/20 text-tealbrand-300 text-xs px-2.5 py-0.5 rounded-full border border-tealbrand-500/30 font-medium">
              System Online
            </span>
            <span className="text-xs text-slate-300">| {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Clinical Dashboard & Operations</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time operational metrics, scheduled patient visits, and quick clinical actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            size="sm"
            onClick={onOpenNewPatient}
            icon={<Plus className="w-4 h-4" />}
          >
            New Patient
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenNewAppointment}
            icon={<Calendar className="w-4 h-4" />}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold text-navy-900 mt-1">{stat.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3 text-emerald-500" /> {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Today's Appointments & Recent Registered Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments List (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Today's Scheduled Appointments"
            subtitle={`Showing ${todayAppointments.length} appointments scheduled for today`}
            action={
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-medblue-600 hover:text-medblue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            {todayAppointments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No appointments scheduled for today.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-medblue-50 text-medblue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {apt.time}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy-900">{apt.patientName}</h4>
                        <p className="text-xs text-slate-500">
                          {apt.doctorName} • <span className="text-slate-400">{apt.departmentName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          apt.status === 'Checked In'
                            ? 'teal'
                            : apt.status === 'Completed'
                            ? 'success'
                            : apt.status === 'Confirmed'
                            ? 'info'
                            : 'warning'
                        }
                        dot
                      >
                        {apt.status}
                      </Badge>
                      <button
                        onClick={() => onNavigate('opd')}
                        className="text-xs text-medblue-600 font-semibold hover:underline"
                      >
                        Consult
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Patients (1 Column) */}
        <div>
          <Card
            title="Recent Patients"
            subtitle="Latest registered clinical profiles"
            action={
              <button
                onClick={() => onNavigate('patients')}
                className="text-xs font-semibold text-medblue-600 hover:text-medblue-700 flex items-center gap-1"
              >
                Patients <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-3">
              {patients.slice(0, 5).map((pt) => (
                <div key={pt.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-bold">
                      {pt.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy-900">{pt.fullName}</p>
                      <p className="text-[10px] text-slate-500">{pt.id} • {pt.bloodGroup}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{pt.gender}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
