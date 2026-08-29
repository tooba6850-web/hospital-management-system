import React, { useState } from 'react';
import type { LabTest, LabOrder, Patient, Doctor } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  FileCheck,
  TestTube,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface LaboratoryManagerProps {
  labTests: LabTest[];
  labOrders: LabOrder[];
  patients: Patient[];
  doctors: Doctor[];
  onCreateLabOrder: (order: any) => void;
  onUpdateLabOrderStatus: (id: string, status: LabOrder['status'], payload?: any) => void;
}

export const LaboratoryManager: React.FC<LaboratoryManagerProps> = ({
  labTests,
  labOrders,
  patients,
  doctors,
  onCreateLabOrder,
  onUpdateLabOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedOrderForEntry, setSelectedOrderForEntry] = useState<LabOrder | null>(null);
  const [printableReport, setPrintableReport] = useState<LabOrder | null>(null);

  // Form State — Lab Order
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [testId, setTestId] = useState(labTests[0]?.id || '');

  // Form State — Result Entry
  const [resultValue, setResultValue] = useState('');
  const [technicianName, setTechnicianName] = useState('Marcus Vance');
  const [labNotes, setLabNotes] = useState('');

  const openNewOrderModal = () => {
    setPatientId(patients[0]?.id || '');
    setDoctorId(doctors[0]?.id || '');
    setTestId(labTests[0]?.id || '');
    setIsOrderModalOpen(true);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);
    const test = labTests.find((t) => t.id === testId);

    if (!patient || !doctor || !test) return;

    onCreateLabOrder({
      patientId: patient.id,
      patientName: patient.fullName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      testId: test.id,
      testName: test.name,
      price: test.price,
      referenceRange: test.referenceRange,
    });

    setIsOrderModalOpen(false);
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderForEntry) {
      onUpdateLabOrderStatus(selectedOrderForEntry.id, 'Completed', {
        resultValue,
        technicianName,
        notes: labNotes,
      });
      setIsResultModalOpen(false);
    }
  };

  const handlePrint = (order: LabOrder) => {
    setPrintableReport(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredOrders = labOrders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Clinical Diagnostic Laboratory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lab order workflow: Request → Sample Collection → Processing → Result Entry → Verification → Printable Report.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Lab Orders Queue
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'catalog' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Test Catalog
            </button>
          </div>
          <Button variant="teal" onClick={openNewOrderModal} icon={<Plus className="w-4 h-4" />}>
            Order Lab Test
          </Button>
        </div>
      </div>

      {activeTab === 'orders' ? (
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
                  placeholder="Search by Order ID, Patient Name, or Test Title..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-tealbrand-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
              >
                <option value="All">All Workflow Statuses</option>
                {['Requested', 'Sample Collected', 'Processing', 'Completed', 'Verified'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Orders Data Table */}
          <Card headerBorder={false} className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Test Name</th>
                    <th className="py-3.5 px-4">Ordering Doctor</th>
                    <th className="py-3.5 px-4">Order Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Lab Workflow Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No lab orders matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-tealbrand-700">{ord.id}</td>
                        <td className="py-3 px-4 font-semibold text-navy-900">{ord.patientName}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {ord.testName}
                          <span className="text-[10px] text-slate-400 block font-mono">${ord.price}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{ord.doctorName}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{ord.orderDate}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              ord.status === 'Verified'
                                ? 'success'
                                : ord.status === 'Completed'
                                ? 'teal'
                                : ord.status === 'Processing'
                                ? 'warning'
                                : 'secondary'
                            }
                            dot
                          >
                            {ord.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          {ord.status === 'Requested' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<TestTube className="w-3.5 h-3.5" />}
                              onClick={() =>
                                onUpdateLabOrderStatus(ord.id, 'Sample Collected', {
                                  sampleCollectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                })
                              }
                            >
                              Collect Sample
                            </Button>
                          )}

                          {ord.status === 'Sample Collected' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateLabOrderStatus(ord.id, 'Processing')}
                            >
                              Start Processing
                            </Button>
                          )}

                          {ord.status === 'Processing' && (
                            <Button
                              variant="teal"
                              size="sm"
                              onClick={() => {
                                setSelectedOrderForEntry(ord);
                                setResultValue(ord.testName.includes('Lipid') ? 'Total Chol: 190 mg/dL, HDL: 48 mg/dL' : 'WBC: 6.8 k/uL, RBC: 4.8 M/uL');
                                setIsResultModalOpen(true);
                              }}
                            >
                              Enter Result
                            </Button>
                          )}

                          {ord.status === 'Completed' && (
                            <Button
                              variant="teal"
                              size="sm"
                              icon={<ShieldCheck className="w-3.5 h-3.5" />}
                              onClick={() => onUpdateLabOrderStatus(ord.id, 'Verified')}
                            >
                              Verify Report
                            </Button>
                          )}

                          {ord.status === 'Verified' && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Printer className="w-3.5 h-3.5" />}
                              onClick={() => handlePrint(ord)}
                            >
                              Print A4 Report
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
        </>
      ) : (
        /* Test Catalog Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labTests.map((t) => (
            <Card key={t.id} className="hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-navy-900">{t.name}</h3>
                  <span className="text-[10px] text-tealbrand-700 font-semibold">{t.category}</span>
                </div>
                <Badge variant="teal" size="sm">${t.price}</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{t.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Reference Range:</strong> {t.referenceRange}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Lab Order Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Request Diagnostic Lab Test">
        <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Ordering Physician</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Diagnostic Test Panel</label>
            <select
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-bold"
            >
              {labTests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — ${t.price} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Submit Lab Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* Enter Result Modal */}
      {selectedOrderForEntry && (
        <Modal isOpen={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} title={`Enter Test Result — ${selectedOrderForEntry.testName}`}>
          <form onSubmit={handleResultSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <p><strong>Patient:</strong> {selectedOrderForEntry.patientName}</p>
              <p><strong>Reference Range:</strong> {selectedOrderForEntry.referenceRange}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Observed Test Result</label>
              <textarea
                rows={3}
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-tealbrand-500 font-mono"
                placeholder="Enter quantitative or qualitative lab values..."
              />
            </div>

            <Input label="Technician Name" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} required />
            <Input label="Technical Notes (Optional)" value={labNotes} onChange={(e) => setLabNotes(e.target.value)} placeholder="Specimen non-hemolyzed." />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsResultModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Complete Result Entry
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Hidden Printable A4 Lab Report */}
      {printableReport && (
        <div className="fixed -left-[9999px] top-0 print:left-0 print:top-0 print:w-full print:bg-white print:p-10 text-slate-900 font-sans print:block">
          <div className="border-b-2 border-navy-900 pb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">AURA HEALTH CENTRAL LABORATORY</h1>
              <p className="text-xs text-slate-600">CAP & CLIA Accredited Diagnostic Center • Phone: +1 (555) 019-9944</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-navy-900">{printableReport.id}</p>
              <p>Report Date: {printableReport.verifiedAt || printableReport.orderDate}</p>
            </div>
          </div>

          <div className="my-6 grid grid-cols-2 text-xs border-b border-slate-200 pb-4 gap-4">
            <div>
              <p><strong>Patient Name:</strong> {printableReport.patientName}</p>
              <p><strong>Patient ID:</strong> {printableReport.patientId}</p>
            </div>
            <div>
              <p><strong>Ordering Physician:</strong> {printableReport.doctorName}</p>
              <p><strong>Sample Collected:</strong> {printableReport.sampleCollectedAt || '09:00 AM'}</p>
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-3 border-b pb-1">
              Test Name: {printableReport.testName}
            </h3>

            <table className="w-full text-xs text-left border-collapse my-4">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="py-2.5 px-3">Parameter / Test</th>
                  <th className="py-2.5 px-3">Observed Result</th>
                  <th className="py-2.5 px-3">Reference Interval</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-3 font-semibold">{printableReport.testName}</td>
                  <td className="py-3 px-3 font-bold font-mono text-navy-900">{printableReport.resultValue}</td>
                  <td className="py-3 px-3 text-slate-600">{printableReport.referenceRange}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">VERIFIED</td>
                </tr>
              </tbody>
            </table>
          </div>

          {printableReport.notes && (
            <div className="my-4 text-xs italic bg-slate-50 p-3 rounded border">
              <strong>Pathologist Remarks:</strong> {printableReport.notes}
            </div>
          )}

          <div className="mt-20 pt-4 border-t border-slate-300 flex justify-between text-xs">
            <div>
              <p><strong>Lab Technician:</strong> {printableReport.technicianName || 'Marcus Vance'}</p>
            </div>
            <div className="text-right">
              <p><strong>Verified By:</strong> {printableReport.verifiedBy || 'Dr. Arthur Pendelton'}</p>
              <p className="text-[10px] text-slate-500">Board Certified Clinical Pathologist</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
