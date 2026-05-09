export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, agency, status, naics_code, set_aside, keyword } = req.query;

  const solicitations = [
    {
      id: 'sol_001',
      solicitation_number: 'W15QKN-26-R-0012',
      title: 'Cloud Infrastructure Modernization Services',
      agency: 'Department of Defense',
      sub_agency: 'Army Contracting Command',
      naics_code: '541512',
      naics_description: 'Computer Systems Design Services',
      type: 'RFP',
      set_aside: '8(a)',
      status: 'active',
      posted_date: '2026-04-15',
      response_due: '2026-05-30T17:00:00Z',
      estimated_value: 4500000,
      place_of_performance: 'Arlington, VA',
      description: 'Seeking qualified 8(a) firms to provide cloud migration and modernization services for Army enterprise systems.',
      contacts: [{ name: 'Maj. Sarah Johnson', email: 'sarah.johnson@army.mil', phone: '703-555-0101' }],
      attachments: ['SOW_v2.pdf', 'Section_L_M.pdf'],
      sam_link: 'https://sam.gov/opp/sol_001'
    },
    {
      id: 'sol_002',
      solicitation_number: 'HSHQDC-26-Q-00089',
      title: 'Cybersecurity Assessment and Penetration Testing',
      agency: 'Department of Homeland Security',
      sub_agency: 'CISA',
      naics_code: '541519',
      naics_description: 'Other Computer Related Services',
      type: 'RFQ',
      set_aside: 'SDVOSB',
      status: 'active',
      posted_date: '2026-04-28',
      response_due: '2026-05-20T15:00:00Z',
      estimated_value: 890000,
      place_of_performance: 'Washington, DC',
      description: 'Annual cybersecurity penetration testing and vulnerability assessment for DHS network infrastructure.',
      contacts: [{ name: 'James Carter', email: 'james.carter@dhs.gov', phone: '202-555-0202' }],
      attachments: ['PWS_Final.pdf'],
      sam_link: 'https://sam.gov/opp/sol_002'
    },
    {
      id: 'sol_003',
      solicitation_number: ' GS-00F-026CA',
      title: 'AI-Powered Data Analytics Platform — SBIR Phase II',
      agency: 'Small Business Administration',
      sub_agency: 'SBIR Program Office',
      naics_code: '541715',
      naics_description: 'Research & Development in AI',
      type: 'SBIR',
      set_aside: 'Small Business',
      status: 'closed',
      posted_date: '2026-02-01',
      response_due: '2026-04-01T17:00:00Z',
      estimated_value: 1750000,
      place_of_performance: 'Remote',
      description: 'Phase II SBIR for development of AI-powered analytics platform for DoD logistics optimization.',
      contacts: [{ name: 'Dr. Linda Park', email: 'lpark@sba.gov', phone: '202-555-0303' }],
      attachments: ['Topic_Description.pdf', 'Proposal_Guidelines.pdf'],
      sam_link: 'https://sam.gov/opp/sol_003'
    }
  ];

  let filtered = solicitations;
  if (id) filtered = filtered.filter(s => s.id === id);
  if (agency) filtered = filtered.filter(s => s.agency.toLowerCase().includes(agency.toLowerCase()));
  if (status) filtered = filtered.filter(s => s.status === status);
  if (naics_code) filtered = filtered.filter(s => s.naics_code === naics_code);
  if (set_aside) filtered = filtered.filter(s => s.set_aside.toLowerCase().includes(set_aside.toLowerCase()));
  if (keyword) filtered = filtered.filter(s => s.title.toLowerCase().includes(keyword.toLowerCase()) || s.description.toLowerCase().includes(keyword.toLowerCase()));

  const now = new Date();
  const due_soon = filtered.filter(s => s.status === 'active' && new Date(s.response_due) > now && (new Date(s.response_due) - now) / 86400000 <= 14).length;

  return res.status(200).json({
    success: true,
    solicitations: filtered,
    total: filtered.length,
    active_count: filtered.filter(s => s.status === 'active').length,
    due_within_14_days: due_soon,
    types: ['RFP', 'RFQ', 'RFI', 'SBIR', 'STTR', 'IDIQ', 'BPA'],
    set_asides: ['8(a)', 'SDVOSB', 'WOSB', 'HUBZone', 'SB', 'Unrestricted'],
    generated_at: now.toISOString()
  });
}
