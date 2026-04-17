export default function CounterHeader() {
  return (
    <header className="flex justify-between items-center w-full px-8 h-[72px] sticky top-0 z-30 bg-[#f9f9ff] shadow-[0_2px_20px_0_rgba(25,28,32,0.03)] border-b border-slate-200/50">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-[#003063] tracking-tight">Horizon Terminal</span>
        <span className="h-5 w-px bg-slate-300 opacity-50"></span>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Branch: Main Street
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/50 rounded-full transition-all duration-300 cursor-pointer">
          <img 
            alt="Staff Profile" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm bg-[#003063]" 
            src="https://ui-avatars.com/api/?name=Alex+Nguyen&background=003063&color=fff" 
          />
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#003063] leading-none mb-0.5">Alex Nguyen</span>
            <span className="text-[10px] text-slate-500 font-medium leading-none">Lead Teller - C3</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="cursor-pointer p-2 text-slate-500 hover:bg-slate-200/50 rounded-full transition-all duration-300 relative aspect-square flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 border border-[#f9f9ff] rounded-full"></span>
          </button>
          <button className="cursor-pointer p-2 text-slate-500 hover:bg-slate-200/50 rounded-full transition-all duration-300 aspect-square flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}