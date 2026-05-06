const { createDatabasePool } = require('./config');

module.exports = {
  filterParamsIntoQuery: async (table, params, query, doTotal = true, doCount = true) => {
    let filtered = '';
    let count = '';
    let total = '';
    let filterWhere = '';
    params = {
      ...(params || {}),
      limit: params?.limit || 10,
    };
    const originQuery = query;
    const pool = await createDatabasePool();
    const ws = ' ';
    const filter = params?.filter && JSON.parse(params.filter);
    const where = 'WHERE';
    const orderBy = 'ORDER BY';
    const limit = 'LIMIT';
    const offset = 'OFFSET';

    // todo: filter
    if (filter && filter?.where) {
      filtered += ws;
      filtered += query?.toLowerCase()?.includes(where.toLowerCase()) ? 'AND' : 'WHERE';
      filtered += ws;
      filtered += filter?.where;
      filterWhere = filtered;
    }
    // todo: grouping first
    query = `(${String(query || '') + filtered})`;
    filtered = '';

    if (filter && filter?.order) {
      filtered += ws;
      filtered += `${orderBy} ${filter && filter?.order}`;
    }

    filtered += ws;
    filtered += `LIMIT ${params?.limit}`;

    if (params?.page > 1) {
      params.page = (params.page - 1) * params?.limit;
      filtered += ws;
      filtered += `${offset} ${params.page}`;
    }

    // todo: reassign with order forward
    query = String(query || '') + filtered;

    total = query
      ?.split(orderBy)?.[0]
      ?.split(where)?.[0]
      ?.split('FROM')?.[1]
      ?.replaceAll('(', '')
      ?.replaceAll(')', '');
    count = `${
      originQuery?.split('FROM')?.[1]?.split(orderBy)?.[0]?.split(limit)?.[0]
    } ${filterWhere} ${limit} ${params?.limit}`;

    // console.log(originQuery);
    // console.log(filterWhere);
    // console.log(`- SELECT COUNT(${table}.id) FROM ${table} ${total}`);
    // console.log(`- SELECT COUNT(${table}.id) FROM ${table} ${count}`);
    // console.log(query);
    // console.log(`${limit}${filtered?.split(limit)?.[1]}`);

    const result = await pool.query({ text: query });

    if (doTotal) {
      try {
        if (total?.length > 0) {
          total = +(
            (
              await pool.query({
                text: `SELECT COUNT(${table}.id) FROM ${table} ${total}`,
              })
            )?.rows?.[0]?.count || 0
          );
        }
      } catch (error) {
        total = 0;
      }
    }

    if (doCount) {
      try {
        if (count?.length > 0) {
          count = +(
            (
              await pool.query({
                text: `SELECT COUNT(${table}.id) FROM ${table} ${count}`,
              })
            )?.rows?.[0]?.count || 0
          );
        }
      } catch (error) {
        count = 0;
      }
    }

    return {
      total,
      count,
      result,
      limit: params?.limit,
      filtered: (query?.split(where)?.[1] ? `where ${query?.split(where)?.[1]}` : '') + filtered,
      pages: Math.ceil((count || 1) / params.limit),
      query: String(query || ''),
    };
  },
};
