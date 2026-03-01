import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  List,
  Mail,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  FileText,
} from 'lucide-react';
import {
  cards,
  filterItems,
  quickNavItems,
  recentsLabel,
  recentItems,
  sidebarActions,
  workspaceItems,
} from '@/data/spirit';
import { FilterPill, IconButton, NavButton } from './controls';

function Sidebar() {
  return (
    <aside className="w-[240px] bg-[#fbfbfa] border-r border-[#efefee] flex flex-col p-2 gap-0.5 shrink-0">
      <div className="flex items-center justify-between mb-4 px-2 py-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] tracking-tight">spirit</span>
        </div>
        <div className="flex gap-0.5">
          <IconButton icon={Plus} size={16} />
          <button className="px-1.5 py-1 hover:bg-[#efefee] rounded-md transition-colors text-[13px] font-medium text-[#6b6b6b]">
            New
          </button>
          <IconButton icon={LayoutGrid} size={16} />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto px-1">
        {quickNavItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-2 px-2 py-1.5 bg-[#efefee] rounded-lg text-[14px] font-medium transition-colors group"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <item.icon size={16} className="text-[#37352f]" />
            </div>
            <span>{item.label}</span>
            <div className="ml-auto flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles size={14} className="text-[#91918e]" />
              <Mail size={14} className="text-[#91918e]" />
              <Search size={14} className="text-[#91918e]" />
            </div>
          </button>
        ))}

        <div className="mt-5 px-2 py-1 text-[11px] font-semibold text-[#91918e] flex items-center gap-2 uppercase tracking-widest">
          <recentsLabel.icon size={13} strokeWidth={2.5} /> {recentsLabel.label}
        </div>

        {recentItems.map((item) => (
          <NavButton key={`recent-${item.label}`} label={item.label} icon={item.icon} />
        ))}

        <button className="w-full flex items-center gap-2 px-2 py-1.5 mt-3 hover:bg-[#efefee] rounded-lg text-[14px] font-medium text-[#37352f] transition-colors">
          <div className="w-5 h-5 flex items-center justify-center">
            <Home size={16} className="text-[#37352f]" />
          </div>
          <span>Workspace</span>
        </button>

        {workspaceItems.map((item) => (
          <NavButton key={`workspace-${item.label}`} label={item.label} icon={item.icon} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 p-1">
        <div className="flex items-center gap-1 px-1 mb-1">
          {sidebarActions.map((item) => (
            <IconButton key={item.label} icon={item.icon} size={17} iconClassName="text-[#91918e]" className="p-2" />
          ))}
          <IconButton icon={Sparkles} size={17} iconClassName="text-[#91918e]" className="p-2" />
          <IconButton icon={Settings} size={17} iconClassName="text-[#91918e]" className="p-2" />
        </div>
        <button className="w-full flex items-center gap-2 px-2 py-2 hover:bg-[#efefee] rounded-lg text-[14px] border-t border-[#efefee] pt-3 mt-1">
          <div className="w-7 h-7 rounded-md bg-[#e3e2e0] flex items-center justify-center font-bold text-[12px] text-[#37352f]">
            S
          </div>
          <div className="flex flex-col items-start leading-tight overflow-hidden">
            <span className="font-medium text-[#37352f]">Sam</span>
            <span className="text-[11px] text-[#91918e]">Free plan</span>
          </div>
          <ChevronDown size={14} className="ml-auto text-[#91918e]" />
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="h-11 flex items-center justify-between px-4 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 mr-2">
          <IconButton icon={ChevronLeft} size={18} iconClassName="text-[#37352f]" className="p-1.5 rounded" disabled />
          <IconButton icon={ChevronRight} size={18} iconClassName="text-[#37352f]" className="p-1.5 rounded" disabled />
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
  );
}

function SearchSection() {
  return (
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
  );
}

function WorkspaceHeader() {
  return (
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
  );
}

function WorkspaceCard({ title, body, footerTitle, timestamp }: (typeof cards)[number]) {
  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      <div className="aspect-[1.35/1] bg-[#fbfbfa] rounded-2xl border border-[#efefee] p-7 flex flex-col gap-2 relative overflow-hidden transition-all duration-300 group-hover:border-[#e3e3e2] group-hover:shadow-md group-hover:-translate-y-1">
        <div className="bg-white rounded-xl p-5 shadow-sm text-[12px] flex flex-col gap-3 leading-relaxed h-full overflow-hidden border border-[#f5f5f4]">
          <div className="font-bold text-[13px] text-[#37352f]">{title}</div>
          <div className="text-[#6b6b6b]">
            {body}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 px-1.5">
        <div className="w-5 h-5 flex items-center justify-center">
          <FileText size={16} className="text-[#6b6b6b]" />
        </div>
        <span className="text-[14px] font-semibold text-[#37352f] flex-1 truncate">{footerTitle}</span>
        <span className="text-[11px] font-medium text-[#91918e] uppercase tracking-wider">{timestamp}</span>
      </div>
    </div>
  );
}

export default function SpiritUI() {
  return (
    <div className="flex h-screen bg-white text-[#1a1a1a] font-sans selection:bg-blue-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopBar />

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="h-[210px] w-full bg-[#3d5045] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="max-w-[1160px] mx-auto px-16 py-14 flex flex-col gap-8">
            <SearchSection />

            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {filterItems.map((item) => (
                <FilterPill key={item.label} label={item.label} icon={item.icon} active={item.active} />
              ))}
            </div>

            <WorkspaceHeader />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2">
              {cards.map((card) => (
                <WorkspaceCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-[50px] h-1.5 bg-[#d1d1d0] rounded-full opacity-40" />
        </div>
      </main>
    </div>
  );
}
