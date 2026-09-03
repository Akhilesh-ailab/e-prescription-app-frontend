import { useState, useEffect } from 'react';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ForgotPassword from './features/auth/ForgotPassword';
import PrescriptionForm from './features/prescription/components/PrescriptionForm';
import type { DoctorProfile } from './features/prescription/types';
import { getSession, saveSession, clearSession, registerDoctor } from './features/prescription/utils/storage';

type View = 'login' | 'signup' | 'forgot-password';

export default function App() {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [view, setView] = useState<View>('login');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setDoctor(getSession());
    setChecked(true);
  }, []);

  const handleLogin = (profile: DoctorProfile) => {
    saveSession(profile);
    setDoctor(profile);
  };

  const handleLogout = () => {
    clearSession();
    setDoctor(null);
    setView('login');
  };

  const handleSignup = (data: { fullName: string; doctorId: string; email: string; specialization: string; password: string }) => {
    const result = registerDoctor(data);
    if (!result.success) {
      alert(result.error);
      return;
    }
    handleLogin({ name: `Dr. ${data.fullName}`, designation: data.specialization });
  };

  if (!checked) return null;

  if (doctor) {
    return <PrescriptionForm doctor={doctor} onLogout={handleLogout} />;
  }

  if (view === 'signup') {
    return <Signup onSignup={handleSignup} onSwitchToLogin={() => setView('login')} />;
  }

  if (view === 'forgot-password') {
    return <ForgotPassword onSwitchToLogin={() => setView('login')} />;
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToSignup={() => setView('signup')}
      onSwitchToForgotPassword={() => setView('forgot-password')}
    />
  );
}