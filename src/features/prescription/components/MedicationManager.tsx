import { useFormContext } from 'react-hook-form';
import type { PrescriptionData } from '../types';

const label = "text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1";
const textarea = "w-full border border-slate-200 rounded-lg p-2.5 text-sm leading-relaxed focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none bg-slate-50/70 resize-none transition-shadow";

export default function MedicationManager() {
  const { register } = useFormContext<PrescriptionData>();

  return (
    <div className="flex flex-col">
      <label className={label}>Medications</label>
      <textarea
        {...register('medications.0.name')}
        rows={4}
        placeholder="e.g. Tab. Paracetamol 500mg — 1-0-1 after food for 5 days"
        className={textarea}
      />
    </div>
  );
}