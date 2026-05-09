const payments = [
  { id: 'pay_001', vendor: 'TechSolutions Inc', contract_id: 'GVT-2025-0067', amount: 125000.00, status: 'processed', type: 'milestone', processed_at: '2025-01-10T10:00:00Z', blockchain_verified: true },
  { id: 'pay_002', vendor: 'CyberShield LLC', contract_id: 'GVT-2025-0089', amount: 75000.00, status: 'pending', type: 'invoice', processed_at: null, blockchain_verified: false },
  { id: 'pay_003', vendor: 'DataAnalytics Co', contract_id: 'GVT-2025-0102', amount: 48500.00, status: 'processed', type: 'milestone', processed_at: '2025-01-12T14:30:00Z', blockchain_verified: true }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { status, contract_id } = req.query;
    let filtered = payments;
    if (status) filtered = filtered.filter(p => p.status === status);
    if (contract_id) filtered = filtered.filter(p => p.contract_id === contract_id);
    return res.status(200).json({
      success: true,
      endpoint: '/api/payment',
      payments: filtered,
      total: filtered.length,
      total_processed: filtered.filter(p => p.status === 'processed').reduce((s, p) => s + p.amount, 0),
      total_pending: filtered.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { vendor, contract_id, amount, type = 'invoice' } = req.body || {};
    if (!vendor || !contract_id || !amount) return res.status(400).json({ error: 'vendor, contract_id, and amount are required' });
    return res.status(200).json({
      success: true,
      payment: {
        id: `pay_${Date.now()}`,
        vendor, contract_id,
        amount: parseFloat(amount),
        status: 'pending',
        type,
        created_at: new Date().toISOString(),
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 18)}`,
        blockchain_verified: true,
        protocol: 'GovChain'
      },
      protocol: 'GovChain'
    });
  }
};
