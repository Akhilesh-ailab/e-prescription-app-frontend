import type { ReactNode, ChangeEvent } from 'react';

interface AuthInputProps {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}

export default function AuthInput({ icon, placeholder, value, onChange, error, type = 'text', autoComplete }: AuthInputProps) {
  return (
    <div>
      <div className="relative">
        <span className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-slate-50 border rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-shadow ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15 bg-red-50/40'
              : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
          }`}
        />
      </div>
      {error && <p className="text-[10px] text-accent-500 mt-1 pl-1">{error}</p>}
    </div>
  );
}