import React, { useState } from 'react';
import { InventoryItem, Zone } from '../types';
import { COLORS } from '../constants';
import { TrendingUp, Minus, Plus as PlusIcon, Edit3, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, MapPin, Globe, Clock } from 'lucide-react';

interface ItemCardProps {
  item: InventoryItem;
  selectedZone: Zone | 'All Zones';
  onIssue: (item: InventoryItem, qty: number) => void;
  onEdit: (item: InventoryItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, selectedZone, onIssue, onEdit }) => {
  const isGlobal = selectedZone === 'All Zones';
  
  // Calculate stock to display
  const stockInZone = isGlobal 
    ? item.batches.reduce((sum, b) => sum + b.quantity, 0)
    : (item.stock[selectedZone as string] || 0);

  const totalStock = item.batches.reduce((sum, b) => sum + b.quantity, 0);
  const isBelowPar = totalStock < item.parStock;

  const expiryDate = new Date(item.earliestExpiry);
  const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;
  const isExpiringSoon = diffDays <= 90 && diffDays > 0;
  
  const [issueQty, setIssueQty] = useState<number>(1);
  const [showBatches, setShowBatches] = useState(false);

  const handleQtyChange = (val: number) => {
    const newQty = Math.min(stockInZone, Math.max(1, val));
    setIssueQty(newQty);
  };

  const activeBatches = item.batches
    .filter(b => (isGlobal || b.zone === selectedZone) && b.quantity > 0)
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full group">
      {/* Visual Indicator Bars */}
      {isExpired && <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500" />}
      {!isExpired && isExpiringSoon && <div className="absolute left-0 top-0 w-1.5 h-full" style={{ backgroundColor: COLORS.GOLD }} />}
      
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black text-gray-300 uppercase block truncate tabular-nums tracking-widest">{item.sku}</span>
            <button 
              onClick={() => onEdit(item)}
              className="text-gray-300 hover:text-[#800000] transition-colors p-0.5"
            >
              <Edit3 size={11} />
            </button>
          </div>
          <h3 className="font-black text-sm text-gray-900 leading-tight pr-4">{item.name}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {item.isFastMoving && (
            <div className="bg-[#800000]/5 text-[#800000] px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">Fast</div>
          )}
          {isBelowPar && (
            <div className="bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1">
              Low
            </div>
          )}
          {isExpired ? (
            <div className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1">
              Expired
            </div>
          ) : isExpiringSoon ? (
            <div className="bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1">
              {diffDays}D
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">FEFO (Expiry)</p>
          <p className={`text-[12px] font-black tabular-nums ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-600'}`}>
            {item.earliestExpiry}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{isGlobal ? 'Global Stock' : 'Zone Stock'}</p>
          <div className="flex items-baseline justify-end gap-1">
             <span className={`text-base font-black tabular-nums ${isGlobal ? 'text-[#800000]' : 'text-gray-900'}`}>
               {stockInZone} / {item.parStock}
             </span>
             <span className="text-[9px] text-gray-400 font-bold uppercase">{item.uom}</span>
          </div>
        </div>
      </div>

      {/* Batch Breakdown Section */}
      <div className="mt-4 border-t border-gray-50 pt-3">
        <button 
          onClick={() => setShowBatches(!showBatches)}
          className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-400 hover:text-[#800000] transition-colors w-full tracking-widest"
        >
          {showBatches ? <ChevronUp size={10}/> : <ChevronDown size={10}/>}
          {showBatches ? 'Hide' : 'View'} {activeBatches.length} {isGlobal ? 'Global' : 'Local'} Batches
        </button>
        {showBatches && (
          <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto no-scrollbar pb-1">
            {activeBatches.map(b => {
              const bDiff = Math.ceil((new Date(b.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const bExpired = bDiff <= 0;
              const bExpiring = bDiff <= 90 && bDiff > 0;
              
              return (
                <div key={`${b.id}-${b.zone}`} className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-mono font-black tabular-nums ${bExpired ? 'text-red-500' : bExpiring ? 'text-amber-500' : 'text-gray-500'}`}>
                      {b.expiry}
                    </span>
                    <span className="text-[#800000] font-black tabular-nums">{b.quantity} {item.uom}</span>
                  </div>
                  {isGlobal && (
                    <div className="flex items-center gap-1 text-[8px] font-black uppercase text-gray-400 tracking-tighter">
                      <MapPin size={8} /> {b.zone.split(' (')[0]}
                    </div>
                  )}
                </div>
              );
            })}
            {activeBatches.length === 0 && <p className="text-[9px] text-gray-300 italic text-center py-2">No active batches</p>}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-2">
        {!isGlobal ? (
          <>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-1 h-10 bg-white shadow-sm">
                <button 
                  disabled={stockInZone === 0 || issueQty <= 1}
                  onClick={() => handleQtyChange(issueQty - 1)}
                  className="px-4 h-full bg-gray-50 text-gray-500 disabled:opacity-30 active:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="number"
                  min="1"
                  max={stockInZone}
                  value={issueQty}
                  onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
                  disabled={stockInZone === 0}
                  className="w-full text-center text-sm font-black outline-none bg-transparent tabular-nums"
                />
                <button 
                  disabled={stockInZone === 0 || issueQty >= stockInZone}
                  onClick={() => handleQtyChange(issueQty + 1)}
                  className="px-4 h-full bg-gray-50 text-gray-500 disabled:opacity-30 active:bg-gray-100 transition-colors"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={() => { onIssue(item, issueQty); setIssueQty(1); }}
              disabled={stockInZone === 0}
              className={`w-full py-3 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-[0.98] ${
                stockInZone === 0 
                  ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed' 
                  : 'bg-[#800000] text-white hover:bg-[#600000] shadow-maroon-100/50'
              }`}
            >
              {stockInZone === 0 ? 'Out of Stock' : `Issue ${issueQty} ${item.uom}`}
            </button>
          </>
        ) : (
          <div className="bg-[#800000]/5 p-3 rounded-xl border border-[#800000]/10 flex items-center justify-center gap-2">
            <Globe size={14} className="text-[#800000]" />
            <span className="text-[9px] font-black uppercase text-[#800000] tracking-widest text-center">
              Select specific zone to issue stock
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
