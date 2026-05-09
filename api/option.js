export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { contract_id, status, type } = req.query;

  const contract_options = [
    {
      id: 'opt_001',
      contract_id: 'contract_001',
      option_number: 1,
      type: 'option_year',
      title: 'Option Year 1',
      status: 'exercised',
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      value: 1200000,
      exercise_deadline: '2024-06-01',
      exercised_date: '2024-05-15',
      far_reference: 'FAR 52.217-9',
      clins: [
        { clin: '0101', description: 'Program Management Support', unit: 'LOT', qty: 1, unit_price: 300000, total: 300000 },
        { clin: '0102', description: 'Software Development', unit: 'HR', qty: 4500, unit_price: 200, total: 900000 }
      ],
      notes: 'Option exercised within required notice period'
    },
    {
      id: 'opt_002',
      contract_id: 'contract_001',
      option_number: 2,
      type: 'option_year',
      title: 'Option Year 2',
      status: 'available',
      start_date: '2025-07-01',
      end_date: '2026-06-30',
      value: 1300000,
      exercise_deadline: '2025-06-01',
      exercised_date: null,
      far_reference: 'FAR 52.217-9',
      clins: [
        { clin: '0201', description: 'Program Management Support', unit: 'LOT', qty: 1, unit_price: 325000, total: 325000 },
        { clin: '0202', description: 'Software Development', unit: 'HR', qty: 4875, unit_price: 200, total: 975000 }
      ],
      notes: 'Option available for exercise. Must notify 60 days prior to expiration.'
    },
    {
      id: 'opt_003',
      contract_id: 'contract_002',
      option_number: 1,
      type: 'additional_quantity',
      title: 'Additional Quantity Option',
      status: 'expired',
      start_date: null,
      end_date: null,
      value: 500000,
      exercise_deadline: '2025-01-31',
      exercised_date: null,
      far_reference: 'FAR 52.217-6',
      clins: [
        { clin: '0301', description: 'Additional License Seats', unit: 'EA', qty: 500, unit_price: 1000, total: 500000 }
      ],
      notes: 'Option expired without exercise'
    }
  ];

  let filtered = contract_options;
  if (contract_id) filtered = filtered.filter(o => o.contract_id === contract_id);
  if (status) filtered = filtered.filter(o => o.status === status);
  if (type) filtered = filtered.filter(o => o.type === type);

  const total_available_value = filtered
    .filter(o => o.status === 'available')
    .reduce((sum, o) => sum + o.value, 0);

  return res.status(200).json({
    success: true,
    options: filtered,
    total: filtered.length,
    total_available_value,
    statuses: ['available', 'exercised', 'expired', 'waived'],
    types: ['option_year', 'additional_quantity', 'additional_time', 'surge'],
    generated_at: new Date().toISOString()
  });
}
