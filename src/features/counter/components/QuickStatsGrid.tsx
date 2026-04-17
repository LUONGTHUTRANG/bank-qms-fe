import { useOutletContext } from 'react-router';

export default function QuickStatsGrid() {
  const { endSession } = useOutletContext<{ endSession: () => void }>();

  return (
    <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 h-full">
      <div className="col-span-1 lg:col-span-3 bg-blue-50/50 p-4 xl:p-5 rounded-xl border border-blue-100 flex flex-col justify-between aspect-square lg:aspect-auto cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <span className="material-symbols-outlined text-[#003063] mb-3 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Đang chờ</p>
          <p className="text-2xl xl:text-3xl font-black text-[#003063]">12</p>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-3 bg-white px-4 xl:px-5 py-4 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200/60 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <span className="material-symbols-outlined text-slate-400 mb-3 text-[24px]">timer</span>
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Chờ TB</p>
          <p className="text-xl xl:text-2xl font-black text-[#191c20]">08:15</p>
          <p className="text-[9px] xl:text-[10px] text-green-600 font-bold mt-1">↓ 2m</p>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-2 bg-white px-3 xl:px-4 py-4 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200/60 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <span className="material-symbols-outlined text-emerald-500 mb-3 text-[20px] xl:text-[24px]">check_circle</span>
        <div>
          <p className="text-slate-500 text-[9px] xl:text-[10px] font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Đã phục vụ</p>
          <p className="text-lg xl:text-2xl font-black text-[#191c20]">42 <span className="text-xs xl:text-sm font-semibold text-slate-500 tracking-normal hidden xl:inline">khách</span></p>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-2 bg-white px-3 xl:px-4 py-4 rounded-xl flex flex-col justify-between shadow-sm border border-slate-200/60 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <span className="material-symbols-outlined text-[#003063] mb-3 text-[20px] xl:text-[24px]">history_toggle_off</span>
        <div>
          <p className="text-slate-500 text-[9px] xl:text-[10px] font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">TG Phục vụ</p>
          <p className="text-lg xl:text-2xl font-black text-[#191c20]">03:45</p>
        </div>
      </div>
      <div 
        onClick={endSession}
        className="col-span-2 lg:col-span-2 bg-red-50 px-3 xl:px-4 py-4 rounded-xl flex flex-col justify-between shadow-sm border border-red-200 cursor-pointer hover:bg-red-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
      >
        <span className="material-symbols-outlined text-red-600 mb-3 text-[20px] xl:text-[24px]">logout</span>
        <div>
          <p className="text-red-700 text-[9px] xl:text-[10px] font-bold uppercase tracking-wider mb-0.5">Thao tác</p>
          <p className="text-[15px] xl:text-[18px] font-black text-red-600 leading-tight">Kết thúc<br className="hidden lg:block"/> phiên</p>
        </div>
      </div>
    </section>
  );
}