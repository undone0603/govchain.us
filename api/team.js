module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { org_id, role } = req.query;

  const members = [
    {
      id: 'member_001',
      name: 'Alex Rivera',
      email: 'alex@govchain.us',
      role: 'admin',
      title: 'Founder & CEO',
      department: 'Executive',
      joined: '2024-01-01',
      status: 'active',
      permissions: ['read', 'write', 'admin', 'billing'],
      last_active: '2026-05-01',
      protocol: 'GovChain'
    },
    {
      id: 'member_002',
      name: 'Jordan Kim',
      email: 'jordan@govchain.us',
      role: 'analyst',
      title: 'Government Contracts Analyst',
      department: 'Operations',
      joined: '2024-06-15',
      status: 'active',
      permissions: ['read', 'write'],
      last_active: '2026-04-30',
      protocol: 'GovChain'
    },
    {
      id: 'member_003',
      name: 'Sam Chen',
      email: 'sam@govchain.us',
      role: 'viewer',
      title: 'Compliance Officer',
      department: 'Legal',
      joined: '2025-02-01',
      status: 'active',
      permissions: ['read'],
      last_active: '2026-04-28',
      protocol: 'GovChain'
    }
  ];

  let filtered = members;
  if (role) filtered = filtered.filter(m => m.role === role);

  if (req.method === 'POST') {
    const { name, email, role: newRole = 'viewer', title = '', department = '' } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const newMember = {
      id: `member_${Date.now()}`,
      name, email, role: newRole, title, department,
      joined: new Date().toISOString().split('T')[0],
      status: 'active',
      permissions: newRole === 'admin' ? ['read','write','admin'] : newRole === 'analyst' ? ['read','write'] : ['read'],
      last_active: null,
      protocol: 'GovChain'
    };
    return res.status(201).json({ success: true, member: newMember, message: 'Team member invited' });
  }

  return res.status(200).json({
    success: true,
    members: filtered,
    total: filtered.length,
    admins: filtered.filter(m => m.role === 'admin').length,
    analysts: filtered.filter(m => m.role === 'analyst').length,
    viewers: filtered.filter(m => m.role === 'viewer').length,
    protocol: 'GovChain'
  });
};
