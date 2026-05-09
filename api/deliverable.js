// GovChain - Deliverable Tracking API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const DELIVERABLE_STATUSES = ['pending', 'in_progress', 'submitted', 'under_review', 'accepted', 'rejected', 'overdue'];
  const DELIVERABLE_TYPES = ['report', 'software', 'hardware', 'documentation', 'training', 'data', 'prototype', 'analysis', 'plan', 'other'];

  if (req.method === 'GET') {
    const { contract_id, deliverable_id, status, type, overdue_only } = req.query;

    if (!contract_id && !deliverable_id) {
      return res.status(400).json({ error: 'contract_id or deliverable_id is required' });
    }

    const sample_deliverables = [
      {
        deliverable_id: 'DEL-001',
        contract_id: contract_id || 'CONTRACT-001',
        title: 'System Design Document',
        type: 'documentation',
        description: 'Technical design document covering system architecture and data flows',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        clin: 'CLIN 0001',
        assigned_to: 'Engineering Team',
        submission_format: 'PDF',
        review_period_days: 10,
        submitted_at: null,
        accepted_at: null,
      },
      {
        deliverable_id: 'DEL-002',
        contract_id: contract_id || 'CONTRACT-001',
        title: 'Monthly Status Report - January',
        type: 'report',
        description: 'Monthly progress report covering activities, milestones, and issues',
        due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'overdue',
        clin: 'CLIN 0002',
        assigned_to: 'Project Manager',
        submission_format: 'PDF or Word',
        review_period_days: 5,
        submitted_at: null,
        accepted_at: null,
      },
    ];

    let results = sample_deliverables;
    if (status) results = results.filter((d) => d.status === status);
    if (type) results = results.filter((d) => d.type === type);
    if (overdue_only === 'true') results = results.filter((d) => d.status === 'overdue');
    if (deliverable_id) results = results.filter((d) => d.deliverable_id === deliverable_id);

    const overdue_count = results.filter((d) => d.status === 'overdue').length;

    return res.status(200).json({
      success: true,
      contract_id: contract_id || null,
      total: results.length,
      overdue_count,
      deliverables: results,
      statuses: DELIVERABLE_STATUSES,
      types: DELIVERABLE_TYPES,
    });
  }

  if (req.method === 'POST') {
    const { contract_id, title, type = 'other', description, due_date, clin, assigned_to, submission_format, review_period_days = 10 } = req.body || {};

    if (!contract_id || !title || !due_date) {
      return res.status(400).json({ error: 'contract_id, title, and due_date are required' });
    }

    if (!DELIVERABLE_TYPES.includes(type)) {
      return res.status(422).json({ error: `Invalid type. Must be one of: ${DELIVERABLE_TYPES.join(', ')}` });
    }

    const deliverable_id = `DEL-${Date.now()}`;

    return res.status(201).json({
      success: true,
      deliverable_id,
      contract_id,
      title,
      type,
      description,
      due_date,
      clin,
      assigned_to,
      submission_format,
      review_period_days,
      status: 'pending',
      created_at: new Date().toISOString(),
      message: 'Deliverable created successfully',
    });
  }

  if (req.method === 'PUT') {
    const { deliverable_id, status, submitted_at, notes } = req.body || {};

    if (!deliverable_id) {
      return res.status(400).json({ error: 'deliverable_id is required' });
    }

    if (status && !DELIVERABLE_STATUSES.includes(status)) {
      return res.status(422).json({ error: `Invalid status. Must be one of: ${DELIVERABLE_STATUSES.join(', ')}` });
    }

    return res.status(200).json({
      success: true,
      deliverable_id,
      status: status || 'in_progress',
      submitted_at: submitted_at || null,
      notes,
      updated_at: new Date().toISOString(),
      message: `Deliverable ${deliverable_id} updated`,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
