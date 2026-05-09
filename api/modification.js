export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { contract_id, type, status } = req.query;

  const modifications = [
    {
      id: 'mod_001',
      contract_id: 'contract_001',
      mod_number: 'P00001',
      type: 'change_order',
      status: 'executed',
      description: 'Increase funding ceiling and extend PoP by 6 months',
      scope_change: true,
      funding_change: 1500000,
      new_ceiling: 6500000,
      old_ceiling: 5000000,
      period_change: { old_end: '2025-06-30', new_end: '2025-12-31' },
      contracting_officer: 'Jennifer Martinez',
      co_signature_date: '2025-02-28',
      contractor_signature_date: '2025-02-27',
      effective_date: '2025-03-01',
      far_authority: 'FAR 43.103(a)',
      justification: 'Expanded project scope approved by Program Office Memorandum dated 2025-02-10',
      created_at: '2025-02-15T00:00:00Z'
    },
    {
      id: 'mod_002',
      contract_id: 'contract_001',
      mod_number: 'P00002',
      type: 'administrative',
      status: 'pending',
      description: 'Update contractor point of contact information',
      scope_change: false,
      funding_change: 0,
      new_ceiling: 6500000,
      old_ceiling: 6500000,
      period_change: null,
      contracting_officer: 'Jennifer Martinez',
      co_signature_date: null,
      contractor_signature_date: null,
      effective_date: null,
      far_authority: 'FAR 43.103(b)',
      justification: 'Contractor POC change per letter dated 2025-04-08',
      created_at: '2025-04-10T00:00:00Z'
    },
    {
      id: 'mod_003',
      contract_id: 'contract_002',
      mod_number: 'P00001',
      type: 'stop_work',
      status: 'executed',
      description: 'Stop-work order issued pending funding authorization',
      scope_change: false,
      funding_change: 0,
      new_ceiling: 2100000,
      old_ceiling: 2100000,
      period_change: null,
      contracting_officer: 'Robert Kim',
      co_signature_date: '2025-03-15',
      contractor_signature_date: null,
      effective_date: '2025-03-15',
      far_authority: 'FAR 52.242-15',
      justification: 'Stop-work ordered per Contracting Officer direction. Work to resume upon new funding approval.',
      created_at: '2025-03-15T00:00:00Z'
    }
  ];

  let filtered = modifications;
  if (contract_id) filtered = filtered.filter(m => m.contract_id === contract_id);
  if (type) filtered = filtered.filter(m => m.type === type);
  if (status) filtered = filtered.filter(m => m.status === status);

  const total_funding_change = filtered.reduce((sum, m) => sum + m.funding_change, 0);

  return res.status(200).json({
    success: true,
    modifications: filtered,
    total: filtered.length,
    total_funding_change,
    types: ['change_order', 'administrative', 'stop_work', 'cure_notice', 'show_cause', 'termination'],
    statuses: ['draft', 'pending', 'executed', 'voided'],
    generated_at: new Date().toISOString()
  });
}
