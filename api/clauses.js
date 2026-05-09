export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { contract_id, category, far_part, search } = req.query;

  const clauses = [
    {
      id: 'clause_001',
      contract_id: 'GC-2024-001',
      clause_number: 'FAR 52.212-4',
      title: 'Contract Terms and Conditions—Commercial Products and Commercial Services',
      category: 'commercial',
      far_part: '52.212',
      full_text_url: 'https://www.acquisition.gov/far/52.212-4',
      is_required: true,
      prescription: 'FAR 12.301(b)(3)',
      last_updated: '2023-01-01'
    },
    {
      id: 'clause_002',
      contract_id: 'GC-2024-001',
      clause_number: 'FAR 52.222-26',
      title: 'Equal Opportunity',
      category: 'labor',
      far_part: '52.222',
      full_text_url: 'https://www.acquisition.gov/far/52.222-26',
      is_required: true,
      prescription: 'FAR 22.810(e)',
      last_updated: '2023-01-01'
    },
    {
      id: 'clause_003',
      contract_id: 'GC-2024-002',
      clause_number: 'DFARS 252.204-7012',
      title: 'Safeguarding Covered Defense Information',
      category: 'security',
      far_part: '252.204',
      full_text_url: 'https://www.acquisition.gov/dfars/252.204-7012',
      is_required: true,
      prescription: 'DFARS 204.7304(a)',
      last_updated: '2023-06-01'
    },
    {
      id: 'clause_004',
      contract_id: 'GC-2024-002',
      clause_number: 'FAR 52.232-33',
      title: 'Payment by Electronic Funds Transfer—System for Award Management',
      category: 'payment',
      far_part: '52.232',
      full_text_url: 'https://www.acquisition.gov/far/52.232-33',
      is_required: true,
      prescription: 'FAR 32.1110(a)(1)',
      last_updated: '2022-11-01'
    },
    {
      id: 'clause_005',
      contract_id: 'GC-2024-003',
      clause_number: 'FAR 52.203-13',
      title: 'Contractor Code of Business Ethics and Conduct',
      category: 'ethics',
      far_part: '52.203',
      full_text_url: 'https://www.acquisition.gov/far/52.203-13',
      is_required: false,
      prescription: 'FAR 3.1004(a)',
      last_updated: '2021-11-01'
    }
  ];

  let filtered = clauses;
  if (contract_id) filtered = filtered.filter(c => c.contract_id === contract_id);
  if (category) filtered = filtered.filter(c => c.category === category);
  if (far_part) filtered = filtered.filter(c => c.far_part.startsWith(far_part));
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.clause_number.toLowerCase().includes(q));
  }

  const categories = [...new Set(clauses.map(c => c.category))];

  return res.status(200).json({
    success: true,
    clauses: filtered,
    total: filtered.length,
    categories,
    required_count: filtered.filter(c => c.is_required).length
  });
}
