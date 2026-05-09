export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { contract_id, status, agency_id } = req.query;

  const closeouts = [
    {
      id: 'cls_001',
      contract_id: 'GC-2022-001',
      contract_number: 'W912HN-22-C-0010',
      agency_id: 'USACE',
      agency_name: 'US Army Corps of Engineers',
      vendor_id: 'vend_001',
      vendor_name: 'TechSolutions Federal Inc.',
      status: 'complete',
      period_of_performance_end: '2023-12-31',
      closeout_initiated: '2024-01-15',
      closeout_completed: '2024-03-01',
      final_invoice_submitted: true,
      final_invoice_paid: true,
      final_invoice_amount: 38500,
      property_returned: true,
      classified_material_disposed: false,
      past_performance_submitted: true,
      contractor_release_signed: true,
      release_date: '2024-02-28',
      final_audit_required: false,
      lessons_learned: 'Deliverables met on schedule. Strong communication throughout. Recommend for future awards.',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-03-01T14:00:00Z'
    },
    {
      id: 'cls_002',
      contract_id: 'GC-2022-002',
      contract_number: 'DHS-22-C-0044',
      agency_id: 'DHS',
      agency_name: 'Department of Homeland Security',
      vendor_id: 'vend_002',
      vendor_name: 'CyberDefense Solutions LLC',
      status: 'in_progress',
      period_of_performance_end: '2024-01-31',
      closeout_initiated: '2024-02-01',
      closeout_completed: null,
      final_invoice_submitted: true,
      final_invoice_paid: false,
      final_invoice_amount: 125000,
      property_returned: false,
      classified_material_disposed: true,
      past_performance_submitted: false,
      contractor_release_signed: false,
      release_date: null,
      final_audit_required: true,
      audit_status: 'scheduled',
      audit_date: '2024-04-15',
      created_at: '2024-02-01T09:00:00Z',
      updated_at: '2024-03-10T10:00:00Z'
    }
  ];

  let filtered = closeouts;
  if (contract_id) filtered = filtered.filter(c => c.contract_id === contract_id);
  if (status) filtered = filtered.filter(c => c.status === status);
  if (agency_id) filtered = filtered.filter(c => c.agency_id === agency_id);

  const checklist_items = [
    'Final invoice submitted and paid',
    'Government property returned or disposed',
    'Classified material disposed per regulations',
    'Past performance evaluation submitted (CPARS)',
    'Contractor release of claims signed',
    'Final audit completed (if required)',
    'Patent and royalty matters resolved',
    'Subcontract closeouts completed'
  ];

  return res.status(200).json({
    success: true,
    closeouts: filtered,
    total: filtered.length,
    complete_count: filtered.filter(c => c.status === 'complete').length,
    in_progress_count: filtered.filter(c => c.status === 'in_progress').length,
    statuses: ['initiated', 'in_progress', 'pending_audit', 'complete', 'cancelled'],
    standard_checklist: checklist_items
  });
}
