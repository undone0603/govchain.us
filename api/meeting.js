module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      endpoint: '/api/meeting',
      meetings: [
        {
          id: 'mtg_001',
          contract_id: 'CONTRACT-2026-001',
          title: 'Monthly Status Review',
          date: '2026-05-15',
          time: '10:00 AM ET',
          attendees: ['sjohnson@dod.gov', 'lwilliams@authichain.com'],
          agenda: ['Phase 2 progress', 'Budget review', 'Risk assessment'],
          minutes_url: null,
          status: 'scheduled'
        },
        {
          id: 'mtg_002',
          contract_id: 'CONTRACT-2026-001',
          title: 'Kick-off Meeting',
          date: '2026-04-01',
          time: '2:00 PM ET',
          attendees: ['sjohnson@dod.gov', 'mchen@dhs.gov', 'lwilliams@authichain.com'],
          agenda: ['Project overview', 'Team introductions', 'Timeline review'],
          minutes_url: 'https://govchain.us/minutes/mtg_002.pdf',
          status: 'completed'
        }
      ],
      total: 2,
      upcoming: 1,
      protocol: 'GovChain'
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
