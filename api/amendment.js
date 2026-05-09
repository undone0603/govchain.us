export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, contract_id, type, status } = req.query;

  const amendments = [
    {
      id: 'amd_001',
      contract_id: 'contract_001',
      amendment_number: 'P00001',
      type: 'bilateral',
      status: 'executed',
      purpose: 'Increase ceiling and extend period of performance',
      changes: [
        { field: 'ceiling_value', old_value: 5000000, new_value: 6500000 },
        { field: 'end_date', old_value: '2025-06-30', new_value: '2025-12-31' }
      ],
      value_change: 1500000,
      total_contract_value: 6500000,
      effective_date: '2025-03-01',
      executed_date: '2025-02-28',
      co_name: 'Jennifer Martinez',
      far_reference: 'FAR 43.103(a)',
      justification: 'Increased workload due to expanded project scope approved by program office',
      created_at: '2025-02-15T00:00:00Z'
    },
    {
      id: 'amd_002',
      contract_id: 'contract_001',
      amendment_number: 'P00002',
      type: 'unilateral',
      status: 'pending_signature',
      purpose: 'Administrative change - update contractor POC',
      changes: [
        { field: 'contractor_poc', old_value: 'John Smith', new_value: 'Sarah Johnson' },
        { field: 'contractor_email', old_value: 'jsmith@vendor.com', new_value: 'sjohnson@vendor.com' }
      ],
      value_change: 0,
      total_contract_value: 6500000,
      effective_date: null,
      executed_date: null,
      co_name: 'Jennifer Martinez',
      far_reference: 'FAR 43.103(b)',
      justification: 'Contractor personnel change notification',
      created_at: '2025-04-10T00:00:00Z'
    }
  ];

  let filtered = amendments;
  if (id) filtered = filtered.filter(a => a.id === id);
  if (contract_id) filtered = filtered.filter(a => a.contract_id === contract_id);
  if (type) filtered = filtered.filter(a => a.type === type);
  if (status) filtered = filtered.filter(a => a.status === status);

  return res.status(200).json({
    success: true,
    amendments: filtered,
    total: filtered.length,
    types: ['bilateral', 'unilateral', 'administrative'],
    statuses: ['draft', 'pending_signature', 'executed', 'voided'],
    generated_at: new Date().toISOString()
  });
}
