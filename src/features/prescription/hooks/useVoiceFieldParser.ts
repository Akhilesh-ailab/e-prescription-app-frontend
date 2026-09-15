import { useCallback, useRef } from 'react';
import type { UseFormSetValue, UseFormGetValues, UseFormReset, FieldPath } from 'react-hook-form';
import type { PrescriptionData } from '../types';
import { matchAllFieldsInText, matchSaveCommand, matchClearCommand, type FieldMatch } from '../utils/voiceFieldPatterns';

const MAX_BUFFER_WORDS = 20;

export function useVoiceFieldParser(
  setValue: UseFormSetValue<PrescriptionData>,
  getValues: UseFormGetValues<PrescriptionData>,
  onSaveCommand?: () => void,
  resetForm?: UseFormReset<PrescriptionData>
) {
  const bufferRef = useRef('');

  const applyMatch = useCallback((match: FieldMatch) => {
    const path = match.field as FieldPath<PrescriptionData>;
    if (match.mode === 'append') {
      const existing = (getValues(path) as string) || '';
      if (!existing.toLowerCase().includes(match.value.toLowerCase())) {
        setValue(path, (existing ? `${existing} ${match.value}` : match.value) as never, { shouldDirty: true });
      }
    } else {
      setValue(path, match.value as never, { shouldDirty: true });
    }
  }, [setValue, getValues]);

  const handleSegment = useCallback((segment: string) => {
    const clearMatch = matchClearCommand(segment);
    if (clearMatch) {
      bufferRef.current = '';
      if (clearMatch.field === 'all') {
        resetForm?.();
      } else {
        setValue(clearMatch.field as FieldPath<PrescriptionData>, '' as never, { shouldDirty: true });
      }
      return;
    }

    if (matchSaveCommand(segment)) {
      bufferRef.current = '';
      onSaveCommand?.();
      return;
    }

    const directMatches = matchAllFieldsInText(segment);
    if (directMatches.length > 0) {
      directMatches.forEach(applyMatch);
      bufferRef.current = '';
      return;
    }

    bufferRef.current = `${bufferRef.current} ${segment}`.trim();
    const bufferedMatches = matchAllFieldsInText(bufferRef.current);
    if (bufferedMatches.length > 0) {
      bufferedMatches.forEach(applyMatch);
      bufferRef.current = '';
      return;
    }

    const words = bufferRef.current.split(/\s+/);
    if (words.length > MAX_BUFFER_WORDS) {
      bufferRef.current = words.slice(-MAX_BUFFER_WORDS).join(' ');
    }
  }, [applyMatch, onSaveCommand, resetForm, setValue]);

  return { handleSegment };
}