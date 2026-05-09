const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PLAN_LIMITS = {
  starter: { proposals: 5, sbir_applications: 2, pipeline_size: 10, team_members: 3 },
  professional: { proposals: 25, sbir_applications: 15, pipeline_size: 100, team_members: 10 },
  enterprise: { proposals: 999, sbir_applications: 999, pipeline_size: 999, team_members: 999 },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const [subResult, proposalResult, pipelineResult] = await Promise.all([
    supabase.from('subscriptions').select('plan, status').eq('user_id', user_id).single(),
    supabase.from('proposals').select('id', { count: 'exact', head: true }).eq('user_id', user_id),
    supabase.from('opportunities').select('id', { count: 'exact', head: true }).eq('user_id', user_id),
  ]);

  const plan = subResult.data?.plan || 'starter';
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.starter;
  const proposalCount = proposalResult.count || 0;
  const pipelineCount = pipelineResult.count || 0;
  const proposalPercent = Math.round((proposalCount / limits.proposals) * 100);
  const pipelinePercent = Math.round((pipelineCount / limits.pipeline_size) * 100);

  const triggers = [];

  if (proposalPercent >= 80) {
    triggers.push({
      type: 'quota_warning',
      message: `You've used ${proposalPercent}% of your proposal limit. Upgrade to manage more bids.`,
      cta: 'Upgrade Plan',
      urgency: proposalPercent >= 100 ? 'high' : 'medium',
    });
  }

  if (pipelinePercent >= 80) {
    triggers.push({
      type: 'pipeline_warning',
      message: `Your pipeline is ${pipelinePercent}% full. Upgrade to track more opportunities.`,
      cta: 'Upgrade Plan',
      urgency: pipelinePercent >= 100 ? 'high' : 'medium',
    });
  }

  if (plan === 'starter') {
    triggers.push({
      type: 'feature_gate',
      message: 'Professional plan unlocks AI-assisted proposals, SBIR Phase II templates, and team collaboration.',
      cta: 'Upgrade to Professional - $199/mo',
      urgency: 'low',
    });
  }

  return res.status(200).json({
    current_plan: plan,
    usage: {
      proposals: { used: proposalCount, limit: limits.proposals, percent: proposalPercent },
      pipeline: { used: pipelineCount, limit: limits.pipeline_size, percent: pipelinePercent },
    },
    upsell_triggers: triggers,
    next_plan: plan === 'starter' ? 'professional' : plan === 'professional' ? 'enterprise' : null,
  });
};
