const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const REWARD_CATALOG = [
  { id: 'month_free', name: '1 Month Free', description: 'One free month of your current plan', cost: 120, type: 'subscription_credit' },
  { id: 'sbir_guidance', name: 'SBIR Application Review', description: 'Expert review of one SBIR/STTR application', cost: 200, type: 'service' },
  { id: 'proposal_templates', name: 'Premium Proposal Templates', description: 'Access 50+ government proposal templates', cost: 80, type: 'feature_unlock' },
  { id: 'upgrade_discount_25', name: '25% Upgrade Discount', description: '25% off your next plan upgrade', cost: 75, type: 'discount' },
  { id: 'sam_assistance', name: 'SAM Registration Assistance', description: 'Guided SAM.gov registration support', cost: 100, type: 'service' },
  { id: 'priority_support', name: 'Priority Support (30d)', description: '4-hour SLA support for 30 days', cost: 50, type: 'feature_unlock' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { user_id } = req.query;
    if (!user_id) return res.status(200).json({ catalog: REWARD_CATALOG });

    const [creditsResult, historyResult] = await Promise.all([
      supabase.from('referral_credits').select('total_credits').eq('user_id', user_id).single(),
      supabase.from('reward_redemptions').select('reward_id, cost, redeemed_at').eq('user_id', user_id).order('redeemed_at', { ascending: false }).limit(20),
    ]);

    const available = creditsResult.data?.total_credits || 0;
    return res.status(200).json({
      available_credits: available,
      catalog: REWARD_CATALOG.map(r => ({ ...r, can_afford: available >= r.cost })),
      redemption_history: historyResult.data || [],
    });
  }

  if (req.method === 'POST') {
    const { user_id, reward_id } = req.body;
    if (!user_id || !reward_id) return res.status(400).json({ error: 'user_id and reward_id required' });

    const reward = REWARD_CATALOG.find(r => r.id === reward_id);
    if (!reward) return res.status(404).json({ error: `Unknown reward: ${reward_id}` });

    const { data: credits } = await supabase.from('referral_credits').select('total_credits').eq('user_id', user_id).single();
    if (!credits) return res.status(404).json({ error: 'No credits found' });
    if (credits.total_credits < reward.cost) return res.status(400).json({ error: 'Insufficient credits', available: credits.total_credits, required: reward.cost });

    await supabase.from('referral_credits').update({ total_credits: credits.total_credits - reward.cost, updated_at: new Date().toISOString() }).eq('user_id', user_id);
    await supabase.from('reward_redemptions').insert({ user_id, reward_id, reward_name: reward.name, reward_type: reward.type, cost: reward.cost, status: 'pending', redeemed_at: new Date().toISOString() });

    return res.status(200).json({ success: true, reward_name: reward.name, cost: reward.cost, credits_remaining: credits.total_credits - reward.cost, message: `Successfully redeemed: ${reward.name}. Our team will follow up within 48 hours.` });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
