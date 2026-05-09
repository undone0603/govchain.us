module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      endpoint: '/api/budget',
      budgets: [
        {
          id: 'bud_001',
          contract_id: 'CONTRACT-2026-001',
          fiscal_year: '2026',
          total_awarded_usd: 250000,
          allocated_usd: 175000,
          spent_usd: 82500,
          remaining_usd: 92500,
          categories: {
            labor: { allocated: 120000, spent: 65000 },
            equipment: { allocated: 35000, spent: 12000 },
            overhead: { allocated: 20000, spent: 5500 }
          },
          burn_rate_monthly_usd: 13750,
          estimated_completion: '2026-12-01'
        }
      ],
      total: 1,
      total_awarded_usd: 250000,
      total_spent_usd: 82500,
      protocol: 'GovChain'
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
