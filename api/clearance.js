export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, personnel_id, level, status } = req.query;

  const clearances = [
    {
      id: 'clr_001',
      personnel_id: 'pers_001',
      name: 'Marcus Williams',
      ssn_last4: '****',
      level: 'Top Secret/SCI',
      level_code: 'TS_SCI',
      adjudication_date: '2022-03-15',
      expiration_date: '2027-03-15',
      status: 'active',
      sponsoring_agency: 'DoD',
      investigation_type: 'Tier 5',
      polygraph: { required: true, type: 'CI', last_date: '2022-02-10', status: 'current' },
      periodic_reinvestigation_due: '2027-02-01',
      access_programs: ['SAP-001', 'SAP-003'],
      security_officer: 'Lt. Col. Reyes'
    },
    {
      id: 'clr_002',
      personnel_id: 'pers_002',
      name: 'Dr. Emily Chen',
      ssn_last4: '****',
      level: 'Secret',
      level_code: 'SECRET',
      adjudication_date: '2023-07-20',
      expiration_date: '2033-07-20',
      status: 'active',
      sponsoring_agency: 'DoD',
      investigation_type: 'Tier 3',
      polygraph: { required: false, type: null, last_date: null, status: 'not_required' },
      periodic_reinvestigation_due: '2033-06-01',
      access_programs: [],
      security_officer: 'Lt. Col. Reyes'
    },
    {
      id: 'clr_003',
      personnel_id: 'pers_003',
      name: 'Jordan Smith',
      ssn_last4: '****',
      level: 'Public Trust',
      level_code: 'PT_MBI',
      adjudication_date: '2024-01-10',
      expiration_date: '2029-01-10',
      status: 'active',
      sponsoring_agency: 'DHS',
      investigation_type: 'Tier 2',
      polygraph: { required: false, type: null, last_date: null, status: 'not_required' },
      periodic_reinvestigation_due: '2029-01-01',
      access_programs: [],
      security_officer: 'FSO Davis'
    },
    {
      id: 'clr_004',
      personnel_id: 'pers_004',
      name: 'Alex Rivera',
      ssn_last4: '****',
      level: 'Secret',
      level_code: 'SECRET',
      adjudication_date: null,
      expiration_date: null,
      status: 'in_progress',
      sponsoring_agency: 'DoD',
      investigation_type: 'Tier 3',
      polygraph: { required: false, type: null, last_date: null, status: 'not_required' },
      periodic_reinvestigation_due: null,
      access_programs: [],
      security_officer: 'Lt. Col. Reyes',
      submitted_date: '2026-02-15',
      estimated_completion: '2026-08-15'
    }
  ];

  let filtered = clearances;
  if (id) filtered = filtered.filter(c => c.id === id);
  if (personnel_id) filtered = filtered.filter(c => c.personnel_id === personnel_id);
  if (level) filtered = filtered.filter(c => c.level_code === level || c.level.toLowerCase().includes(level.toLowerCase()));
  if (status) filtered = filtered.filter(c => c.status === status);

  const now = new Date();
  const expiring_soon = filtered.filter(c => c.status === 'active' && c.expiration_date && (new Date(c.expiration_date) - now) / 86400000 <= 365).length;

  return res.status(200).json({
    success: true,
    clearances: filtered,
    total: filtered.length,
    active_count: filtered.filter(c => c.status === 'active').length,
    in_progress_count: filtered.filter(c => c.status === 'in_progress').length,
    expiring_within_12_months: expiring_soon,
    levels: ['Public Trust', 'Confidential', 'Secret', 'Top Secret', 'Top Secret/SCI'],
    generated_at: now.toISOString()
  });
}
