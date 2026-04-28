const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ClientsPoliciesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addClientPolicies(clientId, policies) {
    const queryValues = policies.map((policy) => [policy.id, clientId, policy.details]);
    const query = {
      text: `INSERT INTO clients_policies (policy_id, client_id, details) 
        VALUES 
        ${queryValues.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')} 
        ON CONFLICT (policy_id, client_id) DO NOTHING  
        RETURNING *`,
      values: queryValues.flat(),
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add client\'s policies');
    }
    return result.rows;
  }

  async getClientPoliciesByClientId(clientId) {
    const query = {
      text: 'SELECT cp.policy_id, p.title, p.category, p.description, cp.details FROM clients_policies cp LEFT JOIN policies p ON cp.policy_id = p.id WHERE cp.client_id = $1',
      values: [clientId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async updateClientPolicy(clientId, policyId, details) {
    const updatedAt = new Date();
    const query = {
      text: `UPDATE clients_policies 
        SET details = $1, _updated_date = $2 
        WHERE policy_id = $3 AND client_id = $4 
        RETURNING policy_id, details, _updated_date`,
      values: [details, updatedAt, policyId, clientId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update client\'s policies');
    }
    return result.rows[0];
  }

  async deleteClientPolicy(clientId, policyId) {
    const query = {
      text: `DELETE FROM clients_policies 
        WHERE policy_id = $1 AND client_id = $2
        RETURNING *`,
      values: [policyId, clientId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete client\'s policies');
    }
    return result.rows[0];
  }
}

module.exports = ClientsPoliciesService;
