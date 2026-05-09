// /api/task - Government contract project task management
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { contract_id, assignee, status, priority } = req.query;

  const tasks = [
    {
      id: 'task_001',
      contract_id: 'contract_001',
      title: 'Submit Phase I Technical Report',
      description: 'Prepare and submit the SBIR Phase I technical progress report to DoD SBIR office',
      assignee: 'emp_001',
      assignee_name: 'Alex Johnson',
      status: 'in_progress',
      priority: 'high',
      due_date: '2026-05-20',
      created_at: '2026-04-01T08:00:00Z',
      completed_at: null,
      tags: ['sbir', 'reporting', 'dod'],
      deliverable: 'Technical Progress Report v1.0',
      clin: 'CLIN-0001'
    },
    {
      id: 'task_002',
      contract_id: 'contract_001',
      title: 'Patent Application Filing',
      description: 'File provisional patent application for blockchain authentication technology',
      assignee: 'emp_002',
      assignee_name: 'Maria Garcia',
      status: 'pending',
      priority: 'high',
      due_date: '2026-06-15',
      created_at: '2026-04-15T09:00:00Z',
      completed_at: null,
      tags: ['ip', 'patent', 'legal'],
      deliverable: 'Provisional Patent Application',
      clin: 'CLIN-0002'
    },
    {
      id: 'task_003',
      contract_id: 'contract_002',
      title: 'Security Clearance Documentation',
      description: 'Submit SF-86 clearance documentation for DHS SVIP program participation',
      assignee: 'emp_003',
      assignee_name: 'Sam Torres',
      status: 'completed',
      priority: 'critical',
      due_date: '2026-04-30',
      created_at: '2026-03-01T10:00:00Z',
      completed_at: '2026-04-28T14:30:00Z',
      tags: ['security', 'clearance', 'dhs'],
      deliverable: 'SF-86 Form Submission',
      clin: 'CLIN-0001'
    },
    {
      id: 'task_004',
      contract_id: 'contract_001',
      title: 'Quarterly Financial Report',
      description: 'Prepare SF-425 Federal Financial Report for Q1 2026',
      assignee: 'emp_004',
      assignee_name: 'Casey Kim',
      status: 'completed',
      priority: 'medium',
      due_date: '2026-04-15',
      created_at: '2026-03-15T08:00:00Z',
      completed_at: '2026-04-14T16:00:00Z',
      tags: ['finance', 'reporting', 'sf425'],
      deliverable: 'SF-425 Q1 2026',
      clin: 'CLIN-0003'
    },
    {
      id: 'task_005',
      contract_id: 'contract_002',
      title: 'Prototype Demonstration Setup',
      description: 'Configure and test prototype blockchain verification system for DHS demo',
      assignee: 'emp_001',
      assignee_name: 'Alex Johnson',
      status: 'pending',
      priority: 'critical',
      due_date: '2026-06-01',
      created_at: '2026-05-01T09:00:00Z',
      completed_at: null,
      tags: ['prototype', 'demo', 'dhs'],
      deliverable: 'Working Prototype v2.0',
      clin: 'CLIN-0002'
    }
  ];

  let filtered = tasks;
  if (contract_id) filtered = filtered.filter(t => t.contract_id === contract_id);
  if (assignee) filtered = filtered.filter(t => t.assignee === assignee);
  if (status) filtered = filtered.filter(t => t.status === status);
  if (priority) filtered = filtered.filter(t => t.priority === priority);

  return res.status(200).json({
    success: true,
    tasks: filtered,
    total: filtered.length,
    pending: filtered.filter(t => t.status === 'pending').length,
    in_progress: filtered.filter(t => t.status === 'in_progress').length,
    completed: filtered.filter(t => t.status === 'completed').length,
    overdue: filtered.filter(t => t.status !== 'completed' && t.due_date < new Date().toISOString().split('T')[0]).length,
    statuses: ['pending', 'in_progress', 'completed', 'blocked', 'cancelled'],
    priorities: ['low', 'medium', 'high', 'critical'],
    generated_at: new Date().toISOString()
  });
};
