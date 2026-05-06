// utils/buildUpdateQuery.js
function buildUpdateQuery(table, id, payload, mapping = {}) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(payload)) {
    if (mapping[key] !== false) {
      const column = mapping[key] || key;
      fields.push(`${column} = $${index++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  fields.push('_updated_date = CURRENT_TIMESTAMP');

  return {
    query: `UPDATE ${table} SET ${fields.join(', ')} WHERE id = $${index}`,
    values: [...values, id],
  };
}

module.exports = { buildUpdateQuery };
