const plans = [
  { id: 'plan_basic', name: 'Basic', price: 199, interval: 'month', features: ['10 contracts', 'Grant tracking', 'Basic analytics', 'Email support'], max_contracts: 10 },
  { id: 'plan_professional', name: 'Professional', price: 499, interval: 'month', features: ['Unlimited contracts', 'SAM.gov sync', 'Advanced analytics', 'API access', 'Priority support'], max_contracts: -1 },
  { id: 'plan_enterprise', name: 'Enterprise', price: 1499, interval: 'month', features: ['Unlimited contracts', 'SAM.gov sync', 'Custom analytics', 'Full API', 'Dedicated support', 'White-label', 'SBIR assistance'], max_contracts: -1 }
];

const subscriptions = [
  { id: 'sub_001', customer: 'TechSolutions Inc', plan: 'plan_professional', status: 'active', current_period_end: '2025-02-15T00:00:00Z', blockchain_verified: true },
  { id: 'sub_002', customer: 'CyberShield LLC', plan: 'plan_basic', status: 'active', current_period_end: '2025-02-10T00:00:00Z', blockchain_verified: true }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { type } = req.query;
    if (type === 'plans') return res.status(200).json({ success: true, plans, protocol: 'GovChain' });
    return res.status(200).json({
      success: true,
      endpoint: '/api/subscription',
      subscriptions,
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { customer_id, plan_id } = req.body || {};
    if (!customer_id || !plan_id) return res.status(400).json({ error: 'customer_id and plan_id are required' });
    const plan = plans.find(p => p.id === plan_id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    return res.status(200).json({
      success: true,
      subscription: {
        id: `sub_${Date.now()}`,
        customer_id, plan_id,
        plan_name: plan.name,
        status: 'active',
        amount: plan.price,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 18)}`,
        blockchain_verified: true,
        protocol: 'GovChain'
      },
      protocol: 'GovChain'
    });
  }
};
