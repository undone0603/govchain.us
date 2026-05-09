import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  if (req.method === 'POST') {
    const { plan_id, billing_cycle = 'monthly', promo_code } = req.body;
    if (!plan_id) return res.status(400).json({ error: 'plan_id is required' });

    const PLANS = {
      small_business: { monthly: 99, annual: 79, stripe_monthly: 'price_govchain_sb_monthly', stripe_annual: 'price_govchain_sb_annual' },
      contractor_pro: { monthly: 199, annual: 159, stripe_monthly: 'price_govchain_cp_monthly', stripe_annual: 'price_govchain_cp_annual' },
      agency_pro: { monthly: 499, annual: 399, stripe_monthly: 'price_govchain_ap_monthly', stripe_annual: 'price_govchain_ap_annual' },
      enterprise: { monthly: null, annual: null, contact: true }
    };

    const plan = PLANS[plan_id];
    if (!plan) return res.status(400).json({ error: 'Invalid plan_id' });
    if (plan.contact) return res.status(200).json({ success: true, contact_required: true, message: 'Contact sales@govchain.us for Enterprise pricing.' });

    const price_id = billing_cycle === 'annual' ? plan.stripe_annual : plan.stripe_monthly;
    const amount = billing_cycle === 'annual' ? plan.annual : plan.monthly;

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    let discount = 0;
    if (promo_code === 'GOVFIRST') discount = 20;
    if (promo_code === 'SBIR50') discount = 50;

    const final_amount = amount - Math.floor(amount * discount / 100);

    const { data: upgrade, error: upgradeErr } = await supabase
      .from('upgrades')
      .insert({
        user_id: user.id,
        from_plan: existing?.plan_id || 'free',
        to_plan: plan_id,
        billing_cycle,
        price_id,
        amount: final_amount,
        discount_percent: discount,
        promo_code: promo_code || null,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (upgradeErr) return res.status(500).json({ error: upgradeErr.message });

    return res.status(200).json({
      success: true,
      upgrade_id: upgrade.id,
      from_plan: upgrade.from_plan,
      to_plan: plan_id,
      billing_cycle,
      amount: final_amount,
      discount_percent: discount,
      price_id,
      next_step: 'checkout',
      checkout_url: `/api/checkout?upgrade_id=${upgrade.id}`
    });
  }

  if (req.method === 'GET') {
    const { data: history } = await supabase
      .from('upgrades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return res.status(200).json({ success: true, upgrades: history || [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
