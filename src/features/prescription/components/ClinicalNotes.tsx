import { useFormContext } from 'react-hook-form';
import type { PrescriptionData } from '../types';

const label = "text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1";
const baseTextarea = "w-full border rounded-lg p-2.5 text-sm leading-relaxed outline-none resize-none transition-shadow placeholder:text-slate-300";
const validTextarea = "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 bg-white";
const errorTextarea = "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15 bg-red-50/40";

export default function ClinicalNotes() {
  const { register, formState: { errors } } = useFormContext<PrescriptionData>();

  return (
    <div className="space-y-3">
      <div className="flex flex-col">
        <label className={label}>Complaints*</label>
        <textarea
          {...register('chiefComplaints', { required: 'Required' })}
          rows={2}
          className={`${baseTextarea} ${errors.chiefComplaints ? errorTextarea : validTextarea}`}
        />
        {errors.chiefComplaints && (
          <span className="text-[10px] text-accent-500 mt-1">{errors.chiefComplaints.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className={label}>On Examination</label>
        <textarea
          {...register('onExamination')}
          rows={2}
          className={`${baseTextarea} ${validTextarea}`}
        />
      </div>

      <div className="flex flex-col">
        <label className={label}>Diagnosis*</label>
        <textarea
          {...register('diagnosis', { required: 'Required' })}
          rows={2}
          className={`${baseTextarea} ${errors.diagnosis ? errorTextarea : validTextarea}`}
        />
        {errors.diagnosis && (
          <span className="text-[10px] text-accent-500 mt-1">{errors.diagnosis.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className={label}>Investigation</label>
        <textarea
          {...register('investigation')}
          rows={2}
          className={`${baseTextarea} ${validTextarea}`}
        />
      </div>
    </div>
  );
}