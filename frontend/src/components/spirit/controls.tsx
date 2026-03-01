import type { LucideIcon } from 'lucide-react';

type IconButtonProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
};

export function IconButton({
  icon: Icon,
  size = 16,
  className,
  iconClassName,
  disabled,
}: IconButtonProps) {
  return (
    <button
      className={`p-1 hover:bg-[#efefee] rounded-md transition-colors disabled:opacity-20 ${className ?? ''}`.trim()}
      disabled={disabled}
    >
      <Icon size={size} className={iconClassName ?? 'text-[#6b6b6b]'} />
    </button>
  );
}

type NavButtonProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export function NavButton({ label, icon: Icon, active }: NavButtonProps) {
  return (
    <button
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[14px] transition-colors group ${
        active
          ? 'bg-[#efefee] font-medium text-[#37352f]'
          : 'hover:bg-[#efefee] text-[#37352f]'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <Icon size={16} className={active ? 'text-[#37352f]' : 'text-[#6b6b6b]'} />
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
}

type FilterPillProps = {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
};

export function FilterPill({ label, icon: Icon, active }: FilterPillProps) {
  return (
    <button
      className={`px-5 py-2 rounded-full text-[13px] transition-all ${
        active
          ? 'border border-transparent font-semibold bg-[#efefee] text-[#37352f] shadow-sm'
          : 'border border-[#efefee] font-medium text-[#6b6b6b] flex items-center gap-2 hover:bg-[#fbfbfa] hover:shadow-sm'
      }`}
    >
      {Icon ? <Icon size={15} className="text-[#91918e]" /> : null}
      {label}
    </button>
  );
}
