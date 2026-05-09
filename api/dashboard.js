const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PLAN_LIMITS = {
  free: { contracts: 3, proposals: 5, grants: 2 },
  starter: { contracts: 25, proposals: 50, grants: 10 },
  pro: { contracts: 250, proposals: 500, grants: 100 },
  enterprise: { contracts: -1, proposals: -1, grants: -1 },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  try {
    const [profileRes, contractsRes, proposalsRes, grantsRes, pipelineRes, trialRes] = await Promise.all([
      supabase.from('profiles').select('id, email, name, company, current_plan, trial_ends_at, created_at, referral_code').eq('id', user_id).single(),
      supabase.from('contracts').select('id', { count: 'exact', head: true }).eq('user_id', user_id),
      supabase.from('proposals').select('id', { count: 'exact', head: true }).eq('user_id', user_id),
      supabase.from('grants').select('id', { count: 'exact', head: true }).eq('user_id', user_id),
      supabase.from('pipeline').select('id, stage, value').eq('user_id', user_id),
      supabase.from('trials').select('status, ends_at').eq('user_id', user_id).single(),
    ]);

    const profile = profileRes.data;
    if (!profile) return res.status(404).json({ error: 'User not found' });

    const plan = profile.current_plan || 'free';
    const limits = PLAN_LIMITS[plan.replace('_trial', '')] || PLAN_LIMITS.free;
    const isTrialing = plan.endsWith('_trial');
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const trialDaysRemaining = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt - Date.now()) / 86400000)) : null;

    const contractCount = contractsRes.count || 0;
    const proposalCount = proposalsRes.count || 0;
    const grantCount = grantsRes.count || 0;
    const pipeline = pipelineRes.data || [];
    const pipelineValue = pipeline.reduce((sum, p) => sum + (p.value || 0), 0);
    const activePipeline = pipeline.filter(p => ['prospect', 'proposal', 'negotiation'].includes(p.stage)).length;

    const { data: credits } = await supabase.from('referral_credits').select('total_credits, total_referrals').eq('user_id', user_id).single();
    const { data: recentActivity } = await supabase.from('analytics_events').select('event, properties, created_at').eq('user_id', user_id).order('created_at', { ascending: false }).limit(5);

    return res.status(200).json({
      user: { id: profile.id, name: profile.name, email: profile.email, company: profile.company, member_since: profile.created_at },
      plan: {
        current: plan,
        is_trialing: isTrialing,
        trial_days_remaining: trialDaysRemaining,
        upgrade_cta: plan === 'free' ? 'Start 14-day Pro trial' : isTrialing ? `Upgrade before trial ends (${trialDaysRemaining}d left)` : null,
      },
      usage: {
        contracts: { current: contractCount, limit: limits.contracts, pct: limits.contracts > 0 ? Math.round((contractCount / limits.contracts) * 100) : 0 },
        proposals: { current: proposalCount, limit: limits.proposals, pct: limits.proposals > 0 ? Math.round((proposalCount / limits.proposals) * 100) : 0 },
        grants: { current: grantCount, limit: limits.grants, pct: limits.grants > 0 ? Math.round((grantCount / limits.grants) * 100) : 0 },
      },
      pipeline: {
        total_opportunities: pipeline.length,
        active_opportunities: activePipeline,
        total_value: pipelineValue,
        by_stage: ['prospect', 'proposal', 'negotiation', 'awarded', 'lost'].map(stage => ({
          stage,
          count: pipeline.filter(p => p.stage === stage).length,
          value: pipeline.filter(p => p.stage === stage).reduce((s, p) => s + (p.value || 0), 0),
        })),
      },
      referrals: {
        total_credits: credits?.total_credits || 0,
        total_paid_referrals: credits?.total_referrals || 0,
        share_url: `https://govchain.us/register?ref=${profile.referral_code}`,
      },
      recent_activity: recentActivity || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
