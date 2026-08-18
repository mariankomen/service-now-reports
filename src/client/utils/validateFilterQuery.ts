export const validateFilterQuery = (query: string): { valid: boolean; error?: string } => {
  if (!query || !query.trim()) return { valid: true };

  // ─── Security checks ──────────────────────────────────────────────────────
  const dangerous = [
    /javascript:/i,
    /gs\./i,           // GlideSystem calls
    /GlideRecord/i,
    /GlideAggregate/i,
    /eval\(/i,
    /<script/i,
    /--/,              // SQL comment
    /;\s*drop/i,       // SQL injection
    /;\s*delete/i,
    /;\s*update/i,
    /;\s*insert/i,
  ];

  for (const pattern of dangerous) {
    if (pattern.test(query)) {
      return { valid: false, error: 'Query contains disallowed keywords or patterns.' };
    }
  }

  // ─── Format check ─────────────────────────────────────────────────────────
  // Split by ^ and validate each condition
  const conditions = query.split('^');
  const validConditionPattern = /^(OR)?[\w.]+(\s*(=|!=|>=|<=|>|<|LIKE|STARTSWITH|ENDSWITH|ISEMPTY|ISNOTEMPTY)\s*.+)?$/i;

  for (const condition of conditions) {
    const trimmed = condition.trim();
    if (!trimmed) continue;
    if (!validConditionPattern.test(trimmed)) {
      return {
        valid: false,
        error: `Invalid condition: "${trimmed}". Expected format: field=value or field!=value etc.`
      };
    }
  }

  return { valid: true };
};