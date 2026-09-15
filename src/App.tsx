import { useState } from 'react';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ForgotPassword from './features/auth/ForgotPassword';
import PrescriptionForm from './features/prescription/components/PrescriptionForm';
import type { DoctorProfile } from './features/prescription/types';
import { registerDoctor } from './features/prescription/utils/storage';

type View = 'login' | 'signup' | 'forgot-password';

export default function App() {
  // No session restore — every page load starts fresh at Login/Signup,
  // even if a session was previously saved.
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [view, setView] = useState<View>('login');

  const handleLogin = (profile: DoctorProfile) => {
    setDoctor(profile);
  };

  const handleLogout = () => {
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