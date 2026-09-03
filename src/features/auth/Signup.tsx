import { useState, type FormEvent } from 'react';
import AuthLayout from './components/AuthLayout';
import AuthInput from './components/AuthInput';
import PasswordInput from './components/PasswordInput';
import { UserIcon, MailIcon, StethoscopeIcon, AlertIcon } from './components/icons';

interface SignupFormState {
  fullName: string;
  doctorId: string;
  email: string;
  specialization: string;
  password: string;
  confirmPassword: string;
}

interface SignupProps {
  onSignup: (data: Omit<SignupFormState, 'confirmPassword'>) => Promise<string | void> | string | void;
  onSwitchToLogin: () => void;
}

export default function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [form, setForm] = useState<SignupFormState>({
    fullName: '', doctorId: '', email: '', specialization: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormState, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof SignupFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError('');
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof SignupFormState, string>> = {};

    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.doctorId.trim()) next.doctorId = 'Doctor ID is required.';
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.specialization.trim()) next.specialization = 'Specialization is required.';
    if (!form.password) {
      next.password = 'Password is required.';
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    const { confirmPassword, ...payload } = form;
    void confirmPassword;

    const result = await onSignup(payload);
    setIsSubmitting(false);

    // onSignup returns a string error message on failure, or nothing on success
    if (typeof result === 'string' && result) {
      setServerError(result);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-slate-800 text-2xl font-bold mb-1">Create Account</h2>
      <p className="text-slate-400 text-xs mb-7">Register as a doctor to access the portal</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-accent-500 text-xs font-medium rounded-lg px-3 py-2.5 flex items-center gap-2">
            <AlertIcon className="w-4 h-4 shrink-0" />
            {serverError}
          </div>
        )}

        <AuthInput
          icon={<UserIcon className="w-4 h-4" />}
          placeholder="Full Name"
          value={form.fullName}
          onChange={updateField('fullName')}
          error={errors.fullName}
          autoComplete="name"
        />

        <AuthInput
          icon={<UserIcon className="w-4 h-4" />}
          placeholder="Doctor ID (e.g. R_Sharma)"
          value={form.doctorId}
          onChange={updateField('doctorId')}
          error={errors.doctorId}
          autoComplete="username"
        />

        <AuthInput
          icon={<MailIcon className="w-4 h-4" />}
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={updateField('email')}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          icon={<StethoscopeIcon className="w-4 h-4" />}
          placeholder="Specialization (e.g. General Medicine)"
          value={form.specialization}
          onChange={updateField('specialization')}
          error={errors.specialization}
        />

        <PasswordInput
          placeholder="Password"
          value={form.password}
          onChange={updateField('password')}
          error={errors.password}
          autoComplete="new-password"
        />

        <PasswordInput
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-700 active:scale-[0.98] transition shadow-md shadow-brand-600/20 disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-brand-600 font-semibold hover:text-brand-700 transition">
          Login
        </button>
      </p>
    </AuthLayout>
  );
}