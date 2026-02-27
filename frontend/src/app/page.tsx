import React from 'react';
import { 
  Home, 
  Search, 
  Clock, 
  FileText, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Settings, 
  Info,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  MoreHorizontal,
  Mail,
  SlidersHorizontal
} from 'lucide-react';

const SpiritUI = () => {
  return (
    <div className="flex h-screen bg-white text-[#1a1a1a] font-sans selection:bg-blue-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#fbfbfa] border-r border-[#efefee] flex flex-col p-2 gap-0.5 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2 py-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] tracking-tight">spirit</span>
          </div>
          <div className="flex gap-0.5">
            <button className="p-1 hover:bg-[#efefee] rounded-md transition-colors">
              <Plus size={16} className="text-[#6b6b6b]" />
            </button>
            <button className="px-1.5 py-1 hover:bg-[#efefee] rounded-md transition-colors text-[13px] font-medium text-[#6b6b6b]">
              New
            </button>
            <button className="p-1 hover:bg-[#efefee] rounded-md transition-colors">
              <LayoutGrid size={16} className="text-[#6b6b6b]" />
            </button>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto px-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 bg-[#efefee] rounded-lg text-[14px] font-medium transition-colors group">
            <div className="w-5 h-5 flex items-center justify-center">
               <Home size={16} className="text-[#37352f]" />
            </div>
            <span>Home</span>
            <div className="ml-auto flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
               <Sparkles size={14} className="text-[#91918e]" />
               <Mail size={14} className="text-[#91918e]" />
               <Search size={14} className="text-[#91918e]" />
            </div>
          </button>
          
          <div className="mt-5 px-2 py-1 text-[11px] font-semibold text-[#91918e] flex items-center gap-2 uppercase tracking-widest">
            <Clock size={13} strokeWidth={2.5} /> Recents
          </div>
          
          <button className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-[#efefee] rounded-lg text-[14px] text-[#37352f] transition-colors group">
            <div className="w-5 h-5 flex items-center justify-center">
              <FileText size={16} className="text-[#6b6b6b]" />
            </div>
            <span className="truncate">Welcome to Spirit ✨</span>
          </button>

          <button className="w-full flex items-center gap-2 px-2 py-1.5 mt-3 hover:bg-[#efefee] rounded-lg text-[14px] font-medium text-[#37352f] transition-colors">
            <div className="w-5 h-5 flex items-center justify-center">
              <Home size={16} className="text-[#37352f]" />
            </div>
            <span>Workspace</span>
          </button>

          <button className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-[#efefee] rounded-lg text-[14px] text-[#37352f] transition-colors group">
            <div className="w-5 h-5 flex items-center justify-center">
              <FileText size={16} className="text-[#6b6b6b]" />
            </div>
            <span className="truncate">Welcome to Spirit ✨</span>
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-1 p-1">
          <div className="flex items-center gap-1 px-1 mb-1">
            <button className="p-2 hover:bg-[#efefee] rounded-md transition-colors">
              <Trash2 size={17} className="text-[#91918e]" />
            </button>
            <button className="p-2 hover:bg-[#efefee] rounded-md transition-colors">
               <Sparkles size={17} className="text-[#91918e]" />
            </button>
            <button className="p-2 hover:bg-[#efefee] rounded-md transition-colors">
              <Settings size={17} className="text-[#91918e]" />
            </button>
          </div>
          <button className="w-full flex items-center gap-2 px-2 py-2 hover:bg-[#efefee] rounded-lg text-[14px] border-t border-[#efefee] pt-3 mt-1">
            <div className="w-7 h-7 rounded-md bg-[#e3e2e0] flex items-center justify-center font-bold text-[12px] text-[#37352f]">S</div>
            <div className="flex flex-col items-start leading-tight overflow-hidden">
              <span className="font-medium text-[#37352f]">Sam</span>
              <span className="text-[11px] text-[#91918e]">Free plan</span>
            </div>
            <ChevronDown size={14} className="ml-auto text-[#91918e]" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-11 flex items-center justify-between px-4 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 mr-2">
              <button className="p-1.5 hover:bg-[#efefee] rounded transition-colors disabled:opacity-20" disabled>
                <ChevronLeft size={18} className="text-[#37352f]" />
              </button>
              <button className="p-1.5 hover:bg-[#efefee] rounded transition-colors disabled:opacity-20" disabled>
                <ChevronRight size={18} className="text-[#37352f]" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#37352f] px-2 py-1 hover:bg-[#efefee] rounded cursor-pointer transition-colors font-medium">
              <Home size={14} />
              <span>Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <button className="p-2 hover:bg-[#efefee] rounded-md transition-colors group">
               <Sparkles size={18} className="text-[#37352f] group-hover:text-yellow-500 transition-colors" />
             </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {/* Banner */}
          <div className="h-[210px] w-full bg-[#3d5045] relative overflow-hidden">
            {/* Textured background simulation */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Content Body */}
          <div className="max-w-[1160px] mx-auto px-16 py-14 flex flex-col gap-8">
            {/* Search Section */}
            <div className="relative">
               <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                 <Search size={22} className="text-[#91918e]" strokeWidth={2} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search anything..." 
                 className="w-full h-[60px] pl-14 pr-24 rounded-2xl border-none bg-[#f1f1f1] text-[17px] focus:ring-2 focus:ring-[#efefee] placeholder-[#91918e] transition-shadow shadow-sm"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-[#e5e5e5] rounded-xl transition-colors bg-white/50">
                    <LayoutGrid size={18} className="text-[#37352f]" />
                  </button>
                  <button className="p-2 hover:bg-[#e5e5e5] rounded-xl transition-colors">
                    <List size={18} className="text-[#6b6b6b]" />
                  </button>
               </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              <button className="px-5 py-2 rounded-full border border-transparent text-[13px] font-semibold bg-[#efefee] text-[#37352f] shadow-sm">All results</button>
              <button className="px-5 py-2 rounded-full border border-[#efefee] text-[13px] font-medium text-[#6b6b6b] flex items-center gap-2 hover:bg-[#fbfbfa] transition-all hover:shadow-sm">
                <FileText size={15} className="text-[#91918e]" /> Notes
              </button>
              <button className="px-5 py-2 rounded-full border border-[#efefee] text-[13px] font-medium text-[#6b6b6b] flex items-center gap-2 hover:bg-[#fbfbfa] transition-all hover:shadow-sm">
                <Trash2 size={15} className="text-[#91918e]" /> Trash
              </button>
            </div>

            {/* Title Section */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] font-bold font-serif tracking-tight text-[#37352f]">Workspace</h1>
                <button className="p-1.5 text-[#91918e] hover:bg-[#efefee] rounded-lg mt-1 transition-colors">
                   <Plus size={22} />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[#91918e] text-[13px] font-medium hover:bg-[#efefee] px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[#efefee]">
                <span>Date created</span>
                <SlidersHorizontal size={14} strokeWidth={2.5} />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2">
               <div className="group cursor-pointer flex flex-col gap-3">
                  <div className="aspect-[1.35/1] bg-[#fbfbfa] rounded-2xl border border-[#efefee] p-7 flex flex-col gap-2 relative overflow-hidden transition-all duration-300 group-hover:border-[#e3e3e2] group-hover:shadow-md group-hover:-translate-y-1">
                    <div className="bg-white rounded-xl p-5 shadow-sm text-[12px] flex flex-col gap-3 leading-relaxed h-full overflow-hidden border border-[#f5f5f4]">
                       <div className="font-bold text-[13px] text-[#37352f]">Welcome to Spirit ✨</div>
                       <div className="text-[#6b6b6b]">
                         This is your workspace. Everything you put here like videos, links, notes, and files... <span className="italic font-medium">Spirit remembers and understands.</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-1.5">
                     <div className="w-5 h-5 flex items-center justify-center">
                        <FileText size={16} className="text-[#6b6b6b]" />
                     </div>
                     <span className="text-[14px] font-semibold text-[#37352f] flex-1 truncate">Welcome to E...</span>
                     <span className="text-[11px] font-medium text-[#91918e] uppercase tracking-wider">Now</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Floating action bar indicator at bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
           <div className="w-[50px] h-1.5 bg-[#d1d1d0] rounded-full opacity-40"></div>
        </div>
      </main>
    </div>
  );
};

export default SpiritUI;
