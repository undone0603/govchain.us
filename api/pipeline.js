// /api/pipeline - Government contracting BD pipeline management
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id, stage, priority, contract_vehicle } = req.query;

  const pipeline = [
    {
      id: 'pipe_001',
      user_id: 'usr_001',
      opportunity_name: 'DoD SBIR Phase II - AuthiChain',
      agency: 'Department of Defense',
      program_office: 'DARPA I2O',
      contract_vehicle: 'SBIR',
      stage: 'proposal_submitted',
      stage_order: 4,
      probability: 0.65,
      estimated_value: 1750000,
      currency: 'USD',
      naics: '541519',
      set_aside: '8a',
      solicitation_number: 'HR001126S0001',
      due_date: '2026-03-15',
      award_date_estimate: '2026-07-01',
      primary_contact: 'Dr. Sarah Mitchell',
      contact_email: 'sarah.mitchell@darpa.mil',
      notes: 'Strong technical fit; working relationship established at TechConnect 2025',
      tags: ['blockchain', 'authentication', 'dod'],
      created_at: '2026-01-10T09:00:00Z',
      updated_at: '2026-04-20T14:00:00Z'
    },
    {
      id: 'pipe_002',
      user_id: 'usr_001',
      opportunity_name: 'DHS SVIP OTA - Compliance Platform',
      agency: 'Department of Homeland Security',
      program_office: 'S&T Directorate',
      contract_vehicle: 'OTA',
      stage: 'negotiation',
      stage_order: 5,
      probability: 0.80,
      estimated_value: 2400000,
      currency: 'USD',
      naics: '541511',
      set_aside: 'small_business',
      solicitation_number: 'SVIP-OTA-2026-001',
      due_date: '2026-02-28',
      award_date_estimate: '2026-06-15',
      primary_contact: 'Dr. Robert Chang',
      contact_email: 'robert.chang@dhs.gov',
      notes: 'In final negotiation; strong scoring in Phase I pilot',
      tags: ['compliance', 'tracking', 'dhs'],
      created_at: '2025-12-01T10:00:00Z',
      updated_at: '2026-05-01T11:00:00Z'
    },
    {
      id: 'pipe_003',
      user_id: 'usr_001',
      opportunity_name: 'GSA MAS Contract - Software SIN',
      agency: 'General Services Administration',
      program_office: 'Federal Acquisition Service',
      contract_vehicle: 'GSA_MAS',
      stage: 'qualification',
      stage_order: 2,
      probability: 0.90,
      estimated_value: 5000000,
      currency: 'USD',
      naics: '541519',
      set_aside: null,
      solicitation_number: 'MAS-IT-70-2026',
      due_date: '2026-08-30',
      award_date_estimate: '2026-12-01',
      primary_contact: 'GSA Contracting Officer',
      contact_email: 'mas-it@gsa.gov',
      notes: 'Building toward GSA Schedule to expand government sales channel',
      tags: ['gsa', 'schedule', 'marketplace'],
      created_at: '2026-03-01T08:00:00Z',
      updated_at: '2026-05-05T09:00:00Z'
    },
    {
      id: 'pipe_004',
      user_id: 'usr_001',
      opportunity_name: 'VA Innovation Initiative - Product Auth',
      agency: 'Veterans Affairs',
      program_office: 'VA Innovation Center',
      contract_vehicle: 'VAII',
      stage: 'prospect',
      stage_order: 1,
      probability: 0.30,
      estimated_value: 800000,
      currency: 'USD',
      naics: '541519',
      set_aside: 'sdvosb',
      solicitation_number: null,
      due_date: null,
      award_date_estimate: '2027-01-01',
      primary_contact: 'TBD',
      contact_email: null,
      notes: 'Identified via SAM.gov; planning outreach to program office',
      tags: ['va', 'innovation', 'healthcare'],
      created_at: '2026-05-01T08:00:00Z',
      updated_at: '2026-05-08T10:00:00Z'
    }
  ];

  let filtered = pipeline;
  if (user_id) filtered = filtered.filter(p => p.user_id === user_id);
  if (stage) filtered = filtered.filter(p => p.stage === stage);
  if (priority) filtered = filtered.filter(p => p.priority === priority);
  if (contract_vehicle) filtered = filtered.filter(p => p.contract_vehicle === contract_vehicle);

  const total_value = filtered.reduce((sum, p) => sum + p.estimated_value, 0);
  const weighted_value = filtered.reduce((sum, p) => sum + (p.estimated_value * p.probability), 0);

  return res.status(200).json({
    success: true,
    pipeline: filtered,
    total: filtered.length,
    total_pipeline_value: total_value,
    weighted_pipeline_value: Math.round(weighted_value),
    stages: [
      { key: 'prospect', order: 1, label: 'Prospect' },
      { key: 'qualification', order: 2, label: 'Qualification' },
      { key: 'capture', order: 3, label: 'Capture Planning' },
      { key: 'proposal_submitted', order: 4, label: 'Proposal Submitted' },
      { key: 'negotiation', order: 5, label: 'Negotiation' },
      { key: 'awarded', order: 6, label: 'Awarded' },
      { key: 'lost', order: 7, label: 'Lost' }
    ],
    contract_vehicles: ['SBIR', 'STTR', 'OTA', 'GSA_MAS', 'VAII', 'IDIQ', 'BPA', 'SeaPort'],
    generated_at: new Date().toISOString()
  });
};
