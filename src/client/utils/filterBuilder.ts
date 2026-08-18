// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterCondition = {
  id: string;
  field: string;      // SN field element e.g. "active"
  operator: string;   // "=", "!=", "LIKE", etc.
  value: string;      // "true", "software", etc.
};

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

// ─── Build ServiceNow encoded query ──────────────────────────────────────────

export const buildEncodedQuery = (
  conditions: FilterCondition[],
  logic: string
): string => {
  if (!conditions.length) return '';

  // Build encoded string per condition
  const encodeCondition = (c: FilterCondition): string => {
    if (isEmptyOperator(c.operator)) return `${c.field}${c.operator}`;
    if (isBooleanOperator(c.operator)) return `${c.field}${c.operator}`;
    return `${c.field}${c.operator}${c.value}`;
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