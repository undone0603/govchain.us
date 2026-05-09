module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      endpoint: '/api/milestone',
      milestones: [
        {
          id: 'ms_001',
          contract_id: 'CONTRACT-2026-001',
          title: 'Phase 1 - System Design',
          due_date: '2026-06-01',
          completion_date: '2026-05-28',
          status: 'completed',
          deliverables: ['System Architecture Document', 'Technical Specifications'],
          payment_amount_usd: 25000
        },
        {
          id: 'ms_002',
          contract_id: 'CONTRACT-2026-001',
          title: 'Phase 2 - Development',
          due_date: '2026-09-01',
          completion_date: null,
          status: 'in_progress',
          deliverables: ['Working Prototype', 'Test Results'],
          payment_amount_usd: 75000
        }
      ],
      total: 2,
      completed: 1,
      in_progress: 1,
      protocol: 'GovChain'
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
