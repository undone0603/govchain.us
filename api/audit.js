// api/audit.js - Government Contract Audit Trail
const allowedOrigins = ['https://govchain.us', 'https://www.govchain.us'];

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { contract_id, agency } = req.query;
    return res.status(200).json({
      success: true,
      endpoint: '/api/audit',
      contract_id: contract_id || 'all',
      agency: agency || 'all',
      audit_trail: [
        { id: 'aud_001', event: 'contract_created', contract_id: 'GC-2024-001', actor: 'agency_dod', timestamp: '2024-10-01T09:00:00Z', blockchain_hash: '0xabc123' },
        { id: 'aud_002', event: 'bid_submitted', contract_id: 'GC-2024-001', actor: 'vendor_techcorp', timestamp: '2024-10-05T14:30:00Z', blockchain_hash: '0xdef456' },
        { id: 'aud_003', event: 'award_issued', contract_id: 'GC-2024-001', actor: 'agency_dod', timestamp: '2024-10-15T11:00:00Z', blockchain_hash: '0xghi789' },
        { id: 'aud_004', event: 'milestone_completed', contract_id: 'GC-2024-001', actor: 'vendor_techcorp', timestamp: '2024-11-01T16:00:00Z', blockchain_hash: '0xjkl012' },
        { id: 'aud_005', event: 'payment_released', contract_id: 'GC-2024-001', actor: 'agency_dod', timestamp: '2024-11-03T10:00:00Z', blockchain_hash: '0xmno345' },
      ],
      total: 5,
      blockchain_verified: true,
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { contract_id, event, actor, details } = req.body || {};
    if (!contract_id || !event) return res.status(400).json({ error: 'contract_id and event are required' });
    return res.status(200).json({
      success: true,
      audit_entry: {
        id: `aud_${Date.now()}`,
        event,
        contract_id,
        actor: actor || 'system',
        details,
        timestamp: new Date().toISOString(),
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 18)}`,
      },
      protocol: 'GovChain'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
