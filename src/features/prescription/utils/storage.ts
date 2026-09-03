import type { PrescriptionData, DoctorProfile } from '../types';

export interface SavedPrescription extends PrescriptionData {
  id: string;
  doctorName: string;
  savedAt: string;
}

export interface DoctorAccount {
  doctorId: string;
  fullName: string;
  email: string;
  specialization: string;
  password: string; // demo only — plaintext, client-side, no real backend yet
}

const SESSION_KEY = 'aiims_doctor_session';
const RECORDS_KEY = 'aiims_prescriptions';
const ACCOUNTS_KEY = 'aiims_doctor_accounts';

export function saveSession(doctor: DoctorProfile) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(doctor));
}

export function getSession(): DoctorProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getDoctorAccounts(): DoctorAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerDoctor(account: DoctorAccount): { success: boolean; error?: string } {
  const accounts = getDoctorAccounts();
  if (accounts.some((a) => a.doctorId.toLowerCase() === account.doctorId.toLowerCase())) {
    return { success: false, error: 'This Doctor ID is already registered. Please login instead.' };
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  return { success: true };
}

export function findDoctorAccount(doctorId: string, password: string): DoctorAccount | null {
  const accounts = getDoctorAccounts();
  return accounts.find(
    (a) => a.doctorId.toLowerCase() === doctorId.toLowerCase() && a.password === password
  ) || null;
}

export function savePrescription(data: PrescriptionData, doctorName: string): SavedPrescription {
  const record: SavedPrescription = {
    ...data,
    id: crypto.randomUUID(),
    doctorName,
    savedAt: new Date().toISOString(),
  };
  const existing = getPrescriptions();
  localStorage.setItem(RECORDS_KEY, JSON.stringify([record, ...existing]));
  return record;
}

export function getPrescriptions(): SavedPrescription[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deletePrescription(id: string) {
  const remaining = getPrescriptions().filter((p) => p.id !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(remaining));
}

export function resetDoctorPassword(doctorId: string, newPassword: string): boolean {
  const accounts = getDoctorAccounts();
  const index = accounts.findIndex((a) => a.doctorId.toLowerCase() === doctorId.toLowerCase());
  if (index === -1) return false;
  accounts[index].password = newPassword;
  localStorage.setItem('aiims_doctor_accounts', JSON.stringify(accounts));
  return true;
}