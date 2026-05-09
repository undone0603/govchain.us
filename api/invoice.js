// api/invoice.js - Government Contract Invoice Management
const allowedOrigins = ['https://govchain.us', 'https://www.govchain.us'];

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { contract_id, status } = req.query;
    const invoices = [
      {
        id: 'INV-2024-001',
        contract_id: 'GC-2024-001',
        vendor: 'TechCorp Solutions LLC',
        amount: 125000,
        currency: 'USD',
        status: 'paid',
        submitted_at: '2024-10-31',
        paid_at: '2024-11-15',
        description: 'Phase 1 Milestone Completion',
        blockchain_hash: '0xabc123def456'
      },
      {
        id: 'INV-2024-002',
        contract_id: 'GC-2024-001',
        vendor: 'TechCorp Solutions LLC',
        amount: 75000,
        currency: 'USD',
        status: 'pending',
        submitted_at: '2024-11-30',
        paid_at: null,
        description: 'Phase 2 Milestone Completion',
        blockchain_hash: '0xghi789jkl012'
      },
    ];
    const filtered = status ? invoices.filter(i => i.status === status) : invoices;
    return res.status(200).json({
      success: true,
      endpoint: '/api/invoice',
      invoices: filtered,
      total: filtered.length,
      total_amount: filtered.reduce((sum, i) => sum + i.amount, 0),
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { contract_id, vendor, amount, description } = req.body || {};
    if (!contract_id || !amount) return res.status(400).json({ error: 'contract_id and amount are required' });
    const invoice_id = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    return res.status(200).json({
      success: true,
      invoice: {
        id: invoice_id,
        contract_id,
        vendor: vendor || 'Unknown Vendor',
        amount,
        currency: 'USD',
        status: 'submitted',
        submitted_at: new Date().toISOString().split('T')[0],
        description,
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 18)}`,
      },
      protocol: 'GovChain'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
