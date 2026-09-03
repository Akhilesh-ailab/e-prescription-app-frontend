import { useState, useCallback, type ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import PatientDetails from './PatientDetails';
import ClinicalNotes from './ClinicalNotes';
import MedicationManager from './MedicationManager';
import PrescriptionHistory from './PrescriptionHistory';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useVoiceFieldParser } from '../hooks/useVoiceFieldParser';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { savePrescription } from '../utils/storage';
import type { PrescriptionData, DoctorProfile } from '../types';


export default function PrescriptionForm({ doctor, onLogout }: { doctor: DoctorProfile, onLogout: () => void }) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const { isRecording, startListening, stopListening, volume, error: recError, dismissError: dismissRecError } = useVoiceRecorder();

  const methods = useForm<PrescriptionData>({
    defaultValues: {
      patientName: '', age: '', sex: '', contact: '',
      chiefComplaints: '', onExamination: '', diagnosis: '', investigation: '', treatment: '',
      medications: [{ name: '', dosage: '', frequency: '' }]
    }
  });

  const onSubmit = useCallback((data: PrescriptionData) => {
    savePrescription(data, doctor.name);
    setSaveMessage('Prescription saved successfully.');
    setTimeout(() => setSaveMessage(null), 3000);
    setTimeout(() => window.print(), 200);
  }, [doctor.name]);

  const { handleSegment } = useVoiceFieldParser(
    methods.setValue,
    methods.getValues,
    () => methods.handleSubmit(onSubmit)()
  );
  const { start: startSTT, stop: stopSTT, interimText, fullTranscript, error: sttError, dismissError: dismissSttError } = useSpeechToText(handleSegment);

  const toggleSidebar = useCallback(() => setIsAiSidebarOpen((prev) => !prev), []);
  const todayLabel = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleToggleListening = useCallback(() => {
    if (isRecording) {
      stopListening();
      stopSTT();
    } else {
      startListening();
      startSTT();
    }
  }, [isRecording, startListening, stopListening, startSTT, stopSTT]);

  const micError = recError || sttError;
  const dismissMicError = () => { dismissRecError(); dismissSttError(); };

  if (showHistory) {
    return <PrescriptionHistory onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans">

      {/* Save toast */}
      {saveMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 print:hidden">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {saveMessage}
        </div>
      )}

      {/* Top Navbar — always visible */}
      <div className="w-full bg-brand-700 text-white px-3 md:px-6 py-2.5 flex justify-between items-center shadow-lg z-30 shrink-0 print:hidden">
        <div className="flex items-center gap-2.5">
          <img src="/aiims-logo.png" alt="AIIMS" className="h-8 w-8 bg-white rounded-full p-0.5 object-contain shadow-sm" />
          <div className="leading-tight">
            <p className="font-bold tracking-wide text-xs md:text-sm">AIIMS E-Prescription</p>
            <p className="hidden md:block text-[10px] text-blue-200">{todayLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowHistory(true)} className="text-[10px] text-blue-200 hover:text-white font-medium transition border border-white/20 rounded-full px-3 py-1 hover:bg-white/10">
            History
          </button>
          <span className="hidden md:inline text-[11px] text-blue-100 font-medium">{doctor.name}</span>
          <button onClick={onLogout} className="hidden lg:inline text-[10px] text-blue-200 hover:text-white font-medium transition border border-white/20 rounded-full px-3 py-1 hover:bg-white/10">
            Logout
          </button>
          <button onClick={toggleSidebar} className="lg:hidden focus:outline-none px-2.5 py-1.5 bg-white/15 rounded-full flex items-center gap-1.5 transition hover:bg-white/25 active:scale-95">
            {isAiSidebarOpen ? (
              <CloseIcon />
            ) : (
              <>
                <MicIcon className={`w-4 h-4 text-white ${isRecording ? 'animate-bounce text-red-200' : 'animate-pulse'}`} />
                <span className="text-[10px] font-semibold">{isRecording ? 'Listening...' : 'AI Voice'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        <div className="flex-1 overflow-y-auto pt-4 pb-6 px-2 sm:px-6 flex justify-center w-full print:overflow-visible print:pt-0 print:px-0">
          <div className="rx-print-container w-full max-w-[210mm] my-auto bg-white relative flex flex-col shrink-0 rounded-xl overflow-hidden ring-1 ring-slate-200 lg:shadow-[0_10px_45px_rgba(15,23,42,0.12)]">

            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center rx-watermark"></div>

            {/* Prescription Header */}
            <div className="relative z-10 bg-brand-700 px-5 py-5 md:px-7 md:py-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white p-1.5 rounded-full shadow-md shrink-0">
                  <img src="/aiims-logo.png" alt="AIIMS Logo" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold tracking-wide leading-tight">{doctor.name}</h1>
                  <p className="text-blue-100 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-semibold">MBBS, MD — General Medicine</p>
                  <p className="text-blue-200/80 text-[10px] md:text-xs mt-0.5">All India Institute of Medical Sciences, Raipur</p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-accent-500 via-brand-500 to-accent-500 relative z-10"></div>

            <div className="relative z-10 p-4 md:p-7 flex-1 flex flex-col gap-5">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-5">

                  <Section title="Patient Information" icon={<UserIcon />}>
                    <PatientDetails />
                  </Section>

                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-serif font-bold text-brand-700 tracking-tighter">℞</div>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>

                  <Section title="Clinical Assessment" icon={<ClipboardIcon />}>
                    <ClinicalNotes />
                  </Section>

                  <Section title="Medication" icon={<PillIcon />}>
                    <MedicationManager />
                  </Section>

                  <div className="mt-2 pt-4 border-t border-slate-100 flex justify-center gap-3 print:hidden">
                    <button
                      type="button"
                      onClick={() => methods.reset()}
                      className="border border-slate-300 text-slate-600 text-xs font-semibold py-2.5 px-6 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition w-1/3 md:w-auto"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-600 text-white text-xs font-semibold py-2.5 px-8 rounded-lg hover:bg-brand-700 active:scale-[0.98] transition shadow-md shadow-brand-600/20 w-2/3 md:w-auto"
                    >
                      Save & Print
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>

        {isAiSidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity print:hidden" onClick={toggleSidebar}></div>
        )}

        {/* AI Sidebar — bottom sheet on mobile, static right panel on desktop */}
        <div className={`
          fixed lg:static bottom-0 lg:bottom-auto left-0 lg:left-auto right-0 lg:right-0
          h-[72vh] lg:h-full w-full lg:w-72 bg-slate-900 flex flex-col z-50 shrink-0
          rounded-t-2xl lg:rounded-none print:hidden
          transform transition-transform duration-300 ease-in-out
          ${isAiSidebarOpen ? 'translate-y-0' : 'translate-y-full'} lg:translate-y-0 lg:translate-x-0
        `}>
          <div className="lg:hidden flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20"></div>
          </div>

          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="font-bold text-white text-xs tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              AI Voice Processor
            </span>
            <div className="flex items-center gap-3">
              <button onClick={onLogout} className="lg:hidden text-[10px] text-slate-400 hover:text-red-400 font-medium transition">
                Logout
              </button>
              <button onClick={toggleSidebar} className="text-slate-400 hover:text-white transition">
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1 flex flex-col overflow-y-auto">

            {micError && (
              <div className="bg-accent-500/10 border border-accent-500/30 text-red-300 text-[11px] rounded-lg px-3 py-2.5 flex items-start gap-2">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="flex-1">{micError}</span>
                <button onClick={dismissMicError} className="shrink-0 text-red-300/70 hover:text-white">
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Acoustic Level</label>
              <select className="border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 bg-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30">
                <option>Stereo Mix (Realtek HD Audio)</option>
                <option>Default Microphone</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleToggleListening}
              className={`w-full font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 h-11 active:scale-[0.98] ${isRecording ? 'bg-accent-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-400'
                }`}
            >
              <MicIcon className={`w-4 h-4 ${!isRecording ? 'animate-pulse' : ''}`} />
              {isRecording ? 'STOP LISTENING' : 'START LISTENING'}
            </button>

            <div className={`w-full rounded-lg transition-colors overflow-hidden ${isRecording ? 'bg-red-500/10 ring-1 ring-accent-500/40' : 'bg-white/5'
              }`}>
              {isRecording ? (
                <div className="flex items-center justify-center gap-3 py-2.5">
                  <VoiceWaveform volume={volume} />
                  <span className="text-[10px] font-bold text-accent-500 tracking-wide">REC · 10s auto-cutoff</span>
                </div>
              ) : (
                <div className="text-center text-[11px] font-bold py-2 text-emerald-400 tracking-wide">System Idle</div>
              )}
            </div>

            <fieldset className="border border-white/10 p-3 rounded-lg bg-slate-800/60">
              <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">How to Dictate</legend>
              <div className="text-[10px] text-slate-300 space-y-1.5">
                <p className="font-medium text-slate-200">Just speak naturally, e.g.:</p>
                <ul className="space-y-1 list-disc pl-3 marker:text-brand-400">
                  <li>"Patient's name is Ramesh Kumar"</li>
                  <li>"Complaints — fever and cough"</li>
                  <li>"On examination — mild pallor"</li>
                  <li>"Diagnosis is viral fever"</li>
                  <li>"Treatment — rest and hydration"</li>
                  <li>"Save and print"</li>
                </ul>
              </div>
            </fieldset>

            <div className="flex flex-col flex-1 min-h-[100px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Transcript</label>
              <textarea
                readOnly
                value={fullTranscript + (interimText ? ` ${interimText}` : '')}
                className="flex-1 border border-white/10 rounded-lg p-2.5 text-[11px] bg-slate-800 text-slate-200 resize-none outline-none focus:border-brand-400"
                placeholder="Waiting for voice..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-center gap-2 shrink-0 print:hidden">
        <img src="/aiims-logo.png" alt="" className="h-3.5 w-3.5 object-contain opacity-60" />
        <span className="text-[10px] text-slate-400">AIIMS Raipur · AI Voice E-Prescription System</span>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] font-bold text-brand-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function VoiceWaveform({ volume }: { volume: number }) {
  const factors = [0.35, 0.65, 1, 0.75, 0.45];
  return (
    <div className="flex items-end justify-center gap-1 h-6">
      {factors.map((f, i) => {
        const height = Math.max(5, Math.min(24, (volume / 100) * 24 * f + 5));
        return (
          <div
            key={i}
            className="w-1 rounded-full bg-accent-500 transition-all duration-100 ease-out"
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}

function MicIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function CloseIcon({ className = "w-4 h-4 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 20.5L3.5 13.5a5 5 0 117.07-7.07l7 7a5 5 0 01-7.07 7.07zM7 10l7 7" />
    </svg>
  );
}