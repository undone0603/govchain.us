const BADGE_CATALOG = [
  { id: 'first_contract', name: 'Contract Pioneer', description: 'First government contract tracked', icon: '📜', category: 'contracts' },
  { id: 'contract_10', name: 'Contract Pro', description: '10 contracts tracked', icon: '🏆', category: 'contracts' },
  { id: 'sam_registered', name: 'SAM Registered', description: 'SAM.gov registration confirmed', icon: '🏷️', category: 'compliance' },
  { id: 'first_grant', name: 'Grant Seeker', description: 'First grant opportunity tracked', icon: '💰', category: 'grants' },
  { id: 'sbir_applied', name: 'SBIR Applicant', description: 'SBIR/STTR application submitted', icon: '🔬', category: 'grants' },
  { id: 'proposal_won', name: 'Proposal Winner', description: 'First awarded contract', icon: '🥇', category: 'awards' },
  { id: 'streak_7', name: 'Week Tracker', description: '7-day contract monitoring streak', icon: '📅', category: 'streak' },
  { id: 'streak_30', name: 'Monthly Monitor', description: '30-day monitoring streak', icon: '🎯', category: 'streak' },
  { id: 'enterprise_gov', name: 'GovChain Enterprise', description: 'Activated enterprise government plan', icon: '🏗️', category: 'subscription' },
  { id: 'blockchain_cert', name: 'Blockchain Certified', description: 'First contract certified on chain', icon: '⛓️', category: 'blockchain' },
];

export default {
  async fetch(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');

    const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_ANON_KEY }
    });
    if (!userRes.ok) return Response.json({ error: 'Invalid token' }, { status: 401 });
    const { id: userId } = await userRes.json();

    if (request.method === 'POST') {
      const { badge_id } = await request.json();
      const badge = BADGE_CATALOG.find(b => b.id === badge_id);
      if (!badge) return Response.json({ error: 'Badge not found' }, { status: 404 });

      const checkRes = await fetch(
        `${env.SUPABASE_URL}/rest/v1/user_badges?user_id=eq.${userId}&badge_id=eq.${badge_id}&select=id`,
        { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
      );
      const existing = await checkRes.json();
      if (existing.length > 0) return Response.json({ message: 'Already earned', badge });

      await fetch(`${env.SUPABASE_URL}/rest/v1/user_badges`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, badge_id, earned_at: new Date().toISOString() }),
      });
      return Response.json({ success: true, badge, message: `Congratulations! You earned the ${badge.name} badge!` });
    }

    const earnedRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/user_badges?user_id=eq.${userId}&select=badge_id,earned_at`,
      { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
    );
    const earned = await earnedRes.json();
    const earnedMap = Object.fromEntries((earned || []).map(b => [b.badge_id, b.earned_at]));

    const badges = BADGE_CATALOG.map(b => ({
      ...b,
      earned: b.id in earnedMap,
      earned_at: earnedMap[b.id] || null,
    }));

    return Response.json({ badges, total: BADGE_CATALOG.length, earned_count: Object.keys(earnedMap).length });
  }
};
