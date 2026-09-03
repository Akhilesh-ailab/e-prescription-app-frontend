// src/features/auth/ForgotPassword.tsx
import { useState, type FormEvent } from 'react';
import AuthLayout from './components/AuthLayout';
import AuthInput from './components/AuthInput';
import PasswordInput from './components/PasswordInput';
import { UserIcon, AlertIcon } from './components/icons';
import { getDoctorAccounts, resetDoctorPassword } from '../prescription/utils/storage';

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

type Step = 'find' | 'reset' | 'done';

export default function ForgotPassword({ onSwitchToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('find');
  const [doctorId, setDoctorId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFind = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!doctorId.trim()) {
      setError('Please enter your Doctor ID.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const exists = getDoctorAccounts().some(
        (a) => a.doctorId.toLowerCase() === doctorId.trim().toLowerCase()
      );
      setIsSubmitting(false);
      if (!exists) {
        setError('No account found with that Doctor ID.');
        return;
      }
      setStep('reset');
    }, 400);
  };

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      resetDoctorPassword(doctorId.trim(), newPassword);
      setIsSubmitting(false);
      setStep('done');
    }, 400);
  };

  return (
    <AuthLayout>
      {step === 'find' && (
        <>
          <h2 className="text-slate-800 text-2xl font-bold mb-1">Forgot Password</h2>
          <p className="text-slate-400 text-xs mb-7">Enter your Doctor ID to reset your password</p>

          <form onSubmit={handleFind} className="space-y-4">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-700 active:scale-[0.98] transition shadow-md shadow-brand-600/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Checking...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </>
      )}

      {step === 'reset' && (
        <>
          <h2 className="text-slate-800 text-2xl font-bold mb-1">Set New Password</h2>
          <p className="text-slate-400 text-xs mb-7">Choose a new password for {doctorId}</p>

          <form onSubmit={handleReset} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-accent-500 text-xs font-medium rounded-lg px-3 py-2.5 flex items-center gap-2">
                <AlertIcon className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <PasswordInput
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordInput
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-700 active:scale-[0.98] transition shadow-md shadow-brand-600/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </>
      )}

      {step === 'done' && (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-slate-800 text-xl font-bold mb-1">Password Reset</h2>
          <p className="text-slate-400 text-xs mb-6">You can now log in with your new password.</p>
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-brand-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-700 active:scale-[0.98] transition shadow-md shadow-brand-600/20"
          >
            Back to Login
          </button>
        </div>
      )}

      {step !== 'done' && (
        <p className="text-center text-xs text-slate-400 mt-6">
          Remembered your password?{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-brand-600 font-semibold hover:text-brand-700 transition">
            Login
          </button>
        </p>
      )}
    </AuthLayout>
  );
}