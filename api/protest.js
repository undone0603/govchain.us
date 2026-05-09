export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { contract_id, status, protest_type, agency_id } = req.query;

  const protests = [
    {
      id: 'prot_001',
      gao_docket_number: 'B-422145',
      contract_id: 'GC-2024-001',
      solicitation_number: 'W912HN-24-R-0012',
      agency_id: 'USACE',
      agency_name: 'US Army Corps of Engineers',
      protester: 'TechSolutions Inc.',
      protest_type: 'pre_award',
      status: 'pending',
      grounds: ['improper_evaluation', 'unequal_treatment'],
      summary: 'Protester alleges the agency improperly evaluated its technical proposal and applied unstated evaluation criteria.',
      filed_date: '2024-03-01',
      decision_due_date: '2024-05-29',
      stay_in_effect: true,
      outcome: null,
      created_at: '2024-03-01T10:00:00Z'
    },
    {
      id: 'prot_002',
      gao_docket_number: 'B-421987',
      contract_id: 'GC-2023-045',
      solicitation_number: 'DHS-23-ICE-0099',
      agency_id: 'DHS',
      agency_name: 'Department of Homeland Security',
      protester: 'CyberDefense LLC',
      protest_type: 'post_award',
      status: 'decided',
      grounds: ['best_value_tradeoff', 'price_evaluation'],
      summary: 'Protester challenges award decision arguing the agency failed to perform a proper best-value tradeoff analysis.',
      filed_date: '2024-01-15',
      decision_due_date: '2024-04-14',
      stay_in_effect: false,
      outcome: 'denied',
      decision_date: '2024-03-20',
      created_at: '2024-01-15T09:00:00Z'
    },
    {
      id: 'prot_003',
      gao_docket_number: 'B-422301',
      contract_id: null,
      solicitation_number: 'VA-24-SDVOSB-0089',
      agency_id: 'VA',
      agency_name: 'Department of Veterans Affairs',
      protester: 'VetTech Services',
      protest_type: 'pre_award',
      status: 'withdrawn',
      grounds: ['size_status', 'set_aside_eligibility'],
      summary: 'Protester challenged the size status determination of the apparent awardee under the SDVOSB set-aside.',
      filed_date: '2024-02-28',
      decision_due_date: '2024-05-27',
      stay_in_effect: false,
      outcome: 'withdrawn',
      withdrawal_date: '2024-03-10',
      created_at: '2024-02-28T14:00:00Z'
    }
  ];

  let filtered = protests;
  if (contract_id) filtered = filtered.filter(p => p.contract_id === contract_id);
  if (status) filtered = filtered.filter(p => p.status === status);
  if (protest_type) filtered = filtered.filter(p => p.protest_type === protest_type);
  if (agency_id) filtered = filtered.filter(p => p.agency_id === agency_id);

  return res.status(200).json({
    success: true,
    protests: filtered,
    total: filtered.length,
    pending_count: filtered.filter(p => p.status === 'pending').length,
    statuses: ['pending', 'decided', 'withdrawn', 'dismissed'],
    types: ['pre_award', 'post_award'],
    common_grounds: ['improper_evaluation', 'unequal_treatment', 'best_value_tradeoff', 'price_evaluation', 'size_status', 'organizational_conflict']
  });
}
