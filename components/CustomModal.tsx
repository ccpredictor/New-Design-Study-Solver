
import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
  type?: 'default' | 'danger';
}

const CustomModal: React.FC<CustomModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  onConfirm, 
  confirmLabel = "Confirm", 
  isLoading = false,
  type = 'default'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-charcoal-900 w-full max-w-md rounded-[32px] md:rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h3>
              {description && <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{description}</p>}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {children}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-50 dark:bg-charcoal-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-charcoal-700 transition-all"
            >
              Cancel
            </button>
            {onConfirm && (
              <button 
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center ${
                  type === 'danger' 
                    ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600' 
                    : 'bg-indigo-500 text-white shadow-indigo-500/20 hover:bg-indigo-600'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
