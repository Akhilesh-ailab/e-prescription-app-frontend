import { useState, useEffect, useCallback } from 'react';
import { getPrescriptions, deletePrescription, type SavedPrescription } from '../utils/storage';

export default function PrescriptionHistory({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<SavedPrescription[]>([]);

  useEffect(() => {
    setRecords(getPrescriptions());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deletePrescription(id);
    setRecords(getPrescriptions());
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="w-full bg-brand-700 text-white px-4 md:px-6 py-3 flex items-center gap-3 shadow-lg shrink-0">
        <button onClick={onBack} className="p-1.5 hover:bg-white/15 rounded-full transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-wide">Saved Prescriptions</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl w-full mx-auto">
        {records.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">No prescriptions saved yet</p>
            <p className="text-xs mt-1">Prescriptions you save will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="bg-white rounded-xl ring-1 ring-slate-200 shadow-sm p-4 flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{r.patientName || 'Unnamed Patient'}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Age {r.age || '—'} · {r.sex || '—'} · {r.contact || 'No contact'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {r.diagnosis || 'No diagnosis recorded'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {new Date(r.savedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · {r.doctorName}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="shrink-0 text-slate-400 hover:text-accent-500 transition p-1.5"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}