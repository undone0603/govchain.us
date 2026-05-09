import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const REFERRAL_REWARDS = {
  referrer: { type: 'credit', amount: 25, description: '$25 account credit when your referral converts to paid' },
  referred: { type: 'discount', percent: 20, description: '20% off your first 3 months' }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

  if (req.method === 'GET') {
    // Get or create referral code
    let { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .single();

    if (!referral) {
      const code = 'GOV' + randomBytes(4).toString('hex').toUpperCase();
      const { data: newRef, error: createErr } = await supabase
        .from('referrals')
        .insert({ referrer_id: user.id, code, status: 'active', created_at: new Date().toISOString() })
        .select()
        .single();
      if (createErr) return res.status(500).json({ error: createErr.message });
      referral = newRef;
    }

    const { data: conversions } = await supabase
      .from('referral_conversions')
      .select('*')
      .eq('referral_id', referral.id);

    const total_referrals = conversions?.length || 0;
    const converted = conversions?.filter(c => c.status === 'paid').length || 0;
    const earned = converted * REFERRAL_REWARDS.referrer.amount;

    return res.status(200).json({
      success: true,
      referral_code: referral.code,
      referral_url: `https://govchain.us/signup?ref=${referral.code}`,
      rewards: REFERRAL_REWARDS,
      stats: { total_referrals, converted, earned },
      share_message: `Join me on GovChain - the easiest way to track government contracts and grants. Use my code ${referral.code} for 20% off your first 3 months.`
    });
  }

  if (req.method === 'POST') {
    const { referral_code } = req.body;
    if (!referral_code) return res.status(400).json({ error: 'referral_code is required' });

    const { data: referral, error: refErr } = await supabase
      .from('referrals')
      .select('*')
      .eq('code', referral_code.toUpperCase())
      .single();

    if (refErr || !referral) return res.status(404).json({ error: 'Invalid referral code' });
    if (referral.referrer_id === user.id) return res.status(400).json({ error: 'You cannot use your own referral code' });

    const { data: existing } = await supabase
      .from('referral_conversions')
      .select('id')
      .eq('referred_id', user.id)
      .single();

    if (existing) return res.status(200).json({ success: true, already_applied: true, discount_percent: REFERRAL_REWARDS.referred.percent });

    const { error: convErr } = await supabase
      .from('referral_conversions')
      .insert({ referral_id: referral.id, referred_id: user.id, status: 'pending', created_at: new Date().toISOString() });

    if (convErr) return res.status(500).json({ error: convErr.message });

    return res.status(200).json({
      success: true,
      applied: true,
      discount_percent: REFERRAL_REWARDS.referred.percent,
      message: `Referral code applied! You\'ll receive ${REFERRAL_REWARDS.referred.percent}% off your first 3 months.`
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
