const users = [
  { id: 'usr_001', name: 'John Smith', email: 'john.smith@techsolutions.com', company: 'TechSolutions Inc', role: 'admin', plan: 'professional', status: 'active', sam_registered: true, certifications: ['ISO 9001', 'CMMC Level 2'], contracts: 12, created_at: '2024-06-15T00:00:00Z' },
  { id: 'usr_002', name: 'Sarah Johnson', email: 'sarah@cybershield.io', company: 'CyberShield LLC', role: 'user', plan: 'basic', status: 'active', sam_registered: true, certifications: ['ISO 27001'], contracts: 5, created_at: '2024-09-01T00:00:00Z' },
  { id: 'usr_003', name: 'Michael Lee', email: 'm.lee@dataanalytics.co', company: 'DataAnalytics Co', role: 'admin', plan: 'professional', status: 'active', sam_registered: false, certifications: [], contracts: 3, created_at: '2024-11-10T00:00:00Z' }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { id, plan, status } = req.query;
    if (id) {
      const user = users.find(u => u.id === id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ success: true, user, protocol: 'GovChain' });
    }
    let filtered = users;
    if (plan) filtered = filtered.filter(u => u.plan === plan);
    if (status) filtered = filtered.filter(u => u.status === status);
    return res.status(200).json({
      success: true,
      endpoint: '/api/user',
      users: filtered,
      total: filtered.length,
      active: filtered.filter(u => u.status === 'active').length,
      sam_registered: filtered.filter(u => u.sam_registered).length,
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { name, email, company, role = 'user', plan = 'basic' } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
    return res.status(200).json({
      success: true,
      user: {
        id: `usr_${Date.now()}`,
        name, email, company, role, plan,
        status: 'active',
        sam_registered: false,
        certifications: [],
        contracts: 0,
        created_at: new Date().toISOString(),
        protocol: 'GovChain'
      },
      protocol: 'GovChain'
    });
  }
};
