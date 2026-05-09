export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, contract_id, status, requested } = req.query;

  const debriefs = [
    {
      id: 'dbf_001',
      contract_id: 'contract_001',
      solicitation_number: 'W15QKN-26-R-0012',
      solicitation_title: 'Cloud Infrastructure Modernization',
      agency: 'Department of Defense',
      offeror_name: 'TechForward Solutions LLC',
      status: 'scheduled',
      requested: true,
      request_date: '2026-04-20',
      scheduled_date: '2026-05-15T14:00:00Z',
      format: 'virtual',
      contracting_officer: 'Maj. Sarah Johnson',
      co_email: 'sarah.johnson@army.mil',
      award_winner: 'Acme Systems Inc',
      your_score: 82.4,
      winning_score: 91.2,
      score_breakdown: [
        { factor: 'Technical Approach', your_score: 28.1, max_score: 35 },
        { factor: 'Management Approach', your_score: 18.5, max_score: 25 },
        { factor: 'Past Performance', your_score: 22.3, max_score: 25 },
        { factor: 'Price', your_score: 13.5, max_score: 15 }
      ],
      notes: 'Technical approach needed more detail on migration methodology',
      lessons_learned: null
    },
    {
      id: 'dbf_002',
      contract_id: 'contract_004',
      solicitation_number: 'HSHQDC-25-Q-00045',
      solicitation_title: 'IT Security Assessment',
      agency: 'DHS',
      offeror_name: 'TechForward Solutions LLC',
      status: 'completed',
      requested: true,
      request_date: '2025-11-01',
      scheduled_date: '2025-11-15T10:00:00Z',
      format: 'in_person',
      contracting_officer: 'James Carter',
      co_email: 'james.carter@dhs.gov',
      award_winner: 'TechForward Solutions LLC',
      your_score: 94.7,
      winning_score: 94.7,
      score_breakdown: [
        { factor: 'Technical Approach', your_score: 33.2, max_score: 35 },
        { factor: 'Management Approach', your_score: 23.8, max_score: 25 },
        { factor: 'Past Performance', your_score: 24.5, max_score: 25 },
        { factor: 'Price', your_score: 13.2, max_score: 15 }
      ],
      notes: 'Strongest technical proposal. Excellent past performance references.',
      lessons_learned: 'Detailed methodology and strong past performance were key differentiators.'
    }
  ];

  let filtered = debriefs;
  if (id) filtered = filtered.filter(d => d.id === id);
  if (contract_id) filtered = filtered.filter(d => d.contract_id === contract_id);
  if (status) filtered = filtered.filter(d => d.status === status);
  if (requested !== undefined) filtered = filtered.filter(d => d.requested === (requested === 'true'));

  return res.status(200).json({
    success: true,
    debriefs: filtered,
    total: filtered.length,
    statuses: ['not_requested', 'requested', 'scheduled', 'completed', 'waived'],
    generated_at: new Date().toISOString()
  });
}
