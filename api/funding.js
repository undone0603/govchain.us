// /api/funding - Government grants and non-dilutive funding tracker
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id, funding_type, status, agency } = req.query;

  const fundingOpportunities = [
    {
      id: 'fund_001',
      user_id: 'usr_001',
      title: 'SBIR Phase II - Blockchain Supply Chain Authentication',
      funding_type: 'sbir',
      phase: 'phase_ii',
      agency: 'Department of Defense',
      program: 'DARPA SBIR/STTR',
      solicitation: 'HR001126S0001',
      amount: 1750000,
      cost_share_required: false,
      status: 'applied',
      application_date: '2026-03-15',
      decision_expected: '2026-07-01',
      period_of_performance_months: 24,
      naics: '541519',
      eligibility: ['small_business', '8a'],
      description: 'Phase II continuation of blockchain authentication work for DoD supply chain integrity',
      cfda_number: '12.910',
      url: 'https://www.dodsbirsttr.mil',
      notes: 'Strong Phase I results; CO indicated Phase II award likely',
      created_at: '2026-01-10T09:00:00Z'
    },
    {
      id: 'fund_002',
      user_id: 'usr_001',
      title: 'AWS Activate - Founders Program',
      funding_type: 'cloud_credits',
      phase: null,
      agency: 'Amazon Web Services',
      program: 'AWS Activate',
      solicitation: null,
      amount: 100000,
      cost_share_required: false,
      status: 'awarded',
      application_date: '2026-01-20',
      decision_expected: null,
      period_of_performance_months: 24,
      naics: null,
      eligibility: ['startup', 'aws_customer'],
      description: 'AWS cloud credits for startup infrastructure - compute, storage, and ML services',
      cfda_number: null,
      url: 'https://aws.amazon.com/activate',
      notes: 'Awarded $100K in credits; expires April 2028',
      created_at: '2026-01-05T08:00:00Z'
    },
    {
      id: 'fund_003',
      user_id: 'usr_001',
      title: 'MEDC Michigan Business Development Grant',
      funding_type: 'state_grant',
      phase: null,
      agency: 'Michigan Economic Development Corporation',
      program: 'Business Development Program',
      solicitation: 'MEDC-BDP-2026-Q2',
      amount: 500000,
      cost_share_required: true,
      cost_share_pct: 0.50,
      status: 'prospect',
      application_date: null,
      decision_expected: null,
      period_of_performance_months: 18,
      naics: '541511',
      eligibility: ['michigan_business', 'job_creation'],
      description: 'Michigan BDP grant for technology companies creating 10+ jobs in Michigan',
      cfda_number: null,
      url: 'https://www.michiganbusiness.org/bdp',
      notes: 'Will apply Q3 2026; need to demonstrate 10 job commitment',
      created_at: '2026-04-01T09:00:00Z'
    },
    {
      id: 'fund_004',
      user_id: 'usr_001',
      title: 'NSF SBIR Phase I - Supply Chain Technology',
      funding_type: 'sbir',
      phase: 'phase_i',
      agency: 'National Science Foundation',
      program: 'NSF SBIR',
      solicitation: 'NSF-26-503',
      amount: 275000,
      cost_share_required: false,
      status: 'identified',
      application_date: null,
      decision_expected: null,
      period_of_performance_months: 12,
      naics: '541519',
      eligibility: ['small_business'],
      description: 'NSF SBIR for novel supply chain authentication using distributed ledger technology',
      cfda_number: '47.084',
      url: 'https://seedfund.nsf.gov',
      notes: 'Letter of Intent due June 2026; strong fit for AI authentication angle',
      created_at: '2026-05-01T09:00:00Z'
    }
  ];

  let filtered = fundingOpportunities;
  if (user_id) filtered = filtered.filter(f => f.user_id === user_id);
  if (funding_type) filtered = filtered.filter(f => f.funding_type === funding_type);
  if (status) filtered = filtered.filter(f => f.status === status);
  if (agency) filtered = filtered.filter(f => f.agency.toLowerCase().includes(agency.toLowerCase()));

  const total_applied = filtered.filter(f => ['applied', 'awarded'].includes(f.status)).reduce((sum, f) => sum + f.amount, 0);
  const total_awarded = filtered.filter(f => f.status === 'awarded').reduce((sum, f) => sum + f.amount, 0);
  const total_pipeline = filtered.reduce((sum, f) => sum + f.amount, 0);

  return res.status(200).json({
    success: true,
    funding: filtered,
    total: filtered.length,
    total_pipeline_value: total_pipeline,
    total_applied_value: total_applied,
    total_awarded_value: total_awarded,
    funding_types: ['sbir', 'sttr', 'state_grant', 'federal_grant', 'cloud_credits', 'venture_debt', 'ota'],
    statuses: ['identified', 'prospect', 'applied', 'awarded', 'rejected', 'withdrawn'],
    generated_at: new Date().toISOString()
  });
};
