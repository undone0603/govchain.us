// api/proposal.js - Government Contract Proposal Management
const allowedOrigins = ['https://govchain.us', 'https://www.govchain.us'];

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { rfp_id, status, vendor } = req.query;
    const proposals = [
      {
        id: 'PROP-2024-001',
        rfp_id: 'RFP-2024-DOD-001',
        vendor: 'TechCorp Solutions LLC',
        title: 'AI-Based Supply Chain Verification System',
        amount: 2500000,
        currency: 'USD',
        status: 'under_review',
        submitted_at: '2024-10-20',
        technical_score: 87,
        cost_score: 91,
        total_score: 89,
        blockchain_hash: '0xprop001hash'
      },
      {
        id: 'PROP-2024-002',
        rfp_id: 'RFP-2024-DHS-001',
        vendor: 'SecureGov Systems Inc',
        title: 'Blockchain Document Authentication Platform',
        amount: 1800000,
        currency: 'USD',
        status: 'awarded',
        submitted_at: '2024-09-15',
        technical_score: 94,
        cost_score: 88,
        total_score: 91,
        blockchain_hash: '0xprop002hash'
      },
    ];
    const filtered = status ? proposals.filter(p => p.status === status) : proposals;
    return res.status(200).json({
      success: true,
      endpoint: '/api/proposal',
      proposals: filtered,
      total: filtered.length,
      blockchain_verified: true,
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { rfp_id, vendor, title, amount, technical_details } = req.body || {};
    if (!rfp_id || !vendor || !amount) return res.status(400).json({ error: 'rfp_id, vendor, and amount are required' });
    const proposal_id = `PROP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    return res.status(200).json({
      success: true,
      proposal: {
        id: proposal_id,
        rfp_id,
        vendor,
        title: title || 'Proposal',
        amount,
        currency: 'USD',
        status: 'submitted',
        submitted_at: new Date().toISOString().split('T')[0],
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 18)}`,
      },
      protocol: 'GovChain'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
