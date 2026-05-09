export default async function handler(req, res) {
  const { query } = req;
  const { vendor_id, contract_id, status, type } = query;

  const disputes = [
    {
      id: 'dispute_001',
      vendor_id: 'vendor_001',
      contract_id: 'contract_001',
      agency: 'Department of Defense',
      type: 'payment_dispute',
      status: 'under_review',
      title: 'Invoice #INV-2024-042 Non-Payment',
      description: 'Invoice submitted 45 days ago with no payment or acknowledgment from contracting officer.',
      amount_disputed_usd: 48500,
      date_filed: new Date(Date.now() - 10 * 86400000).toISOString(),
      date_acknowledged: new Date(Date.now() - 8 * 86400000).toISOString(),
      assigned_adr_officer: 'Lisa Turner',
      next_action_date: new Date(Date.now() + 5 * 86400000).toISOString(),
      resolution_date: null,
      outcome: null,
      far_reference: 'FAR 33.103'
    },
    {
      id: 'dispute_002',
      vendor_id: 'vendor_002',
      contract_id: 'contract_002',
      agency: 'General Services Administration',
      type: 'scope_dispute',
      status: 'resolved',
      title: 'Scope Creep on IT Modernization Contract',
      description: 'Contractor billed for 120 hours of additional work not included in base SOW.',
      amount_disputed_usd: 18000,
      date_filed: new Date(Date.now() - 45 * 86400000).toISOString(),
      date_acknowledged: new Date(Date.now() - 43 * 86400000).toISOString(),
      assigned_adr_officer: 'Mark Reynolds',
      next_action_date: null,
      resolution_date: new Date(Date.now() - 15 * 86400000).toISOString(),
      outcome: 'partial_settlement',
      settlement_amount_usd: 12000,
      far_reference: 'FAR 52.243-1'
    }
  ];

  let filtered = disputes;
  if (vendor_id) filtered = filtered.filter(d => d.vendor_id === vendor_id);
  if (contract_id) filtered = filtered.filter(d => d.contract_id === contract_id);
  if (status) filtered = filtered.filter(d => d.status === status);
  if (type) filtered = filtered.filter(d => d.type === type);

  return res.status(200).json({
    success: true,
    disputes: filtered,
    total: filtered.length,
    statuses: ['filed', 'under_review', 'mediation', 'arbitration', 'resolved', 'withdrawn'],
    types: ['payment_dispute', 'scope_dispute', 'termination_dispute', 'performance_dispute', 'bid_protest']
  });
}
