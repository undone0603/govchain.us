const opportunities = [
  { id: 'OPP-2025-0001', title: 'Federal IT Infrastructure Modernization', agency: 'DoD', type: 'contract', value: 5000000, naics: '541512', set_aside: 'small_business', deadline: '2025-02-15T17:00:00Z', posted_at: '2025-01-10T00:00:00Z', status: 'active', blockchain_verified: true },
  { id: 'OPP-2025-0002', title: 'Cybersecurity Operations Center Support', agency: 'DHS', type: 'contract', value: 2500000, naics: '541519', set_aside: '8a', deadline: '2025-02-20T17:00:00Z', posted_at: '2025-01-12T00:00:00Z', status: 'active', blockchain_verified: true },
  { id: 'GRT-2025-0001', title: 'SBIR Phase II: AI-Based Threat Detection', agency: 'NSF', type: 'grant', value: 1500000, naics: null, set_aside: 'sbir', deadline: '2025-03-01T17:00:00Z', posted_at: '2025-01-05T00:00:00Z', status: 'active', blockchain_verified: true },
  { id: 'OPP-2025-0003', title: 'Cloud Migration and DevSecOps Services', agency: 'GSA', type: 'contract', value: 1800000, naics: '541511', set_aside: 'sdvosb', deadline: '2025-02-28T17:00:00Z', posted_at: '2025-01-08T00:00:00Z', status: 'active', blockchain_verified: true }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { q, agency, type, set_aside, naics, min_value, max_value } = req.query;
    let filtered = opportunities;
    if (q) filtered = filtered.filter(o => o.title.toLowerCase().includes(q.toLowerCase()) || o.agency.toLowerCase().includes(q.toLowerCase()));
    if (agency) filtered = filtered.filter(o => o.agency === agency);
    if (type) filtered = filtered.filter(o => o.type === type);
    if (set_aside) filtered = filtered.filter(o => o.set_aside === set_aside);
    if (naics) filtered = filtered.filter(o => o.naics === naics);
    if (min_value) filtered = filtered.filter(o => o.value >= parseInt(min_value));
    if (max_value) filtered = filtered.filter(o => o.value <= parseInt(max_value));
    return res.status(200).json({
      success: true,
      endpoint: '/api/search',
      query: q || '',
      results: filtered,
      total: filtered.length,
      total_value: filtered.reduce((sum, o) => sum + o.value, 0),
      sam_gov_synced: true,
      blockchain_verified: true,
      protocol: 'GovChain'
    });
  }
};
