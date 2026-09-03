export type FieldTarget =
  | 'patientName' | 'age' | 'sex' | 'contact'
  | 'chiefComplaints' | 'onExamination' | 'diagnosis' | 'investigation' | 'treatment'
  | 'medications.0.name';

export interface FieldMatch {
  field: FieldTarget;
  value: string;
  mode: 'set' | 'append';
}

interface FieldPattern {
  field: FieldTarget;
  regex: RegExp;
  mode: 'set' | 'append';
  normalize?: (raw: string) => string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Stops a field's captured value at the next recognizable trigger phrase (or end of
// string), so one field's dictation doesn't swallow the next field's content.
const BOUNDARY =
  "(?=\\s*\\b(?:patient(?:'s)?\\s*name|age(?:\\s*is)?\\s*\\d|gender|sex|phone|contact|mobile|" +
  "complaints?|symptoms?|(?:on|one) examination|diagnos|investigations?|treatment|medications?|" +
  "prescri(?:be|bing|ption)|complain(?:s|ing)?\\s*of|presenting with|save\\s*(?:and|&)?\\s*print|" +
  "save the prescription|submit|print prescription)\\b|$)";

export const FIELD_PATTERNS: FieldPattern[] = [
  { field: 'contact', regex: new RegExp(`\\b(?:phone|contact|mobile)\\b(?:\\s*number)?\\s*(?:is)?\\s*((?:\\d[\\d\\s-]*){8,15})`, 'i'), mode: 'set' },
  { field: 'age', regex: new RegExp(`\\bage\\b\\s*(?:is|of)?\\s*(\\d{1,3})\\b`, 'i'), mode: 'set' },
  { field: 'sex', regex: new RegExp(`\\b(?:gender|sex)\\b\\s*(?:is)?\\s*(mail|male|female|other)\\b`, 'i'), mode: 'set', normalize: (v) => capitalize(v.toLowerCase() === 'mail' ? 'male' : v) },
  { field: 'patientName', regex: new RegExp(`\\bpatient(?:'s)?\\s*name\\b\\s*(?:is)?\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'set' },

  { field: 'diagnosis', regex: new RegExp(`\\bdiagnos(?:is|ed with)\\b\\s*(?:is)?\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'set' },
  // accepts "on examination" or the common mis-hearing "one examination"
  { field: 'onExamination', regex: new RegExp(`\\b(?:on|one) examination\\b\\s*(?:is|shows|reveals)?\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'append' },
  { field: 'investigation', regex: new RegExp(`\\binvestigations?\\b\\s*(?:is|are|shows?)?\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'append' },
  { field: 'treatment', regex: new RegExp(`\\btreatment\\b\\s*(?:is|plan is)?\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'append' },
  { field: 'medications.0.name', regex: new RegExp(`\\b(?:medications?|prescri(?:be|bing|ption))\\b\\s*(?:is|are)?\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'append' },
  // "complaints" alone is the primary trigger now — short, robust word.
  // "chief complaints" / "complain of" / "presenting with" still work as fallbacks.
  { field: 'chiefComplaints', regex: new RegExp(`\\b(?:chief\\s*)?complaints?\\b\\s*(?:is|are)?\\s*(.+?)${BOUNDARY}|\\bcomplain(?:s|ing)?\\s*of\\s*(.+?)${BOUNDARY}|\\bpresenting with\\s*(.+?)${BOUNDARY}`, 'i'), mode: 'append' },
];

const SAVE_COMMAND = /\b(?:save\s*(?:and|&)?\s*print|save the prescription|submit(?:\s*the)?\s*prescription|print prescription)\b/i;

export function matchSaveCommand(segment: string): boolean {
  return SAVE_COMMAND.test(segment);
}

export function matchAllFieldsInText(text: string): FieldMatch[] {
  const results: FieldMatch[] = [];
  for (const pattern of FIELD_PATTERNS) {
    const match = text.match(pattern.regex);
    if (match) {
      let value = match.slice(1).find(Boolean)?.trim();
      if (value) {
        if (pattern.normalize) value = pattern.normalize(value);
        results.push({ field: pattern.field, value, mode: pattern.mode });
      }
    }
  }
  return results;
}