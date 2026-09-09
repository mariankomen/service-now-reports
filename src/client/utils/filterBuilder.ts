// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterCondition = {
  id: string;
  field: string;         // full field id e.g. "SN.active" / "SF.Status" (legacy: bare SN element e.g. "active")
  operator: string;      // "=", "!=", "LIKE", etc.
  value: string;         // value sent to the query: choice value, reference sys_id, number, ISO date
  displayValue?: string; // human readable label of `value` (choice label / referenced record name)
};

// Structural subset of AvailableField — keeps this module free of component imports
export type FilterFieldMeta = {
  id?: string;
  type?: string;
  choices?: { label: string; value: string }[];
  referenceTable?: string;
};

// ─── Field id helpers ─────────────────────────────────────────────────────────
// Legacy saved conditions stored the bare SN element name without a prefix

export const normalizeFieldId = (field: string): string =>
  field.startsWith('SF.') || field.startsWith('SN.') ? field : `SN.${field}`;

export const isSalesforceCondition = (c: FilterCondition): boolean =>
  normalizeFieldId(c.field).startsWith('SF.');

export const hasSalesforceConditions = (conditions: FilterCondition[]): boolean =>
  conditions.some(isSalesforceCondition);

export const findField = (
  fields: FilterFieldMeta[] | undefined,
  field: string
): FilterFieldMeta | undefined =>
  fields?.find(f => f.id === normalizeFieldId(field));

// ─── Field type groups ────────────────────────────────────────────────────────

const NUMERIC_TYPES = [
  'integer', 'decimal', 'float', 'long', 'double', 'int', 'number',
  'currency', 'currency2', 'price', 'percent', 'percent_complete',
];
const DATE_TYPES     = ['glide_date', 'date'];
const DATETIME_TYPES = ['glide_date_time', 'glide_duration', 'due_date', 'datetime', 'datetime2'];
const TIME_TYPES     = ['glide_time', 'time'];

export const isNumericType  = (type?: string): boolean => NUMERIC_TYPES.includes(type ?? '');
export const isDateType     = (type?: string): boolean => DATE_TYPES.includes(type ?? '');
export const isDateTimeType = (type?: string): boolean => DATETIME_TYPES.includes(type ?? '');
export const isTimeType     = (type?: string): boolean => TIME_TYPES.includes(type ?? '');

// ─── Operators by field type ──────────────────────────────────────────────────

const stringOps = [
  { label: 'is',            value: '='          },
  { label: 'is not',        value: '!='         },
  { label: 'contains',      value: 'LIKE'       },
  { label: 'starts with',   value: 'STARTSWITH' },
  { label: 'ends with',     value: 'ENDSWITH'   },
  { label: 'is empty',      value: 'ISEMPTY'    },
  { label: 'is not empty',  value: 'ISNOTEMPTY' },
];

const numericOps = [
  { label: 'equals',            value: '='  },
  { label: 'not equals',        value: '!=' },
  { label: 'greater than',      value: '>'  },
  { label: 'less than',         value: '<'  },
  { label: 'greater or equal',  value: '>=' },
  { label: 'less or equal',     value: '<=' },
  { label: 'is empty',          value: 'ISEMPTY'    },
  { label: 'is not empty',      value: 'ISNOTEMPTY' },
];

const booleanOps = [
  { label: 'is true',  value: '=true'  },
  { label: 'is false', value: '=false' },
];

const dateOps = [
  { label: 'is',           value: '='  },
  { label: 'before',       value: '<'  },
  { label: 'after',        value: '>'  },
  { label: 'on or before', value: '<=' },
  { label: 'on or after',  value: '>=' },
  { label: 'is empty',     value: 'ISEMPTY'    },
  { label: 'is not empty', value: 'ISNOTEMPTY' },
];

// Choice and reference values are picked from a list, so only exact matching applies
const choiceOps = [
  { label: 'is',           value: '='  },
  { label: 'is not',       value: '!=' },
  { label: 'is empty',     value: 'ISEMPTY'    },
  { label: 'is not empty', value: 'ISNOTEMPTY' },
];

const TYPE_MAP: Record<string, { label: string; value: string }[]> = {
  string:            stringOps,
  translated_field:  stringOps,
  translated_text:   stringOps,
  html:              stringOps,
  url:               stringOps,
  email:             stringOps,
  phone_number:      stringOps,
  reference:         stringOps,
  glide_list:        stringOps,
  GUID:              stringOps,
  integer:           numericOps,
  decimal:           numericOps,
  float:             numericOps,
  long:              numericOps,
  boolean:           booleanOps,
  glide_date:        dateOps,
  glide_date_time:   dateOps,
  due_date:          dateOps,
  glide_time:        dateOps,
  // ─── Salesforce field types ───
  picklist:          stringOps,
  multipicklist:     stringOps,
  combobox:          stringOps,
  textarea:          stringOps,
  id:                stringOps,
  encryptedstring:   stringOps,
  address:           stringOps,
  currency:          numericOps,
  currency2:         numericOps,
  double:            numericOps,
  int:               numericOps,
  percent:           numericOps,
  number:            numericOps,
  date:              dateOps,
  datetime:          dateOps,
  time:              dateOps,
};

export const getOperatorsForType = (type: string): { label: string; value: string }[] =>
  TYPE_MAP[type] ?? stringOps;

// Field-aware operator list — choice and reference fields override their raw type
export const getOperatorsForField = (
  field: FilterFieldMeta | undefined
): { label: string; value: string }[] => {
  if (field?.choices?.length) return choiceOps;
  if (field?.referenceTable)  return choiceOps;
  return getOperatorsForType(field?.type ?? 'string');
};

export const isBooleanOperator = (operator: string): boolean =>
  operator === '=true' || operator === '=false';

export const isEmptyOperator = (operator: string): boolean =>
  operator === 'ISEMPTY' || operator === 'ISNOTEMPTY';

// ─── Value input kind ─────────────────────────────────────────────────────────
// Single source of truth shared by the input component and the comparison logic

export type FilterInputKind =
  | 'none' | 'choice' | 'reference' | 'number' | 'date' | 'datetime' | 'time' | 'text';

export const getInputKind = (
  field: FilterFieldMeta | undefined,
  operator: string
): FilterInputKind => {
  if (isEmptyOperator(operator) || isBooleanOperator(operator)) return 'none';
  if (field?.choices?.length) return 'choice';
  if (field?.referenceTable)  return 'reference';

  const type = field?.type ?? 'string';
  if (isNumericType(type))  return 'number';
  if (isDateType(type))     return 'date';
  if (isDateTimeType(type)) return 'datetime';
  if (isTimeType(type))     return 'time';
  return 'text';
};

// ─── Default logic string ─────────────────────────────────────────────────────

export const buildDefaultLogic = (conditions: FilterCondition[]): string =>
  conditions.map((_, i) => i + 1).join(' AND ');

// ─── Value parsing helpers ────────────────────────────────────────────────────

const toNumber = (raw: any): number =>
  parseFloat(String(raw ?? '').replace(/[$,%\s]/g, ''));

const toTimestamp = (raw: any): number => {
  const text = String(raw ?? '').trim();
  if (!text) return NaN;
  // "2026-05-26 10:30:00" is not valid ISO — the T makes Date.parse consistent
  const isoish = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(text) ? text.replace(' ', 'T') : text;
  const parsed = Date.parse(isoish);
  return isNaN(parsed) ? Date.parse(text) : parsed;
};

const toDayKey = (raw: any): string => {
  const text = String(raw ?? '').trim();
  const iso = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const stamp = toTimestamp(text);
  if (isNaN(stamp)) return '';
  const date = new Date(stamp);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day   = `0${date.getDate()}`.slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
};

// ─── ServiceNow encoded query value ───────────────────────────────────────────
// Date-time inputs produce "2026-05-26T10:30"; ServiceNow expects "2026-05-26 10:30:00".
// Detected from the value shape so it also works before field metadata is loaded.

export const encodeQueryValue = (value: string): string => {
  if (!value) return '';
  const parts = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:\d{2})?$/);
  return parts ? `${parts[1]} ${parts[2]}${parts[3] ?? ':00'}` : value;
};

// ─── Client-side condition evaluation ────────────────────────────────────────
// Used for Salesforce fields (the server can only filter the SN table) and for
// mixed SF/SN logic. Values are compared against the display values in the row.

const isEmptyValue = (raw: any): boolean =>
  raw == null || String(raw).trim() === '' || String(raw) === '-';

const conditionMatches = (
  row: Record<string, any>,
  c: FilterCondition,
  field: FilterFieldMeta | undefined
): boolean => {
  const raw = row[normalizeFieldId(c.field)];
  const op  = c.operator;

  if (op === 'ISEMPTY')    return isEmptyValue(raw);
  if (op === 'ISNOTEMPTY') return !isEmptyValue(raw);

  // Booleans reach the grid as display values, which vary by system ("true"/"Yes"/"1")
  if (op === '=true' || op === '=false') {
    const text = String(raw).trim().toLowerCase();
    const isTrue = text === 'true' || text === 'yes' || text === '1';
    return op === '=true' ? isTrue : !isTrue;
  }

  const rowStr = raw == null ? '' : String(raw);
  const type   = field?.type;

  // ─── Numbers ───────────────────────────────────────────────────────────────
  if (isNumericType(type)) {
    const rowNum = toNumber(rowStr);
    const valNum = toNumber(c.value);
    if (!isNaN(rowNum) && !isNaN(valNum)) {
      if (op === '=')  return rowNum === valNum;
      if (op === '!=') return rowNum !== valNum;
      if (op === '>')  return rowNum > valNum;
      if (op === '<')  return rowNum < valNum;
      if (op === '>=') return rowNum >= valNum;
      if (op === '<=') return rowNum <= valNum;
    }
  }

  // ─── Dates ─────────────────────────────────────────────────────────────────
  if (isDateType(type) || isDateTimeType(type)) {
    if (op === '=' || op === '!=') {
      const rowDay = toDayKey(rowStr);
      const valDay = toDayKey(c.value);
      if (rowDay && valDay) return op === '=' ? rowDay === valDay : rowDay !== valDay;
    }
    const rowStamp = toTimestamp(rowStr);
    const valStamp = toTimestamp(c.value.replace('T', ' '));
    if (!isNaN(rowStamp) && !isNaN(valStamp)) {
      if (op === '>')  return rowStamp > valStamp;
      if (op === '<')  return rowStamp < valStamp;
      if (op === '>=') return rowStamp >= valStamp;
      if (op === '<=') return rowStamp <= valStamp;
    }
  }

  // ─── Text, choices and references ──────────────────────────────────────────
  // Rows hold display values, so a picked choice/reference is matched by either
  // its stored value or its label
  const candidates: string[] = [];
  if (c.value) candidates.push(c.value.toLowerCase());
  if (c.displayValue && !candidates.includes(c.displayValue.toLowerCase())) {
    candidates.push(c.displayValue.toLowerCase());
  }
  if (!candidates.length) candidates.push('');

  const a = rowStr.toLowerCase();

  if (op === '=')          return candidates.some(b => a === b);
  if (op === '!=')         return !candidates.some(b => a === b);
  if (op === 'LIKE')       return candidates.some(b => a.includes(b));
  if (op === 'STARTSWITH') return candidates.some(b => a.startsWith(b));
  if (op === 'ENDSWITH')   return candidates.some(b => a.endsWith(b));

  // Ordered comparison fallback: numeric first, then date, then string
  const valStr = String(c.value ?? '');
  const numA = toNumber(rowStr);
  const numB = toNumber(valStr);
  let cmp: number;
  if (!isNaN(numA) && !isNaN(numB)) {
    cmp = numA - numB;
  } else {
    const dateA = toTimestamp(rowStr);
    const dateB = toTimestamp(valStr);
    cmp = !isNaN(dateA) && !isNaN(dateB) ? dateA - dateB : rowStr.localeCompare(valStr);
  }
  if (op === '>')  return cmp > 0;
  if (op === '<')  return cmp < 0;
  if (op === '>=') return cmp >= 0;
  if (op === '<=') return cmp <= 0;
  return true;
};

export const evaluateConditions = (
  row: Record<string, any>,
  conditions: FilterCondition[],
  logic: string,
  fields?: FilterFieldMeta[]
): boolean => {
  if (!conditions.length) return true;

  const expr   = (logic && logic.trim()) || buildDefaultLogic(conditions);
  const tokens = expr.toUpperCase().match(/\d+|AND|OR|\(|\)/g) ?? [];
  let pos = 0;

  const parseExpr = (): boolean => {           // OR level
    let left = parseTerm();
    while (tokens[pos] === 'OR') { pos++; const right = parseTerm(); left = left || right; }
    return left;
  };
  const parseTerm = (): boolean => {           // AND level
    let left = parseFactor();
    while (tokens[pos] === 'AND') { pos++; const right = parseFactor(); left = left && right; }
    return left;
  };
  const parseFactor = (): boolean => {
    const token = tokens[pos];
    if (token === '(') {
      pos++;
      const val = parseExpr();
      if (tokens[pos] === ')') pos++;
      return val;
    }
    pos++;
    const c = conditions[parseInt(token ?? '') - 1];
    return c ? conditionMatches(row, c, findField(fields, c.field)) : true;
  };

  try { return parseExpr(); } catch { return true; }
};

// ─── Build ServiceNow encoded query ──────────────────────────────────────────

export const buildEncodedQuery = (
  conditions: FilterCondition[],
  logic: string
): string => {
  if (!conditions.length) return '';

  // Salesforce conditions are evaluated client-side. When they are mixed with
  // OR logic, pre-filtering by the SN part on the server would drop rows that
  // only match the SF part — so the whole filter moves to the client.
  if (hasSalesforceConditions(conditions) && /\bOR\b/i.test(logic)) return '';

  // Build encoded string per condition (SN element name without prefix)
  const encodeCondition = (c: FilterCondition): string => {
    const el = normalizeFieldId(c.field).replace('SN.', '');
    if (isEmptyOperator(c.operator)) return `${el}${c.operator}`;
    if (isBooleanOperator(c.operator)) return `${el}${c.operator}`;

    // ServiceNow drops empty values from "!=" results, so "Priority is not 1"
    // would hide every record without a priority. Empty values are added back
    // to match how the client-side evaluation and Salesforce reports behave.
    // "^OR" binds to the preceding condition, so this stays one logical group.
    if (c.operator === '!=') {
      return `${el}!=${encodeQueryValue(c.value)}^OR${el}ISEMPTY`;
    }

    return `${el}${c.operator}${encodeQueryValue(c.value)}`;
  };

  // Parse the logic string and build encoded query
  // Supports: "1 AND 2 AND 3", "1 AND (2 OR 3)", "(1 OR 2) AND 3"
  let result = logic.trim().toUpperCase();

  // Replace condition numbers with their encoded strings
  // We go in reverse order to avoid replacing "1" inside "10", "11", etc.
  for (let i = conditions.length; i >= 1; i--) {
    result = result.replace(
      new RegExp(`\\b${i}\\b`, 'g'),
      `__COND_${i - 1}__`
    );
  }

  // Tokenize: split by AND/OR preserving parentheses context
  // Simplified: flatten parentheses and resolve AND/OR
  result = result.replace(/[()]/g, ''); // remove parens for now (simplified)

  const tokens = result.split(/\s+/);
  let encoded = '';
  let nextIsOr = false;

  for (const token of tokens) {
    if (token === 'AND') { nextIsOr = false; continue; }
    if (token === 'OR')  { nextIsOr = true;  continue; }

    const match = token.match(/^__COND_(\d+)__$/);
    if (!match) continue;

    const idx = parseInt(match[1]);
    const c = conditions[idx];
    if (!c) continue;
    if (isSalesforceCondition(c)) continue; // SF conditions are applied client-side

    const condStr = encodeCondition(c);

    if (encoded === '') {
      encoded = condStr;
    } else {
      encoded += nextIsOr ? `^OR${condStr}` : `^${condStr}`;
    }
    nextIsOr = false;
  }

  return encoded;
};
