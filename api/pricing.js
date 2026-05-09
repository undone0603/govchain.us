export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { contract_id, naics_code, competition_type } = req.query;

  const pricing_data = [
    {
      id: 'price_001',
      contract_id: 'GC-2024-001',
      naics_code: '541511',
      naics_title: 'Custom Computer Programming Services',
      competition_type: 'full_and_open',
      pricing_type: 'fixed_price',
      base_value: 850000,
      ceiling_value: 1000000,
      labor_categories: [
        { title: 'Senior Software Engineer', hourly_rate: 185, hours: 2000 },
        { title: 'Project Manager', hourly_rate: 145, hours: 500 },
        { title: 'QA Analyst', hourly_rate: 110, hours: 300 }
      ],
      indirect_rates: { overhead: 0.12, fringe: 0.28, g_and_a: 0.08, profit: 0.10 },
      cost_realism_required: true,
      certified_cost_data_required: false,
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'price_002',
      contract_id: 'GC-2024-002',
      naics_code: '336411',
      naics_title: 'Aircraft Manufacturing',
      competition_type: 'sole_source',
      pricing_type: 'cost_plus_fixed_fee',
      base_value: 4500000,
      ceiling_value: 5200000,
      labor_categories: [
        { title: 'Principal Engineer', hourly_rate: 225, hours: 5000 },
        { title: 'Systems Analyst', hourly_rate: 175, hours: 3000 },
        { title: 'Technical Writer', hourly_rate: 95, hours: 800 }
      ],
      indirect_rates: { overhead: 0.18, fringe: 0.32, g_and_a: 0.10, profit: 0.08 },
      cost_realism_required: true,
      certified_cost_data_required: true,
      created_at: '2024-03-01T00:00:00Z'
    },
    {
      id: 'price_003',
      contract_id: 'GC-2024-003',
      naics_code: '541330',
      naics_title: 'Engineering Services',
      competition_type: 'small_business_set_aside',
      pricing_type: 'time_and_materials',
      base_value: 280000,
      ceiling_value: 350000,
      labor_categories: [
        { title: 'Civil Engineer', hourly_rate: 155, hours: 1200 },
        { title: 'CAD Technician', hourly_rate: 85, hours: 600 }
      ],
      indirect_rates: { overhead: 0.10, fringe: 0.25, g_and_a: 0.07, profit: 0.10 },
      cost_realism_required: false,
      certified_cost_data_required: false,
      created_at: '2024-05-20T00:00:00Z'
    }
  ];

  let filtered = pricing_data;
  if (contract_id) filtered = filtered.filter(p => p.contract_id === contract_id);
  if (naics_code) filtered = filtered.filter(p => p.naics_code === naics_code);
  if (competition_type) filtered = filtered.filter(p => p.competition_type === competition_type);

  const total_value = filtered.reduce((sum, p) => sum + p.base_value, 0);

  return res.status(200).json({
    success: true,
    pricing: filtered,
    total: filtered.length,
    total_base_value: total_value,
    competition_types: ['full_and_open', 'sole_source', 'small_business_set_aside', 'sdvosb_set_aside', '8a'],
    pricing_types: ['fixed_price', 'cost_plus_fixed_fee', 'time_and_materials', 'indefinite_delivery']
  });
}
