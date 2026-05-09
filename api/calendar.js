// /api/calendar - Government contracting deadlines and events calendar
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id, event_type, start_date, end_date } = req.query;

  const events = [
    {
      id: 'cal_001',
      user_id: 'usr_001',
      title: 'DoD SBIR Phase II Proposal Deadline',
      event_type: 'deadline',
      date: '2026-03-15T17:00:00Z',
      end_date: null,
      all_day: false,
      priority: 'critical',
      related_to: { type: 'opportunity', id: 'fund_001' },
      agency: 'Department of Defense',
      notes: 'Full proposal required including technical volume, cost volume, and STTR team agreement',
      reminder_days: [30, 14, 7, 3, 1],
      completed: true,
      color: '#ef4444'
    },
    {
      id: 'cal_002',
      user_id: 'usr_001',
      title: 'DHS SVIP Contract Negotiation Call',
      event_type: 'meeting',
      date: '2026-05-15T14:00:00Z',
      end_date: '2026-05-15T15:00:00Z',
      all_day: false,
      priority: 'high',
      related_to: { type: 'pipeline', id: 'pipe_002' },
      agency: 'Department of Homeland Security',
      notes: 'Final contract terms review with Dr. Chang. Review SOW and pricing before call.',
      reminder_days: [7, 1],
      completed: false,
      color: '#f59e0b'
    },
    {
      id: 'cal_003',
      user_id: 'usr_001',
      title: 'NSF SBIR Letter of Intent Due',
      event_type: 'deadline',
      date: '2026-06-15T17:00:00Z',
      end_date: null,
      all_day: false,
      priority: 'high',
      related_to: { type: 'funding', id: 'fund_004' },
      agency: 'National Science Foundation',
      notes: 'LOI submission via NSF FastLane. 3-page max including project description and team qualifications.',
      reminder_days: [30, 14, 7],
      completed: false,
      color: '#ef4444'
    },
    {
      id: 'cal_004',
      user_id: 'usr_001',
      title: 'SAM.gov Registration Renewal',
      event_type: 'renewal',
      date: '2026-07-31T17:00:00Z',
      end_date: null,
      all_day: true,
      priority: 'critical',
      related_to: { type: 'compliance', id: 'sam_001' },
      agency: 'GSA',
      notes: 'Annual SAM.gov registration renewal required to maintain eligibility for federal contracts',
      reminder_days: [60, 30, 14, 7],
      completed: false,
      color: '#8b5cf6'
    },
    {
      id: 'cal_005',
      user_id: 'usr_001',
      title: 'TechConnect Government Innovation Conference',
      event_type: 'conference',
      date: '2026-06-09T08:00:00Z',
      end_date: '2026-06-11T17:00:00Z',
      all_day: false,
      priority: 'medium',
      related_to: null,
      agency: null,
      notes: 'Annual matchmaking event; schedule 1:1s with DARPA I2O and DHS S&T program managers',
      reminder_days: [30, 14, 7],
      completed: false,
      color: '#10b981'
    },
    {
      id: 'cal_006',
      user_id: 'usr_001',
      title: 'MEDC BDP Application Opens',
      event_type: 'deadline',
      date: '2026-08-01T08:00:00Z',
      end_date: null,
      all_day: true,
      priority: 'medium',
      related_to: { type: 'funding', id: 'fund_003' },
      agency: 'Michigan Economic Development Corporation',
      notes: 'Q3 2026 application window opens; prepare job creation plan and budget',
      reminder_days: [30, 14],
      completed: false,
      color: '#ef4444'
    }
  ];

  let filtered = events;
  if (user_id) filtered = filtered.filter(e => e.user_id === user_id);
  if (event_type) filtered = filtered.filter(e => e.event_type === event_type);
  if (start_date) filtered = filtered.filter(e => e.date >= start_date);
  if (end_date) filtered = filtered.filter(e => e.date <= end_date);

  const today = new Date().toISOString();
  const upcoming_7_days = filtered.filter(e => {
    const days = (new Date(e.date) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  }).length;

  const overdue = filtered.filter(e => e.date < today && !e.completed).length;

  return res.status(200).json({
    success: true,
    events: filtered.sort((a, b) => new Date(a.date) - new Date(b.date)),
    total: filtered.length,
    upcoming_7_days,
    overdue,
    event_types: ['deadline', 'meeting', 'renewal', 'conference', 'submission', 'review', 'award'],
    priorities: ['low', 'medium', 'high', 'critical'],
    generated_at: new Date().toISOString()
  });
};
