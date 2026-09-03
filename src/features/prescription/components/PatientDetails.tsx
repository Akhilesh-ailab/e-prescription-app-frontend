import { useFormContext } from 'react-hook-form';
import type { PrescriptionData } from '../types';

const label = "text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1";
const input = "w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none bg-white transition-shadow";

export default function PatientDetails() {
  const { register } = useFormContext<PrescriptionData>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
      <div className="flex flex-col md:col-span-2">
        <label className={label}>Patient Name*</label>
        <input {...register('patientName')} className={input} />
      </div>
      <div className="flex flex-col">
        <label className={label}>Date</label>
        <input
          type="date"
          className={`${input} text-slate-600`}
          defaultValue={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="flex flex-col">
        <label className={label}>Age*</label>
        <input {...register('age')} className={input} />
      </div>
      <div className="flex flex-col">
        <label className={label}>Gender*</label>
        <select {...register('sex')} className={`${input} text-slate-600`}>
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className={label}>Phone*</label>
        <input {...register('contact')} className={input} />
      </div>
    </div>
  );
}