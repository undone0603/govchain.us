// /api/performance - CPARS contract performance assessment and metrics
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { contract_id, period, rating } = req.query;

  const assessments = [
    {
      id: 'perf_001',
      contract_id: 'contract_001',
      contract_name: 'DoD SBIR Phase I - AuthiChain',
      period: 'Q1-2026',
      period_start: '2026-01-01',
      period_end: '2026-03-31',
      overall_rating: 'exceptional',
      rating_score: 5,
      categories: {
        technical_performance: { rating: 'exceptional', score: 5, notes: 'Exceeded technical milestones' },
        schedule: { rating: 'very_good', score: 4, notes: 'Deliverables submitted on time' },
        cost_control: { rating: 'exceptional', score: 5, notes: 'Under budget by 8%' },
        management: { rating: 'exceptional', score: 5, notes: 'Excellent communication with CO' },
        small_business: { rating: 'exceptional', score: 5, notes: 'Met all SB subcontracting goals' }
      },
      co_name: 'Major James Henderson',
      co_office: 'DARPA, Arlington VA',
      submitted_at: '2026-04-10T14:00:00Z',
      cpars_id: 'CPARS-2026-001-Q1'
    },
    {
      id: 'perf_002',
      contract_id: 'contract_002',
      contract_name: 'DHS SVIP Phase II - StrainChain',
      period: 'Q4-2025',
      period_start: '2025-10-01',
      period_end: '2025-12-31',
      overall_rating: 'very_good',
      rating_score: 4,
      categories: {
        technical_performance: { rating: 'very_good', score: 4, notes: 'Strong technical progress' },
        schedule: { rating: 'satisfactory', score: 3, notes: 'Minor delay in one deliverable' },
        cost_control: { rating: 'very_good', score: 4, notes: 'On budget with minor adjustments' },
        management: { rating: 'very_good', score: 4, notes: 'Good responsiveness to feedback' },
        small_business: { rating: 'exceptional', score: 5, notes: 'Exceeded 8(a) targets' }
      },
      co_name: 'Ms. Patricia Walsh',
      co_office: 'DHS S&T, Washington DC',
      submitted_at: '2026-01-20T10:00:00Z',
      cpars_id: 'CPARS-2025-002-Q4'
    }
  ];

  let filtered = assessments;
  if (contract_id) filtered = filtered.filter(a => a.contract_id === contract_id);
  if (period) filtered = filtered.filter(a => a.period === period);
  if (rating) filtered = filtered.filter(a => a.overall_rating === rating);

  const avg_score = filtered.length > 0 
    ? (filtered.reduce((sum, a) => sum + a.rating_score, 0) / filtered.length).toFixed(2) 
    : null;

  return res.status(200).json({
    success: true,
    assessments: filtered,
    total: filtered.length,
    average_score: parseFloat(avg_score),
    rating_scale: {
      5: 'exceptional',
      4: 'very_good',
      3: 'satisfactory',
      2: 'marginal',
      1: 'unsatisfactory'
    },
    cpars_system_url: 'https://www.cpars.gov',
    generated_at: new Date().toISOString()
  });
};
