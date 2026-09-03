import { useState, type FormEvent } from 'react';
import AuthLayout from './components/AuthLayout';
import AuthInput from './components/AuthInput';
import PasswordInput from './components/PasswordInput';
import { UserIcon, AlertIcon } from './components/icons';
import type { DoctorProfile } from '../prescription/types';
import { findDoctorAccount } from '../prescription/utils/storage';

interface LoginProps {
  onLogin: (doctor: DoctorProfile) => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export default function Login({ onLogin, onSwitchToSignup, onSwitchToForgotPassword }: LoginProps) {
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!doctorId.trim() || !password.trim()) {
      setError('Please enter both Doctor ID and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const account = findDoctorAccount(doctorId.trim(), password);
      if (!account) {
        setError("Invalid Doctor ID or password. Don't have an account? Sign up below.");
        setIsSubmitting(false);
        return;
      }
      onLogin({ name: `Dr. ${account.fullName}`, designation: account.specialization });
    }, 400);
  };

  return (
    <AuthLayout>
      <h2 className="text-slate-800 text-2xl font-bold mb-1">Login</h2>
      <p className="text-slate-400 text-xs mb-7">Sign in to access the doctor portal</p>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-accent-500 text-xs font-medium rounded-lg px-3 py-2.5 flex items-center gap-2">
            <AlertIcon className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <AuthInput
          icon={<UserIcon className="w-4 h-4" />}
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          autoComplete="username"
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-slate-500 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 accent-brand-500"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-xs text-brand-600 font-medium hover:text-brand-700 transition"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-700 active:scale-[0.98] transition shadow-md shadow-brand-600/20 disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Verifying...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-brand-600 font-semibold hover:text-brand-700 transition">
          Sign Up
        </button>
      </p>
    </AuthLayout>
  );
}