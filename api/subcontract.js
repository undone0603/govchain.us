export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { method, query, body } = req;
  const { id, prime_contract_id, status, naics_code } = query;

  const subcontracts = [
    {
      id: 'sub_001',
      prime_contract_id: 'contract_001',
      prime_contractor: 'Lockheed Martin',
      subcontractor: 'TechSolutions LLC',
      naics_code: '541512',
      description: 'Software development and integration services',
      value: 850000,
      period_of_performance: { start: '2025-01-01', end: '2025-12-31' },
      status: 'active',
      small_business: true,
      socioeconomic_categories: ['8a', 'sdvosb'],
      deliverables: ['Software modules', 'Technical documentation', 'Testing reports'],
      payment_terms: 'Net 30',
      created_at: '2024-12-15T00:00:00Z'
    },
    {
      id: 'sub_002',
      prime_contract_id: 'contract_002',
      prime_contractor: 'Booz Allen Hamilton',
      subcontractor: 'DataAnalytics Inc',
      naics_code: '541611',
      description: 'Data analytics and visualization services',
      value: 320000,
      period_of_performance: { start: '2025-03-01', end: '2025-08-31' },
      status: 'pending',
      small_business: true,
      socioeconomic_categories: ['wosb', 'hubzone'],
      deliverables: ['Dashboard reports', 'Data models', 'Training sessions'],
      payment_terms: 'Net 45',
      created_at: '2025-02-01T00:00:00Z'
    },
    {
      id: 'sub_003',
      prime_contract_id: 'contract_003',
      prime_contractor: 'SAIC',
      subcontractor: 'CyberSecure Partners',
      naics_code: '541519',
      description: 'Cybersecurity assessment and implementation',
      value: 1200000,
      period_of_performance: { start: '2024-07-01', end: '2026-06-30' },
      status: 'active',
      small_business: false,
      socioeconomic_categories: [],
      deliverables: ['Security assessments', 'Penetration testing', 'Remediation plans'],
      payment_terms: 'Net 30',
      created_at: '2024-06-10T00:00:00Z'
    }
  ];

  let filtered = subcontracts;
  if (id) filtered = filtered.filter(s => s.id === id);
  if (prime_contract_id) filtered = filtered.filter(s => s.prime_contract_id === prime_contract_id);
  if (status) filtered = filtered.filter(s => s.status === status);
  if (naics_code) filtered = filtered.filter(s => s.naics_code === naics_code);

  const total_value = filtered.reduce((sum, s) => sum + s.value, 0);
  const small_business_count = filtered.filter(s => s.small_business).length;

  return res.status(200).json({
    success: true,
    subcontracts: filtered,
    total: filtered.length,
    total_value,
    small_business_count,
    small_business_percentage: filtered.length > 0 ? Math.round((small_business_count / filtered.length) * 100) : 0,
    generated_at: new Date().toISOString()
  });
}
