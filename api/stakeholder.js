module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      endpoint: '/api/stakeholder',
      stakeholders: [
        { id: 'stk_001', name: 'Sarah Johnson', role: 'Contracting Officer', agency: 'DoD', email: 'sjohnson@dod.gov', status: 'active' },
        { id: 'stk_002', name: 'Michael Chen', role: 'Program Manager', agency: 'DHS', email: 'mchen@dhs.gov', status: 'active' },
        { id: 'stk_003', name: 'Lisa Williams', role: 'Technical Lead', organization: 'AuthiChain Inc', email: 'lwilliams@authichain.com', status: 'active' }
      ],
      total: 3,
      protocol: 'GovChain'
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
