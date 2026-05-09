const notifications = [
  { id: 'notif_001', type: 'deadline_alert', title: 'RFP Deadline Approaching', message: 'RFP-2025-0042 deadline is in 48 hours - Federal IT Infrastructure', severity: 'high', read: false, created_at: '2025-01-15T08:00:00Z', agency: 'DoD' },
  { id: 'notif_002', type: 'award_notification', title: 'Contract Award', message: 'You have been awarded contract GVT-2025-0089 for Cybersecurity Services', severity: 'success', read: false, created_at: '2025-01-15T10:00:00Z', agency: 'DHS' },
  { id: 'notif_003', type: 'compliance_required', title: 'Compliance Document Required', message: 'Submit SAR for contract GVT-2025-0067 by January 31, 2025', severity: 'warning', read: true, created_at: '2025-01-14T09:00:00Z', agency: 'GSA' },
  { id: 'notif_004', type: 'grant_status', title: 'Grant Application Update', message: 'SBIR Phase II application GRT-2025-0023 is under review', severity: 'info', read: false, created_at: '2025-01-15T11:30:00Z', agency: 'NSF' }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { unread, severity, agency } = req.query;
    let filtered = notifications;
    if (unread === 'true') filtered = filtered.filter(n => !n.read);
    if (severity) filtered = filtered.filter(n => n.severity === severity);
    if (agency) filtered = filtered.filter(n => n.agency === agency);
    return res.status(200).json({
      success: true,
      endpoint: '/api/notification',
      notifications: filtered,
      total: filtered.length,
      unread_count: filtered.filter(n => !n.read).length,
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { type, title, message, severity = 'info', agency } = req.body || {};
    if (!title || !message) return res.status(400).json({ error: 'title and message are required' });
    return res.status(200).json({
      success: true,
      notification: { id: `notif_${Date.now()}`, type, title, message, severity, agency, read: false, created_at: new Date().toISOString() },
      protocol: 'GovChain'
    });
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    return res.status(200).json({ success: true, message: `Notification ${id} marked as read`, protocol: 'GovChain' });
  }
};
