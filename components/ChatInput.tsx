import React, { useRef, useState } from 'react';

interface ChatInputProps {
  inputText: string;
  setInputText: (val: string) => void;
  selectedImage: string | null;
  setSelectedImage: (val: string | null) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputText, 
  setInputText, 
  selectedImage, 
  setSelectedImage, 
  onSendMessage,
  isLoading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && (inputText.trim() || selectedImage)) {
      onSendMessage();
    }
  };

  return (
    <div 
      className={`w-full px-3 py-1 md:py-4 transition-all duration-300 ${isDragging ? 'bg-indigo-500/5 scale-[0.99]' : 'bg-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-3xl mx-auto relative">
        {/* Image Preview Overlay */}
        {selectedImage && (
          <div className="absolute -top-20 left-2 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="relative group">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 active:scale-90 transition-all z-40 border-2 border-white dark:border-charcoal-900"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="rounded-xl overflow-hidden border-2 border-indigo-500 shadow-2xl bg-white dark:bg-charcoal-800 p-0.5">
                <img src={selectedImage} alt="Preview" className="h-14 w-14 object-cover rounded-lg" />
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className={`flex items-end bg-white dark:bg-charcoal-800 rounded-[24px] md:rounded-[36px] p-1 md:p-2 shadow-2xl border transition-all duration-500 ${isDragging ? 'border-indigo-500 ring-8 ring-indigo-500/10' : 'border-slate-100 dark:border-white/5 shadow-indigo-500/5'} focus-within:border-indigo-400/50`}>
            
            {/* Multi-modal Action Group */}
            <div className="flex items-center space-x-0.5 mb-0.5 ml-0.5">
              {/* Camera Button */}
              <button 
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-2 md:p-3 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 active:scale-90"
                title="Camera Capture"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Gallery Button */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 md:p-3 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 active:scale-90"
                title="Upload from Gallery"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isDragging ? "Drop here..." : "Type or upload..."}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2.5 px-2 md:px-3 text-[14px] md:text-[16px] text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none min-h-[40px] max-h-40 font-medium custom-scrollbar"
              rows={1}
            />
            
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="mb-0.5 mr-0.5 w-10 h-10 md:w-12 md:h-12 rounded-[18px] md:rounded-[24px] bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:bg-slate-100 dark:disabled:bg-charcoal-900 disabled:text-slate-300 dark:disabled:text-slate-700 text-white flex items-center justify-center transition-all shadow-xl shadow-indigo-500/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            {/* Hidden Input Nodes */}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <input type="file" ref={cameraInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" capture="environment" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;