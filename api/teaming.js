export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, status, lead_contractor, opportunity_id } = req.query;

  const agreements = [
    {
      id: 'team_001',
      name: 'Alpha-Beta Joint Pursuit',
      opportunity_id: 'opp_001',
      opportunity_title: 'DoD Cloud Infrastructure Modernization',
      lead_contractor: { name: 'AlphaTech Solutions', cage_code: 'A1B2C', role: 'prime' },
      team_members: [
        { name: 'BetaSystems Inc', cage_code: 'B3C4D', role: 'subcontractor', workshare: 35, naics: '541512' },
        { name: 'GammaCyber LLC', cage_code: 'G5H6I', role: 'subcontractor', workshare: 20, naics: '541519' }
      ],
      status: 'active',
      agreement_date: '2025-01-15',
      expiration_date: '2025-12-31',
      exclusivity: true,
      estimated_contract_value: 5000000,
      notes: 'Cloud migration and security hardening initiative'
    },
    {
      id: 'team_002',
      name: 'Delta-Epsilon SBIR Team',
      opportunity_id: 'opp_002',
      opportunity_title: 'SBIR Phase II AI Analytics Platform',
      lead_contractor: { name: 'DeltaInnovate', cage_code: 'D7E8F', role: 'prime' },
      team_members: [
        { name: 'EpsilonAI Corp', cage_code: 'E9F0G', role: 'subcontractor', workshare: 40, naics: '541715' }
      ],
      status: 'pending',
      agreement_date: '2025-03-01',
      expiration_date: '2025-09-01',
      exclusivity: false,
      estimated_contract_value: 1500000,
      notes: 'AI-powered data analytics for DoD logistics'
    }
  ];

  let filtered = agreements;
  if (id) filtered = filtered.filter(a => a.id === id);
  if (status) filtered = filtered.filter(a => a.status === status);
  if (lead_contractor) filtered = filtered.filter(a => a.lead_contractor.name.toLowerCase().includes(lead_contractor.toLowerCase()));
  if (opportunity_id) filtered = filtered.filter(a => a.opportunity_id === opportunity_id);

  return res.status(200).json({
    success: true,
    teaming_agreements: filtered,
    total: filtered.length,
    statuses: ['active', 'pending', 'expired', 'terminated'],
    generated_at: new Date().toISOString()
  });
}
