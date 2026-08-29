import React, { useState } from 'react';
import { Bell, Check, X, Calendar, FlaskConical, Pill, Bed, CreditCard, ShieldAlert } from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id?: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'appointment' | 'lab' | 'pharmacy' | 'billing' | 'system'>('all');

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'appointment', label: 'Appointments' },
    { key: 'lab', label: 'Laboratory' },
    { key: 'pharmacy', label: 'Pharmacy' },
    { key: 'billing', label: 'Billing' },
    { key: 'system', label: 'System' },
  ] as const;

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.category?.toLowerCase().includes(activeTab);
  });

  const getIcon = (category?: string) => {
    const c = category?.toLowerCase() || '';
    if (c.includes('appointment')) return <Calendar className="w-4 h-4 text-medblue-500" />;
    if (c.includes('lab')) return <FlaskConical className="w-4 h-4 text-purple-500" />;
    if (c.includes('pharmacy')) return <Pill className="w-4 h-4 text-emerald-500" />;
    if (c.includes('billing')) return <CreditCard className="w-4 h-4 text-amber-500" />;
    return <ShieldAlert className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-modal-in z-10">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-medblue-50 text-medblue-600 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-900">Notification Center</h3>
              <p className="text-[11px] text-slate-500">{notifications.filter(n => !n.read).length} unread updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMarkAsRead()}
              className="text-xs text-medblue-600 hover:text-medblue-800 font-medium px-2 py-1 hover:bg-medblue-50 rounded"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/60 border-b border-slate-200 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === cat.key ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No notifications under this category.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3 rounded-lg flex items-start gap-3 transition-colors cursor-pointer ${
                  item.read ? 'bg-white hover:bg-slate-50' : 'bg-medblue-50/40 hover:bg-medblue-50/70 border-l-2 border-medblue-500'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(item.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-navy-900">{item.title}</h4>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
