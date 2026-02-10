
import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  InventoryItem, Zone, Transaction, User, CartItem, Category, StockBatch 
} from './types';
import { 
  INITIAL_INVENTORY, MOCK_USERS, ZONES, DEPARTMENTS, COLORS 
} from './constants';
import { 
  LayoutDashboard, Package, History, ShoppingCart, 
  Search, Cloud, X, CheckCircle2, PackagePlus, Sparkles,
  Building, Hash, Settings, TrendingDown, 
  PlusCircle, Inbox, Users, Check, RotateCcw,
  ArrowRight, Calendar, Tag, Layers, Trash2, Edit2, ShieldCheck, Briefcase, AlertTriangle, MapPin, DollarSign, ClipboardList, Printer, Eye, Info, Key, ChevronRight, Minus, Plus, ArrowRightLeft, Globe, Download, FileJson, FileSpreadsheet, Database, AlertCircle, Clock
} from 'lucide-react';
import { StatCard } from './components/StatCard';
import { ItemCard } from './components/ItemCard';
import { SignaturePad } from './components/SignaturePad';

const HOTEL_BG_URL = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2000"; 
const BRAND_YELLOW = "#FFD700"; 

const GLOBAL_ZONE_KEY = 'All Zones';

const BrandLogo = ({ 
  className = "", 
  color = BRAND_YELLOW, 
  scale = "text-5xl", 
  subScale = "text-[10px]",
  subClassName = ""
}: { 
  className?: string, 
  color?: string, 
  scale?: string, 
  subScale?: string,
  subClassName?: string
}) => (
  <div className={`flex flex-col items-center select-none ${className}`}>
    <span className={`${scale} brand-script leading-[0.7]`} style={{ color }}>Sunlight</span>
    <span className={`${subScale} brand-title uppercase tracking-[0.4em] mt-2 ${subClassName}`} style={{ color: color === BRAND_YELLOW ? 'rgba(218,165,32,0.9)' : '#4b5563' }}>Hotel, Coron</span>
  </div>
);

const ReceiptContent = React.forwardRef<HTMLDivElement, { 
  lastTxId: string | null, 
  receiverName: string, 
  receiverDept: string, 
  currentUser: User | null, 
  cart: CartItem[], 
  signature: string | null 
}>(({ lastTxId, receiverName, receiverDept, currentUser, cart, signature }, ref) => {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div ref={ref} className="w-[800px] p-12 bg-white text-gray-900 border-8 border-[#800000]/10">
      <div className="mb-10">
        <BrandLogo 
          color={BRAND_YELLOW} 
          scale="text-9xl" 
          subScale="text-sm" 
          className="items-start" 
          subClassName="ml-24" 
        />
      </div>

      <div className="flex justify-between items-end border-b-4 border-[#800000] pb-6 mb-10">
        <div className="space-y-1">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Warehouse Release Receipt</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {lastTxId || 'TX-089GJLT'}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#800000]">Issue Date</p>
          <p className="text-sm font-black text-[#800000] uppercase">{dateStr}</p>
          <p className="text-xs font-bold text-[#800000]">{timeStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-6">Recipient Information</h4>
          <p className="text-4xl font-black text-[#800000] capitalize leading-none">{receiverName || 'Jeff'}</p>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest mt-2">{receiverDept}</p>
        </div>
        <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-6">Releaser Information</h4>
          <p className="text-4xl font-black text-[#800000] leading-none">{currentUser?.name || 'Admin User'}</p>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest mt-2">Sunlight Warehouse Team</p>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 text-left text-[9px] font-black uppercase text-gray-400 tracking-widest">Sku</th>
            <th className="py-4 text-left text-[9px] font-black uppercase text-gray-400 tracking-widest">Item Description</th>
            <th className="py-4 text-right text-[9px] font-black uppercase text-gray-400 tracking-widest">Quantity</th>
            <th className="py-4 text-right text-[9px] font-black uppercase text-gray-400 tracking-widest">Unit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {cart.map((item, idx) => (
            <tr key={idx}>
              <td className="py-6 text-xs font-bold text-gray-400 tabular-nums">{item.sku}</td>
              <td className="py-6 text-sm font-black text-gray-800">{item.name}</td>
              <td className="py-6 text-right text-sm font-black text-[#800000] tabular-nums">{item.quantity}</td>
              <td className="py-6 text-right text-[10px] font-black uppercase text-gray-400">{item.uom}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-12">
        <div className="text-center">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">Electronic Acknowledgement</h4>
          {signature ? (
            <img src={signature} alt="Signature" className="h-20 mx-auto mb-2" />
          ) : (
            <div className="h-20 w-48 mx-auto border-b border-gray-200" />
          )}
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">Sunlight Guest Hotel Coron • Warehouse Management System</p>
      </div>
    </div>
  );
});

const generateBatchId = () => `BAT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const getStored = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem('sunlight_storage_' + key);
    if (saved === null) return fallback;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => getStored('users', MOCK_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUsers = getStored('users', MOCK_USERS);
    return storedUsers.length > 0 ? storedUsers[0] : null;
  });
  
  const [adminPassword, setAdminPassword] = useState<string>(() => localStorage.getItem('sunlight_admin_pw') || '1234');
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [passwordError, setPasswordError] = useState(false);
  
  const [view, setView] = useState<'dashboard' | 'inventory' | 'history' | 'settings'>('dashboard');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isExitingSplash, setIsExitingSplash] = useState(false);
  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  
  const [availableZones, setAvailableZones] = useState<string[]>(() => getStored('zones', ZONES));
  const [selectedZone, setSelectedZone] = useState<string>(GLOBAL_ZONE_KEY);
  
  const isInitialized = localStorage.getItem('sunlight_initialized') === 'true';

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyDeptFilter, setHistoryDeptFilter] = useState('All Departments');
  const [showAddSuccess, setShowAddSuccess] = useState<string | null>(null);

  const [availableCategories, setAvailableCategories] = useState<string[]>(() => getStored('categories', Object.values(Category)));
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(() => getStored('departments', DEPARTMENTS));

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isTransferringStock, setIsTransferringStock] = useState(false);
  const [currentAutoBatchId, setCurrentAutoBatchId] = useState(generateBatchId());
  const [newItemData, setNewItemData] = useState<Partial<InventoryItem & { receivedQty: number; restockZone: string }>>({
    name: '',
    category: availableCategories[0],
    uom: '',
    unitCost: 0,
    parStock: 0,
    earliestExpiry: new Date().toISOString().split('T')[0],
    receivedQty: 0,
    restockZone: availableZones[0]
  });

  const [transferBatch, setTransferBatch] = useState<Array<{
    itemId: string;
    itemName: string;
    sku: string;
    uom: string;
    quantity: number;
  }>>([]);
  const [transferSource, setTransferSource] = useState(availableZones[0]);
  const [transferDest, setTransferDest] = useState(availableZones[1] || availableZones[0]);
  const [tempTransferItem, setTempTransferItem] = useState({
    itemId: '',
    itemName: '',
    quantity: 0
  });

  const [isEditingInventoryItem, setIsEditingInventoryItem] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [manageTarget, setManageTarget] = useState<'users' | 'categories' | 'departments' | 'zones' | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [manageInput, setManageInput] = useState('');
  const [manageRole, setManageRole] = useState<'Staff' | 'Manager'>('Staff');
  
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [nameSuggestions, setNameSuggestions] = useState<InventoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverDept, setReceiverDept] = useState(availableDepartments[0] || 'Kitchen');
  const [signature, setSignature] = useState<string | null>(null);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');


// Update the 'type' parameter to allow 'full_sync'
const syncToCloud = async (newData: any, type: 'inventory' | 'transactions' | 'full_sync') => {
  setSyncStatus('syncing');
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify({ type, data: newData }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error('Sync failed');
    
    setSyncStatus('success');
    setTimeout(() => setSyncStatus('idle'), 3000); // Return to idle after 3s
  } catch (e) {
    console.error("Sync failed", e);
    setSyncStatus('error');
  }
  useEffect(() => {
  // We check if inventory has items to avoid overwriting the cloud with an empty state
  if (inventory.length > 0) {
    const dataToSync = {
      inventory,
      transactions: transactions.slice(0, 50), // Send recent logs only
      users,
      categories: availableCategories,
      departments: availableDepartments,
      zones: availableZones
    };
    
    // This now sends the 'full_sync' type that your POST handler expects
    syncToCloud(dataToSync, 'full_sync');
  }
}, [inventory, transactions, users, availableCategories, availableDepartments, availableZones]); 
// Adding all these to the dependency array ensures ANY change triggers a save
};

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup
}, []);

  const handleEnterApp = () => {
    setIsExitingSplash(true);
    setTimeout(() => setIsSplashVisible(false), 800);
  };

  const notify = (msg: string) => {
    setShowAddSuccess(msg);
    setTimeout(() => setShowAddSuccess(null), 2000);
  };

  const selectUserRequest = (user: User) => {
    if (user.role === 'Manager') {
      setPendingUser(user);
      setIsPasswordPromptOpen(true);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setCurrentUser(user);
      setIsUserSelectorOpen(false);
      notify(`Profile: ${user.name}`);
    }
  };

  const handleVerifyPassword = () => {
    if (passwordInput === adminPassword) {
      if (pendingUser) {
        setCurrentUser(pendingUser);
        notify(`Profile: ${pendingUser.name}`);
      }
      setIsPasswordPromptOpen(false);
      setIsUserSelectorOpen(false);
      setPendingUser(null);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1000);
    }
  };

  const syncAggregates = (item: InventoryItem): InventoryItem => {
    const stock: Record<string, number> = {};
    availableZones.forEach(z => stock[z] = 0);
    
    let earliest = '9999-12-31';
    item.batches.forEach(b => {
      if (b.quantity > 0) {
        const zone = b.zone || availableZones[0];
        if (!stock[zone]) stock[zone] = 0;
        stock[zone] += b.quantity;
        if (b.expiry && b.expiry < earliest) earliest = b.expiry;
      }
    });
    return { 
      ...item, 
      stock, 
      earliestExpiry: earliest === '9999-12-31' ? (item.earliestExpiry || 'N/A') : earliest 
    };
  };

  const handleOpenReceive = () => {
    setCurrentAutoBatchId(generateBatchId());
    setIsAddingItem(true);
  };

  const handleOpenTransfer = () => {
    setTransferBatch([]);
    setTempTransferItem({ itemId: '', itemName: '', quantity: 0 });
    setIsTransferringStock(true);
  };

  const addToTransferBatch = () => {
    const { itemId, itemName, quantity } = tempTransferItem;
    if (!itemId || quantity <= 0) return alert("Select item and enter valid quantity");
    
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const availableInSource = item.stock[transferSource] || 0;
    const existingInBatch = transferBatch.find(x => x.itemId === itemId)?.quantity || 0;
    
    if (quantity + existingInBatch > availableInSource) {
      return alert(`Insufficient stock in ${transferSource.split(' (')[0]}. Max available: ${availableInSource}`);
    }

    setTransferBatch(prev => {
      const idx = prev.findIndex(x => x.itemId === itemId);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { itemId, itemName, sku: item.sku, uom: item.uom, quantity }];
    });

    setTempTransferItem({ itemId: '', itemName: '', quantity: 0 });
    notify("Added to transfer batch");
  };

  const handleCommitStockEntry = () => {
    if (!newItemData.name || !newItemData.uom) return alert("Name and UOM are required");
    const qty = newItemData.receivedQty || 0;
    if (qty <= 0) return alert("Please enter a valid received quantity");

    const initialBatch: StockBatch = {
      id: currentAutoBatchId,
      expiry: newItemData.earliestExpiry!,
      quantity: qty,
      zone: newItemData.restockZone || availableZones[0]
    };

    const existingIndex = inventory.findIndex(i => (i.name?.toLowerCase() || "") === (newItemData.name?.toLowerCase() || ""));
    
    if (existingIndex > -1) {
      const updatedInventory = [...inventory];
      const existingItem = updatedInventory[existingIndex];
      const newItem = syncAggregates({
        ...existingItem,
        batches: [...existingItem.batches, initialBatch],
        category: newItemData.category || availableCategories[0],
        unitCost: newItemData.unitCost || existingItem.unitCost
      });
      updatedInventory[existingIndex] = newItem;
      setInventory(updatedInventory);
    } else {
      const sku = `ITEM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const item: InventoryItem = syncAggregates({
        id: Math.random().toString(36).substr(2, 9),
        sku,
        name: newItemData.name!,
        category: newItemData.category || availableCategories[0],
        uom: newItemData.uom!,
        stock: {}, 
        batches: [initialBatch],
        earliestExpiry: newItemData.earliestExpiry!,
        unitCost: newItemData.unitCost || 0,
        parStock: newItemData.parStock || 0,
        isFastMoving: false
      });
      setInventory(prev => [item, ...prev]);
    }

    setIsAddingItem(false);
    setNewItemData({
      name: '', category: availableCategories[0], uom: '', unitCost: 0, parStock: 0,
      earliestExpiry: new Date().toISOString().split('T')[0],
      receivedQty: 0,
      restockZone: availableZones[0]
    });
    notify(`Received: ${currentAutoBatchId}`);
  };

  const handleCommitTransferBatch = () => {
    if (transferBatch.length === 0) return alert("Transfer batch is empty");
    if (transferSource === transferDest) return alert("Source and Destination must be different");

    const updatedInventory = [...inventory];
    const newTransactions: Transaction[] = [];

    for (const batchItem of transferBatch) {
      const invIndex = updatedInventory.findIndex(i => i.id === batchItem.itemId);
      if (invIndex === -1) continue;

      const item = { ...updatedInventory[invIndex] };
      let remainingToMove = batchItem.quantity;
      const sourceBatches = item.batches
        .filter(b => b.zone === transferSource && b.quantity > 0)
        .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

      const updatedItemBatches = [...item.batches];

      for (const batch of sourceBatches) {
        if (remainingToMove <= 0) break;
        
        const idxInGlobal = updatedItemBatches.findIndex(b => b.id === batch.id && b.zone === transferSource);
        const moveAmount = Math.min(batch.quantity, remainingToMove);

        // Deduct from source
        updatedItemBatches[idxInGlobal] = { ...updatedItemBatches[idxInGlobal], quantity: updatedItemBatches[idxInGlobal].quantity - moveAmount };
        
        // Add to dest
        const existingInDestIdx = updatedItemBatches.findIndex(b => b.id === batch.id && b.zone === transferDest);
        if (existingInDestIdx > -1) {
          updatedItemBatches[existingInDestIdx] = { 
            ...updatedItemBatches[existingInDestIdx], 
            quantity: updatedItemBatches[existingInDestIdx].quantity + moveAmount 
          };
        } else {
          updatedItemBatches.push({
            id: batch.id,
            expiry: batch.expiry,
            quantity: moveAmount,
            zone: transferDest
          });
        }

        remainingToMove -= moveAmount;
      }

      updatedInventory[invIndex] = syncAggregates({ ...item, batches: updatedItemBatches });

      newTransactions.push({
        id: `TRF-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        user: currentUser?.name || 'Unknown',
        action: 'TRANSFER',
        qty: batchItem.quantity,
        itemSku: batchItem.sku,
        itemName: batchItem.itemName,
        itemUom: batchItem.uom,
        sourceZone: transferSource,
        destZone: transferDest
      });
    }

    setInventory(updatedInventory);
    setTransactions(prev => [...newTransactions, ...prev]);
    setIsTransferringStock(false);
    setTransferBatch([]);
    notify(`Batch transferred: ${newTransactions.length} items`);
  };

  const handleEditRequest = (item: InventoryItem) => {
    if (currentUser?.role !== 'Manager') {
      return alert("Only Managers can edit inventory items.");
    }
    setItemToEdit({ ...item });
    setIsEditingInventoryItem(true);
    setShowDeleteConfirm(false);
  };

  const handleUpdateInventoryItem = () => {
    if (!itemToEdit) return;
    if (!itemToEdit.name || !itemToEdit.uom) return alert("Name and UOM required");
    
    const updated = inventory.map(i => i.id === itemToEdit.id ? syncAggregates(itemToEdit) : i);
    setInventory(updated);
    setIsEditingInventoryItem(false);
    setItemToEdit(null);
    notify("Item updated");
  };

  const handleDeleteInventoryItem = () => {
    if (!itemToEdit) return;
    setInventory(inventory.filter(i => i.id !== itemToEdit.id));
    setCart(cart.filter(c => c.itemId !== itemToEdit.id));
    setIsEditingInventoryItem(false);
    setItemToEdit(null);
    setShowDeleteConfirm(false);
    notify("Item deleted");
  };

  const handleExportJSON = () => {
    const backupData = {
      inventory,
      transactions,
      users,
      config: {
        availableCategories,
        availableDepartments,
        availableZones,
        adminPassword
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sunlight_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify("System backup generated");
  };

  const handleExportCSV = () => {
    const zoneHeaders = availableZones.map(z => `${z.split(' (')[0]} Stock`);
    const headers = ['SKU', 'Item Name', 'Category', 'UOM', 'Unit Cost', 'Global Stock', 'PAR Stock', ...zoneHeaders, 'Earliest Expiry'];
    
    const rows = inventory.map(item => {
      const globalStock = item.batches.reduce((sum, b) => sum + b.quantity, 0);
      const zoneStocks = availableZones.map(z => item.stock[z] || 0);
      
      return [
        item.sku,
        item.name,
        item.category,
        item.uom,
        item.unitCost,
        globalStock,
        item.parStock,
        ...zoneStocks,
        item.earliestExpiry
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    <header className="bg-[#800000] text-white px-6 shadow-lg flex justify-between items-center h-16 shrink-0 z-50">
  <BrandLogo className="scale-75 -ml-4" />
  <div className="flex items-center gap-4">
    {/* --- ADD THIS SYNC INDICATOR START --- */}
    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
      <Cloud 
        size={14} 
        className={`transition-colors ${
          syncStatus === 'syncing' ? 'text-amber-400 animate-pulse' : 
          syncStatus === 'success' ? 'text-green-400' : 
          syncStatus === 'error' ? 'text-red-400' : 'text-white/20'
        }`} 
      />
      <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">
        {syncStatus === 'syncing' ? 'Saving...' : syncStatus === 'success' ? 'Cloud Synced' : 'Offline'}
      </span>
    </div>
    {/* --- ADD THIS SYNC INDICATOR END --- */}

    <div className="flex flex-col items-end mr-2">
      <span className="text-[9px] font-black uppercase tracking-wider">{currentUser?.name}</span>
      <span className="text-[7px] opacity-60 font-bold uppercase text-[#FFD700]">{currentUser?.role}</span>
    </div>
    <button onClick={() => setIsUserSelectorOpen(true)} className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 border border-white/5 shadow-sm active:scale-90 transition-all">
      <RotateCcw size={16} />
    </button>
  </div>
</header>

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sunlight_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify("Inventory report generated");
  };

  const handleExportReleaseCSV = () => {
    const headers = ['Date', 'Time', 'SKU', 'Item Name', 'Quantity', 'Unit', 'Department', 'Receiver', 'Transaction ID'];
    
    const releaseTransactions = transactions.filter(t => t.action === 'ISSUE');
    
    const rows = releaseTransactions.map(t => {
      const d = new Date(t.timestamp);
      // Try to get UOM from the transaction or fallback to current inventory lookup
      const uom = t.itemUom || inventory.find(i => i.sku === t.itemSku)?.uom || 'N/A';
      return [
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        t.itemSku,
        t.itemName,
        t.qty,
        uom,
        t.department || 'N/A',
        t.receiverName || 'N/A',
        t.id
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sunlight_Release_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify("Release report generated");
  };

  const handleNameInputChange = (val: string = "") => {
    setNewItemData({...newItemData, name: val});
    const searchStr = val?.toLowerCase() || "";
    if (searchStr.length > 0) {
      const filtered = inventory.filter(i => 
        (i.name?.toLowerCase() || "").includes(searchStr) || 
        (i.sku?.toLowerCase() || "").includes(searchStr)
      ).slice(0, 5);
      setNameSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleTransferItemSearch = (val: string = "") => {
    setTempTransferItem({...tempTransferItem, itemName: val});
    const searchStr = val?.toLowerCase() || "";
    if (searchStr.length > 0) {
      const filtered = inventory.filter(i => 
        (i.name?.toLowerCase() || "").includes(searchStr) || 
        (i.sku?.toLowerCase() || "").includes(searchStr)
      ).slice(0, 5);
      setNameSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestedItem = (item: InventoryItem) => {
    setNewItemData({
      ...newItemData,
      name: item.name,
      category: item.category,
      uom: item.uom,
      parStock: item.parStock,
      unitCost: item.unitCost
    });
    setShowSuggestions(false);
  };

  const selectSuggestedTransferItem = (item: InventoryItem) => {
    setTempTransferItem({
      ...tempTransferItem,
      itemId: item.id,
      itemName: item.name
    });
    setShowSuggestions(false);
  };

  const addToCart = (item: InventoryItem, qty: number = 1, zoneOverride?: string) => {
    const zone = zoneOverride || selectedZone;
    if (zone === GLOBAL_ZONE_KEY) {
      return alert("Please select a specific zone to issue stock from.");
    }
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.id && i.zone === zone);
      if (existing) {
        return prev.map(i => (i.itemId === item.id && i.zone === zone) ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { itemId: item.id, sku: item.sku, name: item.name, quantity: qty, zone: zone, uom: item.uom }];
    });
    notify(`Added to Request`);
  };
// App.tsx -> Inside function App() { ... }


  const handleFinalIssue = async () => {
    if (!signature || !receiverName) return;

    const newTxId = `TX-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    setLastTxId(newTxId);

    const updatedInventory = [...inventory];
    const newTransactions: Transaction[] = [];

    cart.forEach(cartItem => {
      const invIndex = updatedInventory.findIndex(i => i.id === cartItem.itemId);
      if (invIndex === -1) return;

      const item = { ...updatedInventory[invIndex] };
      let remainingToDeduct = cartItem.quantity;
      
      const itemBatchesInZone = item.batches
        .filter(b => b.zone === cartItem.zone && b.quantity > 0)
        .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

      for (const batch of itemBatchesInZone) {
        if (remainingToDeduct <= 0) break;
        
        const originalBatchIndex = item.batches.findIndex(b => b.id === batch.id);
        const deduct = Math.min(batch.quantity, remainingToDeduct);
        
        item.batches[originalBatchIndex] = {
          ...item.batches[originalBatchIndex],
          quantity: item.batches[originalBatchIndex].quantity - deduct
        };
        remainingToDeduct -= deduct;
      }

      updatedInventory[invIndex] = syncAggregates(item);

      newTransactions.push({
        id: `${newTxId}-${cartItem.sku}-${Math.random().toString(36).substr(2, 3)}`,
        timestamp: new Date().toISOString(),
        user: currentUser?.name || 'Unknown',
        action: 'ISSUE',
        qty: cartItem.quantity,
        itemSku: cartItem.sku,
        itemName: cartItem.name,
        itemUom: cartItem.uom,
        destZone: cartItem.zone,
        department: receiverDept,
        receiverName: receiverName,
        signature: signature || undefined
      });
    });

    setInventory(updatedInventory);
    setTransactions(prev => [...newTransactions, ...prev]);

    if (receiptRef.current) {
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(receiptRef.current!, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const link = document.createElement('a');
          link.download = `Sunlight_Release_${newTxId}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          
          setCart([]);
          setSignature(null);
          setReceiverName('');
          setIsCheckingOut(false);
          notify(`Issued: ${newTxId}`);
        } catch (err) {
          console.error("Receipt generation failed", err);
          notify("Capture Error - Retrying...");
        }
      }, 500); 
    }
  };

  const handleManageSubmit = () => {
    if (!manageInput) return;
    
    if (manageTarget === 'users') {
      const newUser: User = { id: Date.now().toString(), name: manageInput, role: manageRole };
      setUsers([...users, newUser]);
    } else if (manageTarget === 'categories') {
      if (availableCategories.includes(manageInput)) return alert("Exists");
      setAvailableCategories([...availableCategories, manageInput]);
    } else if (manageTarget === 'zones') {
      if (availableZones.includes(manageInput)) return alert("Exists");
      setAvailableZones([...availableZones, manageInput]);
    } else if (manageTarget === 'departments') {
      if (availableDepartments.includes(manageInput)) return alert("Exists");
      setAvailableDepartments([...availableDepartments, manageInput]);
    }
    
    setManageInput('');
    notify("Updated");
  };

  const handleManageDelete = (item: string | User) => {
    if (manageTarget === 'users') {
      const u = item as User;
      if (users.length <= 1) return alert("Must have at least one user");
      if (u.id === currentUser?.id) return alert("Cannot delete active profile");
      setUsers(users.filter(x => x.id !== u.id));
    } else if (manageTarget === 'categories') {
      const c = item as string;
      setAvailableCategories(availableCategories.filter(x => x !== c));
    } else if (manageTarget === 'zones') {
      const z = item as string;
      if (availableZones.length <= 1) return alert("Must have at least one zone");
      setAvailableZones(availableZones.filter(x => x !== z));
    } else if (manageTarget === 'departments') {
      const d = item as string;
      setAvailableDepartments(availableDepartments.filter(x => x !== d));
    }
    notify("Deleted");
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 4) return alert("Password too short");
    setAdminPassword(newPassword);
    setIsPasswordChangeOpen(false);
    setNewPassword('');
    notify("Password updated");
  };

  const stockValue = useMemo(() => 
    inventory.reduce((total, item) => {
      const totalItemStock = item.batches.reduce((sum, b) => sum + b.quantity, 0);
      return total + (totalItemStock * (item.unitCost || 0));
    }, 0), [inventory]);

  const belowParItems = useMemo(() => 
    inventory.filter(i => {
      const totalStock = i.batches.reduce((sum, b) => sum + b.quantity, 0);
      return totalStock < i.parStock;
    }), [inventory]);

  const expiringSoonItems = useMemo(() => 
    inventory.filter(i => {
      const diffDays = Math.ceil((new Date(i.earliestExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diffDays <= 90 && diffDays > 0;
    }), [inventory]);

  const filteredItems = inventory.filter(i => 
    (i.name?.toLowerCase() || "").includes(searchTerm?.toLowerCase() || "")
  );

  const filteredTransactions = transactions.filter(t => {
    const sTerm = historySearch?.toLowerCase() || "";
    const matchesSearch = (t.itemName?.toLowerCase() || "").includes(sTerm) || 
                          (t.itemSku?.toLowerCase() || "").includes(sTerm) ||
                          (t.receiverName?.toLowerCase() || "").includes(sTerm);
    const matchesDept = historyDeptFilter === 'All Departments' || t.department === historyDeptFilter;
    return matchesSearch && matchesDept;
  });

  const modalInputClass = "w-full p-3 border border-gray-100 rounded-xl text-sm font-bold bg-gray-50 text-gray-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] outline-none transition-all placeholder:text-gray-300";
  const labelClass = "text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1.5 flex items-center gap-1.5";

  if (isSplashVisible) {
    return (
      <div className={`h-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative transition-all duration-700 ease-in-out ${isExitingSplash ? 'scale-110 opacity-0 blur-lg' : 'opacity-100'}`} style={{ backgroundImage: `url(${HOTEL_BG_URL})` }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
        <div className={`bg-[#800000]/30 backdrop-blur-md p-10 rounded-[4rem] shadow-2xl w-[90%] max-w-sm text-center border border-white/20 relative z-10 transition-all duration-1000 flex flex-col items-center ${isExitingSplash ? 'translate-y-[-20px] opacity-0' : 'animate-in fade-in'}`}>
          <div className="mb-4">
            <BrandLogo className="scale-[1.8] drop-shadow-xl" scale="text-5xl" />
          </div>
          <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] opacity-90 mb-12">Sunlight Guest Hotel</p>
          <div className="mb-6">
             <h2 className="brand-script text-[#FFD700] text-4xl leading-tight drop-shadow-lg scale-110">Welcome to your Home</h2>
          </div>
          <button 
            onClick={handleEnterApp}
            className="mb-8 w-[80%] py-3 border border-[#FFD700]/30 bg-transparent hover:bg-[#FFD700]/5 text-[#FFD700] rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
          >
            Enter App <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform opacity-60" />
          </button>
          <div className="border-t border-white/10 pt-6 w-full max-w-[200px]">
            <p className="text-[#FFD700] text-[9px] font-black uppercase tracking-[0.4em] opacity-80 animate-pulse">Warehouse Management System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 overflow-hidden pt-safe animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <ReceiptContent 
          ref={receiptRef}
          lastTxId={lastTxId}
          receiverName={receiverName}
          receiverDept={receiverDept}
          currentUser={currentUser}
          cart={cart}
          signature={signature}
        />
      </div>

      {showAddSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] bg-gray-900/90 backdrop-blur text-white px-5 py-2.5 rounded-full shadow-2xl font-black text-[10px] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={14} className="text-green-400" /> 
          <span className="uppercase tracking-widest">{showAddSuccess}</span>
        </div>
      )}

      <header className="bg-[#800000] text-white px-6 shadow-lg flex justify-between items-center h-16 shrink-0 z-50">
        <BrandLogo className="scale-75 -ml-4" />
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[9px] font-black uppercase tracking-wider">{currentUser?.name}</span>
            <span className="text-[7px] opacity-60 font-bold uppercase text-[#FFD700]">{currentUser?.role}</span>
          </div>
          <button onClick={() => setIsUserSelectorOpen(true)} className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 border border-white/5 shadow-sm active:scale-90 transition-all">
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {(view === 'inventory' || view === 'history') && (
        <div className="bg-white border-b shadow-sm shrink-0 z-40 px-4 py-2 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            {view === 'inventory' ? (
              <input type="text" placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#800000] bg-gray-50 transition-all" />
            ) : (
              <input type="text" placeholder="Search logs..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#800000] bg-gray-50 transition-all" />
            )}
          </div>
          
          <div className="relative flex items-center">
            <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} className={`text-[10px] font-black border border-gray-200 rounded-xl pl-8 pr-3 py-2 bg-gray-50 outline-none max-w-[140px] appearance-none cursor-pointer ${selectedZone === GLOBAL_ZONE_KEY ? 'text-[#800000]' : ''}`}>
              <option value={GLOBAL_ZONE_KEY}>All Zones (Global)</option>
              {availableZones.map(z => <option key={z} value={z}>{z.split(' (')[0]}</option>)}
            </select>
            <div className="absolute left-2.5 pointer-events-none text-gray-400">
               {selectedZone === GLOBAL_ZONE_KEY ? <Globe size={14} className="text-[#800000]" /> : <MapPin size={14} />}
            </div>
          </div>

          {view === 'inventory' && (
            <button onClick={handleOpenReceive} className="bg-[#800000] text-white p-2.5 rounded-xl shadow-md active:scale-95 transition-all"><PackagePlus size={18} /></button>
          )}
        </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-24">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Value" value={`₱${(stockValue/1000).toFixed(1)}K`} icon={<Sparkles size={12}/>} />
              <StatCard label="Below PAR" value={belowParItems.length} icon={<TrendingDown size={12}/>} />
              <StatCard label="Expiring (90d)" value={expiringSoonItems.length} icon={<Clock size={12}/>} />
              <StatCard label="Zones" value={availableZones.length} icon={<Building size={12}/>} />
            </div>

            {/* System Alerts Section */}
            {(belowParItems.length > 0 || expiringSoonItems.length > 0) && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-5 space-y-4 shadow-sm animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                    <AlertTriangle size={14} /> System Alerts
                  </h4>
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Attention Required</span>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  {expiringSoonItems.map(item => {
                    const diffDays = Math.ceil((new Date(item.earliestExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <button 
                        key={item.id + '-exp'} 
                        onClick={() => { setView('inventory'); setSearchTerm(item.name); }}
                        className="w-full bg-white border border-amber-100 p-3 rounded-2xl flex items-center justify-between shadow-sm active:scale-95 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0"><Clock size={14}/></div>
                          <p className="text-[11px] font-black text-gray-900 leading-tight truncate">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shrink-0 border border-red-100">
                            {diffDays}d
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                  
                  {belowParItems.map(item => {
                    const currentStock = item.batches.reduce((s,b)=>s+b.quantity, 0);
                    return (
                      <button 
                        key={item.id + '-par'} 
                        onClick={() => { setView('inventory'); setSearchTerm(item.name); }}
                        className="w-full bg-white border border-amber-100 p-3 rounded-2xl flex items-center justify-between shadow-sm active:scale-95 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0"><TrendingDown size={14}/></div>
                          <p className="text-[11px] font-black text-gray-900 leading-tight truncate">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shrink-0 border border-red-100">
                            LOW {currentStock}/{item.parStock}
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button onClick={() => setView('inventory')} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Package size={20}/></div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Stock</span>
                </button>
                <button onClick={handleOpenReceive} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-green-50 text-green-600 rounded-full"><PlusCircle size={20}/></div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Add</span>
                </button>
                <button onClick={handleOpenTransfer} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-full"><ArrowRightLeft size={20}/></div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Transfer</span>
                </button>
                <button onClick={() => setView('history')} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><History size={20}/></div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Logs</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'inventory' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  selectedZone={selectedZone as any} 
                  onIssue={addToCart} 
                  onEdit={handleEditRequest} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center opacity-30">
                <Inbox size={48} className="mx-auto mb-2" />
                <p className="font-black uppercase text-xs">No items found</p>
              </div>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
             <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left text-[11px] table-fixed">
                  <thead className="bg-gray-50 border-b font-black uppercase text-gray-400">
                    <tr>
                      <th className="px-2 py-3 w-[85px]">Date</th>
                      <th className="px-2 py-3">Item</th>
                      <th className="px-2 py-3 w-[70px]">Action</th>
                      <th className="px-2 py-3 w-[80px]">Location</th>
                      <th className="px-2 py-3 w-[45px] text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-2 py-2.5">
                          <div className="font-black text-gray-700 leading-tight">
                            {new Date(t.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </div>
                        </td>
                        <td className="px-2 py-2.5 truncate">
                          <div className="font-bold text-gray-900 truncate leading-tight">{t.itemName}</div>
                        </td>
                        <td className="px-2 py-2.5">
                           <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                             t.action === 'ISSUE' ? 'bg-red-50 text-red-600' :
                             t.action === 'TRANSFER' ? 'bg-amber-50 text-amber-600' :
                             'bg-green-50 text-green-600'
                           }`}>
                             {t.action}
                           </span>
                        </td>
                        <td className="px-2 py-2.5 truncate">
                           <div className="text-[8px] font-bold text-gray-400 truncate">
                             {t.action === 'TRANSFER' ? `${t.sourceZone?.split(' (')[0]} → ${t.destZone.split(' (')[0]}` : (t.department || t.destZone.split(' (')[0])}
                           </div>
                        </td>
                        <td className="px-2 py-2.5 font-black text-[#800000] text-right tabular-nums text-xs">
                          {t.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="space-y-6">
            {currentUser?.role === 'Manager' ? (
              <>
                <section className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Administration</h4>
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm divide-y">
                    {[
                      { id: 'users', label: 'Manage Users', icon: Users },
                      { id: 'categories', label: 'Manage Categories', icon: Tag },
                      { id: 'zones', label: 'Manage Zones', icon: Building },
                      { id: 'departments', label: 'Manage Departments', icon: Briefcase }
                    ].map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => { setManageTarget(item.id as any); setIsManageModalOpen(true); }}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-[#800000]/5 text-[#800000] rounded-xl"><item.icon size={18} /></div>
                          <span className="text-sm font-bold">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Data Management</h4>
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm divide-y">
                    <button 
                      onClick={handleExportJSON}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#800000]/5 text-[#800000] rounded-xl"><FileJson size={18} /></div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold">System Backup (JSON)</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Export all items, logs & settings</span>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-300" />
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#800000]/5 text-[#800000] rounded-xl"><FileSpreadsheet size={18} /></div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold">Inventory Report (CSV)</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Spreadsheet-compatible export</span>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-300" />
                    </button>
                    <button 
                      onClick={handleExportReleaseCSV}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#800000]/5 text-[#800000] rounded-xl"><ClipboardList size={18} /></div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold">Release Report (CSV)</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Historical logs of all issued items</span>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-300" />
                    </button>
                  </div>
                </section>

                <section className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Security</h4>
                  <button 
                    onClick={() => setIsPasswordChangeOpen(true)}
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-black text-sm flex items-center justify-between shadow-sm active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Key size={18} className="text-[#800000]" /> <span>Change Admin Password</span>
                    </div>
                    <ArrowRight size={16} className="opacity-20" />
                  </button>
                </section>
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex flex-col items-center text-center space-y-3">
                <ShieldCheck size={32} className="text-amber-600 opacity-40" />
                <h4 className="text-sm font-black uppercase text-amber-900">Restricted Access</h4>
                <p className="text-[10px] font-bold text-amber-800/60 leading-relaxed">Manager role is required to modify system settings.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around h-20 px-4 pb-safe z-50">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dash' },
          { id: 'inventory', icon: Package, label: 'Stock' },
          { id: 'history', icon: History, label: 'Logs' },
          { id: 'settings', icon: Settings, label: 'Setup' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${view === item.id ? 'text-[#800000] -translate-y-1' : 'text-gray-300'}`}
          >
            {view === item.id && <div className="absolute -top-3 w-1 h-1 bg-[#800000] rounded-full" />}
            <item.icon size={22} className={view === item.id ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        <button 
          onClick={() => setIsCartOpen(true)}
          className={`relative flex flex-col items-center gap-1.5 transition-all ${cart.length > 0 ? 'text-[#800000]' : 'text-gray-300'}`}
        >
          <div className="relative">
            <ShoppingCart size={22} className={cart.length > 0 ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#800000] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest">Cart</span>
        </button>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 bg-[#800000] text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-[#FFD700]" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">Release Request</h3>
                  <p className="text-[8px] font-bold text-[#FFD700] uppercase tracking-[0.2em]">{cart.length} Items Selected</p>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {cart.map((item, idx) => (
                <div key={`${item.itemId}-${item.zone}`} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between group">
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.sku} • {item.zone.split(' (')[0]}</p>
                    <h5 className="text-[11px] font-black text-gray-900 truncate pr-4">{item.name}</h5>
                    <p className="text-[10px] font-bold text-[#800000] mt-0.5">{item.quantity} {item.uom}</p>
                  </div>
                  <button 
                    onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4 py-20">
                  <ShoppingCart size={64} strokeWidth={1} />
                  <p className="font-black uppercase text-xs tracking-[0.2em]">Request Empty</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 space-y-4 shrink-0">
              <button 
                disabled={cart.length === 0}
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-maroon-100 disabled:opacity-30 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Release <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
             <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#800000]">Issue Validation</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Complete the details below</p>
               </div>
               <button onClick={() => setIsCheckingOut(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={labelClass}><Users size={11} /> Receiver Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter name..." 
                      value={receiverName} 
                      onChange={e => setReceiverName(e.target.value)} 
                      className={modalInputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}><Briefcase size={11} /> Department</label>
                    <select 
                      value={receiverDept} 
                      onChange={e => setReceiverDept(e.target.value)} 
                      className={modalInputClass}
                    >
                      {availableDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <SignaturePad 
                    onSave={(data) => setSignature(data)}
                    onClear={() => setSignature(null)}
                  />
                </div>
             </div>

             <div className="p-8 border-t bg-gray-50 flex gap-4">
                <button 
                  onClick={() => setIsCheckingOut(false)}
                  className="flex-1 py-4 border border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[10px] hover:bg-white transition-all active:scale-95"
                >
                  Back
                </button>
                <button 
                  disabled={!signature || !receiverName}
                  onClick={handleFinalIssue}
                  className="flex-[2] py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Sign & Complete Release <Check size={16} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#800000]">Inventory Receipt</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">New Stock Entry • {currentAutoBatchId}</p>
               </div>
               <button onClick={() => setIsAddingItem(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                <div className="relative">
                  <label className={labelClass}><Tag size={11} /> Item Name / SKU</label>
                  <input 
                    type="text" 
                    placeholder="Search or enter new name..." 
                    value={newItemData.name} 
                    onChange={e => handleNameInputChange(e.target.value)} 
                    className={modalInputClass}
                  />
                  {showSuggestions && (
                    <div ref={suggestionRef} className="absolute z-[120] left-0 right-0 top-full mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      {nameSuggestions.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => selectSuggestedItem(item)}
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b last:border-0"
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-black text-gray-900">{item.name}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.sku} • {item.uom}</span>
                          </div>
                          <Plus size={14} className="text-[#800000]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}><Layers size={11} /> Category</label>
                    <select 
                      value={newItemData.category} 
                      onChange={e => setNewItemData({...newItemData, category: e.target.value})} 
                      className={modalInputClass}
                    >
                      {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}><Hash size={11} /> Unit of Measure</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Case, Sack" 
                      value={newItemData.uom} 
                      onChange={e => setNewItemData({...newItemData, uom: e.target.value})} 
                      className={modalInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}><DollarSign size={11} /> Unit Cost (₱)</label>
                    <input 
                      type="number" 
                      value={newItemData.unitCost} 
                      onChange={e => setNewItemData({...newItemData, unitCost: parseFloat(e.target.value) || 0})} 
                      className={modalInputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}><TrendingDown size={11} /> PAR Stock Level</label>
                    <input 
                      type="number" 
                      value={newItemData.parStock} 
                      onChange={e => setNewItemData({...newItemData, parStock: parseInt(e.target.value) || 0})} 
                      className={modalInputClass}
                    />
                  </div>
                </div>

                <div className="p-6 bg-[#800000]/5 rounded-[2rem] border border-[#800000]/10 space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-[#800000]">Batch Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="space-y-1.5">
                        <label className={labelClass}><PackagePlus size={11} /> Quantity</label>
                        <input 
                          type="number" 
                          value={newItemData.receivedQty} 
                          onChange={e => setNewItemData({...newItemData, receivedQty: parseInt(e.target.value) || 0})} 
                          className={modalInputClass}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className={labelClass}><Calendar size={11} /> Expiry Date</label>
                        <input 
                          type="date" 
                          value={newItemData.earliestExpiry} 
                          onChange={e => setNewItemData({...newItemData, earliestExpiry: e.target.value})} 
                          className={modalInputClass}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className={labelClass}><MapPin size={11} /> Storage Zone</label>
                        <select 
                          value={newItemData.restockZone} 
                          onChange={e => setNewItemData({...newItemData, restockZone: e.target.value})} 
                          className={modalInputClass}
                        >
                          {availableZones.map(z => <option key={z} value={z}>{z.split(' (')[0]}</option>)}
                        </select>
                     </div>
                  </div>
                </div>
             </div>

             <div className="p-8 border-t bg-gray-50 flex gap-4">
                <button 
                  onClick={() => setIsAddingItem(false)}
                  className="flex-1 py-4 border border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[10px] hover:bg-white transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCommitStockEntry}
                  className="flex-[2] py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Commit Entry <Check size={16} />
                </button>
             </div>
           </div>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferringStock && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><ArrowRightLeft size={20}/></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#800000]">Internal Transfer</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Move stock between storage zones</p>
                  </div>
               </div>
               <button onClick={() => setIsTransferringStock(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20}/></button>
             </div>
             
             <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Configuration */}
                <div className="w-full md:w-80 border-r p-8 space-y-6 bg-gray-50/30">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className={labelClass}><MapPin size={11} className="text-red-500" /> Source Zone</label>
                        <select 
                          value={transferSource} 
                          onChange={e => { setTransferSource(e.target.value); setTransferBatch([]); }} 
                          className={modalInputClass}
                        >
                          {availableZones.map(z => <option key={z} value={z}>{z.split(' (')[0]}</option>)}
                        </select>
                      </div>
                      <div className="flex justify-center -my-2 relative z-10">
                        <div className="bg-white p-2 rounded-full border shadow-sm text-gray-300"><ChevronRight size={14} className="rotate-90 md:rotate-0"/></div>
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}><MapPin size={11} className="text-green-500" /> Destination Zone</label>
                        <select 
                          value={transferDest} 
                          onChange={e => setTransferDest(e.target.value)} 
                          className={modalInputClass}
                        >
                          {availableZones.map(z => <option key={z} value={z}>{z.split(' (')[0]}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="pt-6 border-t space-y-4">
                      <div className="relative">
                        <label className={labelClass}><Search size={11} /> Find Item</label>
                        <input 
                          type="text" 
                          placeholder="Search item in source..." 
                          value={tempTransferItem.itemName} 
                          onChange={e => handleTransferItemSearch(e.target.value)} 
                          className={modalInputClass}
                        />
                        {showSuggestions && (
                          <div ref={suggestionRef} className="absolute z-[120] left-0 right-0 top-full mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden">
                            {nameSuggestions.map(item => (
                              <button 
                                key={item.id} 
                                onClick={() => selectSuggestedTransferItem(item)}
                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b last:border-0"
                              >
                                <div className="flex flex-col items-start">
                                  <span className="text-xs font-black text-gray-900">{item.name}</span>
                                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.stock[transferSource] || 0} {item.uom} available</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}><Hash size={11} /> Transfer Qty</label>
                        <input 
                          type="number" 
                          value={tempTransferItem.quantity} 
                          onChange={e => setTempTransferItem({...tempTransferItem, quantity: parseInt(e.target.value) || 0})} 
                          className={modalInputClass}
                        />
                      </div>
                      <button 
                        onClick={addToTransferBatch}
                        className="w-full py-3 bg-white border border-[#800000] text-[#800000] rounded-xl font-black uppercase text-[10px] hover:bg-[#800000]/5 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> Add to Batch
                      </button>
                   </div>
                </div>

                {/* Right Side: Batch Summary */}
                <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transfer Batch Summary</h4>
                   <div className="space-y-2">
                      {transferBatch.map((item, idx) => (
                        <div key={item.itemId} className="bg-white border rounded-2xl p-4 flex items-center justify-between group hover:border-amber-200 transition-colors">
                           <div className="min-w-0 flex-1">
                              <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.sku}</p>
                              <h5 className="text-[11px] font-black text-gray-900 truncate pr-4">{item.itemName}</h5>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-[12px] font-black text-amber-600">{item.quantity}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">{item.uom}</p>
                              </div>
                              <button 
                                onClick={() => setTransferBatch(transferBatch.filter((_, i) => i !== idx))}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                      ))}
                      {transferBatch.length === 0 && (
                        <div className="py-20 text-center opacity-20 flex flex-col items-center gap-2">
                           <Layers size={48} strokeWidth={1} />
                           <p className="text-[10px] font-black uppercase tracking-widest">Batch is empty</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                   Total Items: <span className="text-[#800000] ml-1">{transferBatch.length}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsTransferringStock(false)}
                    className="px-8 py-4 border border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[10px] hover:bg-white transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={transferBatch.length === 0}
                    onClick={handleCommitTransferBatch}
                    className="px-12 py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm Transfer <Check size={16} />
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Edit Inventory Modal */}
      {isEditingInventoryItem && itemToEdit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#800000]">Edit Master Item</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global SKU: {itemToEdit.sku}</p>
               </div>
               <button onClick={() => setIsEditingInventoryItem(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Item Name</label>
                    <input 
                      type="text" 
                      value={itemToEdit.name} 
                      onChange={e => setItemToEdit({...itemToEdit, name: e.target.value})} 
                      className={modalInputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Category</label>
                    <select 
                      value={itemToEdit.category} 
                      onChange={e => setItemToEdit({...itemToEdit, category: e.target.value})} 
                      className={modalInputClass}
                    >
                      {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Unit of Measure</label>
                    <input 
                      type="text" 
                      value={itemToEdit.uom} 
                      onChange={e => setItemToEdit({...itemToEdit, uom: e.target.value})} 
                      className={modalInputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Unit Cost (₱)</label>
                    <input 
                      type="number" 
                      value={itemToEdit.unitCost} 
                      onChange={e => setItemToEdit({...itemToEdit, unitCost: parseFloat(e.target.value) || 0})} 
                      className={modalInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={labelClass}>PAR Stock Level</label>
                    <input 
                      type="number" 
                      value={itemToEdit.parStock} 
                      onChange={e => setItemToEdit({...itemToEdit, parStock: parseInt(e.target.value) || 0})} 
                      className={modalInputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={itemToEdit.isFastMoving} 
                          onChange={e => setItemToEdit({...itemToEdit, isFastMoving: e.target.checked})} 
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#800000] transition-all" />
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-all" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-gray-600">Fast Moving Item</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-[#800000] mb-4">Active Batches</h4>
                  <div className="space-y-2">
                    {itemToEdit.batches.map((batch, bIdx) => (
                      <div key={`${batch.id}-${batch.zone}`} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                         <div className="grid grid-cols-2 gap-4 flex-1">
                            <div>
                               <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Zone & Expiry</p>
                               <p className="text-[10px] font-bold">{batch.zone.split(' (')[0]} • {batch.expiry}</p>
                            </div>
                            <div>
                               <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Quantity</p>
                               <input 
                                 type="number" 
                                 value={batch.quantity} 
                                 onChange={e => {
                                   const newBatches = [...itemToEdit.batches];
                                   newBatches[bIdx] = { ...batch, quantity: parseInt(e.target.value) || 0 };
                                   setItemToEdit({...itemToEdit, batches: newBatches});
                                 }}
                                 className="w-20 bg-transparent text-[11px] font-black text-[#800000] outline-none border-b border-[#800000]/20"
                               />
                            </div>
                         </div>
                         <button 
                           onClick={() => {
                             const newBatches = itemToEdit.batches.filter((_, i) => i !== bIdx);
                             setItemToEdit({...itemToEdit, batches: newBatches});
                           }}
                           className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase hover:opacity-70"
                >
                  <Trash2 size={14} /> Delete Item
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsEditingInventoryItem(false)}
                    className="px-8 py-4 border border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[10px] hover:bg-white transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateInventoryItem}
                    className="px-12 py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Save Changes <Check size={16} />
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] p-8 max-w-xs w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                 <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black uppercase">Critical Action</h4>
                 <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">This will permanently delete this item and all its associated stock records.</p>
              </div>
              <div className="flex flex-col gap-3">
                 <button onClick={handleDeleteInventoryItem} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-red-100 active:scale-95 transition-all">Delete Forever</button>
                 <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-all">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {/* Profile Selector Modal */}
      {isUserSelectorOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 w-full max-w-sm text-center space-y-8 animate-in zoom-in-95 duration-300 border-4 border-[#800000]/10">
            <BrandLogo className="scale-110" />
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Select Profile</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Identify yourself to continue</p>
            </div>
            <div className="space-y-3">
              {users.map(u => (
                <button 
                  key={u.id} 
                  onClick={() => selectUserRequest(u)}
                  className={`w-full p-5 rounded-3xl border-2 flex items-center justify-between group transition-all active:scale-95 ${currentUser?.id === u.id ? 'border-[#800000] bg-[#800000]/5' : 'border-gray-100 hover:border-[#800000]/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${currentUser?.id === u.id ? 'bg-[#800000] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#800000]/10 group-hover:text-[#800000]'}`}><Users size={18} /></div>
                    <div className="text-left">
                      <p className={`text-sm font-black ${currentUser?.id === u.id ? 'text-[#800000]' : 'text-gray-900'}`}>{u.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#FFD700]">{u.role}</p>
                    </div>
                  </div>
                  {currentUser?.id === u.id && <Check size={18} className="text-[#800000]" />}
                </button>
              ))}
            </div>
            <button onClick={() => setIsUserSelectorOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Password Prompt Modal */}
      {isPasswordPromptOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className={`bg-white rounded-[3rem] p-10 w-full max-sm:w-full max-w-sm text-center space-y-8 transition-all duration-300 border-4 border-[#800000]/10 ${passwordError ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
            <div className="w-16 h-16 bg-[#800000]/5 text-[#800000] rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Manager Verification</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Enter authorization key</p>
            </div>
            <input 
              autoFocus
              type="password" 
              placeholder="••••"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerifyPassword()}
              className={`w-full text-center text-4xl font-black tracking-[0.5em] outline-none border-b-4 pb-2 transition-colors ${passwordError ? 'border-red-500 text-red-500' : 'border-[#800000] text-[#800000]'}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setIsPasswordPromptOpen(false); setPendingUser(null); }}
                className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifyPassword}
                className="py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-maroon-100"
              >
                Verify Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordChangeOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center space-y-8 border-4 border-[#800000]/10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#800000]/5 text-[#800000] rounded-full flex items-center justify-center mx-auto">
              <Key size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Update Admin Key</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Define a new 4-digit password</p>
            </div>
            <input 
              type="password" 
              placeholder="••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full text-center text-4xl font-black tracking-[0.5em] outline-none border-b-4 border-[#800000] text-[#800000] pb-2"
            />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsPasswordChangeOpen(false)} className="py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cancel</button>
              <button onClick={handleUpdatePassword} className="py-4 bg-[#800000] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Save Key</button>
            </div>
          </div>
        </div>
      )}

      {/* Management Modal (Users, Zones, etc.) */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#800000]">Manage {manageTarget}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">System Configuration Panel</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="space-y-4">
                <label className={labelClass}>Add New Entry</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder={`Enter ${manageTarget?.slice(0,-1)} name...`} 
                    value={manageInput} 
                    onChange={e => setManageInput(e.target.value)} 
                    className={modalInputClass}
                  />
                  {manageTarget === 'users' && (
                    <select 
                      value={manageRole} 
                      onChange={e => setManageRole(e.target.value as any)} 
                      className="px-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-50 outline-none"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Manager">Manager</option>
                    </select>
                  )}
                  <button 
                    onClick={handleManageSubmit}
                    className="p-4 bg-[#800000] text-white rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className={labelClass}>Active {manageTarget}</label>
                <div className="grid grid-cols-1 gap-3">
                  {(manageTarget === 'users' ? users : 
                    manageTarget === 'categories' ? availableCategories :
                    manageTarget === 'zones' ? availableZones :
                    availableDepartments).map((item, idx) => {
                      const name = typeof item === 'string' ? item : item.name;
                      const role = typeof item === 'string' ? null : item.role;
                      return (
                        <div key={idx} className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between group hover:border-[#800000]/20 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-[#800000] transition-colors">
                               {manageTarget === 'users' ? <Users size={16}/> : 
                                manageTarget === 'categories' ? <Tag size={16}/> :
                                manageTarget === 'zones' ? <Building size={16}/> : <Briefcase size={16}/>}
                             </div>
                             <div>
                               <p className="text-xs font-black text-gray-900">{name}</p>
                               {role && <p className="text-[8px] font-bold uppercase text-[#800000] tracking-widest">{role}</p>}
                             </div>
                          </div>
                          <button 
                            onClick={() => handleManageDelete(item)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setIsManageModalOpen(false)} className="px-10 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;