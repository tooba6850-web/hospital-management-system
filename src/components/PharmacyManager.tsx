import React, { useState } from 'react';
import type { Medicine, StockLog, Prescription } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  Pill,
  Plus,
  Search,
  AlertTriangle,
  TrendingDown,
  Clock,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PharmacyManagerProps {
  medicines: Medicine[];
  stockLogs: StockLog[];
  prescriptions?: Prescription[];
  onSaveMedicine: (med: any) => void;
  onAdjustStock: (medicineId: string, type: 'Stock In' | 'Stock Out', qty: number, reason: string) => { success: boolean; error?: string };
}

export const PharmacyManager: React.FC<PharmacyManagerProps> = ({
  medicines,
  stockLogs,
  prescriptions: _prescriptions,
  onSaveMedicine,
  onAdjustStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedMedForStock, setSelectedMedForStock] = useState<Medicine | null>(null);

  // Form State — Medicine
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('General');
  const [manufacturer, setManufacturer] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [purchasePrice, setPurchasePrice] = useState(1.0);
  const [sellingPrice, setSellingPrice] = useState(2.5);
  const [stockQuantity, setStockQuantity] = useState(100);
  const [minimumStockLevel, setMinimumStockLevel] = useState(20);

  // Form State — Stock Adjust
  const [stockType, setStockType] = useState<'Stock In' | 'Stock Out'>('Stock In');
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustReason, setAdjustReason] = useState('Restock Shipment');
  const [stockError, setStockError] = useState('');

  const openNewMedModal = () => {
    setEditingMed(null);
    setName('');
    setGenericName('');
    setCategory('General');
    setManufacturer('');
    setBatchNumber(`BATCH-2026-${Math.floor(10 + Math.random() * 90)}`);
    setExpiryDate('2027-12-31');
    setPurchasePrice(1.0);
    setSellingPrice(2.5);
    setStockQuantity(100);
    setMinimumStockLevel(20);
    setIsMedModalOpen(true);
  };

  const handleSaveMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMedicine({
      id: editingMed ? editingMed.id : undefined,
      name,
      genericName,
      category,
      manufacturer,
      batchNumber,
      expiryDate,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity),
      minimumStockLevel: Number(minimumStockLevel),
    });
    setIsMedModalOpen(false);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStockError('');
    if (!selectedMedForStock) return;

    const res = onAdjustStock(selectedMedForStock.id, stockType, Number(adjustQty), adjustReason);
    if (res.success) {
      setIsStockModalOpen(false);
    } else {
      setStockError(res.error || 'Failed to adjust stock.');
    }
  };

  // Dashboard Stats
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock').length;
  const outOfStockCount = medicines.filter((m) => m.status === 'Out of Stock').length;
  const expiredCount = medicines.filter((m) => m.status === 'Expired').length;

  const categories = Array.from(new Set(medicines.map((m) => m.category)));

  const filteredMeds = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Pharmacy & Inventory Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage drug catalog, batch numbers, stock-in/stock-out logs, and automated non-negative inventory control.
          </p>
        </div>
        <Button variant="teal" onClick={openNewMedModal} icon={<Plus className="w-4 h-4" />}>
          Add New Medicine
        </Button>
      </div>

      {/* Pharmacy Dashboard Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-0.5">{totalMedicines}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-medblue-50 text-medblue-700">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-amber-50/60 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{lowStockCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-rose-50/60 border border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Out of Stock</p>
              <h3 className="text-2xl font-bold text-rose-900 mt-0.5">{outOfStockCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-purple-50/60 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Expired Products</p>
              <h3 className="text-2xl font-bold text-purple-900 mt-0.5">{expiredCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Clock className="w-5 h-5" />
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
              placeholder="Search by Medicine Name, Generic Name, or ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-tealbrand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Main Grid: Medicine Catalog Table + Recent Stock Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Table (2 Cols) */}
        <div className="lg:col-span-2">
          <Card headerBorder={false} className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Medicine Info</th>
                    <th className="py-3.5 px-4">Batch & Expiry</th>
                    <th className="py-3.5 px-4">Stock Level</th>
                    <th className="py-3.5 px-4">Selling Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredMeds.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No medicines matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMeds.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-navy-900">{med.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {med.id} • {med.genericName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div>{med.batchNumber}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{med.expiryDate}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {med.stockQuantity} Units
                          <span className="text-[10px] text-slate-400 block font-normal">Min: {med.minimumStockLevel}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-tealbrand-700">
                          ${med.sellingPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              med.status === 'In Stock'
                                ? 'success'
                                : med.status === 'Low Stock'
                                ? 'warning'
                                : med.status === 'Out of Stock'
                                ? 'danger'
                                : 'secondary'
                            }
                            dot
                          >
                            {med.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedMedForStock(med);
                              setAdjustQty(10);
                              setStockType('Stock In');
                              setAdjustReason('Restock Order');
                              setStockError('');
                              setIsStockModalOpen(true);
                            }}
                          >
                            Stock Adjust
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Stock Activity Log Panel (1 Col) */}
        <div>
          <Card title="Recent Stock Movements" subtitle="Audit trail of additions & deductions">
            <div className="space-y-3">
              {stockLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        log.type === 'Stock In' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {log.type === 'Stock In' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 truncate max-w-[140px]">{log.medicineName}</p>
                      <p className="text-[10px] text-slate-400">{log.reason}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold">
                    <span className={log.type === 'Stock In' ? 'text-emerald-600' : 'text-rose-600'}>
                      {log.type === 'Stock In' ? `+${log.quantity}` : `-${log.quantity}`}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-normal">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      <Modal isOpen={isMedModalOpen} onClose={() => setIsMedModalOpen(false)} title="Register Pharmaceutical Product" maxWidth="2xl">
        <form onSubmit={handleSaveMedSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Trade Medicine Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Amlodipine 5mg" />
            <Input label="Generic Name" value={genericName} onChange={(e) => setGenericName(e.target.value)} required placeholder="e.g. Amlodipine Besylate" />
            <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. Cardiovascular" />
            <Input label="Manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required placeholder="e.g. Pfizer" />
            <Input label="Batch Number" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} required />
            <Input label="Expiry Date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            <Input label="Purchase Price ($)" type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} required />
            <Input label="Selling Price ($)" type="number" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} required />
            <Input label="Initial Stock Quantity" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} required />
            <Input label="Low Stock Warning Threshold" type="number" value={minimumStockLevel} onChange={(e) => setMinimumStockLevel(Number(e.target.value))} required />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsMedModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Save Medicine
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjust Modal */}
      {selectedMedForStock && (
        <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title={`Adjust Inventory — ${selectedMedForStock.name}`} maxWidth="md">
          <form onSubmit={handleStockSubmit} className="space-y-4">
            {stockError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {stockError}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg text-xs flex justify-between">
              <span>Current Available Stock:</span>
              <strong className="text-navy-900 font-mono">{selectedMedForStock.stockQuantity} Units</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Adjustment Movement Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStockType('Stock In')}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    stockType === 'Stock In' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Stock In (Add)
                </button>
                <button
                  type="button"
                  onClick={() => setStockType('Stock Out')}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    stockType === 'Stock Out' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Stock Out (Deduct)
                </button>
              </div>
            </div>

            <Input label="Quantity Units" type="number" min={1} value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} required />
            <Input label="Reason / Notes" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} required placeholder="e.g. Received shipment, Dispensed to ward" />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsStockModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="teal" type="submit">
                Execute Stock Movement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
