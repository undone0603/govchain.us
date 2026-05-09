import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const MILESTONES = [
  // Contract pursuit milestones
  { id: 'first_opportunity', category: 'pipeline', threshold: 1, metric: 'opportunities_tracked', title: 'First Opportunity Tracked!', message: 'Your first government contract is in the pipeline. Every contract starts here.', icon: '📋', reward: null, badge: 'Prospect' },
  { id: 'ten_opportunities', category: 'pipeline', threshold: 10, metric: 'opportunities_tracked', title: '10 Opportunities in Pipeline', message: 'A real pipeline. 10 government contracts being tracked.', icon: '📊', reward: null, badge: 'Active Pursuer' },
  { id: 'first_bid', category: 'pipeline', threshold: 1, metric: 'bids_submitted', title: 'First Bid Submitted!', message: 'You put a number on the table. Your first government contract bid is in.', icon: '📝', reward: null, badge: 'Bidder' },
  { id: 'ten_bids', category: 'pipeline', threshold: 10, metric: 'bids_submitted', title: '10 Bids Submitted', message: 'Volume wins in government contracting. 10 bids in the system.', icon: '🔄', reward: { type: 'credit', amount: 25, description: '$25 account credit' }, badge: 'Active Bidder' },
  { id: 'first_award', category: 'award', threshold: 1, metric: 'contracts_awarded', title: '🎉 FIRST CONTRACT AWARDED!', message: 'You won a government contract! This is what GovChain is built for. Congratulations.', icon: '🏆', reward: { type: 'credit', amount: 100, description: '$100 account credit + 3 months free' }, badge: 'Contract Winner' },
  { id: 'five_awards', category: 'award', threshold: 5, metric: 'contracts_awarded', title: '5 Contracts Awarded!', message: 'You are a government contractor now. 5 awards is a track record.', icon: '⭐', reward: { type: 'discount', percent: 20, description: '20% off annual plan' }, badge: 'Multi-Award Contractor' },
  // SAM / compliance milestones
  { id: 'sam_verified', category: 'compliance', threshold: 1, metric: 'sam_verifications', title: 'SAM.gov Verified!', message: 'SAM registration confirmed. You are eligible for federal contracts.', icon: '✅', reward: null, badge: 'SAM Verified' },
  { id: 'certifications_added', category: 'compliance', threshold: 1, metric: 'certifications_count', title: 'First Certification Added!', message: 'Certifications increase your win rate. First one is in.', icon: '🏅', reward: null, badge: 'Certified Contractor' },
  { id: 'five_certifications', category: 'compliance', threshold: 5, metric: 'certifications_count', title: '5 Certifications — Fully Qualified!', message: 'Five certifications. You qualify for a wide range of set-aside contracts.', icon: '📜', reward: { type: 'feature_unlock', feature: 'ai_contract_matching', description: 'AI contract matching unlocked' }, badge: 'Fully Qualified' },
  // SBIR milestones
  { id: 'first_sbir_submitted', category: 'grants', threshold: 1, metric: 'sbir_applications', title: 'First SBIR Application!', message: 'Non-dilutive funding submitted. Your first SBIR application is in the queue.', icon: '🔬', reward: null, badge: 'SBIR Applicant' },
  { id: 'first_grant_awarded', category: 'grants', threshold: 1, metric: 'grants_awarded', title: 'Grant Awarded — Non-Dilutive Win!', message: 'You won a government grant. Free money to build your company.', icon: '💰', reward: { type: 'credit', amount: 75, description: '$75 account credit' }, badge: 'Grant Winner' },
  // Revenue / retention
  { id: 'first_payment', category: 'revenue', threshold: 1, metric: 'payments_made', title: 'First Payment — Welcome!', message: 'You are a paying GovChain customer. Let us help you win contracts.', icon: '💳', reward: { type: 'bonus', description: 'Free capability statement review' }, badge: 'Paying Member' },
  { id: 'one_year', category: 'retention', threshold: 365, metric: 'days_active', title: 'One Year on GovChain!', message: 'A full year pursuing government contracts. You are serious about this.', icon: '🎉', reward: { type: 'credit', amount: 100, description: '$100 account credit' }, badge: 'Annual Member' },
];

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
    const { data: achieved } = await supabase.from('milestone_achievements').select('*').eq('user_id', user.id);
    const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single();
    const achievedIds = (achieved || []).map(a => a.milestone_id);

    const enriched = MILESTONES.map(m => {
      const current = stats?.[m.metric] || 0;
      const isAchieved = achievedIds.includes(m.id);
      return {
        ...m,
        achieved: isAchieved,
        achieved_at: (achieved || []).find(a => a.milestone_id === m.id)?.achieved_at || null,
        current_value: current,
        progress_percent: Math.min(100, Math.round((current / m.threshold) * 100)),
        remaining: isAchieved ? 0 : Math.max(0, m.threshold - current)
      };
    });

    const total_achieved = achievedIds.length;
    const signature_milestone = enriched.find(m => m.id === 'first_award');

    return res.status(200).json({
      success: true,
      total_milestones: MILESTONES.length,
      total_achieved,
      completion_percent: Math.round((total_achieved / MILESTONES.length) * 100),
      milestones: enriched,
      next_milestone: enriched.find(m => !m.achieved) || null,
      signature_milestone
    });
  }

  if (req.method === 'POST') {
    const { metric, new_value } = req.body;
    if (!metric || new_value === undefined) return res.status(400).json({ error: 'metric and new_value required' });

    const triggered = MILESTONES.filter(m => m.metric === metric && new_value >= m.threshold);
    if (!triggered.length) return res.status(200).json({ success: true, newly_achieved: [] });

    const { data: existing } = await supabase.from('milestone_achievements').select('milestone_id').eq('user_id', user.id);
    const existingIds = (existing || []).map(e => e.milestone_id);
    const newlyAchieved = triggered.filter(m => !existingIds.includes(m.id));

    if (newlyAchieved.length > 0) {
      await supabase.from('milestone_achievements').insert(
        newlyAchieved.map(m => ({ user_id: user.id, milestone_id: m.id, metric, value_at_achievement: new_value, reward: m.reward || null, achieved_at: new Date().toISOString() }))
      );
    }

    return res.status(200).json({
      success: true,
      newly_achieved: newlyAchieved.map(m => ({ id: m.id, title: m.title, message: m.message, icon: m.icon, badge: m.badge, reward: m.reward, celebrate: true }))
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
