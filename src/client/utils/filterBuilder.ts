// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterCondition = {
  id: string;
  field: string;      // full field id e.g. "SN.active" / "SF.Status" (legacy: bare SN element e.g. "active")
  operator: string;   // "=", "!=", "LIKE", etc.
  value: string;      // "true", "software", etc.
};

// ─── Field id helpers ─────────────────────────────────────────────────────────
// Legacy saved conditions stored the bare SN element name without a prefix

export const normalizeFieldId = (field: string): string =>
  field.startsWith('SF.') || field.startsWith('SN.') ? field : `SN.${field}`;

export const isSalesforceCondition = (c: FilterCondition): boolean =>
  normalizeFieldId(c.field).startsWith('SF.');

export const hasSalesforceConditions = (conditions: FilterCondition[]): boolean =>
  conditions.some(isSalesforceCondition);

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

export const isBooleanOperator = (operator: string): boolean =>
  operator === '=true' || operator === '=false';

export const isEmptyOperator = (operator: string): boolean =>
  operator === 'ISEMPTY' || operator === 'ISNOTEMPTY';

// ─── Default logic string ─────────────────────────────────────────────────────

export const buildDefaultLogic = (conditions: FilterCondition[]): string =>
  conditions.map((_, i) => i + 1).join(' AND ');

// ─── Client-side condition evaluation ────────────────────────────────────────
// Used for Salesforce fields (the server can only filter the SN table) and for
// mixed SF/SN logic. Values are compared against the display values in the row.

const isEmptyValue = (raw: any): boolean =>
  raw == null || String(raw).trim() === '' || String(raw) === '-';

const conditionMatches = (row: Record<string, any>, c: FilterCondition): boolean => {
  const raw = row[normalizeFieldId(c.field)];
  const op  = c.operator;

  if (op === 'ISEMPTY')    return isEmptyValue(raw);
  if (op === 'ISNOTEMPTY') return !isEmptyValue(raw);
  if (op === '=true')      return String(raw).toLowerCase() === 'true';
  if (op === '=false')     return String(raw).toLowerCase() === 'false';

  const rowStr = raw == null ? '' : String(raw);
  const valStr = String(c.value ?? '');
  const a = rowStr.toLowerCase();
  const b = valStr.toLowerCase();

  if (op === 'LIKE')       return a.includes(b);
  if (op === 'STARTSWITH') return a.startsWith(b);
  if (op === 'ENDSWITH')   return a.endsWith(b);
  if (op === '=')          return a === b;
  if (op === '!=')         return a !== b;

  // Ordered comparison: numeric first, then date, then string
  const numA = parseFloat(rowStr.replace(/[$,]/g, ''));
  const numB = parseFloat(valStr.replace(/[$,]/g, ''));
  let cmp: number;
  if (!isNaN(numA) && !isNaN(numB)) {
    cmp = numA - numB;
  } else {
    const dateA = Date.parse(rowStr);
    const dateB = Date.parse(valStr);
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
  logic: string
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
    return c ? conditionMatches(row, c) : true;
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
    return `${el}${c.operator}${c.value}`;
  };

  // Parse the logic string and build encoded query
  // Supports: "1 AND 2 AND 3", "1 AND (2 OR 3)", "(1 OR 2) AND 3"
  let result = logic.trim().toUpperCase();

  // Replace condition numbers with their encoded strings
  // We go in reverse order to avoid replacing "1" inside "10", "11", etc.
  for (let i = conditions.length; i >= 1; i--) {
    const c = conditions[i - 1];
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