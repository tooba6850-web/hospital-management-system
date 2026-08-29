import React, { useState } from 'react';
import type { Invoice, InvoiceItem, PaymentRecord, PaymentMethod, Patient, Doctor, Appointment, IPDAdmission, Prescription, LabOrder, Medicine, HospitalSettings } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Plus,
  Trash2,
  Printer,
  Search,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface BillingManagerProps {
  invoices: Invoice[];
  payments: PaymentRecord[];
  patients: Patient[];
  doctors?: Doctor[];
  appointments?: Appointment[];
  admissions?: IPDAdmission[];
  prescriptions?: Prescription[];
  labOrders?: LabOrder[];
  medicines?: Medicine[];
  settings?: HospitalSettings;
  onSaveInvoice: (invData: any) => Invoice;
  onRecordPayment: (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => { success: boolean; error?: string };
}

export const BillingManager: React.FC<BillingManagerProps> = ({
  invoices,
  payments,
  patients,
  doctors: _doctors,
  appointments: _appointments,
  admissions: _admissions,
  prescriptions: _prescriptions,
  labOrders: _labOrders,
  medicines: _medicines,
  settings: _settings,
  onSaveInvoice,
  onRecordPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [printableInvoice, setPrintableInvoice] = useState<Invoice | null>(null);

  // Form State — Create Invoice
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([
    { serviceCategory: 'Consultation', description: 'Specialist Medical Consultation Fee', quantity: 1, unitPrice: 150 },
  ]);

  // Form State — Record Payment
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Card');
  const [payNotes, setPayNotes] = useState('Counter Payment Settlement');
  const [paymentError, setPaymentError] = useState('');

  const addLineItem = () => {
    setItems([...items, { serviceCategory: 'Other', description: '', quantity: 1, unitPrice: 50 }]);
  };

  const removeLineItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const openNewInvoiceModal = () => {
    setPatientId(patients[0]?.id || '');
    setDiscount(0);
    setTaxRate(5);
    setNotes('');
    setItems([{ serviceCategory: 'Consultation', description: 'Specialist Medical Consultation Fee', quantity: 1, unitPrice: 150 }]);
    setIsInvoiceModalOpen(true);
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    onSaveInvoice({
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      items: items.filter((i) => i.description.trim()),
      discount: Number(discount),
      taxRate: Number(taxRate),
      notes,
    });

    setIsInvoiceModalOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    if (!selectedInvoiceForPayment) return;

    const res = onRecordPayment(
      selectedInvoiceForPayment.id,
      Number(payAmount),
      payMethod,
      payNotes
    );

    if (res.success) {
      setIsPaymentModalOpen(false);
    } else {
      setPaymentError(res.error || 'Failed to record payment transaction.');
    }
  };

  const handlePrint = (inv: Invoice) => {
    setPrintableInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Financial Dashboard calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRevenue = payments
    .filter((p) => p.paymentDate === todayStr)
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmountTotal = invoices.reduce((sum, i) => sum + i.balanceAmount, 0);
  const paidInvoicesCount = invoices.filter((i) => i.paymentStatus === 'Paid').length;
  const partialInvoicesCount = invoices.filter((i) => i.paymentStatus === 'Partially Paid').length;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Billing, Invoices & Financial Settlement</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Backend-calculated financials, subtotal & tax recalculation, split/partial payments, and printable A4 invoices.
          </p>
        </div>
        <Button variant="teal" onClick={openNewInvoiceModal} icon={<Plus className="w-4 h-4" />}>
          Create New Invoice
        </Button>
      </div>

      {/* Financial Dashboard Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">${todayRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/60 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Receivables</p>
              <h3 className="text-2xl font-bold text-amber-900 mt-0.5">${pendingAmountTotal.toFixed(2)}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-medblue-50/60 border border-medblue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-medblue-700 uppercase tracking-wider">Settled Invoices</p>
              <h3 className="text-2xl font-bold text-medblue-900 mt-0.5">{paidInvoicesCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-medblue-100 text-medblue-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-purple-50/60 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Partial Payments</p>
              <h3 className="text-2xl font-bold text-purple-900 mt-0.5">{partialInvoicesCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
        </Card>
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
              placeholder="Search by Invoice ID, Patient Name, or Phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-tealbrand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card headerBorder={false} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4">Paid Amount</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No invoice records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-medblue-600">{inv.id}</td>
                    <td className="py-3 px-4 font-semibold text-navy-900">
                      <div>{inv.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-900 font-mono">${inv.grandTotal.toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 font-mono">${inv.paidAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold text-rose-600 font-mono">${inv.balanceAmount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          inv.paymentStatus === 'Paid'
                            ? 'success'
                            : inv.paymentStatus === 'Partially Paid'
                            ? 'warning'
                            : 'danger'
                        }
                        dot
                      >
                        {inv.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {inv.balanceAmount > 0 && (
                        <Button
                          variant="teal"
                          size="sm"
                          onClick={() => {
                            setSelectedInvoiceForPayment(inv);
                            setPayAmount(inv.balanceAmount);
                            setPayMethod('Card');
                            setPayNotes('Counter Payment');
                            setPaymentError('');
                            setIsPaymentModalOpen(true);
                          }}
                        >
                          Record Payment
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Printer className="w-3.5 h-3.5" />}
                        onClick={() => handlePrint(inv)}
                      >
                        Print Invoice
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Invoice Modal */}
      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title="Generate Clinical Billing Invoice" maxWidth="4xl">
        <form onSubmit={handleInvoiceSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id}) — {p.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Billable Services & Line Items</h4>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Service Line
              </Button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 items-end">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={item.serviceCategory}
                    onChange={(e) => updateLineItem(idx, 'serviceCategory', e.target.value)}
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs bg-white"
                  >
                    {['Consultation', 'Laboratory', 'Pharmacy', 'Room', 'Admission', 'Procedures', 'Other'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Input label="Description" value={item.description} onChange={(e) => updateLineItem(idx, 'description', e.target.value)} placeholder="e.g. OPD Specialist Fee" />
                </div>
                <Input label="Qty" type="number" min={1} value={item.quantity} onChange={(e) => updateLineItem(idx, 'quantity', Number(e.target.value))} />
                <Input label="Price ($)" type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateLineItem(idx, 'unitPrice', Number(e.target.value))} />
                <div className="flex items-center gap-2 pb-1">
                  <span className="font-bold text-xs text-navy-900 font-mono">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeLineItem(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <Input label="Discount Amount ($)" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            <Input label="Tax Rate (%)" type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
          </div>

          <Input label="Invoice Notes / Terms" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment due upon receipt." />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Generate & Validate Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      {selectedInvoiceForPayment && (
        <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={`Record Payment — ${selectedInvoiceForPayment.id}`} maxWidth="md">
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {paymentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {paymentError}
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Patient:</span> <strong>{selectedInvoiceForPayment.patientName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Invoice Grand Total:</span> <strong className="font-mono">${selectedInvoiceForPayment.grandTotal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Already Paid:</span> <strong className="font-mono text-emerald-600">${selectedInvoiceForPayment.paidAmount.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-1 text-navy-900">
                <span>Remaining Balance Due:</span> <span className="font-mono text-rose-600">${selectedInvoiceForPayment.balanceAmount.toFixed(2)}</span>
              </div>
            </div>

            <Input label="Payment Amount ($)" type="number" step="0.01" max={selectedInvoiceForPayment.balanceAmount} value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))} required />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-semibold"
              >
                {['Cash', 'Card', 'Bank Transfer', 'Insurance', 'Other'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Transaction Notes" value={payNotes} onChange={(e) => setPayNotes(e.target.value)} />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Execute Settlement
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Hidden Printable A4 Invoice Layout */}
      {printableInvoice && (
        <div className="fixed -left-[9999px] top-0 print:left-0 print:top-0 print:w-full print:bg-white print:p-10 text-slate-900 font-sans print:block">
          <div className="border-b-2 border-navy-900 pb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">AURA HEALTH CLINIC</h1>
              <p className="text-xs text-slate-600">Enterprise Medical Center • Tax ID: TX-99201-992</p>
            </div>
            <div className="text-right text-xs">
              <h2 className="text-lg font-bold text-navy-900">INVOICE</h2>
              <p className="font-mono font-bold text-medblue-700">{printableInvoice.id}</p>
              <p>Date: {printableInvoice.date}</p>
            </div>
          </div>

          <div className="my-6 grid grid-cols-2 text-xs border-b border-slate-200 pb-4">
            <div>
              <p className="font-bold text-slate-500 uppercase text-[10px]">Billed To:</p>
              <p className="text-sm font-bold text-navy-900">{printableInvoice.patientName}</p>
              <p>Patient ID: {printableInvoice.patientId}</p>
              <p>Phone: {printableInvoice.patientPhone}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-500 uppercase text-[10px]">Payment Status:</p>
              <p className="text-sm font-bold text-emerald-700 uppercase">{printableInvoice.paymentStatus}</p>
              <p>Method: {printableInvoice.paymentMethod || 'N/A'}</p>
            </div>
          </div>

          <table className="w-full text-xs text-left border-collapse my-6">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="py-2.5 px-3">Service Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {printableInvoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="py-2.5 px-3 font-semibold">{item.serviceCategory}</td>
                  <td className="py-2.5 px-3">{item.description}</td>
                  <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end text-xs my-6">
            <div className="w-64 space-y-1.5 border-t border-slate-300 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">${printableInvoice.subtotal.toFixed(2)}</span>
              </div>
              {printableInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">-${printableInvoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax ({printableInvoice.taxRate}%):</span>
                <span className="font-mono">${printableInvoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-navy-900 border-t border-slate-300 pt-1">
                <span>Grand Total:</span>
                <span className="font-mono">${printableInvoice.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Paid Amount:</span>
                <span className="font-mono">${printableInvoice.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-700 border-t border-slate-200 pt-1">
                <span>Balance Due:</span>
                <span className="font-mono">${printableInvoice.balanceAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
            <p>Cashier Signature: ______________________</p>
            <p>Aura Health Official Cashier Stamp</p>
          </div>
        </div>
      )}
    </div>
  );
};
