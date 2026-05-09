// /api/outreach - Government agency outreach and contact management
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id, agency, status, contact_type } = req.query;

  const outreach = [
    {
      id: 'out_001',
      user_id: 'usr_001',
      contact_name: 'Dr. Sarah Mitchell',
      title: 'Program Manager, SBIR/STTR',
      agency: 'DARPA',
      office: 'Information Innovation Office (I2O)',
      email: 'sarah.mitchell@darpa.mil',
      phone: '703-526-6630',
      contact_type: 'program_manager',
      relationship_stage: 'engaged',
      last_contact: '2026-04-15T10:00:00Z',
      next_action: 'Send Phase II proposal follow-up',
      next_action_due: '2026-05-20',
      notes: 'Met at DARPA Forward event; strong interest in blockchain authentication for supply chain',
      linked_opportunities: ['pipe_001'],
      tags: ['dod', 'sbir', 'blockchain'],
      created_at: '2026-01-10T09:00:00Z'
    },
    {
      id: 'out_002',
      user_id: 'usr_001',
      contact_name: 'Dr. Robert Chang',
      title: 'Director of Commercialization',
      agency: 'DHS',
      office: 'Science & Technology Directorate',
      email: 'robert.chang@dhs.gov',
      phone: '202-254-5000',
      contact_type: 'contracting_officer',
      relationship_stage: 'negotiating',
      last_contact: '2026-05-01T14:00:00Z',
      next_action: 'Review and respond to contract terms',
      next_action_due: '2026-05-15',
      notes: 'SVIP program - in final contract negotiation phase. Key decision maker.',
      linked_opportunities: ['pipe_002'],
      tags: ['dhs', 'svip', 'compliance'],
      created_at: '2025-11-15T08:00:00Z'
    },
    {
      id: 'out_003',
      user_id: 'usr_001',
      contact_name: 'Jennifer Liu',
      title: 'Small Business Specialist',
      agency: 'GSA',
      office: 'Federal Acquisition Service',
      email: 'jennifer.liu@gsa.gov',
      phone: '202-501-0800',
      contact_type: 'small_business_rep',
      relationship_stage: 'warm',
      last_contact: '2026-03-20T11:00:00Z',
      next_action: 'Schedule MAS onboarding call',
      next_action_due: '2026-05-25',
      notes: 'Referred by PTAC advisor; offered to help navigate GSA Schedule application',
      linked_opportunities: ['pipe_003'],
      tags: ['gsa', 'mas', 'schedule'],
      created_at: '2026-03-10T10:00:00Z'
    },
    {
      id: 'out_004',
      user_id: 'usr_001',
      contact_name: 'Marcus Webb',
      title: 'Innovation Program Lead',
      agency: 'VA',
      office: 'VA Innovation Center',
      email: 'marcus.webb@va.gov',
      phone: null,
      contact_type: 'program_manager',
      relationship_stage: 'cold',
      last_contact: null,
      next_action: 'Initial outreach email with capabilities overview',
      next_action_due: '2026-05-18',
      notes: 'Identified through LinkedIn; manages VAII program relevant to supply chain',
      linked_opportunities: ['pipe_004'],
      tags: ['va', 'innovation', 'healthcare'],
      created_at: '2026-05-01T09:00:00Z'
    }
  ];

  let filtered = outreach;
  if (user_id) filtered = filtered.filter(o => o.user_id === user_id);
  if (agency) filtered = filtered.filter(o => o.agency.toLowerCase().includes(agency.toLowerCase()));
  if (status) filtered = filtered.filter(o => o.relationship_stage === status);
  if (contact_type) filtered = filtered.filter(o => o.contact_type === contact_type);

  const overdue = filtered.filter(o => o.next_action_due && o.next_action_due < new Date().toISOString().split('T')[0]).length;
  const due_soon = filtered.filter(o => {
    if (!o.next_action_due) return false;
    const days = (new Date(o.next_action_due) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  }).length;

  return res.status(200).json({
    success: true,
    contacts: filtered,
    total: filtered.length,
    overdue_actions: overdue,
    due_this_week: due_soon,
    relationship_stages: ['cold', 'warm', 'engaged', 'negotiating', 'closed_won', 'closed_lost'],
    contact_types: ['program_manager', 'contracting_officer', 'small_business_rep', 'technical_advisor', 'decision_maker'],
    generated_at: new Date().toISOString()
  });
};
