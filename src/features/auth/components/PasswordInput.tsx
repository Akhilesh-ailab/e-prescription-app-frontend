import { useState, type ChangeEvent } from 'react';
import { LockIcon, EyeIcon, EyeOffIcon } from './icons';

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

export default function PasswordInput({ placeholder, value, onChange, error, autoComplete }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="relative">
        <LockIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-slate-50 border rounded-full pl-11 pr-11 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-shadow ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15 bg-red-50/40'
              : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          tabIndex={-1}
        >
          {show ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-[10px] text-accent-500 mt-1 pl-1">{error}</p>}
    </div>
  );
}